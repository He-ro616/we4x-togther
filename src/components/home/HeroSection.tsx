import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Zap, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import heroBg from '@/assets/hero-bg.jpg';

export function HeroSection() {
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  const [stats, setStats] = useState({ members: 0, events: 0, posts: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch WhatsApp link
        const { data: settingsData } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'whatsapp_link')
          .single();

        if (settingsData?.value) {
          setWhatsappLink(settingsData.value);
        }

        // Fetch stats
        const { count: memberCount } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });

        const { count: eventCount } = await supabase
          .from('events')
          .select('id', { count: 'exact', head: true });

        const { count: postCount } = await supabase
          .from('posts')
          .select('id', { count: 'exact', head: true });

        setStats({
          members: memberCount || 0,
          events: eventCount || 0,
          posts: postCount || 0,
        });
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchData();
  }, []);
  return (
    <section className="relative min-h-screen sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Tech network background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full gradient-border text-xs sm:text-sm font-medium">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span>Join the tech revolution</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            Connect. Learn.{' '}
            <span className="gradient-text glow-text">Build Together.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            Join <span className="text-primary font-semibold">we4x</span> — the community where developers, 
            designers, and tech enthusiasts come together to share knowledge and grow.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Button size="lg" asChild className="glow-primary text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
              <Link to="/register">
                Join Community
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
              <Link to="/events">Explore Events</Link>
            </Button>
            {whatsappLink && (
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                  <span>Join WhatsApp</span>
                </a>
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-12 max-w-lg mx-auto px-2">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
                {loadingStats ? '...' : `${stats.members > 0 ? stats.members : '500'}${stats.members > 999 ? 'K+' : '+'}`}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
                {loadingStats ? '...' : `${stats.events > 0 ? stats.events : '50'}${stats.events > 999 ? 'K+' : '+'}`}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
                {loadingStats ? '...' : `${stats.posts > 0 ? stats.posts : '100'}${stats.posts > 999 ? 'K+' : '+'}`}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Posts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
}
