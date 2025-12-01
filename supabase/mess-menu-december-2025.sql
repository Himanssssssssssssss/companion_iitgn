-- Complete December 2025 Mess Menu (All 31 Days)
-- Based on weekly repeating pattern from IITGN official menu
DELETE FROM public.mess_menu WHERE date >= '2025-12-01' AND date <= '2025-12-31';

-- WEEK 1: December 1-7, 2025
-- Monday, December 1
INSERT INTO public.mess_menu (meal_type, date, items, timings) VALUES
('BREAKFAST', '2025-12-01', '["Veg Vermicelli Upma", "Green Chutney", "Lemon", "Boiled Chana", "Boiled Eggs", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Chocolate Powder", "Guava"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-01', '["3-Bean Salad", "Masoor Dal", "Sarso Ka Saag", "White Matar Masala", "Steam Rice", "Mint Buttermilk", "Chapati", "Mirchi Lemon Mango Pickle", "Fryums"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-01', '["Bombay Bhel", "Green Chutney + Emli Chutney", "Cold Coffee", "Tea"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-01', '["Beetroot Raddish Salad", "Masoor Dal", "Veg Amritsari", "Bagara Rice", "Multigrain Roti", "Mirchi + Lemon + Pickle", "Tomato Soup with Croutons", "Chicken Angara"]', '7:30 PM - 9:30 PM');

-- Tuesday, December 2
INSERT INTO public.mess_menu (meal_type, date, items, timings) VALUES
('BREAKFAST', '2025-12-02', '["Aloo Onion Paratha", "Curd+Lehsun Chutney", "Pickle", "Egg Bhurjee", "White Bread+Butter+Jam", "Milk+Ginger Tea+Coffee", "Chocos", "Bournvita", "Papaya"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-02', '["Mix Salad", "Dal Palak", "Dry Gobhi Matar Sabzi", "Kala Chana Masala", "Jeera Rice", "Boondi Raita", "Multigrain Roti", "Mirchi Lemon Tomato Pickle", "Fried Papad"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-02', '["Corn Chaat/Boiled Corn", "Lemon+Masala", "Mint Crush", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-02', '["3-Bean Salad", "Pancharatna Dal", "Methi Matar Malai", "Plain Rice", "Multigrain Roti", "Mirchi + Lemon + Pickle", "Moong Daal Ka Halwa", "Chicken Masala"]', '7:30 PM - 9:30 PM');

-- Wednesday, December 3
INSERT INTO public.mess_menu (meal_type, date, items, timings) VALUES
('BREAKFAST', '2025-12-03', '["Tari Poha", "Onions", "Lemon", "Omlette", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Boost", "Orange"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-03', '["Green Salad", "Thoor Dal", "Paneer Masala", "Mix Kathod", "Bagara Rice", "Masala Buttermilk", "Chapati", "Mirchi Lemon Garlic Pickle", "Ramakada"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-03', '["Dahi Papdi Chaat", "Green Chutney + Emli Chutney", "Guava Crush", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-03', '["Onion Tomato Salad", "Dal Fry", "Aalo Palak", "Matar Pulao", "Puri", "Mirchi + Lemon + Pickle", "Sev Boondi / Boondi Laddu", "Hyderabadi Chicken Biryani"]', '7:30 PM - 9:30 PM');

-- Thursday, December 4
INSERT INTO public.mess_menu (meal_type, date, items, timings) VALUES
('BREAKFAST', '2025-12-04', '["Palak Puri", "Aloo Tamatar Sabzi", "Pickle", "Moong Sprouts", "Boiled Eggs", "White Bread+Butter+Jam", "Milk+Ginger Tea+Coffee", "Cornflakes", "Bournvita", "Papaya"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-04', '["Onion Tomato Salad", "Dal Palak", "Mix Veg", "Moong Masala", "Matar Pulav", "Plain Curd", "Chapati", "Mirchi Lemon Lemon Pickle", "Rice Papad"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-04', '["Tandoori Mayo Sandwich", "Ketchup", "Lemonade", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-04', '["Cucumber Beetroot Salad", "Dal Tadka", "Cabbage Tomato Matar Sabzi", "Steamed Rice", "Chapati", "Mirchi + Lemon + Mango Pickle", "Vanilla/Butterscotch Ice Cream", "Fish Curry"]', '7:30 PM - 9:30 PM');

