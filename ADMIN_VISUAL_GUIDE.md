# 🎨 Admin Control Center - Visual Guide

## 📺 Page Layout

```
┌─────────────────────────────────────────────────────────┐
│ Admin Control Center                    [User Menu]      │
├─────────────────────────────────────────────────────────┤
│ Manage all content, events, and participants             │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  [Posts (42)]  [Events (8)]                              │
│  ─────────────────────────────────────────────────────   │
│                                                           │
│  Posts Management                  [Export to CSV]       │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Title │ Content Preview │ Created │ Status │ Actions│ │
│  ├─────────────────────────────────────────────────────┤ │
│  │ React Tips│ How to build... │ 1/20/26│ published│ ⋮ │ │
│  │ Nodejs Wor│ Running node... │ 1/19/26│ published│ ⋮ │ │
│  │ TypeScript│ Understanding... │ 1/18/26│ published│ ⋮ │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## 🗺️ Navigation Path

```
Login Page
    ↓
Dashboard
    ↓
Admin Menu (Sidebar)
    ├── Dashboard
    ├── Control Center ← YOU ARE HERE
    ├── Users
    ├── Events
    ├── Posts
    ├── Analytics
    └── Settings
```

## 📝 Posts Tab Interface

```
┌────────────────────────────────────────────────────────┐
│ Posts Management                  [Export to CSV] ↓     │
├────────────────────────────────────────────────────────┤
│ Title        │ Content...     │ Created   │ Status │ ⋮ │
├────────────────────────────────────────────────────────┤
│ React Hooks  │ Learn about... │ 1/24/2026 │ ●●●●● │ ⋮ │
│              │                │           │       │   │
│              │                │           │       ├─→ Delete Post
│              │                │           │       │
│ JS ES6+      │ Modern syntax...│ 1/23/2026│ ●●●●● │ ⋮ │
│              │                │           │       │
│              │                │           │       └─→ Delete Post
├────────────────────────────────────────────────────────┤
│                                                        │
│  CSV Format when exported:                             │
│  "ID","Title","Content","Author","Date","Status"      │
│  "abc1","React Hooks","Learn...",...                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## 📅 Events Tab Interface

```
┌──────────────────────────────────────────────────────────┐
│ Events Management     [+ Create Event] [Export to CSV] ↓ │
├──────────────────────────────────────────────────────────┤
│ Title│Date   │Location│Participants│Max│Status│Actions │
├──────────────────────────────────────────────────────────┤
│React │1/25/26│NYC    │    [15]    │50 │●●●● │  ⋮     │
│      │       │       │            │   │      │        │
│      │       │       │            │   │      ├─→Delete│
│      │       │       │            │   │      │        │
│Vue   │2/01/26│Online │     [8]    │∞  │●●●● │  ⋮     │
│      │       │       │            │   │      │        │
│      │       │       │            │   │      ├─→Delete│
└──────────────────────────────────────────────────────────┘
```

## ➕ Create Event Dialog

```
┌─────────────────────────────────────┐
│ Create New Event                    │
├─────────────────────────────────────┤
│                                     │
│ Event Title *                       │
│ [________________________]          │
│                                     │
│ Description *                       │
│ [________________________]          │
│ [________________________]          │
│                                     │
│ Event Date *                        │
│ [2026-01-25T14:00]                │
│                                     │
│ Location *                          │
│ [________________________]          │
│                                     │
│ Location Type                       │
│ [▼ In-Person ▼]                   │
│                                     │
│ Max Attendees (Optional)            │
│ [_________]                        │
│                                     │
│              [Cancel]  [Create Event]│
└─────────────────────────────────────┘
```

## 📊 CSV Export Flow

```
Step 1: Click "Export to CSV"
            ↓
Step 2: File downloads
            ↓
Step 3: File name: "events-report-2026-01-24.csv"
            ↓
Step 4a: Open in Google Sheets
         Open sheets.google.com
         Click + New
         Click File upload
         Select the CSV
         ✓ DONE
            ↓
Step 4b: Open in Excel/LibreOffice
         Double-click the CSV
         Opens in spreadsheet app
         ✓ DONE
            ↓
Step 5: Data is formatted and ready to use
        Columns: ID, Title, Date, Location, etc.
```

