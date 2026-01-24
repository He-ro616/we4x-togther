-- A database function to securely fetch event registrations for the dashboard.
-- This handles both admin and author roles.
CREATE OR REPLACE FUNCTION get_dashboard_registrations()
RETURNS TABLE (
    id UUID,
    -- Corrected column name in RETURNS TABLE definition
    registered_at TIMESTAMPTZ,
    event_id UUID,
    user_id UUID,
    events JSONB,
    profiles JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    -- Check if the calling user is an admin by calling the has_role function
    SELECT public.has_role(auth.uid(), 'admin') INTO is_admin;

    RETURN QUERY
    SELECT
        er.id,
        er.registered_at, -- Corrected column name in SELECT statement
        er.event_id,
        er.user_id,
        -- Aggregate event details into a JSON object
        jsonb_build_object(
            'id', ev.id,
            'title', ev.title,
            'event_date', ev.event_date,
            'location', ev.location
        ) as events,
        -- Aggregate profile details into a JSON object
        jsonb_build_object(
            'id', p.id,
            'full_name', p.full_name,
            'email', p.email
        ) as profiles
    FROM
        public.event_registrations er
    JOIN
        public.events ev ON er.event_id = ev.id
    LEFT JOIN
        public.profiles p ON er.user_id = p.user_id
    WHERE
        -- If user is admin, this clause is true, returning all registrations.
        -- If user is not admin, it filters to registrations for events they created.
        is_admin OR ev.created_by = auth.uid();
END;
$$;