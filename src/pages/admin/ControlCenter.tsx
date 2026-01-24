import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Post, Event } from '@/lib/supabase-types';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MoreHorizontal,
  Trash,
  Download,
  Plus,
  Users,
  Calendar,
  FileText,
  Settings,
  MessageCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface EventWithParticipants extends Event {
  participant_count?: number;
}

export default function AdminControlCenter() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<EventWithParticipants[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [whatsappLinkInput, setWhatsappLinkInput] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    location_type: 'in-person' as 'in-person' | 'virtual' | 'hybrid',
    max_attendees: '',
  });
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch posts - NO relationships, just raw data
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, title, content, created_at, is_published')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(100);

      if (postsError) {
        console.error('Posts fetch error:', postsError);
        throw postsError;
      }

      // Fetch events - NO relationships, just raw data
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, title, description, event_date, location, location_type, max_attendees, is_published')
        .eq('is_published', true)
        .order('event_date', { ascending: false })
        .limit(100);

      if (eventsError) {
        console.error('Events fetch error:', eventsError);
        throw eventsError;
      }

      // Fetch WhatsApp link from settings
      const { data: settingsData } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'whatsapp_link')
        .single();

      if (settingsData?.value) {
        setWhatsappLink(settingsData.value);
        setWhatsappLinkInput(settingsData.value);
      }

      // Get participant counts for each event
      const eventsWithCount = await Promise.all(
        (eventsData || []).map(async (event: any) => {
          try {
            const { count } = await supabase
              .from('event_registrations')
              .select('id', { count: 'exact', head: true })
              .eq('event_id', event.id)
              .eq('status', 'registered');

            return {
              ...event,
              date: event.event_date,
              participant_count: count || 0,
            };
          } catch (err) {
            console.warn('Could not fetch count for event', event.id);
            return {
              ...event,
              date: event.event_date,
              participant_count: 0,
            };
          }
        })
      );

      setPosts(postsData || []);
      setEvents(eventsWithCount);
    } catch (error: any) {
      console.error('Data fetch error:', error);
      toast({
        title: 'Error fetching data',
        description: error.message || 'Failed to load admin data. Make sure you have the correct permissions.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeletePost = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete post "${title}"?`)) {
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
      title: 'Post deleted successfully',
      description: `"${title}" has been removed.`,
    });
    fetchData();
  };

  const handleDeleteEvent = async (eventId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete event "${title}"?`)) {
      return;
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      toast({
        title: 'Error deleting event',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Event deleted successfully',
      description: `"${title}" has been removed.`,
    });
    fetchData();
  };

  const handleCreateEvent = async () => {
    if (
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.date ||
      !newEvent.location
    ) {
      toast({
        title: 'Validation error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create an event',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.from('events').insert({
      title: newEvent.title,
      description: newEvent.description,
      event_date: newEvent.date, // Use event_date column name
      location: newEvent.location,
      location_type: newEvent.location_type,
      max_attendees: newEvent.max_attendees ? parseInt(newEvent.max_attendees) : null,
      created_by: sessionData.session.user.id, // Use created_by instead of author_id
      is_published: true,
    });

    if (error) {
      toast({
        title: 'Error creating event',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Event created successfully',
      description: `"${newEvent.title}" has been created and published.`,
    });

    setShowEventDialog(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      location: '',
      location_type: 'in-person',
      max_attendees: '',
    });
    fetchData();
  };

  const exportToGoogleSheets = async (dataType: 'posts' | 'events') => {
    try {
      const data = dataType === 'posts' ? posts : events;

      if (data.length === 0) {
        toast({
          title: 'No data to export',
          description: `There are no ${dataType} to export.`,
          variant: 'destructive',
        });
        return;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const sheetTitle = dataType === 'posts' ? 'Posts Report' : 'Events Report';
      const fileName = `${dataType}-report-${timestamp}`;

      // Convert to CSV format for Google Sheets
      const csvContent = convertToCSV(data, dataType);

      // Create a blob and download as CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export successful',
        description: `${sheetTitle} exported as CSV. You can import this into Google Sheets.`,
      });
    } catch (error: any) {
      toast({
        title: 'Export failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const convertToCSV = (data: any[], type: string): string => {
    if (type === 'posts') {
      const headers = ['ID', 'Title', 'Content', 'Author', 'Created Date', 'Status'];
      const rows = data.map((post) => [
        post.id,
        post.title,
        post.content?.substring(0, 50) || '',
        post.author_id || 'N/A',
        new Date(post.created_at).toLocaleDateString(),
        post.status || 'published',
      ]);

      return [
        headers.map((h) => `"${h}"`).join(','),
        ...rows.map((r) => r.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');
    } else {
      const headers = [
        'ID',
        'Title',
        'Description',
        'Date',
        'Location',
        'Location Type',
        'Participants',
        'Max Attendees',
        'Status',
      ];
      const rows = data.map((event: EventWithParticipants) => [
        event.id,
        event.title,
        event.description?.substring(0, 50) || '',
        new Date(event.date).toLocaleDateString(),
        event.location,
        event.location_type || 'N/A',
        event.participant_count || 0,
        event.max_attendees || 'Unlimited',
        event.status || 'published',
      ]);

      return [
        headers.map((h) => `"${h}"`).join(','),
        ...rows.map((r) => r.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');
    }
  };

  const saveWhatsappLink = async () => {
    if (!whatsappLinkInput.trim()) {
      toast({
        title: 'Error',
        description: 'WhatsApp link cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    setSavingSettings(true);
    try {
      // Try to update first
      const { data: existing } = await supabase
        .from('app_settings')
        .select('id')
        .eq('key', 'whatsapp_link')
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('app_settings')
          .update({ value: whatsappLinkInput })
          .eq('key', 'whatsapp_link');

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('app_settings')
          .insert({
            key: 'whatsapp_link',
            value: whatsappLinkInput,
            description: 'WhatsApp community group link',
          });

        if (error) throw error;
      }

      setWhatsappLink(whatsappLinkInput);
      toast({
        title: 'Success',
        description: 'WhatsApp link updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error saving settings',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto pt-20 py-4 sm:py-6 md:py-8 px-2">Loading control center...</div>;
  }

  return (
    <div className="container mx-auto pt-20 sm:pt-20 md:pt-20 py-4 sm:py-6 md:py-8 px-2 sm:px-4">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Admin Control Center</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Manage all content, events, and participants
        </p>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Posts</span>
            <span className="sm:hidden">P</span> ({posts.length})
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Events</span>
            <span className="sm:hidden">E</span> ({events.length})
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">S</span>
          </TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
            <h2 className="text-lg sm:text-2xl font-bold">Posts Management</h2>
            <Button
              onClick={() => exportToGoogleSheets('posts')}
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              Export to CSV
            </Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table className="text-xs sm:text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Title</TableHead>
                  <TableHead className="sm:hidden">Post</TableHead>
                  <TableHead className="hidden md:table-cell">Content Preview</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-xs sm:text-sm">
                      No posts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="hidden sm:table-cell font-medium max-w-xs truncate text-xs sm:text-sm">
                        {post.title}
                      </TableCell>
                      <TableCell className="sm:hidden font-medium max-w-xs truncate text-xs">
                        {post.title?.substring(0, 20)}...
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-sm truncate text-xs sm:text-sm">
                        {post.content?.substring(0, 30) || 'N/A'}...
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs sm:text-sm">
                        {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{post.status || 'published'}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-7 w-7 p-0 sm:h-8 sm:w-8">
                              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive text-xs sm:text-sm"
                              onClick={() => handleDeletePost(post.id, post.title)}
                            >
                              <Trash className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Delete
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
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
            <h2 className="text-lg sm:text-2xl font-bold">Events Management</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setShowEventDialog(true)}
                className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                Create Event
              </Button>
              <Button
                onClick={() => exportToGoogleSheets('events')}
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                Export to CSV
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table className="text-xs sm:text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Title</TableHead>
                  <TableHead className="sm:hidden">Event</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead className="text-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 inline" />
                  </TableHead>
                  <TableHead className="hidden xl:table-cell">Max</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-xs sm:text-sm">
                      No events found.
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="hidden sm:table-cell font-medium max-w-xs truncate text-xs sm:text-sm">
                        {event.title}
                      </TableCell>
                      <TableCell className="sm:hidden font-medium max-w-xs truncate text-xs">
                        {event.title?.substring(0, 15)}...
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                        {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell max-w-xs truncate text-xs sm:text-sm">
                        {event.location?.substring(0, 15)}...
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-xs">
                          {event.participant_count || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-xs sm:text-sm">
                        {event.max_attendees ? event.max_attendees : '∞'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{event.status || 'published'}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-7 w-7 p-0 sm:h-8 sm:w-8">
                              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive text-xs sm:text-sm"
                              onClick={() => handleDeleteEvent(event.id, event.title)}
                            >
                              <Trash className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Delete
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
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Community Settings</h2>

            {/* WhatsApp Community Link */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border p-4 sm:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">WhatsApp Community Link</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Add your WhatsApp community group link. This will appear on the home page for users to join.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="whatsapp-link" className="text-xs sm:text-sm">Community Link URL</Label>
                      <Input
                        id="whatsapp-link"
                        placeholder="https://chat.whatsapp.com/..."
                        value={whatsappLinkInput}
                        onChange={(e) => setWhatsappLinkInput(e.target.value)}
                        className="text-xs sm:text-sm mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Example: https://chat.whatsapp.com/AbCdEfGhIjK
                      </p>
                    </div>

                    {whatsappLink && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
                        <p className="text-xs sm:text-sm text-green-800 dark:text-green-400">
                          <strong>Current link:</strong> {whatsappLink}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={saveWhatsappLink}
                      disabled={savingSettings}
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      {savingSettings ? 'Saving...' : 'Save WhatsApp Link'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-md mx-2 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Create New Event</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Add a new event to the platform
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="title" className="text-xs sm:text-sm">Event Title *</Label>
              <Input
                id="title"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="text-xs sm:text-sm"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-xs sm:text-sm">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                className="text-xs sm:text-sm"
              />
            </div>

            <div>
              <Label htmlFor="date" className="text-xs sm:text-sm">Event Date *</Label>
              <Input
                id="date"
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
                className="text-xs sm:text-sm"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-xs sm:text-sm">Location *</Label>
              <Input
                id="location"
                placeholder="Enter event location"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
                className="text-xs sm:text-sm"
              />
            </div>

            <div>
              <Label htmlFor="locationType" className="text-xs sm:text-sm">Location Type</Label>
              <select
                id="locationType"
                value={newEvent.location_type}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    location_type: e.target.value as 'in-person' | 'virtual' | 'hybrid',
                  })
                }
                className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded-md bg-background"
              >
                <option value="in-person">In-Person</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <Label htmlFor="maxAttendees" className="text-xs sm:text-sm">Max Attendees (Optional)</Label>
              <Input
                id="maxAttendees"
                type="number"
                placeholder="Leave blank for unlimited"
                value={newEvent.max_attendees}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, max_attendees: e.target.value })
                }
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-3 flex-col-reverse sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowEventDialog(false)}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateEvent} className="w-full sm:w-auto text-xs sm:text-sm">Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
