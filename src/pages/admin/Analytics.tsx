import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CalendarDays } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsData {
  totalUsers: number;
  totalEvents: number;
  usersOverTime: { date: string; users: number }[];
  eventsOverTime: { date: string; events: number }[];
}

const chartConfig = {
  users: {
    label: 'Users',
    color: 'hsl(var(--primary))',
  },
  events: {
    label: 'Events',
    color: 'hsl(var(--accent))',
  },
};

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnalyticsData = async () => {
    setLoading(true);

    // Fetch total users
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      toast({
        title: 'Error fetching total users',
        description: usersError.message,
        variant: 'destructive',
      });
    }

    // Fetch total events
    const { count: totalEvents, error: eventsError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });

    if (eventsError) {
      toast({
        title: 'Error fetching total events',
        description: eventsError.message,
        variant: 'destructive',
      });
    }

    // --- Users Over Time (example: count users per day) ---
    // This is a simplified approach. In a real app, you'd likely have a dedicated
    // table for daily metrics or more complex SQL queries.
    const { data: userSignups, error: signupError } = await supabase
      .from('profiles')
      .select('created_at')
      .order('created_at', { ascending: true });

    let usersOverTime: { date: string; users: number }[] = [];
    if (userSignups && !signupError) {
      const dailyCounts = userSignups.reduce((acc, curr) => {
        if (!curr.created_at) return acc;
        const date = new Date(curr.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      let runningCount = 0;
      usersOverTime = Object.keys(dailyCounts).sort().map(date => {
        runningCount += dailyCounts[date];
        return { date, users: runningCount };
      });
    }


    // --- Events Over Time (example: count events created per day) ---
    const { data: eventCreations, error: eventCreationError } = await supabase
      .from('events')
      .select('created_at')
      .order('created_at', { ascending: true });

    let eventsOverTime: { date: string; events: number }[] = [];
    if (eventCreations && !eventCreationError) {
      const dailyCounts = eventCreations.reduce((acc, curr) => {
        if (!curr.created_at) return acc;
        const date = new Date(curr.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      let runningCount = 0;
      eventsOverTime = Object.keys(dailyCounts).sort().map(date => {
        runningCount += dailyCounts[date];
        return { date, events: runningCount };
      });
    }

    setAnalyticsData({
      totalUsers: totalUsers || 0,
      totalEvents: totalEvents || 0,
      usersOverTime: usersOverTime,
      eventsOverTime: eventsOverTime,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading || !analyticsData) {
    return <div className="container mx-auto py-8">Loading analytics...</div>;
  }

  // Merge and sort data for combined chart
  const combinedDataMap = new Map<string, { date: string; users?: number; events?: number }>();
  analyticsData.usersOverTime.forEach(item => combinedDataMap.set(item.date, { date: item.date, users: item.users }));
  analyticsData.eventsOverTime.forEach(item => {
    const existing = combinedDataMap.get(item.date);
    combinedDataMap.set(item.date, { ...existing, date: item.date, events: item.events });
  });

  const combinedChartData = Array.from(combinedDataMap.values()).sort((a, b) => a.date.localeCompare(b.date));


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalEvents}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Users and Events Growth Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={combinedChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
                  }}
                  minTickGap={30}
                />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="events"
                  stroke="hsl(var(--accent))"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
