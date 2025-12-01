import React from 'react';
import { StyleOption, StyleCategory, UserSelections } from '../types';
import { Check } from 'lucide-react';

interface StyleSelectorProps {
  title: string;
  category: StyleCategory;
  options: StyleOption[];
  selections: UserSelections;
  onSelect: (category: StyleCategory, value: string) => void;
  multiSelect?: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  title,
  category,
  options,
  selections,
  onSelect,
  multiSelect = false
}) => {
  const currentSelection = selections[category];

  const isSelected = (value: string) => {
    if (multiSelect && Array.isArray(currentSelection)) {
      return currentSelection.includes(value);
    }
    return currentSelection === value;
  };

  const handleSelect = (value: string) => {
    onSelect(category, value);
  };

  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        {title}
      </h4>
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const active = isSelected(option.value);
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.value)}
              className={`
                relative min-h-[44px] px-3 py-2.5 rounded-xl text-left transition-all duration-150 
                flex items-center active:scale-[0.97]
                ${active 
                  ? 'bg-slate-100' 
                  : 'bg-transparent hover:bg-slate-100'
                }
              `}
            >
              <span className={`block text-sm font-medium leading-snug pr-5 ${active ? 'text-slate-900' : 'text-slate-700'}`}>
                {option.label}
              </span>
              {active && (
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