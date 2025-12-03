import React, { useState, useCallback, useMemo } from 'react';
import { Sparkles, Download, RefreshCw, Wand2, ArrowRight, Dices, X, Share2, RotateCcw, ChevronDown, Zap, ChevronLeft, ChevronRight, User, Coins, Lock, Heart } from 'lucide-react';
import { 
  StyleCategory, 
  UserSelections, 
  GenerationState 
} from './types';
import { useUser } from './contexts/UserContext';
import { filterStyleOptions, getAvailablePresets } from './utils/styleAccess';
import { 
  HAIR_OPTIONS,
  HAIR_LENGTH_OPTIONS,
  HAIR_COLOR_OPTIONS,
  EXPRESSION_OPTIONS,
  MAKEUP_OPTIONS, 
  EYE_OPTIONS,
  LIP_OPTIONS,
  GLASSES_OPTIONS,
  PIERCING_OPTIONS,
  HEADWEAR_OPTIONS,
  JEWELRY_OPTIONS,
  FACE_EXTRAS_OPTIONS,
  FACIAL_HAIR_OPTIONS
} from './constants';
import StyleSelector from './components/StyleSelector';
import SidebarNav from './components/SidebarNav';
import ImageUploader from './components/ImageUploader';
import ComparisonView from './components/ComparisonView';
import AuthModal, { UserData } from './components/AuthModal';
import ProfileDropdown from './components/ProfileDropdown';
import ProfileModal from './components/ProfileModal';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';
import PrivacyPolicyContent from './components/PrivacyPolicyContent';
import TermsOfServiceContent from './components/TermsOfServiceContent';
import ContactContent from './components/ContactContent';
import LandingPage from './components/LandingPage';
import PasswordGate from './components/PasswordGate';
import PurchaseModal from './components/PurchaseModal';
import GlamCoinDisplay from './components/GlamCoinDisplay';
import DevToolbar from './components/DevToolbar';
import GalleryModal from './components/GalleryModal';
import { useGallery } from './contexts/GalleryContext';
import { generateStyledImage } from './services/geminiService';

