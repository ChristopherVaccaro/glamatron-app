import React from 'react';
import { StyleOption, StyleCategory, UserSelections } from '../types';
import { Check, Star } from 'lucide-react';

interface StyleSelectorProps {
  title: string;
  category: StyleCategory;
  options: StyleOption[];
  selections: UserSelections;
  onSelect: (category: StyleCategory, value: string) => void;
  multiSelect?: boolean;
  isFavorited?: (styleOptionId: string) => boolean;
  onToggleFavorite?: (styleOptionId: string) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  title,
  category,
  options,
  selections,
  onSelect,
  multiSelect = false,
  isFavorited,
  onToggleFavorite,
}) => {
  const currentSelection = selections[category];

  const isSelected = (value: string) => {
    if (Array.isArray(currentSelection)) {
      return currentSelection.includes(value);
    }
    return currentSelection === value;
  };

  const handleSelect = (option: StyleOption) => {
    onSelect(category, option.value);
  };

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          {title}
        </h4>
      </div>
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const active = isSelected(option.value);
          const isFav = isFavorited?.(option.id) || false;
          
          return (
            <div key={option.id} className="flex items-center gap-1">
              <button
                onClick={() => handleSelect(option)}
                className={`
                  relative flex-1 min-h-[44px] px-3 py-2.5 rounded-xl text-left transition-all duration-150 
                  flex items-center active:scale-[0.97]
                  focus:outline-none
                  ${active 
                    ? 'bg-slate-100' 
                    : 'bg-transparent hover:bg-slate-100'
                  }
                `}
              >
                <span className={`block text-sm font-medium leading-snug pr-6 ${
                  active 
                    ? 'text-slate-900' 
                    : 'text-slate-700'
                }`}>
                  {option.label}
                </span>
                
                {/* Checkmark for selected options */}
                {active && (
                  <div className="absolute top-1/2 -translate-y-1/2 right-2.5 w-4 h-4 bg-[#0F172A] rounded-full flex items-center justify-center">
                    <Check size={10} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
              
              {/* Star toggle button */}
              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(option.id);
                  }}
                  className={`flex-shrink-0 w-10 h-[44px] rounded-xl flex items-center justify-center transition-all ${
                    isFav
                      ? 'text-amber-400 hover:bg-amber-50'
                      : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                  }`}
                  aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star size={16} fill={isFav ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StyleSelector;