import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/ui/post-card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Post, Profile } from '@/lib/supabase-types';

export function RecentPosts() {
  const { data: postsWithAuthors, isLoading } = useQuery({
    queryKey: ['recent-posts'],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      
      // Fetch authors
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

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Community <span className="gradient-text">Posts</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              Insights, tutorials, and discussions from our members
            </p>
          </div>
          <Button variant="outline" asChild className="text-xs sm:text-sm">
            <Link to="/posts">
              View All Posts
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8 sm:py-12">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
          </div>
        ) : postsWithAuthors && postsWithAuthors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {postsWithAuthors.map(({ post, author }) => (
              <PostCard key={post.id} post={post} author={author} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">No posts yet</p>
            <Button asChild>
              <Link to="/dashboard/posts/new">Write the first post</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
