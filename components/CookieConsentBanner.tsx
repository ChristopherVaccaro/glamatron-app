import React, { useState, useEffect } from 'react';
import { Cookie, X, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'glamatron_cookie_consent';

interface CookiePreferences {
  necessary: boolean; // Always true - required for site to function
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    marketing: false,
    timestamp: 0,
  });

  useEffect(() => {
    // Check if user has already consented
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      // Small delay before showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    const consent = { ...prefs, timestamp: Date.now() };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
  };

  const handleAcceptNecessary = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 sm:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          {/* Main Banner */}
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="hidden sm:flex w-12 h-12 bg-white rounded-xl items-center justify-center flex-shrink-0">
                <Cookie size={24} className="text-slate-700" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="sm:hidden w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Cookie size={16} className="text-slate-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">We value your privacy</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. 
                  By clicking "Accept All", you consent to our use of cookies. You can customize your preferences 
                  or learn more in our{' '}
                  <Link to="/privacy-policy" className="text-rose-400 hover:text-rose-300 underline">
                    Privacy Policy
                  </Link>.
                </p>
                
                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleAcceptAll}
                    className="px-5 py-2.5 bg-white text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleAcceptNecessary}
                    className="px-5 py-2.5 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-600 transition-colors"
                  >
                    Necessary Only
                  </button>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-5 py-2.5 text-slate-300 font-medium rounded-xl hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {showDetails ? 'Hide Details' : 'Customize'}
                  </button>
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={handleAcceptNecessary}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Detailed Preferences */}
          {showDetails && (
            <div className="border-t border-slate-700 p-5 sm:p-6 bg-slate-800/50">
              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between gap-4 p-4 bg-slate-800 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield size={16} className="text-emerald-400" />
                      <h4 className="font-medium text-white">Necessary Cookies</h4>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Required</span>
                    </div>
                    <p className="text-sm text-slate-400">
                      Essential for the website to function properly. These cannot be disabled.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-not-allowed">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
                
                {/* Analytics Cookies */}
                <div className="flex items-start justify-between gap-4 p-4 bg-slate-800 rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">Analytics Cookies</h4>
                    <p className="text-sm text-slate-400">
                      Help us understand how visitors interact with our website by collecting anonymous information.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      preferences.analytics ? 'bg-rose-500' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      preferences.analytics ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
                
                {/* Marketing Cookies */}
                <div className="flex items-start justify-between gap-4 p-4 bg-slate-800 rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">Marketing Cookies</h4>
                    <p className="text-sm text-slate-400">
                      Used to track visitors across websites to display relevant advertisements.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      preferences.marketing ? 'bg-rose-500' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      preferences.marketing ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
              
              {/* Save Preferences Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-2.5 bg-rose-500 text-white font-medium rounded-xl hover:bg-rose-600 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
