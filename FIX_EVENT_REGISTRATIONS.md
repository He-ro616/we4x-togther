# Fix Event Registrations Not Saving 🔧

## Problem
Registrations are not being saved to the database when users click "Register Now" on events.

## Root Cause
The `event_registrations` table may not have proper Row-Level Security (RLS) policies, or the table structure is incorrect.

---

## Solution: Run This SQL in Supabase

Go to **Supabase Dashboard → SQL Editor** and run this:

```sql
-- Create event_registrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'registered',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Anyone can view registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can register themselves" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can unregister themselves" ON public.event_registrations;

-- Allow authenticated users to view all registrations
CREATE POLICY "Anyone can view registrations" ON public.event_registrations
FOR SELECT USING (true);

-- Allow authenticated users to insert their own registrations
CREATE POLICY "Users can register themselves" ON public.event_registrations
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own registrations
CREATE POLICY "Users can unregister themselves" ON public.event_registrations
FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
DROP TRIGGER IF EXISTS update_event_registrations_updated_at ON public.event_registrations;
CREATE TRIGGER update_event_registrations_updated_at
BEFORE UPDATE ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);
```

---

## Step-by-Step Instructions

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com

2. **Select Your Project**
   - Find and click your Community Connect Hub project

3. **Go to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

4. **Paste the SQL**
   - Copy the SQL code above
   - Paste it into the SQL editor

5. **Run the Query**
   - Click "Run" button
   - Wait for success message (green checkmark)
   - Ignore any "already exists" warnings - that's normal

6. **Verify**
   - Go to "Tables" in left sidebar
   - Look for `event_registrations` table
   - It should exist with proper columns

---

## What This Does

✅ **Creates/updates the table structure**
- Adds all required columns
- Sets up proper foreign keys
- Adds unique constraint (one registration per user per event)

✅ **Enables Row-Level Security**
- Anyone can view registrations
- Users can only register themselves
- Users can only unregister themselves
- Admins inherit these policies

✅ **Sets up automation**
- `updated_at` timestamp auto-updates
- Indexes for fast queries

✅ **Ensures data integrity**
- Foreign key constraints
- Unique constraint prevents duplicate registrations

---

## After Running SQL

1. **Restart Dev Server**
   ```bash
   Ctrl+C (stop server)
   npm run dev (start server)
   ```

2. **Hard Refresh Browser**
   - Go to http://localhost:8080
   - Press `Ctrl+Shift+R`

3. **Test Registration**
   - Go to any event page
   - Click "Register Now"
   - Should show success toast
   - Go to Dashboard → Event Registrations
   - Should see the registration in the table

---

## Troubleshooting

**If you get error "relation already exists":**
- This is fine! It means the table already exists
- The `IF NOT EXISTS` clause prevents errors
- Continue with the rest of the setup

**If you get error about policies:**
- The `DROP POLICY IF EXISTS` removes old ones first
- Then new policies are created
- This is normal and expected

**If registrations still don't show:**
1. Check browser console (F12) for error messages
2. Check Supabase database logs
3. Verify user is logged in when registering
4. Try registering again and check the table manually in Supabase

**To manually check registrations in Supabase:**
- Go to "Tables" → `event_registrations`
- Click "Open" or "View"
- You should see all registrations

---

## Code Changes Made

**File:** `src/pages/EventDetail.tsx`

**Change:** Added `registered_at` field when inserting registration:
```typescript
// Before:
const { error } = await supabase.from('event_registrations').insert({
  event_id: id,
  user_id: user.id,
  status: 'registered',
});

// After:
const { error } = await supabase.from('event_registrations').insert({
  event_id: id,
  user_id: user.id,
  status: 'registered',
  registered_at: new Date().toISOString(),
});
```

This ensures the database timestamp is set correctly.

---

## How Registration Now Works

1. User clicks "Register Now" on event page
2. System checks:
   - ✅ User is logged in
   - ✅ Registration deadline not passed
   - ✅ Event not full
3. Registration inserted into database with:
   - Event ID
   - User ID
   - Status: "registered"
   - Timestamp: Current date/time
4. Success toast shown
5. Button changes to "Unregister"
6. Count increases in real-time
7. Registration appears in Dashboard

---

## Expected Behavior After Fix

✅ Click "Register Now" → Success message  
✅ Button changes to "Unregister"  
✅ Registration count increases  
✅ See registration in Dashboard  
✅ Export to Excel includes this registration  
✅ Can unregister anytime  

---

## Need Help?

If registrations still don't work after running SQL:

1. Check the browser console for errors (F12)
2. Look at Supabase Database logs
3. Verify the table was created:
   - Supabase → Tables → Look for `event_registrations`
4. Check RLS policies are enabled:
   - Supabase → Authentication → Policies

---

**That's it!** Registrations should work after running this SQL. 🎉

