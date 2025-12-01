-- IITGN Real Bus Schedules Data
-- Clear existing data
DELETE FROM public.bus_schedules;

-- ================================================================
-- JRHA (Jeet Royal, Palaj) ↔ Campus (IITGN Mess) Shuttles
-- ================================================================

-- 29-Seater Non AC Bus (JRHA ↔ Campus)
-- Morning Shuttles
INSERT INTO public.bus_schedules (route_type, source, destination, departure_time, display_time, bus_type, status) VALUES
('JRHA', 'JRHA', 'Campus', '08:00:00', '8:00 AM', '29-Seater', 'active'),
('JRHA', 'Campus', 'JRHA', '08:20:00', '8:20 AM', '29-Seater', 'active'),
('JRHA', 'JRHA', 'Campus', '08:40:00', '8:40 AM', '29-Seater', 'active'),
('JRHA', 'Campus', 'JRHA', '09:00:00', '9:00 AM', '29-Seater', 'active'),
('JRHA', 'JRHA', 'Campus', '09:20:00', '9:20 AM', '29-Seater', 'active'),
('JRHA', 'Campus', 'JRHA', '09:40:00', '9:40 AM', '29-Seater', 'active'),
('JRHA', 'JRHA', 'Campus', '10:00:00', '10:00 AM', '29-Seater', 'active'),

-- Afternoon Shuttles
('JRHA', 'Campus', 'JRHA', '12:20:00', '12:20 PM', '29-Seater', 'active'),
('JRHA', 'JRHA', 'Campus', '12:40:00', '12:40 PM', '29-Seater', 'active'),
('JRHA', 'Campus', 'JRHA', '13:00:00', '1:00 PM', '29-Seater', 'active'),
('JRHA', 'JRHA', 'Campus', '13:20:00', '1:20 PM', '29-Seater', 'active'),

-- Evening Shuttles
('JRHA', 'Campus', 'JRHA', '17:00:00', '5:00 PM', '29-Seater', 'active'),
('JRHA', 'JRHA', 'Campus', '17:20:00', '5:20 PM', '29-Seater', 'active'),
('JRHA', 'Campus', 'JRHA', '17:40:00', '5:40 PM', '29-Seater', 'active'),
('JRHA', 'JRHA', 'Campus', '18:00:00', '6:00 PM', '29-Seater', 'active'),
('JRHA', 'Campus', 'JRHA', '18:20:00', '6:20 PM', '29-Seater', 'active'),
('JRHA', 'JRHA', 'Campus', '18:40:00', '6:40 PM', '29-Seater', 'active'),
('JRHA', 'Campus', 'JRHA', '19:00:00', '7:00 PM', '29-Seater', 'active'),
('JRHA', 'JRHA', 'Campus', '19:20:00', '7:20 PM', '29-Seater', 'active'),

-- Night Shuttles
('JRHA', 'Campus', 'JRHA', '21:00:00', '9:00 PM', '29-Seater', 'active'),
('JRHA', 'JRHA', 'Campus', '21:20:00', '9:20 PM', '29-Seater', 'active'),
('JRHA', 'Campus', 'JRHA', '21:40:00', '9:40 PM', '29-Seater', 'active'),
('JRHA', 'JRHA', 'Campus', '22:00:00', '10:00 PM', '29-Seater', 'active'),
('JRHA', 'Campus', 'JRHA', '22:20:00', '10:20 PM', '29-Seater', 'active'),
('JRHA', 'JRHA', 'Campus', '22:40:00', '10:40 PM', '29-Seater', 'active'),
('JRHA', 'Campus', 'JRHA', '23:00:00', '11:00 PM', '29-Seater', 'active'),
('JRHA', 'JRHA', 'Campus', '23:20:00', '11:20 PM', '29-Seater', 'active'),
('JRHA', 'Campus', 'JRHA', '23:40:00', '11:40 PM', '29-Seater', 'active');

