# 🖼️ VISUAL GUIDE - CREATE TABLES IN SUPABASE

## STEP-BY-STEP WITH SCREENSHOTS (TEXT VERSION)

---

## 📍 STEP 1: Open Supabase Dashboard

```
Go to: https://app.supabase.com
Sign in with your account
```

**Expected screen:**
```
┌─────────────────────────────────────────────┐
│ Supabase Dashboard                          │
│                                             │
│ [Your Projects]                             │
│ ─ kobvbghyzxmddyyfnbnf ← Select this      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📍 STEP 2: Go to SQL Editor

**In left sidebar, click: SQL Editor**

```
┌──────────────────────┐
│ Project Settings     │
│ Table Editor         │ 
│ SQL Editor    ← HERE │
│ Database            │
│ Auth                │
└──────────────────────┘
```

---

## 📍 STEP 3: Create New Query

**Click: New Query (or + button)**

```
┌─────────────────────────────────────────┐
│ SQL Editor                              │
│                                         │
│ [+ New Query]  [Recent]  [Library]     │
│                                         │
│ ┌─────────────────────────────────────┐│
││                                       ││
││  Paste your SQL here                 ││
││                                       ││
│└─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

## 📍 STEP 4: Copy Migration 1 SQL

**File location:**
```
supabase/migrations/20260121170923_f5dea7cb-2504-4474-8600-f61d2a66a5d9.sql
```

**Contains:**
- Create profiles table
- Create user_roles table
- Create events table
- Create event_registrations table
- Create posts table
- Create post_likes table
- Create comments table
- Add security policies
- Add triggers

---

## 📍 STEP 5: Paste SQL into Editor

**In SQL Editor:**
1. Click in text area
2. Ctrl+A (select all if needed)
3. Ctrl+V (paste)

**You should see hundreds of lines of SQL**

---

## 📍 STEP 6: Run Query

**Press: Ctrl+Enter** 
OR 
**Click: RUN button (top right)**

```
Expected output:
✅ Success!
Query executed successfully in 2s
```

---

## 📍 STEP 7: Create New Query Again

**Click: [+ New Query]**

(You should see query 1 in history)

---

## 📍 STEP 8: Copy Migration 2 SQL

**File location:**
```
supabase/migrations/20260121170940_a75d812a-f5b9-4322-aa9b-950e327845eb.sql
```

**Contains:**
- Fix function search_path

---

## 📍 STEP 9: Paste & Run Migration 2

1. Paste SQL
2. Press Ctrl+Enter OR click RUN

```
Expected output:
✅ Success!
Query executed successfully in 1s
```

---

## ✅ STEP 10: Verify Tables Created

**In left sidebar, click: Table Editor**

```
┌──────────────────────┐
│ Tables:              │
│ ✅ profiles          │
│ ✅ user_roles        │
│ ✅ events            │
│ ✅ event_registrations
│ ✅ posts             │
│ ✅ post_likes        │
│ ✅ comments          │
└──────────────────────┘
```

**All 7 tables should appear!** 🎉

---

## 📊 TABLE PREVIEW

### Click each table to see:

**profiles table:**
```
Columns:
- id (UUID)
- user_id (UUID)
- username (TEXT)
- full_name (TEXT)
- bio (TEXT)
- avatar_url (TEXT)
- location (TEXT)
- website (TEXT)
- github_url (TEXT)
- linkedin_url (TEXT)
- twitter_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

Security: 🔒 RLS Enabled
```

**user_roles table:**
```
Columns:
- id (UUID)
- user_id (UUID)
- role (ENUM: admin, moderator, user)
- created_at (TIMESTAMP)

Security: 🔒 RLS Enabled
```

**events table:**
```
Columns:
- id (UUID)
- title (TEXT)
- description (TEXT)
- short_description (TEXT)
- image_url (TEXT)
- location (TEXT)
- location_type (TEXT)
- event_date (TIMESTAMP)
- end_date (TIMESTAMP)
- max_attendees (INTEGER)
- registration_deadline (TIMESTAMP)
- is_featured (BOOLEAN)
- is_published (BOOLEAN)
- tags (TEXT[])
- created_by (UUID)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

Security: 🔒 RLS Enabled
```

**event_registrations table:**
```
Columns:
- id (UUID)
- event_id (UUID)
- user_id (UUID)
- status (TEXT)
- registered_at (TIMESTAMP)

Security: 🔒 RLS Enabled
```

**posts table:**
```
Columns:
- id (UUID)
- title (TEXT)
- content (TEXT)
- excerpt (TEXT)
- image_url (TEXT)
- event_id (UUID)
- author_id (UUID)
- is_published (BOOLEAN)
- tags (TEXT[])
- likes_count (INTEGER)
- comments_count (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

Security: 🔒 RLS Enabled
```

**post_likes table:**
```
Columns:
- id (UUID)
- post_id (UUID)
- user_id (UUID)
- created_at (TIMESTAMP)

Security: 🔒 RLS Enabled
```

**comments table:**
```
Columns:
- id (UUID)
- post_id (UUID)
- user_id (UUID)
- content (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

Security: 🔒 RLS Enabled
```

---

## 🔒 SECURITY CHECK

For each table:
- Click table name
- Look for 🔒 icon next to name
- Should see "RLS Enabled"

**All 7 tables should have this!**

---

## ⏱️ TIME BREAKDOWN

```
Step 1-2: Open dashboard        1 min
Step 3-6: Run migration 1       2 min
Step 7-9: Run migration 2       1 min
Step 10: Verify tables          1 min
─────────────────────────────────────
TOTAL:                          5 min
```

---

## ✨ DONE!

All tables are now created with:
✅ Columns defined
✅ Security policies
✅ Automatic triggers
✅ Role-based access

---

## 🚀 WHAT'S NEXT?

1. **Configure Google OAuth** (3 min)
   - Supabase: Settings → Authentication → Google
   - Add redirect: http://localhost:5173/auth/callback

2. **Run Application** (2 min)
   ```bash
   npm run dev
   ```

3. **Test Features** (10 min)
   - Sign up with Google
   - Create posts
   - Like posts
   - Add comments

---

## 🆘 PROBLEMS?

### "Error running query"
→ Check if SQL is complete and correct
→ Try in new query window
→ Copy entire migration file again

### "Table not showing"
→ Refresh page (F5)
→ Check Table Editor
→ Wait 10 seconds
→ Try again

### "Rows not showing in table"
→ Normal - tables are empty until app creates data
→ Check Policies (should see green checkmarks)

---

**You're ready! All tables created!** 🎉

Next: `FAST_TRACK.md` Step 2 (Configure OAuth)
