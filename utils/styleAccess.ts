import { StyleOption } from '../types';

/**
 * Style Access Control
 * 
 * Defines which style options are available for free users vs subscribers.
 * Free users get a curated subset of each category (approximately 30% of options).
 * Subscribers get access to all options.
 */

// IDs of options available to free users (non-subscribers)
// These are curated to be appealing but leave premium options as incentive

export const FREE_STYLE_IDS: Set<string> = new Set([
  // HAIR - Basic popular styles (8 of ~50)
  'h_pixie',
  'h_bob',
  'h_long_straight',
  'h_long_wavy',
  'h_pony',
  'h_bun',
  'h_bangs',
  'h_beachwaves',

  // HAIR LENGTH - Half available (3 of 6)
  'hl_short',
  'hl_medium',
  'hl_long',

  // HAIR COLOR - Basic naturals + a few fun (6 of ~25)
  'hc_black',
  'hc_darkbrown',
  'hc_honey',
  'hc_auburn',
  'hc_pastelpink',
  'hc_blue',

  // EXPRESSIONS - Common ones (8 of ~30)
  'ex_smile',
  'ex_grin',
  'ex_neutral',
  'ex_smirk',
  'ex_surprised',
  'ex_laugh',
  'ex_content',
  'ex_wink',

  // MAKEUP - Basic looks (5 of ~18)
  'm_none',
  'm_natural',
  'm_softglam',
  'm_fullglam',
  'm_bronzed',

  // EYES - Common styles (4 of ~20)
  'e_natural',
  'e_falsies',
  'e_smokey',
  'e_cateye',

  // LIPS - Basic colors (4 of ~12)
  'l_nude',
  'l_gloss',
  'l_red',
  'l_pink',

  // GLASSES - Popular styles (4 of ~20)
  'a_aviator',
  'a_wayfarer',
  'a_round',
  'a_cateye',

  // PIERCINGS - Basic (4 of ~25)
  'a_nose_stud',
  'a_lobe_stud',
  'a_lobe_hoop',
  'a_huggie',

  // HEADWEAR - Common (4 of ~25)
  'a_cap',
  'a_beanie',
  'a_headband',
  'a_bandana',

  // JEWELRY - Basic (4 of ~18)
  'a_hoops',
  'a_studs',
  'a_choker',
  'a_goldchain',

  // FACE EXTRAS - Common (3 of ~16)
  'a_freckles',
  'a_gems',
  'a_glitter',

  // FACIAL HAIR - Basic (5 of ~25)
  'fh_none',
  'fh_stubble',
  'fh_goatee',
  'fh_short',
  'fh_stache_chevron',
]);

/**
 * Extended StyleOption with premium/locked flags
 */
export interface ExtendedStyleOption extends StyleOption {
  isPremium: boolean;
  isLocked: boolean;
}

/**
 * Returns all style options with premium/locked flags
 * Non-subscribers see ALL options but premium ones are marked as locked
 * This creates FOMO and incentivizes subscription
 * @param options - Array of style options
 * @param hasFullAccess - Whether user has full library access (subscribed or admin)
 * @returns Array with isPremium and isLocked flags
 */
export function filterStyleOptions(
  options: StyleOption[],
  hasFullAccess: boolean
): ExtendedStyleOption[] {
  return options.map(option => ({
    ...option,
    isPremium: !FREE_STYLE_IDS.has(option.id),
    isLocked: !hasFullAccess && !FREE_STYLE_IDS.has(option.id),
  }));
}

/**
 * Checks if a specific style option is available to the user
 * @param optionId - The ID of the style option
 * @param hasFullAccess - Whether user has full library access
 * @returns Whether the option is available
 */
export function isStyleAvailable(optionId: string, hasFullAccess: boolean): boolean {
  if (hasFullAccess) return true;
  return FREE_STYLE_IDS.has(optionId);
}

/**
 * Gets counts for free vs premium options
 * @param options - Array of style options
 * @returns Object with free and premium counts
 */
export function getStyleCounts(options: StyleOption[]): { free: number; premium: number; total: number } {
  const free = options.filter(o => FREE_STYLE_IDS.has(o.id)).length;
  return {
    free,
    premium: options.length - free,
    total: options.length,
  };
}

/**
 * Marks options with premium indicator
 * @param options - Array of style options
 * @param hasFullAccess - Whether user has full library access
 * @returns Options with isPremium flag
 */
export function markPremiumOptions<T extends StyleOption>(
  options: T[],
  hasFullAccess: boolean
): (T & { isPremium: boolean; isLocked: boolean })[] {
  return options.map(option => ({
    ...option,
    isPremium: !FREE_STYLE_IDS.has(option.id),
    isLocked: !hasFullAccess && !FREE_STYLE_IDS.has(option.id),
  }));
}

/**
 * Premium style values - these are the actual string values used in presets
 * that correspond to premium options
 */
export const PREMIUM_STYLE_VALUES = new Set([
  // Premium hair styles
  'Vintage 1920s finger waves',
  'Voluminous classic pompadour',
  'Punk mohawk hairstyle',
  'Elegant formal updo',
  'Edgy undercut hairstyle',
  'Double space buns',
  
  // Premium hair colors
  'Y2K chunky highlights',
  'Split dyed half black half white',
  'Rich chestnut brown',
  'Vibrant electric blue',
  
  // Premium makeup
  'Dark pale goth makeup',
  'E-girl style with heavy blush on nose',
  'Futuristic neon lines makeup',
  'Vintage 1950s pinup makeup',
  'Ethereal fairy glow makeup',
  'Heavy contour and highlight full glam',
  
  // Premium eyes
  'Heavy gold glitter on lids',
  'Sharp cut crease eyeshadow',
  'Geometric graphic eyeliner art',
  'Pastel shimmer eyeshadow',
  
  // Premium lips
  '90s brown lip liner with lighter center',
  'Jet black matte lipstick',
  
  // Premium accessories
  '90s butterfly hair clips',
  'Black velvet choker necklace',
  'Silver septum clicker ring',
  'Gaming headphones with cat ears',
  'Cute heart shaped faux freckles',
  'Crystal chandelier earrings',
  'Sparkling crystal tiara',
  'Futuristic Cyberpunk LED Visor',
  'Futuristic cyberpunk face panel lines',
  'Antique gold monocle',
  'Formal black bow tie',
  'Bohemian flower crown',
  'Layered gold chain necklaces',
  'Multiple silver ear piercings',
  'Spiked collar choker',
  'Vintage cat-eye glasses',
  'Delicate elf ear tips',
  
  // Premium facial hair
  'Thick bushy lumberjack beard',
  'Curled handlebar mustache',
]);

/**
 * Checks if a preset contains any premium options
 * @param selections - The preset's selections object
 * @returns Whether the preset contains premium options
 */
export function presetContainsPremium(selections: Record<string, string | string[] | null>): boolean {
  for (const value of Object.values(selections)) {
    if (value === null) continue;
    
    if (Array.isArray(value)) {
      if (value.some(v => PREMIUM_STYLE_VALUES.has(v))) return true;
    } else {
      if (PREMIUM_STYLE_VALUES.has(value)) return true;
    }
  }
  return false;
}

/**
 * Gets free presets only (presets that don't contain premium options)
 */
export function getAvailablePresets<T extends { selections: Record<string, string | string[] | null> }>(
  presets: T[],
  hasFullAccess: boolean
): (T & { isPremium: boolean; isLocked: boolean })[] {
  return presets.map(preset => ({
    ...preset,
    isPremium: presetContainsPremium(preset.selections),
    isLocked: !hasFullAccess && presetContainsPremium(preset.selections),
  }));
}
