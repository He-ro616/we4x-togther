# Complete Setup & Migration Guide

## ✅ Credentials Already Updated

Your `.env` file has been updated with the new Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID="kobvbghyzxmddyyfnbnf"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_1qcYoeILDsByP1NLfZQIWA_CfFpEXda"
VITE_SUPABASE_URL="https://kobvbghyzxmddyyfnbnf.supabase.co"
```

## 📊 Database Schema Overview

Two migrations are ready to be applied:

### Migration 1: `20260121170923_f5dea7cb-2504-4474-8600-f61d2a66a5d9.sql`
**Creates core database structure:**
- `profiles` - User profile information
- `user_roles` - User role assignments (admin/moderator/user)
- `events` - Community events
- `event_registrations` - Event attendance tracking
- `posts` - Community posts
- `post_likes` - Post like tracking
- `comments` - Post comments
- **Security:** Row-Level Security (RLS) policies for all tables
- **Triggers:** Automatic profile creation on user signup, timestamp updates

### Migration 2: `20260121170940_a75d812a-f5b9-4322-aa9b-950e327845eb.sql`
**Fixes PostgreSQL configuration:**
- Corrects search_path for timestamp trigger function

## 🚀 Apply Migrations - Choose Your Method

### **Method 1: Using Supabase CLI (RECOMMENDED)**

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```
   (You'll be prompted to create an access token from https://app.supabase.com/account/tokens)

3. **Link Your Project**
   ```bash
   cd community-connect-hub-main
   supabase link --project-ref kobvbghyzxmddyyfnbnf
   ```

4. **Apply Migrations**
   ```bash
   supabase db push
   ```

### **Method 2: Using Supabase Dashboard (EASIEST)**

1. Go to: https://app.supabase.com
2. Select your project (kobvbghyzxmddyyfnbnf)
3. Navigate to: **SQL Editor** → **New Query**
4. Copy the entire content from:
   ```
   supabase/migrations/20260121170923_f5dea7cb-2504-4474-8600-f61d2a66a5d9.sql
   ```
5. Run it by pressing `Ctrl+Enter` or clicking **Run**
6. Repeat steps 3-5 for the second migration file

### **Method 3: Using psql (Command Line)**

```bash
# Get your database password from Supabase Dashboard → Settings → Database

psql -h db.kobvbghyzxmddyyfnbnf.supabase.co \
     -U postgres \
     -d postgres \
     -f supabase/migrations/20260121170923_f5dea7cb-2504-4474-8600-f61d2a66a5d9.sql

psql -h db.kobvbghyzxmddyyfnbnf.supabase.co \
     -U postgres \
     -d postgres \
     -f supabase/migrations/20260121170940_a75d812a-f5b9-4322-aa9b-950e327845eb.sql
```

## 📋 What Gets Created

### Tables
| Table | Purpose |
|-------|---------|
| `profiles` | User profile data (name, bio, avatar, links) |
| `user_roles` | Role assignments (admin/moderator/user) |
| `events` | Community events with details |
| `event_registrations` | User event attendance |
| `posts` | Community posts with content |
| `post_likes` | Like tracking for posts |
| `comments` | Comments on posts |

### Security Features
- ✅ Row-Level Security (RLS) on all tables
- ✅ Role-based access control
- ✅ Admin-only operations protected
- ✅ User data isolation

### Automatic Features
- ✅ Profile creation on user signup
- ✅ Default 'user' role assignment on signup
- ✅ Automatic timestamp updates (created_at, updated_at)

## 🧪 Verify Migrations Succeeded

After applying migrations, verify they worked:

### In Supabase Dashboard:
1. Go to **Table Editor**
2. You should see these tables in the left sidebar:
   - `profiles`
   - `user_roles`
   - `events`
   - `event_registrations`
   - `posts`
   - `post_likes`
   - `comments`

### Using psql:
```bash
psql -h db.kobvbghyzxmddyyfnbnf.supabase.co -U postgres -d postgres

# List all tables
\dt public.*

# Show profiles table structure
\d public.profiles

# Exit
\q
```

## 🔐 Configure Google OAuth

After migrations are complete:

1. Go to Supabase Dashboard → Project Settings → Authentication
2. Scroll to **Providers**
3. Click **Google** to enable
4. Add your Google OAuth credentials:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
5. Set **Redirect URI** to your app's domain

## ▶️ Run the Application

```bash
npm install    # Install dependencies
npm run dev    # Start development server
```

Visit: http://localhost:5173

## 📝 Environment Variables

Your `.env` is already configured. Here's what's set:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | https://kobvbghyzxmddyyfnbnf.supabase.co |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | sb_publishable_1qcYoeILDsByP1NLfZQIWA_CfFpEXda |
| `VITE_SUPABASE_PROJECT_ID` | kobvbghyzxmddyyfnbnf |

## 🐛 Troubleshooting

### Migrations fail with "permission denied"
- Make sure you're logged in as the project owner
- Use the correct password for the postgres user

### Tables not appearing in Supabase Dashboard
- Refresh the page (F5)
- Check the SQL Editor to see if migrations ran without errors
- Check the Logs tab for errors

### "VITE_SUPABASE_URL is not defined" error
- Make sure `.env` file exists in project root
- Restart the dev server after updating `.env`
- Clear browser cache (Ctrl+Shift+Delete)

### OAuth not working
- Verify Google OAuth provider is enabled
- Check redirect URI matches your domain exactly
- Check browser console for specific errors

## 📚 Next Steps

1. ✅ Credentials updated
2. 📊 **Run migrations (choose your method above)**
3. 🔐 Configure Google OAuth in Supabase
4. ▶️ Start the dev server
5. 🧪 Test authentication and role-based access

## 📞 Support

For Supabase issues: https://supabase.com/docs
For Google OAuth: https://console.cloud.google.com