-- Friday, December 5
INSERT INTO public.mess_menu (meal_type, date, items, timings) VALUES
('BREAKFAST', '2025-12-05', '["Idli", "Sambhar+Peanut Chutney", "Soaked Peanuts", "Omlette", "Brown Bread+Butter+Jam", "Milk+Ginger Tea+Coffee", "Chocos", "Bournvita", "Banana"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-05', '["Carrot Radish Salad", "Kadhi Pakoda", "Gujarati Undhiyu", "Rajma Masala", "Steam Rice", "Masala Buttermilk", "Chapati", "Mirchi Lemon Green Chilli Pickle", "Fryums"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-05', '["Moong Dal Vada/Mix Pakoda", "Green Chutney+Ketchup", "Lemonade", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-05', '["Green Salad", "Sambhar + Peanut Chutney / Veg Raita + Lehsun Chatni", "Medu Vada / Bhaji", "Lemon Rice / Veg Pulao", "Masala Dosa / Pav", "Lemon + Mango Pickle / Lemon + Pickle", "Gulab Jamun/Mohanthal", "Chicken Fried Rice"]', '7:30 PM - 9:30 PM');

-- Saturday, December 6
INSERT INTO public.mess_menu (meal_type, date, items, timings) VALUES
('BREAKFAST', '2025-12-06', '["Besan Cheela/Moong Cheela", "Green Chutney", "Pickle", "Boiled Sprouts", "Egg Bhurjee", "White Bread+Butter+Jam", "Milk+Tea+Coffee", "Chocos", "Chocolate Powder", "Orange"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-06', '["Onion Tomato Salad", "Panchratan Dal", "Jeera Pyaaz Aloo", "Amritsari Chole Ki Sabzi", "Plain Rice", "Kesar Lassi", "Bhature", "Green Chuteny Mirchi Lemon Mix-veg Pickle", "Roasted Papad"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-06', '["Maggie Masala", "Ketchup", "Jaljeera", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-06', '["Mix Salad", "Dal Palak", "Kadhai Paneer + Egg Kheema", "Bagara Rice", "Chapati", "Mirchi + Lemon + Mango Pickle", "Seviyaan Kheer / Rice Kheer"]', '7:30 PM - 9:30 PM');

-- Sunday, December 7
INSERT INTO public.mess_menu (meal_type, date, items, timings) VALUES
('BREAKFAST', '2025-12-07', '["Schezwan Butter Dosa/Onion Dosa", "Sambar+Peanut Chutney", "Pickle", "Boiled Eggs", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Boost", "Banana"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-07', '["Beetroot Radish Salad", "Dal Makhani", "Soya Chunks Gravy", "Lobia Masala", "Jeera Rice", "Plain Curd", "Multi Grain Chapati", "Mirchi Lemon Lemon Pickle", "Ramkada"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-07', '["Pani Puri", "Onion + Chat Masala + Ragada+ Sev", "Lemonade", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-07', '["Onion Tomato Salad", "Dal Fry", "Aloo & Spring Onion Sabji", "Jeera Rice", "Chapati", "Mirchi + Lemon + Pickle", "Kesar Jalebi", "Hyderabadi Chicken Biryani"]', '7:30 PM - 9:30 PM');

