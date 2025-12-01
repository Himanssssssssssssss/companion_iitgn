# Quick Fix: Disable Email Confirmation in Supabase

## The Problem
You can signup but not signin because Supabase requires email confirmation by default.

## The Solution (2 minutes)

1. Go to your Supabase Dashboard
2. Click **Authentication** (left sidebar)
3. Click **Settings** tab
4. Scroll down to **Email Auth**
5. **UNCHECK** the box that says "**Confirm email**"
6. Click **Save**

That's it! Now try signing in again with the same email and password you used to signup.

## Alternative: Confirm Email Manually (if you want to keep confirmation enabled)

1. Go to **Authentication** > **Users**
2. Find your user
3. Click the three dots (...) next to your email
4. Click "Send Magic Link" or manually change "Email Confirmed" to true

---

After this fix, signin should work perfectly!