-- EECO Shuttle for JRHA (Vehicle 3)
INSERT INTO public.bus_schedules (route_type, source, destination, departure_time, display_time, bus_type, status) VALUES
('JRHA', 'Campus', 'JRHA', '07:50:00', '7:50 AM', 'EECO', 'active'),
('JRHA', 'JRHA', 'Campus', '08:00:00', '8:00 AM', 'EECO', 'active'),
('JRHA', 'Campus', 'JRHA', '10:00:00', '10:00 AM', 'EECO', 'active'),
('JRHA', 'JRHA', 'Campus', '10:30:00', '10:30 AM', 'EECO', 'active'),
('JRHA', 'Campus', 'JRHA', '11:00:00', '11:00 AM', 'EECO', 'active'),
('JRHA', 'JRHA', 'Campus', '11:30:00', '11:30 AM', 'EECO', 'active'),
('JRHA', 'Campus', 'JRHA', '12:30:00', '12:30 PM', 'EECO', 'active'),
('JRHA', 'JRHA', 'Campus', '13:00:00', '1:00 PM', 'EECO', 'active'),
('JRHA', 'Campus', 'JRHA', '14:00:00', '2:00 PM', 'EECO', 'active'),
('JRHA', 'JRHA', 'Campus', '14:30:00', '2:30 PM', 'EECO', 'active'),
('JRHA', 'Campus', 'JRHA', '15:00:00', '3:00 PM', 'EECO', 'active'),
('JRHA', 'JRHA', 'Campus', '15:30:00', '3:30 PM', 'EECO', 'active'),
('JRHA', 'Campus', 'JRHA', '16:00:00', '4:00 PM', 'EECO', 'active'),
('JRHA', 'JRHA', 'Campus', '16:30:00', '4:30 PM', 'EECO', 'active'),
('JRHA', 'Campus', 'JRHA', '17:00:00', '5:00 PM', 'EECO', 'active'),
('JRHA', 'JRHA', 'Campus', '17:30:00', '5:30 PM', 'EECO', 'active'),
('JRHA', 'Campus', 'JRHA', '18:00:00', '6:00 PM', 'EECO', 'active'),
('JRHA', 'JRHA', 'Campus', '18:30:00', '6:30 PM', 'EECO', 'active'),
('JRHA', 'Campus', 'JRHA', '19:00:00', '7:00 PM', 'EECO', 'active'),
('JRHA', 'JRHA', 'Campus', '19:30:00', '7:30 PM', 'EECO', 'active');

-- ================================================================
-- KUDASAN ↔ Campus (via Rakshashakti Circle) - 56-Seater
-- ================================================================
INSERT INTO public.bus_schedules (route_type, source, destination, departure_time, display_time, bus_type, status) VALUES
-- Morning - To Kudasan
('KUDASAN', 'Campus', 'Kudasan', '07:00:00', '7:00 AM', '56-Seater', 'active'),
('KUDASAN', 'Kudasan', 'Campus', '07:30:00', '7:30 AM', '56-Seater', 'active'),
('KUDASAN', 'Campus', 'Kudasan', '08:30:00', '8:30 AM', '56-Seater', 'active'),
('KUDASAN', 'Kudasan', 'Campus', '09:00:00', '9:00 AM', '56-Seater', 'active'),
('KUDASAN', 'Campus', 'Kudasan', '09:30:00', '9:30 AM', '56-Seater', 'active'),
('KUDASAN', 'Kudasan', 'Campus', '10:00:00', '10:00 AM', '56-Seater', 'active'),

-- Evening - To Kudasan
('KUDASAN', 'Campus', 'Kudasan', '16:30:00', '4:30 PM', '56-Seater', 'active'),
('KUDASAN', 'Kudasan', 'Campus', '17:00:00', '5:00 PM', '56-Seater', 'active'),
('KUDASAN', 'Campus', 'Kudasan', '17:45:00', '5:45 PM', '56-Seater', 'active'),
('KUDASAN', 'Kudasan', 'Campus', '18:15:00', '6:15 PM', '56-Seater', 'active'),
('KUDASAN', 'Campus', 'Kudasan', '18:45:00', '6:45 PM', '56-Seater', 'active'),
('KUDASAN', 'Kudasan', 'Campus', '19:15:00', '7:15 PM', '56-Seater', 'active'),
('KUDASAN', 'Campus', 'Kudasan', '19:45:00', '7:45 PM', '56-Seater', 'active'),
('KUDASAN', 'Kudasan', 'Campus', '20:15:00', '8:15 PM', '56-Seater', 'active'),
('KUDASAN', 'Campus', 'Kudasan', '21:30:00', '9:30 PM', '56-Seater', 'active'),
('KUDASAN', 'Kudasan', 'Campus', '22:30:00', '10:30 PM', '56-Seater', 'active');

-- ================================================================
-- KUDASAN ↔ Campus (via Rakshashakti Circle) - 29-Seater
-- ================================================================
INSERT INTO public.bus_schedules (route_type, source, destination, departure_time, display_time, bus_type, status) VALUES
-- Evening 29-seater buses
('KUDASAN', 'Campus', 'Kudasan', '18:30:00', '6:30 PM', '29-Seater', 'active'),
('KUDASAN', 'Kudasan', 'Campus', '19:00:00', '7:00 PM', '29-Seater', 'active'),
('KUDASAN', 'Campus', 'Kudasan', '19:30:00', '7:30 PM', '29-Seater', 'active'),
('KUDASAN', 'Kudasan', 'Campus', '20:00:00', '8:00 PM', '29-Seater', 'active'),
('KUDASAN', 'Campus', 'Kudasan', '20:30:00', '8:30 PM', '29-Seater', 'active'),
('KUDASAN', 'Kudasan', 'Campus', '22:30:00', '10:30 PM', '29-Seater', 'active');

-- Note: All Kudasan routes go via Rakshashakti Circle
-- Route: IITGN Mess Parking → Rakshashakti Circle → Kudasan (and reverse)
