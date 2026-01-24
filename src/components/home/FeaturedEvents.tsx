import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/ui/event-card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Event } from '@/lib/supabase-types'; // Assuming Event type might need adjustment for registration_count

// Define a type for the event data including registration_count
interface EventWithRegistrationCount extends Event {
  registration_count: { count: number }[];
}

export function FeaturedEvents() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['featured-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, event_registrations(count)') // Select event details and registration count
        .eq('is_published', true)
        .gte('event_date', new Date().toISOString())
        .order('is_featured', { ascending: false })
        .order('event_date', { ascending: true })
        .limit(3);
      
      if (error) throw error;
      
      // Process data to extract the count and flatten the structure
      return data.map(event => ({
        ...event,
        registration_count: event.event_registrations[0]?.count || 0,
      })) as (Event & { registration_count: number })[];
    }
  });

  return (
    <section className="py-12 sm:py-16 md:py-20 surface-elevated">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Upcoming <span className="gradient-text">Events</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              Don't miss out on our latest workshops, meetups, and conferences
            </p>
          </div>
          <Button variant="outline" asChild className="text-xs sm:text-sm">
            <Link to="/events">
              View All Events
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8 sm:py-12">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} registrationCount={event.registration_count} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">No upcoming events yet</p>
            <Button asChild>
              <Link to="/dashboard/events/new">Create the first event</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
