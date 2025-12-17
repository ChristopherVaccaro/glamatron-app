import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { GalleryItem, UserSelections } from '../types';
import { GalleryService, isSupabaseConfigured, DbGalleryItem } from '../services/supabaseService';

interface GalleryContextType {
  items: GalleryItem[];
  isLoading: boolean;
  
  // Actions - now async for Supabase
  addItem: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => Promise<GalleryItem | null>;
  removeItem: (id: string) => Promise<void>;
  removeItems: (ids: string[]) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  clearUserGallery: (userId: string) => Promise<void>;
  loadUserGallery: (userId: string) => Promise<void>;
  
  // Getters
  getUserItems: (userId: string) => GalleryItem[];
  getItemById: (id: string) => GalleryItem | undefined;
}

const GalleryContext = createContext<GalleryContextType | null>(null);

// Local storage key (fallback when Supabase not configured)
const STORAGE_KEY = 'glamatron_gallery';

// Helper to generate unique ID (for localStorage fallback)
function generateId(): string {
  return `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to load from localStorage (fallback)
function loadFromStorage(): GalleryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
      }));
    }
  } catch (e) {
    console.error('Failed to load gallery from storage:', e);
  }
  return [];
}

// Helper to save to localStorage (fallback)
function saveToStorage(items: GalleryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save gallery to storage:', e);
  }
}

// Convert Supabase DB item to GalleryItem
function dbItemToGalleryItem(dbItem: DbGalleryItem): GalleryItem {
  return {
    id: dbItem.id,
    userId: dbItem.user_id,
    originalImage: dbItem.original_image_url,
    resultImage: dbItem.result_image_url,
    selections: dbItem.selections as unknown as UserSelections,
    isFavorite: dbItem.is_favorite,
    title: dbItem.title || undefined,
    createdAt: new Date(dbItem.created_at),
  };
}

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<GalleryItem[]>(() => loadFromStorage());
  const [isLoading, setIsLoading] = useState(false);
  const loadedUserRef = useRef<string | null>(null);

  // Persist to localStorage whenever items change (fallback mode)
  useEffect(() => {
    if (!isSupabaseConfigured) {
      saveToStorage(items);
    }
  }, [items]);

  // Load gallery items from Supabase for a user
  const loadUserGallery = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) {
      console.log('Supabase not configured, using localStorage');
      return;
    }

    // Don't reload if already loaded for this user
    if (loadedUserRef.current === userId) {
      return;
    }

    setIsLoading(true);
    try {
      const dbItems = await GalleryService.getUserItems(userId);
      const galleryItems = dbItems.map(dbItemToGalleryItem);
      setItems(galleryItems);
      loadedUserRef.current = userId;
    } catch (error) {
      console.error('Failed to load gallery from Supabase:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new gallery item
  const addItem = useCallback(async (itemData: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<GalleryItem | null> => {
    if (isSupabaseConfigured) {
      // Use Supabase
      try {
        const dbItem = await GalleryService.addItem(
          itemData.userId,
          itemData.originalImage,
          itemData.resultImage,
          itemData.selections as unknown as Record<string, unknown>
        );

        if (!dbItem) {
          console.error('Failed to add item to Supabase');
          return null;
        }

        const newItem = dbItemToGalleryItem(dbItem);
        setItems(prev => [newItem, ...prev]);
        return newItem;
      } catch (error) {
        console.error('Error adding item to Supabase:', error);
        return null;
      }
    } else {
      // Fallback to localStorage
      const newItem: GalleryItem = {
        ...itemData,
        id: generateId(),
        createdAt: new Date(),
      };
      setItems(prev => [newItem, ...prev]);
      return newItem;
    }
  }, []);

  // Remove an item by ID
  const removeItem = useCallback(async (id: string) => {
    if (isSupabaseConfigured) {
      const success = await GalleryService.removeItem(id);
      if (success) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    } else {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  }, []);

  // Remove multiple items by IDs
  const removeItems = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return;
    
    if (isSupabaseConfigured) {
      const success = await GalleryService.removeItems(ids);
      if (success) {
        setItems(prev => prev.filter(item => !ids.includes(item.id)));
      }
    } else {
      setItems(prev => prev.filter(item => !ids.includes(item.id)));
    }
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (id: string) => {
    if (isSupabaseConfigured) {
      const success = await GalleryService.toggleFavorite(id);
      if (success) {
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        ));
      }
    } else {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      ));
    }
  }, []);

  // Clear all items for a specific user
  const clearUserGallery = useCallback(async (userId: string) => {
    if (isSupabaseConfigured) {
      const success = await GalleryService.clearUserGallery(userId);
      if (success) {
        setItems(prev => prev.filter(item => item.userId !== userId));
        loadedUserRef.current = null;
      }
    } else {
      setItems(prev => prev.filter(item => item.userId !== userId));
    }
  }, []);

  // Get items for a specific user
  const getUserItems = useCallback((userId: string): GalleryItem[] => {
    return items.filter(item => item.userId === userId);
  }, [items]);

  // Get a single item by ID
  const getItemById = useCallback((id: string): GalleryItem | undefined => {
    return items.find(item => item.id === id);
  }, [items]);

  const value: GalleryContextType = {
    items,
    isLoading,
    addItem,
    removeItem,
    removeItems,
    toggleFavorite,
    clearUserGallery,
    loadUserGallery,
    getUserItems,
    getItemById,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = (): GalleryContextType => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

export default GalleryContext;
