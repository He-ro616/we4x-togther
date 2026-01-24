# Complete SQL Script - Copy & Paste All

## 📋 Instructions

1. Go to **Supabase Dashboard**
2. Go to **SQL Editor**
3. Click **New Query**
4. **Copy ALL the SQL below**
5. **Paste it all at once**
6. Click **Run**
7. Wait for all to complete (green checkmarks)

---

## ✅ Complete SQL Script

Copy everything below and paste into Supabase SQL Editor:

```sql
-- Create app_settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY IF NOT EXISTS "Anyone can view settings" ON public.app_settings
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Admins can update settings" ON public.app_settings
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY IF NOT EXISTS "Admins can insert settings" ON public.app_settings
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create update function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_app_settings_updated_at ON public.app_settings;
CREATE TRIGGER update_app_settings_updated_at 
BEFORE UPDATE ON public.app_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

---

## ✅ What Should Happen

After running the SQL, you should see:
- ✅ "Query successful" message
- ✅ No red error messages
- ✅ Multiple checkmarks for each statement

---

## 🧪 Verify It Works

Run this query to check the table exists:

```sql
SELECT * FROM public.app_settings;
```

Should return: **Empty table** (no rows yet) - that's correct! ✅

---

## 🚀 Next Steps

1. ✅ Run SQL above
2. ✅ Restart dev server: `npm run dev`
3. ✅ Hard refresh browser: `Ctrl+Shift+R`
4. ✅ Go to `/admin/control-center`
5. ✅ Click **Settings** tab
6. ✅ Paste WhatsApp link
7. ✅ Click **Save**
8. ✅ Go home page, see button

---

**Done! Now the feature should work!** ✅
