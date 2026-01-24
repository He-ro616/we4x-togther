# 📚 COMPLETE DATABASE SETUP GUIDE

## 🎯 ALL TABLES TO CREATE

Your app needs **7 tables**. Here they all are:

---

## 1️⃣ **PROFILES TABLE**
Stores user profile information

```
user_id           - Links to auth user
username          - Unique username
full_name         - User's full name
bio               - User bio/about
avatar_url        - Profile picture
location          - User location
website           - User website
github_url        - GitHub profile link
linkedin_url      - LinkedIn profile link
twitter_url       - Twitter profile link
created_at        - When created
updated_at        - Last updated
```

---

## 2️⃣ **USER_ROLES TABLE**
Assigns roles to users (admin, moderator, user)

```
user_id           - Which user
role              - admin / moderator / user
created_at        - When assigned
```

---

## 3️⃣ **EVENTS TABLE**
Community events/meetups

```
title             - Event title
description       - Event description
short_description - Summary
image_url         - Event image
location          - Where it's happening
location_type     - in-person / virtual / hybrid
event_date        - When event starts
end_date          - When event ends
max_attendees     - Max people allowed
registration_deadline - When to stop registering
is_featured       - Show on homepage?
is_published      - Visible to users?
tags              - Event tags
created_by        - Who created it
created_at        - When created
updated_at        - Last updated
```

---

## 4️⃣ **EVENT_REGISTRATIONS TABLE**
People registered for events

```
event_id          - Which event
user_id           - Which user
status            - registered / attended / cancelled
registered_at     - When they registered
```

---

## 5️⃣ **POSTS TABLE**
Community posts/blog

```
title             - Post title
content           - Post content/body
excerpt           - Short preview
image_url         - Featured image
event_id          - Related event (optional)
author_id         - Who wrote it
is_published      - Visible to users?
tags              - Post tags
likes_count       - Number of likes
comments_count    - Number of comments
created_at        - When created
updated_at        - Last updated
```

---

## 6️⃣ **POST_LIKES TABLE**
Tracks who liked which posts

```
post_id           - Which post
user_id           - Who liked it
created_at        - When they liked it
```

---

## 7️⃣ **COMMENTS TABLE**
Comments on posts

```
post_id           - Which post
user_id           - Who commented
content           - Comment text
created_at        - When posted
updated_at        - Last edited
```

---

## 🚀 HOW TO CREATE ALL TABLES

### Option 1: EASIEST (Recommended)

**In Supabase Dashboard:**

1. Go: https://app.supabase.com
2. SQL Editor → New Query
3. Copy: `supabase/migrations/20260121170923_f5dea7cb-2504-4474-8600-f61d2a66a5d9.sql`
4. Paste in editor
5. Run: Ctrl+Enter
6. New Query
7. Copy: `supabase/migrations/20260121170940_a75d812a-f5b9-4322-aa9b-950e327845eb.sql`
8. Paste and run

✅ **All 7 tables created!**

---

### Option 2: Using CLI

```bash
npm install -g supabase
supabase login
cd community-connect-hub-main
supabase link --project-ref kobvbghyzxmddyyfnbnf
supabase db push
```

✅ **All 7 tables created!**

---

### Option 3: Using psql

```bash
psql -h db.kobvbghyzxmddyyfnbnf.supabase.co \
     -U postgres \
     -d postgres \
     -f supabase/migrations/20260121170923_f5dea7cb-2504-4474-8600-f61d2a66a5d9.sql

psql -h db.kobvbghyzxmddyyfnbnf.supabase.co \
     -U postgres \
     -d postgres \
     -f supabase/migrations/20260121170940_a75d812a-f5b9-4322-aa9b-950e327845eb.sql
```

✅ **All 7 tables created!**

---

## ✅ VERIFY TABLES CREATED

### In Supabase Dashboard:

1. Click: **Table Editor** (left sidebar)
2. Look for these tables:
   - ✅ profiles
   - ✅ user_roles
   - ✅ events
   - ✅ event_registrations
   - ✅ posts
   - ✅ post_likes
   - ✅ comments

### Using SQL Query:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Should return: **7 tables**

---

## 🔒 WHAT'S INCLUDED

Each table has:
- ✅ **RLS (Row-Level Security)** - Users can only see/edit their data
- ✅ **Policies** - Admin-only operations protected
- ✅ **Triggers** - Automatic timestamp updates
- ✅ **Constraints** - Data integrity

---

## 📊 TABLE RELATIONSHIPS

```
auth.users (Supabase built-in)
  ↓
profiles (1:1) - One profile per user
  ↓
user_roles (1:N) - User can have roles
  ↓
posts (1:N) - User can create many posts
  ├─ post_likes (N:N) - Many users like many posts
  └─ comments (1:N) - Many comments per post
  
events (1:N) - User creates events
  └─ event_registrations (N:N) - Many users register for many events
```

---

## 🎯 APP WORKFLOW

```
User Signs Up
  ↓
Profile created automatically
  ↓
Default role assigned (user)
  ↓
User can:
  ├─ Create posts → stored in posts table
  ├─ Like posts → stored in post_likes table
  ├─ Comment → stored in comments table
  ├─ Create events → stored in events table
  └─ Register for events → stored in event_registrations table

Admin can:
  └─ Manage everything
```

---

## 📝 QUICK CHECKLIST

Before launching:
- [ ] All 7 tables created
- [ ] All tables have 🔒 RLS enabled
- [ ] Can see tables in Table Editor
- [ ] Google OAuth configured
- [ ] App runs: `npm run dev`
- [ ] Can sign up with Google
- [ ] Can create post
- [ ] Can like post

---

## 🚀 NEXT STEPS AFTER TABLES

1. **Configure Google OAuth** (3 min)
   ```
   Supabase: Settings → Authentication → Google
   Add redirect: http://localhost:5173/auth/callback
   ```

2. **Run Application** (2 min)
   ```bash
   npm run dev
   ```

3. **Test Features** (10 min)
   - Sign up
   - Create post
   - Like post
   - Comment

---

## 🆘 TROUBLESHOOTING

### Tables not showing?
- Refresh page (F5)
- Wait 10 seconds
- Check SQL Editor for errors

### Getting permission denied?
- Make sure you're logged in as project owner
- Try logging out and back in

### SQL error?
- Make sure you copied entire migration file
- Check for extra spaces or characters
- Try in new query window

### Can't see columns?
- Click the table name to expand
- All columns should be listed

---

## 📞 HELP

- Quick reference: `QUICK_TABLE_SETUP.md`
- Detailed steps: `CREATE_TABLES.md`
- Visual guide: `TABLE_CREATION_VISUAL.md`
- General help: `FAST_TRACK.md`

---

**Ready? Start with: `QUICK_TABLE_SETUP.md`** 🚀

It's just 5 minutes to create all tables!
