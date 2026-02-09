import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, ImageIcon, Users, HelpCircle } from 'lucide-react';
import { UserData } from './AuthModal';
import { useUser } from '../contexts/UserContext';

interface ProfileDropdownProps {
  user: UserData;
  onSignOut: () => void;
  onOpenProfile: () => void;
  onOpenGallery: () => void;
  onOpenAdminGallery?: () => void;
  onOpenFAQ?: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onSignOut, onOpenProfile, onOpenGallery, onOpenAdminGallery, onOpenFAQ }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

  return (
    <div ref={dropdownRef} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
      >
        <div className={`w-9 h-9 ${getAvatarBg()} rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md`}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(user.name)
          )}
        </div>
        <ChevronDown 
          size={16} 
          className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${getAvatarBg()} rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md`}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenProfile();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <User size={18} className="text-slate-500" />
              <span className="font-medium">Profile</span>
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenGallery();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ImageIcon size={18} className="text-slate-500" />
              <span className="font-medium">History</span>
            </button>
            
            {/* Admin-only: All Users Gallery */}
            {isAdmin && onOpenAdminGallery && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdminGallery();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Users size={18} className="text-slate-500" />
                <span className="font-medium">All Users Gallery</span>
              </button>
            )}
            
            <div className="my-1 border-t border-slate-100" />
            
            {/* FAQ / Help */}
            {onOpenFAQ && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFAQ();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <HelpCircle size={18} className="text-slate-500" />
                <span className="font-medium">Help & FAQ</span>
              </button>
            )}
            
            <div className="my-1 border-t border-slate-100" />
            
            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
