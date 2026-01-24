import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'moderator' | 'user';
}

export function ProtectedRoute({ children, requiredRole = 'user' }: ProtectedRouteProps) {
  const { user, isAdmin, isModerator, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (requiredRole === 'admin' && !isAdmin) {
      navigate('/');
      return;
    }

    if (requiredRole === 'moderator' && !isModerator) {
      navigate('/');
      return;
    }
  }, [user, isAdmin, isModerator, requiredRole, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return null;
  }

  if (requiredRole === 'moderator' && !isModerator) {
    return null;
  }

  return <>{children}</>;
}

export function useRoleBasedNavigation() {
  const { user, isAdmin, profile } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return '/login';
    if (isAdmin) return '/admin';
    if (profile) return '/dashboard';
    return '/';
  };

  const canAccessAdmin = isAdmin;
  const canAccessModerator = isAdmin;

  return {
    getDefaultRoute,
    canAccessAdmin,
    canAccessModerator,
    userRole: isAdmin ? 'admin' : 'user',
  };
}
