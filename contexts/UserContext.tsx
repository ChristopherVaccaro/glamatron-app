import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  SPECIAL_EMAILS, 
  DEFAULT_GLAMCOINS,
  SUBSCRIPTION_TIERS,
  SubscriptionFeatures
} from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseService';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface UserContextType {
  user: UserProfile | null;
  isAuthLoading: boolean; // True while checking for existing session
  isAdmin: boolean;
  isTestUser: boolean;
  features: SubscriptionFeatures;
  
  // Auth actions
  signIn: (email: string, name: string) => UserProfile;
  signOut: () => void;
  
  // GlamCoin actions
  deductCoin: () => boolean; // Returns false if no coins left
  addCoins: (amount: number) => void;
  canGenerate: boolean;
  
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
  if (normalizedEmail === SPECIAL_EMAILS.ADMIN) return 'admin';
  
  // Test user only in development (simulated purchases shouldn't be public)
  if (isDevelopment && normalizedEmail === SPECIAL_EMAILS.TEST_USER) return 'test';
  
  return 'user';
}

// Helper to generate user ID
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to create UserProfile from Supabase user
function createProfileFromSupabaseUser(supabaseUser: SupabaseUser): UserProfile {
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

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for Supabase auth state changes
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = createProfileFromSupabaseUser(session.user);
          setUser(profile);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = createProfileFromSupabaseUser(session.user);
          setUser(profile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
    setUser(null);
  }, []);

  // Deduct a coin for generation
  const deductCoin = useCallback((): boolean => {
    if (!user) return false;
    
    // Admin has unlimited
    if (user.role === 'admin') return true;
    
    // Subscribed users have unlimited
    if (user.isSubscribed) return true;
    
    // Check if user has coins
    if (user.glamCoins <= 0) return false;
    
    // Deduct coin
    setUser(prev => prev ? { ...prev, glamCoins: prev.glamCoins - 1 } : null);
    return true;
  }, [user]);

  // Add coins (for purchases)
  const addCoins = useCallback((amount: number) => {
    setUser(prev => prev ? { ...prev, glamCoins: prev.glamCoins + amount } : null);
  }, []);

  // Subscribe
  const subscribe = useCallback(() => {
    setUser(prev => prev ? { ...prev, isSubscribed: true } : null);
  }, []);

  // Unsubscribe
  const unsubscribe = useCallback(() => {
    setUser(prev => prev ? { ...prev, isSubscribed: false } : null);
  }, []);

  // Test user: Simulate purchase
  const simulatePurchase = useCallback((coins: number) => {
    if (!user || user.role !== 'test') return;
    addCoins(coins);
  }, [user, addCoins]);

  // Test user: Simulate subscribe
  const simulateSubscribe = useCallback(() => {
    if (!user || user.role !== 'test') return;
    setUser(prev => prev ? { ...prev, isSubscribed: !prev.isSubscribed } : null);
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

  const value: UserContextType = {
    user,
    isAuthLoading: isLoading,
    isAdmin,
    isTestUser,
    features,
    signIn,
    signOut,
    deductCoin,
    addCoins,
    canGenerate,
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
