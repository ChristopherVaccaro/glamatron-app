import React, { useState } from 'react';
import { StyleOption, StyleCategory, UserSelections } from '../types';
import { Check, ChevronDown } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);
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

  // Show only first 6 options on mobile unless expanded
  const INITIAL_SHOW = 6;
  const showExpandButton = options.length > INITIAL_SHOW;
  const displayedOptions = isExpanded ? options : options.slice(0, INITIAL_SHOW);

  // Count selected in this category
  const selectedCount = multiSelect 
    ? (currentSelection as string[]).filter(v => options.some(o => o.value === v)).length
    : (options.some(o => o.value === currentSelection) ? 1 : 0);

  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          {title}
          {selectedCount > 0 && (
            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded-full text-[10px] font-bold">
              {selectedCount}
            </span>
          )}
        </span>
        {((!multiSelect && currentSelection && options.some(o => o.value === currentSelection)) || 
          (multiSelect && selectedCount > 0)) && (
          <button 
            onClick={() => onSelect(category, multiSelect ? 'CLEAR_ALL' : '')}
            className="text-[10px] text-rose-500 hover:text-rose-600 font-medium normal-case px-2 py-1 -mr-2 rounded hover:bg-rose-50 transition-colors"
          >
            Reset
          </button>
        )}
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {displayedOptions.map((option) => {
          const active = isSelected(option.value);
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.value)}
              className={`
                relative min-h-[44px] px-3 py-2.5 rounded-xl border text-left transition-all duration-150 
                flex items-center active:scale-[0.97]
                ${active 
                  ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500 shadow-sm' 
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              <span className={`block text-sm font-medium leading-snug pr-5 ${active ? 'text-rose-700' : 'text-slate-700'}`}>
                {option.label}
              </span>
              {active && (
                <div className="absolute top-1/2 -translate-y-1/2 right-2.5 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
                  <Check size={10} className="text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Show More/Less Button */}
      {showExpandButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1 hover:bg-slate-50 rounded-lg transition-colors"
        >
          {isExpanded ? 'Show Less' : `Show ${options.length - INITIAL_SHOW} More`}
          <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
};

export default StyleSelector;