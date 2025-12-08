import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, ArrowRight, Coins, FlaskConical, Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { SPECIAL_EMAILS, UserProfile } from '../types';
import { Analytics } from '../utils/analytics';
import { supabase, isSupabaseConfigured } from '../services/supabaseService';

// Legacy export for backwards compatibility
export interface UserData {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'apple';
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn?: (user: UserData) => void;
  defaultMode?: 'signin' | 'signup';
  onForgotPassword?: () => void;
  signInOnly?: boolean; // When true, hides the signup option
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSignIn, defaultMode = 'signin', onForgotPassword, signInOnly = false }) => {
  const { signIn } = useUser();
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Update mode when defaultMode prop changes
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
    }
  }, [isOpen, defaultMode]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Quick access buttons for dev emails
  const quickAccessEmails = [
    { email: SPECIAL_EMAILS.TEST_USER, label: 'Test User', icon: FlaskConical, color: 'violet' },
    { email: SPECIAL_EMAILS.ADMIN, label: 'Admin', icon: Shield, color: 'red' },
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMessage(null);

    // Validate inputs
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }

    if (mode === 'signup' && !name) {
      setAuthError('Please enter your name.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    // Use Supabase if configured
    if (supabase && isSupabaseConfigured) {
      setIsEmailLoading(true);

      try {
        if (mode === 'signup') {
          // Sign up with Supabase
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name,
                full_name: name,
              },
              emailRedirectTo: `${window.location.origin}`,
            },
          });

          if (error) {
            setAuthError(error.message);
            setIsEmailLoading(false);
            return;
          }

          // Check if email confirmation is required
          if (data.user && !data.session) {
            // Email confirmation required
            setSuccessMessage('Check your email for a confirmation link to complete your registration.');
            setIsEmailLoading(false);
            Analytics.userSignup('email');
            return;
          }

          // User is signed in immediately (email confirmation disabled)
          if (data.session) {
            Analytics.userSignup('email');
            onClose();
          }
        } else {
          // Sign in with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            if (error.message.includes('Invalid login credentials')) {
              setAuthError('Invalid email or password. Please try again.');
            } else if (error.message.includes('Email not confirmed')) {
              setAuthError('Please confirm your email address before signing in.');
            } else {
              setAuthError(error.message);
            }
            setIsEmailLoading(false);
            return;
          }

          if (data.session) {
            Analytics.userLogin('email');
            onClose();
          }
        }
      } catch (err: any) {
        console.error('Email auth error:', err);
        setAuthError('An unexpected error occurred. Please try again.');
      }

      setIsEmailLoading(false);
    } else {
      // Fallback for dev mode without Supabase
      const userName = name || email.split('@')[0] || 'User';
      const userProfile = signIn(email, userName);
      
      if (mode === 'signup') {
        Analytics.userSignup('email');
      } else {
        Analytics.userLogin('email');
      }
      
      const userData: UserData = {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        provider: 'email',
      };
      onSignIn?.(userData);
      onClose();
    }
  };

  const handleQuickAccess = (quickEmail: string) => {
    const userName = quickEmail.split('@')[0];
    const userProfile = signIn(quickEmail, userName);
    
    const userData: UserData = {
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      provider: 'email',
    };
    onSignIn?.(userData);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    if (!supabase || !isSupabaseConfigured) {
      setAuthError('Authentication is not configured. Please try again later.');
      return;
    }

    setIsGoogleLoading(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });

      if (error) {
        console.error('Google sign-in error:', error);
        setAuthError(error.message);
        setIsGoogleLoading(false);
      }
      // If successful, user will be redirected to Google
      // The auth state change will be handled by UserContext
    } catch (err) {
      console.error('Google sign-in error:', err);
      setAuthError('Failed to sign in with Google. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header - hide promotional text when showing confirmation */}
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {successMessage ? 'Almost there!' : (mode === 'signin' ? 'Welcome back' : 'Create account')}
          </h2>
          {!successMessage && (
            <>
              {mode === 'signin' ? (
                <p className="text-slate-500 mt-1">Sign in and glam up!</p>
              ) : (
                <div className="flex items-center justify-center gap-1 mt-2 text-amber-600">
                  <Coins size={16} />
                  <span className="text-sm font-medium">Join and get 5 free GlamCoins to start</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Auth Error */}
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {authError}
            </div>
          )}

          {/* Success Message - Full Screen Version */}
          {successMessage ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Check Your Email</h3>
              <p className="text-slate-600 mb-6">
                We've sent a confirmation link to <span className="font-medium">{email}</span>. 
                Click the link to activate your account.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                Got it
              </button>
            </div>
          ) : (
          <>
          {/* Google Sign-in Button */}
          <div className="mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {mode === 'signup' && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            )}

            {mode === 'signin' && (
              <div className="text-right">
                <button 
                  type="button" 
                  onClick={onForgotPassword}
                  className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isEmailLoading}
              className="w-full py-3 bg-[#0F172A] text-white font-semibold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isEmailLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode - hidden in signInOnly mode */}
          {!signInOnly && (
            <p className="text-center text-slate-500 mt-6">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setAuthError(null);
                  setSuccessMessage(null);
                }}
                className="text-slate-700 hover:text-slate-900 font-semibold"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          )}

          {/* Developer Quick Access - Only show in development */}
          {import.meta.env.DEV && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400 mb-3 text-center">Developer Quick Access</p>
              <div className="flex gap-2">
                {quickAccessEmails.map(({ email: qEmail, label, icon: Icon, color }) => (
                  <button
                    key={qEmail}
                    onClick={() => handleQuickAccess(qEmail)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      color === 'violet' 
                        ? 'bg-violet-100 text-violet-700 hover:bg-violet-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
