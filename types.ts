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