## 🔐 Access Control Flow

```
User visits /admin/control-center
         ↓
   Is user logged in?
   No → Redirect to Login
   Yes → Continue
         ↓
   Does user have 'admin' role?
   No → Redirect to Home page
   Yes → Show Control Center ✓
         ↓
   Display all features:
   ✓ Posts table with delete
   ✓ Events table with delete & create
   ✓ Export buttons
   ✓ Participant counts
```

## 📱 Responsive Behavior

### Desktop View (1200px+)
```
[Sidebar] [Main Content - Full Width Table]
```

### Tablet View (768px-1199px)
```
[Hamburger] [Content - Scrollable Table]
```

### Mobile View (<768px)
```
[Hamburger] [Content - Stacked Table Columns]
           [Horizontal Scroll for Full Table]
```

## 🎯 User Journey

### First Time Admin
```
1. Receive SQL command email
2. Open Supabase dashboard
3. Paste SQL → Execute
4. Log back into website
5. Click "Control Center" in sidebar
6. See new admin dashboard
7. Create an event
8. Export data to Google Sheets
9. ✓ Fully functional!
```

### Regular Usage
```
Monday: Create event → Export → Share with team
Wednesday: Delete spam post → Export updated data
Friday: Check participant counts → Export for report
```

## 🔄 Data Flow

```
Frontend (React)
      ↓
  Admin Control Center Component
      ├─→ fetchData() 
      │     ↓
      │  Supabase Client
      │     ↓
      │  PostgreSQL Database
      │     ├─ posts table
      │     ├─ events table
      │     └─ event_registrations table
      │     ↓
      │  Returns data with counts
      ↓
  Display in Tables
      ↓
  User Actions
      ├─→ Delete → SQL DELETE query
      ├─→ Create → SQL INSERT query
      └─→ Export → CSV conversion & download
```

## ⌨️ Keyboard Shortcuts (Future)

```
Planned shortcuts (not yet implemented):
Ctrl+E → Export current tab
Ctrl+D → Delete focused item
Ctrl+N → New event dialog
/ → Focus search (future)
```

## 🎨 Color Scheme

```
Status Badges:
├─ Published: Primary color (teal/blue)
├─ Pending: Secondary color (gray)
└─ Approved: Success color (green)

Buttons:
├─ Primary actions: Solid blue
├─ Secondary actions: Outlined
└─ Destructive: Red on hover

Text:
├─ Headings: Bold, dark
├─ Body text: Regular, gray
└─ Status: Color-coded badges
```

## 📊 CSV File Examples

### posts-report-2026-01-24.csv
```
"ID","Title","Content","Author","Created Date","Status"
"abc123","React Hooks","Learn how to use React Hooks...","user123","1/24/2026","published"
"def456","Vue 3 Tips","Vue 3 has great features...","user456","1/23/2026","published"
```

### events-report-2026-01-24.csv
```
"ID","Title","Description","Date","Location","Location Type","Participants","Max Attendees","Status"
"evt1","React Meetup","Join us for React discussion","1/25/2026","New York","in-person","15","50","published"
"evt2","Web Dev Workshop","Learn web development","2/01/2026","Online","virtual","8","unlimited","published"
```

## ✨ Visual Indicators

```
Icons Used:
├─ ⋮ (More menu) → DropdownMenu
├─ 🗑️ (Trash) → Delete action
├─ ⬇️ (Download) → Export action
├─ ➕ (Plus) → Create action
├─ 👥 (Users) → Participants column
├─ 📅 (Calendar) → Events tab
└─ 📝 (Document) → Posts tab

Status Colors:
├─ Blue ●●●● → Published/Active
├─ Yellow ●●●● → Pending
└─ Red ●●●● → Rejected/Deleted

Loading States:
├─ Skeleton loaders (planned)
├─ Spinner animations (current)
└─ "Loading..." text
```

---

**This visual guide helps understand the layout and flow of the Admin Control Center!**
