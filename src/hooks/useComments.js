import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useComments(postId) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchComments = useCallback(async () => {
        if (!postId) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('comments')
                .select(`
          *,
          profiles:user_id (id, username, display_name, avatar_url)
        `)
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Build threaded comments
            const topLevel = [];
            const repliesMap = {};

            data.forEach(comment => {
                const c = { ...comment, author: comment.profiles, replies: [] };
                if (comment.parent_id) {
                    if (!repliesMap[comment.parent_id]) repliesMap[comment.parent_id] = [];
                    repliesMap[comment.parent_id].push(c);
                } else {
                    topLevel.push(c);
                }
            });

            // Attach replies to parents
            topLevel.forEach(c => {
                c.replies = repliesMap[c.id] || [];
            });

            setComments(topLevel);
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    async function addComment(content, parentId = null) {
        if (!user) return;
        const { data, error } = await supabase
            .from('comments')
            .insert({
                user_id: user.id,
                post_id: postId,
                parent_id: parentId,
                content,
            })
            .select(`*, profiles:user_id (id, username, display_name, avatar_url)`)
            .single();

        if (error) throw error;

        // Atomically increment the comment count via RPC
        await supabase.rpc('increment_comment_count', { p_post_id: postId });

        const newComment = { ...data, author: data.profiles, replies: [] };

        if (parentId) {
            setComments(prev =>
                prev.map(c => {
                    if (c.id === parentId) {
                        return { ...c, replies: [...c.replies, newComment] };
                    }
                    return c;
                })
            );
        } else {
            setComments(prev => [...prev, newComment]);
        }

        return newComment;
    }

    return { comments, loading, fetchComments, addComment };
}
