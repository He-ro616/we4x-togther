import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  members: number;
  events: number;
  posts: number;
}

export function useRealtimeStats() {
  const [stats, setStats] = useState<Stats>({ members: 0, events: 0, posts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const profilesResult = await supabase.from('profiles').select('id', { count: 'exact', head: true });
        const eventsResult = await supabase.from('events').select('id', { count: 'exact', head: true });
        const postsResult = await supabase.from('posts').select('id', { count: 'exact', head: true });

        if (profilesResult.error) console.warn('Profiles error:', profilesResult.error);
        if (eventsResult.error) console.warn('Events error:', eventsResult.error);
        if (postsResult.error) console.warn('Posts error:', postsResult.error);

        console.log('Stats fetched:', { 
          memberCount: profilesResult.count, 
          eventCount: eventsResult.count, 
          postCount: postsResult.count 
        });

        if (isMounted) {
          setStats({
            members: profilesResult.count || 0,
            events: eventsResult.count || 0,
            posts: postsResult.count || 0,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();

    // Subscribe to real-time changes
    const profilesSubscription = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          if (isMounted) {
            fetchStats();
          }
        }
      )
      .subscribe();

    const eventsSubscription = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => {
          if (isMounted) {
            fetchStats();
          }
        }
      )
      .subscribe();

    const postsSubscription = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          if (isMounted) {
            fetchStats();
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      profilesSubscription.unsubscribe();
      eventsSubscription.unsubscribe();
      postsSubscription.unsubscribe();
    };
  }, []);

  return { stats, loading };
}
