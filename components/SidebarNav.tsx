import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { useFavorites } from '../contexts/FavoritesContext';
import { GLASSES_OPTIONS } from '../constants';

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
      { key: 'EYE_MAKEUP', title: 'Eye Makeup', category: StyleCategory.EYES, optionsKey: 'EYE_MAKEUP' },
      { key: 'EYE_COLOR', title: 'Eye Color / Contacts', category: StyleCategory.EYES, optionsKey: 'EYE_COLOR' },
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

interface SidebarNavProps {
  selections: UserSelections;
  onSelect: (category: StyleCategory, value: string, singleSelect?: boolean) => void;
  optionsMap: {
    HAIR: StyleOption[];
    HAIR_LENGTH: StyleOption[];
    HAIR_COLOR: StyleOption[];
    EXPRESSION: StyleOption[];
    MAKEUP: StyleOption[];
    EYES: StyleOption[];
    EYE_MAKEUP: StyleOption[];
    EYE_COLOR: StyleOption[];
    LIPS: StyleOption[];
    GLASSES: StyleOption[];
    PIERCINGS: StyleOption[];
    HEADWEAR: StyleOption[];
    JEWELRY: StyleOption[];
    FACE_EXTRAS: StyleOption[];
    FACIAL_HAIR: StyleOption[];
  };
  disabled?: boolean;
  onPanelOpenChange?: (isOpen: boolean) => void;
  user?: { id: string } | null;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ selections, onSelect, optionsMap, disabled = false, onPanelOpenChange, user }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { favoriteStyleOptionIds, isFavorited, toggleFavorite } = useFavorites();

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

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (activeCategory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeCategory]);

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

  // Build favorites grouped by category label for the panel display
  const favoritesGrouped = useMemo(() => {
    if (!user || favoriteStyleOptionIds.length === 0) return [];
    const allOptions: StyleOption[] = Object.values(optionsMap).flat();
    const groups: { groupLabel: string; options: StyleOption[] }[] = [];
    const groupOrder = [
      { label: 'Hair Style', keys: ['HAIR'] },
      { label: 'Hair Length', keys: ['HAIR_LENGTH'] },
      { label: 'Hair Color', keys: ['HAIR_COLOR'] },
      { label: 'Expression', keys: ['EXPRESSION'] },
      { label: 'Makeup', keys: ['MAKEUP'] },
      { label: 'Eye Makeup', keys: ['EYE_MAKEUP', 'EYE_COLOR'] },
      { label: 'Lips', keys: ['LIPS'] },
      { label: 'Eyewear', keys: ['GLASSES'] },
      { label: 'Headwear', keys: ['HEADWEAR'] },
      { label: 'Jewelry & Piercings', keys: ['PIERCINGS', 'JEWELRY'] },
      { label: 'Face Art & Extras', keys: ['FACE_EXTRAS'] },
      { label: 'Facial Hair', keys: ['FACIAL_HAIR'] },
    ];
    for (const group of groupOrder) {
      const groupOptions: StyleOption[] = [];
      for (const key of group.keys) {
        const opts = optionsMap[key as keyof typeof optionsMap] || [];
        for (const opt of opts) {
          if (favoriteStyleOptionIds.includes(opt.id)) {
            groupOptions.push(opt);
          }
        }
      }
      if (groupOptions.length > 0) {
        groups.push({ groupLabel: group.label, options: groupOptions });
      }
    }
    // Catch any favorited options not in the above groups
    const coveredIds = new Set(groups.flatMap(g => g.options.map(o => o.id)));
    const uncovered = allOptions.filter(o => favoriteStyleOptionIds.includes(o.id) && !coveredIds.has(o.id));
    if (uncovered.length > 0) groups.push({ groupLabel: 'Other', options: uncovered });
    return groups;
  }, [favoriteStyleOptionIds, optionsMap, user]);

  // Get selection count for a category
  const getSelectionCount = (configItem: typeof CATEGORY_CONFIG[0]) => {
    let count = 0;
    const countedCategories = new Set<StyleCategory>();
    configItem.categories.forEach(cat => {
      if (cat.category === StyleCategory.ACCESSORIES) {
        // Count accessories that match this category's options
        const optKey = cat.optionsKey as keyof typeof optionsMap;
        const options = optionsMap[optKey];
        const accessoryValues = options.map(o => o.value);
        count += (selections[StyleCategory.ACCESSORIES] as string[]).filter(v => accessoryValues.includes(v)).length;
      } else {
        // Avoid double-counting when multiple sub-sections share the same category (e.g. EYE_MAKEUP + EYE_COLOR both use StyleCategory.EYES)
        if (!countedCategories.has(cat.category) && selections[cat.category]) {
          count++;
          countedCategories.add(cat.category);
        }
      }
    });
    return count;
  };

  const activeCategoryConfig = CATEGORY_CONFIG.find(c => c.id === activeCategory);
  const isFavoritesActive = activeCategory === 'favorites';

  return (
    <>
      {/* Sidebar Icons - Clean strip on mobile, buttons on desktop */}
      {/* On xl+ screens, align with max-w-6xl container start instead of viewport edge */}
      <div 
        ref={sidebarRef}
        className="fixed left-0 xl:left-[max(0px,calc((100vw-72rem)/2))] top-20 z-40 flex flex-col gap-1 bg-white border border-slate-200 xl:border-l xl:rounded-l-2xl rounded-r-2xl shadow-lg py-2 px-1"
      >
        {/* Favorites button - only shown when user is signed in */}
        {user && (
          <div className="relative">
            <button
              onClick={() => !disabled && setActiveCategory(isFavoritesActive ? null : 'favorites')}
              disabled={disabled}
              style={disabled ? { cursor: 'not-allowed' } : undefined}
              className={`
                relative w-14 min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-200 px-1 py-2.5
                ${disabled
                  ? 'text-slate-300'
                  : isFavoritesActive
                    ? 'bg-amber-400 text-white shadow-md'
                    : favoriteStyleOptionIds.length > 0
                      ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }
              `}
              aria-label="Favorites"
            >
              <Star size={18} strokeWidth={isFavoritesActive ? 2.5 : 2} fill={favoriteStyleOptionIds.length > 0 && !isFavoritesActive ? 'currentColor' : 'none'} />
              <span className={`text-[10px] leading-tight font-semibold ${
                disabled ? 'text-slate-300' : isFavoritesActive ? 'text-white' : favoriteStyleOptionIds.length > 0 ? 'text-amber-500' : 'text-slate-600'
              }`}>
                Faves
              </span>
              {/* Favorites count badge */}
              {favoriteStyleOptionIds.length > 0 && !isFavoritesActive && !disabled && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favoriteStyleOptionIds.length > 99 ? '99+' : favoriteStyleOptionIds.length}
                </span>
              )}
            </button>
          </div>
        )}

        {CATEGORY_CONFIG.map((config) => {
          const Icon = config.icon;
          const isActive = activeCategory === config.id;
          const count = getSelectionCount(config);
          
          return (
            <div key={config.id} className="relative">
              <button
                onClick={() => !disabled && setActiveCategory(isActive ? null : config.id)}
                disabled={disabled}
                style={disabled ? { cursor: 'not-allowed' } : undefined}
                className={`
                  relative w-14 min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-200 px-1 py-2.5
                  ${disabled
                    ? 'text-slate-300'
                    : isActive 
                      ? 'bg-[#0F172A] text-white shadow-md' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }
                `}
                aria-label={config.label}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] leading-tight font-semibold ${disabled ? 'text-slate-300' : isActive ? 'text-white' : 'text-slate-600'}`}>
                  {config.label}
                </span>
                
                {/* Selection count badge */}
                {count > 0 && !isActive && !disabled && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0F172A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Slide-out Panel - Matches toolbar style, works on all screen sizes */}
      {/* Animation: starts from behind sidebar (left-0) and slides out to its final position */}
      <div 
        ref={panelRef}
        className={`
          fixed top-20 bottom-4 w-[calc(100vw-72px)] sm:w-80
          bg-white border border-slate-200 rounded-2xl shadow-xl
          transition-all duration-300 ease-out overflow-hidden
          ${activeCategory 
            ? 'left-[64px] sm:left-[68px] xl:left-[calc(max(64px,calc((100vw-72rem)/2+68px)))] z-30 opacity-100' 
            : 'left-0 xl:left-[max(0px,calc((100vw-72rem)/2))] z-30 opacity-0 pointer-events-none'}
        `}
      >
        {/* Favorites Panel */}
        {isFavoritesActive && user && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Star size={16} className="text-amber-400" fill="currentColor" />
                Favorites
              </h3>
              <button
                onClick={() => setActiveCategory(null)}
                className="w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              {favoritesGrouped.length === 0 ? (
                <div className="text-center py-10">
                  <Star size={40} className="mx-auto mb-3 text-slate-200" />
                  <p className="text-sm font-semibold text-slate-600">No favorites yet</p>
                  <p className="text-xs text-slate-400 mt-1">Tap the ★ on any style to save it here</p>
                </div>
              ) : (
                favoritesGrouped.map((group) => (
                  <div key={group.groupLabel} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">{group.groupLabel}</h4>
                    </div>
                    <div className="flex flex-col gap-2">
                      {group.options.map((option) => {
                        const isEyewear = GLASSES_OPTIONS.some(g => g.id === option.id);
                        const isAccessory = option.category === StyleCategory.ACCESSORIES;
                        const isSelected = isAccessory
                          ? (selections[StyleCategory.ACCESSORIES] as string[]).includes(option.value)
                          : selections[option.category] === option.value;

                        return (
                          <div key={option.id} className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                if (isAccessory && !isEyewear) {
                                  onSelect(option.category, option.value, false);
                                } else {
                                  onSelect(option.category, option.value, isEyewear);
                                }
                              }}
                              className={`
                                relative flex-1 min-h-[44px] px-3 py-2.5 rounded-xl text-left transition-all duration-150
                                flex items-center active:scale-[0.97] focus:outline-none
                                ${isSelected ? 'bg-slate-100' : 'bg-transparent hover:bg-slate-100'}
                              `}
                            >
                              <span className={`block text-sm font-medium leading-snug pr-6 ${
                                isSelected ? 'text-slate-900' : 'text-slate-700'
                              }`}>
                                {option.label}
                              </span>
                              {isSelected && (
                                <div className="absolute top-1/2 -translate-y-1/2 right-2.5 w-4 h-4 bg-[#0F172A] rounded-full flex items-center justify-center">
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                              )}
                            </button>
                            <button
                              onClick={() => toggleFavorite(option.id)}
                              className="flex-shrink-0 w-10 h-[44px] rounded-xl flex items-center justify-center transition-all text-amber-400 hover:bg-amber-50"
                              aria-label="Remove from favorites"
                            >
                              <Star size={16} fill="currentColor" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Regular Category Panel */}
        {activeCategoryConfig && !isFavoritesActive && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">{activeCategoryConfig.label}</h3>
              <button
                onClick={() => setActiveCategory(null)}
                className="w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
                    isFavorited={user ? isFavorited : undefined}
                    onToggleFavorite={user ? toggleFavorite : undefined}
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
