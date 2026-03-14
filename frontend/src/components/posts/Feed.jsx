import { useRef, useCallback, useEffect } from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { usePosts } from '../../hooks/usePosts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Loader2 } from 'lucide-react';

export default function Feed() {
    const { posts, loading, loadingMore, hasMore, createPost, toggleLike, deletePost, loadMore } = usePosts();

    // Infinite scroll sentinel
    const sentinelRef = useRef(null);
    const observerRef = useRef(null);

    const lastPostRef = useCallback(
        (node) => {
            if (loadingMore) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            }, { threshold: 0.5 });

            if (node) observerRef.current.observe(node);
        },
        [loadingMore, hasMore, loadMore]
    );

    return (
        <div>
            {/* Sticky Tab Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
                <Tabs defaultValue="foryou" className="w-full">
                    <TabsList className="w-full h-14 bg-transparent rounded-none p-0 border-0">
                        <TabsTrigger
                            value="foryou"
                            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold text-base"
                        >
                            For You
                        </TabsTrigger>
                        <TabsTrigger
                            value="following"
                            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold text-base"
                        >
                            Following
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Create Post */}
            <CreatePost onCreatePost={createPost} />

            {/* Posts Feed */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-16 px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">No posts yet</h3>
                    <p className="text-muted-foreground">Be the first to share something!</p>
                </div>
            ) : (
                <div>
                    {posts.map((post, index) => {
                        const isLast = index === posts.length - 1;
                        return (
                            <div key={post.id} ref={isLast ? lastPostRef : null}>
                                <PostCard
                                    post={post}
                                    onToggleLike={toggleLike}
                                    onDelete={deletePost}
                                />
                            </div>
                        );
                    })}

                    {/* Loading more indicator */}
                    {loadingMore && (
                        <div className="flex justify-center py-6">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    )}

                    {/* End of feed */}
                    {!hasMore && posts.length > 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            You've reached the end of the feed
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
