import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function PostCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      if (!title.trim() || !content.trim()) {
        throw new Error('Title and content are required');
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
          title,
          content,
          excerpt: excerpt || content.substring(0, 200),
          image_url: imageUrl || null,
          author_id: user.id,
          is_published: true,
          tags: tags.length > 0 ? tags : null,
          likes_count: 0,
          comments_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success('Post created successfully!');
      navigate(`/posts/${data.id}`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create post'
      );
    },
  });

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Sign in to create a post</h1>
          <Button asChild className="text-xs sm:text-sm">
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-4 sm:mb-6 text-xs sm:text-sm px-2 sm:px-4">
          <Link to="/posts" className="flex items-center gap-2">
            <ArrowLeft className="h-3 h-3 sm:h-4 sm:w-4" />
            Back to Posts
          </Link>
        </Button>

        <div className="max-w-2xl w-full">
          <Card className="gradient-border">
            <CardHeader className="space-y-2 pb-4 sm:pb-6 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-2xl sm:text-3xl">Create a New Post</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Share your thoughts, insights, and knowledge with the community
              </p>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6 pb-4 sm:pb-6 px-3 sm:px-6">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-xs sm:text-sm font-semibold">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="gradient-border text-xs sm:text-sm"
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <label htmlFor="excerpt" className="block text-xs sm:text-sm font-semibold">
                  Excerpt (optional)
                </label>
                <Input
                  id="excerpt"
                  placeholder="Brief summary of your post"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="gradient-border text-xs sm:text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  This will appear in post cards. If left empty, the first 200 characters of
                  content will be used.
                </p>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="block text-xs sm:text-sm font-semibold">
                  Image URL (optional)
                </label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  type="url"
                  className="gradient-border text-xs sm:text-sm"
                />
                {imageUrl && (
                  <div className="relative h-32 sm:h-40 rounded overflow-hidden border border-border">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => {
                        toast.error('Could not load image');
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label htmlFor="content" className="block text-xs sm:text-sm font-semibold">
                  Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="gradient-border resize-none font-mono text-xs sm:text-sm"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label htmlFor="tags" className="block text-xs sm:text-sm font-semibold">
                  Tags (optional)
                </label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="gradient-border text-xs sm:text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                    className="text-xs sm:text-sm"
                  >
                    Add
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-xs">
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive transition-colors"
                        >
                          <X className="h-2.5 h-2.5 sm:h-3 sm:w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
                <Button
                  asChild
                  variant="outline"
                  disabled={createPostMutation.isPending}
                  className="text-xs sm:text-sm"
                >
                  <Link to="/posts">Cancel</Link>
                </Button>
                <Button
                  onClick={() => createPostMutation.mutate()}
                  disabled={createPostMutation.isPending || !title.trim() || !content.trim()}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  {createPostMutation.isPending ? (
                    <>
                      <Loader2 className="h-3 h-3 sm:h-4 sm:w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Post'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
