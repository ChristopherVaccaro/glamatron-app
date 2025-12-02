import React, { useState } from 'react';
import { X, User, Mail, Camera, Check, Sparkles } from 'lucide-react';
import { UserData } from './AuthModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onUpdateUser: (user: UserData) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateUser({ ...user, name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get avatar background based on provider
  const getAvatarBg = () => {
    switch (user.provider) {
      case 'google':
        return 'bg-gradient-to-br from-blue-500 to-green-500';
      case 'apple':
        return 'bg-gradient-to-br from-gray-700 to-gray-900';
      default:
        return 'bg-gradient-to-br from-violet-500 to-rose-500';
    }
  };

  // Get provider label
  const getProviderLabel = () => {
    switch (user.provider) {
      case 'google':
        return 'Signed in with Google';
      case 'apple':
        return 'Signed in with Apple';
      default:
        return 'Signed in with Email';
    }
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

        {/* Header with avatar */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 px-8 pt-8 pb-16">
          <h2 className="text-2xl font-bold text-white">Your Profile</h2>
          <p className="text-slate-400 mt-1">{getProviderLabel()}</p>
          
          {/* Decorative sparkles */}
          <Sparkles className="absolute top-6 right-16 text-white/20" size={24} />
        </div>

        {/* Avatar - overlapping header and content */}
        <div className="relative -mt-12 flex justify-center">
          <div className="relative">
            <div className={`w-24 h-24 ${getAvatarBg()} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl border-4 border-white`}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                getInitials(name || user.name)
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-700 transition-colors">
              <Camera size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pt-6 pb-8">
          <div className="space-y-4">
            {/* Name field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  placeholder="Your name"
                />
              </div>
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-slate-50"
                  placeholder="your@email.com"
                  disabled={user.provider !== 'email'}
                />
              </div>
              {user.provider !== 'email' && (
                <p className="text-xs text-slate-500 mt-1.5">Email is managed by your {user.provider === 'google' ? 'Google' : 'Apple'} account</p>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Your Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">0</div>
                  <div className="text-xs text-slate-500">Transformations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">0</div>
                  <div className="text-xs text-slate-500">Saved Looks</div>
                </div>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saved}
              className={`w-full py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                saved 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {saved ? (
                <>
                  <Check size={18} />
                  Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
