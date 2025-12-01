# URGENT: Fix Profile Access RLS Policy

## The Problem
Login auth succeeds but profile fetch hangs. This is because RLS (Row Level Security) is blocking profile reads.

## The Fix

Run this SQL in **Supabase Dashboard → SQL Editor**:

```sql
-- First, check if policy exists and drop it
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a new policy that allows SELECT
CREATE POLICY "Users can view their own profile"
  ON public.profiles 
  FOR SELECT
  USING (auth.uid() = id);

-- Also ensure UPDATE policy exists
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
  ON public.profiles 
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- And INSERT policy for new signups
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile"
  ON public.profiles 
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## Verify It Works

After running the SQL:
1. Clear browser cache
2. Try logging in again
3. Should work immediately!

## Why This Fixes It

The RLS policy wasn't allowing users to SELECT (read) their own profile, so the fetch was being blocked by Supabase security, causing login to hang forever.
