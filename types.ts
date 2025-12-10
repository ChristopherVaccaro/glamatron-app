export interface StyleOption {
  id: string;
  label: string;
  value: string;
  category: StyleCategory;
  icon?: string; 
}

export enum StyleCategory {
  HAIR = 'HAIRSTYLE',
  HAIR_LENGTH = 'HAIR_LENGTH',
  HAIR_COLOR = 'HAIR_COLOR',
  ACCESSORIES = 'ACCESSORIES',
  MAKEUP = 'MAKEUP',
  EXPRESSION = 'EXPRESSION',
  EYES = 'EYE_MAKEUP',
  LIPS = 'LIP_MAKEUP',
  FACIAL_HAIR = 'FACIAL_HAIR'
}

export interface UserSelections {
  [StyleCategory.HAIR]: string | null;
  [StyleCategory.HAIR_LENGTH]: string | null;
  [StyleCategory.HAIR_COLOR]: string | null;
  [StyleCategory.ACCESSORIES]: string[];
  [StyleCategory.MAKEUP]: string | null;
  [StyleCategory.EXPRESSION]: string | null;
  [StyleCategory.EYES]: string | null;
  [StyleCategory.LIPS]: string | null;
  [StyleCategory.FACIAL_HAIR]: string | null;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
}

// User Role System
export type UserRole = 'admin' | 'test' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  glamCoins: number;
  isSubscribed: boolean;
  hasPurchased: boolean; // Whether user has ever purchased GlamCoins (unlocks full styles)
  createdAt: Date;
  // For test user only - stores the initial state to reset to
  _testUserDefaults?: {
    glamCoins: number;
    isSubscribed: boolean;
    hasPurchased: boolean;
  };
}

// Special email patterns for role detection
export const SPECIAL_EMAILS = {
  ADMIN: 'admin@glamatron.app',
  TEST_USER: 'testuser@glamatron.app',
} as const;

// Default glamcoins for new users
export const DEFAULT_GLAMCOINS = 5;

// Subscription tier feature flags
export interface SubscriptionFeatures {
  unlimitedGenerations: boolean;
  fullStyleLibrary: boolean;
  priorityProcessing: boolean;
}

// Feature tiers - 'purchased' tier unlocks full styles after any GlamCoin purchase
export const SUBSCRIPTION_TIERS: Record<'free' | 'purchased' | 'admin', SubscriptionFeatures> = {
  free: {
    unlimitedGenerations: false,
    fullStyleLibrary: false,
    priorityProcessing: false,
  },
  purchased: {
    unlimitedGenerations: false, // Still uses GlamCoins
    fullStyleLibrary: true,      // Full styles unlocked after purchase
    priorityProcessing: false,
  },
  admin: {
    unlimitedGenerations: true,
    fullStyleLibrary: true,
    priorityProcessing: true,
  },
};

// Gallery/History types
export interface GalleryItem {
  id: string;
  userId: string;
  originalImage: string;  // Base64 or URL of the uploaded image
  resultImage: string;    // Base64 or URL of the generated image
  selections: UserSelections;
  createdAt: Date;
  // Optional metadata for future features
  isFavorite?: boolean;
  title?: string;
}