-- WEEK 2: December 8-14, 2025 (Repeating Monday-Sunday pattern)
INSERT INTO public.mess_menu (meal_type, date, items, timings) VALUES
('BREAKFAST', '2025-12-08', '["Veg Vermicelli Upma", "Green Chutney", "Lemon", "Boiled Chana", "Boiled Eggs", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Chocolate Powder", "Guava"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-08', '["3-Bean Salad", "Masoor Dal", "Sarso Ka Saag", "White Matar Masala", "Steam Rice", "Mint Buttermilk", "Chapati", "Mirchi Lemon Mango Pickle", "Fryums"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-08', '["Bombay Bhel", "Green Chutney + Emli Chutney", "Cold Coffee", "Tea"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-08', '["Beetroot Raddish Salad", "Masoor Dal", "Veg Amritsari", "Bagara Rice", "Multigrain Roti", "Mirchi + Lemon + Pickle", "Tomato Soup with Croutons", "Chicken Angara"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-09', '["Aloo Onion Paratha", "Curd+Lehsun Chutney", "Pickle", "Egg Bhurjee", "White Bread+Butter+Jam", "Milk+Ginger Tea+Coffee", "Chocos", "Bournvita", "Papaya"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-09', '["Mix Salad", "Dal Palak", "Dry Gobhi Matar Sabzi", "Kala Chana Masala", "Jeera Rice", "Boondi Raita", "Multigrain Roti", "Mirchi Lemon Tomato Pickle", "Fried Papad"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-09', '["Corn Chaat/Boiled Corn", "Lemon+Masala", "Mint Crush", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-09', '["3-Bean Salad", "Pancharatna Dal", "Methi Matar Malai", "Plain Rice", "Multigrain Roti", "Mirchi + Lemon + Pickle", "Gajar Ka Halwa", "Chicken Masala"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-10', '["Tari Poha", "Onions", "Lemon", "Omlette", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Boost", "Orange"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-10', '["Green Salad", "Thoor Dal", "Paneer Masala", "Mix Kathod", "Bagara Rice", "Masala Buttermilk", "Chapati", "Mirchi Lemon Garlic Pickle", "Ramakada"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-10', '["Dahi Papdi Chaat", "Green Chutney + Emli Chutney", "Guava Crush", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-10', '["Onion Tomato Salad", "Dal Fry", "Aalo Palak", "Matar Pulao", "Puri", "Mirchi + Lemon + Pickle", "Sev Boondi / Boondi Laddu", "Hyderabadi Chicken Biryani"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-11', '["Palak Puri", "Aloo Tamatar Sabzi", "Pickle", "Moong Sprouts", "Boiled Eggs", "White Bread+Butter+Jam", "Milk+Ginger Tea+Coffee", "Cornflakes", "Bournvita", "Papaya"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-11', '["Onion Tomato Salad", "Dal Palak", "Mix Veg", "Moong Masala", "Matar Pulav", "Plain Curd", "Chapati", "Mirchi Lemon Lemon Pickle", "Rice Papad"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-11', '["Tandoori Mayo Sandwich", "Ketchup", "Lemonade", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-11', '["Cucumber Beetroot Salad", "Dal Tadka", "Cabbage Tomato Matar Sabzi", "Steamed Rice", "Chapati", "Mirchi + Lemon + Mango Pickle", "Vanilla/Butterscotch Ice Cream", "Fish Curry"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-12', '["Idli", "Sambhar+Peanut Chutney", "Soaked Peanuts", "Omlette", "Brown Bread+Butter+Jam", "Milk+Ginger Tea+Coffee", "Chocos", "Bournvita", "Banana"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-12', '["Carrot Radish Salad", "Kadhi Pakoda", "Gujarati Undhiyu", "Rajma Masala", "Steam Rice", "Masala Buttermilk", "Chapati", "Mirchi Lemon Green Chilli Pickle", "Fryums"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-12', '["Moong Dal Vada/Mix Pakoda", "Green Chutney+Ketchup", "Lemonade", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-12', '["Green Salad", "Sambhar + Peanut Chutney / Veg Raita + Lehsun Chatni", "Medu Vada / Bhaji", "Lemon Rice / Veg Pulao", "Masala Dosa / Pav", "Lemon + Mango Pickle / Lemon + Pickle", "Gulab Jamun/Mohanthal", "Chicken Fried Rice"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-13', '["Besan Cheela/Moong Cheela", "Green Chutney", "Pickle", "Boiled Sprouts", "Egg Bhurjee", "White Bread+Butter+Jam", "Milk+Tea+Coffee", "Chocos", "Chocolate Powder", "Orange"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-13', '["Onion Tomato Salad", "Panchratan Dal", "Jeera Pyaaz Aloo", "Amritsari Chole Ki Sabzi", "Plain Rice", "Kesar Lassi", "Bhature", "Green Chuteny Mirchi Lemon Mix-veg Pickle", "Roasted Papad"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-13', '["Maggie Masala", "Ketchup", "Jaljeera", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-13', '["Mix Salad", "Dal Palak", "Kadhai Paneer + Egg Kheema", "Bagara Rice", "Chapati", "Mirchi + Lemon + Mango Pickle", "Seviyaan Kheer / Rice Kheer"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-14', '["Schezwan Butter Dosa/Onion Dosa", "Sambar+Peanut Chutney", "Pickle", "Boiled Eggs", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Boost", "Banana"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-14', '["Beetroot Radish Salad", "Dal Makhani", "Soya Chunks Gravy", "Lobia Masala", "Jeera Rice", "Plain Curd", "Multi Grain Chapati", "Mirchi Lemon Lemon Pickle", "Ramkada"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-14', '["Pani Puri", "Onion + Chat Masala + Ragada+ Sev", "Lemonade", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-14', '["Onion Tomato Salad", "Dal Fry", "Aloo & Spring Onion Sabji", "Jeera Rice", "Chapati", "Mirchi + Lemon + Pickle", "Kesar Jalebi", "Hyderabadi Chicken Biryani"]', '7:30 PM - 9:30 PM');

