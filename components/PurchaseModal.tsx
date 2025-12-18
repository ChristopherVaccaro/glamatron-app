import React from 'react';
import { X, Coins, Sparkles, Unlock, Zap, Shield, Clock } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// GlamCoin packages with Stripe Payment Links
// URLs are configured in environment variables to support test/live modes
const GLAMCOIN_PACKAGES = [
  { 
    id: 'pack_5', 
    coins: 5, 
    price: '$2.99', 
    pricePerCoin: '$0.60', 
    popular: false,
    stripeUrl: import.meta.env.VITE_STRIPE_LINK_5_COINS || 'https://buy.stripe.com/test_placeholder_5'
  },
  { 
    id: 'pack_10', 
    coins: 10, 
    price: '$4.99', 
    pricePerCoin: '$0.50', 
    popular: true,
    stripeUrl: import.meta.env.VITE_STRIPE_LINK_10_COINS || 'https://buy.stripe.com/test_placeholder_10'
  },
  { 
    id: 'pack_25', 
    coins: 25, 
    price: '$9.99', 
    pricePerCoin: '$0.40', 
    popular: false,
    stripeUrl: import.meta.env.VITE_STRIPE_LINK_25_COINS || 'https://buy.stripe.com/test_placeholder_25'
  },
];

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose }) => {
  const { user, isTestUser, simulatePurchase, features } = useUser();

  if (!isOpen) return null;

  const handlePurchaseCoins = (pkg: typeof GLAMCOIN_PACKAGES[0]) => {
    if (isTestUser) {
      // Test user: simulate purchase locally
      simulatePurchase(pkg.coins);
      onClose();
    } else {
      // Real user: redirect to Stripe Payment Link
      // Add client_reference_id for tracking (user ID)
      const url = new URL(pkg.stripeUrl);
      if (user?.id) {
        url.searchParams.set('client_reference_id', user.id);
      }
      // Open in same window - Stripe will redirect back after payment
      window.location.href = url.toString();
    }
  };

  // Check if user has full access (has purchased before)
  const hasFullAccess = features.fullStyleLibrary;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-700">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header with gradient accent */}
        <div className="relative px-8 pt-8 pb-6 text-center">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/20 blur-3xl" />
          
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30 rotate-3 hover:rotate-0 transition-transform">
              <Coins size={36} className="text-white drop-shadow-lg" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Get More GlamCoins
            </h2>
            <p className="text-slate-400 mt-1">
              Power your style transformations
            </p>
            {user && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-full">
                <Coins size={16} className="text-amber-400" />
                <span className="text-sm text-slate-300">Balance:</span>
                <span className="font-bold text-amber-400">{user.glamCoins}</span>
              </div>
            )}
          </div>
        </div>

        {/* Test user indicator */}
        {isTestUser && (
          <div className="mx-6 mb-4 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-lg text-center">
            <span className="text-sm text-violet-300">
              🧪 <strong>Test Mode:</strong> Purchases are simulated
            </span>
          </div>
        )}

        {/* Unlock message for users who haven't purchased yet */}
        {!hasFullAccess && (
          <div className="mx-6 mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Unlock size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-300">
                  Unlock all styles & options!
                </p>
                <p className="text-xs text-emerald-400/70 mt-0.5">
                  Your first purchase unlocks the full style library with premium looks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6">
          {/* GlamCoin Packages */}
          <div className="grid grid-cols-3 gap-3">
            {GLAMCOIN_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePurchaseCoins(pkg)}
                className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 hover:-translate-y-1 ${
                  pkg.popular 
                    ? 'border-amber-400 bg-gradient-to-b from-amber-500/20 to-amber-600/10 shadow-lg shadow-amber-500/20' 
                    : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full whitespace-nowrap flex items-center gap-1 shadow-lg">
                    <Sparkles size={10} />
                    BEST VALUE
                  </div>
                )}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    pkg.popular 
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30' 
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    <Coins size={22} />
                  </div>
                  <div className={`font-bold text-2xl ${pkg.popular ? 'text-white' : 'text-slate-200'}`}>{pkg.coins}</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full ${
                    pkg.popular ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-400'
                  }`}>{pkg.pricePerCoin}/coin</div>
                  <div className={`font-bold text-lg mt-1 ${pkg.popular ? 'text-amber-400' : 'text-slate-300'}`}>
                    {pkg.price}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Benefits */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1 p-2">
              <Zap size={16} className="text-amber-400" />
              <span className="text-xs text-slate-400 text-center">Instant Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <Clock size={16} className="text-emerald-400" />
              <span className="text-xs text-slate-400 text-center">Never Expire</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <Shield size={16} className="text-blue-400" />
              <span className="text-xs text-slate-400 text-center">Secure Payment</span>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-500 mt-4 pt-4 border-t border-slate-700">
            1 GlamCoin = 1 transformation
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
