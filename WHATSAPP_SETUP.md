# WhatsApp Community Feature Setup

## Database Setup Required

You need to create the `app_settings` table in your Supabase database. Run the following SQL in your Supabase SQL Editor:

```sql
-- Create app_settings table
CREATE TABLE public.app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view settings" ON public.app_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can update settings" ON public.app_settings
    FOR UPDATE USING (
        public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "Admins can insert settings" ON public.app_settings
    FOR INSERT WITH CHECK (
        public.has_role(auth.uid(), 'admin')
    );

-- Update timestamp trigger
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

## Features Added

### 1. **Admin Dashboard Settings Tab**
- Navigate to `/admin/control-center`
- Click the "Settings" tab
- Enter your WhatsApp community link (e.g., `https://chat.whatsapp.com/AbCdEfGhIjK`)
- Click "Save WhatsApp Link"

### 2. **Home Page WhatsApp Button**
- When the WhatsApp link is configured, a "Join WhatsApp" button appears on the home page
- The button opens the WhatsApp community link in a new tab
- Button only shows if a link is configured (doesn't clutter if not set)

### 3. **Responsive Design**
- Works on all devices (mobile, tablet, desktop)
- Integrated with existing responsive button layout

## How to Get a WhatsApp Community Link

1. Open WhatsApp and create a new community
2. Click the menu (three dots) → Settings
3. Select "Invite via link"
4. Copy the generated link
5. Paste it into the admin Settings tab

## Testing

1. **Admin Setup:**
   - Log in as admin
   - Go to `/admin/control-center`
   - Click "Settings" tab
   - Paste your WhatsApp link
   - Click "Save WhatsApp Link"

2. **User View:**
   - Visit the home page
   - Should see "Join WhatsApp" button appear
   - Click it to open WhatsApp community

## Technical Details

- WhatsApp link is stored in `app_settings` table with key `whatsapp_link`
- Frontend fetches the link on component mount
- Button only renders if link exists
- Uses green styling for WhatsApp brand recognition
- Fully responsive with Tailwind CSS breakpoints

## Files Modified

### Backend/Database:
- Created `app_settings` table in Supabase

### Frontend Components:
- `src/pages/admin/ControlCenter.tsx` - Added Settings tab
- `src/components/home/HeroSection.tsx` - Added WhatsApp button
- `src/lib/supabase-types.ts` - Added `AppSettings` interface
