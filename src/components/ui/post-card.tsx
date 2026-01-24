import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import type { Post, Profile } from '@/lib/supabase-types';

interface PostCardProps {
  post: Post;
  author?: Profile | null;
}

export function PostCard({ post, author }: PostCardProps) {
  return (
    <Link to={`/posts/${post.id}`}>
      <Card className="group overflow-hidden gradient-border hover:glow-primary transition-all duration-300 h-full">
        {post.image_url && (
          <div className="relative h-32 sm:h-40 overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          </div>
        )}

        <CardContent className={`p-3 sm:p-4 space-y-2 sm:space-y-3 ${!post.image_url ? 'pt-4 sm:pt-6' : ''}`}>
          {/* Author */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="h-6 sm:h-8 w-6 sm:w-8 border border-primary/30 flex-shrink-0">
              <AvatarImage src={author?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {author?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium truncate">{author?.full_name || 'Anonymous'}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-2.5 h-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                <span className="truncate">{post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : 'N/A'}</span>
              </p>
            </div>
          </div>

          <h3 className="font-display font-semibold text-sm sm:text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          {post.excerpt && (
            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-3 h-3 sm:h-4 sm:w-4" />
              <span>{post.likes_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 h-3 sm:h-4 sm:w-4" />
              <span>{post.comments_count}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
