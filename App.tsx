import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import BusSchedule from './components/BusSchedule';
import Mess from './components/Mess';
import Profile from './components/Profile';
import Login from './components/Login';
import SplashScreen from './components/SplashScreen';
import { Tab, UserProfile, AppSettings, ChecklistItem } from './types';
import { supabase } from './lib/supabase';
import { getChecklist, saveChecklist, getSettings, saveSettings } from './lib/storage';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  // App Settings State
  const [settings, setSettings] = useState<AppSettings>({
    showIdOnHome: true,
    showMessOnHome: true,
    homeWidgetsOrder: ['CHECKLIST', 'NEXT_MEAL', 'ID_CARD'] // Default order
  });

  // Load user session from Supabase on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        // 1. Try to load from localStorage first (fastest & offline support)
        const cachedUser = localStorage.getItem('iitgn_user_profile');
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }

        // 2. Check Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (session?.user) {
          // Get user profile from database
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !profileError) {
            const userProfile: UserProfile = {
              name: profile.name,
              email: profile.email,
              id: profile.student_id,
              photoUrl: profile.id_card_url
            };
            setUser(userProfile);
            // Update cache
            localStorage.setItem('iitgn_user_profile', JSON.stringify(userProfile));
          }
        } else if (!cachedUser) {
          // No session and no cache
          setUser(null);
        }

        // Load checklist from localStorage
        const storedChecklist = await getChecklist();
        if (storedChecklist && Array.isArray(storedChecklist)) {
          setChecklist(storedChecklist);
        }

        // Load settings from localStorage
        const storedSettings = await getSettings();
        if (storedSettings) {
          setSettings(storedSettings as AppSettings);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const userProfile: UserProfile = {
            name: profile.name,
            email: profile.email,
            id: profile.student_id,
            photoUrl: profile.id_card_url
          };
          setUser(userProfile);
          localStorage.setItem('iitgn_user_profile', JSON.stringify(userProfile));
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setChecklist([]);
        localStorage.removeItem('iitgn_user_profile');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Save checklist to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      saveChecklist(checklist);
    }
  }, [checklist, user]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (user) {
      saveSettings(settings);
    }
  }, [settings, user]);

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setChecklist([]);
    setActiveTab(Tab.HOME);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HOME:
        return (
          <Home
            user={user!}
            settings={settings}
            onChangeTab={setActiveTab}
            checklist={checklist}
            setChecklist={setChecklist}
          />
        );
      case Tab.BUS:
        return <BusSchedule />;
      case Tab.MESS:
        return <Mess user={user!} />;
      case Tab.PROFILE:
        return (
          <Profile
            user={user!}
            settings={settings}
            onUpdateUser={setUser}
            onUpdateSettings={setSettings}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <HashRouter>
      <SplashScreen onFinish={() => setLoading(false)} />

      {!loading && (
        !user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Layout activeTab={activeTab} onTabChange={setActiveTab}>
            {renderContent()}
          </Layout>
        )
      )}
    </HashRouter>
  );
};

export default App;
