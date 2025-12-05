import React, { useState, useRef, useEffect } from 'react';
import { 
  Scissors, 
  Smile, 
  Palette, 
  Eye, 
  Droplet,
  Glasses,
  Crown,
  Gem,
  Star,
  X,
  ChevronLeft
} from 'lucide-react';
import { StyleCategory, StyleOption, UserSelections } from '../types';
import StyleSelector from './StyleSelector';
import { ExtendedStyleOption } from '../utils/styleAccess';

// Category configuration with icons and labels
const CATEGORY_CONFIG = [
  {
    id: 'hair',
    label: 'Hair',
    icon: Scissors,
    categories: [
      { key: 'HAIR', title: 'Hair Style', category: StyleCategory.HAIR, optionsKey: 'HAIR' },
      { key: 'HAIR_LENGTH', title: 'Hair Length', category: StyleCategory.HAIR_LENGTH, optionsKey: 'HAIR_LENGTH' },
      { key: 'HAIR_COLOR', title: 'Hair Color', category: StyleCategory.HAIR_COLOR, optionsKey: 'HAIR_COLOR' },
    ],
  },
  {
    id: 'expression',
    label: 'Expression',
    icon: Smile,
    categories: [
      { key: 'EXPRESSION', title: 'Expression', category: StyleCategory.EXPRESSION, optionsKey: 'EXPRESSION' },
    ],
  },
  {
    id: 'makeup',
    label: 'Makeup',
    icon: Palette,
    categories: [
      { key: 'MAKEUP', title: 'Makeup Base', category: StyleCategory.MAKEUP, optionsKey: 'MAKEUP' },
    ],
  },
  {
    id: 'eyes',
    label: 'Eyes',
    icon: Eye,
    categories: [
      { key: 'EYES', title: 'Eyes & Contacts', category: StyleCategory.EYES, optionsKey: 'EYES' },
    ],
  },
  {
    id: 'lips',
    label: 'Lips',
    icon: Droplet,
    categories: [
      { key: 'LIPS', title: 'Lips', category: StyleCategory.LIPS, optionsKey: 'LIPS' },
    ],
  },
  {
    id: 'eyewear',
    label: 'Eyewear',
    icon: Glasses,
    categories: [
      { key: 'GLASSES', title: 'Eyewear', category: StyleCategory.ACCESSORIES, optionsKey: 'GLASSES' },
    ],
  },
  {
    id: 'headwear',
    label: 'Headwear',
    icon: Crown,
    categories: [
      { key: 'HEADWEAR', title: 'Headwear', category: StyleCategory.ACCESSORIES, optionsKey: 'HEADWEAR' },
    ],
  },
  {
    id: 'jewelry',
    label: 'Jewelry',
    icon: Gem,
    categories: [
      { key: 'PIERCINGS', title: 'Piercings', category: StyleCategory.ACCESSORIES, optionsKey: 'PIERCINGS' },
      { key: 'JEWELRY', title: 'Jewelry & Neckwear', category: StyleCategory.ACCESSORIES, optionsKey: 'JEWELRY' },
    ],
  },
  {
    id: 'extras',
    label: 'Extras',
    icon: Star,
    categories: [
      { key: 'FACE_EXTRAS', title: 'Face Art & Extras', category: StyleCategory.ACCESSORIES, optionsKey: 'FACE_EXTRAS' },
      { key: 'FACIAL_HAIR', title: 'Facial Hair', category: StyleCategory.FACIAL_HAIR, optionsKey: 'FACIAL_HAIR' },
    ],
  },
];

