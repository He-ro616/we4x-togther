# Test Dashboard Registrations NOW ✅

## STOP Everything and Do This

### 1. Kill Dev Server
```
Ctrl+C
```

### 2. Clear Everything
```
Ctrl+Shift+Delete
```
Choose: All time, All items, Click DELETE

### 3. Start Fresh
```
npm run dev
```

### 4. Hard Refresh Browser
- Go to http://localhost:8080
- Press **Ctrl+Shift+R** (3 times to be sure)

### 5. Go to Dashboard
- URL: http://localhost:8080/dashboard
- You should see:
  - Welcome message
  - 3 stat cards (Events Created, Posts Written, Events Registered)
  - Quick Actions
  - **"Event Registrations" section at bottom (ALWAYS VISIBLE NOW)**

---

## Check What You See

### You Should See:
✅ Event Registrations card/section
✅ Shows "No registrations yet" message (if no events)
✅ Has "Export to Excel" button (disabled if no data)

### If You DON'T See It:
1. Press F12 (Developer Tools)
2. Go to Console tab
3. Look for any RED errors
4. Copy the error message
5. Share it

---

## Test: Create Event + Register

### Step 1: Create Event (1 min)
1. On Dashboard, find "Quick Actions" card
2. Click "Create New Event"
3. Fill in:
   - Title: "Test Event"
   - Date: Pick tomorrow
   - Location: "Test Location"
   - Description: "Test"
4. Click Create/Save

### Step 2: Go to Events
1. Click Events in navbar
2. Find your event
3. Click on it

### Step 3: Register
1. Click "Register Now" button
2. Should see green success message
3. Button changes to "Unregister"

### Step 4: Back to Dashboard
1. Go to Dashboard
2. Scroll to "Event Registrations"
3. **Should see your registration in table** ✅

---

## If Nothing Changed

### Option A: Browser Cache
1. Close browser completely
2. Open new browser window
3. Go to http://localhost:8080/dashboard
4. Press Ctrl+Shift+R

### Option B: Server Not Updated
1. Stop: Ctrl+C
2. Check that code updated (look at Dashboard.tsx)
3. Start: npm run dev
4. Wait for "ready in" message
5. Hard refresh: Ctrl+Shift+R

### Option C: Database Empty
1. Check Supabase
2. Go to Tables → events
3. Do you see ANY events you created?
4. If no, create one first
5. Go to Tables → event_registrations
6. Do you see ANY registrations?
7. If no, register for an event first

---

## Checklist Before Testing

- [ ] Dev server is running (shows "ready in XXms")
- [ ] Browser is on http://localhost:8080/dashboard
- [ ] I hard refreshed (Ctrl+Shift+R)
- [ ] I cleared cache (Ctrl+Shift+Delete)
- [ ] I can see "Event Registrations" card/section
- [ ] I created at least 1 event (check stat card "Events Created: X")

---

## What Should Happen

1. **Refresh dashboard** → See "Event Registrations" section
2. **Create event** → See "Events Created" counter increase
3. **Register for event** → See registration appear in table
4. **Click Export** → CSV downloads with registration data

If all 4 work → ✅ DONE!

---

## Red Flags (Report If You See These)

- [ ] No "Event Registrations" section appears
- [ ] Section appears but says "Loading..." forever
- [ ] Red error in console (F12)
- [ ] "Events Created" shows 0 even after creating event
- [ ] Register button doesn't do anything
- [ ] Export button doesn't work

For any of these, note it down and check DASHBOARD_REGISTRATIONS_DEBUG.md

---

## Next: If It Works

Congratulations! 🎉

You now have:
✅ Event registration system working
✅ Dashboard showing registrations
✅ Export to Excel working
✅ Full event management

---

**Run this test NOW and report what you see!**

