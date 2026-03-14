import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import NotificationList from './NotificationList';

export default function NotificationBell({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent relative transition-all duration-200"
                >
                    <div className="relative">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse shadow-md">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>
                    <span className="hidden lg:block">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-96 p-0 rounded-2xl border border-border/50 shadow-xl"
                align="start"
                sideOffset={8}
            >
                <NotificationList
                    notifications={notifications}
                    onMarkAsRead={onMarkAsRead}
                    onMarkAllAsRead={onMarkAllAsRead}
                />
            </PopoverContent>
        </Popover>
    );
}
