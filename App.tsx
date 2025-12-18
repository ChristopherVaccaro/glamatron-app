import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Sparkles, Download, RefreshCw, Wand2, ArrowRight, Dices, X, Share2, RotateCcw, ChevronDown, Zap, ChevronLeft, ChevronRight, User, Coins, Lock, Heart, AlertTriangle } from 'lucide-react';
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
  EYE_MAKEUP_OPTIONS,
  EYE_COLOR_OPTIONS,
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
// Password gate removed
import PurchaseModal from './components/PurchaseModal';
import GlamCoinDisplay from './components/GlamCoinDisplay';
// DevToolbar removed
import GalleryModal from './components/GalleryModal';
import AdminGalleryModal from './components/AdminGalleryModal';
import FAQModal from './components/FAQModal';
import Toast from './components/Toast';
import StyleAnalyzerModal from './components/StyleAnalyzerModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import ResetPasswordModal from './components/ResetPasswordModal';
import CookieConsentBanner from './components/CookieConsentBanner';
import { useGallery } from './contexts/GalleryContext';
import { generateStyledImage } from './services/geminiService';
import { Analytics } from './utils/analytics';

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
  // ===== NEW QUICK LOOKS (Popularity rated 1-10) =====
  {
    // Popularity: 10/10 - #1 trending on TikTok/Instagram
    id: 'clean_girl',
    name: 'Clean Girl',
    emoji: '✨',
    selections: {
      [StyleCategory.HAIR]: 'Slicked back tight bun',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: null,
      [StyleCategory.MAKEUP]: 'Minimal "clean girl" aesthetic makeup',
      [StyleCategory.EXPRESSION]: 'Calm neutral expression',
      [StyleCategory.EYES]: 'Natural lashes with mascara only',
      [StyleCategory.LIPS]: 'High shine clear lip gloss',
      [StyleCategory.ACCESSORIES]: ['Small huggie hoop earrings'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    // Popularity: 9/10 - Most requested for dates/events
    id: 'soft_glam',
    name: 'Soft Glam',
    emoji: '🌹',
    selections: {
      [StyleCategory.HAIR]: 'Loose beachy waves',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: null,
      [StyleCategory.MAKEUP]: 'Soft glam bridal style makeup',
      [StyleCategory.EXPRESSION]: 'Subtle closed-mouth smile',
      [StyleCategory.EYES]: 'Warm brown matte smokey eye',
      [StyleCategory.LIPS]: 'Matte nude lipstick',
      [StyleCategory.ACCESSORIES]: ['Classic diamond stud earrings'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    // Popularity: 9/10 - Viral "old money" aesthetic
    id: 'old_money',
    name: 'Old Money',
    emoji: '🏛️',
    selections: {
      [StyleCategory.HAIR]: 'Elegant low ponytail',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Deep dark brown',
      [StyleCategory.MAKEUP]: 'Flawless full-coverage matte foundation',
      [StyleCategory.EXPRESSION]: 'Calm neutral expression',
      [StyleCategory.EYES]: 'Natural lashes with mascara only',
      [StyleCategory.LIPS]: 'Matte nude lipstick',
      [StyleCategory.ACCESSORIES]: ['String of pearls necklace', 'Classic pearl stud earrings'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    // Popularity: 8/10 - Trending feminine aesthetic
    id: 'coquette',
    name: 'Coquette',
    emoji: '🎀',
    selections: {
      [StyleCategory.HAIR]: 'Long voluminous curly hair',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: null,
      [StyleCategory.MAKEUP]: 'Igari style heavy blush under eyes',
      [StyleCategory.EXPRESSION]: 'Cute upset pouting expression',
      [StyleCategory.EYES]: 'Dramatic long false eyelashes',
      [StyleCategory.LIPS]: 'Korean style gradient ombre lips',
      [StyleCategory.ACCESSORIES]: ['Satin hair ribbon bow'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    // Popularity: 8/10 - Gen Z favorite
    id: 'streetwear',
    name: 'Streetwear',
    emoji: '🔥',
    selections: {
      [StyleCategory.HAIR]: 'Double space buns',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Icy platinum blonde',
      [StyleCategory.MAKEUP]: 'Heavy bronzer sun-kissed look',
      [StyleCategory.EXPRESSION]: 'Serious intense expression',
      [StyleCategory.EYES]: 'Sharp black winged eyeliner',
      [StyleCategory.LIPS]: 'Matte nude lipstick',
      [StyleCategory.ACCESSORIES]: ['Thick gold chain necklace', 'Large gold hoop earrings'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    // Popularity: 8/10 - Festival/summer favorite
    id: 'mermaid',
    name: 'Mermaid',
    emoji: '🧜‍♀️',
    selections: {
      [StyleCategory.HAIR]: 'Long flowing wavy hair',
      [StyleCategory.HAIR_LENGTH]: 'Very long waist length',
      [StyleCategory.HAIR_COLOR]: 'Galaxy mix of purple blue and black',
      [StyleCategory.MAKEUP]: 'Intense highlighter strobing effect',
      [StyleCategory.EXPRESSION]: 'Sultry seductive gaze',
      [StyleCategory.EYES]: 'Eyes embellished with rhinestones',
      [StyleCategory.LIPS]: 'Sparkling glitter lips',
      [StyleCategory.ACCESSORIES]: ['Rhinestone face gems', 'Glitter dusted on cheekbones'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    // Popularity: 9/10 - High commercial value
    id: 'bridal',
    name: 'Bridal Glow',
    emoji: '👰',
    selections: {
      [StyleCategory.HAIR]: 'Elegant formal updo',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: null,
      [StyleCategory.MAKEUP]: 'Dewy glass skin high-shine base',
      [StyleCategory.EXPRESSION]: 'Radiant beaming smile',
      [StyleCategory.EYES]: 'Dramatic long false eyelashes',
      [StyleCategory.LIPS]: 'Matte nude lipstick',
      [StyleCategory.ACCESSORIES]: ['Sparkling crystal tiara', 'Pearl drop earrings'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    // Popularity: 7/10 - Nostalgia trend
    id: 'supermodel',
    name: '90s Supermodel',
    emoji: '💃',
    selections: {
      [StyleCategory.HAIR]: 'Voluminous salon blowout',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Rich chestnut brown',
      [StyleCategory.MAKEUP]: 'Sculpted heavy contour makeup',
      [StyleCategory.EXPRESSION]: 'Confident asymmetrical smirk',
      [StyleCategory.EYES]: 'Black and grey smokey eye',
      [StyleCategory.LIPS]: '90s brown lip liner with lighter center',
      [StyleCategory.ACCESSORIES]: ['Large gold hoop earrings'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    // Popularity: 8/10 - K-beauty influence growing
    id: 'glass_skin',
    name: 'Glass Skin',
    emoji: '💎',
    selections: {
      [StyleCategory.HAIR]: 'Long sleek straight hair',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Jet black',
      [StyleCategory.MAKEUP]: 'Dewy glass skin high-shine base',
      [StyleCategory.EXPRESSION]: 'Peaceful content expression',
      [StyleCategory.EYES]: 'Wet look glossy eyelids',
      [StyleCategory.LIPS]: 'Korean style gradient ombre lips',
      [StyleCategory.ACCESSORIES]: [],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    // Popularity: 8/10 - Consistently popular IG aesthetic
    id: 'baddie',
    name: 'Insta Baddie',
    emoji: '👑',
    selections: {
      [StyleCategory.HAIR]: 'Long flowing wavy hair',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Dark roots fading to blonde ends',
      [StyleCategory.MAKEUP]: 'Heavy contour and highlight full glam',
      [StyleCategory.EXPRESSION]: 'Sultry seductive gaze',
      [StyleCategory.EYES]: 'Sharp cut crease eyeshadow',
      [StyleCategory.LIPS]: 'Matte nude lipstick',
      [StyleCategory.ACCESSORIES]: ['Multiple layered gold necklaces', 'Large gold hoop earrings'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    // Popularity: 7/10 - Dark academia trending
    id: 'dark_academia',
    name: 'Dark Academia',
    emoji: '📚',
    selections: {
      [StyleCategory.HAIR]: 'Casual messy textured updo with loose strands',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Deep dark brown',
      [StyleCategory.MAKEUP]: 'Minimal "clean girl" aesthetic makeup',
      [StyleCategory.EXPRESSION]: 'Intensely focused concentration',
      [StyleCategory.EYES]: 'Warm brown matte smokey eye',
      [StyleCategory.LIPS]: 'Deep burgundy wine lipstick',
      [StyleCategory.ACCESSORIES]: ['Round wire-frame glasses'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    // Popularity: 7/10 - Y2K nostalgia
    id: 'y2k',
    name: 'Y2K Baby',
    emoji: '💿',
    selections: {
      [StyleCategory.HAIR]: 'Two braided pigtails',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Y2K chunky highlights',
      [StyleCategory.MAKEUP]: 'Intense highlighter strobing effect',
      [StyleCategory.EXPRESSION]: 'Silly duck face selfie expression',
      [StyleCategory.EYES]: 'Vibrant blue 80s eyeshadow',
      [StyleCategory.LIPS]: 'High shine clear lip gloss',
      [StyleCategory.ACCESSORIES]: ['90s butterfly hair clips', 'Trendy transparent frame glasses'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    // Popularity: 7/10 - Masculine groomed look
    id: 'gentleman',
    name: 'Modern Gentleman',
    emoji: '🎩',
    selections: {
      [StyleCategory.HAIR]: 'Clean skin fade haircut',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: null,
      [StyleCategory.MAKEUP]: null,
      [StyleCategory.EXPRESSION]: 'Confident asymmetrical smirk',
      [StyleCategory.EYES]: null,
      [StyleCategory.LIPS]: null,
      [StyleCategory.ACCESSORIES]: [],
      [StyleCategory.FACIAL_HAIR]: 'Neatly shaped boxed beard',
    }
  },
  {
    // Popularity: 8/10 - Natural beauty trending
    id: 'natural_glow',
    name: 'Natural Glow',
    emoji: '🌿',
    selections: {
      [StyleCategory.HAIR]: 'Long voluminous curly hair',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: null,
      [StyleCategory.MAKEUP]: 'Dewy glass skin high-shine base',
      [StyleCategory.EXPRESSION]: 'Radiant beaming smile',
      [StyleCategory.EYES]: 'Natural lashes with mascara only',
      [StyleCategory.LIPS]: 'High shine clear lip gloss',
      [StyleCategory.ACCESSORIES]: ['Dusted with natural freckles'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
  {
    // Popularity: 6/10 - Edgy alternative
    id: 'grunge_revival',
    name: 'Grunge Revival',
    emoji: '🖤',
    selections: {
      [StyleCategory.HAIR]: 'Trendy wolf cut with layers',
      [StyleCategory.HAIR_LENGTH]: null,
      [StyleCategory.HAIR_COLOR]: 'Jet black',
      [StyleCategory.MAKEUP]: 'Smudged messy 90s grunge makeup',
      [StyleCategory.EXPRESSION]: 'Rolling eyes annoyed expression',
      [StyleCategory.EYES]: 'Black and grey smokey eye',
      [StyleCategory.LIPS]: 'Deep burgundy wine lipstick',
      [StyleCategory.ACCESSORIES]: ['Silver septum clicker ring', 'Black velvet choker necklace'],
      [StyleCategory.FACIAL_HAIR]: null,
    }
  },
];

const App: React.FC = () => {
  // User context for GlamCoins and subscription
  const { user: contextUser, isAuthLoading, features, canGenerate, deductCoin, logGeneration, signOut, pendingPasswordRecovery } = useUser();
  
  // Gallery context for saving images
  const { addItem: addToGallery, items: galleryItems, toggleFavorite, getUserItems, loadUserGallery } = useGallery();
  
  // Track the current gallery item ID for the generated result
  const [currentGalleryItemId, setCurrentGalleryItemId] = useState<string | null>(null);
  
  // Password gate removed - site is open
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
  const [showAdminGalleryModal, setShowAdminGalleryModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showStyleAnalyzerModal, setShowStyleAnalyzerModal] = useState(false);
  
      
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
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const [showAuthSplash, setShowAuthSplash] = useState(true);
  const [authSplashFading, setAuthSplashFading] = useState(false);

  useEffect(() => {
    if (isAuthLoading) {
      setShowAuthSplash(true);
      setAuthSplashFading(false);
      return;
    }

    const t = window.setTimeout(() => {
      setAuthSplashFading(true);
    }, 150);

    return () => window.clearTimeout(t);
  }, [isAuthLoading]);

  // Effect to hide body scrollbar during splash
  useEffect(() => {
    if (showAuthSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAuthSplash]);

  const authSplash = showAuthSplash ? (
    <div
      className={`fixed inset-0 z-[9999] h-screen overflow-hidden bg-slate-900 flex items-center justify-center transition-opacity duration-500 ${authSplashFading ? 'opacity-0' : 'opacity-100'}`}
      onTransitionEnd={() => {
        if (authSplashFading) setShowAuthSplash(false);
      }}
    >
      <div className="text-center">
        <span className="text-2xl tracking-wide text-white" style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800 }}>
          GLAMATRON
        </span>
        <div className="mt-4 w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  ) : null;
  
  // Sync contextUser (from Supabase auth) to local user state
  useEffect(() => {
    console.log('Sync effect running - contextUser:', contextUser?.email, 'local user:', user?.email, 'isAuthLoading:', isAuthLoading);
    
    // Wait for auth to finish loading before syncing
    if (isAuthLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    if (contextUser && !user) {
      console.log('Syncing contextUser to local state');
      // User signed in via Supabase (Google or Email) - sync to local state
      setUser({
        id: contextUser.id,
        email: contextUser.email,
        name: contextUser.name,
        avatar: contextUser.avatar,
        provider: contextUser.avatar ? 'google' : 'email', // If has avatar, likely Google
      });
      // Authenticated users go straight to tool
      setShowLanding(false);
      // Load user's gallery from Supabase
      loadUserGallery(contextUser.id);
    } else if (!contextUser && user && (user.provider === 'google' || user.provider === 'email')) {
      // User signed out from Supabase - go back to landing page
      console.log('User signed out, clearing state');
      setUser(null);
      setShowLanding(true);
      setSelectedImage(null);
      setGenState({ isLoading: false, error: null, resultImage: null });
    }
  }, [contextUser, user, isAuthLoading, loadUserGallery]);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Show toast for email confirmation and payment success
  useEffect(() => {
    // Check hash params (for Supabase auth redirects)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    
    // Show welcome toast for email confirmation
    if (type === 'signup') {
      setToast({ message: 'Account confirmed! Welcome to Glamatron.', type: 'success' });
    } else if (type === 'recovery') {
      setToast({ message: 'Please set your new password.', type: 'info' });
    }

    // Check URL query params (for Stripe payment success)
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const coinsAdded = urlParams.get('coins');
    
    if (paymentStatus === 'success') {
      const message = coinsAdded 
        ? `Payment successful! ${coinsAdded} GlamCoins have been added to your account.`
        : 'Payment successful! Your GlamCoins have been added.';
      setToast({ message, type: 'success' });
      
      // Clean up the URL (remove query params)
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'cancelled') {
      setToast({ message: 'Payment was cancelled. No charges were made.', type: 'info' });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);
  
  // Track if sidebar panel is open (for hiding image X button on mobile)
  const [isSidebarPanelOpen, setIsSidebarPanelOpen] = useState(false);
  
  // Surprise Me mode - when active, disables style options and enables generate button
  const [surpriseMeActive, setSurpriseMeActive] = useState(false);
  
  // Quick Looks collapsed state - collapsed by default
  const [quickLooksExpanded, setQuickLooksExpanded] = useState(false);

  const handleSelection = useCallback((category: StyleCategory, value: string, singleSelect?: boolean) => {
    setSelections(prev => {
      // Handle accessories - can be multi-select or single-select depending on the subcategory
      if (category === StyleCategory.ACCESSORIES) {
        if (value === 'CLEAR_ALL') return { ...prev, [category]: [] };
        
        const current = prev[category] as string[];
        const exists = current.includes(value);
        
        // If single-select mode (e.g., eyewear), replace instead of toggle
        if (singleSelect) {
          return {
            ...prev,
            [category]: exists ? current.filter(v => v !== value) : [...current.filter(v => !v.includes('glasses') && !v.includes('Glasses') && !v.includes('sunglasses') && !v.includes('Sunglasses') && !v.includes('aviator') && !v.includes('Aviator')), value]
          };
        }
        
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
      
      // Deduct coin on successful generation (async - calls Supabase)
      const coinDeducted = await deductCoin();
      if (!coinDeducted && !features.unlimitedGenerations) {
        // This shouldn't happen if canGenerate was true, but handle edge case
        console.warn('Failed to deduct coin after generation');
      }
      
      // Log generation to Supabase for history tracking (async - don't block UI)
      logGeneration(activeSelections as unknown as Record<string, unknown>, 'completed').catch(console.error);
      
      // Save to gallery if user is signed in (async - don't block UI)
      if (user?.id) {
        addToGallery({
          userId: user.id,
          originalImage: selectedImage,
          resultImage: result,
          selections: activeSelections,
        }).then(newItem => {
          if (newItem) {
            setCurrentGalleryItemId(newItem.id);
          }
        }).catch(console.error);
      } else {
        setCurrentGalleryItemId(null);
      }
      
      setGenState({ isLoading: false, error: null, resultImage: result });
      Analytics.generationSuccess('custom');
    } catch (err: any) {
      // Don't deduct coin on failed generation, but log the failure
      logGeneration(activeSelections as unknown as Record<string, unknown>, 'failed', err.message).catch(console.error);
      Analytics.generationError(err.message || 'Unknown error');
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
      Analytics.coinPurchaseModalOpen();
      setShowPurchaseModal(true);
      return;
    }
    
    if (surpriseMeActive) {
      // Generate random selections and execute
      const randomSelections = generateRandomSelections();
      setSelections(randomSelections);
      Analytics.styleGeneration('randomize');
      executeGeneration(randomSelections);
      // Turn off surprise me after generation
      setSurpriseMeActive(false);
    } else {
      Analytics.styleGeneration('manual');
      executeGeneration(selections);
    }
  };

  // Toggle Surprise Me mode
  const handleSurpriseMeToggle = () => {
    if (!selectedImage) return;

    if (surpriseMeActive) {
      // Turning off - just deactivate, keep any selections
      setSurpriseMeActive(false);
    } else {
      // Turning on - activate surprise me mode (will generate random on Generate click)
      setSurpriseMeActive(true);
    }
  };

  // Generate random selections (used when Generate is clicked with Surprise Me active)
  const generateRandomSelections = (): UserSelections => {
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

    return {
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
  };

  const handleDownload = async () => {
    if (!genState.resultImage) return;
    Analytics.imageDownloaded();
    
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
            text: 'Check out my style transformation with Glamatron!',
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
                  text: 'Check out my style transformation with Glamatron!',
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

  // Handle applying styles from Style Analyzer
  const handleApplyAnalyzedStyles = (analyzedSelections: Partial<UserSelections>) => {
    setSelections(prev => {
      const newSelections = { ...prev };
      
      // Apply each analyzed selection
      Object.entries(analyzedSelections).forEach(([key, value]) => {
        if (key === StyleCategory.ACCESSORIES && Array.isArray(value)) {
          // Merge accessories instead of replacing
          const currentAccessories = prev[StyleCategory.ACCESSORIES] || [];
          const newAccessories = [...new Set([...currentAccessories, ...value])];
          newSelections[StyleCategory.ACCESSORIES] = newAccessories;
        } else if (value !== null && value !== undefined) {
          (newSelections as any)[key] = value;
        }
      });
      
      return newSelections;
    });
    
    // Disable Surprise Me if it was active
    setSurpriseMeActive(false);
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
    EYE_MAKEUP: filterStyleOptions(EYE_MAKEUP_OPTIONS, hasFullAccess),
    EYE_COLOR: filterStyleOptions(EYE_COLOR_OPTIONS, hasFullAccess),
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

  if (showLanding) {
    return (
      <>
        <LandingPage 
          onGetStarted={() => setShowLanding(false)} 
          onSignIn={(userData) => setUser(userData)}
          user={user}
        />
        {authSplash}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {authSplash}
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <button 
            onClick={handleStartOver}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <span className="text-lg sm:text-xl tracking-wide text-slate-900" style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800 }}>
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
                onOpenAdminGallery={() => setShowAdminGalleryModal(true)}
                onOpenFAQ={() => setShowFAQModal(true)}
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

      {/* Desktop Sidebar Navigation - Always visible, disabled when no image, surprise me is active, or generating */}
      <SidebarNav 
        selections={selections}
        onSelect={handleSelection}
        optionsMap={optionsMap}
        disabled={!selectedImage || surpriseMeActive || genState.isLoading}
        onPremiumClick={() => setShowPurchaseModal(true)}
        onPanelOpenChange={setIsSidebarPanelOpen}
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
                      hideCloseButton={isSidebarPanelOpen}
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
                          className={`px-4 py-3.5 rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
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
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Share2 size={18} />
                        Share
                      </button>
                      <button 
                        onClick={handleDownload}
                        disabled={genState.isLoading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 bg-[#0F172A] text-white rounded-xl hover:bg-slate-800 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                        setGenState(prev => ({ ...prev, resultImage: null, error: null }));
                        setCurrentGalleryItemId(null);
                      }}
                      onClear={() => {
                        setSelectedImage(null);
                        setGenState(prev => ({ ...prev, resultImage: null, error: null }));
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
                  
                  {/* Error Message Display */}
                  {genState.error && !genState.isLoading && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-amber-800 mb-1">Oops! We couldn't transform this image</h4>
                          <p className="text-sm text-amber-700 mb-3">
                            Our AI had trouble processing your photo. This can happen with certain poses, angles, or image types.
                          </p>
                          <div className="text-sm text-amber-600 space-y-1">
                            <p className="font-medium">Try these tips:</p>
                            <ul className="list-disc list-inside space-y-0.5 text-amber-600/90">
                              <li>Use a clear, front-facing portrait photo</li>
                              <li>Make sure your face is well-lit and visible</li>
                              <li>Try a different photo or fewer style options</li>
                            </ul>
                          </div>
                          <button
                            onClick={() => setGenState(prev => ({ ...prev, error: null }))}
                            className="mt-3 text-sm font-medium text-amber-700 hover:text-amber-800 underline underline-offset-2"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
            {/* Style Selectors */}
            {selectedImage && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Quick Looks - Collapsible container */}
                <div className={`mb-4 ${surpriseMeActive || genState.isLoading ? 'opacity-50 pointer-events-none' : ''}`} style={genState.isLoading ? { cursor: 'not-allowed' } : undefined}>
                  <button
                    onClick={() => setQuickLooksExpanded(!quickLooksExpanded)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm"
                    disabled={surpriseMeActive || genState.isLoading}
                  >
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Zap size={12} className="text-amber-500" />
                      Quick Looks
                      <span className="text-slate-400 font-normal normal-case">• {availablePresets.length} presets</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      {quickLooksExpanded && (
                        <div className="hidden lg:flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const container = document.getElementById('quick-looks-scroll');
                              if (container) container.scrollBy({ left: -600, behavior: 'smooth' });
                            }}
                            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            aria-label="Scroll left"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const container = document.getElementById('quick-looks-scroll');
                              if (container) container.scrollBy({ left: 600, behavior: 'smooth' });
                            }}
                            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            aria-label="Scroll right"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      )}
                      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${quickLooksExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  
                  {/* Expandable content */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${quickLooksExpanded ? 'max-h-[200px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                  <div id="quick-looks-scroll" className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                    {/* Style Analyzer Button - Copy styles from reference photos */}
                    <button
                      onClick={() => setShowStyleAnalyzerModal(true)}
                      disabled={genState.isLoading || surpriseMeActive}
                      className={`
                        flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5
                        border-2 border-dashed border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50
                        ${surpriseMeActive || genState.isLoading ? 'cursor-not-allowed opacity-50' : ''}
                      `}
                    >
                      <Wand2 size={14} />
                      <span className="whitespace-nowrap">Copy a Look</span>
                    </button>
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
                        disabled={genState.isLoading || surpriseMeActive}
                        className={`
                          flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 shadow-sm relative
                          ${preset.isLocked 
                            ? 'bg-slate-50 border border-slate-200 text-slate-400 hover:border-amber-300 hover:bg-amber-50' 
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50'
                          }
                          ${surpriseMeActive || genState.isLoading ? 'cursor-not-allowed' : ''}
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
                </div>

                {/* Selection Summary Chips - Always visible, content animates in */}
                <div className={`mb-4 p-3 rounded-xl border sticky top-16 sm:top-20 z-40 shadow-md transition-all ${
                  surpriseMeActive 
                    ? 'bg-violet-50 border-violet-200' 
                    : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${surpriseMeActive ? 'text-violet-600' : 'text-slate-500'}`}>
                      {surpriseMeActive ? 'Surprise Me Active' : 'Your Look'}
                    </span>
                    {activeSelections.length > 0 && !surpriseMeActive && !genState.isLoading && (
                      <button onClick={handleReset} className="text-xs text-slate-500 hover:text-rose-500 flex items-center gap-1 transition-opacity">
                        <RotateCcw size={10} />
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="min-h-[28px]">
                    {surpriseMeActive ? (
                      <span className="text-xs text-violet-600">Generate a random look</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {activeSelections.length > 0 ? (
                          activeSelections.map((item, idx) => (
                            <span key={`${item.category}-${idx}`} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full animate-in fade-in zoom-in-95 duration-200">
                              {item.label}
                              {!genState.isLoading && (
                                <button onClick={() => removeSelection(item.category, item.value)} className="hover:bg-slate-200 rounded-full p-0.5">
                                  <X size={10} className="text-slate-500" />
                                </button>
                              )}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Click sidebar icons to select styles
                          </span>
                        )}
                      </div>
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
                    className="px-4 py-3.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RotateCcw size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0F172A] text-white text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    Clear all selections
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0F172A]" />
                  </div>
                </div>
                
                {/* Surprise Me Button with Tooltip - Toggle mode */}
                <div className="relative group">
                  <button
                    onClick={handleSurpriseMeToggle}
                    disabled={genState.isLoading}
                    className={`
                      px-4 py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                      ${surpriseMeActive 
                        ? 'bg-violet-600 text-white ring-2 ring-violet-400 ring-offset-2 animate-pulse' 
                        : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                      }
                    `}
                  >
                    <Dices size={18} className={`sm:w-5 sm:h-5 ${surpriseMeActive ? 'animate-bounce' : ''}`} />
                  </button>
                  <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0F172A] text-white text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {surpriseMeActive ? 'Click to disable random mode' : 'Surprise me'}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0F172A]" />
                  </div>
                </div>
                <button
                  onClick={handleGenerateClick}
                  disabled={genState.isLoading || (!surpriseMeActive && selectionCount === 0)}
                  className={`
                    group relative flex-1 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg
                    flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 overflow-hidden
                    ${genState.isLoading || (!surpriseMeActive && selectionCount === 0)
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-[#0F172A] text-white hover:shadow-2xl hover:shadow-slate-900/30 hover:scale-[1.02]'
                    }
                  `}
                >
                  {/* Subtle shimmer effect */}
                  {!genState.isLoading && (surpriseMeActive || selectionCount > 0) && (
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
        onForgotPassword={() => {
          setShowAuthModal(false);
          setShowForgotPasswordModal(true);
        }}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onBackToSignIn={() => {
          setShowForgotPasswordModal(false);
          setAuthModalMode('signin');
          setShowAuthModal(true);
        }}
      />

      {/* Reset Password Modal - shown when user clicks password reset link */}
      <ResetPasswordModal
        isOpen={pendingPasswordRecovery}
        onClose={() => {}}
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

      {/* Admin Gallery Modal - all users' creations (admin only) */}
      <AdminGalleryModal
        isOpen={showAdminGalleryModal}
        onClose={() => setShowAdminGalleryModal(false)}
      />

      {/* FAQ Modal */}
      <FAQModal
        isOpen={showFAQModal}
        onClose={() => setShowFAQModal(false)}
      />

      {/* Style Analyzer Modal - Copy styles from reference photos */}
      <StyleAnalyzerModal
        isOpen={showStyleAnalyzerModal}
        onClose={() => setShowStyleAnalyzerModal(false)}
        onApplyStyles={handleApplyAnalyzedStyles}
      />

      {/* Cookie Consent Banner - GDPR/CCPA compliance */}
      <CookieConsentBanner />
    </div>
  );
};

export default App;