-- WEEK 3: December 15-21, 2025
INSERT INTO public.mess_menu (meal_type, date, items, timings) VALUES
('BREAKFAST', '2025-12-15', '["Veg Vermicelli Upma", "Green Chutney", "Lemon", "Boiled Chana", "Boiled Eggs", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Chocolate Powder", "Guava"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-15', '["3-Bean Salad", "Masoor Dal", "Sarso Ka Saag", "White Matar Masala", "Steam Rice", "Mint Buttermilk", "Chapati", "Mirchi Lemon Mango Pickle", "Fryums"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-15', '["Bombay Bhel", "Green Chutney + Emli Chutney", "Cold Coffee", "Tea"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-15', '["Beetroot Raddish Salad", "Masoor Dal", "Veg Amritsari", "Bagara Rice", "Multigrain Roti", "Mirchi + Lemon + Pickle", "Tomato Soup with Croutons", "Chicken Angara"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-16', '["Aloo Onion Paratha", "Curd+Lehsun Chutney", "Pickle", "Egg Bhurjee", "White Bread+Butter+Jam", "Milk+Ginger Tea+Coffee", "Chocos", "Bournvita", "Papaya"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-16', '["Mix Salad", "Dal Palak", "Dry Gobhi Matar Sabzi", "Kala Chana Masala", "Jeera Rice", "Boondi Raita", "Multigrain Roti", "Mirchi Lemon Tomato Pickle", "Fried Papad"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-16', '["Corn Chaat/Boiled Corn", "Lemon+Masala", "Mint Crush", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-16', '["3-Bean Salad", "Pancharatna Dal", "Methi Matar Malai", "Plain Rice", "Multigrain Roti", "Mirchi + Lemon + Pickle", "Gajar Ka Halwa", "Chicken Masala"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-17', '["Tari Poha", "Onions", "Lemon", "Omlette", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Boost", "Orange"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-17', '["Green Salad", "Thoor Dal", "Paneer Masala", "Mix Kathod", "Bagara Rice", "Masala Buttermilk", "Chapati", "Mirchi Lemon Garlic Pickle", "Ramakada"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-17', '["Dahi Papdi Chaat", "Green Chutney + Emli Chutney", "Guava Crush", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-17', '["Onion Tomato Salad", "Dal Fry", "Aalo Palak", "Matar Pulao", "Puri", "Mirchi + Lemon + Pickle", "Sev Boondi / Boondi Laddu", "Hyderabadi Chicken Biryani"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-18', '["Palak Puri", "Aloo Tamatar Sabzi", "Pickle", "Moong Sprouts", "Boiled Eggs", "White Bread+Butter+Jam", "Milk+Ginger Tea+Coffee", "Cornflakes", "Bournvita", "Papaya"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-18', '["Onion Tomato Salad", "Dal Palak", "Mix Veg", "Moong Masala", "Matar Pulav", "Plain Curd", "Chapati", "Mirchi Lemon Lemon Pickle", "Rice Papad"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-18', '["Tandoori Mayo Sandwich", "Ketchup", "Lemonade", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-18', '["Cucumber Beetroot Salad", "Dal Tadka", "Cabbage Tomato Matar Sabzi", "Steamed Rice", "Chapati", "Mirchi + Lemon + Mango Pickle", "Vanilla/Butterscotch Ice Cream", "Fish Curry"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-19', '["Idli", "Sambhar+Peanut Chutney", "Soaked Peanuts", "Omlette", "Brown Bread+Butter+Jam", "Milk+Ginger Tea+Coffee", "Chocos", "Bournvita", "Banana"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-19', '["Carrot Radish Salad", "Kadhi Pakoda", "Gujarati Undhiyu", "Rajma Masala", "Steam Rice", "Masala Buttermilk", "Chapati", "Mirchi Lemon Green Chilli Pickle", "Fryums"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-19', '["Moong Dal Vada/Mix Pakoda", "Green Chutney+Ketchup", "Lemonade", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-19', '["Green Salad", "Sambhar + Peanut Chutney / Veg Raita + Lehsun Chatni", "Medu Vada / Bhaji", "Lemon Rice / Veg Pulao", "Masala Dosa / Pav", "Lemon + Mango Pickle / Lemon + Pickle", "Gulab Jamun/Mohanthal", "Chicken Fried Rice"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-20', '["Besan Cheela/Moong Cheela", "Green Chutney", "Pickle", "Boiled Sprouts", "Egg Bhurjee", "White Bread+Butter+Jam", "Milk+Tea+Coffee", "Chocos", "Chocolate Powder", "Orange"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-20', '["Onion Tomato Salad", "Panchratan Dal", "Jeera Pyaaz Aloo", "Amritsari Chole Ki Sabzi", "Plain Rice", "Kesar Lassi", "Bhature", "Green Chuteny Mirchi Lemon Mix-veg Pickle", "Roasted Papad"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-20', '["Maggie Masala", "Ketchup", "Jaljeera", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-20', '["Mix Salad", "Dal Palak", "Kadhai Paneer + Egg Kheema", "Bagara Rice", "Chapati", "Mirchi + Lemon + Mango Pickle", "Seviyaan Kheer / Rice Kheer"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-21', '["Schezwan Butter Dosa/Onion Dosa", "Sambar+Peanut Chutney", "Pickle", "Boiled Eggs", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Boost", "Banana"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-21', '["Beetroot Radish Salad", "Dal Makhani", "Soya Chunks Gravy", "Lobia Masala", "Jeera Rice", "Plain Curd", "Multi Grain Chapati", "Mirchi Lemon Lemon Pickle", "Ramkada"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-21', '["Pani Puri", "Onion + Chat Masala + Ragada+ Sev", "Lemonade", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-21', '["Onion Tomato Salad", "Dal Fry", "Aloo & Spring Onion Sabji", "Jeera Rice", "Chapati", "Mirchi + Lemon + Pickle", "Kesar Jalebi", "Hyderabadi Chicken Biryani"]', '7:30 PM - 9:30 PM');

