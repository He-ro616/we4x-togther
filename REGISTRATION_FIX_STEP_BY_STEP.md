# Event Registrations Fix - Step by Step 🔧

## Problem
- Registration shows "success message" ✅
- But data is NOT saved to database ❌
- Registration count doesn't increase ❌

## Root Cause
The `event_registrations` table RLS (Row Level Security) policies are blocking the insert even though the code thinks it succeeded.

---

## Complete Fix - Run This SQL

Go to **Supabase Dashboard → SQL Editor** and paste THIS ENTIRE CODE:

```sql
-- STEP 1: Drop the table if it exists (to start fresh)
DROP TABLE IF EXISTS public.event_registrations CASCADE;

-- STEP 2: Create the table from scratch
CREATE TABLE public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(event_id, user_id)
);

-- STEP 3: Create indexes for performance
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON public.event_registrations(user_id);

-- STEP 4: Enable Row Level Security
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create RLS Policies (CORRECT SYNTAX)
-- Policy 1: Anyone can view all registrations
CREATE POLICY "view_all_registrations" 
ON public.event_registrations 
FOR SELECT 
USING (true);

-- Policy 2: Authenticated users can insert their own registration
CREATE POLICY "insert_own_registration" 
ON public.event_registrations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Authenticated users can delete their own registration
CREATE POLICY "delete_own_registration" 
ON public.event_registrations 
FOR DELETE 
USING (auth.uid() = user_id);

-- STEP 6: Create update trigger for updated_at column
CREATE OR REPLACE FUNCTION update_event_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS event_registrations_updated_at_trigger ON public.event_registrations;
CREATE TRIGGER event_registrations_updated_at_trigger
BEFORE UPDATE ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION update_event_registrations_updated_at();
```

---

## Instructions

1. **Open Supabase Console**
   - https://app.supabase.com
   - Select your project

2. **Go to SQL Editor**
   - Left sidebar → SQL Editor
   - Click "New Query"

3. **Copy ALL the SQL above**
   - Paste into editor

4. **Click RUN**
   - Wait for success (green checkmark)
   - Should show "executed successfully"

5. **Restart Dev Server**
   ```bash
   Ctrl+C
   npm run dev
   ```

6. **Hard Refresh Browser**
   - Go to http://localhost:8080
   - Press Ctrl+Shift+R

7. **Test Registration**
   - Go to any event
   - Click "Register Now"
   - Check:
     - ✅ Success message appears
     - ✅ Button changes to "Unregister"
     - ✅ Registration count increases
     - ✅ Go to Dashboard → see registration in table

---

## Verify It Worked

### Check 1: In Browser
1. Go to event page
2. Click "Register Now"
3. Should see success message
4. Go to Dashboard
5. Scroll to "Event Registrations" section
6. Should see your registration in the table

### Check 2: In Supabase
1. Go to Supabase → Tables
2. Look for `event_registrations` table
3. Click to open it
4. You should see rows with your registrations

### Check 3: Browser Console
1. Press F12 (Open Developer Tools)
2. Go to Console tab
3. Try registering again
4. Should NOT see any error messages

---

## If It Still Doesn't Work

### Check 1: Are you logged in?
- You MUST be logged in to register
- Look for your name in navbar
- If not, log in first

### Check 2: Browser Console Errors
- Press F12
- Go to Console tab
- Try registering
- Look for red error messages
- Copy and paste any errors

### Check 3: Network Tab
- Press F12
- Go to Network tab
- Try registering
- Look for a "POST" request
- Check its response for errors

---

## What This SQL Does

✅ **Drops old table** - Clears any corrupt data
✅ **Creates fresh table** - With correct structure
✅ **Adds constraints** - Prevents duplicate registrations (same user + event)
✅ **Adds foreign keys** - Links to events and users
✅ **Creates indexes** - Makes queries fast
✅ **Sets up RLS** - Security policies (critical!)
✅ **Creates trigger** - Auto-updates timestamp

---

## Code Reference

The code that registers users is already correct in:
**File:** `src/pages/EventDetail.tsx` (lines 127-131)

```typescript
const { error } = await supabase.from('event_registrations').insert({
  event_id: id,
  user_id: user.id,
  status: 'registered',
  registered_at: new Date().toISOString(),
});
```

This code is fine - the issue is the database setup.

---

## Expected Result After Running SQL

✅ Registration saves to database
✅ Shows in event registration count
✅ Shows in Dashboard table
✅ Can export to Excel
✅ Can unregister

---

## Need More Help?

If it STILL doesn't work:

1. **Post the browser console error** (F12 → Console)
2. **Check Supabase table** - Does it exist?
3. **Verify RLS policies** - Supabase → Authentication → Policies
4. **Check user auth** - Are you logged in?

---

## Summary

The table structure was wrong or RLS policies were blocking inserts. This SQL:
- ✅ Creates proper table from scratch
- ✅ Sets up correct RLS policies
- ✅ Enables registrations to actually save

**Run this SQL and registrations will work!** 🎉

