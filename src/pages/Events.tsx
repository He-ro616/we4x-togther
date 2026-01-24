import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { EventCard } from '@/components/ui/event-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Calendar, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Event } from '@/lib/supabase-types';

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [registrationCounts, setRegistrationCounts] = useState<{ [key: string]: number }>({});

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', filter],
    queryFn: async () => {
      let query = supabase.from('events').select('*').eq('is_published', true);
      
      if (filter === 'upcoming') {
        query = query.gte('event_date', new Date().toISOString());
      } else if (filter === 'past') {
        query = query.lt('event_date', new Date().toISOString());
      }
      
      const { data, error } = await query.order('event_date', { ascending: filter !== 'past' });
      if (error) throw error;
      return data as Event[];
    }
  });

  // Fetch registration counts for all events
  useEffect(() => {
    const fetchRegistrationCounts = async () => {
      if (!events || events.length === 0) return;

      const counts: { [key: string]: number } = {};
      
      for (const event of events) {
        const { count } = await supabase
          .from('event_registrations')
          .select('id', { count: 'exact', head: true })
          .eq('event_id', event.id);
        
        counts[event.id] = count || 0;
      }
      
      setRegistrationCounts(counts);
    };

    fetchRegistrationCounts();
  }, [events]);

  const filteredEvents = events?.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Community <span className="gradient-text">Events</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover workshops, meetups, and conferences in the tech community
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(['upcoming', 'past', 'all'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredEvents && filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event}
                registrationCount={registrationCounts[event.id] || 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">Check back later for new events</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
