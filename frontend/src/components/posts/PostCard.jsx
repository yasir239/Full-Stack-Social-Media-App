import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import CommentSection from '../comments/CommentSection';
import { Heart, MessageCircle, Trash2, Share } from 'lucide-react';
import { formatDistanceToNow } from '../../lib/dateUtils';

export default function PostCard({ post, onToggleLike, onDelete }) {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);

    const isOwner = user?.id === post.author?.id;

    return (
        <article className="p-4 border-b border-border/50 hover:bg-accent/30 transition-colors duration-200">
            <div className="flex gap-3">
                <Avatar className="h-11 w-11 shrink-0">
                    <AvatarImage src={post.author?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold text-sm">
                        {post.author?.display_name?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground text-sm hover:underline cursor-pointer">
                            {post.author?.display_name}
                        </span>
                        <span className="text-muted-foreground text-sm">@{post.author?.username}</span>
                        <span className="text-muted-foreground text-sm">·</span>
                        <span className="text-muted-foreground text-sm hover:underline cursor-pointer">
                            {formatDistanceToNow(post.created_at)}
                        </span>
                        {isOwner && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                                onClick={() => onDelete(post.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Content */}
                    {post.content && (
                        <p className="mt-1 text-foreground text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                            {post.content}
                        </p>
                    )}

                    {/* Image */}
                    {post.image_url && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-border/50">
                            <img
                                src={post.image_url}
                                alt="Post image"
                                className="w-full max-h-[500px] object-cover"
                                loading="lazy"
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6 mt-3 -ml-2">
                        {/* Comment */}
                        <button
                            className="group flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setShowComments(!showComments)}
                        >
                            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                <MessageCircle className="h-[18px] w-[18px]" />
                            </div>
                            <span className="text-sm">{post.comment_count || 0}</span>
                        </button>

                        {/* Like */}
                        <button
                            className={`group flex items-center gap-1.5 transition-colors ${post.isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
                                }`}
                            onClick={() => onToggleLike(post.id)}
                        >
                            <div className={`p-2 rounded-full transition-colors ${post.isLiked ? 'bg-rose-500/10' : 'group-hover:bg-rose-500/10'}`}>
                                <Heart className={`h-[18px] w-[18px] transition-all duration-200 ${post.isLiked ? 'fill-current scale-110' : ''}`} />
                            </div>
                            <span className="text-sm">{post.likesCount || 0}</span>
                        </button>

                        {/* Share */}
                        <button className="group flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                <Share className="h-[18px] w-[18px]" />
                            </div>
                        </button>
                    </div>

                    {/* Comments Section */}
                    {showComments && (
                        <div className="mt-3 border-t border-border/30 pt-3">
                            <CommentSection postId={post.id} />
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
