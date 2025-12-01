import { Bus, Event, Outlet } from '../types';
import { cacheData, getCachedData, STORAGE_KEYS } from '../lib/storage';

// Cache duration: 1 hour for dynamic data
const CACHE_DURATION = 1000 * 60 * 60;

// Fetch with cache support
const fetchWithCache = async <T,>(url: string, cacheKey: string): Promise<T> => {
  // Try cache first
  const cached = await getCachedData(cacheKey, CACHE_DURATION);
  if (cached) return cached as T;

  // Fetch from server
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // Cache the result
    await cacheData(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);

    // If fetch fails, try to return stale cache
    const staleCache = await getCachedData(cacheKey, Infinity);
    if (staleCache) {
      console.warn('Using stale cache due to fetch error');
      return staleCache as T;
    }

    throw error;
  }
};

interface BusSchedulesData {
  campus: Bus[];
  kudasan: Bus[];
}

interface MessMenuData {
  breakfast: { time: string; items: string[] };
  lunch: { time: string; items: string[] };
  snacks: { time: string; items: string[] };
  dinner: { time: string; items: string[] };
}

export const dataService = {
  getBuses: async (): Promise<BusSchedulesData> => {
    return fetchWithCache<BusSchedulesData>(
      '/data/bus-schedules/schedules.json',
      STORAGE_KEYS.BUS_SCHEDULES_CACHE
    );
  },

  getEvents: async (): Promise<Event[]> => {
    return fetchWithCache<Event[]>(
      '/data/events.json',
      STORAGE_KEYS.EVENTS_CACHE
    );
  },

  getMessMenu: async (): Promise<MessMenuData> => {
    return fetchWithCache<MessMenuData>(
      '/data/mess-menus/current-menu.json',
      STORAGE_KEYS.MESS_MENU_CACHE
    );
  },

  // Optional: Method to force refresh cache
  refreshCache: async () => {
    try {
      const [buses, events, messMenu] = await Promise.all([
        fetch('/data/bus-schedules/schedules.json').then(r => r.json()),
        fetch('/data/events.json').then(r => r.json()),
        fetch('/data/mess-menus/current-menu.json').then(r => r.json())
      ]);

      await Promise.all([
        cacheData(STORAGE_KEYS.BUS_SCHEDULES_CACHE, buses),
        cacheData(STORAGE_KEYS.EVENTS_CACHE, events),
        cacheData(STORAGE_KEYS.MESS_MENU_CACHE, messMenu)
      ]);

      return true;
    } catch (error) {
      console.error('Error refreshing cache:', error);
      return false;
    }
  }
};
