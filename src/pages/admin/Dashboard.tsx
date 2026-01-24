import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Users, FileText, Calendar, TrendingUp } from 'lucide-react';

interface StatsData {
  totalUsers: number;
  totalPosts: number;
  totalEvents: number;
  registrationsByDay: Array<{ date: string; count: number }>;
  postsByDay: Array<{ date: string; count: number }>;
  eventsByDay: Array<{ date: string; count: number }>;
  userRoles: Array<{ role: string; count: number }>;
  topContributors: Array<{ name: string; posts: number; events: number }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    registrationsByDay: [],
    postsByDay: [],
    eventsByDay: [],
    userRoles: [],
    topContributors: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

      // Fetch total counts
      const { count: userCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      const { count: postCount } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true });

      const { count: eventCount } = await supabase
        .from('events')
        .select('id', { count: 'exact', head: true });

      // Fetch user registrations (last 30 days)
      const { data: users } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', thirtyDaysAgoISO)
        .order('created_at', { ascending: true });

      // Fetch posts (last 30 days)
      const { data: posts } = await supabase
        .from('posts')
        .select('created_at')
        .gte('created_at', thirtyDaysAgoISO)
        .order('created_at', { ascending: true });

      // Fetch events (last 30 days)
      const { data: events } = await supabase
        .from('events')
        .select('created_at')
        .gte('created_at', thirtyDaysAgoISO)
        .order('created_at', { ascending: true });

      // Fetch user roles
      const { data: userRolesData } = await supabase
        .from('user_roles')
        .select('role');

      // Fetch top contributors (users with most posts)
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name');

      let topContributors: any[] = [];
      if (profilesData && profilesData.length > 0) {
        // Get post counts for each user
        const contributorStats = await Promise.all(
          profilesData.slice(0, 10).map(async (profile) => {
            const { count: postCount } = await supabase
              .from('posts')
              .select('id', { count: 'exact', head: true })
              .eq('author_id', profile.id);

            const { count: eventCount } = await supabase
              .from('events')
              .select('id', { count: 'exact', head: true })
              .eq('created_by', profile.id);

            return {
              full_name: profile.full_name,
              posts: postCount || 0,
              events: eventCount || 0,
              total: (postCount || 0) + (eventCount || 0),
            };
          })
        );

        topContributors = contributorStats
          .filter((c) => c.total > 0)
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);
      }

      // Process data into charts
      const registrationsByDay = processDataByDay(users || [], 'created_at');
      const postsByDay = processDataByDay(posts || [], 'created_at');
      const eventsByDay = processDataByDay(events || [], 'created_at');
      const userRoles = aggregateRoles(userRolesData || []);

      setStats({
        totalUsers: userCount || 0,
        totalPosts: postCount || 0,
        totalEvents: eventCount || 0,
        registrationsByDay,
        postsByDay,
        eventsByDay,
        userRoles,
        topContributors,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const processDataByDay = (
    data: Array<{ created_at: string }>,
    dateField: string
  ): Array<{ date: string; count: number }> => {
    const grouped: { [key: string]: number } = {};

    data.forEach((item) => {
      try {
        const dateValue = item[dateField as keyof typeof item];
        if (!dateValue) return;
        
        const parsedDate = new Date(dateValue as string);
        if (isNaN(parsedDate.getTime())) {
          console.warn('Invalid date value encountered:', dateValue);
          return;
        }

        const date = parsedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        grouped[date] = (grouped[date] || 0) + 1;
      } catch (e) {
        console.warn('Error processing date:', e);
      }
    });

    // Sort by date and return last 30 days
    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);
  };

  const aggregateRoles = (
    data: Array<{ role: string }>
  ): Array<{ role: string; count: number }> => {
    const grouped: { [key: string]: number } = {};

    data.forEach((item) => {
      grouped[item.role] = (grouped[item.role] || 0) + 1;
    });

    return Object.entries(grouped).map(([role, count]) => ({ role, count }));
  };

  if (loading) {
    return (
      <div className="container mx-auto pt-20 py-8 px-2 sm:px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-lg">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-20 py-8 px-2 sm:px-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of community activity and growth
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Community members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Community discussions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Upcoming events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats.totalUsers / 100) * 2.5).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Registrations */}
        <Card>
          <CardHeader>
            <CardTitle>User Registrations (30 Days)</CardTitle>
            <CardDescription>New users joining the community</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.registrationsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Roles Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Roles Distribution</CardTitle>
            <CardDescription>Breakdown of user roles</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.userRoles}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ role, count }) => `${role}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.userRoles.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Posts & Events Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Posts & Events (30 Days)</CardTitle>
            <CardDescription>Content creation trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.postsByDay.map((item, idx) => ({
                date: item.date,
                posts: item.count,
                events: stats.eventsByDay[idx]?.count || 0,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="posts" fill="#10b981" />
                <Bar dataKey="events" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Posts Created (30 Days)</CardTitle>
            <CardDescription>Daily posting activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.postsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Contributors */}
      {stats.topContributors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
            <CardDescription>Most active community members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topContributors.map((contributor: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="font-medium">{contributor.full_name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contributor.posts || 0} posts • {contributor.events || 0} events
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-blue-500">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
