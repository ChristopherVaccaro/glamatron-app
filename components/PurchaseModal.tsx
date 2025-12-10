import React from 'react';
import { X, Coins, Sparkles, Unlock } from 'lucide-react';
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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Coins size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Get More GlamCoins
          </h2>
          <p className="text-slate-500 mt-1">
            Power your style transformations
          </p>
          {user && (
            <p className="text-sm text-slate-400 mt-2">
              Current balance: <span className="font-semibold text-amber-600">{user.glamCoins} GlamCoins</span>
            </p>
          )}
        </div>

        {/* Test user indicator */}
        {isTestUser && (
          <div className="mx-8 mb-4 px-4 py-2 bg-violet-50 border border-violet-200 rounded-lg text-center">
            <span className="text-sm text-violet-700">
              🧪 <strong>Test Mode:</strong> Purchases are simulated
            </span>
          </div>
        )}

        {/* Unlock message for users who haven't purchased yet */}
        {!hasFullAccess && (
          <div className="mx-8 mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Unlock size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800">
                  Unlock all styles & options!
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Your first purchase unlocks the full style library with premium looks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-8 pb-8">
          {/* GlamCoin Packages */}
          <div className="grid grid-cols-3 gap-3">
            {GLAMCOIN_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePurchaseCoins(pkg)}
                className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                  pkg.popular 
                    ? 'border-amber-400 bg-amber-50 shadow-lg shadow-amber-500/10' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-400 text-white text-xs font-bold rounded-full whitespace-nowrap flex items-center gap-1">
                    <Sparkles size={10} />
                    BEST
                  </div>
                )}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    pkg.popular ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Coins size={20} />
                  </div>
                  <div className="font-bold text-lg text-slate-900">{pkg.coins}</div>
                  <div className="text-xs text-slate-400">{pkg.pricePerCoin}/coin</div>
                  <div className={`font-semibold ${pkg.popular ? 'text-amber-600' : 'text-slate-700'}`}>
                    {pkg.price}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-400 mt-6">
            1 GlamCoin = 1 AI transformation. GlamCoins never expire.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
