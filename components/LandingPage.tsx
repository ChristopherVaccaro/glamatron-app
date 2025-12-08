import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Wand2, 
  Palette, 
  Users, 
  Instagram,
  Briefcase,
  Star,
  Check,
  LogIn,
  UserPlus,
  Scissors,
  Eye,
  Smile,
  KeyRound
} from 'lucide-react';
import AuthModal, { UserData } from './AuthModal';
import RequestAccessModal from './RequestAccessModal';
import ForgotPasswordModal from './ForgotPasswordModal';

// Check if we're in production (Vite sets this)
const isProduction = import.meta.env.PROD;

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: (user: UserData) => void;
  user: UserData | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn, user }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showRequestAccessModal, setShowRequestAccessModal] = useState(false);
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
              <h1 className="text-xl sm:text-2xl tracking-wide text-white" style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800 }}>
                GLAMATRON
              </h1>
              <div className="flex items-center gap-3">
                {isProduction ? (
                  <button
                    onClick={() => setShowRequestAccessModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <KeyRound size={16} />
                    Request Access
                  </button>
                ) : (
                  <>
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
                  </>
                )}
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

            {/* In production, only show Request Access button - no content below */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              {isProduction ? (
                <button
                  onClick={() => setShowRequestAccessModal(true)}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-2xl hover:bg-slate-100 transition-all duration-300 shadow-2xl shadow-white/20 hover:shadow-white/30 hover:scale-105"
                >
                  <KeyRound size={20} />
                  Request Access
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <>
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
                </>
              )}
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

      {/* All showcase sections hidden in production */}
      {!isProduction && (
      <>
      {/* Showcase Section 1 - Hair Transformations */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden">
                    <div className="text-center p-4">
                      <Scissors size={40} className="text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">Original Style</p>
                    </div>
                  </div>
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                    <div className="text-center p-4">
                      <Sparkles size={32} className="text-rose-400 mx-auto mb-2" />
                      <p className="text-rose-600 text-xs font-medium">Bold Color</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <div className="text-center p-4">
                      <Wand2 size={32} className="text-amber-500 mx-auto mb-2" />
                      <p className="text-amber-700 text-xs font-medium">New Cut</p>
                    </div>
                  </div>
                  <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                    <div className="text-center p-4">
                      <Sparkles size={40} className="text-white/60 mx-auto mb-2" />
                      <p className="text-white/80 text-sm">Transformed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Side */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-sm mb-6">
                <Scissors size={14} />
                Hair Transformations
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Try Any Hairstyle Before You Commit
              </h3>
              <p className="text-slate-600 text-lg mb-8">
                Curious about going shorter? Want to see yourself with bangs? Preview any haircut, color, or style before your salon appointment. No risk, no regrets.
              </p>
              <ul className="space-y-4">
                {['Pixie cuts to long waves', 'Blonde, brunette, or bold fashion colors', 'Curly, straight, or textured styles'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section 2 - Makeup Looks */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content Side */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-sm mb-6">
                <Palette size={14} />
                Makeup & Beauty
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Explore Every Makeup Style Imaginable
              </h3>
              <p className="text-slate-600 text-lg mb-8">
                From natural "no-makeup" makeup to full glam editorial looks. See how different lip colors, eye shadows, and techniques look on your actual face.
              </p>
              <ul className="space-y-4">
                {['Natural glow to bold glamour', 'Lip colors and eye makeup', 'Contour and highlight effects'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Image Side */}
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-rose-100 via-white to-slate-100 p-8 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                  {[
                    { label: 'Natural', color: 'bg-rose-200' },
                    { label: 'Glam', color: 'bg-slate-800' },
                    { label: 'Bold', color: 'bg-rose-500' },
                  ].map((look, idx) => (
                    <div key={idx} className={`aspect-square rounded-2xl ${look.color} flex items-center justify-center`}>
                      <span className={`text-xs font-medium ${idx === 1 ? 'text-white' : idx === 2 ? 'text-white' : 'text-rose-700'}`}>
                        {look.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles size={32} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section 3 - Accessories */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 p-8">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <Eye size={48} className="text-slate-400" />
                  </div>
                  <div className="bg-slate-800 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Glasses</span>
                  </div>
                  <div className="bg-amber-100 rounded-2xl flex items-center justify-center">
                    <span className="text-amber-700 text-sm font-medium">Jewelry</span>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <Smile size={48} className="text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Side */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-sm mb-6">
                <Star size={14} />
                Accessories & More
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Complete the Look with Accessories
              </h3>
              <p className="text-slate-600 text-lg mb-8">
                See how different glasses frames suit your face. Try on earrings, necklaces, and even facial piercings. Express yourself without commitment.
              </p>
              <ul className="space-y-4">
                {['Eyewear and sunglasses', 'Earrings, necklaces, and jewelry', 'Piercings and facial accessories'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Perfect For
            </h3>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Whether you're exploring personal style or creating professional content
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Style Explorers',
                description: 'Curious about a new haircut or color? Preview it before committing to the salon.',
                benefits: ['Risk-free experimentation', 'Save time and money', 'Find your perfect look'],
              },
              {
                icon: Instagram,
                title: 'Content Creators',
                description: 'Generate fresh looks for social media without hours in hair and makeup.',
                benefits: ['Endless content ideas', 'Quick turnaround', 'Stand out from the crowd'],
              },
              {
                icon: Briefcase,
                title: 'Professionals',
                description: 'Stylists, consultants, and beauty professionals can show clients transformations.',
                benefits: ['Client consultations', 'Portfolio building', 'Upsell services'],
              },
            ].map((audience, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-6">
                  <audience.icon size={28} className="text-white" />
                </div>
                <h4 className="font-bold text-slate-900 text-xl mb-3">{audience.title}</h4>
                <p className="text-slate-600 mb-6">{audience.description}</p>
                <ul className="space-y-2">
                  {audience.benefits.map((benefit, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check size={16} className="text-emerald-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-slate-900">10K+</div>
              <div className="text-slate-600 text-sm mt-1">Transformations</div>
            </div>
            <div className="w-px h-12 bg-slate-200 hidden sm:block" />
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-slate-900">50+</div>
              <div className="text-slate-600 text-sm mt-1">Style Options</div>
            </div>
            <div className="w-px h-12 bg-slate-200 hidden sm:block" />
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-slate-900">&lt;30s</div>
              <div className="text-slate-600 text-sm mt-1">Generation Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Discover
            <br />
            Your New Look?
          </h3>
          
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            {isProduction 
              ? "Request access and start experimenting with style transformations."
              : "Create an account and start experimenting with style transformations today."
            }
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isProduction ? (
              <button
                onClick={() => setShowRequestAccessModal(true)}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 font-bold text-lg rounded-2xl hover:bg-slate-100 transition-all duration-300 shadow-2xl shadow-white/10 hover:shadow-white/20 hover:scale-105"
              >
                <KeyRound size={24} />
                Request Access
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuth('signup')}
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 font-bold text-lg rounded-2xl hover:bg-slate-100 transition-all duration-300 shadow-2xl shadow-white/10 hover:shadow-white/20 hover:scale-105"
                >
                  <UserPlus size={24} />
                  Create Your Account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => openAuth('signin')}
                  className="inline-flex items-center gap-2 px-6 py-4 text-white/80 font-medium hover:text-white transition-colors"
                >
                  <LogIn size={18} />
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </section>
      </>
      )}

      {/* Simple Footer */}
      <footer className="bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-lg tracking-wide text-white" style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800 }}>
              GLAMATRON
            </div>
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Glamatron by Cognitav
            </p>
          </div>
        </div>
      </footer>

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

      {/* Request Access Modal (Production only) */}
      <RequestAccessModal
        isOpen={showRequestAccessModal}
        onClose={() => setShowRequestAccessModal(false)}
        onSignIn={() => {
          setShowRequestAccessModal(false);
          setAuthMode('signin');
          setSignInOnly(true); // Prevent signup when coming from Request Access
          setShowAuthModal(true);
        }}
      />
    </div>
  );
};

export default LandingPage;
