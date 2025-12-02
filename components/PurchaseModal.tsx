import React from 'react';
import { X, Coins, Crown, Sparkles, Check, Zap } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COIN_PACKAGES = [
  { id: 'pack_5', coins: 5, price: '$2.99', popular: false },
  { id: 'pack_15', coins: 15, price: '$6.99', popular: true },
  { id: 'pack_50', coins: 50, price: '$14.99', popular: false },
];

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose }) => {
  const { user, isTestUser, simulatePurchase, simulateSubscribe } = useUser();

  if (!isOpen) return null;

  const handlePurchaseCoins = (coins: number) => {
    if (isTestUser) {
      simulatePurchase(coins);
      onClose();
    } else {
      // TODO: Integrate with Stripe or payment provider
      console.log('Purchase flow for', coins, 'coins');
      alert('Payment integration coming soon! For now, sign in as testuser@glamatron.app to simulate purchases.');
    }
  };

  const handleSubscribe = () => {
    if (isTestUser) {
      simulateSubscribe();
      onClose();
    } else {
      // TODO: Integrate with Stripe subscription
      console.log('Subscribe flow');
      alert('Subscription integration coming soon! For now, sign in as testuser@glamatron.app to simulate subscriptions.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
            <Coins size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {user?.glamCoins === 0 ? 'Out of GlamCoins!' : 'Get More GlamCoins'}
          </h2>
          <p className="text-slate-500 mt-1">
            Power your transformations with GlamCoins
          </p>
          {user && (
            <p className="text-sm text-slate-400 mt-2">
              Current balance: <span className="font-semibold text-amber-600">{user.glamCoins} coins</span>
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

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Subscription Option */}
          <div className="mb-6">
            <button
              onClick={handleSubscribe}
              className="w-full p-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white hover:shadow-lg hover:shadow-violet-500/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Crown size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold flex items-center gap-2">
                      Glamatron Pro
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">BEST VALUE</span>
                    </div>
                    <div className="text-sm text-white/80">Unlimited generations + all styles</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">$9.99</div>
                  <div className="text-xs text-white/70">/month</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="grid grid-cols-2 gap-2 text-sm text-left">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-green-300" />
                    <span>Unlimited generations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-green-300" />
                    <span>All style options</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-green-300" />
                    <span>Priority processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-green-300" />
                    <span>Early access features</span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">or buy coin packs</span>
            </div>
          </div>

          {/* Coin Packages */}
          <div className="grid grid-cols-3 gap-3">
            {COIN_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePurchaseCoins(pkg.coins)}
                className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                  pkg.popular 
                    ? 'border-amber-400 bg-amber-50 shadow-lg shadow-amber-500/10' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-400 text-white text-xs font-bold rounded-full whitespace-nowrap">
                    POPULAR
                  </div>
                )}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    pkg.popular ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Coins size={20} />
                  </div>
                  <div className="font-bold text-lg text-slate-900">{pkg.coins}</div>
                  <div className="text-sm text-slate-500">coins</div>
                  <div className={`font-semibold ${pkg.popular ? 'text-amber-600' : 'text-slate-700'}`}>
                    {pkg.price}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-400 mt-6">
            1 GlamCoin = 1 AI transformation. Coins never expire.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
