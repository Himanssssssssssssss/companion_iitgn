-- IITGN Companion App - Supabase Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  id_card_url TEXT,
  qr_code_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BUS SCHEDULES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bus_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_type TEXT NOT NULL CHECK (route_type IN ('CAMPUS', 'KUDASAN')),
  source TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIME NOT NULL,
  display_time TEXT NOT NULL,
  bus_type TEXT NOT NULL CHECK (bus_type IN ('56-Seater', '29-Seater', 'EECO')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'delayed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MESS MENU TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.mess_menu (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER')),
  date DATE NOT NULL,
  items JSONB NOT NULL,
  timings TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(meal_type, date)
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  venue TEXT,
  category TEXT CHECK (category IN ('Cultural', 'Academic', 'Sports', 'Technical', 'Other')),
  poster_url TEXT,
  organizer_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHECKLIST ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MESS ENTRY LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.mess_entry_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  entry_time TIMESTAMPTZ DEFAULT NOW(),
  meal_type TEXT,
  verified_by UUID REFERENCES public.profiles(id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_entry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- CHECKLIST POLICIES
CREATE POLICY "Users can view their own checklist"
  ON public.checklist_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON public.checklist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.checklist_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON public.checklist_items FOR DELETE
  USING (auth.uid() = user_id);

-- MESS ENTRY LOGS POLICIES
CREATE POLICY "Users can view their own mess entries"
  ON public.mess_entry_logs FOR SELECT
  USING (auth.uid() = user_id);

-- BUS SCHEDULES - Public read access
CREATE POLICY "Anyone can view bus schedules"
  ON public.bus_schedules FOR SELECT
  TO authenticated
  USING (true);

-- MESS MENU - Public read access
CREATE POLICY "Anyone can view mess menu"
  ON public.mess_menu FOR SELECT
  TO authenticated
  USING (true);

-- EVENTS - Public read access
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Trigger to create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, student_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Student'),
    COALESCE(NEW.raw_user_meta_data->>'student_id', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.checklist_items;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.checklist_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage bucket for ID cards and QR codes
INSERT INTO storage.buckets (id, name, public)
VALUES ('id-cards', 'id-cards', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for id-cards bucket
CREATE POLICY "Users can upload their own ID cards"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'id-cards' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own ID cards"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'id-cards' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own ID cards"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'id-cards' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own ID cards"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'id-cards' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Insert sample events
INSERT INTO public.events (title, description, date, time, venue, category, poster_url, organizer_contact)
VALUES
  ('Blithchron 2024', 'Annual cultural celebration', '2024-02-14', '18:00', 'Open Air Theatre', 'Cultural', 'https://picsum.photos/400/200?random=1', 'cultural@iitgn.ac.in'),
  ('Guest Lecture: AI Ethics', 'Distinguished speaker on AI ethics', '2024-02-15', '16:00', 'Jibben Auditorium', 'Academic', 'https://picsum.photos/400/200?random=2', 'academics@iitgn.ac.in'),
  ('Inter-Hostel Cricket', 'Annual cricket tournament', '2024-02-16', '09:00', 'Sports Complex', 'Sports', 'https://picsum.photos/400/200?random=3', 'sports@iitgn.ac.in')
ON CONFLICT DO NOTHING;

-- Schema creation complete!
-- Next: Add your Supabase URL and anon key to .env.local
