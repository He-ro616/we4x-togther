# 🎯 QUICK START: Admin Control Center

## What You Just Got
A brand new **Admin Control Center** page with:
- 📝 Delete posts
- 📅 Add events
- 👥 See participant numbers
- 📊 Export data to Google Sheets/CSV

---

## ⚡ Setup (2 Minutes)

### 1️⃣ Grant Admin Role to Your Account

Go to your **Supabase Dashboard** → **SQL Editor** and run this:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'shivanshkushwaha518@gmail.com'),
  'admin'
)
ON CONFLICT (user_id, role) DO NOTHING;
```

Then click **Execute** ✓

### 2️⃣ Access the Control Center

1. Log into your website
2. Click **"Control Center"** in the admin menu
3. OR go to: `https://yoursite.com/admin/control-center`

---

## 🎮 How to Use

### Delete a Post
1. Go to **Posts** tab
2. Find the post you want to delete
3. Click the **⋮ menu** → **Delete Post**
4. Confirm deletion

### Create an Event
1. Go to **Events** tab
2. Click **+ Create Event** button
3. Fill in:
   - Event Title
   - Description
   - Date & Time
   - Location
   - Location Type (In-person/Virtual/Hybrid)
   - Max Attendees (optional)
4. Click **Create Event**

### See Participant Numbers
In the **Events** tab, look at the **Participants** column - shows count of registered attendees

### Export to Google Sheets
1. Click **Export to CSV** (on Posts or Events tab)
2. A CSV file downloads
3. Open [Google Sheets](https://sheets.google.com)
4. Click **+ New → File upload**
5. Upload the CSV file
6. Done! It's now in Google Sheets

---

## 📍 Where Everything Is Located

| Feature | URL |
|---------|-----|
| Control Center | `/admin/control-center` |
| Main Admin Dashboard | `/admin` |
| All Admin Links | Sidebar → Control Center |

---

## 🚨 Important Notes

⚠️ **Deletions are permanent** - Use carefully!
- Posts deleted cannot be recovered
- Events deleted cannot be recovered

✅ **Events created by admin:**
- Automatically published
- Automatically approved
- Appear on the platform immediately

✅ **CSV Export:**
- Works with Google Sheets
- Works with Excel
- Contains all important data (dates, participants, etc.)

---

## ❓ FAQ

**Q: What if I don't see the Control Center menu?**
A: Make sure you ran the SQL command to add the admin role. Then log out and log back in.

**Q: Can I edit posts/events from the control center?**
A: Currently you can create events and delete posts/events. Full editing coming soon.

**Q: Does CSV export include all data?**
A: Yes! All columns like ID, Title, Dates, Participants, etc. are included.

**Q: Can I undo a deletion?**
A: No - deletions are permanent. Be careful!

**Q: How do I use the exported CSV in Google Sheets?**
A: Download the CSV, go to sheets.google.com, click File Upload, and select the CSV.

---

## 📚 More Info

See these files for detailed information:
- **ADMIN_SETUP.md** - Detailed setup & troubleshooting
- **ADMIN_CONTROL_CENTER.md** - Complete feature documentation
- **README.md** - General project info

---

## ✨ You're All Set!

Your Admin Control Center is ready to use. Log in and check it out! 🎉
