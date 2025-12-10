import React, { useState } from 'react';
import { Wrench, Coins, Unlock, RotateCcw, ChevronUp, ChevronDown, Plus, Minus, Shield, FlaskConical } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const DevToolbar: React.FC = () => {
  const { user, isTestUser, isAdmin, simulatePurchase, resetTestUser, features } = useUser();
  const [isExpanded, setIsExpanded] = useState(true);

  // Only show for test user or admin
  if (!user || (!isTestUser && !isAdmin)) return null;

  const addCoins = (amount: number) => {
    if (isTestUser) {
      simulatePurchase(amount);
    }
  };

  const removeCoins = (amount: number) => {
    if (isTestUser && user.glamCoins >= amount) {
      // We need to add negative coins - but our function only adds
      // Let's create a workaround by calling simulatePurchase with current - amount
      simulatePurchase(-amount);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[90]">
      {/* Collapsed indicator */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all shadow-lg
          ${isAdmin 
            ? 'bg-red-600 text-white hover:bg-red-700' 
            : 'bg-violet-600 text-white hover:bg-violet-700'
          }
        `}
      >
        {isAdmin ? <Shield size={16} /> : <FlaskConical size={16} />}
        <span>{isAdmin ? 'Admin Mode' : 'Dev Tools'}</span>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {/* Expanded toolbar */}
      {isExpanded && (
        <div className="mt-2 bg-slate-900 rounded-xl p-4 shadow-2xl min-w-[280px] animate-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
            <Wrench size={18} className="text-slate-400" />
            <span className="font-semibold text-white">
              {isAdmin ? 'Admin Dashboard' : 'Developer Tools'}
            </span>
          </div>

          {/* User Info */}
          <div className="mb-4 p-3 bg-slate-800 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Signed in as</div>
            <div className="text-white font-medium truncate">{user.email}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-medium
                ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 
                  user.role === 'test' ? 'bg-violet-500/20 text-violet-400' : 
                  'bg-blue-500/20 text-blue-400'}
              `}>
                {user.role.toUpperCase()}
              </span>
              {user.isSubscribed && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                  PRO
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Coins size={14} />
                <span className="text-xs">GlamCoins</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {user.role === 'admin' ? '∞' : user.glamCoins}
              </div>
            </div>
            <div className="p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Unlock size={14} />
                <span className="text-xs">Full Access</span>
              </div>
              <div className="text-lg font-bold text-white">
                {user.hasPurchased ? 'Unlocked' : 'Locked'}
              </div>
            </div>
          </div>

          {/* Test User Controls */}
          {isTestUser && (
            <div className="space-y-3">
              {/* Coin Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 flex-shrink-0">Coins:</span>
                <div className="flex-1 flex gap-1">
                  <button
                    onClick={() => removeCoins(1)}
                    disabled={user.glamCoins <= 0}
                    className="flex-1 px-3 py-1.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <Minus size={14} /> 1
                  </button>
                  <button
                    onClick={() => addCoins(1)}
                    className="flex-1 px-3 py-1.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <Plus size={14} /> 1
                  </button>
                  <button
                    onClick={() => addCoins(5)}
                    className="flex-1 px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <Plus size={14} /> 5
                  </button>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetTestUser}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw size={14} />
                Reset to Defaults
              </button>
            </div>
          )}

          {/* Admin Info */}
          {isAdmin && (
            <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-center">
              <p className="text-red-400 text-sm">
                Full access enabled. All restrictions bypassed.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-slate-700 text-center">
            <span className="text-xs text-slate-500">
              Press Esc or click outside to minimize
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevToolbar;
