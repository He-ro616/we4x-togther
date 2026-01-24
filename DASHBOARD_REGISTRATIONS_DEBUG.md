# Dashboard Registrations - Complete Debugging Guide 🔍

## Problem
Event registrations are not showing on the dashboard even though users are registering for events.

## Complete Solution

### Step 1: Check Browser Console for Errors

1. **Open Developer Tools**
   - Press **F12**
   - Go to **Console** tab

2. **Hard Refresh**
   - Press **Ctrl+Shift+R**

3. **Go to Dashboard**
   - Navigate to http://localhost:8080/dashboard

4. **Look for Logs**
   - You should see messages like:
     - "Fetching registrations for user: [uuid]"
     - "Found events: X"
     - "Found registrations: X"
     - "Enriched registrations: [...]"

5. **Note Any Errors**
   - Red error messages = problem
   - Copy the error message

---

## Step 2: Verify Data in Supabase

### Check 1: Do you have events?

1. Go to **Supabase Dashboard**
2. Click **Tables** → **events**
3. Look for rows where `created_by` = your user ID
4. If empty: **You need to create an event first!**

### Check 2: Do you have registrations?

1. Go to **Tables** → **event_registrations**
2. Look for rows with:
   - `event_id` = your event ID
   - `user_id` = registered user ID
3. If empty: **You need to register for an event first!**

### Check 3: Do you have profiles?

1. Go to **Tables** → **profiles**
2. Look for rows with:
   - `id` = registered user IDs
   - `full_name` populated
   - `email` populated
3. If empty or missing data: **Profiles need data!**

---

## Step 3: Test End-to-End Flow

### Part A: Create Event