-- WEEK 4: December 22-28, 2025
INSERT INTO public.mess_menu (meal_type, date, items, timings) VALUES
('BREAKFAST', '2025-12-22', '["Veg Vermicelli Upma", "Green Chutney", "Lemon", "Boiled Chana", "Boiled Eggs", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Chocolate Powder", "Guava"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-22', '["3-Bean Salad", "Masoor Dal", "Sarso Ka Saag", "White Matar Masala", "Steam Rice", "Mint Buttermilk", "Chapati", "Mirchi Lemon Mango Pickle", "Fryums"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-22', '["Bombay Bhel", "Green Chutney + Emli Chutney", "Cold Coffee", "Tea"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-22', '["Beetroot Raddish Salad", "Masoor Dal", "Veg Amritsari", "Bagara Rice", "Multigrain Roti", "Mirchi + Lemon + Pickle", "Tomato Soup with Croutons", "Chicken Angara"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-23', '["Aloo Onion Paratha", "Curd+Lehsun Chutney", "Pickle", "Egg Bhurjee", "White Bread+Butter+Jam", "Milk+Ginger Tea+Coffee", "Chocos", "Bournvita", "Papaya"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-23', '["Mix Salad", "Dal Palak", "Dry Gobhi Matar Sabzi", "Kala Chana Masala", "Jeera Rice", "Boondi Raita", "Multigrain Roti", "Mirchi Lemon Tomato Pickle", "Fried Papad"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-23', '["Corn Chaat/Boiled Corn", "Lemon+Masala", "Mint Crush", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-23', '["3-Bean Salad", "Pancharatna Dal", "Methi Matar Malai", "Plain Rice", "Multigrain Roti", "Mirchi + Lemon + Pickle", "Gajar Ka Halwa", "Chicken Masala"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-24', '["Tari Poha", "Onions", "Lemon", "Omlette", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Boost", "Orange"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-24', '["Green Salad", "Thoor Dal", "Paneer Masala", "Mix Kathod", "Bagara Rice", "Masala Buttermilk", "Chapati", "Mirchi Lemon Garlic Pickle", "Ramakada"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-24', '["Dahi Papdi Chaat", "Green Chutney + Emli Chutney", "Guava Crush", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-24', '["Onion Tomato Salad", "Dal Fry", "Aalo Palak", "Matar Pulao", "Puri", "Mirchi + Lemon + Pickle", "Sev Boondi / Boondi Laddu", "Hyderabadi Chicken Biryani"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-25', '["Palak Puri", "Aloo Tamatar Sabzi", "Pickle", "Moong Sprouts", "Boiled Eggs", "White Bread+Butter+Jam", "Milk+Ginger Tea+Coffee", "Cornflakes", "Bournvita", "Papaya"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-25', '["Onion Tomato Salad", "Dal Palak", "Mix Veg", "Moong Masala", "Matar Pulav", "Plain Curd", "Chapati", "Mirchi Lemon Lemon Pickle", "Rice Papad"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-25', '["Tandoori Mayo Sandwich", "Ketchup", "Lemonade", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-25', '["Cucumber Beetroot Salad", "Dal Tadka", "Cabbage Tomato Matar Sabzi", "Steamed Rice", "Chapati", "Mirchi + Lemon + Mango Pickle", "Vanilla/Butterscotch Ice Cream", "Fish Curry"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-26', '["Idli", "Sambhar+Peanut Chutney", "Soaked Peanuts", "Omlette", "Brown Bread+Butter+Jam", "Milk+Ginger Tea+Coffee", "Chocos", "Bournvita", "Banana"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-26', '["Carrot Radish Salad", "Kadhi Pakoda", "Gujarati Undhiyu", "Rajma Masala", "Steam Rice", "Masala Buttermilk", "Chapati", "Mirchi Lemon Green Chilli Pickle", "Fryums"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-26', '["Moong Dal Vada/Mix Pakoda", "Green Chutney+Ketchup", "Lemonade", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-26', '["Green Salad", "Sambhar + Peanut Chutney / Veg Raita + Lehsun Chatni", "Medu Vada / Bhaji", "Lemon Rice / Veg Pulao", "Masala Dosa / Pav", "Lemon + Mango Pickle / Lemon + Pickle", "Gulab Jamun/Mohanthal", "Chicken Fried Rice"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-27', '["Besan Cheela/Moong Cheela", "Green Chutney", "Pickle", "Boiled Sprouts", "Egg Bhurjee", "White Bread+Butter+Jam", "Milk+Tea+Coffee", "Chocos", "Chocolate Powder", "Orange"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-27', '["Onion Tomato Salad", "Panchratan Dal", "Jeera Pyaaz Aloo", "Amritsari Chole Ki Sabzi", "Plain Rice", "Kesar Lassi", "Bhature", "Green Chuteny Mirchi Lemon Mix-veg Pickle", "Roasted Papad"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-27', '["Maggie Masala", "Ketchup", "Jaljeera", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-27', '["Mix Salad", "Dal Palak", "Kadhai Paneer + Egg Kheema", "Bagara Rice", "Chapati", "Mirchi + Lemon + Mango Pickle", "Seviyaan Kheer / Rice Kheer"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-28', '["Schezwan Butter Dosa/Onion Dosa", "Sambar+Peanut Chutney", "Pickle", "Boiled Eggs", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Boost", "Banana"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-28', '["Beetroot Radish Salad", "Dal Makhani", "Soya Chunks Gravy", "Lobia Masala", "Jeera Rice", "Plain Curd", "Multi Grain Chapati", "Mirchi Lemon Lemon Pickle", "Ramkada"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-28', '["Pani Puri", "Onion + Chat Masala + Ragada+ Sev", "Lemonade", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-28', '["Onion Tomato Salad", "Dal Fry", "Aloo & Spring Onion Sabji", "Jeera Rice", "Chapati", "Mirchi + Lemon + Pickle", "Kesar Jalebi", "Hyderabadi Chicken Biryani"]', '7:30 PM - 9:30 PM');

