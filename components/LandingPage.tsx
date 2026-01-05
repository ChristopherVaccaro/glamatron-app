import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  LogIn,
  Upload,
  Palette,
  Eye,
  Save,
  CheckCircle2,
  Users,
  User,
  Share2,
  Shield,
  Monitor,
  RefreshCw,
  Lock
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
  const [signInOnly, setSignInOnly] = useState(false);

  const handleSignIn = (userData: UserData) => {
    onSignIn(userData);
    onGetStarted();
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
        
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-slate-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-700/20 rounded-full blur-3xl" />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {(() => {
                const now = new Date();
                const month = now.getMonth();
                const day = now.getDate();
                const isHoliday = month === 11 && day <= 25 && day % 2 === 1;
                if (isHoliday) {
                  const letters = 'GLAMATRON'.split('');
                  const lightColors = ['text-red-400', 'text-yellow-300', 'text-green-400', 'text-blue-400', 'text-pink-400'];
                  return (
                    <h1 className="relative">
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
                  Try It Free
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="h-16" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24">
          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              See Your New Look
              <br />
              <span className="bg-gradient-to-r from-white via-slate-300 to-rose-300 bg-clip-text text-transparent">
                Before You Commit
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
              Glamatron lets you visualize hairstyles, color, and makeup in seconds — so you can make confident decisions, whether you're behind the chair or in it.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <button
                onClick={() => openAuth('signup')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-2xl hover:bg-slate-100 transition-all duration-300 shadow-2xl shadow-white/20 hover:shadow-white/30 hover:scale-105"
              >
                Try It Free
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
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 via-rose-500/50 to-slate-600 rounded-3xl blur-lg opacity-30" />
              
              <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-4 sm:gap-8">
                  <div className="relative">
                    <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                      <img 
                        src="/images/hero-1-before.jpg" 
                        alt="Before visualization" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-slate-900/70 backdrop-blur-sm rounded-lg text-xs font-medium text-slate-300">
                        Before
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-700 to-rose-900/30 overflow-hidden border border-rose-500/20">
                      <img 
                        src="/images/hero-1-after.jpg" 
                        alt="After visualization" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-rose-500/70 backdrop-blur-sm rounded-lg text-xs font-medium text-white">
                        Visualized
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-700 to-rose-600 rounded-full flex items-center justify-center shadow-2xl z-10">
                  <ArrowRight size={24} className="text-white sm:w-7 sm:h-7" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting Paragraph Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl sm:text-2xl text-slate-700 leading-relaxed">
            Changing your look shouldn't feel like a leap of faith. Glamatron is a realistic style visualization tool that helps you explore new hairstyles, hair color, and makeup — before anything permanent happens. Upload a photo, try different looks, and see what actually works for your face, skin tone, and personal style.
          </p>
          <p className="mt-6 text-lg text-slate-500 font-medium">
            No guesswork. No regrets.
          </p>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Who It's For
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Whether you're a beauty professional or simply exploring your next look, Glamatron meets you where you are.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* For Stylists & Salons */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                <Users size={28} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">
                For Stylists and Salons
              </h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Glamatron transforms client consultations. Instead of describing a look or scrolling through unrelated reference photos, show clients exactly how a style will look on <em>them</em>. Reduce miscommunication, align expectations upfront, and build confidence before you ever pick up the scissors.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-slate-700 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Shorten consultation time</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-slate-700 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Minimize post-service dissatisfaction</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-slate-700 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Offer a premium, tech-forward client experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-slate-700 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Save and share looks for easy follow-up</span>
                </li>
              </ul>
            </div>

            {/* For Everyday Users */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200">
              <div className="w-14 h-14 bg-rose-500 rounded-xl flex items-center justify-center mb-6">
                <User size={28} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">
                For Everyday Users
              </h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Whether you're considering bangs, curious about going blonde, or just want to experiment — Glamatron gives you space to explore. Try on looks from your couch, compare options side by side, and share favorites with friends before booking your next appointment.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-rose-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">No salon visit required to explore</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-rose-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">See realistic results on your own photo</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-rose-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Save looks and revisit them anytime</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-rose-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Walk into your appointment knowing what you want</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="bg-slate-900 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Confidence Starts with Clarity
          </h3>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8">
            Most style disappointments come from misaligned expectations. A client pictures one thing; the result looks different. That gap costs time, money, and trust.
          </p>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10">
            Glamatron closes that gap. By showing you a realistic preview of your new look — on your face, in your lighting — it removes the uncertainty that makes people hesitate to try something new.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <p className="text-slate-200 font-medium">For professionals</p>
              <p className="text-slate-400 mt-2">Smoother consultations and happier clients</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <p className="text-slate-200 font-medium">For individuals</p>
              <p className="text-slate-400 mt-2">Finally try that look you've been thinking about — risk-free</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h3>
            <p className="text-lg text-slate-600">
              Four simple steps to visualize your next look
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Upload size={28} className="text-slate-700" />
              </div>
              <div className="text-sm font-semibold text-rose-500 mb-2">Step 1</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Upload Your Photo</h4>
              <p className="text-slate-600">
                Use any clear, front-facing image. Glamatron works with what you already have on your phone.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Palette size={28} className="text-slate-700" />
              </div>
              <div className="text-sm font-semibold text-rose-500 mb-2">Step 2</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Choose a Style</h4>
              <p className="text-slate-600">
                Browse hairstyles, colors, and makeup options — or upload inspiration from anywhere.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Eye size={28} className="text-slate-700" />
              </div>
              <div className="text-sm font-semibold text-rose-500 mb-2">Step 3</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">See It On You</h4>
              <p className="text-slate-600">
                Your selected look is applied to your photo in seconds, with realistic lighting and natural blending.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Save size={28} className="text-slate-700" />
              </div>
              <div className="text-sm font-semibold text-rose-500 mb-2">Step 4</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Save, Compare, or Share</h4>
              <p className="text-slate-600">
                Keep your favorites, compare side-by-side, or send to your stylist before your next appointment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Built for Real Results
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Professional-grade visualization that works for consultations and personal exploration alike.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <Eye size={24} className="text-slate-700 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Realistic Visualization</h4>
              <p className="text-slate-600 text-sm">
                See styles rendered naturally on your own face, not a generic model.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <RefreshCw size={24} className="text-slate-700 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Side-by-Side Comparisons</h4>
              <p className="text-slate-600 text-sm">
                Easily compare multiple looks to find the one that fits.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <Share2 size={24} className="text-slate-700 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Shareable Results</h4>
              <p className="text-slate-600 text-sm">
                Send images to stylists, friends, or clients with one tap.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <Monitor size={24} className="text-slate-700 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Works on Any Device</h4>
              <p className="text-slate-600 text-sm">
                No app download required. Access from your phone, tablet, or desktop.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <Shield size={24} className="text-slate-700 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Professional-Grade Output</h4>
              <p className="text-slate-600 text-sm">
                Designed for real consultations, not novelty filters.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <Lock size={24} className="text-slate-700 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Private and Secure</h4>
              <p className="text-slate-600 text-sm">
                Your photos are yours. We don't store or share your images without permission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to See What's Possible?
          </h3>
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Whether you're a stylist looking to elevate your consultations or someone ready to finally try that new look — Glamatron helps you visualize first and decide with confidence.
          </p>
          <button
            onClick={() => openAuth('signup')}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 font-bold text-lg rounded-2xl hover:bg-slate-100 transition-all duration-300 shadow-2xl shadow-white/20 hover:shadow-white/30 hover:scale-105"
          >
            Get Started Free
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
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
