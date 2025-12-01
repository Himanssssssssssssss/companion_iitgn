import { Bus, Event, MessMenu, UserProfile, ChecklistItem, Outlet } from './types';

export const MOCK_USER: UserProfile = {
  name: "Student",
  email: "student@iitgn.ac.in",
  id: "23110000"
};

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Blithchron 2024',
    date: 'Feb 14, 6:00 PM',
    venue: 'Open Air Theatre',
    imageUrl: 'https://picsum.photos/400/200?random=1'
  },
  {
    id: '2',
    title: 'Guest Lecture: AI Ethics',
    date: 'Feb 15, 4:00 PM',
    venue: 'Jibben Auditorium',
    imageUrl: 'https://picsum.photos/400/200?random=2'
  },
  {
    id: '3',
    title: 'Inter-Hostel Cricket',
    date: 'Feb 16, 9:00 AM',
    venue: 'Sports Complex',
    imageUrl: 'https://picsum.photos/400/200?random=3'
  }
];

export const MOCK_BUSES: Bus[] = [
  { id: '1', source: 'Campus', destination: 'Kudasan', departureTime: '09:00', displayTime: '09:00 AM', type: '56-Seater' },
  { id: '2', source: 'Campus', destination: 'Kudasan', departureTime: '10:30', displayTime: '10:30 AM', type: '29-Seater' },
  { id: '3', source: 'Campus', destination: 'Kudasan', departureTime: '13:00', displayTime: '01:00 PM', type: '56-Seater' },
  { id: '4', source: 'Kudasan', destination: 'Campus', departureTime: '09:30', displayTime: '09:30 AM', type: '56-Seater' },
  { id: '5', source: 'Kudasan', destination: 'Campus', departureTime: '11:00', displayTime: '11:00 AM', type: '29-Seater' },
  { id: '6', source: 'JRHA', destination: 'Campus', departureTime: '08:45', displayTime: '08:45 AM', type: 'EECO' },
  { id: '7', source: 'Campus', destination: 'JRHA', departureTime: '08:55', displayTime: '08:55 AM', type: '29-Seater' },
  { id: '8', source: 'JRHA', destination: 'Campus', departureTime: '09:15', displayTime: '09:15 AM', type: 'EECO' },
];

export const MOCK_MESS_MENU: MessMenu[] = [
  {
    meal: 'Breakfast',
    time: '7:30 AM - 9:30 AM',
    items: ['Aloo Paratha', 'Curd', 'Pickle', 'Tea/Coffee', 'Milk', 'Cornflakes']
  },
  {
    meal: 'Lunch',
    time: '12:30 PM - 2:30 PM',
    items: ['Paneer Makhani', 'Mix Veg', 'Dal Tadka', 'Jeera Rice', 'Roti', 'Salad']
  },
  {
    meal: 'Snacks',
    time: '4:30 PM - 6:00 PM',
    items: ['Samosa', 'Green Chutney', 'Tea/Coffee']
  },
  {
    meal: 'Dinner',
    time: '7:30 PM - 9:30 PM',
    items: ['Kadhai Chicken / Paneer', 'Egg Curry', 'Rice', 'Chapati', 'Gulab Jamun']
  }
];

export const MOCK_OUTLETS: Outlet[] = [
  {
    id: '1',
    name: 'Tea Post',
    location: 'Student Activity Centre',
    closingTime: '2:00 AM'
  },
  {
    id: '2',
    name: 'Amul Store',
    location: 'Hostel Circle',
    closingTime: '12:00 AM'
  },
  {
    id: '3',
    name: 'La Pinoz Pizza',
    location: 'Academic Block 5',
    closingTime: '10:00 PM'
  }
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [];