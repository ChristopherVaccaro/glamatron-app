import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface PasswordGateProps {
  onUnlock: () => void;
}

const SITE_PASSWORD = 'Chrisfranstella229!';

const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === SITE_PASSWORD) {
      // Store in session so user doesn't have to re-enter on refresh
      sessionStorage.setItem('glamatron_access', 'granted');
      onUnlock();
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-slate-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl" />
      
      <div className={`relative w-full max-w-md ${isShaking ? 'animate-shake' : ''}`}>
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 
              className="text-2xl sm:text-3xl font-bold tracking-wide text-white mb-2" 
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              GLAMATRON
            </h1>
            <p className="text-slate-400 text-sm">Early Access Preview</p>
          </div>

          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <Lock size={28} className="text-slate-400" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Enter Access Code
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    error 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-slate-700 focus:ring-rose-500/50 focus:border-rose-500'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  <span>Incorrect password. Please try again.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40"
            >
              Enter Site
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-slate-500 text-xs mt-6">
            This site is currently in private beta.
          </p>
        </div>
      </div>

      {/* Shake animation style */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PasswordGate;
