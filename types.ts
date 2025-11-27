export interface StyleOption {
  id: string;
  label: string;
  value: string;
  category: StyleCategory;
  icon?: string; 
}

export type ImageMode = 'face' | 'body';

export enum StyleCategory {
  // Face categories
  HAIR = 'HAIRSTYLE',
  HAIR_LENGTH = 'HAIR_LENGTH',
  HAIR_COLOR = 'HAIR_COLOR',
  ACCESSORIES = 'ACCESSORIES',
  MAKEUP = 'MAKEUP',
  EXPRESSION = 'EXPRESSION',
  EYES = 'EYE_MAKEUP',
  LIPS = 'LIP_MAKEUP',
  FACIAL_HAIR = 'FACIAL_HAIR',
  // Body categories
  CLOTHING_TOP = 'CLOTHING_TOP',
  CLOTHING_BOTTOM = 'CLOTHING_BOTTOM',
  CLOTHING_DRESS = 'CLOTHING_DRESS',
  CLOTHING_OUTERWEAR = 'CLOTHING_OUTERWEAR',
  FOOTWEAR = 'FOOTWEAR',
  BODY_ACCESSORIES = 'BODY_ACCESSORIES',
  POSE = 'POSE',
  BACKGROUND = 'BACKGROUND'
}

export interface UserSelections {
  // Face selections
  [StyleCategory.HAIR]: string | null;
  [StyleCategory.HAIR_LENGTH]: string | null;
  [StyleCategory.HAIR_COLOR]: string | null;
  [StyleCategory.ACCESSORIES]: string[];
  [StyleCategory.MAKEUP]: string | null;
  [StyleCategory.EXPRESSION]: string | null;
  [StyleCategory.EYES]: string | null;
  [StyleCategory.LIPS]: string | null;
  [StyleCategory.FACIAL_HAIR]: string | null;
  // Body selections
  [StyleCategory.CLOTHING_TOP]: string | null;
  [StyleCategory.CLOTHING_BOTTOM]: string | null;
  [StyleCategory.CLOTHING_DRESS]: string | null;
  [StyleCategory.CLOTHING_OUTERWEAR]: string | null;
  [StyleCategory.FOOTWEAR]: string | null;
  [StyleCategory.BODY_ACCESSORIES]: string[];
  [StyleCategory.POSE]: string | null;
  [StyleCategory.BACKGROUND]: string | null;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
}