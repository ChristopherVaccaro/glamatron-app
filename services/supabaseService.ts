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
  has_purchased: boolean; // Whether user has ever purchased GlamCoins
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

export interface DbGalleryItem {
  id: string;
  user_id: string;
  original_image_url: string;
  result_image_url: string;
  selections: Record<string, unknown>;
  is_favorite: boolean;
  title: string | null;
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
 * Profile Service - Manages user profiles and GlamCoins via Supabase
 */
export interface CoinOperationResult {
  success: boolean;
  new_balance: number;
  message: string;
}

export interface SubscriptionResult {
  success: boolean;
  new_balance: number;
  is_now_subscribed: boolean;
}

export const ProfileService = {
  /**
   * Get user profile from Supabase
   */
  async getProfile(userId: string): Promise<DbProfile | null> {
    if (!supabase) {
      console.warn('Supabase not configured, cannot get profile');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .rpc('get_profile', { user_uuid: userId });
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      // RPC returns an array, get first item
      if (data && data.length > 0) {
        const profile = data[0];
        return {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          avatar_url: profile.avatar_url,
          role: profile.role as 'admin' | 'test' | 'user',
          glam_coins: profile.glam_coins,
          is_subscribed: profile.is_subscribed,
          has_purchased: profile.has_purchased ?? false,
          subscription_tier: profile.subscription_tier as 'free' | 'pro' | 'enterprise',
          subscription_expires_at: profile.subscription_expires_at,
          created_at: profile.created_at,
          updated_at: profile.created_at, // Not returned by function, use created_at
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error in getProfile:', error);
      return null;
    }
  },

  /**
   * Deduct a coin from user's balance
   * Returns the result with new balance
   */
  async deductCoin(userId: string): Promise<CoinOperationResult> {
    if (!supabase) {
      console.warn('Supabase not configured, cannot deduct coin');
      return { success: false, new_balance: 0, message: 'Supabase not configured' };
    }
    
    try {
      const { data, error } = await supabase
        .rpc('deduct_coin', { user_uuid: userId });
      
      if (error) {
        console.error('Error deducting coin:', error);
        return { success: false, new_balance: 0, message: error.message };
      }
      
      // RPC returns array with single row
      if (data && data.length > 0) {
        return {
          success: data[0].success,
          new_balance: data[0].new_balance,
          message: data[0].message,
        };
      }
      
      return { success: false, new_balance: 0, message: 'No response from server' };
    } catch (error) {
      console.error('Error in deductCoin:', error);
      return { success: false, new_balance: 0, message: 'Network error' };
    }
  },

  /**
   * Add coins to user's balance
   */
  async addCoins(
    userId: string, 
    amount: number, 
    transactionType: string = 'purchase',
    description: string = 'Coin purchase'
  ): Promise<CoinOperationResult> {
    if (!supabase) {
      console.warn('Supabase not configured, cannot add coins');
      return { success: false, new_balance: 0, message: 'Supabase not configured' };
    }
    
    try {
      const { data, error } = await supabase
        .rpc('add_coins', { 
          user_uuid: userId, 
          amount,
          transaction_type: transactionType,
          trans_description: description,
        });
      
      if (error) {
        console.error('Error adding coins:', error);
        return { success: false, new_balance: 0, message: error.message };
      }
      
      if (data && data.length > 0) {
        return {
          success: data[0].success,
          new_balance: data[0].new_balance,
          message: data[0].message,
        };
      }
      
      return { success: false, new_balance: 0, message: 'No response from server' };
    } catch (error) {
      console.error('Error in addCoins:', error);
      return { success: false, new_balance: 0, message: 'Network error' };
    }
  },

  /**
   * Complete a GlamCoin purchase - adds coins and marks user as having purchased
   * This unlocks the full style library
   */
  async completePurchase(
    userId: string,
    coinsToAdd: number,
    stripePaymentId?: string,
    priceInCents?: number
  ): Promise<CoinOperationResult> {
    if (!supabase) {
      console.warn('Supabase not configured, cannot complete purchase');
      return { success: false, new_balance: 0, message: 'Supabase not configured' };
    }
    
    try {
      const { data, error } = await supabase
        .rpc('complete_purchase', { 
          user_uuid: userId, 
          coins_to_add: coinsToAdd,
          stripe_payment_id: stripePaymentId || null,
          price_in_cents: priceInCents || null,
        });
      
      if (error) {
        console.error('Error completing purchase:', error);
        return { success: false, new_balance: 0, message: error.message };
      }
      
      if (data && data.length > 0) {
        return {
          success: data[0].success,
          new_balance: data[0].new_balance,
          message: data[0].message,
        };
      }
      
      return { success: false, new_balance: 0, message: 'No response from server' };
    } catch (error) {
      console.error('Error in completePurchase:', error);
      return { success: false, new_balance: 0, message: 'Network error' };
    }
  },

  /**
   * Update subscription status
   */
  async updateSubscription(
    userId: string, 
    isSubscribed: boolean,
    bonusCoins: number = 0
  ): Promise<SubscriptionResult> {
    if (!supabase) {
      console.warn('Supabase not configured, cannot update subscription');
      return { success: false, new_balance: 0, is_now_subscribed: false };
    }
    
    try {
      const { data, error } = await supabase
        .rpc('update_subscription', { 
          user_uuid: userId, 
          subscribed: isSubscribed,
          bonus_coins: bonusCoins,
        });
      
      if (error) {
        console.error('Error updating subscription:', error);
        return { success: false, new_balance: 0, is_now_subscribed: false };
      }
      
      if (data && data.length > 0) {
        return {
          success: data[0].success,
          new_balance: data[0].new_balance,
          is_now_subscribed: data[0].is_now_subscribed,
        };
      }
      
      return { success: false, new_balance: 0, is_now_subscribed: false };
    } catch (error) {
      console.error('Error in updateSubscription:', error);
      return { success: false, new_balance: 0, is_now_subscribed: false };
    }
  },

  /**
   * Subscribe to real-time profile changes
   */
  subscribeToProfile(
    userId: string,
    onUpdate: (profile: Partial<DbProfile>) => void
  ): (() => void) | null {
    if (!supabase) {
      console.warn('Supabase not configured, cannot subscribe to profile');
      return null;
    }
    
    const channel = supabase
      .channel(`profile:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('Profile updated:', payload.new);
          onUpdate(payload.new as Partial<DbProfile>);
        }
      )
      .subscribe();
    
    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  },
};

/**
 * Generations Service - Logs and retrieves generation history
 */
export const GenerationsService = {
  /**
   * Log a generation via RPC function
   */
  async logGeneration(
    userId: string, 
    selections: Record<string, unknown>,
    status: 'completed' | 'failed' = 'completed',
    errorMessage?: string
  ): Promise<string | null> {
    if (!supabase) {
      console.warn('Supabase not configured, cannot log generation');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .rpc('log_generation', {
          user_uuid: userId,
          selections_data: selections,
          gen_status: status,
          error_msg: errorMessage || null,
        });
      
      if (error) {
        console.error('Error logging generation:', error);
        return null;
      }
      
      return data as string; // Returns the generation ID
    } catch (error) {
      console.error('Error in logGeneration:', error);
      return null;
    }
  },

  /**
   * Get user's generation history
   */
  async getHistory(userId: string, limit: number = 20): Promise<DbGeneration[]> {
    if (!supabase) {
      console.warn('Supabase not configured, cannot get history');
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching generation history:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getHistory:', error);
      return [];
    }
  },

  /**
   * Get generation count for a user
   */
  async getGenerationCount(userId: string): Promise<number> {
    if (!supabase) return 0;
    
    try {
      const { count, error } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error getting generation count:', error);
        return 0;
      }
      
      return count || 0;
    } catch (error) {
      console.error('Error in getGenerationCount:', error);
      return 0;
    }
  },
};

/**
 * Gallery Service - Handles image storage and gallery items
 */
export const GalleryService = {
  /**
   * Upload an image to Supabase Storage
   * @param userId User's UUID
   * @param imageBase64 Base64 encoded image (with or without data URL prefix)
   * @param type 'original' or 'result'
   * @returns Public URL of the uploaded image
   */
  async uploadImage(userId: string, imageBase64: string, type: 'original' | 'result'): Promise<string | null> {
    if (!supabase) {
      console.warn('Supabase not configured, cannot upload image');
      return null;
    }

    try {
      // Clean base64 string (remove data URL prefix if present)
      const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      
      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 9);
      const filename = `${userId}/${type}_${timestamp}_${randomId}.jpg`;

      // Upload to storage
      const { data, error } = await supabase.storage
        .from('gallery-images')
        .upload(filename, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading image:', error.message, error);
        // If it's a policy error, the bucket policies may not be set correctly
        if (error.message?.includes('policy') || error.message?.includes('403') || error.message?.includes('409')) {
          console.error('Storage policy error - check bucket policies in Supabase Dashboard');
        }
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return null;
    }
  },

  /**
   * Delete an image from Supabase Storage
   * @param imageUrl Full public URL of the image
   */
  async deleteImage(imageUrl: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      // Extract path from URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/gallery-images\/(.+)/);
      if (!pathMatch) return false;

      const filePath = pathMatch[1];
      const { error } = await supabase.storage
        .from('gallery-images')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteImage:', error);
      return false;
    }
  },

  /**
   * Add a new gallery item
   */
  async addItem(
    userId: string,
    originalImageBase64: string,
    resultImageBase64: string,
    selections: Record<string, unknown>
  ): Promise<DbGalleryItem | null> {
    if (!supabase) {
      console.warn('Supabase not configured, cannot add gallery item');
      return null;
    }

    try {
      // Upload both images
      const [originalUrl, resultUrl] = await Promise.all([
        this.uploadImage(userId, originalImageBase64, 'original'),
        this.uploadImage(userId, resultImageBase64, 'result'),
      ]);

      if (!originalUrl || !resultUrl) {
        console.error('Failed to upload images');
        return null;
      }

      // Insert gallery item
      const { data, error } = await supabase
        .from('gallery_items')
        .insert({
          user_id: userId,
          original_image_url: originalUrl,
          result_image_url: resultUrl,
          selections,
          is_favorite: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting gallery item:', error);
        // Clean up uploaded images on failure
        await Promise.all([
          this.deleteImage(originalUrl),
          this.deleteImage(resultUrl),
        ]);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in addItem:', error);
      return null;
    }
  },

  /**
   * Get all gallery items for a user
   */
  async getUserItems(userId: string): Promise<DbGalleryItem[]> {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gallery items:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserItems:', error);
      return [];
    }
  },

  /**
   * Get a single gallery item by ID
   */
  async getItemById(id: string): Promise<DbGalleryItem | null> {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching gallery item:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getItemById:', error);
      return null;
    }
  },

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      // First get current status
      const { data: current, error: fetchError } = await supabase
        .from('gallery_items')
        .select('is_favorite')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching item for toggle:', fetchError);
        return false;
      }

      // Toggle it
      const { error: updateError } = await supabase
        .from('gallery_items')
        .update({ is_favorite: !current.is_favorite })
        .eq('id', id);

      if (updateError) {
        console.error('Error toggling favorite:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      return false;
    }
  },

  /**
   * Remove a gallery item and its images
   */
  async removeItem(id: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      // First get the item to get image URLs
      const item = await this.getItemById(id);
      if (!item) return false;

      // Delete from database
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting gallery item:', error);
        return false;
      }

      // Delete images from storage (don't fail if this fails)
      await Promise.all([
        this.deleteImage(item.original_image_url),
        this.deleteImage(item.result_image_url),
      ]).catch(console.error);

      return true;
    } catch (error) {
      console.error('Error in removeItem:', error);
      return false;
    }
  },

  /**
   * Clear all gallery items for a user
   */
  async clearUserGallery(userId: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      // Get all items first to delete images
      const items = await this.getUserItems(userId);

      // Delete all from database
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error clearing gallery:', error);
        return false;
      }

      // Delete all images from storage
      const deletePromises = items.flatMap(item => [
        this.deleteImage(item.original_image_url),
        this.deleteImage(item.result_image_url),
      ]);
      await Promise.all(deletePromises).catch(console.error);

      return true;
    } catch (error) {
      console.error('Error in clearUserGallery:', error);
      return false;
    }
  },
};

/**
 * Account Service - Handles account deletion
 */
export const AccountService = {
  /**
   * Delete a user's account and all associated data via Edge Function
   * This properly deletes: gallery items, gallery images, profile, and auth.users entry
   */
  async deleteAccount(userId: string): Promise<{ success: boolean; error?: string }> {
    console.log('[AccountService] deleteAccount called for userId:', userId);
    
    if (!supabase) {
      console.error('[AccountService] Supabase not configured');
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      // Get access token from localStorage directly (Supabase stores it there)
      console.log('[AccountService] Getting access token from storage...');
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const storageKey = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`;
      const storedSession = localStorage.getItem(storageKey);
      
      console.log('[AccountService] Storage key:', storageKey, 'Found:', !!storedSession);
      
      if (!storedSession) {
        console.error('[AccountService] No stored session found');
        return { success: false, error: 'Not authenticated' };
      }
      
      const sessionData = JSON.parse(storedSession);
      const accessToken = sessionData?.access_token;
      
      if (!accessToken) {
        console.error('[AccountService] No access token in stored session');
        return { success: false, error: 'Not authenticated' };
      }
      
      console.log('[AccountService] Access token found, calling Edge Function...');

      // Call the Edge Function directly via fetch
      const response = await fetch(`${supabaseUrl}/functions/v1/delete-account`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('[AccountService] Edge Function response status:', response.status);
      
      const data = await response.json();
      console.log('[AccountService] Edge Function response data:', data);

      if (!response.ok) {
        console.error('[AccountService] Edge function error:', data);
        return { success: false, error: data.error || 'Failed to delete account' };
      }

      if (data?.error) {
        console.error('[AccountService] Delete account error:', data.error);
        return { success: false, error: data.error };
      }

      console.log('[AccountService] Account deleted successfully, clearing local storage...');
      
      // Clear the stored session
      localStorage.removeItem(storageKey);
      
      // Sign out locally
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.log('[AccountService] signOut error (expected):', e);
      }

      return { success: true };
    } catch (error) {
      console.error('[AccountService] Error in deleteAccount:', error);
      return { success: false, error: 'Failed to delete account' };
    }
  },

  /**
   * Fallback deletion method if Edge Function is not deployed
   * Deletes user data but leaves auth.users entry orphaned
   */
  async deleteAccountFallback(userId: string): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      // 1. Clear all gallery items and images
      await GalleryService.clearUserGallery(userId);

      // 2. Delete profile (cascades to generations, transactions, subscriptions)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }

      // 3. Sign out the user
      await supabase.auth.signOut();

      return { success: true };
    } catch (error) {
      console.error('Error in deleteAccountFallback:', error);
      return { success: false, error: 'Failed to delete account' };
    }
  },
};

export default {
  supabase,
  SupabaseAuthService,
  ProfileService,
  GenerationsService,
  GalleryService,
  AccountService,
  isSupabaseConfigured,
};
