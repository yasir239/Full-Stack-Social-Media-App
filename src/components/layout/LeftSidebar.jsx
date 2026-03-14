import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationBell from '../notifications/NotificationBell';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, User, LogOut } from 'lucide-react';

export default function LeftSidebar() {
    const { user, profile, signOut } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Explore', path: '/explore' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    async function handleSignOut() {
        await signOut();
        navigate('/login');
    }

    return (
        <aside className="sticky top-0 h-screen flex flex-col justify-between py-6 px-4">
            {/* Logo */}
            <div>
                <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-foreground hidden lg:block">Buzzer</span>
                </Link>

                {/* Navigation */}
                <nav className="space-y-1">
                    {navItems.map(({ icon: Icon, label, path }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link key={path} to={path}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start gap-3 h-12 text-base font-medium transition-all duration-200 ${isActive
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="hidden lg:block">{label}</span>
                                </Button>
                            </Link>
                        );
                    })}

                    {/* Notification Bell */}
                    <NotificationBell
                        notifications={notifications}
                        unreadCount={unreadCount}
                        onMarkAsRead={markAsRead}
                        onMarkAllAsRead={markAllAsRead}
                    />
                </nav>

                <Separator className="my-4" />

                {/* Post Button */}
                <Button
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-base"
                    onClick={() => navigate('/')}
                >
                    <span className="hidden lg:block">Post</span>
                    <span className="lg:hidden text-xl">+</span>
                </Button>
            </div>

            {/* User Profile at bottom */}
            <div className="mt-auto">
                <div className="flex items-center gap-3 p-3 rounded-full hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/profile')}>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.display_name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                            {profile?.display_name?.charAt(0)?.toUpperCase() || '?'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{profile?.display_name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{profile?.username}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="flex text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); handleSignOut(); }}
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </aside>
    );
}
