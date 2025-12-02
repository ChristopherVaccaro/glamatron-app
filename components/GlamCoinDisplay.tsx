import React from 'react';
import { Coins, Crown, Infinity } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface GlamCoinDisplayProps {
  onClick?: () => void;
}

const GlamCoinDisplay: React.FC<GlamCoinDisplayProps> = ({ onClick }) => {
  const { user, isAdmin, features } = useUser();

  if (!user) return null;

  const hasUnlimited = features.unlimitedGenerations;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors group"
    >
      {/* Subscription badge */}
      {user.isSubscribed && (
        <div className="flex items-center gap-1 pr-2 border-r border-slate-300">
          <Crown size={14} className="text-violet-500" />
          <span className="text-xs font-medium text-violet-600">PRO</span>
        </div>
      )}
      
      {/* Coin display */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
          <Coins size={12} className="text-white" />
        </div>
        <span className="font-semibold text-slate-700">
          {hasUnlimited ? (
            <span className="flex items-center gap-0.5">
              <Infinity size={16} className="text-amber-500" />
            </span>
          ) : (
            user.glamCoins
          )}
        </span>
        {!hasUnlimited && user.glamCoins <= 2 && user.glamCoins > 0 && (
          <span className="text-xs text-amber-600 font-medium">Low</span>
        )}
        {!hasUnlimited && user.glamCoins === 0 && (
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
