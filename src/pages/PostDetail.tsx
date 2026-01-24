import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Heart, MessageCircle, Trash2, Share2, Loader2, ArrowLeft, Calendar, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Post, Comment, Profile, PostLike } from '@/lib/supabase-types';
import { toast } from 'sonner';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentContent, setCommentContent] = useState('');
  const queryClient = useQueryClient();

  // Fetch post with author
  const { data: postData, isLoading: postLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', post.author_id)
        .single();

      return { post: post as Post, author: profile as Profile };
    },
  });

  // Fetch comments
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['post-comments', id],
    queryFn: async () => {
      const { data: allComments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userIds = [...new Set(allComments.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return allComments.map(comment => ({
        comment: comment as Comment,
        author: profileMap.get(comment.user_id) as Profile,
      }));
    },
  });

  // Fetch likes
  const { data: likes } = useQuery({
    queryKey: ['post-likes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', id);

      if (error) throw error;
      return data as PostLike[];
    },
  });

  const isUserLiked = likes?.some(like => like.user_id === user?.id);
  const isAuthor = postData?.post.author_id === user?.id;

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: id,
          user_id: user.id,
          content,
        });

      if (error) throw error;

      // Update comments count
      await supabase
        .from('posts')
        .update({ comments_count: (postData?.post.comments_count || 0) + 1 })
        .eq('id', id);
    },
    onSuccess: () => {
      setCommentContent('');
      queryClient.invalidateQueries({ queryKey: ['post-comments', id] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      toast.success('Comment added');
    },
    onError: (error) => {
      toast.error('Failed to add comment');
      console.error(error);
    },
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      if (isUserLiked) {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);

        if (error) throw error;

        await supabase
          .from('posts')
          .update({ likes_count: Math.max(0, (postData?.post.likes_count || 0) - 1) })
          .eq('id', id);
      } else {
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: id,
            user_id: user.id,
          });

        if (error) throw error;

        await supabase
          .from('posts')
          .update({ likes_count: (postData?.post.likes_count || 0) + 1 })
          .eq('id', id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-likes', id] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      await supabase
        .from('posts')
        .update({ comments_count: Math.max(0, (postData?.post.comments_count || 0) - 1) })
        .eq('id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', id] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      toast.success('Comment deleted');
    },
    onError: () => {
      toast.error('Failed to delete comment');
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Post deleted');
      navigate('/posts');
    },
    onError: () => {
      toast.error('Failed to delete post');
    },
  });

  // Share post
  const handleShare = async () => {
    if (!postData?.post) return;
    const shareUrl = window.location.href;
    const shareTitle = postData.post.title;
    const shareText = postData.post.excerpt || postData.post.content.substring(0, 100);

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success('Post shared!', {
          description: 'The post link has been successfully shared.',
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error('Share failed', {
          description: 'Could not share the post. Please try again.',
        });
      }
    } else {
      // Fallback for browsers that do not support navigator.share
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied!', {
          description: 'The post link has been copied to your clipboard.',
        });
      } catch (err) {
        console.error('Failed to copy: ', err);
        toast.error('Copy failed', {
          description: 'Could not copy the link. Please try again manually.',
        });
      }
    }
  };

  if (postLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12 sm:py-20">
          <Loader2 className="h-6 h-6 sm:h-8 sm:w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!postData) {
    return (
      <Layout>
        <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Post not found</h1>
          <Button asChild className="text-xs sm:text-sm">
            <Link to="/posts">Back to Posts</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const { post, author } = postData;

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

        {/* Main post */}
        <article className="max-w-3xl">
          <Card className="gradient-border mb-6 sm:mb-8">
            {post.image_url && (
              <div className="relative h-48 sm:h-80 md:h-96 overflow-hidden rounded-t-lg">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <CardHeader className="space-y-3 sm:space-y-4 pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
              {/* Author info */}
              <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Avatar className="h-8 sm:h-10 w-8 sm:w-10 border border-primary/30 flex-shrink-0">
                    <AvatarImage src={author?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {author?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs sm:text-sm truncate">{author?.full_name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-2.5 h-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                      <span className="truncate">{post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : 'N/A'}</span>
                    </p>
                  </div>
                </div>

                {isAuthor && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="text-xs sm:text-sm flex-shrink-0">
                        <Trash2 className="h-3 h-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Delete Post</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this post? This action cannot be undone.
                      </AlertDialogDescription>
                      <div className="flex justify-end gap-2">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deletePostMutation.mutate()}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6 pb-4 sm:pb-6 px-3 sm:px-6">
              {/* Title */}
              <div>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{post.title}</h1>
                {post.excerpt && (
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{post.excerpt}</p>
                )}
              </div>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-xs sm:text-sm md:text-base text-foreground leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col xs:flex-row gap-2 pt-4 border-t border-border">
                <Button
                  variant={isUserLiked ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => likePostMutation.mutate()}
                  disabled={!user || likePostMutation.isPending}
                  className="flex items-center gap-2 text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  <Heart className={`h-3 h-3 sm:h-4 sm:w-4 ${isUserLiked ? 'fill-current' : ''}`} />
                  <span>Like ({post.likes_count})</span>
                </Button>

                <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs sm:text-sm flex-1 sm:flex-none">
                  <MessageCircle className="h-3 h-3 sm:h-4 sm:w-4" />
                  <span>Comments ({post.comments_count})</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2 text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  <Share2 className="h-3 h-3 sm:h-4 sm:w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-2xl font-bold">Comments</h2>

            {/* Add comment form */}
            {user ? (
              <Card className="gradient-border">
                <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Avatar className="h-6 sm:h-8 w-6 sm:w-8 border border-primary/30 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {user.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="resize-none text-xs sm:text-sm"
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (commentContent.trim()) {
                        addCommentMutation.mutate(commentContent);
                      }
                    }}
                    disabled={!commentContent.trim() || addCommentMutation.isPending}
                    className="self-end text-xs sm:text-sm"
                  >
                    {addCommentMutation.isPending ? (
                      <>
                        <Loader2 className="h-3 h-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post Comment'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="gradient-border bg-muted/50">
                <CardContent className="pt-4 sm:pt-6 text-center py-6 sm:py-8 px-3 sm:px-6">
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                    Sign in to comment on this post
                  </p>
                  <Button asChild className="text-xs sm:text-sm">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Comments list */}
            {commentsLoading ? (
              <div className="flex justify-center py-6 sm:py-8">
                <Loader2 className="h-5 h-5 sm:h-6 sm:w-6 animate-spin text-primary" />
              </div>
            ) : comments && comments.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {comments.map(({ comment, author: commentAuthor }) => (
                  <Card key={comment.id} className="gradient-border">
                    <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Avatar className="h-6 sm:h-8 w-6 sm:w-8 border border-primary/30 mt-1 flex-shrink-0">
                          <AvatarImage src={commentAuthor?.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {commentAuthor?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-semibold text-xs sm:text-sm truncate">
                              {commentAuthor?.full_name || 'Anonymous'}
                            </p>
                            {user?.id === comment.user_id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteCommentMutation.mutate(comment.id)}
                                disabled={deleteCommentMutation.isPending}
                                className="h-5 h-5 sm:h-6 sm:w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                              >
                                <Trash2 className="h-2.5 h-2.5 sm:h-3 sm:w-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1 sm:mb-2">
                            {comment.created_at ? format(new Date(comment.created_at), 'MMM d, yyyy h:mm a') : 'N/A'}
                          </p>
                          <p className="text-xs sm:text-sm whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="gradient-border bg-muted/50">
                <CardContent className="pt-4 sm:pt-6 text-center py-6 sm:py-8 px-3 sm:px-6">
                  <MessageCircle className="h-6 h-6 sm:h-8 sm:w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-xs sm:text-sm">No comments yet. Be the first!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </article>
      </div>
    </Layout>
  );
}
