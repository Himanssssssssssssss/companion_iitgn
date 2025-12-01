import React, { useEffect, useState } from 'react';
import { UserProfile, Event, Tab, AppSettings, WidgetType, ChecklistItem } from '../types';
import { Calendar, Bell, MapPin, QrCode, PenSquare, CheckCircle2, Circle, Plus, X, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HomeProps {
    user: UserProfile;
    settings: AppSettings;
    checklist: ChecklistItem[];
    setChecklist: (items: ChecklistItem[]) => void;
    onChangeTab: (tab: Tab) => void;
}

interface MealData {
    time: string;
    items: string[];
}

const Home: React.FC<HomeProps> = ({ user, settings, checklist, setChecklist, onChangeTab }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showChecklistModal, setShowChecklistModal] = useState(false);
    const [newItemText, setNewItemText] = useState('');
    const [nextMeal, setNextMeal] = useState<{ meal: string; time: string; items: string[] } | null>(null);
    const [idCardUrl, setIdCardUrl] = useState<string | null>(null);

    // Load ID card from localStorage
    useEffect(() => {
        const localIdCard = localStorage.getItem('local_id_card');
        if (localIdCard) {
            setIdCardUrl(localIdCard);
        }
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch events from Supabase
                const { data: eventsData, error: eventsError } = await supabase
                    .from('events')
                    .select('*')
                    .gte('date', new Date().toISOString().split('T')[0]) // Only future/today events
                    .order('date', { ascending: true })
                    .limit(10);

                if (!eventsError && eventsData) {
                    setEvents(eventsData.map(e => ({
                        id: e.id,
                        title: e.title,
                        description: e.description || '',
                        date: e.date,
                        time: e.time || '',
                        venue: e.venue || '',
                        category: e.category || 'Other',
                        imageUrl: e.poster_url || 'https://picsum.photos/400/200?random=' + e.id
                    })));
                }

                // Fetch today's mess menu
                const today = new Date().toISOString().split('T')[0];
                const { data: menuData, error: menuError } = await supabase
                    .from('mess_menu')
                    .select('*')
                    .eq('date', today);

                if (!menuError && menuData && menuData.length > 0) {
                    const meals: any = {};
                    menuData.forEach(meal => {
                        meals[meal.meal_type.toLowerCase()] = {
                            time: meal.timings,
                            items: meal.items
                        };
                    });

                    // Determine which meal is next
                    const hour = new Date().getHours();
                    let mealType = 'breakfast';
                    if (hour < 10) mealType = 'breakfast';
                    else if (hour < 15) mealType = 'lunch';
                    else if (hour < 18) mealType = 'snacks';
                    else mealType = 'dinner';

                    const meal = meals[mealType];
                    if (meal) {
                        setNextMeal({
                            meal: mealType.charAt(0).toUpperCase() + mealType.slice(1),
                            time: meal.time,
                            items: meal.items
                        });
                    }
                } else {
                    // Fallback
                    const hour = new Date().getHours();
                    const fallbackMeals = [
                        { meal: 'Breakfast', time: '7:30 AM - 9:30 AM', items: ['Aloo Paratha', 'Curd', 'Tea/Coffee'] },
                        { meal: 'Lunch', time: '12:30 PM - 2:30 PM', items: ['Paneer Makhani', 'Dal', 'Rice'] },
                        { meal: 'Snacks', time: '4:30 PM - 6:00 PM', items: ['Samosa', 'Tea/Coffee'] },
                        { meal: 'Dinner', time: '7:30 PM - 9:30 PM', items: ['Kadhai Paneer', 'Chapati', 'Rice'] }
                    ];
                    const index = hour < 10 ? 0 : hour < 15 ? 1 : hour < 18 ? 2 : 3;
                    setNextMeal(fallbackMeals[index]);
                }
            } catch (e) {
                console.error("Failed to load data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const handleAddItem = () => {
        if (!newItemText.trim()) return;
        const newItem: ChecklistItem = {
            id: Date.now().toString(),
            text: newItemText,
            completed: false
        };
        setChecklist([...checklist, newItem]);
        setNewItemText('');
    };

    const toggleItem = (id: string) => {
        const updated = checklist.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        );
        // Optional: Auto-remove completed after delay? For now just keep them to show progress or let user delete.
        // The prompt said "clears up once no items left unchecked".
        // Let's filter out completed items immediately or after a short delay for better UX?
        // Prompt: "clears up once no items left unchecked in the checklist". 
        // This implies the WIDGET clears up. So if all are checked, maybe the widget hides?
        // Or maybe individual items disappear. Let's make individual items disappear after 1s.

        setChecklist(updated);

        if (!updated.find(i => i.id === id)?.completed) return; // If unchecking, don't delete

        setTimeout(() => {
            setChecklist(prev => prev.filter(i => i.id !== id));
        }, 500);
    };

    const renderWidget = (type: WidgetType) => {
        switch (type) {
            case 'ID_CARD':
                if (!settings.showIdOnHome) return null;
                return (
                    <div key="ID_CARD" className="glass p-0 rounded-2xl relative overflow-hidden group aspect-[1.586/1] border border-white/10">
                        {idCardUrl ? (
                            <img src={idCardUrl} alt="ID Card" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-black/40">
                                <span className="text-gray-500 text-xs">No ID Image Set</span>
                                <button onClick={() => onChangeTab(Tab.PROFILE)} className="mt-2 text-primary-400 text-xs underline">Go to Profile</button>
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white font-bold text-sm">{user.name}</p>
                            <p className="text-gray-300 text-xs">{user.id}</p>
                        </div>
                    </div>
                );

            case 'NEXT_MEAL':
                if (!settings.showMessOnHome || !nextMeal) return null;
                return (
                    <div key="NEXT_MEAL" className="glass p-5 rounded-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-white font-semibold">Next Meal</h3>
                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-md border border-green-500/20">{nextMeal.meal}</span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-gray-300 text-sm truncate">{nextMeal.items.slice(0, 2).join(', ')}</div>
                            <div className="text-gray-400 text-xs truncate">{nextMeal.items.slice(2).join(', ')}...</div>
                        </div>
                        <button onClick={() => onChangeTab(Tab.MESS)} className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-gray-300 transition-colors">
                            View Full Menu
                        </button>
                    </div>
                );

            case 'CHECKLIST':
                // Only show if there are unchecked items
                const visibleItems = checklist.filter(i => !i.completed);
                if (visibleItems.length === 0 && !showChecklistModal) return null;
                // Also show if modal is open? No, modal handles itself. 
                // If empty list, widget disappears.
                if (visibleItems.length === 0) return null;

                return (
                    <div key="CHECKLIST" className="glass p-5 rounded-2xl">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-white font-semibold">Tasks</h3>
                            <span className="text-xs text-primary-300">{visibleItems.length} remaining</span>
                        </div>
                        <div className="space-y-2">
                            {visibleItems.map(item => (
                                <div key={item.id} onClick={() => toggleItem(item.id)} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                                    <Circle size={18} className="text-gray-500 group-hover:text-primary-400" />
                                    <span className="text-gray-300 text-sm">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    const addToCalendar = (event: Event) => {
        // Simple ICS generation
        // Assuming date is YYYY-MM-DD and time is HH:MM
        // If time is missing, default to 9 AM
        const dateStr = event.date.replace(/-/g, '');
        const timeStr = event.time ? event.time.replace(':', '') + '00' : '090000';
        const startTime = `${dateStr}T${timeStr}`;

        // Default duration 1 hour
        let endHour = event.time ? parseInt(event.time.split(':')[0]) + 1 : 10;
        const endTimeStr = event.time ?
            (endHour < 10 ? '0' + endHour : endHour) + event.time.split(':')[1] + '00'
            : '100000';
        const endTime = `${dateStr}T${endTimeStr}`;

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${startTime}`,
            `DTEND:${endTime}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.description || ''}`,
            `LOCATION:${event.venue}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-full flex flex-col pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center py-2 mb-4">
                <div>
                    <p className="text-primary-400 text-sm font-medium tracking-wide uppercase mb-1">{getTimeGreeting()}</p>
                    <h1 className="text-3xl font-bold text-white">{user.name.split(' ')[0]}</h1>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowChecklistModal(true)}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary-500 hover:border-transparent transition-all"
                    >
                        <PenSquare size={18} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30 text-white font-bold text-sm">
                        {user.name.charAt(0)}
                    </div>
                </div>
            </div>

            {/* Dynamic Widgets */}
            <div className="space-y-4 mb-8">
                {settings.homeWidgetsOrder.map(type => renderWidget(type))}
            </div>

            {/* Events Section - Fixed at bottom of content flow, always visible if data exists */}
            <div className="mt-auto">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-bold text-white">Upcoming Events</h2>
                    <button className="text-xs text-primary-400 font-semibold hover:text-primary-300">View Calendar</button>
                </div>

                {loading ? (
                    <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
                        {[1, 2].map(i => (
                            <div key={i} className="min-w-[260px] h-40 glass rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4 snap-x">
                        {events.map(event => (
                            <div key={event.id} className="min-w-[260px] glass rounded-2xl overflow-hidden snap-center group relative">
                                <div className="h-28 bg-gray-800 relative overflow-hidden">
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute top-2 right-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCalendar(event);
                                            }}
                                            className="p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-primary-500 transition-colors"
                                            title="Add to Calendar"
                                        >
                                            <Calendar size={14} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-2 left-3">
                                        <span className="text-xs font-bold text-white bg-primary-600/90 px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
                                            {event.date.split(',')[0]}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-white truncate">{event.title}</h3>
                                    <div className="flex items-center text-xs text-gray-400 mt-2">
                                        <MapPin size={12} className="mr-1 text-primary-400" />
                                        <span>{event.venue}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-400 mt-1">
                                        <Calendar size={12} className="mr-1 text-primary-400" />
                                        <span>{event.date} {event.time && `• ${event.time}`}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Checklist Modal */}
            {showChecklistModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">My Checklist</h2>
                            <button onClick={() => setShowChecklistModal(false)} className="p-1 hover:bg-white/10 rounded-full"><X size={20} className="text-gray-400" /></button>
                        </div>

                        <div className="flex space-x-2 mb-6">
                            <input
                                type="text"
                                value={newItemText}
                                onChange={(e) => setNewItemText(e.target.value)}
                                placeholder="Add a new task..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                            />
                            <button
                                onClick={handleAddItem}
                                className="bg-primary-600 hover:bg-primary-500 text-white p-3 rounded-xl transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {checklist.length === 0 && <p className="text-center text-gray-500 text-sm py-4">No tasks yet. Add one!</p>}
                            {checklist.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl group">
                                    <div
                                        onClick={() => toggleItem(item.id)}
                                        className="flex items-center space-x-3 cursor-pointer flex-1"
                                    >
                                        {item.completed ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} className="text-gray-500" />}
                                        <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{item.text}</span>
                                    </div>
                                    <button onClick={() => setChecklist(prev => prev.filter(i => i.id !== item.id))} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
