# Admin Dashboard Analytics 📊

## ✅ New Features Added

Your admin dashboard now displays comprehensive analytics with real-time database integration!

---

## 📈 Dashboard Includes

### **1. Key Metrics Cards (Top Row)**
- **Total Users** - Total community member count (from profiles table)
- **Total Posts** - Total number of discussions (from posts table)
- **Total Events** - Total upcoming events (from events table)
- **Growth Rate** - 30-day growth percentage

### **2. Charts & Visualizations**

#### **User Registrations (Line Chart)**
- Shows new user signups over the last 30 days
- Fetches from `profiles.created_at`
- Helps identify growth trends
- Smooth line with data point markers

#### **User Roles Distribution (Pie Chart)**
- Breakdown of admin, moderator, and user roles
- Fetches from `user_roles` table
- Color-coded segments
- Shows count per role

#### **Posts & Events Comparison (Bar Chart)**
- Dual-axis comparison of posts vs events created
- 30-day view (last 30 days of data)
- Green for posts, orange for events
- Fetches from `posts.created_at` and `events.created_at`

#### **Daily Activity (Bar Chart)**
- Posts created per day over 30 days
- Identify peak activity periods
- Responsive bar visualization
- Data from `posts` table grouped by day

#### **Top Contributors (Leaderboard)**
- Shows top 5 most active community members
- Displays post and event creation counts per user
- Ranked #1, #2, #3, etc.
- Queries `posts` where `author_id = user.id`
- Queries `events` where `created_by = user.id`

---

## 🛠️ Database Queries

### **Total Counts (Real-time)**
```sql
SELECT COUNT(*) FROM profiles
SELECT COUNT(*) FROM posts
SELECT COUNT(*) FROM events
```

### **Time-based Data (Last 30 Days)**
```sql
SELECT created_at FROM profiles WHERE created_at >= now() - interval '30 days'
SELECT created_at FROM posts WHERE created_at >= now() - interval '30 days'
SELECT created_at FROM events WHERE created_at >= now() - interval '30 days'
```

### **User Roles**
```sql
SELECT role, COUNT(*) FROM user_roles GROUP BY role
```

### **Top Contributors**
```sql
SELECT author_id, COUNT(*) FROM posts GROUP BY author_id ORDER BY COUNT DESC LIMIT 10
SELECT created_by, COUNT(*) FROM events GROUP BY created_by ORDER BY COUNT DESC LIMIT 10
```

---

## ✨ How Data Flows

1. **Dashboard Loads**
   - `useEffect` triggers `fetchStats()` on component mount

2. **Database Queries Execute**
   - Count queries (instant results)
   - Time-based queries (last 30 days)
   - Role aggregation queries
   - Top contributor queries

3. **Data Processing**
   - Raw database data is aggregated by day
   - Dates are formatted (e.g., "Jan 15")
   - Data is grouped and sorted chronologically
   - Roles are counted and summarized

4. **State Update**
   - All processed data stored in React state
   - Charts re-render with fresh data
   - Metrics cards display totals

5. **User Sees Charts**
   - All visualizations are interactive
   - Hover to see exact values
   - Responsive across all devices

---

## 🎯 How to Use

1. **Navigate to Admin Dashboard**
   - Go to `/admin/dashboard`

2. **View Metrics**
   - Check key stats in the top cards
   - Scroll down to see all charts
   - Hover over charts to see exact values

3. **Analyze Trends**
   - Use registration chart to track user growth
   - Monitor posts/events activity
   - Identify top contributors for engagement
   - Check role distribution for permission management

---

## 📱 Responsive Design

Dashboard is fully responsive:
- **Mobile** (xs): Single column layout, stacked charts
- **Tablet** (sm-md): 2-column grid
- **Desktop** (lg+): Full multi-chart layout
- All charts scale properly on any screen size

---

## 🔄 Data Refresh

- Charts load automatically on dashboard access
- Data updates reflect real-time database state
- Last 30 days of data is shown in trend charts
- Total counts are always current (no time limit)

---

## 🚀 Future Enhancements

You can add:
- Custom date range filters
- Export analytics as PDF
- Email digest reports
- Real-time data sync with Supabase Realtime
- User engagement heatmaps
- Post/event performance metrics
- Community sentiment analysis
- Interactive date range picker
- Data refresh button

---

## 📍 File Location

**Main file:** `src/pages/admin/Dashboard.tsx` (330+ lines)

**Database tables used:**
- `profiles` - User registrations, total users
- `posts` - Post counts, daily posts
- `events` - Event counts, daily events
- `user_roles` - Role distribution

**Charts library:** Recharts (already installed)

---

## 🎨 Color Scheme

- **Users** - Blue (#3b82f6)
- **Posts** - Green (#10b981)
- **Events** - Orange (#f59e0b)
- **Errors** - Red (#ef4444)
- **Highlights** - Purple (#8b5cf6)
- **Secondary** - Pink (#ec4899)

---

## 🔧 Technical Stack

- **Frontend:** React + TypeScript
- **Charts:** Recharts with ResponsiveContainer
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **State Management:** React useState/useEffect

---

**All set!** Your admin dashboard now pulls real data from your database! 🚀

