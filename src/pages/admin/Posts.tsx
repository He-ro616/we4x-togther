import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Post, Profile } from '@/lib/supabase-types'; // Import Profile type
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Check, X, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

// Extend Post type to include author profile with email
interface PostWithAuthor extends Post {
  profiles: Pick<Profile, 'full_name' | 'email'> | null;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, 
          title, 
          content, 
          created_at, 
          is_published,
          author_id
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error fetching posts',
          description: error.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // If we have posts, fetch author profiles separately
      if (data && data.length > 0) {
        const authorIds = [...new Set(data.map(p => p.author_id).filter(Boolean))];
        
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', authorIds);

        const profileMap = new Map();
        (profiles || []).forEach(p => {
          profileMap.set(p.user_id, p);
        });

        const postsWithProfiles: PostWithAuthor[] = (data || []).map(post => ({
          ...post,
          profiles: profileMap.get(post.author_id) || null,
        }));

        setPosts(postsWithProfiles);
      } else {
        setPosts(data || []);
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleApprovePost = async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .update({ status: 'approved' })
      .eq('id', postId);

    if (error) {
      toast({
        title: 'Error approving post',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Post approved',
      description: 'The post has been approved.',
    });
    fetchPosts();
  };

  const handleDisapprovePost = async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .update({ status: 'rejected' })
      .eq('id', postId);

    if (error) {
      toast({
        title: 'Error disapproving post',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Post disapproved',
      description: 'The post has been disapproved.',
    });
    fetchPosts();
  };

  const handleDeletePost = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete post "${title}"? This action cannot be undone.`)) {
      return;
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      toast({
        title: 'Error deleting post',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Post deleted',
      description: `Post "${title}" has been deleted.`,
    });
    fetchPosts();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return <div className="container mx-auto pt-20">Loading posts...</div>;
  }

  return (
    <div className="container mx-auto pt-20">
      <h1 className="text-3xl font-bold mb-6">Content Management (Posts)</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    {post.profiles?.full_name || 'N/A'} {post.profiles?.email && `(${post.profiles.email})`}
                  </TableCell>
                  <TableCell>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(post.status)}>{post.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {post.status !== 'approved' && (
                          <DropdownMenuItem onClick={() => handleApprovePost(post.id)}>
                            <Check className="mr-2 h-4 w-4" /> Approve
                          </DropdownMenuItem>
                        )}
                        {post.status !== 'rejected' && (
                          <DropdownMenuItem onClick={() => handleDisapprovePost(post.id)}>
                            <X className="mr-2 h-4 w-4" /> Disapprove
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem disabled>
                          <Edit className="mr-2 h-4 w-4" /> Edit (Coming Soon)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeletePost(post.id, post.title)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
