import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Search, TrendingUp, ExternalLink } from 'lucide-react';

const trendingTopics = [
    { category: 'Technology', title: '#ReactJS', posts: '12.5K posts' },
    { category: 'Business', title: '#StartupLife', posts: '8.2K posts' },
    { category: 'Science', title: '#AI2026', posts: '25.1K posts' },
    { category: 'Sports', title: '#ChampionsLeague', posts: '45K posts' },
    { category: 'Entertainment', title: '#NewRelease', posts: '6.7K posts' },
];

export default function RightSidebar() {
    return (
        <aside className="sticky top-0 h-screen py-6 px-4 space-y-6">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id="search-input"
                    placeholder="Search Buzzer"
                    className="pl-10 h-11 rounded-full bg-muted/50 border-0 focus-visible:ring-primary/30"
                />
            </div>

            {/* Trending */}
            <div className="bg-muted/30 rounded-2xl overflow-hidden border border-border/50">
                <div className="p-4 pb-2">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Today's News
                    </h2>
                </div>
                <div>
                    {trendingTopics.map((topic, index) => (
                        <div key={index}>
                            <div className="px-4 py-3 hover:bg-accent/50 cursor-pointer transition-colors group">
                                <p className="text-xs text-muted-foreground">{topic.category} · Trending</p>
                                <p className="font-bold text-foreground group-hover:text-primary transition-colors">{topic.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{topic.posts}</p>
                            </div>
                            {index < trendingTopics.length - 1 && <Separator />}
                        </div>
                    ))}
                </div>
                <div className="p-4 pt-2">
                    <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                        Show more <ExternalLink className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-muted-foreground space-x-2 px-2">
                <span>Terms of Service</span>
                <span>·</span>
                <span>Privacy Policy</span>
                <span>·</span>
                <span>© 2026 Buzzer</span>
            </div>
        </aside>
    );
}
