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

  // ZOMBIE SESSION FIX: Active Session Verification
  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    // Part 1: Sequential Initialization
    const initializeSession = async () => {
      console.log('[Session] Initializing...');

      try {
        // 1a. Load cached user first for immediate UI
        const cachedUser = localStorage.getItem('iitgn_user_profile');
        if (cachedUser && mounted) {
          setUser(JSON.parse(cachedUser));
        }

        // 1b. Explicitly get session (don't rely on listener alone)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('[Session] getSession result:', session?.user?.id || 'No session');

        if (sessionError) {
          console.error('[Session] Error:', sessionError);
          if (mounted) {
            setUser(null);
            localStorage.removeItem('iitgn_user_profile');
          }
          return;
        }

        if (session?.user) {
          // Verify profile exists in database
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !profileError && mounted) {
            const userProfile: UserProfile = {
              name: profile.name,
              email: profile.email,
              id: profile.student_id,
              photoUrl: profile.id_card_url
            };
            setUser(userProfile);
            localStorage.setItem('iitgn_user_profile', JSON.stringify(userProfile));
            localStorage.setItem('session_user_id', session.user.id);

            // Background: Cache data for offline use
            supabase.from('mess_menu').select('*').then(({ data }) => {
              if (data) localStorage.setItem('cached_mess_menu', JSON.stringify(data));
            });
            supabase.from('bus_schedules').select('*').then(({ data }) => {
              if (data) localStorage.setItem('cached_bus_schedules', JSON.stringify(data));
            });
          } else {
            console.warn('[Session] Profile not found or error:', profileError);
            if (mounted) {
              setUser(null);
              localStorage.removeItem('iitgn_user_profile');
            }
          }
        } else if (!cachedUser && mounted) {
          setUser(null);
        }

        // Load checklist and settings
        const storedChecklist = await getChecklist();
        if (storedChecklist && Array.isArray(storedChecklist) && mounted) {
          setChecklist(storedChecklist);
        }

        const storedSettings = await getSettings();
        if (storedSettings && mounted) {
          setSettings(storedSettings as AppSettings);
        }
      } catch (error) {
        console.error('[Session] Init error:', error);
        if (mounted) {
          setUser(null);
          localStorage.removeItem('iitgn_user_profile');
        }
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('[Session] Initialization complete');
        }
      }
    };

    // Part 3: Loading Safety Net (10 seconds)
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.error('[Session] Hung for 10s, forcing reload');
        alert('Session timeout detected. Refreshing...');
        localStorage.clear();
        window.location.reload();
      }
    }, 10000);

    initializeSession();

    // Set up auth listener AFTER initial check
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('[Session] Auth event:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && mounted) {
          const userProfile: UserProfile = {
            name: profile.name,
            email: profile.email,
            id: profile.student_id,
            photoUrl: profile.id_card_url
          };
          setUser(userProfile);
          localStorage.setItem('iitgn_user_profile', JSON.stringify(userProfile));
          localStorage.setItem('session_user_id', session.user.id);
        }
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (event === 'SIGNED_OUT' && mounted) {
          setUser(null);
          setChecklist([]);
          localStorage.removeItem('iitgn_user_profile');
          localStorage.removeItem('session_user_id');
        }
      }
    });

    authSubscription = subscription;

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      authSubscription?.unsubscribe();
    };
  }, []);

  // Part 2: Tab Focus Re-validation
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        console.log('[Session] Tab visible, re-validating...');

        try {
          const { data: { session } } = await supabase.auth.getSession();
          const cachedUserId = localStorage.getItem('session_user_id');

          if (!session && user) {
            console.warn('[Session] Session lost, forcing logout');
            setUser(null);
            setChecklist([]);
            localStorage.clear();
            alert('Session expired. Please log in again.');
          } else if (session && cachedUserId && session.user.id !== cachedUserId) {
            console.error('[Session] User ID mismatch, forcing logout');
            await supabase.auth.signOut();
            setUser(null);
            setChecklist([]);
            localStorage.clear();
            window.location.reload();
          }
        } catch (error) {
          console.error('[Session] Re-validation failed:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

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
