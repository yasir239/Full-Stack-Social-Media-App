import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Heart, MessageCircle, Reply, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from '../../lib/dateUtils';

const typeConfig = {
    like: { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'liked your post' },
    comment: { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'commented on your post' },
    reply: { icon: Reply, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'replied to your comment' },
};

export default function NotificationList({ notifications, onMarkAsRead, onMarkAllAsRead }) {
    if (!notifications || notifications.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                    <CheckCheck className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between px-4 py-3">
                <h3 className="font-bold text-foreground">Notifications</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10"
                    onClick={onMarkAllAsRead}
                >
                    Mark all as read
                </Button>
            </div>
            <Separator />
            <ScrollArea className="h-[400px]">
                {notifications.map((notification) => {
                    const config = typeConfig[notification.type] || typeConfig.like;
                    const Icon = config.icon;

                    return (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-3 px-4 py-3 hover:bg-accent/50 cursor-pointer transition-colors ${!notification.is_read ? 'bg-primary/5' : ''
                                }`}
                            onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
                        >
                            <Avatar className="h-9 w-9 shrink-0">
                                <AvatarImage src={notification.actor?.avatar_url} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs font-semibold">
                                    {notification.actor?.display_name?.charAt(0)?.toUpperCase() || '?'}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm">
                                    <span className="font-semibold text-foreground">{notification.actor?.display_name}</span>{' '}
                                    <span className="text-muted-foreground">{config.label}</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {formatDistanceToNow(notification.created_at)}
                                </p>
                            </div>

                            <div className={`p-1.5 rounded-full ${config.bg} shrink-0`}>
                                <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                            </div>

                            {!notification.is_read && (
                                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                            )}
                        </div>
                    );
                })}
            </ScrollArea>
        </div>
    );
}
