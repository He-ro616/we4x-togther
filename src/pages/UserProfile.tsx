import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Github, Linkedin, Twitter, Globe } from 'lucide-react';
import { Profile } from '@/lib/supabase-types';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          toast({
            title: 'Profile not found',
            description: 'This user profile does not exist.',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }

        setProfile(data);

        // Fetch user roles
        const { data: rolesData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId);

        if (rolesData) {
          setRoles(rolesData.map((r: any) => r.role));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error loading profile',
          description: 'Failed to load user profile.',
          variant: 'destructive',
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate, toast]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">The user profile you're looking for doesn't exist.</p>
          <Button className="mt-6" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </Layout>
    );
  }

  const isOwnProfile = user?.id === userId;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar className="h-32 w-32 border-4 border-primary/50 mx-auto mb-4">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'User'} />
            <AvatarFallback className="bg-primary/20 text-primary text-6xl">
              {profile.full_name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>

          <h1 className="font-display text-4xl font-bold mb-2">{profile.full_name || 'Member'}</h1>
          
          {roles.length > 0 && (
            <div className="flex justify-center gap-2 mb-4">
              {roles.map((role) => (
                <Badge key={role} variant={role === 'admin' ? 'default' : 'secondary'}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Badge>
              ))}
            </div>
          )}

          {profile.location && <p className="text-muted-foreground">{profile.location}</p>}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="bg-card rounded-lg border p-6 mb-6">
            <p className="text-foreground whitespace-pre-wrap">{profile.bio}</p>
          </div>
        )}

        {/* Social Links */}
        {(profile.website || profile.github_url || profile.linkedin_url || profile.twitter_url) && (
          <div className="bg-card rounded-lg border p-6 mb-6">
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {profile.twitter_url && (
                <a
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </a>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isOwnProfile && (
          <div className="flex gap-3">
            <Button onClick={() => navigate('/profile')} className="w-full glow-primary">
              Edit Profile
            </Button>
          </div>
        )}

        {!isOwnProfile && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'recently'}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
