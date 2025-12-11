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
  ChevronLeft,
  Brush,
  Camera,
  Flame,
  Sparkles,
  Image,
  PartyPopper,
  Flower2,
  Wand2,
  Check
} from 'lucide-react';
import { StyleCategory, StyleOption, UserSelections } from '../types';
import StyleSelector from './StyleSelector';
import { ExtendedStyleOption } from '../utils/styleAccess';
import { STYLE_FILTER_CATEGORIES, StyleFilter, StyleFilterCategory } from '../styleConstants';

// App mode type
export type AppMode = 'looks' | 'styles';

// Category configuration for LOOKS mode (original Glamatron)
const LOOKS_CATEGORY_CONFIG = [
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
      { key: 'GLASSES', title: 'Eyewear', category: StyleCategory.ACCESSORIES, optionsKey: 'GLASSES', singleSelect: true },
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

// Icon mapping for style categories
const STYLE_CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  'artistic': Brush,
  'photo': Camera,
  'trendy': Flame,
  'seasonal': Sparkles,
  'fun': PartyPopper,
  'aesthetic': Flower2,
  'portrait': Image,
};

interface SidebarNavProps {
  selections: UserSelections;
  onSelect: (category: StyleCategory, value: string, singleSelect?: boolean) => void;
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
  // New props for dual-mode
  appMode: AppMode;
  onAppModeChange: (mode: AppMode) => void;
  selectedStyleFilter: StyleFilter | null;
  onStyleFilterSelect: (filter: StyleFilter) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ 
  selections, 
  onSelect, 
  optionsMap, 
  disabled = false, 
  onPremiumClick, 
  onPanelOpenChange,
  appMode,
  onAppModeChange,
  selectedStyleFilter,
  onStyleFilterSelect
}) => {
  const isStylesMode = appMode === 'styles';
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

  // Get selection count for a looks category
  const getSelectionCount = (configItem: typeof LOOKS_CATEGORY_CONFIG[0]) => {
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

  const activeCategoryConfig = LOOKS_CATEGORY_CONFIG.find(c => c.id === activeCategory);
  const activeStyleCategory = STYLE_FILTER_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <>
      {/* Sidebar Icons - Clean strip on mobile, buttons on desktop */}
      {/* On xl+ screens, align with max-w-6xl container start instead of viewport edge */}
      <div 
        ref={sidebarRef}
        className="fixed left-0 xl:left-[max(0px,calc((100vw-72rem)/2))] top-20 z-40 flex flex-col gap-0 sm:gap-1 bg-white border border-slate-200 xl:border-l xl:rounded-l-2xl rounded-r-2xl shadow-lg py-2 sm:py-3 px-1 sm:px-2"
      >
        {/* Mode Toggle Switch at Top */}
        <div className="relative group mb-2 pb-2 border-b border-slate-200">
          <button
            onClick={() => {
              setActiveCategory(null); // Close panel when switching modes
              onAppModeChange(isStylesMode ? 'looks' : 'styles');
            }}
            className={`w-full px-1.5 py-1.5 sm:px-2 sm:py-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
              isStylesMode
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isStylesMode ? <Sparkles size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Wand2 size={16} className="sm:w-[18px] sm:h-[18px]" />}
          </button>
          {/* Tooltip */}
          <div className="hidden sm:block absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#0F172A] text-white text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {isStylesMode ? 'Switch to Looks' : 'Switch to Styles'}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-[#0F172A]" />
          </div>
        </div>

        {/* LOOKS MODE: Original categories */}
        {!isStylesMode && LOOKS_CATEGORY_CONFIG.map((config) => {
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
                style={disabled ? { cursor: 'not-allowed' } : undefined}
                className={`
                  relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center sm:rounded-xl transition-all duration-200
                  ${disabled
                    ? 'text-slate-300'
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

        {/* STYLES MODE: Style filter categories */}
        {isStylesMode && STYLE_FILTER_CATEGORIES.map((category) => {
          const Icon = STYLE_CATEGORY_ICONS[category.id] || Brush;
          const isActive = activeCategory === category.id;
          const isHovered = hoveredCategory === category.id;
          const hasSelection = selectedStyleFilter && category.filters.some(f => f.id === selectedStyleFilter.id);
          
          return (
            <div key={category.id} className="relative">
              <button
                onClick={() => !disabled && setActiveCategory(isActive ? null : category.id)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                disabled={disabled}
                style={disabled ? { cursor: 'not-allowed' } : undefined}
                className={`
                  relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center sm:rounded-xl transition-all duration-200
                  ${disabled
                    ? 'text-slate-300'
                    : isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/30 rounded-lg' 
                      : 'text-slate-600 hover:text-slate-900 sm:bg-white sm:hover:bg-purple-50'
                  }
                `}
                aria-label={category.name}
              >
                <Icon size={18} className="sm:w-5 sm:h-5" strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Selection indicator */}
                {hasSelection && !isActive && !disabled && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  </span>
                )}
              </button>
              
              {/* Tooltip - Hidden on mobile */}
              {isHovered && !isActive && (
                <div className={`hidden sm:block absolute left-full ml-3 top-1/2 -translate-y-1/2 ${disabled ? 'bg-slate-600' : 'bg-[#0F172A]'} text-white text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-50 pointer-events-none animate-in fade-in slide-in-from-left-2 duration-150`}>
                  {disabled ? 'Upload a photo first' : category.name}
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
        {/* LOOKS MODE: Panel Header & Content */}
        {!isStylesMode && activeCategoryConfig && (
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
                // Accessories are multi-select by default, unless explicitly marked as singleSelect
                const isSingleSelect = 'singleSelect' in cat && cat.singleSelect;
                const isMultiSelect = cat.category === StyleCategory.ACCESSORIES && !isSingleSelect;
                
                // Wrap onSelect to pass singleSelect flag for eyewear
                const handleSelect = (category: StyleCategory, value: string) => {
                  onSelect(category, value, isSingleSelect);
                };
                
                return (
                  <StyleSelector
                    key={cat.key}
                    title={cat.title}
                    category={cat.category}
                    options={options}
                    selections={selections}
                    onSelect={handleSelect}
                    multiSelect={isMultiSelect}
                    onPremiumClick={onPremiumClick}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* STYLES MODE: Panel Header & Content - Matching Looks mode styling */}
        {isStylesMode && activeStyleCategory && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">
                {activeStyleCategory.name}
              </h3>
              <button
                onClick={() => setActiveCategory(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>

            {/* Style Filters - Matching Looks mode StyleSelector styling */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {/* Section header like StyleSelector */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  {activeStyleCategory.name}
                </h4>
                <span className="text-xs text-slate-400">
                  {activeStyleCategory.filters.length} styles
                </span>
              </div>
              
              <div className="flex flex-col gap-2">
                {activeStyleCategory.filters.map((filter) => {
                  const isSelected = selectedStyleFilter?.id === filter.id;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => {
                        onStyleFilterSelect(filter);
                        setActiveCategory(null);
                      }}
                      className={`
                        relative min-h-[44px] px-3 py-2.5 rounded-xl text-left transition-all duration-150
                        flex items-center active:scale-[0.97]
                        ${isSelected 
                          ? 'bg-slate-100' 
                          : 'bg-transparent hover:bg-slate-100'
                        }
                      `}
                    >
                      <span className={`block text-sm font-medium leading-snug pr-6 ${
                        isSelected ? 'text-slate-900' : 'text-slate-700'
                      }`}>
                        {filter.name}
                      </span>
                      
                      {/* Checkmark for selected - matching Looks mode */}
                      {isSelected && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-2.5 w-4 h-4 bg-[#0F172A] rounded-full flex items-center justify-center">
                          <Check size={10} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
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
