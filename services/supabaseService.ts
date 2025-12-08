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

export default {
  supabase,
  SupabaseAuthService,
  ProfileService,
  GenerationsService,
  GalleryService,
  isSupabaseConfigured,
};
