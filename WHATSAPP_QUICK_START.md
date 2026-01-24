# 🚀 WhatsApp Community - Quick Start Guide

## Step 1: Create the Database Table (5 minutes)

Go to **Supabase → SQL Editor** and run **each section below separately** (one at a time):

### Section 1: Create Table
```sql
CREATE TABLE public.app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

### Section 2: Enable RLS
```sql
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
```

### Section 3: Create Policies
```sql
CREATE POLICY "Anyone can view settings" ON public.app_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can update settings" ON public.app_settings
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert settings" ON public.app_settings
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
```

### Section 4: Create Trigger
```sql
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

**⚠️ Run each section separately by copying, pasting, and clicking Run**

## Step 2: Get Your WhatsApp Link (2 minutes)

1. Open WhatsApp on your phone
2. Go to **Communities** → Create a new community
3. Tap menu (3 dots) → **Settings**
4. Select **Invite via link**
5. Copy the link (starts with `https://chat.whatsapp.com/`)

## Step 3: Configure in Admin Panel (1 minute)

1. Go to `http://your-domain.com/admin/control-center`
2. Click **"Settings"** tab
3. Paste your WhatsApp link in the input field
4. Click **"Save WhatsApp Link"**
5. You should see a success message

## Step 4: Test on Home Page (1 minute)

1. Visit your home page
2. You should see a new **"Join WhatsApp"** button
3. Click it - should open your WhatsApp community

## ✅ Done!

Your WhatsApp community is now integrated!

---

## Troubleshooting

**Q: "Join WhatsApp" button doesn't appear?**  
A: Check if you saved the link in admin Settings tab. It might take a few seconds to appear.

**Q: Getting a database error?**  
A: Make sure you ran the SQL above. Check `app_settings` table exists in Supabase.

**Q: Link not saving?**  
A: Make sure you're logged in as an admin user.

**Q: WhatsApp link opens to something blank?**  
A: Check the link format - should start with `https://chat.whatsapp.com/`

---

**For detailed documentation, see WHATSAPP_SETUP.md**
