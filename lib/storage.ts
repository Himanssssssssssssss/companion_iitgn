import localforage from 'localforage';

// Configure localforage for better performance
localforage.config({
  name: 'IITGN-Companion',
  version: 1.0,
  storeName: 'app_data',
  description: 'IITGN Companion App Storage'
});

// Keys for localStorage
export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  ID_CARD_IMAGE: 'id_card_image',
  QR_CODE_IMAGE: 'qr_code_image',
  CHECKLIST: 'checklist',
  SETTINGS: 'settings',
  BUS_SCHEDULES_CACHE: 'bus_schedules_cache',
  MESS_MENU_CACHE: 'mess_menu_cache',
  EVENTS_CACHE: 'events_cache'
};

// User Profile Management
export const saveUserProfile = async (profile: any) => {
  try {
    await localforage.setItem(STORAGE_KEYS.USER_PROFILE, profile);
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

export const getUserProfile = async () => {
  try {
    return await localforage.getItem(STORAGE_KEYS.USER_PROFILE);
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const clearUserProfile = async () => {
  try {
    await localforage.removeItem(STORAGE_KEYS.USER_PROFILE);
    await localforage.removeItem(STORAGE_KEYS.ID_CARD_IMAGE);
    await localforage.removeItem(STORAGE_KEYS.QR_CODE_IMAGE);
    return true;
  } catch (error) {
    console.error('Error clearing user profile:', error);
    return false;
  }
};

// Image Storage (converts File to base64)
export const saveImage = async (key: string, file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await localforage.setItem(key, base64String);
        resolve(base64String);
      } catch (error) {
        console.error('Error saving image:', error);
        resolve(null);
      }
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

export const getImage = async (key: string): Promise<string | null> => {
  try {
    return await localforage.getItem(key);
  } catch (error) {
    console.error('Error getting image:', error);
    return null;
  }
};

// Checklist Management
export const saveChecklist = async (items: any[]) => {
  try {
    await localforage.setItem(STORAGE_KEYS.CHECKLIST, items);
    return true;
  } catch (error) {
    console.error('Error saving checklist:', error);
    return false;
  }
};

export const getChecklist = async () => {
  try {
    const items = await localforage.getItem(STORAGE_KEYS.CHECKLIST);
    return items || [];
  } catch (error) {
    console.error('Error getting checklist:', error);
    return [];
  }
};

// Settings Management
export const saveSettings = async (settings: any) => {
  try {
    await localforage.setItem(STORAGE_KEYS.SETTINGS, settings);
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

export const getSettings = async () => {
  try {
    return await localforage.getItem(STORAGE_KEYS.SETTINGS);
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
};

// Data Caching for offline support
export const cacheData = async (key: string, data: any) => {
  try {
    await localforage.setItem(key, { data, timestamp: Date.now() });
    return true;
  } catch (error) {
    console.error('Error caching data:', error);
    return false;
  }
};

export const getCachedData = async (key: string, maxAge: number = 3600000) => {
  try {
    const cached: any = await localforage.getItem(key);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > maxAge) {
      // Cache expired
      await localforage.removeItem(key);
      return null;
    }
    
    return cached.data;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

// Clear all data (logout)
export const clearAllData = async () => {
  try {
    await localforage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};
