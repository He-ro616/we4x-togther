# Admin Control Center - Implementation Summary

## ✅ What Was Created

A new **Admin Control Center** page has been successfully added to your Community Connect Hub project at `/admin/control-center`.

## 📋 Features Implemented

### 1. **Posts Management Tab**
   - ✅ View all posts in a sortable table
   - ✅ Delete posts with confirmation dialog
   - ✅ Export posts to CSV format
   - Display: Title, Content Preview, Created Date, Status
   - **Action**: One-click delete with safety confirmation

### 2. **Events Management Tab**
   - ✅ View all events in a detailed table
   - ✅ **See participant count** for each event (real-time from database)
   - ✅ **Create new events** directly from the control center
   - ✅ Delete events with confirmation
   - ✅ Export events to CSV format
   
   **Event Creation Form includes:**
   - Event Title (required)
   - Description (required)
   - Date & Time picker (required)
   - Location (required)
   - Location Type (In-person, Virtual, or Hybrid)
   - Max Attendees (optional, unlimited if blank)
   - Auto-published and approved for admin-created events

### 3. **Data Export (CSV/Google Sheets)**
   - ✅ Export Posts data as CSV
   - ✅ Export Events data as CSV
   - ✅ CSV files are **Google Sheets compatible**
   - One-click download ready for Google Sheets import

## 🗂️ File Changes

### New Files Created:
```
src/pages/admin/ControlCenter.tsx    (520 lines)
ADMIN_SETUP.md                       (Setup guide)
```

### Modified Files:
```
src/App.tsx                          (Added route + import)
src/components/layout/AdminSidebar.tsx (Added sidebar link)
```

## 🚀 How to Access

### Step 1: Grant Admin Role (One-time setup)
Your email `shivanshkushwaha518@gmail.com` needs the admin role. In your Supabase SQL Editor, run:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'shivanshkushwaha518@gmail.com'),
  'admin'
)
ON CONFLICT (user_id, role) DO NOTHING;
```

### Step 2: Access the Page
1. Log in to the platform
2. Navigate to `/admin/control-center`
3. OR click "Control Center" in the admin sidebar menu

## 📊 Exporting Data to Google Sheets

1. Click **"Export to CSV"** button for Posts or Events
2. A CSV file downloads (named `posts-report-YYYY-MM-DD.csv` or similar)
3. Go to [Google Sheets](https://sheets.google.com)
4. Click **+ New → File upload**
5. Select and upload the CSV
6. Google Sheets automatically formats it into a spreadsheet
7. **Optional**: Rename the sheet and save to Drive

## 🔧 Technical Details

### Technology Stack
- **React 18.3** with TypeScript
- **Shadcn UI** components
- **Supabase** database (PostgreSQL)
- **Tailwind CSS** styling
- **React Query** (TanStack Query) for data fetching

### Database Queries
The page connects to:
- `posts` table - for all post records
- `events` table - for all events
- `event_registrations` table - to count participants
- Uses `count` aggregation for efficient participant counting

### Component Structure
```
AdminControlCenter (Main Component)
├── Tabs (Posts | Events)
├── Posts Tab
│   ├── Table with actions
│   └── Export button
└── Events Tab
    ├── Create Event Dialog
    ├── Table with actions
    └── Export button
```

## 🔐 Security Features

- ✅ Role-based access (admin only)
- ✅ Confirmation dialogs for destructive actions (delete)
- ✅ Protected routes through `ProtectedRoute` component
- ✅ Authentication required for all operations

## 📝 Notes & Limitations

### Current Behavior
- Events created by admin are **auto-approved** and **auto-published**
- Participant count fetches **registered** participants
- CSV exports include all data columns (ID, Title, Dates, etc.)
- Delete operations are **permanent** and cannot be undone

### Future Enhancements (Not included)
- [ ] Edit posts/events (currently delete only)
- [ ] Bulk operations
- [ ] Advanced search/filtering
- [ ] Direct Google Sheets OAuth integration
- [ ] Audit logs for admin actions
- [ ] User role management from control center

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "No permission to access" | Run the SQL to add admin role |
| CSV won't download | Check browser security settings |
| Participant count shows 0 | Check `event_registrations` table has records |
| Button not appearing | Clear browser cache and reload |
| Events not appearing | Ensure events are published in database |

## 📦 Dependencies Used

All existing dependencies - no new packages added:
- `@radix-ui/*` (UI primitives)
- `lucide-react` (icons)
- `@supabase/supabase-js` (database)
- `react-router-dom` (routing)

## ✨ Next Steps

1. **Run the SQL** to grant admin role to your email
2. **Log in** and navigate to `/admin/control-center`
3. **Test the features**:
   - Create an event
   - Export posts to CSV
   - Delete a test post
   - Check participant count on an event

## 📞 Support

If you encounter any issues:
1. Check the ADMIN_SETUP.md file for detailed setup
2. Verify admin role is properly assigned in Supabase
3. Check browser console for any error messages
4. Ensure all tables exist in Supabase database
