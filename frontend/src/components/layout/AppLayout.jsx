import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr] lg:grid-cols-[260px_1fr_320px]">
                {/* Left Sidebar */}
                <div className="hidden md:block border-r border-border/50">
                    <LeftSidebar />
                </div>

                {/* Main Content */}
                <main className="min-h-screen border-r border-border/50">
                    <Outlet />
                </main>

                {/* Right Sidebar - hidden on smaller screens */}
                <div className="hidden lg:block">
                    <RightSidebar />
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <MobileNav />
        </div>
    );
}

function MobileNav() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50 z-50">
            <div className="flex items-center justify-around py-2">
                <a href="/" className="p-3 text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </a>
                <a href="/explore" className="p-3 text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </a>
                <a href="/profile" className="p-3 text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </a>
            </div>
        </nav>
    );
}
