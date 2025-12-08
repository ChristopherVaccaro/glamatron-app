import React from 'react';
import { X, LogIn, Mail, ArrowRight, Sparkles } from 'lucide-react';

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

const RequestAccessModal: React.FC<RequestAccessModalProps> = ({ 
  isOpen, 
  onClose,
  onSignIn
}) => {
  if (!isOpen) return null;

  const handleRequestAccess = () => {
    const subject = encodeURIComponent('Request Access to Glamatron');
    const body = encodeURIComponent(
      `Hi Glamatron Team,\n\nI would like to request access to Glamatron.\n\nName: \nEmail: \nHow I plan to use Glamatron: \n\nThank you!`
    );
    window.location.href = `mailto:support@glamatron.app?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
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
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-slate-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome to Glamatron
          </h2>
          <p className="text-slate-500 mt-2">
            Sign in or request access to start transforming
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 space-y-4">
          {/* Sign In Button */}
          <button
            onClick={() => {
              onClose();
              onSignIn();
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[#0F172A] text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <LogIn size={20} />
            Sign In
            <ArrowRight size={18} className="ml-auto" />
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">or</span>
            </div>
          </div>

          {/* Request Access Button */}
          <button
            onClick={handleRequestAccess}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <Mail size={20} />
            Request Access
            <ArrowRight size={18} className="ml-auto" />
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">
            We're currently in limited access. Request an invite and we'll get back to you shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestAccessModal;
