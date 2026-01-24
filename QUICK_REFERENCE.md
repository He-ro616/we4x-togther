# ⚡ Quick Reference Card

## 🔑 Your Credentials

```
Project URL:      https://kobvbghyzxmddyyfnbnf.supabase.co
Project ID:       kobvbghyzxmddyyfnbnf
Publishable Key:  sb_publishable_1qcYoeILDsByP1NLfZQIWA_CfFpEXda
Database Host:    db.kobvbghyzxmddyyfnbnf.supabase.co
```

## 📊 Database Tables

| Table | Purpose | Rows |
|-------|---------|------|
| profiles | User info | users |
| user_roles | Role assignments | role_assignments |
| events | Community events | events |
| event_registrations | Attendances | registrations |
| posts | Community posts | posts |
| post_likes | Post likes | likes |
| comments | Post comments | comments |

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Apply database migrations (using Supabase Dashboard)
# - Go to SQL Editor
# - Run both migration files in supabase/migrations/

# 3. Enable Google OAuth in Supabase

# 4. Start dev server
npm run dev
```

## 🔐 Default Roles

| Role | Access |
|------|--------|
| admin | Everything + admin dashboard |
| moderator | Everything + moderation tools |
| user | Posts, events, dashboard |

## 📍 Key URLs

| Page | URL | Requires Auth |
|------|-----|---------------|
| Home | / | No |
| Login | /login | No |
| Register | /register | No |
| Posts | /posts | No |
| Create Post | /posts/new | Yes |
| Post Detail | /posts/:id | No |
| Dashboard | /dashboard | Yes |
| Profile | /profile | Yes |
| Admin | /admin/* | Yes (admin) |

## 🔗 Database Connections

**Supabase Dashboard:** https://app.supabase.com

**PostgreSQL Connection:**
```
Host: db.kobvbghyzxmddyyfnbnf.supabase.co
Port: 5432
Username: postgres
Database: postgres
```

## 🎯 Features Checklist

✅ Google OAuth  
✅ Role-Based Access Control  
✅ Posts with likes & comments  
✅ Events management  
✅ User profiles  
✅ Row-Level Security  

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Migrations failed | Check SQL Editor logs in Supabase |
| 404 tables not found | Run migrations again |
| Auth not working | Verify .env file has credentials |
| OAuth not working | Enable Google provider in Supabase |

## 🧪 Test Credentials Flow

```
1. Visit http://localhost:5173/login
2. Click "Continue with Google"
3. Authenticate with Google
4. Check if redirected to /admin (if admin) or /dashboard (if user)
5. Verify role-based navigation works
```

## 📞 Emergency Debug

```bash
# Check if env variables are loaded
npm run dev    # Watch for any credential errors in console

# Verify database connection
# Go to Supabase Dashboard → SQL Editor → Run:
SELECT version();

# Check if migrations ran
# Go to Supabase Dashboard → Table Editor
# You should see all 7 tables listed
```

## ✨ You're All Set!

1. Credentials: ✅ Updated
2. Migrations: ⏳ Ready to apply (see SETUP_GUIDE.md)
3. OAuth: ⏳ Configure in Supabase Dashboard
4. App: ⏳ Run with `npm run dev`
