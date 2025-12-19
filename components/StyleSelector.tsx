import React from 'react';
import { StyleOption, StyleCategory, UserSelections } from '../types';
import { Check, Lock } from 'lucide-react';
import { ExtendedStyleOption } from '../utils/styleAccess';

interface StyleSelectorProps {
  title: string;
  category: StyleCategory;
  options: (StyleOption | ExtendedStyleOption)[];
  selections: UserSelections;
  onSelect: (category: StyleCategory, value: string) => void;
  multiSelect?: boolean;
  onPremiumClick?: () => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  title,
  category,
  options,
  selections,
  onSelect,
  multiSelect = false,
  onPremiumClick
}) => {
  const currentSelection = selections[category];

  const isSelected = (value: string) => {
    if (Array.isArray(currentSelection)) {
      return currentSelection.includes(value);
    }
    return currentSelection === value;
  };

  const handleSelect = (option: StyleOption | ExtendedStyleOption) => {
    // Check if option is locked (premium and user doesn't have access)
    const isLocked = 'isLocked' in option && option.isLocked;
    
    if (isLocked) {
      onPremiumClick?.();
      return;
    }
    
    onSelect(category, option.value);
  };

  // Count locked options for the header
  const lockedCount = options.filter(o => 'isLocked' in o && o.isLocked).length;

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          {title}
        </h4>
        {lockedCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Lock size={10} />
            <span>{lockedCount} premium</span>
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const active = isSelected(option.value);
          const isLocked = 'isLocked' in option && option.isLocked;
          
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className={`
                relative min-h-[44px] px-3 py-2.5 rounded-xl text-left transition-all duration-150 
                flex items-center active:scale-[0.97]
                focus:outline-none
                ${isLocked ? 'premium-locked cursor-pointer' : ''}
                ${active 
                  ? 'bg-slate-100' 
                  : 'bg-transparent hover:bg-slate-100'
                }
              `}
            >
              <span className={`block text-sm font-medium leading-snug pr-6 ${
                isLocked 
                  ? 'text-slate-400' 
                  : active 
                    ? 'text-slate-900' 
                    : 'text-slate-700'
              }`}>
                {option.label}
              </span>
              
              {/* Lock icon for locked premium options - muted color matching disabled text */}
              {isLocked && (
                <div className="absolute top-1/2 -translate-y-1/2 right-2.5 flex items-center justify-center">
                  <Lock size={14} className="text-slate-400" />
                </div>
              )}
              
              {/* Checkmark for selected options */}
              {active && !isLocked && (
                <div className="absolute top-1/2 -translate-y-1/2 right-2.5 w-4 h-4 bg-[#0F172A] rounded-full flex items-center justify-center">
                  <Check size={10} className="text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StyleSelector;