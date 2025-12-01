# Fix Profile Update Permission Issue

The profile update is failing due to RLS (Row Level Security) policy restrictions. You need to update the policy in your Supabase database.

## Steps to Fix:

1. **Go to Supabase Dashboard**
   - Open your project at https://supabase.com/dashboard
   - Navigate to: **SQL Editor**

2. **Run This SQL Command:**

```sql
-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a new policy that allows updating all fields
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

3. **Click "Run"**

This will allow users to update their `name` and `student_id` fields in the profiles table.

## What This Does:
- `USING (auth.uid() = id)` - Allows seeing your own profile
- `WITH CHECK (auth.uid() = id)` - Allows updating your own profile fields

After running this, your profile update should work!
