# Event Registrations Export Feature 📊

## ✅ New Feature Added

Users can now view and export event registration data directly from their dashboard!

---

## 📍 Location

**Dashboard → Event Registrations Section**

Path: `/dashboard` (for logged-in users who created events)

---

## 🎯 What Users Can Do

### **1. View All Event Registrations**
- See a comprehensive table of all users registered for your events
- Shows event title, date, location, registered user, email, and registration date
- Fully responsive table (adapts to mobile, tablet, desktop)

### **2. Export to Excel**
- Click "Export to Excel" button
- Downloads as CSV file (opens in Excel)
- File named: `event-registrations-YYYY-MM-DD.csv`
- Includes all registration data in organized format

### **3. Track Registrations**
- Only shows registrations for events YOU created
- Real-time data from database
- Shows registration details with timestamps

---

## 📋 Table Columns

| Column | Description | Visibility |
|--------|-------------|-----------|
| Event | Event title | Always visible |
| Date | Event date (formatted) | Desktop+ |
| Location | Event location | Large screens+ |
| Registered User | Full name of registrant | Always visible |
| Email | Registrant's email | Tablet+ |
| Registered On | Registration date | Always visible (right-aligned) |

---

## 📥 Export File Format

**Format:** CSV (Excel-compatible)

**File contains:**
- Header row with column names
- One row per registration
- All special characters properly escaped
- UTF-8 encoding

**Example content:**
```
"Event Title","Event Date","Location","Registered User","User Email","Registration Date"
"Tech Meetup 2024","1/24/2024","Convention Center","John Doe","john@example.com","1/24/2024"
"Web Dev Workshop","1/25/2024","Tech Hub","Jane Smith","jane@example.com","1/24/2024"
```

---

## 💡 Use Cases

1. **Event Management**
   - Download attendee list before event
   - Share with co-organizers
   - Create name badges or certificates

2. **Analytics**
   - Analyze registration trends
   - Track attendee demographics
   - Plan future events

3. **Communication**
   - Extract emails for event reminders
   - Send thank you emails post-event
   - Conduct post-event surveys

4. **Record Keeping**
   - Archive event attendee records
   - Maintain historical data
   - Compliance and audit trails

---

## 🔒 Security & Privacy

✅ **Only shows your events**
- Users only see registrations for events they created
- Other organizers' event registrations are not visible

✅ **Registrant information**
- Includes name and email (for communication purposes)
- No sensitive data like passwords or payment info

✅ **Database integration**
- Fetches from `event_registrations` table
- Filtered by `created_by = current_user_id`
- Real-time data from Supabase

---

## 📱 Responsive Behavior

**Mobile (xs-sm)**
- Single column layout
- Event title + Registered User always visible
- Other columns hidden (tap to scroll)
- Export button full width

**Tablet (md)**
- 2-3 columns visible
- Email and Date visible
- Location hidden

**Desktop (lg+)**
- All columns visible
- Horizontal scroll if needed
- Full data visibility

---

## 🛠️ Technical Details

### **Data Structure**
```typescript
eventRegistrations = [
  {
    id: "uuid",
    created_at: "2024-01-24T10:00:00Z",
    events: {
      id: "uuid",
      title: "Event Title",
      event_date: "2024-01-25",
      location: "Location"
    },
    profiles: {
      id: "uuid",
      full_name: "User Name",
      email: "user@example.com"
    }
  }
]
```

### **Database Query**
```sql
SELECT 
  er.id,
  er.created_at,
  e.title,
  e.event_date,
  e.location,
  p.full_name,
  p.email
FROM event_registrations er
JOIN events e ON er.event_id = e.id
JOIN profiles p ON er.user_id = p.id
WHERE e.created_by = current_user_id
ORDER BY er.created_at DESC
```

### **Export Logic**
- Uses Blob API for file creation
- Creates CSV with proper escaping
- Browser downloads directly
- No server-side processing needed

---

## 🚀 Features

✅ Real-time data (no caching)
✅ Fully responsive design
✅ One-click export
✅ Mobile-friendly interface
✅ Loading state indication
✅ Empty state handling
✅ Error handling
✅ User-filtered data (security)

---

## 📍 File Modified

**File:** `src/pages/Dashboard.tsx`

**Changes:**
- Added `eventRegistrations` query with React Query
- Added `exportToExcel` function
- Added registration table section
- Added responsive UI components
- Imported Table, Badge, Download icon

---

## 🎨 UI Components

- **Card** - Section container
- **Table** - Registration data display
- **Button** - Export functionality
- **Badge** - Status indicators
- **Loading** - Spinner during fetch
- **Empty State** - Message when no data

---

## 🔄 Data Flow

1. User navigates to `/dashboard`
2. Component loads and authenticates user
3. Query fetches events created by user
4. For each event, fetch all registrations
5. Join with profiles to get user details
6. Display in responsive table
7. User clicks "Export to Excel"
8. CSV file downloaded to device

---

## ⚡ Performance

- Uses React Query for caching
- Only fetches on page load
- Table renders efficiently
- No pagination needed (unless 1000+ registrations)
- CSV generation is client-side (fast)

---

## 🔧 Future Enhancements

- Add pagination for large datasets
- Add filtering (by event, date, etc.)
- Add search functionality
- Add sorting options
- Real-time Supabase updates
- PDF export option
- Email export (send directly)
- Dashboard chart showing registration trends
- Export multiple events as separate sheets

---

## ✨ Summary

Users who create events can now:
- 📊 View all registrations in one place
- 📥 Export to Excel with one click
- 📱 Access from mobile, tablet, or desktop
- 🔒 See only their own event registrations
- ⚡ Get instant downloads in CSV format

Perfect for event management and attendee tracking! 🎉

---

**File Location:** `src/pages/Dashboard.tsx`
