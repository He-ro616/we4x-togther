# ⚡ QUICK REFERENCE - CREATE ALL TABLES

## 🎯 THE EASIEST WAY (5 MINUTES)

### Copy-Paste Instructions

**STEP 1:**
```
Go: https://app.supabase.com
Select: kobvbghyzxmddyyfnbnf project
Click: SQL Editor (left sidebar)
Click: New Query
```

**STEP 2:**
```
Open file: supabase/migrations/20260121170923_f5dea7cb-2504-4474-8600-f61d2a66a5d9.sql
Copy ALL content
Paste into SQL editor
Press: Ctrl+Enter
Wait: 2 seconds
✅ See: "Success!" message
```

**STEP 3:**
```
Click: New Query
Open file: supabase/migrations/20260121170940_a75d812a-f5b9-4322-aa9b-950e327845eb.sql
Copy ALL content
Paste into SQL editor
Press: Ctrl+Enter
Wait: 1 second
✅ See: "Success!" message
```

**STEP 4: VERIFY**
```
Click: Table Editor (left sidebar)
Should see 7 tables:
✅ profiles
✅ user_roles
✅ events
✅ event_registrations
✅ posts
✅ post_likes
✅ comments
```

---

## 📊 TABLES CREATED

| Table | Purpose | Rows |
|-------|---------|------|
| profiles | User info | Users |
| user_roles | Role assignments | Admin/Mod/User |
| events | Community events | Events |
| event_registrations | Event signups | Registrations |
| posts | Blog/posts | Posts |
| post_likes | Post likes | Likes |
| comments | Post comments | Comments |

---

## 🔐 SECURITY INCLUDED

Each table has:
- ✅ Row-Level Security (RLS)
- ✅ Access policies
- ✅ Admin controls
- ✅ User isolation

---

## ⏱️ TIMELINE

```
5 minutes total
├─ Step 1: Open dashboard (1 min)
├─ Step 2: Run migration 1 (2 min)
├─ Step 3: Run migration 2 (1 min)
└─ Step 4: Verify (1 min)
```

---

## ❌ COMMON MISTAKES

| Mistake | Fix |
|---------|-----|
| Didn't copy entire file | Copy from first line to last line |
| Pasted into wrong place | Make sure you're in SQL editor |
| Didn't wait for success | Wait for "Success!" message |
| Tables not showing | Refresh page (F5) and wait 10s |
| Wrong project selected | Check project name at top |

---

## 🎉 AFTER TABLES ARE CREATED

Your app can now:
✅ Store user profiles
✅ Manage roles
✅ Create events
✅ Create posts
✅ Like posts
✅ Comment on posts
✅ Register for events

---

## 🔗 NEXT STEPS

1. **Configure Google OAuth** (3 min)
   → `FAST_TRACK.md` Step 2

2. **Run Application** (2 min)
   ```bash
   npm run dev
   ```

3. **Test Everything** (10 min)
   → Create account, post, like, comment

---

**Status: ✅ Ready to create tables**

Open `CREATE_TABLES.md` for detailed steps!