-- WEEK 5: December 29-31, 2025 (Mon-Wed)
INSERT INTO public.mess_menu (meal_type, date, items, timings) VALUES
('BREAKFAST', '2025-12-29', '["Veg Vermicelli Upma", "Green Chutney", "Lemon", "Boiled Chana", "Boiled Eggs", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Chocolate Powder", "Guava"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-29', '["3-Bean Salad", "Masoor Dal", "Sarso Ka Saag", "White Matar Masala", "Steam Rice", "Mint Buttermilk", "Chapati", "Mirchi Lemon Mango Pickle", "Fryums"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-29', '["Bombay Bhel", "Green Chutney + Emli Chutney", "Cold Coffee", "Tea"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-29', '["Beetroot Raddish Salad", "Masoor Dal", "Veg Amritsari", "Bagara Rice", "Multigrain Roti", "Mirchi + Lemon + Pickle", "Tomato Soup with Croutons", "Chicken Angara"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-30', '["Aloo Onion Paratha", "Curd+Lehsun Chutney", "Pickle", "Egg Bhurjee", "White Bread+Butter+Jam", "Milk+Ginger Tea+Coffee", "Chocos", "Bournvita", "Papaya"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-30', '["Mix Salad", "Dal Palak", "Dry Gobhi Matar Sabzi", "Kala Chana Masala", "Jeera Rice", "Boondi Raita", "Multigrain Roti", "Mirchi Lemon Tomato Pickle", "Fried Papad"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-30', '["Corn Chaat/Boiled Corn", "Lemon+Masala", "Mint Crush", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-30', '["3-Bean Salad", "Pancharatna Dal", "Methi Matar Malai", "Plain Rice", "Multigrain Roti", "Mirchi + Lemon + Pickle", "Gajar Ka Halwa", "Chicken Masala"]', '7:30 PM - 9:30 PM'),

('BREAKFAST', '2025-12-31', '["Tari Poha", "Onions", "Lemon", "Omlette", "Brown Bread+Butter+Jam", "Milk+Tea+Coffee", "Cornflakes", "Boost", "Orange"]', '7:45 AM - 10:00 AM'),
('LUNCH', '2025-12-31', '["Green Salad", "Thoor Dal", "Paneer Masala", "Mix Kathod", "Bagara Rice", "Masala Buttermilk", "Chapati", "Mirchi Lemon Garlic Pickle", "Ramakada"]', '12:15 PM - 2:15 PM'),
('SNACKS', '2025-12-31', '["Dahi Papdi Chaat", "Green Chutney + Emli Chutney", "Guava Crush", "Tea + Coffee + Milk"]', '4:30 PM - 5:45 PM'),
('DINNER', '2025-12-31', '["Onion Tomato Salad", "Dal Fry", "Aalo Palak", "Matar Pulao", "Puri", "Mirchi + Lemon + Pickle", "Sev Boondi / Boondi Laddu", "Hyderabadi Chicken Biryani"]', '7:30 PM - 9:30 PM');

-- Complete! 31 days × 4 meals = 124 total mess menu entries
