import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { Event } from '@/lib/supabase-types';

export default function EventRegister() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setError('Event ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Event not found.');
        
        setEvent(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegistration = async () => {
    if (!user || !event) return;

    setIsSubmitting(true);
    try {
      const { error: regError } = await supabase.from('event_registrations').insert({
        event_id: event.id,
        user_id: user.id,
      });

      if (regError) {
        // Handle potential unique constraint violation (already registered)
        if (regError.code === '23505') {
          throw new Error('You are already registered for this event.');
        }
        throw regError;
      }

      toast({
        title: 'Registration Successful!',
        description: `You have successfully registered for "${event.title}".`,
        variant: 'success',
      });
      navigate(`/events/${event.id}`);

    } catch (err: any) {
      toast({
        title: 'Registration Failed',
        description: err.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading || authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">Could not load event</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => navigate('/events')} className="mt-6">Back to Events</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-display text-3xl">Confirm Your Registration</CardTitle>
            <CardDescription>You are registering for the event:</CardDescription>
            <h2 className="text-2xl font-semibold pt-2">{event?.title}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={profile?.full_name || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={user?.email || ''} disabled />
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Your name and email are based on your profile. You can edit this information in your profile settings.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleRegistration} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Confirming...' : 'Confirm Registration'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
