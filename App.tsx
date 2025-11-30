import React, { useState, useCallback, useMemo } from 'react';
import { Sparkles, Download, RefreshCw, Wand2, ArrowRight, Dices, X, Share2, RotateCcw, ChevronDown, Zap, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { 
  StyleCategory, 
  UserSelections, 
  GenerationState 
} from './types';
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
import ImageUploader from './components/ImageUploader';
import ComparisonView from './components/ComparisonView';
import ResultModal from './components/ResultModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';
import PrivacyPolicyContent from './components/PrivacyPolicyContent';
import TermsOfServiceContent from './components/TermsOfServiceContent';
import ContactContent from './components/ContactContent';
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalFilename, setOriginalFilename] = useState<string>('image');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    hair: true,
    face: true,
    accessories: false,
    extras: false,
  });
  
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

  const [showResultModal, setShowResultModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

    // Check if at least one style is selected
    const hasSelection = 
      activeSelections[StyleCategory.HAIR] || 
      activeSelections[StyleCategory.HAIR_LENGTH] ||
      activeSelections[StyleCategory.HAIR_COLOR] ||
      activeSelections[StyleCategory.MAKEUP] || 
      activeSelections[StyleCategory.EXPRESSION] ||
      activeSelections[StyleCategory.EYES] || 
      activeSelections[StyleCategory.LIPS] ||
      activeSelections[StyleCategory.FACIAL_HAIR] ||
      activeSelections[StyleCategory.ACCESSORIES].length > 0;

    if (!hasSelection) {
      setGenState(prev => ({ ...prev, error: "Please select at least one style option." }));
      return;
    }

    setGenState({ isLoading: true, error: null, resultImage: null });
    
    // Show modal immediately on mobile for loading state
    if (window.innerWidth < 1024) {
      setShowResultModal(true);
    }

    try {
      const result = await generateStyledImage(selectedImage, activeSelections);
      setGenState({ isLoading: false, error: null, resultImage: result });
    } catch (err: any) {
      setGenState({ 
        isLoading: false, 
        error: err.message || "Something went wrong. Please try again.", 
        resultImage: null 
      });
      // Close modal on error so user sees the error state
      setShowResultModal(false);
    }
  };

  const handleGenerateClick = () => {
    executeGeneration(selections);
  };

  const handleRandomize = () => {
    if (!selectedImage) return;

    // Helper to get random item from array
    const getRandom = <T extends { value: string }>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)].value;
    
    // Helper to maybe get an item (X% chance)
    const maybeGet = <T extends { value: string }>(arr: T[], chance: number = 0.5) => Math.random() < chance ? getRandom(arr) : null;

    // Collect all accessories
    const allAccessories = [
      ...GLASSES_OPTIONS,
      ...PIERCING_OPTIONS,
      ...HEADWEAR_OPTIONS,
      ...JEWELRY_OPTIONS,
      ...FACE_EXTRAS_OPTIONS
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
      [StyleCategory.HAIR]: maybeGet(HAIR_OPTIONS, 0.7), 
      [StyleCategory.HAIR_LENGTH]: maybeGet(HAIR_LENGTH_OPTIONS, 0.4),
      [StyleCategory.HAIR_COLOR]: maybeGet(HAIR_COLOR_OPTIONS, 0.5),
      [StyleCategory.MAKEUP]: maybeGet(MAKEUP_OPTIONS, 0.6),
      [StyleCategory.EXPRESSION]: maybeGet(EXPRESSION_OPTIONS, 0.5),
      [StyleCategory.EYES]: maybeGet(EYE_OPTIONS, 0.5),
      [StyleCategory.LIPS]: maybeGet(LIP_OPTIONS, 0.5),
      [StyleCategory.ACCESSORIES]: randomAccessories,
      [StyleCategory.FACIAL_HAIR]: maybeGet(FACIAL_HAIR_OPTIONS, 0.25),
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
    setSelectedImage(null);
    setGenState({ isLoading: false, error: null, resultImage: null });
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
          <button 
            onClick={() => setShowAuthModal(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Sign In
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Controls */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* 1. Upload Section */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">1</span>
                Upload Photo
              </h2>
              <ImageUploader 
                selectedImage={selectedImage}
                onImageSelected={(img, filename) => {
                  setSelectedImage(img);
                  setOriginalFilename(filename);
                  setGenState(prev => ({ ...prev, resultImage: null }));
                }}
                onClear={() => {
                  setSelectedImage(null);
                  setGenState(prev => ({ ...prev, resultImage: null }));
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
            </section>
            {/* 2. Style Selectors */}
            {selectedImage && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">2</span>
                    Customize Look
                  </h2>
                </div>

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
                    {QUICK_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset)}
                        disabled={genState.isLoading}
                        className="flex-shrink-0 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-rose-300 hover:bg-rose-50 transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>{preset.emoji}</span>
                        <span className="whitespace-nowrap">{preset.name}</span>
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
                      <span className="text-xs text-slate-400 italic">Select styles below to build your look</span>
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  
                  {/* Hair Section - Collapsible */}
                  <div className="border-b border-slate-100">
                    <button onClick={() => toggleSection('hair')} className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                      <h3 className="text-md font-bold text-slate-900">
                        Hair
                      </h3>
                      <ChevronDown className={`text-slate-400 transition-transform ${expandedSections.hair ? 'rotate-180' : ''}`} size={20} />
                    </button>
                    {expandedSections.hair && (
                      <div className="px-4 sm:px-6 pb-6 space-y-4">
                        <StyleSelector title="Hair Style" category={StyleCategory.HAIR} options={HAIR_OPTIONS} selections={selections} onSelect={handleSelection} />
                        <StyleSelector title="Hair Length" category={StyleCategory.HAIR_LENGTH} options={HAIR_LENGTH_OPTIONS} selections={selections} onSelect={handleSelection} />
                        <StyleSelector title="Hair Color" category={StyleCategory.HAIR_COLOR} options={HAIR_COLOR_OPTIONS} selections={selections} onSelect={handleSelection} />
                      </div>
                    )}
                  </div>
                  
                  {/* Face Section - Collapsible */}
                  <div className="border-b border-slate-100">
                    <button onClick={() => toggleSection('face')} className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                      <h3 className="text-md font-bold text-slate-900">
                        Face & Expression
                      </h3>
                      <ChevronDown className={`text-slate-400 transition-transform ${expandedSections.face ? 'rotate-180' : ''}`} size={20} />
                    </button>
                    {expandedSections.face && (
                      <div className="px-4 sm:px-6 pb-6 space-y-4">
                        <StyleSelector title="Expression" category={StyleCategory.EXPRESSION} options={EXPRESSION_OPTIONS} selections={selections} onSelect={handleSelection} />
                        <StyleSelector title="Makeup Base" category={StyleCategory.MAKEUP} options={MAKEUP_OPTIONS} selections={selections} onSelect={handleSelection} />
                        <StyleSelector title="Eyes & Contacts" category={StyleCategory.EYES} options={EYE_OPTIONS} selections={selections} onSelect={handleSelection} />
                        <StyleSelector title="Lips" category={StyleCategory.LIPS} options={LIP_OPTIONS} selections={selections} onSelect={handleSelection} />
                      </div>
                    )}
                  </div>

                  {/* Accessories Section - Collapsible (collapsed by default) */}
                  <div className="border-b border-slate-100">
                    <button onClick={() => toggleSection('accessories')} className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                      <h3 className="text-md font-bold text-slate-900">
                        Accessories
                      </h3>
                      <ChevronDown className={`text-slate-400 transition-transform ${expandedSections.accessories ? 'rotate-180' : ''}`} size={20} />
                    </button>
                    {expandedSections.accessories && (
                      <div className="px-4 sm:px-6 pb-6 space-y-4">
                        <StyleSelector title="Eyewear" category={StyleCategory.ACCESSORIES} options={GLASSES_OPTIONS} selections={selections} onSelect={handleSelection} multiSelect />
                        <StyleSelector title="Piercings" category={StyleCategory.ACCESSORIES} options={PIERCING_OPTIONS} selections={selections} onSelect={handleSelection} multiSelect />
                        <StyleSelector title="Headwear" category={StyleCategory.ACCESSORIES} options={HEADWEAR_OPTIONS} selections={selections} onSelect={handleSelection} multiSelect />
                        <StyleSelector title="Jewelry & Neckwear" category={StyleCategory.ACCESSORIES} options={JEWELRY_OPTIONS} selections={selections} onSelect={handleSelection} multiSelect />
                        <StyleSelector title="Extras & Face Art" category={StyleCategory.ACCESSORIES} options={FACE_EXTRAS_OPTIONS} selections={selections} onSelect={handleSelection} multiSelect />
                      </div>
                    )}
                  </div>

                  {/* Fun Extras Section - Facial Hair (collapsed by default) */}
                  <div>
                    <button onClick={() => toggleSection('extras')} className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                      <h3 className="text-md font-bold text-slate-900">
                        Facial Hair
                      </h3>
                      <ChevronDown className={`text-slate-400 transition-transform ${expandedSections.extras ? 'rotate-180' : ''}`} size={20} />
                    </button>
                    {expandedSections.extras && (
                      <div className="px-4 sm:px-6 pb-6 space-y-4">
                        <StyleSelector title="Facial Hair Style" category={StyleCategory.FACIAL_HAIR} options={FACIAL_HAIR_OPTIONS} selections={selections} onSelect={handleSelection} />
                      </div>
                    )}
                  </div>

                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: Results & Actions */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 space-y-6">
              
              {/* Result Area - Hidden on mobile when empty */}
              <div className={`
                bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 relative
                ${!genState.resultImage && !genState.isLoading && !genState.error ? 'hidden lg:flex min-h-[400px] items-center justify-center' : ''}
                ${genState.isLoading || genState.error ? 'min-h-[300px]' : ''}
              `}>
                
                {/* Empty State - Desktop only */}
                {!selectedImage && !genState.resultImage && (
                  <div className="hidden lg:block text-center p-8 text-slate-400">
                    <Wand2 size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Upload an image to start magic</p>
                  </div>
                )}

                {/* Loading State - Desktop only (mobile uses modal) */}
                {genState.isLoading && (
                  <div className="hidden lg:flex absolute inset-0 z-20 bg-white/80 backdrop-blur-md flex-col items-center justify-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-500" size={24} />
                    </div>
                    <p className="mt-4 text-slate-600 font-medium animate-pulse">Applying styles...</p>
                  </div>
                )}

                {/* Error State */}
                {genState.error && (
                   <div className="absolute inset-0 z-20 bg-white/95 flex flex-col items-center justify-center p-6 text-center">
                     <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
                       <RefreshCw size={32} />
                     </div>
                     <p className="text-red-600 font-medium mb-2">Oops!</p>
                     <p className="text-slate-600 text-sm max-w-sm mb-6">{genState.error}</p>
                     <button 
                      onClick={() => setGenState(prev => ({...prev, error: null}))}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800"
                     >
                       Try Again
                     </button>
                   </div>
                )}

                {/* Comparison / Result View - Desktop */}
                {genState.resultImage && !genState.isLoading && selectedImage && (
                  <>
                    {/* Desktop: Inline view */}
                    <div className="hidden lg:block bg-white p-4">
                       <ComparisonView 
                         originalImage={selectedImage} 
                         generatedImage={genState.resultImage} 
                       />
                       <div className="mt-4 flex justify-between items-center gap-2">
                        <button 
                          onClick={handleStartOver}
                          className="flex items-center gap-2 text-slate-500 hover:text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors text-sm"
                        >
                          <RotateCcw size={16} />
                          Try New Photo
                        </button>
                        <div className="flex gap-2">
                          <button 
                            onClick={handleShare}
                            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <Share2 size={18} />
                            Share
                          </button>
                          <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                          >
                            <Download size={18} />
                            Download
                          </button>
                        </div>
                       </div>
                    </div>
                    
                  </>
                )}
                
                {/* Preview Placeholder if image selected but not generated - Desktop only */}
                {selectedImage && !genState.resultImage && !genState.isLoading && !genState.error && (
                   <div className="hidden lg:flex relative w-full h-full flex-col items-center justify-center p-8">
                     <img 
                       src={selectedImage} 
                       alt="Preview" 
                       className="absolute inset-0 w-full h-full object-cover opacity-10 blur-xl scale-110" 
                     />
                     <div className="relative z-10 text-center max-w-md bg-white/80 p-6 rounded-2xl backdrop-blur-sm shadow-sm">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Transform?</h3>
                        <p className="text-slate-600 mb-6">
                          Select your desired styles or try the "Surprise Me" button, then click Generate.
                        </p>
                     </div>
                   </div>
                )}
              </div>

              {/* Primary Action Button - Desktop only (mobile uses sticky bar) */}
              {selectedImage && (
                <button
                  onClick={handleGenerateClick}
                  disabled={genState.isLoading}
                  className={`
                    hidden lg:flex w-full py-4 rounded-xl font-bold text-lg shadow-xl shadow-rose-500/20 
                    items-center justify-center gap-3 transition-colors
                    ${genState.isLoading 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-rose-600 to-violet-600 text-white hover:shadow-rose-500/40'
                    }
                  `}
                >
                  {genState.isLoading ? 'Processing...' : 'Generate New Look'}
                  {!genState.isLoading && <Sparkles size={20} />}
                </button>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenTerms={() => setShowTermsModal(true)}
        onOpenContact={() => setShowContactModal(true)}
      />

      {/* Mobile Sticky Action Bar */}
      {selectedImage && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex items-center gap-2 lg:hidden z-50 safe-area-pb">
          {genState.resultImage && !genState.isLoading ? (
            <>
              {/* Result exists - show View Result + Regenerate */}
              <button
                onClick={handleGenerateClick}
                className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                aria-label="Regenerate"
              >
                <RefreshCw size={20} />
              </button>
              <button
                onClick={() => setShowResultModal(true)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-violet-600 text-white active:scale-[0.98] transition-all"
              >
                View Result
                <Sparkles size={18} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                aria-label="Share"
              >
                <Share2 size={20} />
              </button>
            </>
          ) : (
            <>
              {/* No result yet - show Generate controls */}
              <button
                onClick={handleReset}
                disabled={genState.isLoading || selectionCount === 0}
                className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Reset selections"
              >
                <RotateCcw size={20} />
              </button>
              <button
                onClick={handleRandomize}
                disabled={genState.isLoading}
                className="p-3 rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Surprise me"
              >
                <Dices size={20} />
              </button>
              <button
                onClick={handleGenerateClick}
                disabled={genState.isLoading}
                className={`
                  flex-1 py-3 px-4 rounded-xl font-bold text-base
                  flex items-center justify-center gap-2 transition-all
                  ${genState.isLoading 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-rose-600 to-violet-600 text-white active:scale-[0.98]'
                  }
                `}
              >
                {genState.isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing
                  </>
                ) : (
                  <>
                    Generate
                    <Sparkles size={18} />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}

      {/* Result Modal for Mobile */}
      {selectedImage && (genState.resultImage || genState.isLoading) && (
        <ResultModal
          isOpen={showResultModal}
          isLoading={genState.isLoading}
          onClose={() => setShowResultModal(false)}
          originalImage={selectedImage}
          generatedImage={genState.resultImage}
          onDownload={handleDownload}
          onShare={handleShare}
          onTryAgain={() => {
            // Clear result so bar shows "Generate" again
            setGenState(prev => ({ ...prev, resultImage: null }));
            // Scroll to style options
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

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
      />
    </div>
  );
};

export default App;