// Quick preset definitions
export const QUICK_PRESETS = [
  {
    id: 'natural',
    name: 'Soft Natural',
    emoji: '🌸',
    selections: {
      [StyleCategory.HAIR]: 'Long flowing wavy hair',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Warm honey blonde',
      [StyleCategory.MAKEUP]: 'Minimal "clean girl" aesthetic makeup',
      [StyleCategory.EXPRESSION]: 'Peaceful content expression',
      [StyleCategory.EYES]: 'Natural lashes with mascara only',
      [StyleCategory.LIPS]: 'High shine clear lip gloss',
      [StyleCategory.ACCESSORIES]: [],
    }
  },
  {
    id: 'y2k',
    name: 'Y2K Glam',
    emoji: '💿',
    selections: {
      [StyleCategory.HAIR]: 'Hair with trendy curtain bangs',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Y2K chunky highlights',
      [StyleCategory.MAKEUP]: 'Heavy bronzer sun-kissed look',
      [StyleCategory.EXPRESSION]: 'Playful winking expression',
      [StyleCategory.EYES]: 'Heavy gold glitter on lids',
      [StyleCategory.LIPS]: '90s brown lip liner with lighter center',
      [StyleCategory.ACCESSORIES]: ['90s butterfly hair clips'],
    }
  },
  {
    id: 'goth',
    name: 'Dark Goth',
    emoji: '🖤',
    selections: {
      [StyleCategory.HAIR]: 'Long sleek straight hair',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Jet black',
      [StyleCategory.MAKEUP]: 'Dark pale goth makeup',
      [StyleCategory.EXPRESSION]: 'Calm neutral expression',
      [StyleCategory.EYES]: 'Black and grey smokey eye',
      [StyleCategory.LIPS]: 'Jet black matte lipstick',
      [StyleCategory.ACCESSORIES]: ['Black velvet choker necklace', 'Silver septum clicker ring'],
    }
  },
  {
    id: 'egirl',
    name: 'E-Girl',
    emoji: '🎮',
    selections: {
      [StyleCategory.HAIR]: 'Double space buns',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Split dyed half black half white',
      [StyleCategory.MAKEUP]: 'E-girl style with heavy blush on nose',
      [StyleCategory.EXPRESSION]: 'Sticking tongue out playfully',
      [StyleCategory.EYES]: 'Sharp black winged eyeliner',
      [StyleCategory.LIPS]: 'High shine clear lip gloss',
      [StyleCategory.ACCESSORIES]: ['Gaming headphones with cat ears', 'Cute heart shaped faux freckles'],
    }
  },
  {
    id: 'glam',
    name: 'Red Carpet',
    emoji: '💎',
    selections: {
      [StyleCategory.HAIR]: 'Elegant formal updo',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: null,
      [StyleCategory.MAKEUP]: 'Heavy contour and highlight full glam',
      [StyleCategory.EXPRESSION]: 'Confident asymmetrical smirk',
      [StyleCategory.EYES]: 'Sharp cut crease eyeshadow',
      [StyleCategory.LIPS]: 'Classic bright red lipstick',
      [StyleCategory.ACCESSORIES]: ['Crystal chandelier earrings', 'Sparkling crystal tiara'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    id: 'cyber',
    name: 'Cyberpunk',
    emoji: '🤖',
    selections: {
      [StyleCategory.HAIR]: 'Edgy undercut hairstyle',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Vibrant electric blue',
      [StyleCategory.MAKEUP]: 'Futuristic neon lines makeup',
      [StyleCategory.EXPRESSION]: 'Serious intense expression',
      [StyleCategory.EYES]: 'Geometric graphic eyeliner art',
      [StyleCategory.LIPS]: null,
      [StyleCategory.ACCESSORIES]: ['Futuristic Cyberpunk LED Visor', 'Futuristic cyberpunk face panel lines'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    id: 'lumberjack',
    name: 'Lumberjack',
    emoji: '🪓',
    selections: {
      [StyleCategory.HAIR]: 'Long flowing wavy hair',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Rich chestnut brown',
      [StyleCategory.MAKEUP]: null,
      [StyleCategory.EXPRESSION]: 'Confident asymmetrical smirk',
      [StyleCategory.EYES]: null,
      [StyleCategory.LIPS]: null,
      [StyleCategory.ACCESSORIES]: [],
      [StyleCategory.FACIAL_HAIR]: 'Thick bushy lumberjack beard',
    }
  },
  {
    id: 'dapper',
    name: 'Dapper Dan',
    emoji: '🎩',
    selections: {
      [StyleCategory.HAIR]: 'Voluminous classic pompadour',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Jet black',
      [StyleCategory.MAKEUP]: null,
      [StyleCategory.EXPRESSION]: 'Confident asymmetrical smirk',
      [StyleCategory.EYES]: null,
      [StyleCategory.LIPS]: null,
      [StyleCategory.ACCESSORIES]: ['Antique gold monocle', 'Formal black bow tie'],
      [StyleCategory.FACIAL_HAIR]: 'Curled handlebar mustache',
    }
  },
  {
    id: 'boho',
    name: 'Boho Chic',
    emoji: '🌻',
    selections: {
      [StyleCategory.HAIR]: 'Long flowing wavy hair',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Warm honey blonde',
      [StyleCategory.MAKEUP]: 'Minimal "clean girl" aesthetic makeup',
      [StyleCategory.EXPRESSION]: 'Peaceful content expression',
      [StyleCategory.EYES]: 'Natural lashes with mascara only',
      [StyleCategory.LIPS]: 'Nude matte natural lipstick',
      [StyleCategory.ACCESSORIES]: ['Bohemian flower crown', 'Layered gold chain necklaces'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    id: 'punk',
    name: 'Punk Rock',
    emoji: '🎸',
    selections: {
      [StyleCategory.HAIR]: 'Punk mohawk hairstyle',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Bright fire engine red',
      [StyleCategory.MAKEUP]: 'Dark pale goth makeup',
      [StyleCategory.EXPRESSION]: 'Serious intense expression',
      [StyleCategory.EYES]: 'Sharp black winged eyeliner',
      [StyleCategory.LIPS]: 'Jet black matte lipstick',
      [StyleCategory.ACCESSORIES]: ['Multiple silver ear piercings', 'Spiked collar choker'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    id: 'vintage',
    name: '50s Vintage',
    emoji: '💋',
    selections: {
      [StyleCategory.HAIR]: 'Vintage 1920s finger waves',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Deep dark brown',
      [StyleCategory.MAKEUP]: 'Vintage 1950s pinup makeup',
      [StyleCategory.EXPRESSION]: 'Playful winking expression',
      [StyleCategory.EYES]: 'Sharp black winged eyeliner',
      [StyleCategory.LIPS]: 'Classic bright red lipstick',
      [StyleCategory.ACCESSORIES]: ['Vintage cat-eye glasses'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    id: 'fairy',
    name: 'Fairy Core',
    emoji: '🧚',
    selections: {
      [StyleCategory.HAIR]: 'Long voluminous curly hair',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Soft pastel pink',
      [StyleCategory.MAKEUP]: 'Ethereal fairy glow makeup',
      [StyleCategory.EXPRESSION]: 'Dreamy distant gaze',
      [StyleCategory.EYES]: 'Pastel shimmer eyeshadow',
      [StyleCategory.LIPS]: 'High shine clear lip gloss',
      [StyleCategory.ACCESSORIES]: ['Delicate elf ear tips', 'Cute heart shaped faux freckles'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    id: 'sporty',
    name: 'Sporty Fresh',
    emoji: '⚡',
    selections: {
      [StyleCategory.HAIR]: 'Sleek high ponytail',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: null,
      [StyleCategory.MAKEUP]: 'Minimal "clean girl" aesthetic makeup',
      [StyleCategory.EXPRESSION]: 'Bright genuine smile',
      [StyleCategory.EYES]: 'Natural lashes with mascara only',
      [StyleCategory.LIPS]: 'High shine clear lip gloss',
      [StyleCategory.ACCESSORIES]: ['Athletic sweatband headband'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
];

const App: React.FC = () => {
  // User context for GlamCoins and subscription
  const { user: contextUser, features, canGenerate, deductCoin, signOut } = useUser();
  
  // Gallery context for saving images
  const { addItem: addToGallery, items: galleryItems, toggleFavorite, getUserItems } = useGallery();
  
  // Track the current gallery item ID for the generated result
  const [currentGalleryItemId, setCurrentGalleryItemId] = useState<string | null>(null);
  
  // Check if user has already unlocked the site this session
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('glamatron_access') === 'granted';
  });
  const [showLanding, setShowLanding] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalFilename, setOriginalFilename] = useState<string>('image');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    hair: true,
    face: true,
    accessories: false,
    extras: false,
  });
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  
  const [selections, setSelections] = useState<UserSelections>({
    [StyleCategory.HAIR]: null,
    [StyleCategory.HAIR_LENGTH]: null,
    [StyleCategory.HAIR_COLOR]: null,
    [StyleCategory.ACCESSORIES]: [],
    [StyleCategory.MAKEUP]: null,
    [StyleCategory.EXPRESSION]: null,
    [StyleCategory.EYES]: null,
    [StyleCategory.LIPS]: null,
    [StyleCategory.FACIAL_HAIR]: null,
  });

  const [genState, setGenState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    resultImage: null,
  });

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const handleSelection = useCallback((category: StyleCategory, value: string) => {
    setSelections(prev => {
      // Handle multi-select for accessories
      if (category === StyleCategory.ACCESSORIES) {
        if (value === 'CLEAR_ALL') return { ...prev, [category]: [] };
        
        const current = prev[category] as string[];
        const exists = current.includes(value);
        return {
          ...prev,
          [category]: exists 
            ? current.filter(v => v !== value)
            : [...current, value]
        };
      }

      // Handle single select for others
      // Clicking the same option again deselects it
      return {
        ...prev,
        [category]: prev[category] === value ? null : (value === '' ? null : value)
      };
    });
  }, []);

  // Core generation logic extracted to handle both manual and random triggers
  const executeGeneration = async (activeSelections: UserSelections) => {
    if (!selectedImage) return;

    // Check if user can generate (has coins or unlimited access)
    if (!canGenerate) {
      setShowPurchaseModal(true);
      return;
    }

    // Keep the existing resultImage during loading so buttons stay visible
    setGenState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await generateStyledImage(selectedImage, activeSelections);
      
      // Deduct coin on successful generation
      const coinDeducted = deductCoin();
      if (!coinDeducted && !features.unlimitedGenerations) {
        // This shouldn't happen if canGenerate was true, but handle edge case
        console.warn('Failed to deduct coin after generation');
      }
      
      // Save to gallery if user is signed in
      if (user?.id) {
        const newItem = addToGallery({
          userId: user.id,
          originalImage: selectedImage,
          resultImage: result,
          selections: activeSelections,
        });
        setCurrentGalleryItemId(newItem.id);
      } else {
        setCurrentGalleryItemId(null);
      }
      
      setGenState({ isLoading: false, error: null, resultImage: result });
    } catch (err: any) {
      // Don't deduct coin on failed generation
      setGenState(prev => ({ 
        ...prev,
        isLoading: false, 
        error: err.message || "Something went wrong. Please try again.", 
      }));
    }
  };

  const handleGenerateClick = () => {
    // Check coins before starting generation
    if (!canGenerate) {
      setShowPurchaseModal(true);
      return;
    }
    executeGeneration(selections);
  };

  const handleRandomize = () => {
    if (!selectedImage) return;

    // Check coins before randomizing (since it triggers generation)
    if (!canGenerate) {
      setShowPurchaseModal(true);
      return;
    }

    // Helper to get random item from array
    const getRandom = <T extends { value: string }>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)].value;
    
    // Helper to maybe get an item (X% chance)
    const maybeGet = <T extends { value: string }>(arr: T[], chance: number = 0.5) => Math.random() < chance ? getRandom(arr) : null;

    // Use filtered options based on subscription
    const filteredHair = filterStyleOptions(HAIR_OPTIONS, features.fullStyleLibrary);
    const filteredHairLength = filterStyleOptions(HAIR_LENGTH_OPTIONS, features.fullStyleLibrary);
    const filteredHairColor = filterStyleOptions(HAIR_COLOR_OPTIONS, features.fullStyleLibrary);
    const filteredMakeup = filterStyleOptions(MAKEUP_OPTIONS, features.fullStyleLibrary);
    const filteredExpression = filterStyleOptions(EXPRESSION_OPTIONS, features.fullStyleLibrary);
    const filteredEyes = filterStyleOptions(EYE_OPTIONS, features.fullStyleLibrary);
    const filteredLips = filterStyleOptions(LIP_OPTIONS, features.fullStyleLibrary);
    const filteredFacialHair = filterStyleOptions(FACIAL_HAIR_OPTIONS, features.fullStyleLibrary);

    // Collect all filtered accessories
    const allAccessories = [
      ...filterStyleOptions(GLASSES_OPTIONS, features.fullStyleLibrary),
      ...filterStyleOptions(PIERCING_OPTIONS, features.fullStyleLibrary),
      ...filterStyleOptions(HEADWEAR_OPTIONS, features.fullStyleLibrary),
      ...filterStyleOptions(JEWELRY_OPTIONS, features.fullStyleLibrary),
      ...filterStyleOptions(FACE_EXTRAS_OPTIONS, features.fullStyleLibrary)
    ];

    // Pick 1 to 3 random accessories
    const numAccessories = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
    const randomAccessories: string[] = [];
    const usedIndices = new Set<number>();
    
    for (let i = 0; i < numAccessories; i++) {
        let index;
        let attempts = 0;
        do {
            index = Math.floor(Math.random() * allAccessories.length);
            attempts++;
        } while (usedIndices.has(index) && attempts < 10);
        
        usedIndices.add(index);
        randomAccessories.push(allAccessories[index].value);
    }

    const newSelections: UserSelections = {
      [StyleCategory.HAIR]: maybeGet(filteredHair, 0.7), 
      [StyleCategory.HAIR_LENGTH]: maybeGet(filteredHairLength, 0.4),
      [StyleCategory.HAIR_COLOR]: maybeGet(filteredHairColor, 0.5),
      [StyleCategory.MAKEUP]: maybeGet(filteredMakeup, 0.6),
      [StyleCategory.EXPRESSION]: maybeGet(filteredExpression, 0.5),
      [StyleCategory.EYES]: maybeGet(filteredEyes, 0.5),
      [StyleCategory.LIPS]: maybeGet(filteredLips, 0.5),
      [StyleCategory.ACCESSORIES]: randomAccessories,
      [StyleCategory.FACIAL_HAIR]: maybeGet(filteredFacialHair, 0.25),
    };

    // Update UI with new selections
    setSelections(newSelections);

    // Trigger generation immediately with the new selections
    executeGeneration(newSelections);
  };

  const handleDownload = async () => {
    if (!genState.resultImage) return;
    
    try {
      // Re-encode through canvas to create proper JPEG with headers
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = genState.resultImage!;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');
      
      ctx.drawImage(img, 0, 0);
      
      // Convert to blob with proper JPEG encoding
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
          'image/jpeg',
          0.95 // High quality
        );
      });
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `${originalFilename}_styled_${timestamp}.jpg`;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      // Fallback to direct download
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const link = document.createElement('a');
      link.href = genState.resultImage;
      link.download = `${originalFilename}_styled_${timestamp}.jpg`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (!genState.resultImage) return;
    try {
      // Re-encode through canvas for proper JPEG
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = genState.resultImage!;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');
      ctx.drawImage(img, 0, 0);
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => b ? resolve(b) : reject(new Error('Failed')),
          'image/jpeg',
          0.95
        );
      });
      
      // Create file with explicit lastModified to ensure proper file metadata
      const file = new File([blob], 'glamatron-result.jpg', { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      // Check if Web Share API with files is supported
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'My Glamatron Transformation',
            text: 'Check out my AI-powered style transformation!',
            files: [file],
          });
        } catch (shareErr: any) {
          // User cancelled or share failed - fall back to text-only share or download
          if (shareErr.name !== 'AbortError') {
            // Try sharing without files (text only) for email clients that don't support file attachments
            if (navigator.share) {
              try {
                await navigator.share({
                  title: 'My Glamatron Transformation',
                  text: 'Check out my AI-powered style transformation! Created with Glamatron.',
                });
              } catch {
                handleDownload();
              }
            } else {
              handleDownload();
            }
          }
        }
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error('Share error:', err);
      handleDownload();
    }
  };

  const handleReset = () => {
    setSelections({
      [StyleCategory.HAIR]: null,
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: null,
      [StyleCategory.ACCESSORIES]: [],
      [StyleCategory.MAKEUP]: null,
      [StyleCategory.EXPRESSION]: null,
      [StyleCategory.EYES]: null,
      [StyleCategory.LIPS]: null,
      [StyleCategory.FACIAL_HAIR]: null,
    });
  };

  const handlePresetSelect = (preset: typeof QUICK_PRESETS[0]) => {
    setSelections(preset.selections as UserSelections);
  };

  const handleStartOver = () => {
    // If user is logged in, just reset the tool state (don't go to landing page)
    // If not logged in, go to landing page
    if (!user) {
      setShowLanding(true);
    }
    setSelectedImage(null);
    setGenState({ isLoading: false, error: null, resultImage: null });
    setCurrentGalleryItemId(null);
    setSelections({
      [StyleCategory.HAIR]: null,
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: null,
      [StyleCategory.ACCESSORIES]: [],
      [StyleCategory.MAKEUP]: null,
      [StyleCategory.EXPRESSION]: null,
      [StyleCategory.EYES]: null,
      [StyleCategory.LIPS]: null,
      [StyleCategory.FACIAL_HAIR]: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const selectionCount = useMemo(() => {
    let count = 0;
    if (selections[StyleCategory.HAIR]) count++;
    if (selections[StyleCategory.HAIR_LENGTH]) count++;
    if (selections[StyleCategory.HAIR_COLOR]) count++;
    if (selections[StyleCategory.MAKEUP]) count++;
    if (selections[StyleCategory.EXPRESSION]) count++;
    if (selections[StyleCategory.EYES]) count++;
    if (selections[StyleCategory.LIPS]) count++;
    if (selections[StyleCategory.FACIAL_HAIR]) count++;
    count += selections[StyleCategory.ACCESSORIES].length;
    return count;
  }, [selections]);

  const activeSelections = useMemo(() => {
    const items: { category: StyleCategory; value: string; label: string }[] = [];
    const findLabel = (options: any[], value: string) => 
      options.find(o => o.value === value)?.label || value.split(' ').slice(0, 3).join(' ');
    
    if (selections[StyleCategory.HAIR]) {
      items.push({ category: StyleCategory.HAIR, value: selections[StyleCategory.HAIR], label: findLabel(HAIR_OPTIONS, selections[StyleCategory.HAIR]) });
    }
    if (selections[StyleCategory.HAIR_LENGTH]) {
      items.push({ category: StyleCategory.HAIR_LENGTH, value: selections[StyleCategory.HAIR_LENGTH], label: findLabel(HAIR_LENGTH_OPTIONS, selections[StyleCategory.HAIR_LENGTH]) });
    }
    if (selections[StyleCategory.HAIR_COLOR]) {
      items.push({ category: StyleCategory.HAIR_COLOR, value: selections[StyleCategory.HAIR_COLOR], label: findLabel(HAIR_COLOR_OPTIONS, selections[StyleCategory.HAIR_COLOR]) });
    }
    if (selections[StyleCategory.EXPRESSION]) {
      items.push({ category: StyleCategory.EXPRESSION, value: selections[StyleCategory.EXPRESSION], label: findLabel(EXPRESSION_OPTIONS, selections[StyleCategory.EXPRESSION]) });
    }
    if (selections[StyleCategory.MAKEUP]) {
      items.push({ category: StyleCategory.MAKEUP, value: selections[StyleCategory.MAKEUP], label: findLabel(MAKEUP_OPTIONS, selections[StyleCategory.MAKEUP]) });
    }
    if (selections[StyleCategory.EYES]) {
      items.push({ category: StyleCategory.EYES, value: selections[StyleCategory.EYES], label: findLabel(EYE_OPTIONS, selections[StyleCategory.EYES]) });
    }
    if (selections[StyleCategory.LIPS]) {
      items.push({ category: StyleCategory.LIPS, value: selections[StyleCategory.LIPS], label: findLabel(LIP_OPTIONS, selections[StyleCategory.LIPS]) });
    }
    const allAccessoryOptions = [...GLASSES_OPTIONS, ...PIERCING_OPTIONS, ...HEADWEAR_OPTIONS, ...JEWELRY_OPTIONS, ...FACE_EXTRAS_OPTIONS];
    selections[StyleCategory.ACCESSORIES].forEach(acc => {
      items.push({ category: StyleCategory.ACCESSORIES, value: acc, label: findLabel(allAccessoryOptions, acc) });
    });
    if (selections[StyleCategory.FACIAL_HAIR]) {
      items.push({ category: StyleCategory.FACIAL_HAIR, value: selections[StyleCategory.FACIAL_HAIR], label: findLabel(FACIAL_HAIR_OPTIONS, selections[StyleCategory.FACIAL_HAIR]) });
    }
    return items;
  }, [selections]);

  const removeSelection = (category: StyleCategory, value: string) => {
    handleSelection(category, category === StyleCategory.ACCESSORIES ? value : '');
  };

  // Options map for SidebarNav - filtered based on subscription
  const hasFullAccess = features.fullStyleLibrary;
  
  const optionsMap = useMemo(() => ({
    HAIR: filterStyleOptions(HAIR_OPTIONS, hasFullAccess),
    HAIR_LENGTH: filterStyleOptions(HAIR_LENGTH_OPTIONS, hasFullAccess),
    HAIR_COLOR: filterStyleOptions(HAIR_COLOR_OPTIONS, hasFullAccess),
    EXPRESSION: filterStyleOptions(EXPRESSION_OPTIONS, hasFullAccess),
    MAKEUP: filterStyleOptions(MAKEUP_OPTIONS, hasFullAccess),
    EYES: filterStyleOptions(EYE_OPTIONS, hasFullAccess),
    LIPS: filterStyleOptions(LIP_OPTIONS, hasFullAccess),
    GLASSES: filterStyleOptions(GLASSES_OPTIONS, hasFullAccess),
    PIERCINGS: filterStyleOptions(PIERCING_OPTIONS, hasFullAccess),
    HEADWEAR: filterStyleOptions(HEADWEAR_OPTIONS, hasFullAccess),
    JEWELRY: filterStyleOptions(JEWELRY_OPTIONS, hasFullAccess),
    FACE_EXTRAS: filterStyleOptions(FACE_EXTRAS_OPTIONS, hasFullAccess),
    FACIAL_HAIR: filterStyleOptions(FACIAL_HAIR_OPTIONS, hasFullAccess),
  }), [hasFullAccess]);

  // Quick presets with premium flags
  const availablePresets = useMemo(() => 
    getAvailablePresets(QUICK_PRESETS, hasFullAccess),
  [hasFullAccess]);

  // Check if current gallery item is favorited
  const currentItemIsFavorite = useMemo(() => {
    if (!currentGalleryItemId) return false;
    const item = galleryItems.find(i => i.id === currentGalleryItemId);
    return item?.isFavorite ?? false;
  }, [currentGalleryItemId, galleryItems]);

  const handleToggleFavorite = () => {
    if (currentGalleryItemId) {
      toggleFavorite(currentGalleryItemId);
    }
  };

  // Show landing page
  // Show password gate if not unlocked
  if (!isUnlocked) {
    return <PasswordGate onUnlock={() => setIsUnlocked(true)} />;
  }

  if (showLanding) {
    return (
      <LandingPage 
        onGetStarted={() => setShowLanding(false)} 
        onSignIn={(userData) => setUser(userData)}
        user={user}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <button 
            onClick={handleStartOver}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <span className="text-lg sm:text-xl font-bold tracking-wide text-slate-900" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              GLAMATRON
            </span>
          </button>
          <div className="flex items-center gap-3">
            {/* GlamCoin Display - only show when user is signed in */}
            {user && (
              <GlamCoinDisplay onClick={() => setShowPurchaseModal(true)} />
            )}
            
            {user ? (
              <ProfileDropdown 
                user={user}
                onSignOut={() => {
                  signOut(); // Sign out from context (resets test user)
                  setUser(null);
                  setShowLanding(true);
                  setSelectedImage(null);
                  setGenState({ isLoading: false, error: null, resultImage: null });
                }}
                onOpenProfile={() => setShowProfileModal(true)}
                onOpenGallery={() => setShowGalleryModal(true)}
              />
            ) : (
              <button 
                onClick={() => {
                  setAuthModalMode('signin');
                  setShowAuthModal(true);
                }}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Desktop Sidebar Navigation - Always visible, disabled when no image */}
      <SidebarNav 
        selections={selections}
        onSelect={handleSelection}
        optionsMap={optionsMap}
        disabled={!selectedImage}
        onPremiumClick={() => setShowPurchaseModal(true)}
      />

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 sm:pl-20 lg:pl-24 py-6 flex-grow">
        <div className="space-y-6">
            
            {/* Upload/Result Section - Same on all screen sizes */}
            <section>
              {/* Show result with comparison slider when available */}
              {genState.resultImage ? (
                <div className="space-y-4">
                  {/* Comparison Slider with loading overlay */}
                  <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-[400px] sm:h-[500px] md:h-[65vh] lg:h-[70vh] md:max-h-[750px]">
                    <ComparisonView 
                      originalImage={selectedImage!} 
                      generatedImage={genState.resultImage}
                      onClear={() => {
                        setSelectedImage(null);
                        setGenState(prev => ({ ...prev, resultImage: null }));
                        setCurrentGalleryItemId(null);
                        setSelections({
                          [StyleCategory.HAIR]: null,
                          [StyleCategory.HAIR_LENGTH]: null,
                          [StyleCategory.HAIR_COLOR]: null,
                          [StyleCategory.ACCESSORIES]: [],
                          [StyleCategory.MAKEUP]: null,
                          [StyleCategory.EXPRESSION]: null,
                          [StyleCategory.EYES]: null,
                          [StyleCategory.LIPS]: null,
                          [StyleCategory.FACIAL_HAIR]: null,
                        });
                      }}
                    />
                    {/* Loading overlay when regenerating */}
                    {genState.isLoading && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-40">
                        <div className="text-center">
                          <div className="relative mb-4">
                            <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full spinner-ring mx-auto"></div>
                            <span className="absolute top-1/2 left-1/2 text-slate-900 font-bold text-lg spinner-g" style={{ fontFamily: "'Orbitron', sans-serif" }}>G</span>
                          </div>
                          <p className="text-slate-600 font-medium animate-pulse">Creating your new look...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons - disabled during loading */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      onClick={() => setGenState(prev => ({ ...prev, resultImage: null }))}
                      disabled={genState.isLoading}
                      className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RotateCcw size={18} />
                      Edit & Regenerate
                    </button>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Favorite Button - only show when user is signed in */}
                      {user && currentGalleryItemId && (
                        <button 
                          onClick={handleToggleFavorite}
                          disabled={genState.isLoading}
                          className={`p-3 rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            currentItemIsFavorite 
                              ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100' 
                              : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-rose-400 hover:border-rose-200'
                          }`}
                          title={currentItemIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart size={18} className={currentItemIsFavorite ? 'fill-current' : ''} />
                        </button>
                      )}
                      <button 
                        onClick={handleShare}
                        disabled={genState.isLoading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Share2 size={18} />
                        Share
                      </button>
                      <button 
                        onClick={handleDownload}
                        disabled={genState.isLoading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-[#0F172A] text-white rounded-xl hover:bg-slate-800 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download size={18} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Loading state */}
                  {genState.isLoading && selectedImage && (
                    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white h-[400px] sm:h-[500px] md:h-[65vh] lg:h-[70vh] md:max-h-[750px] flex items-center justify-center">
                      <img 
                        src={selectedImage} 
                        alt="Processing" 
                        className="absolute inset-0 w-full h-full object-contain opacity-20 blur-sm"
                      />
                      <div className="relative z-10 text-center">
                        <div className="relative mb-4">
                          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full spinner-ring mx-auto"></div>
                          <span className="absolute top-1/2 left-1/2 text-slate-900 font-bold text-lg spinner-g" style={{ fontFamily: "'Orbitron', sans-serif" }}>G</span>
                        </div>
                        <p className="text-slate-600 font-medium animate-pulse">Creating your new look...</p>
                      </div>
                    </div>
                  )}
                  {/* Normal upload */}
                  {!genState.isLoading && (
                    <ImageUploader 
                      selectedImage={selectedImage}
                      onImageSelected={(img, filename) => {
                        setSelectedImage(img);
                        setOriginalFilename(filename);
                        setGenState(prev => ({ ...prev, resultImage: null }));
                        setCurrentGalleryItemId(null);
                      }}
                      onClear={() => {
                        setSelectedImage(null);
                        setGenState(prev => ({ ...prev, resultImage: null }));
                        setCurrentGalleryItemId(null);
                        setSelections({
                          [StyleCategory.HAIR]: null,
                          [StyleCategory.HAIR_LENGTH]: null,
                          [StyleCategory.HAIR_COLOR]: null,
                          [StyleCategory.ACCESSORIES]: [],
                          [StyleCategory.MAKEUP]: null,
                          [StyleCategory.EXPRESSION]: null,
                          [StyleCategory.EYES]: null,
                          [StyleCategory.LIPS]: null,
                          [StyleCategory.FACIAL_HAIR]: null,
                        });
                      }}
                    />
                  )}
                </>
              )}
            </section>
            {/* Style Selectors */}
            {selectedImage && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Quick Presets */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Zap size={12} />
                      Quick Looks
                    </h3>
                    <div className="hidden lg:flex items-center gap-1">
                      <button
                        onClick={() => {
                          const container = document.getElementById('quick-looks-scroll');
                          if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                        }}
                        className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => {
                          const container = document.getElementById('quick-looks-scroll');
                          if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                        }}
                        className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Scroll right"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                  <div id="quick-looks-scroll" className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                    {availablePresets.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          if (preset.isLocked) {
                            setShowPurchaseModal(true);
                          } else {
                            handlePresetSelect(preset);
                          }
                        }}
                        disabled={genState.isLoading}
                        className={`
                          flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 shadow-sm relative
                          ${preset.isLocked 
                            ? 'bg-slate-50 border border-slate-200 text-slate-400 hover:border-amber-300 hover:bg-amber-50' 
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50'
                          }
                        `}
                      >
                        <span>{preset.emoji}</span>
                        <span className="whitespace-nowrap">{preset.name}</span>
                        {preset.isLocked && (
                          <span className="ml-1 text-slate-400">
                            <Lock size={12} />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selection Summary Chips - Always visible, content animates in */}
                <div className="mb-4 p-3 bg-white rounded-xl border border-slate-200 sticky top-16 sm:top-20 z-40 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your Look</span>
                    {activeSelections.length > 0 && (
                      <button onClick={handleReset} className="text-xs text-slate-500 hover:text-rose-500 flex items-center gap-1 transition-opacity">
                        <RotateCcw size={10} />
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                    {activeSelections.length > 0 ? (
                      activeSelections.map((item, idx) => (
                        <span key={`${item.category}-${idx}`} className="inline-flex items-center gap-1 px-2 py-1 bg-[#0F172A] text-white text-xs rounded-full animate-in fade-in zoom-in-95 duration-200">
                          {item.label}
                          <button onClick={() => removeSelection(item.category, item.value)} className="hover:bg-slate-700 rounded-full p-0.5">
                            <X size={10} className="text-white" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Click sidebar icons to select styles
                      </span>
                    )}
                  </div>
                </div>

              </section>
            )}

            {/* Action Buttons - Visible on all screen sizes when image is selected */}
            {selectedImage && (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Clear All Selections Button with Tooltip */}
                <div className="relative group">
                  <button
                    onClick={handleReset}
                    disabled={genState.isLoading || selectionCount === 0}
                    className="p-2.5 sm:p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RotateCcw size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0F172A] text-white text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    Clear all selections
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0F172A]" />
                  </div>
                </div>
                
                {/* Surprise Me Button with Tooltip */}
                <div className="relative group">
                  <button
                    onClick={handleRandomize}
                    disabled={genState.isLoading}
                    className="p-2.5 sm:p-3 rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Dices size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0F172A] text-white text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    Surprise me
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0F172A]" />
                  </div>
                </div>
                <button
                  onClick={handleGenerateClick}
                  disabled={genState.isLoading || selectionCount === 0}
                  className={`
                    group relative flex-1 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg
                    flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 overflow-hidden
                    ${genState.isLoading || selectionCount === 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-[#0F172A] text-white hover:shadow-2xl hover:shadow-slate-900/30 hover:scale-[1.02]'
                    }
                  `}
                >
                  {/* Subtle shimmer effect */}
                  {!genState.isLoading && selectionCount > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  )}
                  <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                    {genState.isLoading ? 'Processing...' : 'Generate New Look'}
                    {!genState.isLoading && <Sparkles size={18} className="sm:w-5 sm:h-5 group-hover:animate-pulse" />}
                  </span>
                </button>
              </div>
            )}
        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenTerms={() => setShowTermsModal(true)}
        onOpenContact={() => setShowContactModal(true)}
      />



      {/* Legal Modals */}
      <LegalModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </LegalModal>

      <LegalModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms of Service"
      >
        <TermsOfServiceContent />
      </LegalModal>

      <LegalModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Us"
      >
        <ContactContent />
      </LegalModal>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignIn={(userData) => setUser(userData)}
        defaultMode={authModalMode}
      />

      {/* Profile Modal */}
      {user && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onUpdateUser={(updatedUser) => setUser(updatedUser)}
        />
      )}

      {/* Purchase Modal - shown when out of coins or when clicking coin display */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />

      {/* Gallery Modal - user's saved creations */}
      {user && (
        <GalleryModal
          isOpen={showGalleryModal}
          onClose={() => setShowGalleryModal(false)}
          userId={user.id}
        />
      )}

      {/* Developer Toolbar - only visible for test user and admin */}
      <DevToolbar />
    </div>
  );
};

export default App;
