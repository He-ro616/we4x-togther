import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import type { Event } from '@/lib/supabase-types';

interface EventCardProps {
  event: Event;
  registrationCount?: number;
}

export function EventCard({ event, registrationCount = 0 }: EventCardProps) {
  const eventDate = event.event_date ? new Date(event.event_date) : null;
  const isPast = eventDate ? eventDate < new Date() : false;

  return (
    <Link to={`/events/${event.id}`}>
      <Card className="group overflow-hidden gradient-border hover:glow-primary transition-all duration-300 h-full">
        <div className="relative h-48 overflow-hidden">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full gradient-primary opacity-50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {event.is_featured && (
              <Badge className="gradient-primary text-primary-foreground">Featured</Badge>
            )}
            <Badge variant={event.location_type === 'virtual' ? 'secondary' : 'outline'}>
              {event.location_type}
            </Badge>
          </div>

          {isPast && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary">Past Event</Badge>
            </div>
          )}

          {/* Date Badge */}
          <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm rounded-lg p-2 text-center min-w-[60px]">
            <div className="text-primary font-bold text-lg leading-none">
              {eventDate ? format(eventDate, 'd') : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground uppercase">
              {eventDate ? format(eventDate, 'MMM') : 'N/A'}
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="font-display font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          
          {event.short_description && (
            <p className="text-muted-foreground text-sm line-clamp-2">
              {event.short_description}
            </p>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{eventDate ? format(eventDate, 'h:mm a') : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex items-center justify-between w-full text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{registrationCount} registered</span>
            </div>
            {event.tags && event.tags.length > 0 && (
              <div className="flex gap-1">
                {event.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
