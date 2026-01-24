# Quick Test - Dashboard Registrations 🚀

## 5-Minute Test

### Step 1: Restart (30 seconds)
```bash
Ctrl+C          # Stop server
npm run dev     # Start server
```

### Step 2: Hard Refresh (10 seconds)
- Go to http://localhost:8080
- Press **Ctrl+Shift+R**

### Step 3: Check Console (20 seconds)
1. Press **F12** (Developer Tools)
2. Go to **Console** tab
3. Look for messages starting with "Fetching registrations"
4. Note any errors (red text)

### Step 4: Create Event (1 minute)
If "Events Created: 0" in dashboard:
1. Go to Dashboard
2. Click "Create New Event"
3. Fill in:
   - Title: "Test Event"
   - Date: Tomorrow
   - Location: "Online"
   - Description: "Test"
4. Click Save

### Step 5: Register (1 minute)
1. Go to Events page
2. Find your event
3. Click it
4. Click "Register Now"
5. See green success message ✅

### Step 6: Check Dashboard (1 minute)
1. Go back to Dashboard
2. Scroll down
3. Look for "Event Registrations" section
4. Should show your registration in table ✅

### Step 7: Export (30 seconds)
1. Click "Export to Excel"
2. CSV file downloads ✅
3. Open in Excel/Sheets ✅

---

## If It Shows "No registrations yet"

This means:
- ❌ No events created, OR
- ❌ No registrations made, OR  
- ❌ Data not loading

**Quick fix:**
1. Open browser console (F12 → Console)
2. Look for error messages
3. If you see "Found events: 0" → Create an event
4. If you see "Found registrations: 0" → Register for events
5. If you see error message → Note it down and check troubleshooting

---

## Expected Console Messages

You should see in order:
```
✅ "Fetching registrations for user: [your-id]"
✅ "Found events: X"
✅ "Found registrations: X"
✅ "Enriched registrations: [...]"
```

If you see:
```
❌ "No events created by user" → Create an event first
❌ "No registrations for events" → Register for an event first
❌ Error message → Check DASHBOARD_REGISTRATIONS_DEBUG.md
```

---

## That's It!

Follow these 7 steps in 5 minutes and you'll know if it's working. 🎉

