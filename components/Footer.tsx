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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear} Glamatron by Cognitav. All rights reserved.
          </p>
          <nav className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={onOpenTerms}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Terms of Service
            </button>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <button
              onClick={onOpenPrivacy}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <button
              onClick={onOpenContact}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Contact
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
