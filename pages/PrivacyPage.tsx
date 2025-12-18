import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PrivacyPolicyContent from '../components/PrivacyPolicyContent';
import CookieConsentBanner from '../components/CookieConsentBanner';

const PrivacyPage: React.FC = () => {
  // Scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Glamatron</span>
            </Link>
            <Link to="/">
              <span 
                className="text-xl tracking-wide text-slate-900" 
                style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800 }}
              >
                GLAMATRON
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
          <PrivacyPolicyContent />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Glamatron. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/terms-of-service" className="hover:text-slate-700 transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy-policy" className="hover:text-slate-700 transition-colors font-medium text-slate-700">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />
    </div>
  );
};

export default PrivacyPage;
