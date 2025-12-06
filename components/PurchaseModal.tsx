import React, { useState } from 'react';
import { X, Coins, Crown, Check, Wand2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'subscribe' | 'coins';

const COIN_PACKAGES = [
  { id: 'pack_5', coins: 5, price: '$2.99', pricePerCoin: '$0.60', popular: false },
  { id: 'pack_15', coins: 15, price: '$6.99', pricePerCoin: '$0.47', popular: true },
  { id: 'pack_50', coins: 50, price: '$14.99', pricePerCoin: '$0.30', popular: false },
];

const SUBSCRIPTION_FEATURES = [
  '100 GlamCoins every month',
  'Full style library access',
  'Priority processing',
  'HD exports',
  'Cancel anytime',
];

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose }) => {
  const { user, isTestUser, simulatePurchase, simulateSubscribe, unsubscribe, features } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('subscribe');

  if (!isOpen) return null;

  const handlePurchaseCoins = (coins: number) => {
    if (isTestUser) {
      simulatePurchase(coins);
      onClose();
    } else {
      // TODO: Integrate with Stripe or payment provider
      console.log('Purchase flow for', coins, 'coins');
      alert('Payment integration coming soon!');
    }
  };

  const handleSubscribe = (planId: string) => {
    if (isTestUser) {
      simulateSubscribe();
      onClose();
    } else {
      // TODO: Integrate with Stripe subscriptions
      console.log('Subscribe to plan:', planId);
      alert('Subscription integration coming soon!');
    }
  };

  const handleUnsubscribe = () => {
    if (isTestUser) {
      unsubscribe();
      onClose();
    } else {
      // TODO: Integrate with Stripe subscription cancellation
      console.log('Cancel subscription');
      alert('Subscription cancellation coming soon!');
    }
  };

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
          <div className="w-16 h-16 mx-auto mb-4 bg-[#0F172A] rounded-full flex items-center justify-center shadow-lg shadow-slate-900/30">
            <Wand2 size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {user?.isSubscribed ? 'Manage Subscription' : 'Unlock Full Access'}
          </h2>
          <p className="text-slate-500 mt-1">
            {user?.isSubscribed 
              ? 'View your subscription or buy more coins'
              : 'Subscribe for premium styles or buy coins'
            }
          </p>
          {user && (
            <p className="text-sm text-slate-400 mt-2">
              Current balance: <span className="font-semibold text-amber-600">{user.glamCoins} coins</span>
              {user.isSubscribed && <span className="ml-2 text-emerald-600">• Subscribed</span>}
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

        {/* Tab Switcher */}
        <div className="mx-8 mb-6">
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('subscribe')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'subscribe'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Crown size={16} />
              Subscribe
            </button>
            <button
              onClick={() => setActiveTab('coins')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'coins'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Coins size={16} />
              Buy Coins
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {activeTab === 'subscribe' ? (
            <>
              {user?.isSubscribed ? (
                /* Already subscribed - show status and unsubscribe option */
                <div className="text-center">
                  <div className="p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl mb-4">
                    <div className="w-12 h-12 mx-auto mb-3 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Crown size={24} className="text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-emerald-800 mb-1">You're Subscribed!</h3>
                    <p className="text-sm text-emerald-600 mb-3">
                      You have full access to all premium styles and receive 100 GlamCoins monthly.
                    </p>
                    <div className="text-xs text-emerald-500">
                      Your coins never expire, even if you cancel.
                    </div>
                  </div>
                  
                  <button
                    onClick={handleUnsubscribe}
                    className="w-full py-3 text-sm font-medium text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                  <p className="text-xs text-slate-400 mt-2">
                    You'll keep your coins but lose access to premium styles.
                  </p>
                </div>
              ) : (
                /* Not subscribed - show subscription offer */
                <div className="relative p-6 rounded-xl border-2 border-[#0F172A] bg-slate-50">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0F172A] text-white text-xs font-bold rounded-full">
                    RECOMMENDED
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-xl text-slate-900">Glam Pass</h3>
                    <div className="flex items-baseline justify-center gap-1 mt-1">
                      <span className="text-3xl font-bold text-slate-900">$9.99</span>
                      <span className="text-slate-500">/month</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {SUBSCRIPTION_FEATURES.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                        <div className="w-5 h-5 bg-[#0F172A] rounded-full flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-white" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleSubscribe('monthly')}
                    className="w-full py-3.5 bg-[#0F172A] text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    Subscribe Now
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
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
                1 GlamCoin = 1 AI transformation. Coins never expire.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
