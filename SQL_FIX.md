# ✅ Fixed SQL - App Settings Table

## Issue
The SQL had a syntax error. Here's the **corrected version**:

---

## ✅ CORRECT SQL - Copy This Exactly

Run this SQL in Supabase SQL Editor (one section at a time):

### Step 1: Create Table
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

### Step 2: Enable RLS
```sql
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
```

### Step 3: Create Read Policy
```sql
CREATE POLICY "Anyone can view settings" ON public.app_settings
    FOR SELECT USING (true);
```

### Step 4: Create Admin Update Policy
```sql
CREATE POLICY "Admins can update settings" ON public.app_settings
    FOR UPDATE USING (
        public.has_role(auth.uid(), 'admin')
    );
```

### Step 5: Create Admin Insert Policy
```sql
CREATE POLICY "Admins can insert settings" ON public.app_settings
    FOR INSERT WITH CHECK (
        public.has_role(auth.uid(), 'admin')
    );
```

### Step 6: Create Trigger
```sql
CREATE TRIGGER update_app_settings_updated_at 
BEFORE UPDATE ON public.app_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

---

## 📋 How to Run

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. **Copy and paste ONE section above** (Step 1 first)
4. Click **Run**
5. Wait for success message
6. **Repeat for Steps 2-6**

---

## ⚠️ If You Still Get Errors

### Error: "type app_role already exists"
**Solution**: Skip this, it means the type already exists. Continue with next step.

### Error: "function update_updated_at_column does not exist"
**Solution**: This function might not exist yet. Run this first:

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Then try Step 6 again.

### Error: "has_role function does not exist"
**Solution**: This means you haven't created the user role system yet. Check if you ran the admin setup SQL from `ADMIN_SETUP.md`.

---

## ✅ Success Indicators

After each step, you should see:
- ✅ "Query successful"
- ✅ Green checkmark
- ✅ No error messages

---

## 🧪 Test It Works

After all steps, run this test:

```sql
SELECT * FROM public.app_settings;
```

If it returns empty table (no rows, but no errors), you're good! ✅

---

## 🚀 Next Steps

1. ✅ Run all 6 SQL steps above
2. ✅ Go to `/admin/control-center`
3. ✅ Click "Settings" tab
4. ✅ Add your WhatsApp link
5. ✅ Click "Save"

Done! The WhatsApp button will appear on the home page.
