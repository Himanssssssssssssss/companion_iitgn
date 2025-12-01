import React, { useEffect, useState, useMemo } from 'react';
import { Clock, RefreshCw, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Bus {
  id: string;
  source: string;
  destination: string;
  departure_time: string;
  display_time: string;
  bus_type: string;
  route_type: string;
}

const BusSchedule: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [routeType, setRouteType] = useState<'JRHA' | 'KUDASAN'>('KUDASAN');
  const [direction, setDirection] = useState<'TO_CAMPUS' | 'FROM_CAMPUS'>('FROM_CAMPUS');
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const { data, error } = await supabase
          .from('bus_schedules')
          .select('*')
          .eq('route_type', routeType)
          .eq('status', 'active')
          .order('departure_time', { ascending: true });

        if (error) {
          console.error('Error fetching buses:', error);
          setLoading(false);
          return;
        }

        setBuses(data || []);
      } catch (e) {
        console.error("Failed to load buses", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [routeType]);

  const getFilteredBuses = () => {
    return buses.filter(bus => {
      if (direction === 'FROM_CAMPUS') {
        return bus.source === 'Campus';
      } else {
        return bus.destination === 'Campus';
      }
    }).sort((a, b) => a.departure_time.localeCompare(b.departure_time));
  };

  const filteredBuses = useMemo(getFilteredBuses, [buses, direction]);

  const getNextBus = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
    return filteredBuses.find(b => b.departure_time > currentTime) || filteredBuses[0]; // Wrap around to first if none left
  };

  const nextBus = getNextBus();

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-white mb-6">Bus Schedule</h1>

      {/* Route Toggle Pills */}
      <div className="bg-slate-800/50 p-1.5 rounded-xl flex relative">
        <button
          onClick={() => setRouteType('KUDASAN')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${routeType === 'KUDASAN' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          Kudasan
        </button>
        <button
          onClick={() => setRouteType('JRHA')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${routeType === 'JRHA' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          JRHA Shuttle
        </button>
      </div>

      {/* Direction Selection */}
      <div className="flex justify-between items-center px-2">
        <span className="text-gray-400 text-sm font-medium">Direction</span>
        <button
          onClick={() => setDirection(prev => prev === 'FROM_CAMPUS' ? 'TO_CAMPUS' : 'FROM_CAMPUS')}
          className="flex items-center space-x-2 text-primary-400 text-sm font-bold bg-primary-500/10 px-3 py-1.5 rounded-lg border border-primary-500/20"
        >
          <RefreshCw size={14} className="mr-1" />
          {direction === 'FROM_CAMPUS' ? 'From Campus' : 'To Campus'}
        </button>
      </div>

      {/* Next Bus Highlight Card */}
      {loading ? (
        <div className="h-48 glass rounded-3xl animate-pulse"></div>
      ) : (
        <div className="glass rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Next Bus</h2>

          {nextBus ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-6xl font-bold text-white mb-2 tracking-tight">
                {nextBus.display_time}
              </div>
              <div className="text-primary-300 text-sm font-medium mb-6 bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
                {nextBus.bus_type}
              </div>

              <div className="w-full flex justify-between items-center text-sm border-t border-white/10 pt-4">
                <div className="flex items-center text-gray-300">
                  <MapPin size={16} className="text-primary-500 mr-2" />
                  {nextBus.source}
                </div>
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
                <div className="flex items-center text-gray-300">
                  <MapPin size={16} className="text-primary-500 mr-2" />
                  {nextBus.destination}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No buses available currently.
            </div>
          )}
        </div>
      )}

      {/* Full Schedule Toggle */}
      <div>
        <button
          onClick={() => setShowFullSchedule(!showFullSchedule)}
          className="w-full flex items-center justify-center p-4 glass rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
        >
          <span className="mr-2 font-medium">
            {showFullSchedule ? 'Hide Full Schedule' : 'View Full Schedule'}
          </span>
          {showFullSchedule ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showFullSchedule && (
          <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            {filteredBuses.length > 0 ? filteredBuses.map((bus) => (
              <div key={bus.id} className="glass p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center text-white font-bold text-lg">
                  <Clock size={18} className="mr-3 text-primary-400" />
                  {bus.display_time}
                </div>
                <span className="text-xs text-gray-400 bg-black/20 px-2 py-1 rounded">
                  {bus.bus_type}
                </span>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                No buses scheduled for this route/direction today.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusSchedule;
