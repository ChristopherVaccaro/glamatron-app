import React, { useState, useMemo, useEffect } from 'react';
import { X, Download, Calendar, ChevronLeft, ChevronRight, ArrowUpDown, Users, Mail, RefreshCw, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { GalleryService, DbGalleryItemWithProfile } from '../services/supabaseService';

type ViewMode = 'users' | 'gallery' | 'detail';
type UserSortOption = 'email_asc' | 'email_desc' | 'count_desc' | 'count_asc' | 'recent';

interface UserSummary {
  email: string;
  name: string | null;
  transformationCount: number;
  lastActivity: string;
}

interface AdminGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminGalleryModal: React.FC<AdminGalleryModalProps> = ({ isOpen, onClose }) => {
  const [allItems, setAllItems] = useState<DbGalleryItemWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('users');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DbGalleryItemWithProfile | null>(null);
  const [userSortBy, setUserSortBy] = useState<UserSortOption>('recent');

  // Load all items on mount
  useEffect(() => {
    if (isOpen) {
      loadAllItems();
      setViewMode('users');
      setSelectedEmail(null);
      setSelectedItem(null);
    }
  }, [isOpen]);

  const loadAllItems = async () => {
    setIsLoading(true);
    try {
      const items = await GalleryService.getAllItemsWithProfiles();
      setAllItems(items);
    } catch (error) {
      console.error('Failed to load admin gallery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate user summaries from all items
  const userSummaries = useMemo(() => {
    const userMap = new Map<string, UserSummary>();
    
    allItems.forEach(item => {
      const existing = userMap.get(item.user_email);
      if (existing) {
        existing.transformationCount++;
        if (new Date(item.created_at) > new Date(existing.lastActivity)) {
          existing.lastActivity = item.created_at;
        }
      } else {
        userMap.set(item.user_email, {
          email: item.user_email,
          name: item.user_name,
          transformationCount: 1,
          lastActivity: item.created_at,
        });
      }
    });
    
    let summaries = Array.from(userMap.values());
    
    // Sort based on selected option
    switch (userSortBy) {
      case 'email_asc':
        summaries.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case 'email_desc':
        summaries.sort((a, b) => b.email.localeCompare(a.email));
        break;
      case 'count_desc':
        summaries.sort((a, b) => b.transformationCount - a.transformationCount);
        break;
      case 'count_asc':
        summaries.sort((a, b) => a.transformationCount - b.transformationCount);
        break;
      case 'recent':
      default:
        summaries.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
        break;
    }
    
    return summaries;
  }, [allItems, userSortBy]);

  // Get items for selected user
  const userItems = useMemo(() => {
    if (!selectedEmail) return [];
    return allItems
      .filter(item => item.user_email === selectedEmail)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [allItems, selectedEmail]);

  // Get total counts
  const totalUsers = userSummaries.length;
  const totalTransformations = allItems.length;

  // Get current image index for carousel
  const currentImageIndex = selectedItem ? userItems.findIndex(i => i.id === selectedItem.id) + 1 : 0;

  const handleSelectUser = (email: string) => {
    setSelectedEmail(email);
    setViewMode('gallery');
  };

  const handleBackToUsers = () => {
    setSelectedEmail(null);
    setViewMode('users');
  };

  const handleSelectItem = (item: DbGalleryItemWithProfile) => {
    setSelectedItem(item);
    setViewMode('detail');
  };

  const handleBackToGallery = () => {
    setSelectedItem(null);
    setViewMode('gallery');
  };

  const handleDownload = async (item: DbGalleryItemWithProfile) => {
    try {
      const response = await fetch(item.result_image_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `glamatron-${item.user_email.split('@')[0]}-${item.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      window.open(item.result_image_url, '_blank');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  };

  // Navigate between items in detail view
  const navigateItem = (direction: 'prev' | 'next') => {
    if (!selectedItem) return;
    const currentIndex = userItems.findIndex(i => i.id === selectedItem.id);
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + userItems.length) % userItems.length
      : (currentIndex + 1) % userItems.length;
    setSelectedItem(userItems[newIndex]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Light Theme with Monotone Accents */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            {viewMode !== 'users' && (
              <button
                onClick={viewMode === 'detail' ? handleBackToGallery : handleBackToUsers}
                className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {viewMode === 'users' && 'Admin Gallery'}
                {viewMode === 'gallery' && (selectedEmail || 'User Gallery')}
                {viewMode === 'detail' && 'Transformation Detail'}
              </h2>
              <p className="text-sm text-slate-500">
                {viewMode === 'users' && `${totalTransformations} transformations • ${totalUsers} users`}
                {viewMode === 'gallery' && `${userItems.length} transformations`}
                {viewMode === 'detail' && selectedItem && `${currentImageIndex} of ${userItems.length}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {viewMode === 'users' && (
              <button
                onClick={loadAllItems}
                disabled={isLoading}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
              <p className="text-slate-500">Loading all transformations...</p>
            </div>
          ) : viewMode === 'users' ? (
            /* ========== USER LIST VIEW ========== */
            <div className="p-6">
              {/* Sort options */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">
                  Click on a user to view their transformations
                </p>
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-slate-400" />
                  <select
                    value={userSortBy}
                    onChange={(e) => setUserSortBy(e.target.value as UserSortOption)}
                    className="text-sm bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-400"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="count_desc">Most Transformations</option>
                    <option value="count_asc">Least Transformations</option>
                    <option value="email_asc">Email A-Z</option>
                    <option value="email_desc">Email Z-A</option>
                  </select>
                </div>
              </div>

              {userSummaries.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <Users size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No users yet</h3>
                  <p className="text-slate-500">No users have created any transformations yet.</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-4 py-3">
                          <button
                            onClick={() => setUserSortBy(userSortBy === 'email_asc' ? 'email_desc' : 'email_asc')}
                            className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
                          >
                            User
                            {(userSortBy === 'email_asc' || userSortBy === 'email_desc') && (
                              userSortBy === 'email_asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                            )}
                          </button>
                        </th>
                        <th className="text-center px-4 py-3">
                          <button
                            onClick={() => setUserSortBy(userSortBy === 'count_desc' ? 'count_asc' : 'count_desc')}
                            className="flex items-center justify-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors mx-auto"
                          >
                            Transformations
                            {(userSortBy === 'count_desc' || userSortBy === 'count_asc') && (
                              userSortBy === 'count_desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />
                            )}
                          </button>
                        </th>
                        <th className="text-right px-4 py-3">
                          <button
                            onClick={() => setUserSortBy('recent')}
                            className="flex items-center justify-end gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors ml-auto"
                          >
                            Last Active
                            {userSortBy === 'recent' && <ChevronDown size={14} />}
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {userSummaries.map((user) => (
                        <tr 
                          key={user.email}
                          onClick={() => handleSelectUser(user.email)}
                          className="hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {user.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 group-hover:text-slate-700 transition-colors">
                                  {user.name || user.email.split('@')[0]}
                                </p>
                                <p className="text-sm text-slate-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 bg-slate-800 text-white rounded-full text-sm font-medium">
                              {user.transformationCount}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm text-slate-500">
                              {formatRelativeTime(user.lastActivity)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : viewMode === 'gallery' ? (
            /* ========== USER GALLERY VIEW ========== */
            <div className="p-6">
              {userItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <Users size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No transformations</h3>
                  <p className="text-slate-500">This user hasn't created any transformations.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {userItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 cursor-pointer hover:ring-2 hover:ring-slate-400 transition-all shadow-sm hover:shadow-lg"
                      onClick={() => handleSelectItem(item)}
                    >
                      <img
                        src={item.result_image_url}
                        alt="Transformed look"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white text-sm font-medium">
                            {formatDate(item.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ========== DETAIL VIEW ========== */
            selectedItem && (
              <div className="relative">
                {/* Navigation arrows */}
                {userItems.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateItem('prev'); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={20} className="text-slate-700" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateItem('next'); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight size={20} className="text-slate-700" />
                    </button>
                  </>
                )}
                
                {/* Image comparison */}
                <div className="grid grid-cols-2 gap-1 bg-slate-200">
                  <div className="relative aspect-[3/4] bg-slate-100">
                    <img
                      src={selectedItem.original_image_url}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white font-medium">
                      Original
                    </div>
                  </div>
                  <div className="relative aspect-[3/4] bg-slate-100">
                    <img
                      src={selectedItem.result_image_url}
                      alt="Transformed"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-slate-800/80 backdrop-blur-sm rounded text-xs text-white font-medium">
                      Transformed
                    </div>
                  </div>
                </div>
                
                {/* Info bar */}
                <div className="flex items-center justify-between p-4 border-t border-slate-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Mail size={14} className="text-slate-400" />
                      <span>{selectedItem.user_email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={14} />
                      <span>{formatDateTime(selectedItem.created_at)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(selectedItem)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGalleryModal;
