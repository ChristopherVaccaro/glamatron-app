import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  LogIn,
  UserPlus
} from 'lucide-react';
import AuthModal, { UserData } from './AuthModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import FAQSection from './FAQSection';
import CookieConsentBanner from './CookieConsentBanner';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: (user: UserData) => void;
  user: UserData | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn, user }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [signInOnly, setSignInOnly] = useState(false); // When true, hides signup option in AuthModal

  const handleSignIn = (userData: UserData) => {
    onSignIn(userData);
    onGetStarted(); // Go to main app after signing in
  };

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Gradient orbs - static, no animation */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-slate-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-700/20 rounded-full blur-3xl" />

        {/* Header with Sign In - Sticky */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Holiday logo - alternating green/red letters with lights for Nov-Dec */}
              {(() => {
                const month = new Date().getMonth();
                const isHoliday = month === 10 || month === 11; // November or December
                if (isHoliday) {
                  const letters = 'GLAMATRON'.split('');
                  const lightColors = ['text-red-400', 'text-yellow-300', 'text-green-400', 'text-blue-400', 'text-pink-400'];
                  return (
                    <h1 className="relative">
                      {/* Christmas lights above */}
                      <span className="absolute -top-2.5 left-0 right-0 flex justify-between px-0.5 text-[10px] sm:text-xs">
                        {letters.map((_, i) => (
                          <span key={`landing-light-${i}`} className={`${lightColors[i % lightColors.length]} drop-shadow-sm`}>●</span>
                        ))}
                      </span>
                      <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800 }} className="text-xl sm:text-2xl tracking-wide">
                        {letters.map((letter, i) => (
                          <span key={`landing-logo-${i}`} className={i % 2 === 0 ? 'text-green-400' : 'text-red-400'}>
                            {letter}
                          </span>
                        ))}
                      </span>
                    </h1>
                  );
                }
                return (
                  <h1 className="text-xl sm:text-2xl tracking-wide text-white" style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800 }}>
                    GLAMATRON
                  </h1>
                );
              })()}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuth('signin')}
                  className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium hover:text-slate-300 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Spacer for fixed header */}
        <div className="h-16" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-32">
          {/* Hero Title */}
          

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Transform Your Look
              <br />
              <span className="bg-gradient-to-r from-white via-slate-300 to-rose-300 bg-clip-text text-transparent">
                In Seconds
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Explore endless style possibilities. Try new hairstyles, makeup looks, 
              and accessories—all from a single photo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <button
                onClick={() => openAuth('signup')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-2xl hover:bg-slate-100 transition-all duration-300 shadow-2xl shadow-white/20 hover:shadow-white/30 hover:scale-105"
              >
                <UserPlus size={20} />
                Create Account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => openAuth('signin')}
                className="inline-flex items-center gap-2 px-6 py-4 text-white font-medium hover:text-slate-300 transition-colors"
              >
                <LogIn size={18} />
                Already have an account? Sign In
              </button>
            </div>
          </div>

          {/* Before/After Preview */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="relative">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 via-rose-500/50 to-slate-600 rounded-3xl blur-lg opacity-30" />
              
              <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-4 sm:gap-8">
                  {/* Before */}
                  <div className="relative">
                    <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                      <img 
                        src="/images/hero-before.png" 
                        alt="Before transformation" 
                        className="w-full h-full object-cover"
                      />
                      {/* Decorative elements */}
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-slate-900/70 backdrop-blur-sm rounded-lg text-xs font-medium text-slate-300">
                        Before
                      </div>
                    </div>
                  </div>

                  {/* After */}
                  <div className="relative">
                    <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-700 to-rose-900/30 overflow-hidden border border-rose-500/20">
                      <img 
                        src="/images/hero-after.jpg" 
                        alt="After AI transformation" 
                        className="w-full h-full object-cover"
                      />
                      {/* Sparkle decorations */}
                     
                      {/* Decorative elements */}
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-rose-500/70 backdrop-blur-sm rounded-lg text-xs font-medium text-white">
                        After
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center divider with icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-700 to-rose-600 rounded-full flex items-center justify-center shadow-2xl z-10">
                  <ArrowRight size={24} className="text-white sm:w-7 sm:h-7" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer - dark theme style matching homepage hero */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Mobile: stacked layout */}
          <div className="flex flex-col items-center gap-4 sm:hidden">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Glamatron by Cognitav. All rights reserved.
            </p>
            <nav className="flex items-center gap-4">
              <Link to="/terms-of-service" className="text-sm text-slate-400 hover:text-white transition-colors">Terms</Link>
              <span className="text-slate-600">·</span>
              <Link to="/privacy-policy" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy</Link>
            </nav>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/glamatron_app/" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-800 rounded-lg transition-colors" aria-label="Follow us on Instagram">
                <svg className="w-5 h-5 text-slate-400 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61584591933024" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-800 rounded-lg transition-colors" aria-label="Follow us on Facebook">
                <svg className="w-5 h-5 text-slate-400 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://x.com/Glamatron_app" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-800 rounded-lg transition-colors" aria-label="Follow us on X">
                <svg className="w-5 h-5 text-slate-400 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Desktop: single row layout */}
          <div className="hidden sm:flex items-center justify-between">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Glamatron by Cognitav. All rights reserved.
            </p>
            <nav className="flex items-center gap-6">
              <Link to="/terms-of-service" className="text-sm text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/privacy-policy" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
              <div className="flex items-center gap-2 ml-2">
                <a href="https://www.instagram.com/glamatron_app/" target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors" aria-label="Follow us on Instagram">
                  <svg className="w-4 h-4 text-slate-400 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61584591933024" target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors" aria-label="Follow us on Facebook">
                  <svg className="w-4 h-4 text-slate-400 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="https://x.com/Glamatron_app" target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors" aria-label="Follow us on X">
                  <svg className="w-4 h-4 text-slate-400 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                  </svg>
                </a>
              </div>
            </nav>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setSignInOnly(false); // Reset when closing
        }}
        onSignIn={handleSignIn}
        defaultMode={authMode}
        onForgotPassword={() => {
          setShowAuthModal(false);
          setShowForgotPasswordModal(true);
        }}
        signInOnly={signInOnly}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onBackToSignIn={() => {
          setShowForgotPasswordModal(false);
          setAuthMode('signin');
          setShowAuthModal(true);
        }}
      />

    </div>
  );
};

export default LandingPage;