interface SidebarNavProps {
  selections: UserSelections;
  onSelect: (category: StyleCategory, value: string) => void;
  optionsMap: {
    HAIR: ExtendedStyleOption[];
    HAIR_LENGTH: ExtendedStyleOption[];
    HAIR_COLOR: ExtendedStyleOption[];
    EXPRESSION: ExtendedStyleOption[];
    MAKEUP: ExtendedStyleOption[];
    EYES: ExtendedStyleOption[];
    LIPS: ExtendedStyleOption[];
    GLASSES: ExtendedStyleOption[];
    PIERCINGS: ExtendedStyleOption[];
    HEADWEAR: ExtendedStyleOption[];
    JEWELRY: ExtendedStyleOption[];
    FACE_EXTRAS: ExtendedStyleOption[];
    FACIAL_HAIR: ExtendedStyleOption[];
  };
  disabled?: boolean;
  onPremiumClick?: () => void;
  onPanelOpenChange?: (isOpen: boolean) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ selections, onSelect, optionsMap, disabled = false, onPremiumClick, onPanelOpenChange }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Close panel when disabled
  useEffect(() => {
    if (disabled) {
      setActiveCategory(null);
    }
  }, [disabled]);

  // Notify parent when panel open state changes
  useEffect(() => {
    onPanelOpenChange?.(activeCategory !== null);
  }, [activeCategory, onPanelOpenChange]);

  // Reset scroll position when category changes
  useEffect(() => {
    if (activeCategory && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeCategory]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current && 
        !panelRef.current.contains(event.target as Node) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setActiveCategory(null);
      }
    };

    if (activeCategory) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeCategory]);

  // Get selection count for a category
  const getSelectionCount = (configItem: typeof CATEGORY_CONFIG[0]) => {
    let count = 0;
    configItem.categories.forEach(cat => {
      if (cat.category === StyleCategory.ACCESSORIES) {
        // Count accessories that match this category's options
        const optKey = cat.optionsKey as keyof typeof optionsMap;
        const options = optionsMap[optKey];
        const accessoryValues = options.map(o => o.value);
        count += (selections[StyleCategory.ACCESSORIES] as string[]).filter(v => accessoryValues.includes(v)).length;
      } else {
        if (selections[cat.category]) count++;
      }
    });
    return count;
  };

  const activeCategoryConfig = CATEGORY_CONFIG.find(c => c.id === activeCategory);

  return (
    <>
      {/* Sidebar Icons - Clean strip on mobile, buttons on desktop */}
      {/* On xl+ screens, align with max-w-6xl container start instead of viewport edge */}
      <div 
        ref={sidebarRef}
        className="fixed left-0 xl:left-[max(0px,calc((100vw-72rem)/2))] top-20 z-40 flex flex-col gap-0 sm:gap-1 bg-white border border-slate-200 xl:border-l xl:rounded-l-2xl rounded-r-2xl shadow-lg py-2 sm:py-3 px-1 sm:px-2"
      >
        {CATEGORY_CONFIG.map((config) => {
          const Icon = config.icon;
          const isActive = activeCategory === config.id;
          const isHovered = hoveredCategory === config.id;
          const count = getSelectionCount(config);
          
          return (
            <div key={config.id} className="relative">
              <button
                onClick={() => !disabled && setActiveCategory(isActive ? null : config.id)}
                onMouseEnter={() => setHoveredCategory(config.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                disabled={disabled}
                className={`
                  relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center sm:rounded-xl transition-all duration-200
                  ${disabled
                    ? 'text-slate-300 cursor-not-allowed'
                    : isActive 
                      ? 'bg-[#0F172A] text-white shadow-md rounded-lg' 
                      : 'text-slate-600 hover:text-slate-900 sm:bg-white sm:hover:bg-slate-100'
                  }
                `}
                aria-label={config.label}
              >
                <Icon size={18} className="sm:w-5 sm:h-5" strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Selection count badge */}
                {count > 0 && !isActive && !disabled && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#0F172A] text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
              
              {/* Tooltip - Hidden on mobile */}
              {isHovered && !isActive && (
                <div className={`hidden sm:block absolute left-full ml-3 top-1/2 -translate-y-1/2 ${disabled ? 'bg-slate-600' : 'bg-[#0F172A]'} text-white text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-50 pointer-events-none animate-in fade-in slide-in-from-left-2 duration-150`}>
                  {disabled ? 'Upload a photo first' : config.label}
                  {count > 0 && !disabled && <span className="ml-1.5 opacity-70">({count})</span>}
                  {/* Arrow */}
                  <div className={`absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent ${disabled ? 'border-r-slate-600' : 'border-r-[#0F172A]'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Slide-out Panel - Matches toolbar style, works on all screen sizes */}
      <div 
        ref={panelRef}
        className={`
          fixed left-[48px] sm:left-[60px] xl:left-[calc(max(48px,calc((100vw-72rem)/2+60px)))] top-20 bottom-4 z-30 w-[calc(100vw-64px)] sm:w-80
          bg-white border border-slate-200 rounded-2xl shadow-xl
          transition-all duration-300 ease-out overflow-hidden
          ${activeCategory ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}
        `}
      >
        {/* Panel Header */}
        {activeCategoryConfig && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">{activeCategoryConfig.label}</h3>
              <button
                onClick={() => setActiveCategory(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>

            {/* Panel Content */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              {activeCategoryConfig.categories.map((cat) => {
                const optKey = (cat.optionsKey || cat.key) as keyof typeof optionsMap;
                const options = optionsMap[optKey];
                const isMultiSelect = cat.category === StyleCategory.ACCESSORIES;
                
                return (
                  <StyleSelector
                    key={cat.key}
                    title={cat.title}
                    category={cat.category}
                    options={options}
                    selections={selections}
                    onSelect={onSelect}
                    multiSelect={isMultiSelect}
                    onPremiumClick={onPremiumClick}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop when panel is open - works on all screen sizes */}
      {activeCategory && (
        <div 
          className="fixed inset-0 top-16 backdrop-blur-sm bg-white/30 z-20"
          onClick={() => setActiveCategory(null)}
        />
      )}
    </>
  );
};

export default SidebarNav;
