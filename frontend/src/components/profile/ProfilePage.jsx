import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { usePosts } from '../../hooks/usePosts';
import PostCard from '../posts/PostCard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Camera, Edit3, Loader2, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { user, profile, updateProfile } = useAuth();
    const { posts, toggleLike, deletePost } = usePosts();
    const [editing, setEditing] = useState(false);
    const [displayName, setDisplayName] = useState(profile?.display_name || '');
    const [bio, setBio] = useState(profile?.bio || '');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const userPosts = posts.filter(p => p.author?.id === user?.id);

    async function handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingAvatar(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/avatar.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            await updateProfile({ avatar_url: urlData.publicUrl + '?t=' + Date.now() });
        } catch (err) {
            console.error('Error uploading avatar:', err);
        } finally {
            setUploadingAvatar(false);
        }
    }

    async function handleSaveProfile() {
        setSaving(true);
        try {
            await updateProfile({ display_name: displayName, bio });
            setEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-3 flex items-center gap-4 border-b border-border/50">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="font-bold text-lg text-foreground">{profile?.display_name}</h1>
                    <p className="text-xs text-muted-foreground">{userPosts.length} posts</p>
                </div>
            </div>

            {/* Cover / Banner */}
            <div className="h-48 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 relative">
                <div className="absolute -bottom-16 left-4">
                    <div className="relative group">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                            <AvatarImage src={profile?.avatar_url} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                                {profile?.display_name?.charAt(0)?.toUpperCase() || '?'}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            {uploadingAvatar ? (
                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                            ) : (
                                <Camera className="h-6 w-6 text-white" />
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div className="pt-20 px-4 pb-4">
                <div className="flex justify-end mb-4">
                    <Dialog open={editing} onOpenChange={setEditing}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="rounded-full font-bold hover:bg-accent"
                                onClick={() => {
                                    setDisplayName(profile?.display_name || '');
                                    setBio(profile?.bio || '');
                                }}
                            >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-2xl">
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Display Name</label>
                                    <Input
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Bio</label>
                                    <Textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us about yourself"
                                        rows={3}
                                    />
                                </div>
                                <Button
                                    className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold"
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <h2 className="text-xl font-bold text-foreground">{profile?.display_name}</h2>
                <p className="text-muted-foreground">@{profile?.username}</p>
                {profile?.bio && <p className="mt-2 text-foreground text-sm">{profile.bio}</p>}

                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>

            <Separator />

            {/* User's Posts */}
            <div>
                {userPosts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No posts yet</p>
                    </div>
                ) : (
                    userPosts.map(post => (
                        <PostCard key={post.id} post={post} onToggleLike={toggleLike} onDelete={deletePost} />
                    ))
                )}
            </div>
        </div>
    );
}
