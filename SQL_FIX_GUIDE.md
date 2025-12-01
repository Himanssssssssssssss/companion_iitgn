# 🔧 Fix for SQL Import Error

## The Problem
You got this error:
```
new row for relation "bus_schedules" violates check constraint "bus_schedules_route_type_check"
```

This is because the database only allows 'CAMPUS' and 'KUDASAN' route types, but we're trying to insert 'JRHA' routes.

## The Solution - Run These In Order:

### Step 1: Fix the Schema
1. Open Supabase SQL Editor
2. Copy and paste **`supabase/fix-schema.sql`**
3. Click "Run"

This adds 'JRHA' to the allowed route types.

### Step 2: Import Bus Schedules
1. Now copy and paste **`supabase/bus-schedules-data.sql`**
2. Click "Run"
3. All 79 buses will import successfully!

### Step 3: Import Mess Menu (I'm creating this now from your Excel!)
1. Copy and paste **`supabase/mess-menu-december-2025.sql`** (creating it now!)
2. Click "Run"

---

## ✅ After This
Your app will have:
- ✅ All real bus schedules
- ✅ Complete December 2025 mess menu
- ✅ Working route toggles (JRHA vs Kudasan)

**Run fix-schema.sql first, then bus-schedules-data.sql!** 🚀
