import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Calendar, MapPin, Users, Clock, Link as LinkIcon, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type { Event, EventRegistration } from '@/lib/supabase-types';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isProcessingRegistration, setIsProcessingRegistration] = useState(false);

  const fetchEventDetails = async () => {
    if (!id) return;
    setLoading(true);
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (eventError) {
      toast({
        title: 'Error fetching event',
        description: eventError.message,
        variant: 'destructive',
      });
      navigate('/events'); // Redirect if event not found or error
      return;
    }
    setEvent(eventData);

    // Fetch registration count
    const { count, error: countError } = await supabase
      .from('event_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', id);

    if (countError) {
      toast({
        title: 'Error fetching registration count',
        description: countError.message,
        variant: 'destructive',
      });
    } else {
      setRegistrationCount(count || 0);
    }

    // Check if user is registered
    if (user) {
      const { data: registrationData, error: registrationError } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', id)
        .eq('user_id', user.id)
        .single();

      if (registrationError && registrationError.code !== 'PGRST116') { // PGRST116 means no rows found
        toast({
          title: 'Error checking registration status',
          description: registrationError.message,
          variant: 'destructive',
        });
      } else if (registrationData) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id, user]); // Re-fetch if user changes (e.g., logs in/out)

  const handleShare = async () => {
    if (!event) return;
    const shareUrl = window.location.href;
    const shareTitle = event.title;
    const shareText = `Check out this event: ${event.short_description}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast({
          title: 'Event shared!',
          description: 'The event link has been successfully shared.',
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast({
          title: 'Share failed',
          description: 'Could not share the event. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      // Fallback for browsers that do not support navigator.share
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: 'Link copied!',
          description: 'The event link has been copied to your clipboard.',
        });
      } catch (err) {
        console.error('Failed to copy: ', err);
        toast({
          title: 'Copy failed',
          description: 'Could not copy the link. Please try again manually.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleUnregister = async () => {
    if (!user || !event) return;

    if (!confirm('Are you sure you want to cancel your registration for this event?')) {
      return;
    }

    setIsProcessingRegistration(true);
    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', id)
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Error cancelling registration',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Registration cancelled',
        description: 'You have successfully cancelled your registration.',
      });
      setIsRegistered(false);
      setRegistrationCount((prev) => prev - 1);
    }
    setIsProcessingRegistration(false);
  };

  if (loading || authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground">The event you are looking for does not exist or has been removed.</p>
          <Button className="mt-6" onClick={() => navigate('/events')}>
            Back to Events
          </Button>
        </div>
      </Layout>
    );
  }

  const eventDate = event.event_date ? new Date(event.event_date) : null;
  const isUpcoming = eventDate ? eventDate > new Date() : false;
  const registrationOpen = isUpcoming && (!event.registration_deadline || (event.registration_deadline ? new Date() < new Date(event.registration_deadline) : false));
  const registrationFull = event.max_attendees && registrationCount >= event.max_attendees;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {event.image_url && (
            <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg h-64 md:h-96">
              <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              {event.title}
            </h1>
            <div className="flex items-center space-x-2">
              <Button onClick={handleShare} variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              {user?.id === event.created_by && (
                <Button onClick={() => navigate(`/dashboard/events/${event.id}/edit`)} variant="outline">
                  Edit Event
                </Button>
              )}
              {isRegistered ? (
                <Button onClick={handleUnregister} disabled={isProcessingRegistration} variant="outline">
                  {isProcessingRegistration ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Unregister
                </Button>
              ) : (
                <Button asChild disabled={!registrationOpen || registrationFull}>
                  <Link to={`/events/${event.id}/register`}>
                    {registrationFull ? 'Full' : (registrationOpen ? 'Register Now' : 'Registration Closed')}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <p className="text-muted-foreground text-lg mb-6">{event.short_description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>
                    {eventDate ? format(eventDate, 'PPP') : 'N/A'}
                    {event.end_date && ` - ${format(new Date(event.end_date), 'PPP')}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>
                    {eventDate ? format(eventDate, 'p') : 'N/A'}
                    {event.end_date && ` - ${format(new Date(event.end_date), 'p')}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{event.location} ({event.location_type})</span>
                </div>
                {event.meeting_link && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    <a href={event.meeting_link} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                      Join Meeting
                    </a>
                  </div>
                )}
                {event.venue_url && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    <a href={event.venue_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                      Venue Information
                    </a>
                  </div>
                )}
                {event.website && (
                    <div className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-primary" />
                        <a href={event.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                            Event Website
                        </a>
                    </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>
                    {registrationCount} registered
                    {event.max_attendees && ` / ${event.max_attendees} max`}
                  </span>
                </div>
                {event.registration_deadline && (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>Register by: {event.registration_deadline ? format(new Date(event.registration_deadline), 'PPP') : 'N/A'}</span>
                    </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
              </CardContent>
            </Card>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-base px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
