import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { PostCard } from '@/components/ui/post-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, FileText, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Post, Profile } from '@/lib/supabase-types';

export default function Posts() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const { data: postsWithAuthors, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const authorIds = [...new Set(posts.map(p => p.author_id).filter(Boolean))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', authorIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      return posts.map(post => ({
        post: post as Post,
        author: post.author_id ? (profileMap.get(post.author_id) as Profile) : null
      }));
    }
  });

  const filtered = postsWithAuthors?.filter(({ post }) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              Community <span className="gradient-text">Posts</span>
            </h1>
            {user && (
              <Button asChild className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2 w-full sm:w-auto">
                <Link to="/posts/new">
                  <Plus className="h-3 h-3 sm:h-4 sm:w-4" />
                  <span>New Post</span>
                </Link>
              </Button>
            )}
          </div>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Insights, tutorials, and discussions from our members
          </p>
        </div>

        <div className="relative max-w-md mb-6 sm:mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 h-3 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-xs sm:text-sm"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12 sm:py-20">
            <Loader2 className="h-6 h-6 sm:h-8 sm:w-8 animate-spin text-primary" />
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filtered.map(({ post, author }) => (
              <PostCard key={post.id} post={post} author={author} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-20">
            <FileText className="h-12 h-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="font-display text-lg sm:text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">Be the first to share something</p>
            {user && (
              <Button asChild className="text-xs sm:text-sm">
                <Link to="/posts/new">Create a Post</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
