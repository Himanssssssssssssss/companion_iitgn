export interface Bus {
  id: string;
  source: string;
  destination: string;
  departure_time: string; // Format: "HH:mm:ss"
  display_time: string; // Format: "09:00 AM"
  bus_type: string; // '56-Seater' | '29-Seater' | 'EECO'
  route_type: string; // 'JRHA' | 'KUDASAN'
  status?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  venue: string;
  imageUrl: string;
  category?: string;
}

export interface MessMenu {
  meal: string;
  time: string;
  items: string[];
}

export interface Outlet {
  id: string;
  name: string;
  location: string;
  closingTime: string;
  imageUrl?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  id: string;
  photoUrl?: string; // For physical ID card image
}

export type WidgetType = 'ID_CARD' | 'NEXT_MEAL' | 'CHECKLIST';

export interface AppSettings {
  showIdOnHome: boolean;
  showMessOnHome: boolean;
  homeWidgetsOrder: WidgetType[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export enum Tab {
  HOME = 'home',
  BUS = 'bus',
  MESS = 'mess',
  PROFILE = 'profile'
}