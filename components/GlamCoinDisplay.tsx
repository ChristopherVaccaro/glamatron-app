import React from 'react';
import { Coins, Infinity } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface GlamCoinDisplayProps {
  onClick?: () => void;
}

const GlamCoinDisplay: React.FC<GlamCoinDisplayProps> = ({ onClick }) => {
  const { user, features } = useUser();

  if (!user) return null;

  const hasUnlimited = features.unlimitedGenerations;
  const isLowCoins = !hasUnlimited && user.glamCoins <= 2 && user.glamCoins > 0;
  const isEmpty = !hasUnlimited && user.glamCoins === 0;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors group ${
        isLowCoins 
          ? 'bg-amber-50 hover:bg-amber-100 ring-1 ring-amber-200' 
          : isEmpty 
            ? 'bg-red-50 hover:bg-red-100 ring-1 ring-red-200'
            : 'bg-slate-100 hover:bg-slate-200'
      }`}
    >
      {/* GlamCoin display */}
      <div className="flex items-center gap-1.5">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
          isLowCoins 
            ? 'bg-gradient-to-br from-amber-400 to-amber-600 animate-pulse' 
            : isEmpty
              ? 'bg-gradient-to-br from-red-400 to-red-600'
              : 'bg-gradient-to-br from-amber-400 to-orange-500'
        }`}>
          <Coins size={12} className="text-white" />
        </div>
        <span className={`font-semibold ${
          isEmpty ? 'text-red-600' : isLowCoins ? 'text-amber-700' : 'text-slate-700'
        }`}>
          {hasUnlimited ? (
            <span className="flex items-center gap-0.5">
              <Infinity size={16} className="text-amber-500" />
            </span>
          ) : (
            user.glamCoins
          )}
        </span>
        {isLowCoins && (
          <span className="text-xs text-amber-600 font-medium">Low</span>
        )}
        {isEmpty && (
          <span className="text-xs text-red-500 font-medium">Empty!</span>
        )}
      </div>

      {/* Add more indicator */}
      {!hasUnlimited && (
        <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
          +
        </span>
      )}
    </button>
  );
};

export default GlamCoinDisplay;
