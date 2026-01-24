import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Users, Plus, Loader2, Download, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


export default function Dashboard() {
  const { user, profile, isLoading: authLoading, isAdmin } = useAuth();
  const [exportingExcel, setExportingExcel] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      const [events, posts, registrations] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact' }).eq('created_by', user!.id),
        supabase.from('posts').select('id', { count: 'exact' }).eq('author_id', user!.id),
        supabase.from('event_registrations').select('id', { count: 'exact' }).eq('user_id', user!.id),
      ]);
      return {
        eventsCreated: events.count || 0,
        postsCreated: posts.count || 0,
        eventsRegistered: registrations.count || 0,
      };
    },
    enabled: !!user,
  });

  const { data: eventRegistrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ['event-registrations-rpc', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }
      
      const { data, error } = await supabase.rpc('get_dashboard_registrations');

      if (error) {
        console.error('Error fetching registrations via rpc:', error);
        return [];
      }
      
      console.log('Enriched registrations via rpc:', data);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const groupedRegistrations = useMemo(() => {
    if (!eventRegistrations) return [];

    const grouped = eventRegistrations.reduce((acc, reg) => {
      const eventId = reg.event_id;
      if (!acc[eventId]) {
        acc[eventId] = {
          eventDetails: reg.events,
          registrations: []
        };
      }
      acc[eventId].registrations.push(reg);
      return acc;
    }, {} as any);

    return Object.values(grouped).filter((g: any) => g.eventDetails && g.eventDetails.id);
  }, [eventRegistrations]);

  const exportRegistrationsToExcel = async (
    registrationsToExport: any[],
    fileName: string = 'All_Registrations'
  ) => {
    if (!registrationsToExport || registrationsToExport.length === 0) {
      alert('No registration data to export');
      return;
    }

    setExportingExcel(true);
    try {
      const headers = ['Event Title', 'Event Date', 'Location', 'Registered User', 'User Email', 'Registration Date'];
      const rows = registrationsToExport.map((reg: any) => [
        reg.events?.title || 'N/A',
        reg.events?.event_date ? new Date(reg.events.event_date).toLocaleDateString() : 'N/A',
        reg.events?.location || 'N/A',
        reg.profiles?.full_name || 'N/A',
        reg.profiles?.email || 'N/A',
        new Date(reg.registered_at).toLocaleDateString(), // Use registered_at from RPC
      ]);

      const csvContent = [
        headers.map(h => `"${h}"`).join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: 'Export Successful',
        description: `"${fileName}" data exported to Excel.`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export data to Excel.',
        variant: 'destructive',
      });
    } finally {
      setExportingExcel(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }


  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{profile?.full_name || 'Member'}</span>!
          </h1>
          <p className="text-muted-foreground">Manage your events, posts, and community activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="gradient-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Events Created</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.eventsCreated || 0}</div>
            </CardContent>
          </Card>
          <Card className="gradient-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Posts Written</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.postsCreated || 0}</div>
            </CardContent>
          </Card>
          <Card className="gradient-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Events Registered</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.eventsRegistered || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle className="font-display">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link to="/dashboard/events/new">
                  <Plus className="mr-2 h-4 w-4" /> Create New Event
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dashboard/posts/new">
                  <Plus className="mr-2 h-4 w-4" /> Write New Post
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/profile">
                  <Users className="mr-2 h-4 w-4" /> Edit Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* EVENT REGISTRATIONS SECTION - ALWAYS SHOW */}
        <Card className="gradient-border mt-8">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="font-display text-xl sm:text-2xl">Event Registrations</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {isAdmin
                    ? 'All registrations across all events'
                    : 'All registrations for events you created'}
                </CardDescription>
              </div>
              <Button 
                onClick={() => exportRegistrationsToExcel(eventRegistrations, 'All_Registrations')}
                disabled={exportingExcel || !eventRegistrations || eventRegistrations.length === 0}
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                {exportingExcel ? 'Exporting...' : 'Export to Excel'}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Loading State */}
            {registrationsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading registrations...</p>
              </div>
            ) : !eventRegistrations || eventRegistrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium text-sm mb-2">No registrations yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    {stats?.eventsCreated === 0 
                      ? "Create an event first, then users can register for it."
                      : "Once users register for your events, their registrations will appear here."
                    }
                  </p>
                </div>
                {stats?.eventsCreated === 0 && (
                  <Button asChild size="sm" className="mt-4">
                    <Link to="/dashboard/events/new">
                      <Plus className="mr-2 h-4 w-4" /> Create Your First Event
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Accordion type="single" collapsible className="w-full">
                  {groupedRegistrations.map(({ eventDetails, registrations }: any) => (
                    <AccordionItem value={`event-${eventDetails.id}`} key={eventDetails.id}>
                      <AccordionTrigger>
                        <div className="flex justify-between items-center w-full pr-4">
                          <div className="text-left">
                            <div className="font-semibold">{eventDetails.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(eventDetails.event_date).toLocaleDateString()} - {eventDetails.location}
                            </div>
                          </div>
                          <Badge variant="outline">{registrations.length} registrations</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Table className="text-xs sm:text-sm bg-muted/20">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Registered User</TableHead>
                              <TableHead className="hidden sm:table-cell">Email</TableHead>
                              <TableHead className="text-right">Registered On</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {registrations.map((reg: any) => (
                              <TableRow key={reg.id}>
                                <TableCell className="font-medium">
                                  {reg.profiles?.full_name || 'Unknown User'}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  {reg.profiles?.email || 'No email'}
                                </TableCell>
                                <TableCell className="text-right">
                                  {reg.registered_at
                                    ? new Date(reg.registered_at).toLocaleDateString()
                                    : 'N/A'
                                  }
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="flex justify-end mt-4">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => exportRegistrationsToExcel(registrations, eventDetails.title)}
                                disabled={exportingExcel}
                            >
                                <Download className="mr-2 h-4 w-4" /> Export This Event
                            </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
