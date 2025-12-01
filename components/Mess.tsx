import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { QrCode, Utensils, Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface MessProps {
  user: UserProfile;
}

interface MealData {
  time: string;
  items: string[];
}

interface DailyMenu {
  date: string;
  breakfast: MealData;
  lunch: MealData;
  snacks: MealData;
  dinner: MealData;
}

const Mess: React.FC<MessProps> = ({ user }) => {
  const [showQr, setShowQr] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weeklyMenu, setWeeklyMenu] = useState<Record<string, DailyMenu>>({});
  const [loading, setLoading] = useState(true);

  // Logic to determine current active meal based on time
  const getCurrentMealIndex = () => {
    const hour = new Date().getHours();
    if (hour < 10) return 0; // Breakfast
    if (hour < 15) return 1; // Lunch
    if (hour < 18) return 2; // Snacks
    return 3; // Dinner
  };

  const [activeMealIndex, setActiveMealIndex] = useState(getCurrentMealIndex());

  useEffect(() => {
    // Load QR code data
    const loadQRCode = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('qr_code_url')
          .eq('id', authUser.id)
          .single();

        if (profile?.qr_code_url) {
          setQrCodeData(profile.qr_code_url);
        }
      }
    };

    loadQRCode();
  }, []);

  useEffect(() => {
    const loadWeeklyMenu = async () => {
      setLoading(true);
      // Get start and end of the current week view
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
      const end = addDays(start, 6); // Sunday

      const startDateStr = start.toISOString().split('T')[0];
      const endDateStr = end.toISOString().split('T')[0];

      console.log(`Fetching menu from ${startDateStr} to ${endDateStr}`);

      const { data, error } = await supabase
        .from('mess_menu')
        .select('*')
        .gte('date', startDateStr)
        .lte('date', endDateStr);

      let menuData = data;

      if (error || !data) {
        console.error('Error loading mess menu, trying cache:', error);
        // Try loading from cache
        const cachedMenu = localStorage.getItem('cached_mess_menu');
        if (cachedMenu) {
          menuData = JSON.parse(cachedMenu);
        } else {
          setLoading(false);
          return;
        }
      }

      const newWeeklyMenu: Record<string, DailyMenu> = {};

      // Initialize empty days
      for (let i = 0; i < 7; i++) {
        const date = addDays(start, i);
        const dateStr = date.toISOString().split('T')[0];
        newWeeklyMenu[dateStr] = {
          date: dateStr,
          breakfast: { time: '7:30 AM - 9:30 AM', items: ['Loading...'] },
          lunch: { time: '12:30 PM - 2:30 PM', items: ['Loading...'] },
          snacks: { time: '4:30 PM - 6:00 PM', items: ['Loading...'] },
          dinner: { time: '7:30 PM - 9:30 PM', items: ['Loading...'] }
        };
      }

      if (data) {
        data.forEach(meal => {
          const dateStr = meal.date;
          if (!newWeeklyMenu[dateStr]) return;

          if (meal.meal_type) {
            const type = meal.meal_type.toLowerCase() as keyof Omit<DailyMenu, 'date'>;
            newWeeklyMenu[dateStr][type] = {
              time: meal.timings,
              items: meal.items
            };
          }
        });
      }

      setWeeklyMenu(newWeeklyMenu);
      setLoading(false);
    };

    loadWeeklyMenu();
  }, [selectedDate]);

  const handlePrevDay = () => {
    setSelectedDate(prev => addDays(prev, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
    setActiveMealIndex(getCurrentMealIndex());
  };

  // Get current menu based on selected date
  const currentDateStr = selectedDate.toISOString().split('T')[0];
  const currentMenu = weeklyMenu[currentDateStr] || {
    breakfast: { time: '7:30 AM - 9:30 AM', items: ['No data'] },
    lunch: { time: '12:30 PM - 2:30 PM', items: ['No data'] },
    snacks: { time: '4:30 PM - 6:00 PM', items: ['No data'] },
    dinner: { time: '7:30 PM - 9:30 PM', items: ['No data'] }
  };

  const meals = [
    { name: 'Breakfast', icon: <Clock size={18} />, data: currentMenu.breakfast },
    { name: 'Lunch', icon: <Utensils size={18} />, data: currentMenu.lunch },
    { name: 'Snacks', icon: <Clock size={18} />, data: currentMenu.snacks },
    { name: 'Dinner', icon: <Utensils size={18} />, data: currentMenu.dinner },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Header with Date Navigation */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Mess Menu</h1>
          <button
            onClick={() => setShowQr(true)}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <QrCode className="text-white" size={24} />
          </button>
        </div>

        {/* Date Selector */}
        <div className="glass p-2 rounded-xl flex items-center justify-between">
          <button onClick={handlePrevDay} className="p-2 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>

          <div className="flex flex-col items-center cursor-pointer" onClick={handleToday}>
            <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">
              {isSameDay(selectedDate, new Date()) ? 'Today' : format(selectedDate, 'EEEE')}
            </span>
            <span className="text-white font-bold text-lg">
              {format(selectedDate, 'MMMM d')}
            </span>
          </div>

          <button onClick={handleNextDay} className="p-2 text-gray-400 hover:text-white transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Meal Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {meals.map((meal, index) => (
          <button
            key={meal.name}
            onClick={() => setActiveMealIndex(index)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 ${activeMealIndex === index
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25 scale-105'
              : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-gray-200'
              }`}
          >
            {meal.icon}
            <span className="font-medium text-sm">{meal.name}</span>
          </button>
        ))}
      </div>

      {/* Menu Card */}
      <div className="glass rounded-3xl p-6 min-h-[300px] relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Utensils size={120} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="relative z-10 animate-in slide-in-from-bottom-4 duration-500 key={activeMealIndex}">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{meals[activeMealIndex].name}</h2>
                <div className="flex items-center text-primary-300 text-sm font-medium bg-primary-500/10 px-3 py-1 rounded-full w-fit">
                  <Clock size={14} className="mr-1.5" />
                  {meals[activeMealIndex].data.time}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {meals[activeMealIndex].data.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                >
                  <div className="w-2 h-2 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                  <span className="text-gray-200 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowQr(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <Clock className="rotate-45" size={24} />
            </button>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mess Entry QR</h3>
              <p className="text-gray-500 text-sm mb-6">Show this to the mess staff</p>

              <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-inner inline-block">
                {qrCodeData ? (
                  <QRCodeSVG value={qrCodeData} size={200} />
                ) : (
                  <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded-lg text-gray-400">
                    No QR Data
                  </div>
                )}
              </div>

              <p className="mt-6 text-sm font-medium text-primary-600 bg-primary-50 py-2 px-4 rounded-full inline-block">
                {user.name} • {user.id}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mess;
