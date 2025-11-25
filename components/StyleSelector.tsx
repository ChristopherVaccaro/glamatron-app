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
    <div className="mb-6 last:mb-0">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
        {title}
        {((!multiSelect && currentSelection) || (multiSelect && (currentSelection as string[]).length > 0)) && (
          <button 
            onClick={() => onSelect(category, multiSelect ? 'CLEAR_ALL' : '')}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 normal-case"
          >
            Reset
          </button>
        )}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
        {options.map((option) => {
          const active = isSelected(option.value);
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.value)}
              className={`
                relative p-3 rounded-lg border text-left transition-all duration-200 group flex items-start
                ${active 
                  ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500 z-10' 
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }
              `}
            >
              <span className={`block text-xs font-medium leading-tight pr-4 ${active ? 'text-rose-700' : 'text-slate-700'}`}>
                {option.label}
              </span>
              {active && (
                <div className="absolute top-2 right-2 text-rose-500">
                  <Check size={14} />
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