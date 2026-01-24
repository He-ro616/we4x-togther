import { useEffect, useState, useMemo } from 'react'; // Import useMemo
import { createClient } from '@supabase/supabase-js'; // Import createClient
import { supabase } from '@/integrations/supabase/client';
import { Profile, AppRole } from '@/lib/supabase-types';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Extend Profile type to include roles and email
interface UserWithRoles extends Profile {
  roles: AppRole[];
  email: string; // Now email will be fetched
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize a separate Supabase client for admin operations using the service_role key
  // WARNING: Exposing the service_role key on the client-side is a severe security risk.
  // This is for local development/testing only. For production, use a secure backend.
  const adminSupabase = useMemo(() => {
    // Ensure these environment variables are correctly set up
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing Supabase URL or Service Role Key for admin client.');
      toast({
        title: 'Configuration Error',
        description: 'Supabase URL or Service Role Key is missing for admin operations. Check your .env file.',
        variant: 'destructive',
      });
      return null;
    }
    return createClient(supabaseUrl, supabaseServiceRoleKey);
  }, [toast]);


  const fetchUsers = async () => {
    setLoading(true);
    if (!adminSupabase) { // Check if adminSupabase client was initialized
      setLoading(false);
      return;
    }

    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, username, full_name, avatar_url');

      if (profilesError) {
        toast({
          title: 'Error fetching profiles',
          description: profilesError.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Fetch roles separately (using standard supabase client, RLS should allow admin to read all roles)
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.warn('Error fetching roles:', rolesError);
      }

      // Combine profiles with roles and fetch emails
      const rolesMap = new Map();
      (rolesData || []).forEach((roleRecord: any) => {
        if (!rolesMap.has(roleRecord.user_id)) {
          rolesMap.set(roleRecord.user_id, []);
        }
        rolesMap.get(roleRecord.user_id).push(roleRecord.role);
      });

      const usersWithEmailsAndRoles: UserWithRoles[] = await Promise.all(
        (profiles || []).map(async (profile: any) => {
          let userEmail = '';
          try {
            // Fetch user details from auth.users to get the email using the adminSupabase client
            const { data: userData, error: userAuthError } = await adminSupabase.auth.admin.getUserById(profile.user_id);
            if (userAuthError) {
              console.warn(`Error fetching email for user ${profile.user_id}:`, userAuthError.message);
              // It's possible the user was deleted from auth.users but profile remains
              // or service role key isn't working for this specific user.
            } else if (userData?.user?.email) {
              userEmail = userData.user.email;
            }
          } catch (authErr) {
            console.error(`Unexpected error fetching auth user for ${profile.user_id}:`, authErr);
          }

          return {
            ...profile,
            roles: rolesMap.get(profile.user_id) || ['user'],
            email: userEmail,
          };
        })
      );

      setUsers(usersWithEmailsAndRoles);
    } catch (error: any) {
      toast({
        title: 'Error loading users',
        description: error.message || 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [adminSupabase]); // Re-run if adminSupabase client changes (e.g., due to env var change)

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    // For simplicity, we'll assume a user can only have one primary role for now.
    // In a more complex system, you might add/remove roles.
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      toast({
        title: 'Error updating role',
        description: deleteError.message,
        variant: 'destructive',
      });
      return;
    }

    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: newRole });

    if (insertError) {
      toast({
        title: 'Error updating role',
        description: insertError.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Role updated successfully',
      description: `User role changed to ${newRole}.`,
    });
    fetchUsers(); // Refresh the list
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      return;
    }

    if (!adminSupabase) { // Check if adminSupabase client is available
      toast({
        title: 'Error',
        description: 'Admin client not initialized. Cannot delete user.',
        variant: 'destructive',
      });
      return;
    }

    // Supabase RLS should handle cascade deletes for profiles and user_roles
    // when auth.users is deleted, but we'll manually delete roles first for safety.
    const { error: rolesError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (rolesError) {
      toast({
        title: 'Error deleting user roles',
        description: rolesError.message,
        variant: 'destructive',
      });
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (profileError) {
      toast({
        title: 'Error deleting user profile',
        description: profileError.message,
        variant: 'destructive',
      });
      return;
    }

    // This will delete the user from auth.users, and RLS should cascade
    // and delete from profiles. We use the adminSupabase client.
    const { error: authError } = await adminSupabase.auth.admin.deleteUser(userId);

    if (authError) {
      toast({
        title: 'Error deleting user from auth',
        description: authError.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'User deleted successfully',
      description: `User ${email} has been removed.`,
    });
    fetchUsers(); // Refresh the list
  };

  if (loading) {
    return <div className="container mx-auto py-8">Loading users...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="mr-1">
                        {role}
                      </Badge>
                    ))}
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
                        <DropdownMenuItem onClick={() => handleRoleChange(user.user_id, 'user')}>
                          Set as User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.user_id, 'moderator')}>
                          Set as Moderator
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.user_id, 'admin')}>
                          Set as Admin
                        </DropdownMenuItem>
                        <DropdownMenuContent />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteUser(user.user_id, user.email)}
                        >
                          Delete User
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


