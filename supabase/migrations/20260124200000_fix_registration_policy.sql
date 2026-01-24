-- Drop the old, restrictive policy
DROP POLICY "Users can view own registrations" ON public.event_registrations;

-- Create a new, more permissive policy
CREATE POLICY "Users, creators, and admins can view registrations" ON public.event_registrations
    FOR SELECT USING (
        -- A user can see their own registration
        auth.uid() = user_id
        
        -- An admin can see all registrations
        OR public.has_role(auth.uid(), 'admin')

        -- An event creator can see all registrations for their event
        OR EXISTS (
            SELECT 1
            FROM public.events
            WHERE public.events.id = event_registrations.event_id AND public.events.created_by = auth.uid()
        )
    );
