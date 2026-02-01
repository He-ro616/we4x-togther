import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/lib/supabase-types';
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
import { MoreHorizontal, Check, X, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*');

    if (error) {
      toast({
        title: 'Error fetching events',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApproveEvent = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .update({ status: 'approved' })
      .eq('id', eventId);

    if (error) {
      toast({
        title: 'Error approving event',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Event approved',
      description: 'The event has been approved.',
    });
    fetchEvents();
  };

  const handleDisapproveEvent = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .update({ status: 'rejected' })
      .eq('id', eventId);

    if (error) {
      toast({
        title: 'Error disapproving event',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Event disapproved',
      description: 'The event has been disapproved.',
    });
    fetchEvents();
  };

  const handleDeleteEvent = async (eventId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete event "${title}"? This action cannot be undone.`)) {
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
      title: 'Event deleted',
      description: `Event "${title}" has been deleted.`,
    });
    fetchEvents();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return <div className="container mx-auto pt-20">Loading events...</div>;
  }

  return (
    <div className="container mx-auto pt-20">
      <h1 className="text-3xl font-bold mb-6">Event Management</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No events found.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(event.status)}>{event.status}</Badge>
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
                        {event.status !== 'approved' && (
                          <DropdownMenuItem onClick={() => handleApproveEvent(event.id)}>
                            <Check className="mr-2 h-4 w-4" /> Approve
                          </DropdownMenuItem>
                        )}
                        {event.status !== 'rejected' && (
                          <DropdownMenuItem onClick={() => handleDisapproveEvent(event.id)}>
                            <X className="mr-2 h-4 w-4" /> Disapprove
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem disabled>
                          <Edit className="mr-2 h-4 w-4" /> Edit (Coming Soon)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
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
