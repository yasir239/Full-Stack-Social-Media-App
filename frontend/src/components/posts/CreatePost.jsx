import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Image, X, Loader2 } from 'lucide-react';

export default function CreatePost({ onCreatePost }) {
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const { profile } = useAuth();

    function handleImageSelect(e) {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }

    function removeImage() {
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    async function handleSubmit() {
        if (!content.trim() && !imageFile) return;
        setLoading(true);
        try {
            await onCreatePost(content.trim(), imageFile);
            setContent('');
            removeImage();
        } catch (err) {
            console.error('Error creating post:', err);
        } finally {
            setLoading(false);
        }
    }

    const charCount = content.length;
    const maxChars = 500;

    return (
        <div className="p-4 border-b border-border/50">
            <div className="flex gap-3">
                <Avatar className="h-11 w-11 shrink-0">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                        {profile?.display_name?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                    <Textarea
                        id="create-post-input"
                        placeholder="What's happening?"
                        value={content}
                        onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
                        className="border-0 bg-transparent text-xl placeholder:text-muted-foreground/60 placeholder:text-xl focus-visible:ring-0 min-h-[120px] p-3 resize-none leading-relaxed"
                        rows={3}
                    />

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="relative rounded-2xl overflow-hidden border border-border/50 group">
                            <img src={imagePreview} alt="Preview" className="w-full max-h-[300px] object-cover" />
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <div className="flex items-center gap-1">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                                id="post-image-upload"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-primary hover:bg-primary/10 rounded-full"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Image className="h-5 w-5" />
                            </Button>
                            {charCount > 0 && (
                                <span className={`text-xs font-medium ${charCount > maxChars * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                    {charCount}/{maxChars}
                                </span>
                            )}
                        </div>

                        <Button
                            id="submit-post"
                            onClick={handleSubmit}
                            disabled={loading || (!content.trim() && !imageFile)}
                            className="rounded-full px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
