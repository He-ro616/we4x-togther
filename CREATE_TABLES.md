# 🗄️ CREATE ALL DATABASE TABLES - STEP BY STEP

## 📊 TABLES TO BE CREATED

```
✅ profiles         - User profile information
✅ user_roles       - User role assignments (admin/moderator/user)
✅ events           - Community events
✅ event_registrations - Event attendance/signups
✅ posts            - Community posts/blog
✅ post_likes       - Post like tracking
✅ comments         - Post comments
```

---

## 🚀 EASIEST METHOD - Supabase Dashboard

### Step 1: Open Supabase
1. Go: https://app.supabase.com
2. Sign in with your account
3. Select project: **kobvbghyzxmddyyfnbnf**

### Step 2: Go to SQL Editor
1. Left sidebar → Click **SQL Editor**
2. Click **New Query** (or + button)

### Step 3: Run First Migration

**3a. Copy Migration 1:**

Copy entire content from file:
```
supabase/migrations/20260121170923_f5dea7cb-2504-4474-8600-f61d2a66a5d9.sql
```

**3b. Paste into Supabase:**
1. Click in SQL editor
2. Paste the SQL code
3. Press **Ctrl+Enter** OR click **RUN** button

**Result:** Wait for success message ✅

### Step 4: Run Second Migration

**4a. Create New Query:**
1. Click **New Query** again

**4b. Copy Migration 2:**

Copy entire content from file:
```
supabase/migrations/20260121170940_a75d812a-f5b9-4322-aa9b-950e327845eb.sql
```

**4c. Paste and Run:**
1. Paste SQL code
2. Press **Ctrl+Enter**

**Result:** Wait for success message ✅

---

## ✅ VERIFY IT WORKED

### Check 1: See Tables in Dashboard

1. Go to: **Table Editor** (left sidebar)
2. Look for these tables:
   - ✅ profiles
   - ✅ user_roles
   - ✅ events
   - ✅ event_registrations
   - ✅ posts
   - ✅ post_likes
   - ✅ comments

### Check 2: View Table Details

Click any table to see:
- Column names
- Column types
- Security policies (lock icon = RLS enabled)

**All should show lock icons** 🔒

---

## 📋 WHAT EACH TABLE DOES

### 1. profiles
```
Stores user profile information
Columns: user_id, full_name, username, bio, avatar_url, etc.
```

### 2. user_roles
```
Assigns roles to users
Roles: admin, moderator, user
```

### 3. events
```
Community events
Fields: title, description, location, event_date, tags, etc.
```

### 4. event_registrations
```
Users registered for events
Fields: event_id, user_id, status, registered_at
```

### 5. posts
```
Community posts/blog entries
Fields: title, content, excerpt, image_url, likes_count, comments_count
```

### 6. post_likes
```
Tracks who liked which posts
Fields: post_id, user_id, created_at
```

### 7. comments
```
Comments on posts
Fields: post_id, user_id, content, created_at
```

---

## 🔄 SECURITY ALREADY INCLUDED

Each table comes with:
- ✅ **Row-Level Security (RLS)** - Users can only see/edit their own data
- ✅ **Policies** - Admin-only, author-only, or public viewing rules
- ✅ **Triggers** - Automatic timestamp updates
- ✅ **Functions** - Role checking for security

---

## ⚠️ TROUBLESHOOTING

### Issue: "Error running query"

**Solution:**
1. Check SQL syntax is correct
2. Make sure you copied ALL content
3. Try again in new query
4. Check Supabase status page

### Issue: "Table already exists"

**Solution:**
- Table was created successfully in previous run
- You can ignore this error
- Check Table Editor - table should be there

### Issue: "Permission denied"

**Solution:**
1. Make sure you're logged in
2. Make sure you selected correct project
3. Make sure you're project owner
4. Try logging out and back in

### Issue: "Tables not showing in Table Editor"

**Solution:**
1. Refresh page (F5)
2. Click Table Editor again
3. Wait 10 seconds
4. Check if tables appear

---

## 🎯 WHAT'S NEXT

After tables are created:

### 1. Configure Google OAuth ✅
```
Supabase Settings → Authentication → Google → Enable
Add redirect: http://localhost:5173/auth/callback
```

### 2. Run Application ✅
```bash
npm install
npm run dev
```

### 3. Test Features ✅
- Sign up with Google
- Create post
- Like post
- Add comment
- Create event

---

## 📝 MIGRATION FILE CONTENTS

### Migration 1 Creates:
- ✅ `app_role` enum (admin, moderator, user)
- ✅ `profiles` table
- ✅ `user_roles` table
- ✅ `events` table
- ✅ `event_registrations` table
- ✅ `posts` table
- ✅ `post_likes` table
- ✅ `comments` table
- ✅ Row-Level Security policies for all tables
- ✅ Role checking function
- ✅ Timestamp update triggers
- ✅ Auto-profile creation trigger on signup

### Migration 2 Fixes:
- ✅ Function search_path configuration

---

## ✨ QUICK VISUAL GUIDE

```
Supabase Dashboard
    ↓
SQL Editor (Left sidebar)
    ↓
New Query
    ↓
Copy & Paste Migration 1
    ↓
Run (Ctrl+Enter)
    ↓
Success! ✅
    ↓
New Query
    ↓
Copy & Paste Migration 2
    ↓
Run (Ctrl+Enter)
    ↓
Success! ✅
    ↓
Check Table Editor
    ↓
All 7 tables visible! ✅
```

---

## 🎉 YOU'RE DONE!

After migrations are applied:
1. All tables are created
2. Security is enabled
3. Auto-triggers are set up
4. Ready for application use

---

**Time:** 5 minutes
**Difficulty:** Easy
**Next Step:** Configure Google OAuth + Run app

Need help? Check `FAST_TRACK.md`! 🚀
