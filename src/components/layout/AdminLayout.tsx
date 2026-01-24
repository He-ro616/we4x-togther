import { ReactNode, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AdminSidebar } from './AdminSidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children?: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAdmin, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return <div>Loading admin panel...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Mobile Admin Menu Button - VISIBLE ON ALL MOBILE SCREENS */}
      <div className="lg:hidden block bg-background border-b border-border p-3 fixed top-16 left-0 right-0 z-40">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full bg-primary hover:bg-primary/90 text-white"
          size="sm"
        >
          {sidebarOpen ? (
            <>
              <X className="h-5 w-5 mr-2" />
              Close Admin Menu
            </>
          ) : (
            <>
              <Menu className="h-5 w-5 mr-2" />
              Open Admin Menu
            </>
          )}
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-0 lg:pt-0 relative">
        {/* Mobile Sidebar - Full screen on mobile when open */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 top-28 left-0 right-0 z-30 bg-background border-b border-border overflow-y-auto">
            <AdminSidebar />
          </div>
        )}

        {/* Desktop Sidebar - Always visible on desktop */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Content */}
        <main className="flex-1 p-2 sm:p-4 md:p-6 w-full overflow-x-hidden pt-16 lg:pt-0">
          {children || <Outlet />}
        </main>
      </div>
      <Footer />
    </div>
  );
}