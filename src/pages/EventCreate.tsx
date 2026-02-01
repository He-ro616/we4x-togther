import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function EventCreate() {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState('in-person');
  const [meetingLink, setMeetingLink] = useState('');
  const [venueUrl, setVenueUrl] = useState('');
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventStartTime, setEventStartTime] = useState('10:00');
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState('11:00');
  const [maxAttendees, setMaxAttendees] = useState<number | undefined>(undefined);
  const [registrationDeadline, setRegistrationDeadline] = useState<Date | undefined>(undefined);
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!eventId);

  const isEditMode = !!eventId;

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) {
        toast({
          title: 'Error fetching event',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }

      if (data) {
        setTitle(data.title || '');
        setDescription(data.description || '');
        setShortDescription(data.short_description || '');
        setImageUrl(data.image_url || '');
        setLocation(data.location || '');
        setLocationType(data.location_type || 'in-person');
        setMeetingLink(data.meeting_link || '');
        setVenueUrl(data.venue_url || '');
        setMaxAttendees(data.max_attendees);
        setTags(data.tags || []);
        if (data.event_date) {
          const eventDateObj = new Date(data.event_date);
          setEventDate(eventDateObj);
          const hours = String(eventDateObj.getHours()).padStart(2, '0');
          const mins = String(eventDateObj.getMinutes()).padStart(2, '0');
          setEventStartTime(`${hours}:${mins}`);
        }
        if (data.end_date) {
          const endDateObj = new Date(data.end_date);
          setEndDate(endDateObj);
          const hours = String(endDateObj.getHours()).padStart(2, '0');
          const mins = String(endDateObj.getMinutes()).padStart(2, '0');
          setEndTime(`${hours}:${mins}`);
        }
        if (data.registration_deadline) setRegistrationDeadline(new Date(data.registration_deadline));
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagsInput && !tags.includes(tagsInput.trim())) {
      setTags([...tags, tagsInput.trim()]);
      setTagsInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create an event.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    
    // Combine date and time
    let eventDateTime: string | undefined;
    if (eventDate) {
      const [hours, minutes] = eventStartTime.split(':');
      const dateWithTime = new Date(eventDate);
      dateWithTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      eventDateTime = dateWithTime.toISOString();
    }

    let endDateTime: string | undefined;
    if (endDate) {
      const [hours, minutes] = endTime.split(':');
      const dateWithTime = new Date(endDate);
      dateWithTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      endDateTime = dateWithTime.toISOString();
    }

    const eventData = {
      title,
      description,
      short_description: shortDescription,
      image_url: imageUrl,
      location,
      location_type: locationType,
      meeting_link: meetingLink || null,
      venue_url: venueUrl || null,
      event_date: eventDateTime,
      end_date: endDateTime,
      max_attendees: maxAttendees,
      registration_deadline: registrationDeadline?.toISOString(),
      tags,
      ...(isEditMode ? {} : { created_by: user.id }),
    };

    try {
      if (isEditMode) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', eventId);

        if (error) throw error;
        toast({
          title: 'Event updated!',
          description: 'Your event has been updated successfully.',
        });
      } else {
        const { error } = await supabase.from('events').insert([eventData]);

        if (error) throw error;
        toast({
          title: 'Event created!',
          description: 'Your event has been created successfully.',
        });
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: isEditMode ? 'Error updating event' : 'Error creating event',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-8 text-center">
          {isEditMode ? 'Edit Event' : 'Create New Event'}
        </h1>

        <form onSubmit={handleSaveEvent} className="space-y-6">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="A brief summary of your event"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide all details about your event"
              rows={6}
              required
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="location">Location / Address</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="locationType">Location Type</Label>
            <Select value={locationType} onValueChange={setLocationType}>
              <SelectTrigger>
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="meetingLink">Meeting Link (for Virtual/Hybrid)</Label>
            <Input
              id="meetingLink"
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="e.g., https://zoom.us/j/123456 or https://meet.google.com/..."
            />
            <p className="text-xs text-muted-foreground mt-1">Add Zoom, Google Meet, Teams, or other meeting platform link</p>
          </div>

          <div>
            <Label htmlFor="venueUrl">Venue Website / More Info</Label>
            <Input
              id="venueUrl"
              type="url"
              value={venueUrl}
              onChange={(e) => setVenueUrl(e.target.value)}
              placeholder="e.g., https://venue-name.com or direction link"
            />
            <p className="text-xs text-muted-foreground mt-1">Link to venue information or Google Maps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eventDate">Event Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !eventDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="eventStartTime">Start Time</Label>
              <Input
                id="eventStartTime"
                type="time"
                value={eventStartTime}
                onChange={(e) => setEventStartTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="endTime">End Time (Optional)</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="maxAttendees">Max Attendees (Optional)</Label>
            <Input
              id="maxAttendees"
              type="number"
              value={maxAttendees || ''}
              onChange={(e) => setMaxAttendees(e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          <div>
            <Label htmlFor="registrationDeadline">Registration Deadline (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !registrationDeadline && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {registrationDeadline ? format(registrationDeadline, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={registrationDeadline}
                  onSelect={setRegistrationDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tags (e.g., tech, community)"
              />
              <Button type="button" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto px-1 ml-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    &times;
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full glow-primary" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : isEditMode ? (
              'Update Event'
            ) : (
              'Create Event'
            )}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
