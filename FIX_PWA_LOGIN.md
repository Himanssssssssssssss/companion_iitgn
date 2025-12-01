# Fix PWA Login Stuck Issue

## Problem:
Login works in browser but gets stuck when app is installed via "Add to Home Screen" (PWA mode).

## Root Cause:
Supabase authentication redirects are not configured for the standalone PWA app.

## Solution:

### Step 1: Configure Supabase Redirect URLs

1. **Go to Supabase Dashboard**
   - Open: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication Settings**
   - Click: **Authentication** (left sidebar)
   - Click: **URL Configuration**

3. **Add Redirect URLs**
   
   In the **"Redirect URLs"** section, add these URLs:
   
   ```
   http://localhost:3000
   https://your-app-name.vercel.app
   https://your-custom-domain.com
   ```
   
   **Important**: Add ALL URLs where your app will run (local, Vercel, custom domain)

4. **Click "Save"**

### Step 2: Verify Site URL

In the same page, set your **Site URL** to:
```
https://your-app-name.vercel.app
```
(or your production URL)

### Step 3: Clear App Data & Reinstall

On your phone:
1. **Remove** the installed PWA app
2. **Clear browser cache**
3. Open the web app again
4. **Add to Home Screen** again
5. Try logging in

---

## Alternative: Disable Email Confirmation (Optional)

If you're still having issues, you can disable email confirmation for testing:

1. Go to: **Authentication** → **Providers** → **Email**
2. Turn OFF "Confirm email"
3. Save

**Note**: Only do this for development. Re-enable for production!

---

## Still Not Working?

Check browser console for errors:
- On phone: Use Remote Debugging (Chrome DevTools)
- Look for CORS or redirect errors
