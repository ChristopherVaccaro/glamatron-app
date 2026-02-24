/**
 * Favorites Context for Glamatron
 * Manages user's favorite style options with Supabase persistence.
 * Provides optimistic UI updates with error rollback.
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseService';
import { useUser } from './UserContext';

interface FavoritesContextType {
  favoriteStyleOptionIds: string[];
  isFavorited: (styleOptionId: string) => boolean;
  toggleFavorite: (styleOptionId: string) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const { user } = useUser();
  const [favoriteStyleOptionIds, setFavoriteStyleOptionIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchedForUserRef = useRef<string | null>(null);
  
  // Use ref to avoid recreating callbacks when favoriteStyleOptionIds changes
  const favoriteIdsRef = useRef<string[]>([]);
  
  useEffect(() => {
    favoriteIdsRef.current = favoriteStyleOptionIds;
  }, [favoriteStyleOptionIds]);

  // Fetch favorites when user changes
  useEffect(() => {
    if (!user?.id) {
      setFavoriteStyleOptionIds([]);
      fetchedForUserRef.current = null;
      return;
    }

    // Don't re-fetch if we already fetched for this user
    if (fetchedForUserRef.current === user.id) return;

    const fetchFavorites = async () => {
      if (!supabase || !isSupabaseConfigured) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_favorite_style_options')
          .select('style_option_id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ [Favorites] Failed to fetch:', error.message);
          return;
        }

        setFavoriteStyleOptionIds((data || []).map((row) => row.style_option_id));
        fetchedForUserRef.current = user.id;
      } catch (err) {
        console.error('❌ [Favorites] Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  const isFavorited = useCallback(
    (styleOptionId: string) => favoriteStyleOptionIds.includes(styleOptionId),
    [favoriteStyleOptionIds]
  );

  const toggleFavorite = useCallback(
    async (styleOptionId: string) => {
      if (!user?.id) return;

      const wasFavorited = favoriteIdsRef.current.includes(styleOptionId);

      // Optimistic update
      if (wasFavorited) {
        setFavoriteStyleOptionIds((prev) => prev.filter((id) => id !== styleOptionId));
      } else {
        setFavoriteStyleOptionIds((prev) => [styleOptionId, ...prev]);
      }

      try {
        if (!supabase || !isSupabaseConfigured) throw new Error('Supabase not configured');
        if (wasFavorited) {
          const { error } = await supabase
            .from('user_favorite_style_options')
            .delete()
            .eq('user_id', user.id)
            .eq('style_option_id', styleOptionId);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('user_favorite_style_options')
            .insert({ user_id: user.id, style_option_id: styleOptionId });

          if (error) throw error;
        }
      } catch (err: any) {
        // Revert optimistic update
        if (wasFavorited) {
          setFavoriteStyleOptionIds((prev) => [styleOptionId, ...prev]);
        } else {
          setFavoriteStyleOptionIds((prev) => prev.filter((id) => id !== styleOptionId));
        }
        const msg = `Failed to ${wasFavorited ? 'unfavorite' : 'favorite'} style option`;
        console.error(`❌ [Favorites] ${msg}:`, err?.message || err);
        window.dispatchEvent(new CustomEvent('favorites-error', { detail: { message: msg } }));
      }
    },
    [user?.id]
  );

  const value: FavoritesContextType = {
    favoriteStyleOptionIds,
    isFavorited,
    toggleFavorite,
    loading,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
