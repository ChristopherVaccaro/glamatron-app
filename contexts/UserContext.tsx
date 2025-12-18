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
  completePurchase: (coins: number, stripePaymentId?: string, priceInCents?: number) => Promise<boolean>; // Complete a purchase
  canGenerate: boolean;
  
  // Generation logging
  logGeneration: (selections: Record<string, unknown>, status?: 'completed' | 'failed', errorMessage?: string) => Promise<void>;
  
  // Test user actions (only work for test user)
  simulatePurchase: (coins: number) => void;
  resetTestUser: () => void;
  
  // Profile refresh (for after payment returns)
  refreshProfile: () => Promise<void>;
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
    normalizedEmail === 'emailchrisvaccaro@gmail.com'
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
  let hasPurchased = false;
  
  if (role === 'admin') {
    glamCoins = 9999;
    isSubscribed = true;
    hasPurchased = true;
  }

  return {
    id: supabaseUser.id,
    email: email.toLowerCase().trim(),
    name,
    avatar: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
    role,
    glamCoins,
    isSubscribed,
    hasPurchased,
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
    hasPurchased: dbProfile.has_purchased ?? false,
    createdAt: new Date(dbProfile.created_at),
  };
}

// Async helper to fetch profile from DB and create UserProfile
// If existingProfile is provided and fetch fails, returns null to indicate "keep existing"
async function fetchAndCreateProfile(
  supabaseUser: SupabaseUser, 
  existingProfile?: UserProfile | null
): Promise<UserProfile | null> {
  // Try to fetch from database first, with a timeout to prevent hanging
  try {
    console.log('Attempting to fetch profile from DB...');
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
    );
    
    const dbProfile = await Promise.race([
      ProfileService.getProfile(supabaseUser.id),
      timeoutPromise
    ]);
    
    if (dbProfile) {
      console.log('Profile loaded from Supabase DB:', dbProfile.glam_coins, 'coins');
      return createProfileFromDbProfile(dbProfile, supabaseUser);
    }
  } catch (error) {
    console.warn('Profile fetch failed or timed out:', error);
  }
  
  // If we already have a profile for this user, DON'T overwrite with fallback defaults
  // This prevents resetting coins to 5 when fetch fails but user is already logged in
  if (existingProfile && existingProfile.id === supabaseUser.id) {
    console.log('Keeping existing profile (fetch failed, user already logged in)');
    return null; // Signal to keep existing state
  }
  
  // Only use fallback for truly new sessions (no existing profile)
  console.log('Using basic profile (DB unavailable or timeout, new session)');
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
            if (profile) {
              setUser(profile);
            }
            
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
            if (profile) {
              setUser(profile);
            }
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
    // IMPORTANT: We use a ref pattern via closure to access current user state
    // because the listener captures stale state otherwise
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Use functional update to get current state
          setUser(currentUser => {
            // If we already have a user with the same ID, skip re-fetch
            // This prevents overwrites on token refresh events
            if (currentUser && currentUser.id === session.user!.id) {
              console.log('SIGNED_IN: User already logged in, skipping re-fetch');
              setIsLoading(false);
              return currentUser; // Keep existing state
            }
            
            // New user signing in - fetch profile asynchronously
            console.log('SIGNED_IN: New sign-in, fetching profile...');
            fetchAndCreateProfile(session.user!, currentUser)
              .then(profile => {
                if (profile) {
                  console.log('Profile fetched:', profile.email, profile.glamCoins, 'coins');
                  setUser(profile);
                }
                setIsLoading(false);
              })
              .catch(error => {
                console.error('Error fetching profile on sign-in:', error);
                // Only use fallback if we don't have an existing user
                if (!currentUser) {
                  const basicProfile = createBasicProfileFromSupabaseUser(session.user!);
                  setUser(basicProfile);
                }
                setIsLoading(false);
              });
            
            return currentUser; // Return current while async fetch runs
          });
        } else if (event === 'PASSWORD_RECOVERY' && session?.user) {
          // User clicked password reset link
          setUser(currentUser => {
            fetchAndCreateProfile(session.user!, currentUser)
              .then(profile => {
                if (profile) {
                  setUser(profile);
                }
                setPendingPasswordRecovery(true);
                setIsLoading(false);
              })
              .catch(error => {
                console.error('Error fetching profile on password recovery:', error);
                setIsLoading(false);
              });
            return currentUser;
          });
        } else if (event === 'USER_UPDATED' && session?.user) {
          // User updated (e.g., password changed)
          // Only update metadata, don't re-fetch coins (they didn't change)
          setUser(currentUser => {
            if (currentUser && currentUser.id === session.user!.id) {
              console.log('USER_UPDATED: Updating metadata only');
              return {
                ...currentUser,
                name: session.user!.user_metadata?.full_name || 
                      session.user!.user_metadata?.name || 
                      currentUser.name,
                avatar: session.user!.user_metadata?.avatar_url || 
                        session.user!.user_metadata?.picture || 
                        currentUser.avatar,
              };
            }
            return currentUser;
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setPendingPasswordRecovery(false);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          // Token was refreshed - DO NOT re-fetch profile
          // This is the main cause of the coin reset bug
          console.log('TOKEN_REFRESHED: Token refreshed, keeping current user state');
          // No action needed - keep existing user state
        } else if (event === 'INITIAL_SESSION') {
          // Initial session check complete
          console.log('Initial session event, session:', session?.user?.email);
          setUser(currentUser => {
            // Skip if we already loaded the user (from initializeAuth)
            if (currentUser && session?.user && currentUser.id === session.user.id) {
              console.log('INITIAL_SESSION: User already loaded, skipping');
              setIsLoading(false);
              return currentUser;
            }
            
            if (session?.user) {
              fetchAndCreateProfile(session.user, currentUser)
                .then(profile => {
                  if (profile) {
                    setUser(profile);
                  }
                  setIsLoading(false);
                })
                .catch(error => {
                  console.error('Error fetching profile on initial session:', error);
                  if (!currentUser) {
                    const basicProfile = createBasicProfileFromSupabaseUser(session.user!);
                    setUser(basicProfile);
                  }
                  setIsLoading(false);
                });
              return currentUser;
            }
            
            setIsLoading(false);
            return currentUser;
          });
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

  // Determine feature access based on role and purchase status
  // Full styles unlock after any GlamCoin purchase
  const features = useMemo((): SubscriptionFeatures => {
    if (!user) return SUBSCRIPTION_TIERS.free;
    if (user.role === 'admin') return SUBSCRIPTION_TIERS.admin;
    if (user.hasPurchased) return SUBSCRIPTION_TIERS.purchased;
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
    let hasPurchased = false;
    
    if (role === 'admin') {
      glamCoins = 9999; // "Unlimited" display
      isSubscribed = true;
      hasPurchased = true;
    } else if (role === 'test') {
      glamCoins = DEFAULT_GLAMCOINS;
      isSubscribed = false;
      hasPurchased = false;
    }

    const newUser: UserProfile = {
      id: generateUserId(),
      email: email.toLowerCase().trim(),
      name,
      role,
      glamCoins,
      isSubscribed,
      hasPurchased,
      createdAt: new Date(),
      // Store defaults for test user reset
      ...(role === 'test' && {
        _testUserDefaults: {
          glamCoins: DEFAULT_GLAMCOINS,
          isSubscribed: false,
          hasPurchased: false,
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

  // Complete a GlamCoin purchase - adds coins and marks user as having purchased
  // This unlocks the full style library
  const completePurchase = useCallback(async (
    coins: number,
    stripePaymentId?: string,
    priceInCents?: number
  ): Promise<boolean> => {
    if (!user) return false;
    
    if (isSupabaseConfigured) {
      const result = await ProfileService.completePurchase(user.id, coins, stripePaymentId, priceInCents);
      
      if (result.success) {
        // Update local state with new balance and mark as purchased
        setUser(prev => prev ? { 
          ...prev, 
          glamCoins: result.new_balance,
          hasPurchased: true 
        } : null);
        return true;
      } else {
        console.error('Failed to complete purchase:', result.message);
        return false;
      }
    }
    
    // Fallback to local-only
    setUser(prev => prev ? { 
      ...prev, 
      glamCoins: prev.glamCoins + coins,
      hasPurchased: true 
    } : null);
    return true;
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

  // Test user: Simulate purchase (for testing the purchase flow)
  const simulatePurchase = useCallback((coins: number) => {
    if (!user || user.role !== 'test') return;
    // Simulate a purchase by adding coins and marking as purchased
    setUser(prev => prev ? { 
      ...prev, 
      glamCoins: prev.glamCoins + coins,
      hasPurchased: true 
    } : null);
  }, [user]);

  // Test user: Reset to defaults
  const resetTestUser = useCallback(() => {
    if (!user || user.role !== 'test') return;
    
    const defaults = user._testUserDefaults || {
      glamCoins: DEFAULT_GLAMCOINS,
      isSubscribed: false,
      hasPurchased: false,
    };
    
    setUser(prev => prev ? {
      ...prev,
      glamCoins: defaults.glamCoins,
      isSubscribed: defaults.isSubscribed,
      hasPurchased: defaults.hasPurchased,
    } : null);
  }, [user]);

  // Clear password recovery state (after user completes reset)
  const clearPasswordRecovery = useCallback(() => {
    setPendingPasswordRecovery(false);
  }, []);

  // Refresh profile from database (e.g., after payment returns)
  const refreshProfile = useCallback(async () => {
    if (!user || !isSupabaseConfigured) return;
    
    try {
      console.log('Refreshing profile from database...');
      const dbProfile = await ProfileService.getProfile(user.id);
      
      if (dbProfile) {
        console.log('Profile refreshed:', dbProfile.glam_coins, 'coins, has_purchased:', dbProfile.has_purchased);
        setUser(prev => prev ? {
          ...prev,
          glamCoins: dbProfile.glam_coins,
          isSubscribed: dbProfile.is_subscribed,
          hasPurchased: dbProfile.has_purchased,
        } : null);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [user]);

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
    completePurchase,
    canGenerate,
    logGeneration,
    simulatePurchase,
    resetTestUser,
    refreshProfile,
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
