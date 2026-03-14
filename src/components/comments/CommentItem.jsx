import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Reply, Loader2, Send } from 'lucide-react';
import { formatDistanceToNow } from '../../lib/dateUtils';
import { useAuth } from '../../context/AuthContext';

export default function CommentItem({ comment, onReply }) {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { profile } = useAuth();

    async function handleReply(e) {
        e.preventDefault();
        if (!replyText.trim()) return;
        setSubmitting(true);
        try {
            await onReply(replyText.trim(), comment.id);
            setReplyText('');
            setShowReplyInput(false);
        } catch (err) {
            console.error('Error replying:', err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="pl-2">
            <div className="flex gap-2 py-2">
                <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src={comment.author?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-cyan-500 text-white text-xs font-semibold">
                        {comment.author?.display_name?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="bg-muted/40 rounded-2xl px-3 py-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">{comment.author?.display_name}</span>
                            <span className="text-xs text-muted-foreground">{formatDistanceToNow(comment.created_at)}</span>
                        </div>
                        <p className="text-sm text-foreground/90 mt-0.5 break-words">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-3 mt-1 ml-2">
                        <button
                            onClick={() => setShowReplyInput(!showReplyInput)}
                            className="text-xs text-muted-foreground hover:text-primary font-medium flex items-center gap-1 transition-colors"
                        >
                            <Reply className="h-3 w-3" />
                            Reply
                        </button>
                    </div>

                    {/* Reply Input */}
                    {showReplyInput && (
                        <form onSubmit={handleReply} className="flex items-center gap-2 mt-2 ml-2">
                            <Avatar className="h-6 w-6 shrink-0">
                                <AvatarImage src={profile?.avatar_url} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-[10px] font-semibold">
                                    {profile?.display_name?.charAt(0)?.toUpperCase() || '?'}
                                </AvatarFallback>
                            </Avatar>
                            <input
                                type="text"
                                placeholder={`Reply to ${comment.author?.display_name}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="flex-1 text-xs bg-muted/50 rounded-full px-3 py-1.5 border-0 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                autoFocus
                            />
                            <Button type="submit" size="icon" variant="ghost" disabled={!replyText.trim() || submitting} className="rounded-full h-6 w-6 text-primary hover:bg-primary/10">
                                {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                            </Button>
                        </form>
                    )}

                    {/* Nested Replies */}
                    {comment.replies?.length > 0 && (
                        <div className="ml-4 mt-1 border-l-2 border-border/30 pl-2">
                            {comment.replies.map(reply => (
                                <CommentItem key={reply.id} comment={reply} onReply={onReply} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
