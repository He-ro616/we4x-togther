import { useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal, Plus, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface UserWithRoles extends Profile {
  roles: AppRole[];
  email: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'user' as AppRole,
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*');

      if (usersError) {
        console.error('Error fetching profiles:', usersError);
        toast({
          title: 'Error fetching users',
          description: usersError.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.warn('Error fetching roles:', rolesError);
      }

      const rolesMap = new Map();
      (rolesData || []).forEach((roleRecord: any) => {
        if (!rolesMap.has(roleRecord.user_id)) {
          rolesMap.set(roleRecord.user_id, []);
        }
        rolesMap.get(roleRecord.user_id).push(roleRecord.role);
      });

      const usersWithRoles: UserWithRoles[] = (users || []).map((profile: any) => ({
        ...profile,
        roles: rolesMap.get(profile.user_id) || ['user'],
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Unexpected error loading users:', error);
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

    const profilesChannel = supabase
      .channel('profiles-admin-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    const rolesChannel = supabase
      .channel('roles-admin-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_roles' },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      profilesChannel.unsubscribe();
      rolesChannel.unsubscribe();
    };
  }, []);

  const handleCreateUser = async () => {
    if (!newUserData.email || !newUserData.password || !newUserData.fullName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserData.email,
        password: newUserData.password,
        options: {
          data: { full_name: newUserData.fullName },
        },
      });

      if (authError) {
        toast({
          title: 'Error creating user',
          description: authError.message,
          variant: 'destructive',
        });
        setIsCreating(false);
        return;
      }

      if (!authData.user) {
        toast({
          title: 'Error',
          description: 'Failed to create user',
          variant: 'destructive',
        });
        setIsCreating(false);
        return;
      }

      // Update user role if not default 'user'
      if (newUserData.role !== 'user') {
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: newUserData.role })
          .eq('user_id', authData.user.id);

        if (roleError) {
          console.warn('Error setting role:', roleError);
        }
      }

      toast({
        title: 'User created successfully',
        description: `User ${newUserData.email} has been created.`,
      });

      setNewUserData({
        email: '',
        password: '',
        fullName: '',
        role: 'user',
      });
      setIsCreateDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
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
    fetchUsers();
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      return;
    }

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
        title: 'Error deleting user',
        description: profileError.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'User deleted successfully',
      description: `User ${email} has been removed.`,
    });
    fetchUsers();
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      // Prepare data
      const headers = ['Full Name', 'Email', 'Role', 'Created Date'];
      const rows = users.map((user) => [
        user.full_name || 'N/A',
        user.email || 'N/A',
        user.roles.join(', ') || 'user',
        user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
      ]);

      // Create CSV content
      let csv = headers.join(',') + '\n';
      rows.forEach((row) => {
        csv += row.map((cell) => `"${cell}"`).join(',') + '\n';
      });

      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export successful',
        description: `Exported ${users.length} users to CSV.`,
      });
    } catch (error: any) {
      toast({
        title: 'Export failed',
        description: error.message || 'Failed to export users',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">Loading users...</div>;
  }

  return (
    <div className="container mx-auto pt-20 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleExportExcel}
            disabled={isExporting || users.length === 0}
            variant="outline"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </>
            )}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>Add a new user to the system.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={newUserData.fullName}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, fullName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={newUserData.password}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, password: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUserData.role} onValueChange={(role) =>
                    setNewUserData({ ...newUserData, role: role as AppRole })
                  }>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateUser} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
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
                  <TableCell>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
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
                        {!user.roles.includes('admin') && (
                          <DropdownMenuItem onClick={() => handleRoleChange(user.user_id, 'admin')}>
                            Set as Admin
                          </DropdownMenuItem>
                        )}
                        {user.roles.includes('admin') && (
                          <DropdownMenuItem 
                            className="text-amber-600 focus:text-amber-600"
                            onClick={() => handleRoleChange(user.user_id, 'user')}
                          >
                            Remove as Admin
                          </DropdownMenuItem>
                        )}
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
