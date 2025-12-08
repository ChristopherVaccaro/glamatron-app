import React, { useState } from 'react';
import { X, Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToSignIn: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onBackToSignIn 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setError('Password reset is not available. Please contact support.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}`,
      });

      if (resetError) {
        // Don't reveal if email exists or not for security
        if (resetError.message.includes('rate limit')) {
          setError('Too many requests. Please wait a few minutes before trying again.');
        } else {
          // Always show success message for security (don't reveal if email exists)
          setSuccess(true);
        }
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {success ? 'Check your email' : 'Reset your password'}
          </h2>
          {!success && (
            <p className="text-slate-500 mt-2">
              Enter your email and we'll send you a link to reset your password.
            </p>
          )}
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-slate-600 mb-6">
                If an account exists for <span className="font-medium">{email}</span>, 
                you'll receive an email with instructions to reset your password.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-[#0F172A] text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                Got it
              </button>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#0F172A] text-white font-semibold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              {/* Back to sign in */}
              <button
                onClick={onBackToSignIn}
                className="flex items-center justify-center gap-2 w-full mt-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                <ArrowLeft size={16} />
                Back to sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
