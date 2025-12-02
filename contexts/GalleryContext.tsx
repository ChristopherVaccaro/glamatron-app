import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GalleryItem, UserSelections } from '../types';

interface GalleryContextType {
  items: GalleryItem[];
  
  // Actions
  addItem: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => GalleryItem;
  removeItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearUserGallery: (userId: string) => void;
  
  // Getters
  getUserItems: (userId: string) => GalleryItem[];
  getItemById: (id: string) => GalleryItem | undefined;
}

const GalleryContext = createContext<GalleryContextType | null>(null);

// Local storage key
const STORAGE_KEY = 'glamatron_gallery';

// Helper to generate unique ID
function generateId(): string {
  return `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to load from localStorage
function loadFromStorage(): GalleryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
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

// Helper to save to localStorage
function saveToStorage(items: GalleryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save gallery to storage:', e);
  }
}

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<GalleryItem[]>(() => loadFromStorage());

  // Persist to localStorage whenever items change
  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  // Add a new gallery item
  const addItem = useCallback((itemData: Omit<GalleryItem, 'id' | 'createdAt'>): GalleryItem => {
    const newItem: GalleryItem = {
      ...itemData,
      id: generateId(),
      createdAt: new Date(),
    };
    
    setItems(prev => [newItem, ...prev]); // Add to beginning (newest first)
    return newItem;
  }, []);

  // Remove an item by ID
  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback((id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  }, []);

  // Clear all items for a specific user
  const clearUserGallery = useCallback((userId: string) => {
    setItems(prev => prev.filter(item => item.userId !== userId));
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
    addItem,
    removeItem,
    toggleFavorite,
    clearUserGallery,
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
