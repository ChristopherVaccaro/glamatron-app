import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  SPECIAL_EMAILS, 
  DEFAULT_GLAMCOINS,
  SUBSCRIPTION_TIERS,
  SubscriptionFeatures
} from '../types';
import { 
  supabase, 
  isSupabaseConfigured, 
  ProfileService, 
  GenerationsService,
  DbProfile 
} from '../services/supabaseService';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface UserContextType {
  user: UserProfile | null;
  isAuthLoading: boolean; // True while checking for existing session
  isAdmin: boolean;
  isTestUser: boolean;
  features: SubscriptionFeatures;
  
  // Auth events
  pendingPasswordRecovery: boolean; // True when user clicked password reset link
  clearPasswordRecovery: () => void;
  
  // Auth actions
  signIn: (email: string, name: string) => UserProfile;
  signOut: () => void;
  
  // GlamCoin actions
  deductCoin: () => Promise<boolean>; // Returns false if no coins left (async - calls Supabase)
  addCoins: (amount: number) => Promise<boolean>; // Returns false if failed
  canGenerate: boolean;
  
  // Generation logging
  logGeneration: (selections: Record<string, unknown>, status?: 'completed' | 'failed', errorMessage?: string) => Promise<void>;
  
  // Subscription actions
  subscribe: () => void;
  unsubscribe: () => void;
  
  // Test user actions (only work for test user)
  simulatePurchase: (coins: number) => void;
  simulateSubscribe: () => void;
  resetTestUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

// Check if we're in development mode
// Vite sets import.meta.env.PROD to true in production builds
const isDevelopment = !import.meta.env.PROD;

// Helper to determine role from email
function getRoleFromEmail(email: string): UserRole {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Admin always works (needed to test/demo production)
  if (
    normalizedEmail === SPECIAL_EMAILS.ADMIN || 
    normalizedEmail === 'emailchrisvaccaro@gmail.com' ||
    normalizedEmail === 'therise03@hotmail.com'
  ) return 'admin';
  
  // Test user only in development (simulated purchases shouldn't be public)
  if (isDevelopment && normalizedEmail === SPECIAL_EMAILS.TEST_USER) return 'test';
  
  return 'user';
}

// Helper to generate user ID
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to create basic UserProfile from Supabase auth user (fallback when DB unavailable)
function createBasicProfileFromSupabaseUser(supabaseUser: SupabaseUser): UserProfile {
  const email = supabaseUser.email || '';
  const role = getRoleFromEmail(email);
  const name = supabaseUser.user_metadata?.full_name || 
               supabaseUser.user_metadata?.name || 
               email.split('@')[0] || 
               'User';
  
  let glamCoins = DEFAULT_GLAMCOINS;
  let isSubscribed = false;
  
  if (role === 'admin') {
    glamCoins = 9999;
    isSubscribed = true;
  }

  return {
    id: supabaseUser.id,
    email: email.toLowerCase().trim(),
    name,
    avatar: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
    role,
    glamCoins,
    isSubscribed,
    createdAt: new Date(supabaseUser.created_at),
  };
}

// Helper to create UserProfile from Supabase DB profile
function createProfileFromDbProfile(dbProfile: DbProfile, supabaseUser?: SupabaseUser): UserProfile {
  const role = getRoleFromEmail(dbProfile.email);
  
  return {
    id: dbProfile.id,
    email: dbProfile.email,
    name: dbProfile.name || dbProfile.email.split('@')[0],
    avatar: dbProfile.avatar_url || supabaseUser?.user_metadata?.avatar_url || supabaseUser?.user_metadata?.picture,
    role,
    glamCoins: dbProfile.glam_coins,
    isSubscribed: dbProfile.is_subscribed,
    createdAt: new Date(dbProfile.created_at),
  };
}

// Async helper to fetch profile from DB and create UserProfile
async function fetchAndCreateProfile(supabaseUser: SupabaseUser): Promise<UserProfile> {
  // Try to fetch from database first
  const dbProfile = await ProfileService.getProfile(supabaseUser.id);
  
  if (dbProfile) {
    console.log('Profile loaded from Supabase DB:', dbProfile.glam_coins, 'coins');
    return createProfileFromDbProfile(dbProfile, supabaseUser);
  }
  
  // Fallback to basic profile if DB fetch fails
  console.log('Using basic profile (DB unavailable)');
  return createBasicProfileFromSupabaseUser(supabaseUser);
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingPasswordRecovery, setPendingPasswordRecovery] = useState(false);

  // Listen for Supabase auth state changes
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        // Check URL hash for auth tokens (email confirmation, password recovery, etc.)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        // If we have tokens in the URL, let Supabase handle them
        // This happens for email confirmation and password recovery links
        if (accessToken && refreshToken) {
          console.log('Auth redirect detected, type:', type);
          
          // Set the session from URL tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            console.error('Error setting session from URL:', error);
          } else if (data.session?.user) {
            const profile = await fetchAndCreateProfile(data.session.user);
            setUser(profile);
            
            // Check if this is a password recovery flow
            if (type === 'recovery') {
              setPendingPasswordRecovery(true);
            }
          }
          
          // Clean up URL hash
          window.history.replaceState(null, '', window.location.pathname);
        } else {
          // Normal session check
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile = await fetchAndCreateProfile(session.user);
            setUser(profile);
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes (sign in, sign out, token refresh, password recovery)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchAndCreateProfile(session.user);
          setUser(profile);
        } else if (event === 'PASSWORD_RECOVERY' && session?.user) {
          // User clicked password reset link
          const profile = await fetchAndCreateProfile(session.user);
          setUser(profile);
          setPendingPasswordRecovery(true);
        } else if (event === 'USER_UPDATED' && session?.user) {
          // User updated (e.g., password changed)
          const profile = await fetchAndCreateProfile(session.user);
          setUser(profile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setPendingPasswordRecovery(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Real-time subscription to profile changes (for external updates like admin grants)
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;
    
    const unsubscribe = ProfileService.subscribeToProfile(user.id, (updatedProfile) => {
      // Update local state when profile changes in DB
      if (updatedProfile.glam_coins !== undefined) {
        setUser(prev => prev ? { ...prev, glamCoins: updatedProfile.glam_coins as number } : null);
      }
      if (updatedProfile.is_subscribed !== undefined) {
        setUser(prev => prev ? { ...prev, isSubscribed: updatedProfile.is_subscribed as boolean } : null);
      }
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id]); // Only re-subscribe when user ID changes

  // Derived state
  const isAdmin = user?.role === 'admin';
  const isTestUser = user?.role === 'test';

  // Determine feature access based on role and subscription
  const features = useMemo((): SubscriptionFeatures => {
    if (!user) return SUBSCRIPTION_TIERS.free;
    if (user.role === 'admin') return SUBSCRIPTION_TIERS.admin;
    if (user.isSubscribed) return SUBSCRIPTION_TIERS.subscribed;
    return SUBSCRIPTION_TIERS.free;
  }, [user]);

  // Can user generate? (has coins OR has unlimited access)
  const canGenerate = useMemo(() => {
    if (!user) return false;
    if (features.unlimitedGenerations) return true;
    return user.glamCoins > 0;
  }, [user, features]);

  // Sign in - creates or loads user profile
  const signIn = useCallback((email: string, name: string): UserProfile => {
    const role = getRoleFromEmail(email);
    
    // Set initial state based on role
    let glamCoins = DEFAULT_GLAMCOINS;
    let isSubscribed = false;
    
    if (role === 'admin') {
      glamCoins = 9999; // "Unlimited" display
      isSubscribed = true;
    } else if (role === 'test') {
      glamCoins = DEFAULT_GLAMCOINS;
      isSubscribed = false;
    }

    const newUser: UserProfile = {
      id: generateUserId(),
      email: email.toLowerCase().trim(),
      name,
      role,
      glamCoins,
      isSubscribed,
      createdAt: new Date(),
      // Store defaults for test user reset
      ...(role === 'test' && {
        _testUserDefaults: {
          glamCoins: DEFAULT_GLAMCOINS,
          isSubscribed: false,
        }
      })
    };

    setUser(newUser);
    return newUser;
  }, []);

  // Sign out - reset state and sign out from Supabase
  const signOut = useCallback(async () => {
    // Clear user state immediately for responsive UI
    setUser(null);
    
    if (supabase && isSupabaseConfigured) {
      try {
        // Clear localStorage session directly (in case signOut hangs)
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (supabaseUrl) {
          const storageKey = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`;
          localStorage.removeItem(storageKey);
        }
        
        // Try to sign out from Supabase (with timeout)
        const signOutPromise = supabase.auth.signOut();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Sign out timeout')), 3000)
        );
        
        await Promise.race([signOutPromise, timeoutPromise]);
      } catch (error) {
        console.error('Error signing out:', error);
        // Already cleared user state and localStorage, so user is effectively signed out
      }
    }
  }, []);

  // Deduct a coin for generation (calls Supabase)
  const deductCoin = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    
    // Admin has unlimited - no DB call needed
    if (user.role === 'admin') return true;
    
    // Subscribed users have unlimited - no DB call needed
    if (user.isSubscribed) return true;
    
    // Check if user has coins locally first (optimistic check)
    if (user.glamCoins <= 0) return false;
    
    // Call Supabase to deduct coin
    if (isSupabaseConfigured) {
      const result = await ProfileService.deductCoin(user.id);
      
      if (result.success) {
        // Update local state with new balance from server
        setUser(prev => prev ? { ...prev, glamCoins: result.new_balance } : null);
        return true;
      } else {
        console.warn('Failed to deduct coin:', result.message);
        // If server says insufficient coins, sync local state
        if (result.message === 'Insufficient coins') {
          setUser(prev => prev ? { ...prev, glamCoins: 0 } : null);
        }
        return false;
      }
    }
    
    // Fallback to local-only if Supabase not configured
    setUser(prev => prev ? { ...prev, glamCoins: prev.glamCoins - 1 } : null);
    return true;
  }, [user]);

  // Add coins (for purchases) - calls Supabase
  const addCoins = useCallback(async (amount: number): Promise<boolean> => {
    if (!user) return false;
    
    if (isSupabaseConfigured) {
      const result = await ProfileService.addCoins(user.id, amount, 'purchase', 'Coin purchase');
      
      if (result.success) {
        // Update local state with new balance from server
        setUser(prev => prev ? { ...prev, glamCoins: result.new_balance } : null);
        return true;
      } else {
        console.error('Failed to add coins:', result.message);
        return false;
      }
    }
    
    // Fallback to local-only
    setUser(prev => prev ? { ...prev, glamCoins: prev.glamCoins + amount } : null);
    return true;
  }, [user]);

  // Subscribe (adds 100 coins as monthly bonus) - calls Supabase
  const subscribe = useCallback(async () => {
    if (!user) return;
    
    if (isSupabaseConfigured) {
      const result = await ProfileService.updateSubscription(user.id, true, 100);
      
      if (result.success) {
        setUser(prev => prev ? { 
          ...prev, 
          isSubscribed: result.is_now_subscribed,
          glamCoins: result.new_balance
        } : null);
        return;
      }
    }
    
    // Fallback to local-only
    setUser(prev => prev ? { 
      ...prev, 
      isSubscribed: true,
      glamCoins: prev.glamCoins + 100
    } : null);
  }, [user]);

  // Unsubscribe - calls Supabase
  const unsubscribe = useCallback(async () => {
    if (!user) return;
    
    if (isSupabaseConfigured) {
      const result = await ProfileService.updateSubscription(user.id, false, 0);
      
      if (result.success) {
        setUser(prev => prev ? { ...prev, isSubscribed: false } : null);
        return;
      }
    }
    
    // Fallback to local-only
    setUser(prev => prev ? { ...prev, isSubscribed: false } : null);
  }, [user]);

  // Log a generation to Supabase
  const logGeneration = useCallback(async (
    selections: Record<string, unknown>,
    status: 'completed' | 'failed' = 'completed',
    errorMessage?: string
  ): Promise<void> => {
    if (!user || !isSupabaseConfigured) return;
    
    await GenerationsService.logGeneration(user.id, selections, status, errorMessage);
  }, [user]);

  // Test user: Simulate purchase
  const simulatePurchase = useCallback((coins: number) => {
    if (!user || user.role !== 'test') return;
    addCoins(coins);
  }, [user, addCoins]);

  // Test user: Simulate subscribe (adds 100 coins when subscribing)
  const simulateSubscribe = useCallback(() => {
    if (!user || user.role !== 'test') return;
    // Only add coins when subscribing, not when already subscribed
    if (!user.isSubscribed) {
      setUser(prev => prev ? { 
        ...prev, 
        isSubscribed: true,
        glamCoins: prev.glamCoins + 100 // Monthly bonus
      } : null);
    }
  }, [user]);

  // Test user: Reset to defaults
  const resetTestUser = useCallback(() => {
    if (!user || user.role !== 'test') return;
    
    const defaults = user._testUserDefaults || {
      glamCoins: DEFAULT_GLAMCOINS,
      isSubscribed: false,
    };
    
    setUser(prev => prev ? {
      ...prev,
      glamCoins: defaults.glamCoins,
      isSubscribed: defaults.isSubscribed,
    } : null);
  }, [user]);

  // Clear password recovery state (after user completes reset)
  const clearPasswordRecovery = useCallback(() => {
    setPendingPasswordRecovery(false);
  }, []);

  const value: UserContextType = {
    user,
    isAuthLoading: isLoading,
    isAdmin,
    isTestUser,
    features,
    pendingPasswordRecovery,
    clearPasswordRecovery,
    signIn,
    signOut,
    deductCoin,
    addCoins,
    canGenerate,
    logGeneration,
    subscribe,
    unsubscribe,
    simulatePurchase,
    simulateSubscribe,
    resetTestUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
