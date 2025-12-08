import React, { useState } from 'react';
import { X, User, Mail, Check, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { UserData } from './AuthModal';
import { useGallery } from '../contexts/GalleryContext';
import { useUser } from '../contexts/UserContext';
import { AccountService } from '../services/supabaseService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onUpdateUser: (user: UserData) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { getUserItems } = useGallery();
  const { signOut } = useUser();
  
  // Get actual stats from gallery
  const userGalleryItems = getUserItems(user.id);
  const transformationCount = userGalleryItems.length;
  const favoritesCount = userGalleryItems.filter(item => item.isFavorite).length;

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateUser({ ...user, name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const result = await AccountService.deleteAccount(user.id);
      
      if (result.success) {
        // Close modal first
        onClose();
        // Sign out from context - this triggers the redirect to landing page
        await signOut();
        // Force reload to clear all state if signOut doesn't trigger redirect
        window.location.href = '/';
      } else {
        setDeleteError(result.error || 'Failed to delete account. Please try again.');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      setDeleteError('An unexpected error occurred. Please try again.');
    } finally {
      setIsDeleting(false);
    }
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

            {/* Email field - always read-only for security */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 cursor-not-allowed"
                  placeholder="your@email.com"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                {user.provider !== 'email' 
                  ? `Email is managed by your ${user.provider === 'google' ? 'Google' : 'Apple'} account`
                  : 'Email address cannot be changed'
                }
              </p>
            </div>

            {/* Stats - only show if user has activity */}
            {transformationCount > 0 ? (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Your Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{transformationCount}</div>
                    <div className="text-xs text-slate-500">Transformations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{favoritesCount}</div>
                    <div className="text-xs text-slate-500">Favorites</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-gradient-to-br from-rose-50 to-violet-50 rounded-xl text-center">
                <p className="text-sm text-slate-600">
                  Create your first transformation to start building your collection!
                </p>
              </div>
            )}

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

            {/* Danger Zone - Delete Account */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-2.5 text-sm text-slate-500 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete Account
                </button>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle size={16} className="text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800 text-sm">Delete your account?</h4>
                      <p className="text-xs text-red-600 mt-1">
                        This will permanently delete your account and all your saved transformations. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-red-700 mb-1">
                      Type "delete" to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="delete"
                      disabled={isDeleting}
                      className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                  {deleteError && (
                    <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded-lg text-xs text-red-700">
                      {deleteError}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                        setDeleteError(null);
                      }}
                      disabled={isDeleting}
                      className="flex-1 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmText.toLowerCase() !== 'delete' || isDeleting}
                      className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Delete Account'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
