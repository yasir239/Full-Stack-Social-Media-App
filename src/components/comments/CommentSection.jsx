import { useState } from 'react';
import { useComments } from '../../hooks/useComments';
import CommentItem from './CommentItem';
import { useAuth } from '../../context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Loader2, Send } from 'lucide-react';

export default function CommentSection({ postId }) {
    const { comments, loading, addComment } = useComments(postId);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { profile } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            await addComment(newComment.trim());
            setNewComment('');
        } catch (err) {
            console.error('Error adding comment:', err);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Comment Input */}
            <form onSubmit={handleSubmit} className="flex items-start gap-2">
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs font-semibold">
                        {profile?.display_name?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 text-sm bg-muted/50 rounded-full px-4 py-2 border-0 outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/60"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        disabled={!newComment.trim() || submitting}
                        className="rounded-full h-8 w-8 text-primary hover:bg-primary/10"
                    >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </form>

            {/* Comments List */}
            {comments.length > 0 && (
                <div className="space-y-1">
                    {comments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} onReply={addComment} />
                    ))}
                </div>
            )}
        </div>
    );
}
