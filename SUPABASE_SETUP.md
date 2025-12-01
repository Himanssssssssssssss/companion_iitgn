# Supabase Setup Guide for IITGN Companion App

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (or create an account)
2. Click "New Project"
3. Fill in the details:
   - **Name**: `iitgn-companion` (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to India (e.g., Mumbai or Singapore)
4. Click "Create new project" and wait ~2 minutes for setup

## Step 2: Run the SQL Schema

1. In your Supabase project, go to the **SQL Editor** tab (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" (or press Ctrl+Enter)
6. Wait for execution to complete (should see "Success" message)

This creates:
- ✅ All database tables (profiles, bus_schedules, mess_menu, events, checklist_items, mess_entry_logs)
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for auto-updating profiles
- ✅ Storage bucket for ID cards and QR codes
- ✅ Sample event data

## Step 3: Get Your API Credentials

1. Go to **Settings** > **API** (left sidebar)
2. Find the "Project API keys" section
3. Copy these two values:
   - **Project URL**: Something like `https://xxxxx.supabase.co`
   - **anon public**: The long API key (starts with `eyJ...`)

## Step 4: Update Your .env.local File

1. Open `.env.local` in your project root
2. Replace the placeholders with your actual values:

```env
GEMINI_API_KEY=your-existing-gemini-key

# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file

## Step 5: Restart the Dev Server

```bash
# If the dev server is running, stop it (Ctrl+C)
# Then restart:
npm run dev
```

## Step 6: Test the App

1. Open http://localhost:3000
2. Try signing up with:
   - Name: "Test Student"
   - Student ID: "23110123"
   - Email: "test@example.com"
   - Password: "test123"
3. You should be logged in!
4. Check Supabase Dashboard:
   - Go to **Authentication** > **Users** - You should see your new user
   - Go to **Database** > **Table Editor** > **profiles** - You should see your profile

## Step 7: Upload Test Data (Optional)

### Bus Schedules
Go to **Table Editor** > **bus_schedules** and manually add some buses, or use SQL:

```sql
INSERT INTO public.bus_schedules (route_type, source, destination, departure_time, display_time, bus_type)
VALUES
  ('CAMPUS', 'Campus', 'JRHA', '08:55:00', '08:55 AM', '29-Seater'),
  ('CAMPUS', 'JRHA', 'Campus', '08:45:00', '08:45 AM', 'EECO'),
  ('KUDASAN', 'Campus', 'Kudasan', '09:00:00', '09:00 AM', '56-Seater'),
  ('KUDASAN', 'Kudasan', 'Campus', '09:30:00', '09:30 AM', '56-Seater');
```

### Mess Menu
```sql
INSERT INTO public.mess_menu (meal_type, date,items, timings)
VALUES
  ('BREAKFAST', CURRENT_DATE, '["Aloo Paratha", "Curd", "Pickle", "Tea/Coffee"]', '7:30 AM - 9:30 AM'),
  ('LUNCH', CURRENT_DATE, '["Paneer Makhani", "Dal Tadka", "Rice", "Roti"]', '12:30 PM - 2:30 PM'),
  ('SNACKS', CURRENT_DATE, '["Samosa", "Tea/Coffee"]', '4:30 PM - 6:00 PM'),
  ('DINNER', CURRENT_DATE, '["Kadhai Paneer", "Rice", "Chapati"]', '7:30 PM - 9:30 PM');
```

## Verification Checklist

- [ ] Supabase project created
- [ ] SQL schema executed successfully
- [ ] API credentials copied to .env.local
- [ ] Dev server restarted
- [ ] Successfully signed up a test user
- [ ] User appears in Supabase Authentication tab
- [ ] Profile appears in profiles table
- [ ] (Optional) Bus schedules and mess menu data added

## Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Make sure .env.local has the correct variable names starting with `VITE_`

### Issue: "Failed to create profile"
**Solution**: Check that the SQL schema was executed completely. The trigger `on_auth_user_created` should exist.

### Issue: "Email not confirmed"
**Solution**: In Supabase Dashboard, go to **Authentication** > **Settings** > **Email Auth** and disable "Confirm email" for development.

### Issue: Can't upload images
**Solution**: Verify the storage bucket `id-cards` was created. Check **Storage** tab in Supabase.

---

## Next Steps

After Supabase is set up, we can:
1. Implement ID card and QR code upload in Profile component
2. Update existing components to fetch data from Supabase
3. Add realtime features (live menu updates, etc.)
4. Implement PWA for offline access

## Need Help?

If you encounter any issues, check:
- Supabase project dashboard for error logs
- Browser console for error messages  
- Network tab to see failed API requests
