/**
 * Supabase Service
 * 
 * Handles authentication and database operations with Supabase.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Auth features will not work.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * Database types matching the Supabase schema
 */
export interface DbProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'test' | 'user';
  glam_coins: number;
  is_subscribed: boolean;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbGeneration {
  id: string;
  user_id: string;
  original_image_url: string | null;
  generated_image_url: string | null;
  selections: Record<string, unknown>;
  coins_used: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
}

export interface DbTransaction {
  id: string;
  user_id: string;
  type: 'purchase' | 'bonus' | 'subscription' | 'refund' | 'admin_grant';
  coins_amount: number;
  price_cents: number | null;
  currency: string;
  stripe_payment_id: string | null;
  description: string | null;
  created_at: string;
}

/**
 * Supabase Auth Service (for future implementation)
 */
export const SupabaseAuthService = {
  /**
   * Sign up a new user
   */
  // async signUp(email: string, password: string, name: string) {
  //   if (!supabase) throw new Error('Supabase not configured');
  //   
  //   const { data, error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       data: { name }
  //     }
  //   });
  //   
  //   if (error) throw error;
  //   return data;
  // },

  /**
   * Sign in with email/password
   */
  // async signIn(email: string, password: string) {
  //   if (!supabase) throw new Error('Supabase not configured');
  //   
  //   const { data, error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password
  //   });
  //   
  //   if (error) throw error;
  //   return data;
  // },

  /**
   * Sign in with OAuth (Google, Apple)
   */
  // async signInWithOAuth(provider: 'google' | 'apple') {
  //   if (!supabase) throw new Error('Supabase not configured');
  //   
  //   const { data, error } = await supabase.auth.signInWithOAuth({
  //     provider,
  //     options: {
  //       redirectTo: `${window.location.origin}/auth/callback`
  //     }
  //   });
  //   
  //   if (error) throw error;
  //   return data;
  // },

  /**
   * Sign out
   */
  // async signOut() {
  //   if (!supabase) throw new Error('Supabase not configured');
  //   
  //   const { error } = await supabase.auth.signOut();
  //   if (error) throw error;
  // },

  /**
   * Get current session
   */
  // async getSession() {
  //   if (!supabase) return null;
  //   
  //   const { data: { session } } = await supabase.auth.getSession();
  //   return session;
  // },
};

/**
 * Profile Service (for future implementation)
 */
export const ProfileService = {
  /**
   * Get user profile
   */
  // async getProfile(userId: string): Promise<DbProfile | null> {
  //   if (!supabase) return null;
  //   
  //   const { data, error } = await supabase
  //     .from('profiles')
  //     .select('*')
  //     .eq('id', userId)
  //     .single();
  //   
  //   if (error) throw error;
  //   return data;
  // },

  /**
   * Deduct a coin from user's balance
   */
  // async deductCoin(userId: string): Promise<boolean> {
  //   if (!supabase) return false;
  //   
  //   const { data, error } = await supabase
  //     .rpc('deduct_coin', { user_uuid: userId });
  //   
  //   if (error) throw error;
  //   return data as boolean;
  // },

  /**
   * Add coins to user's balance
   */
  // async addCoins(userId: string, amount: number): Promise<boolean> {
  //   if (!supabase) return false;
  //   
  //   const { data, error } = await supabase
  //     .rpc('add_coins', { user_uuid: userId, amount });
  //   
  //   if (error) throw error;
  //   return data as boolean;
  // },

  /**
   * Update subscription status
   */
  // async updateSubscription(userId: string, isSubscribed: boolean): Promise<void> {
  //   if (!supabase) return;
  //   
  //   const { error } = await supabase
  //     .from('profiles')
  //     .update({ 
  //       is_subscribed: isSubscribed,
  //       subscription_tier: isSubscribed ? 'pro' : 'free',
  //       updated_at: new Date().toISOString()
  //     })
  //     .eq('id', userId);
  //   
  //   if (error) throw error;
  // },
};

/**
 * Generations Service (for future implementation)
 */
export const GenerationsService = {
  /**
   * Log a generation
   */
  // async logGeneration(
  //   userId: string, 
  //   selections: Record<string, unknown>,
  //   status: 'completed' | 'failed' = 'completed'
  // ): Promise<void> {
  //   if (!supabase) return;
  //   
  //   const { error } = await supabase
  //     .from('generations')
  //     .insert({
  //       user_id: userId,
  //       selections,
  //       status,
  //       coins_used: 1
  //     });
  //   
  //   if (error) throw error;
  // },

  /**
   * Get user's generation history
   */
  // async getHistory(userId: string, limit: number = 20): Promise<DbGeneration[]> {
  //   if (!supabase) return [];
  //   
  //   const { data, error } = await supabase
  //     .from('generations')
  //     .select('*')
  //     .eq('user_id', userId)
  //     .order('created_at', { ascending: false })
  //     .limit(limit);
  //   
  //   if (error) throw error;
  //   return data || [];
  // },
};

export default {
  supabase,
  SupabaseAuthService,
  ProfileService,
  GenerationsService,
  isSupabaseConfigured,
};