1. Go to **Dashboard** (http://localhost:8080/dashboard)
2. Look for "Events Created: X"
   - If 0, you need to create an event
   - Find "Create New Event" button in Quick Actions
   - Fill in event details
   - Click Save

### Part B: Register for Event

1. Go to **Events** page (http://localhost:8080/events)
2. Find your event in the list
3. Click on the event card
4. Click **"Register Now"** button
5. Should see green success message
6. Button should change to "Unregister"

### Part C: Check Dashboard

1. Go to **Dashboard** (http://localhost:8080/dashboard)
2. Scroll down past "Quick Actions"
3. Look for **"Event Registrations"** card
4. Should show a table with your registration
5. Columns: Event, Date, Location, Registered User, Email, Registered On

---

## Step 4: If Still Not Working

### Issue: "Event Registrations section doesn't appear"

**Cause:** You haven't created any events

**Fix:**
1. Dashboard shows "Events Created: 0"
2. Create an event:
   - Go to Dashboard
   - Click "Create New Event" (under Quick Actions)
   - Fill all fields
   - Save event
3. Go back to Dashboard
4. Section should appear now

---

### Issue: "Event Registrations section appears but empty"

**Cause:** No users have registered yet (or registrations weren't saved)

**Fix:**
1. Go to **Events** page
2. Find an event you created
3. Click the event
4. Register yourself by clicking "Register Now"
5. See success message
6. Go back to Dashboard
7. Should see your registration in the table

---

### Issue: "Registration doesn't save"

**Cause:** event_registrations table has RLS blocking inserts

**Fix:** Check browser console (F12 → Console)
- Look for errors when clicking "Register Now"
- If error about RLS or permissions:
  1. Go to Supabase
  2. Go to **Authentication** → **Policies**
  3. Check `event_registrations` table policies
  4. Verify INSERT policy with `auth.uid() = user_id` exists
  5. If not, create it

---

### Issue: "Console shows errors"

**Different error messages and fixes:**

#### "cannot find column 'event_id'"
- Check: Does `event_registrations` table have `event_id` column?
- Fix: Run creation SQL from COMPLETE_REGISTRATION_SETUP.md

#### "relation event_registrations does not exist"
- Check: Is the table created in Supabase?
- Fix: Run table creation SQL

#### "RLS policy ... denied access"
- Check: Are RLS policies set up?
- Fix: Check policies in Supabase → Authentication → Policies

#### "undefined is not iterable"
- Check: Are you logged in?
- Check: Have you created events?
- Fix: Create an event first, then try again

---

## Step 5: Manual Verification

### Option 1: Check Supabase Directly

1. Go to Supabase Dashboard
2. Click **Tables** → **event_registrations**
3. Look for your registration:
   - User registered for your event? ✅
   - All columns filled? ✅
   - No errors in data? ✅

### Option 2: Check with Different Browser

1. Open **Incognito/Private window**
2. Go to http://localhost:8080
3. Log in
4. Test registration flow
5. Check dashboard
6. Does it work in private mode?

---

## Step 6: Enable Debug Logging

Add this to see detailed logs:

**File:** `src/pages/Dashboard.tsx` - ALREADY ADDED

The component now logs:
- ✅ When fetching starts
- ✅ Number of events found
- ✅ Number of registrations found
- ✅ Final enriched data
- ✅ Any errors

**To see logs:**
1. Open browser console (F12)
2. Go to Dashboard
3. Look for "Fetching registrations for user:" message
4. Follow the logs to see data flow

---

## Common Scenarios

### Scenario 1: First Time Setup

**Your situation:**
- No events created
- No registrations made
- Dashboard empty

**Solution:**
1. Create event: Dashboard → Create New Event
2. Register: Events page → Click event → Register Now
3. Check: Dashboard should show registration

**Expected timeline:** 2-3 minutes

### Scenario 2: Have Events but No Registrations

**Your situation:**
- Events Created: 5
- But Event Registrations: empty

**Solution:**
1. Go to Events page
2. Click one of your events
3. Register for it
4. Go back to Dashboard
5. Should show in Event Registrations

**Expected:** Should appear immediately after registering

### Scenario 3: Registrations in Supabase but Not Dashboard

**Your situation:**
- Supabase shows registrations in table
- But Dashboard doesn't show them

**Solution:**
1. Check browser console for errors
2. Restart dev server: Ctrl+C then npm run dev
3. Hard refresh: Ctrl+Shift+R
4. Check console logs again

---

## Data Requirements Checklist

Before debugging, verify you have:

### In Supabase Tables:

- [ ] **events table**
  - [ ] Has at least 1 row
  - [ ] `created_by` = your user ID
  - [ ] `title` is filled
  - [ ] `event_date` is filled

- [ ] **event_registrations table**
  - [ ] Has at least 1 row
  - [ ] `event_id` points to your event
  - [ ] `user_id` is a valid user
  - [ ] `status` = "registered"

- [ ] **profiles table**
  - [ ] Has profile for registered users
  - [ ] `full_name` is filled
  - [ ] `email` is filled

### In Auth:

- [ ] You are logged in
- [ ] Your user ID is in `auth.users`
- [ ] Your profile exists in `profiles` table

---

## Console Logs Explained

### What You Should See:

```
"Fetching registrations for user: 123e4567-e89b-12d3-a456-426614174000"
"Found events: 2"
"Found registrations: 3"
"Enriched registrations: [
  {
    id: "...",
    event_id: "...",
    user_id: "...",
    events: { title: "Tech Meetup", ... },
    profiles: { full_name: "John Doe", email: "john@example.com" }
  },
  ...
]"
```

### What's Bad:

```
"No events created by user"  ← Create an event first
"No registrations for events"  ← Register for events first
"Error fetching user events: ..."  ← Database error (check logs)
"Error fetching registrations: ..."  ← RLS or table issue
```

---

## Nuclear Option: Full Reset

If nothing works:

1. **Clear browser cache**
   - Ctrl+Shift+Delete
   - Clear all time
   - Close and reopen browser

2. **Stop dev server**
   ```bash
   Ctrl+C
   ```

3. **Delete node_modules**
   ```bash
   rm -r node_modules
   npm install
   ```

4. **Start fresh**
   ```bash
   npm run dev
   ```

5. **Hard refresh**
   - Ctrl+Shift+R

6. **Test complete flow**
   - Create event
   - Register
   - Check dashboard

---

## Get Help

If still stuck:

1. **Open browser console** (F12)
2. **Copy all error messages**
3. **Go to Dashboard**
4. **Share:**
   - Error messages from console
   - What you see on screen
   - Number of events created
   - Number of registrations made

---

## Summary

✅ Dashboard now has detailed logging  
✅ Check browser console for detailed messages  
✅ Verify data exists in Supabase  
✅ Test complete flow (create → register → check)  
✅ Follow troubleshooting steps  

**Should work now!** 🎉

