-- Fix for get_dashboard_registrations RPC function to re-include user email.
-- Joins with `auth.users` table to fetch email correctly, as email is not in `public.profiles`.

CREATE OR REPLACE FUNCTION get_dashboard_registrations()
RETURNS TABLE (
    id UUID,
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
        er.registered_at,
        er.event_id,
        er.user_id,
        jsonb_build_object(
            'id', ev.id,
            'title', ev.title,
            'event_date', ev.event_date,
            'location', ev.location
        ) as events,
        jsonb_build_object(
            'id', p.id,
            'full_name', p.full_name,
            'email', au.email -- Fetching email from auth.users table
        ) as profiles
    FROM
        public.event_registrations er
    JOIN
        public.events ev ON er.event_id = ev.id
    LEFT JOIN
        public.profiles p ON er.user_id = p.user_id
    LEFT JOIN -- New join to auth.users table to get email
        auth.users au ON er.user_id = au.id
    WHERE
        is_admin OR ev.created_by = auth.uid();
END;
$$;
