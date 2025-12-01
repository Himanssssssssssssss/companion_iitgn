import React from 'react';
import { Home, BusFront, Utensils, UserCircle2 } from 'lucide-react';
import { Tab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {

  const NavItem = ({ icon: Icon, tab, label }: { icon: any, tab: Tab, label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => onTabChange(tab)}
        className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'text-primary-400' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-primary-500/20 -translate-y-1 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : ''}`}>
          <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className={`text-[10px] font-medium mt-1 ${isActive ? 'opacity-100' : 'opacity-0 scale-0'} transition-all`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-white">
      {/* Mobile container simulation */}
      <div className="w-full max-w-md min-h-screen relative flex flex-col shadow-2xl overflow-hidden">

        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Main Content Area */}
        {/* Main Content Area */}
        <main className="flex-1 p-5 pb-24 overflow-y-auto scroll-smooth z-10 no-scrollbar">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 h-20 glass-heavy rounded-t-3xl px-4 pb-2 z-50 max-w-md mx-auto">
          <div className="flex justify-between items-center h-full max-w-sm mx-auto">
            <NavItem icon={Home} tab={Tab.HOME} label="Home" />
            <NavItem icon={BusFront} tab={Tab.BUS} label="Bus" />
            <NavItem icon={Utensils} tab={Tab.MESS} label="Mess" />
            <NavItem icon={UserCircle2} tab={Tab.PROFILE} label="Profile" />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
