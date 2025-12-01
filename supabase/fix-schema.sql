-- Fix the route_type constraint to include JRHA
-- Run this FIRST before importing bus-schedules-data.sql

ALTER TABLE public.bus_schedules DROP CONSTRAINT IF EXISTS bus_schedules_route_type_check;

ALTER TABLE public.bus_schedules
ADD CONSTRAINT bus_schedules_route_type_check 
CHECK (route_type IN ('CAMPUS', 'KUDASAN', 'JRHA'));

-- Now the table accepts: CAMPUS, KUDASAN, and JRHA route types
