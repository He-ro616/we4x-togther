# 🏃 FAST TRACK: Run Migrations Now

## ⚡ 3-Step Quick Start (15 minutes)

### Step 1: Apply Migrations (10 min)

#### Option A: Easiest - Supabase Dashboard ⭐

1. Open: https://app.supabase.com
2. Sign in with your account
3. Select project: **kobvbghyzxmddyyfnbnf**
4. Click: **SQL Editor** (left sidebar)
5. Click: **New Query**
6. Copy entire content from: `supabase/migrations/20260121170923_f5dea7cb-2504-4474-8600-f61d2a66a5d9.sql`
7. Paste into editor
8. Run: Press `Ctrl+Enter` or click "RUN"
9. Wait for success message ✅
10. Repeat steps 4-9 for: `supabase/migrations/20260121170940_a75d812a-f5b9-4322-aa9b-950e327845eb.sql`

**Status Check:** Go to **Table Editor** → should see 7 tables:
- ✅ profiles
- ✅ user_roles
- ✅ events
- ✅ event_registrations
- ✅ posts
- ✅ post_likes
- ✅ comments

#### Option B: CLI (if installed)

```bash
npm install -g supabase
supabase login
cd community-connect-hub-main
supabase link --project-ref kobvbghyzxmddyyfnbnf
supabase db push
```

### Step 2: Configure Google OAuth (3 min)

1. In Supabase Dashboard → **Settings** → **Authentication**
2. Scroll to **Providers** section
3. Click **Google** to enable
4. Get credentials from: https://console.cloud.google.com
   - Create a project if you don't have one
   - Go to: APIs & Services → Credentials
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized domain: `localhost:5173` (for dev)
5. Copy **Client ID** and **Client Secret**
6. Paste into Supabase Google provider form
7. Click: **Save**

### Step 3: Run Application (2 min)

```bash
npm install
npm run dev
```

Visit: http://localhost:5173

---

## ✅ Verify Everything Works

### Check 1: Public Pages Load
- [ ] Visit http://localhost:5173 → Home page loads
- [ ] Click "Posts" → Posts page loads
- [ ] Click "Events" → Events page loads

### Check 2: Authentication Works
- [ ] Click "Sign In" → Login page appears
- [ ] See "Continue with Google" button
- [ ] Click it → Google login appears
- [ ] Login with test Google account
- [ ] Get redirected to dashboard or admin panel

### Check 3: Role-Based Access Works
- [ ] Logged in user has role badge
- [ ] Admin users see `/admin` link in navbar
- [ ] Regular users see `/dashboard` link
- [ ] Try accessing `/admin` as regular user → blocked

### Check 4: Post Features Work
- [ ] Create a post: `/posts/new` (if logged in)
- [ ] View post: `/posts/:id`
- [ ] Like post button works
- [ ] Comment button appears
- [ ] Delete post (if author) works

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Table X not found" | Migrations didn't run. Re-run step 1 |
| "Google button missing" | Refresh page (Ctrl+F5) |
| "Can't login with Google" | Enable Google provider in Supabase |
| "Redirects to /login" | Check user_roles table for role |
| "VITE_SUPABASE_URL undefined" | Restart dev server after .env update |

---

## 📋 Credentials Reference

```
Supabase URL: https://kobvbghyzxmddyyfnbnf.supabase.co
Project ID: kobvbghyzxmddyyfnbnf
Anon Key: sb_publishable_1qcYoeILDsByP1NLfZQIWA_CfFpEXda
```

---

## 🎯 Done!

You now have:
✅ Database migrations applied
✅ Google OAuth configured
✅ Application running
✅ Features tested

**Next:** Read `QUICK_REFERENCE.md` for commands & URLs

---

## 🆘 Still Stuck?

1. Check: `SETUP_GUIDE.md` → Troubleshooting section
2. Check: `AUTH_SETUP.md` → OAuth troubleshooting
3. Check: Supabase dashboard logs for errors
4. Check: Browser console (F12) for errors

**Total Time: 15 minutes** ⏱️
