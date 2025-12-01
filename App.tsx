import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [_user, _setUser] = useState<UserProfile | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  // App Settings State
  const [settings, setSettings] = useState<AppSettings>({
    showIdOnHome: true,
    showMessOnHome: true,
    homeWidgetsOrder: ['CHECKLIST', 'NEXT_MEAL', 'ID_CARD']
  });

  // Ref to track user state for event listeners without triggering re-renders
  const userRef = useRef(_user);

  // Wrapper to keep ref in sync with state
  const setUser = useCallback((userOrUpdater: UserProfile | null | ((prev: UserProfile | null) => UserProfile | null)) => {
    if (typeof userOrUpdater === 'function') {
      _setUser(prevUser => {
        const newUser = userOrUpdater(prevUser);
        userRef.current = newUser;
        return newUser;
      });
    } else {
      userRef.current = userOrUpdater;
      _setUser(userOrUpdater);
    }
  }, []);

  // Load user profile from database
  const loadUserProfile = useCallback(async (authUserId: string) => {
    try {
      console.log(`[Session] Loading profile for: ${authUserId}`);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUserId)
        .single();

      if (profileError || !profile) {
        console.error('[Session] Error fetching profile:', profileError);
        setUser(null);
        localStorage.removeItem('iitgn_user_profile');
        return;
      }

      const userProfile: UserProfile = {
        name: profile.name,
        email: profile.email,
        id: profile.student_id,
        photoUrl: profile.id_card_url
      };

      setUser(userProfile);
      localStorage.setItem('iitgn_user_profile', JSON.stringify(userProfile));
      localStorage.setItem('session_user_id', authUserId);

      // Background: Cache QR code data locally
      if (profile.qr_code_url) {
        localStorage.setItem('cached_qr_code', profile.qr_code_url);
      }

      // Background: Cache data for offline use
      supabase.from('mess_menu').select('*').then(({ data }) => {
        if (data) localStorage.setItem('cached_mess_menu', JSON.stringify(data));
      });
      supabase.from('bus_schedules').select('*').then(({ data }) => {
        if (data) localStorage.setItem('cached_bus_schedules', JSON.stringify(data));
      });

    } catch (error) {
      console.error('[Session] Unexpected error in loadUserProfile:', error);
      setUser(null);
    }
  }, [setUser]);

  // 1. ROBUST INITIALIZATION: Check session FIRST, then listen
  useEffect(() => {
    let subscription: any = null;

    const initializeAndListen = async () => {
      setLoading(true);

      // A. Active Check: Get session immediately
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session?.user) {
        console.log("✅ Found active session on load");
        await loadUserProfile(session.user.id);
      } else {
        console.log("⚪ No active session on load");
        setUser(null);
      }

      // Load checklist and settings
      const storedChecklist = await getChecklist();
      if (storedChecklist && Array.isArray(storedChecklist)) {
        setChecklist(storedChecklist);
      }

      const storedSettings = await getSettings();
      if (storedSettings) {
        setSettings(storedSettings as AppSettings);
      }

      setLoading(false);

      // B. Passive Listen: Subscribe to future changes
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(`[Session] Auth event: ${event}`);

        if (event === 'SIGNED_IN' && session?.user) {
          // Only load if we don't already have this user loaded
          if (session.user.id !== userRef.current?.id) {
            await loadUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setChecklist([]);
          localStorage.removeItem('iitgn_user_profile');
          localStorage.removeItem('session_user_id');
        }
      });

      subscription = data.subscription;
    };

    initializeAndListen();

    return () => {
      subscription?.unsubscribe();
    };
  }, [loadUserProfile, setUser]);

  // 2. TAB FOCUS CHECK: Kill zombie sessions when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && userRef.current) {
        console.log('[Session] Tab focused, validating session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        // If session is missing or user ID mismatch, force logout
        const cachedUserId = localStorage.getItem('session_user_id');
        if (error || !session || (cachedUserId && session.user.id !== cachedUserId)) {
          console.warn('[Session] Zombie session detected! Logging out.');
          alert("Your session has expired. Please log in again.");
          await handleLogout();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Save checklist to localStorage whenever it changes
  useEffect(() => {
    if (_user) {
      saveChecklist(checklist);
    }
  }, [checklist, _user]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (_user) {
      saveSettings(settings);
    }
  }, [settings, _user]);

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setChecklist([]);
    setActiveTab(Tab.HOME);
  };

  const handleLogin = useCallback((loggedInUser: UserProfile) => {
    console.log('[App] handleLogin called with:', loggedInUser);
    setUser(loggedInUser);
    localStorage.setItem('iitgn_user_profile', JSON.stringify(loggedInUser));
  }, [setUser]);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <Home
          user={_user!}
          settings={settings}
          onChangeTab={setActiveTab}
          checklist={checklist}
          setChecklist={setChecklist}
        />;
      case Tab.BUS:
        return <BusSchedule />;
      case Tab.MESS:
        return <Mess user={_user!} />;
      case Tab.PROFILE:
        return <Profile
          user={_user!}
          settings={settings}
          onUpdateUser={handleUpdateUser}
          onUpdateSettings={setSettings}
          onLogout={handleLogout}
        />;
      default:
        return null;
    }
  };

  return (
    <HashRouter>
      <SplashScreen onFinish={() => setLoading(false)} />

      {!loading && (
        !_user ? (
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
