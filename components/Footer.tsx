import React from 'react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms, onOpenContact }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile: stacked layout */}
        <div className="flex flex-col items-center gap-4 sm:hidden">
          <p className="text-sm text-slate-500">
            © {currentYear} Glamatron by Cognitav. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <button onClick={onOpenTerms} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Terms</button>
            <span className="text-slate-300">·</span>
            <button onClick={onOpenPrivacy} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Privacy</button>
            <span className="text-slate-300">·</span>
            <button onClick={onOpenContact} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Contact</button>
          </nav>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/glamatron_app/" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Follow us on Instagram">
              <svg className="w-5 h-5 text-slate-500 hover:text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61584591933024" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Follow us on Facebook">
              <svg className="w-5 h-5 text-slate-500 hover:text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://x.com/Glamatron_app" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Follow us on X">
              <svg className="w-5 h-5 text-slate-500 hover:text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Desktop: single row layout */}
        <div className="hidden sm:flex items-center justify-between">
          <p className="text-sm text-slate-500">
            © {currentYear} Glamatron by Cognitav. All rights reserved.
          </p>
          <nav className="flex items-center gap-6">
            <button onClick={onOpenTerms} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</button>
            <button onClick={onOpenPrivacy} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</button>
            <button onClick={onOpenContact} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Contact</button>
            <div className="flex items-center gap-2 ml-2">
              <a href="https://www.instagram.com/glamatron_app/" target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Follow us on Instagram">
                <svg className="w-4 h-4 text-slate-500 hover:text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61584591933024" target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Follow us on Facebook">
                <svg className="w-4 h-4 text-slate-500 hover:text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://x.com/Glamatron_app" target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Follow us on X">
                <svg className="w-4 h-4 text-slate-500 hover:text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
