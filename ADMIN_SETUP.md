# Admin Control Center Setup Guide

## Overview
The new Admin Control Center (`/admin/control-center`) provides centralized management for all posts, events, and participants with the ability to:
- ✅ Delete posts
- ✅ Create new events
- ✅ View participant counts for events
- ✅ Export data to CSV (Google Sheets compatible)
- ✅ Full event and post management

## Accessing the Admin Control Center

### Step 1: Grant Admin Role to Your Account
The admin control center is only accessible to users with the `admin` role.

To set up your account (`shivanshkushwaha518@gmail.com`) as admin:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Run the following query:
```sql
-- First, get your user ID from the auth.users table
-- Find the user with email 'shivanshkushwaha518@gmail.com'

-- Then, insert the admin role:
INSERT INTO public.user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'shivanshkushwaha518@gmail.com'),
  'admin'
)
ON CONFLICT (user_id, role) DO NOTHING;
```

#### Option B: Using Supabase UI
1. Go to Supabase Dashboard → **SQL Editor**
2. Paste and execute the SQL above

### Step 2: Navigate to Admin Control Center
Once the admin role is granted:
1. Log in to the platform with your account
2. Go to `/admin/control-center` or click "Control Center" in the admin sidebar
3. You should now see the full admin dashboard

## Features

### 📝 Posts Management
- **View All Posts**: See a table of all posts with titles, content previews, and creation dates
- **Delete Posts**: Remove posts with confirmation dialog
- **Export Data**: Export all posts to CSV format

### 📅 Events Management
- **View All Events**: See all events with participant counts and max attendees
- **Create Events**: Add new events directly from the control center
  - Supports: Title, Description, Date/Time, Location, Location Type (In-person/Virtual/Hybrid)
  - Optional: Max Attendees limit
  - Events are auto-published and approved when created by admin
- **View Participants**: See real-time participant count for each event
- **Delete Events**: Remove events with confirmation
- **Export Data**: Export event data including participant counts to CSV

### 📊 CSV Export (Google Sheets Compatible)
Both posts and events data can be exported as CSV files:

**Posts CSV Columns:**
- ID, Title, Content Preview, Author, Created Date, Status

**Events CSV Columns:**
- ID, Title, Description Preview, Date, Location, Location Type, Participants, Max Attendees, Status

**How to Import into Google Sheets:**
1. Click "Export to CSV" button
2. Open Google Sheets: https://sheets.google.com
3. Click **"+ New" → "File upload" → Upload the CSV**
4. Or select **"Open" → "Upload" → Choose the downloaded file**
5. The data will be automatically formatted into a spreadsheet

## Database Schema

The following tables are used:

### posts table
```
- id (UUID)
- title (text)
- content (text)
- author_id (UUID)
- created_at (timestamp)
- status (text)
```

### events table
```
- id (UUID)
- title (text)
- description (text)
- date (timestamp)
- location (text)
- location_type (in-person | virtual | hybrid)
- max_attendees (integer, optional)
- author_id (UUID)
- status (text)
```

### event_registrations table
```
- id (UUID)
- event_id (UUID)
- user_id (UUID)
- status (registered | attended | cancelled)
```

### user_roles table
```
- id (UUID)
- user_id (UUID) - FK to auth.users
- role (admin | moderator | user)
```

## Troubleshooting

### "You don't have permission to access this page"
- **Issue**: Your account doesn't have the admin role
- **Solution**: Follow Step 1 above to grant the admin role

### CSV Export not working
- **Issue**: No data to export
- **Solution**: Ensure posts/events exist in the database before exporting

### Events not showing participant count
- **Issue**: Participant count showing 0 even with registrations
- **Solution**: Check `event_registrations` table - ensure registrations have status of 'registered'

## Additional Admin Features
- Admin dashboard at `/admin`
- User management at `/admin/users`
- Individual event management at `/admin/events`
- Individual post management at `/admin/posts`
- Analytics at `/admin/analytics`
- Settings at `/admin/settings`

## Security Notes
- Only users with the `admin` role can access control center
- Deletions cannot be undone - confirmation dialogs prevent accidental deletions
- All actions are logged in the application (if audit logging is implemented)
- Admin users should use strong passwords
- Consider implementing 2FA for admin accounts

## Future Enhancements
- [ ] Edit posts from control center
- [ ] Edit events from control center
- [ ] Bulk delete operations
- [ ] Advanced filtering and search
- [ ] Google Sheets direct integration (OAuth)
- [ ] Excel export with formatting
- [ ] Audit logs for all admin actions
- [ ] User role management
