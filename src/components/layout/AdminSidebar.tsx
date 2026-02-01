import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Rss, Settings, Sliders, FileText } from 'lucide-react';

export function AdminSidebar() {
  const adminNavLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/control-center', label: 'Control Center', icon: Sliders },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/posts', label: 'Posts', icon: Rss },
    { href: '/admin/google-forms', label: 'Google Forms', icon: FileText },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-full bg-background border-r border-border">
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-bold px-4 py-2 mb-4">Admin Menu</h2>
        {adminNavLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              to={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-accent text-foreground transition-colors"
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
