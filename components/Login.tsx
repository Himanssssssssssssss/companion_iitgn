import React, { useState } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle, School } from 'lucide-react';

interface LoginProps {
  onLogin?: (user: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        // Validation
        if (studentId.length < 5) {
          setError('Please enter a valid student ID');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        // Sign up
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              student_id: studentId
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        if (!authData.user) {
          setError('Signup failed. Please try again.');
          setLoading(false);
          return;
        }

        // Immediate login with provided data
        const user: UserProfile = {
          name,
          email,
          id: studentId,
          photoUrl: undefined
        };

        onLogin?.(user);
      } else {
        // Sign in
        console.log('[PWA DEBUG] Starting signin flow');
        console.log('[PWA DEBUG] Email:', email);

        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        console.log('[PWA DEBUG] Auth response:', {
          hasData: !!authData,
          hasUser: !!authData?.user,
          hasSession: !!authData?.session,
          error: signInError?.message
        });

        if (signInError) {
          console.error('[PWA DEBUG] Signin error:', signInError);
          setError(signInError.message);
          setLoading(false);
          return;
        }

        if (!authData.user) {
          console.error('[PWA DEBUG] No user in auth response');
          setError('Login failed. Please try again.');
          setLoading(false);
          return;
        }

        console.log('[PWA DEBUG] Auth successful! User ID:', authData.user.id);
        console.log('[PWA DEBUG] Now fetching profile...');

        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Profile fetch timeout after 5s')), 5000)
        );

        // Fetch profile with timeout
        const profileFetchPromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        try {
          const { data: profile, error: profileError } = await Promise.race([
            profileFetchPromise,
            timeoutPromise
          ]) as any;

          console.log('[PWA DEBUG] Profile fetch result:', {
            hasProfile: !!profile,
            error: profileError?.message,
            errorDetails: profileError
          });

          // Construct user object
          const user: UserProfile = {
            name: profile?.name || authData.user.user_metadata?.name || 'Student',
            email: profile?.email || authData.user.email || email,
            id: profile?.student_id || authData.user.user_metadata?.student_id || '000000',
            photoUrl: profile?.id_card_url
          };

          console.log('[PWA DEBUG] Login complete! Calling onLogin');
          onLogin?.(user);
        } catch (fetchError: any) {
          console.error('[PWA DEBUG] Profile fetch failed:', fetchError.message);
          // Fallback - login with auth metadata
          const user: UserProfile = {
            name: authData.user.user_metadata?.name || authData.user.email?.split('@')[0] || 'Student',
            email: authData.user.email || email,
            id: authData.user.user_metadata?.student_id || '000000',
            photoUrl: undefined
          };
          console.log('[PWA DEBUG] Using fallback user');
          onLogin?.(user);
        } finally {
          setLoading(false);
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-600/20 blur-[100px] animate-pulse-slow"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary-600/20 blur-[100px] animate-pulse-slow delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 mb-6 rotate-3 hover:rotate-6 transition-transform duration-300">
            <School size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">IITGN Companion</h1>
          <p className="text-slate-400 text-lg">Your campus life, simplified</p>
        </div>

        <div className="glass p-8 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {/* Toggle */}
          <div className="flex p-1 bg-slate-800/50 rounded-xl mb-8 border border-white/5">
            <button
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${mode === 'signin'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${mode === 'signup'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-400 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                    required
                  />
                </div>
                <div className="relative group">
                  <School className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-400 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Student ID (e.g., 23110000)"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-400 transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-400 transition-colors" size={20} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 animate-in fade-in zoom-in duration-300">
                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                <p className="text-red-400 text-sm leading-relaxed">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary-500/25 flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          © {new Date().getFullYear()} IITGN Companion. Made with ❤️ by Students.
        </p>
      </div>
    </div>
  );
};

export default Login;