import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 10;

export function usePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();
    const pageRef = useRef(0);

    const fetchPosts = useCallback(async (reset = true) => {
        try {
            if (reset) {
                setLoading(true);
                pageRef.current = 0;
            } else {
                setLoadingMore(true);
            }

            const from = pageRef.current * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            const { data, error } = await supabase
                .from('posts')
                .select(`
          *,
          profiles:user_id (id, username, display_name, avatar_url),
          likes (id, user_id)
        `)
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            const postsWithMeta = data.map(post => ({
                ...post,
                author: post.profiles,
                likesCount: post.likes_count,
                isLiked: user ? post.likes?.some(l => l.user_id === user.id) : false,
                userLikeId: user ? post.likes?.find(l => l.user_id === user.id)?.id : null,
            }));

            if (reset) {
                setPosts(postsWithMeta);
            } else {
                setPosts(prev => [...prev, ...postsWithMeta]);
            }

            setHasMore(data.length === PAGE_SIZE);
            pageRef.current += 1;
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPosts(true);
    }, [fetchPosts]);

    function loadMore() {
        if (!loadingMore && hasMore) {
            fetchPosts(false);
        }
    }

    async function createPost(content, imageFile) {
        let imageUrl = '';

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('post-images')
                .upload(fileName, imageFile);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('post-images')
                .getPublicUrl(fileName);

            imageUrl = urlData.publicUrl;
        }

        const { data, error } = await supabase
            .from('posts')
            .insert({ user_id: user.id, content, image_url: imageUrl })
            .select(`
        *,
        profiles:user_id (id, username, display_name, avatar_url)
      `)
            .single();

        if (error) throw error;

        const newPost = {
            ...data,
            author: data.profiles,
            likes: [],
            likesCount: 0,
            isLiked: false,
            userLikeId: null,
        };

        setPosts(prev => [newPost, ...prev]);
        return newPost;
    }

    async function toggleLike(postId) {
        if (!user) return;

        const post = posts.find(p => p.id === postId);
        if (!post) return;

        // Optimistic update
        setPosts(prev =>
            prev.map(p => {
                if (p.id !== postId) return p;
                if (p.isLiked) {
                    return { ...p, isLiked: false, likesCount: p.likesCount - 1, userLikeId: null };
                } else {
                    return { ...p, isLiked: true, likesCount: p.likesCount + 1, userLikeId: 'temp' };
                }
            })
        );

        try {
            if (post.isLiked) {
                // Unlike via atomic RPC
                const { error } = await supabase.rpc('unlike_post', { p_post_id: postId });
                if (error) throw error;
            } else {
                // Like via atomic RPC
                const { error } = await supabase.rpc('like_post', { p_post_id: postId });
                if (error) throw error;

                // Fetch the real like ID for potential future unlike
                const { data: likeData } = await supabase
                    .from('likes')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('post_id', postId)
                    .single();

                if (likeData) {
                    setPosts(prev =>
                        prev.map(p => p.id === postId ? { ...p, userLikeId: likeData.id } : p)
                    );
                }
            }
        } catch (err) {
            // Rollback on error
            console.error('Error toggling like:', err);
            setPosts(prev =>
                prev.map(p => {
                    if (p.id !== postId) return p;
                    if (post.isLiked) {
                        return { ...p, isLiked: true, likesCount: p.likesCount + 1, userLikeId: post.userLikeId };
                    } else {
                        return { ...p, isLiked: false, likesCount: p.likesCount - 1, userLikeId: null };
                    }
                })
            );
        }
    }

    async function deletePost(postId) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (error) {
            console.error('Error deleting post:', error);
            fetchPosts(true); // refetch on failure
        }
    }

    return { posts, loading, loadingMore, hasMore, fetchPosts, loadMore, createPost, toggleLike, deletePost };
}
