import React, { useState, useMemo } from 'react';
import { X, Trash2, Heart, Download, Calendar, ChevronLeft, ChevronRight, ImageIcon, ArrowUpDown, Clock, Share2, CheckSquare, Square, XCircle } from 'lucide-react';
import { useGallery } from '../contexts/GalleryContext';
import { GalleryItem } from '../types';

// Time period filter options
type TimePeriod = 'all' | 'today' | 'week' | 'month';
type SortOption = 'newest' | 'oldest' | 'favorites';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, userId }) => {
  const { getUserItems, removeItem, removeItems, toggleFavorite } = useGallery();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // Multi-select state
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const allItems = getUserItems(userId);
  
  // Derive selectedItem from the current items to ensure it reflects latest state
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return allItems.find(item => item.id === selectedItemId) || null;
  }, [selectedItemId, allItems]);

  // Filter and sort items
  const items = useMemo(() => {
    let filtered = [...allItems];
    
    // Apply time period filter
    if (timePeriod !== 'all') {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt);
        switch (timePeriod) {
          case 'today':
            return itemDate >= startOfToday;
          case 'week':
            const weekAgo = new Date(startOfToday);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return itemDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(startOfToday);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return itemDate >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'favorites':
          // Favorites first, then by newest
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    return filtered;
  }, [allItems, timePeriod, sortBy]);

  // Count favorites for display
  const favoritesCount = useMemo(() => 
    allItems.filter(item => item.isFavorite).length, 
  [allItems]);

  if (!isOpen) return null;

  const handleDownload = async (item: GalleryItem) => {
    try {
      // Fetch the image and create a blob for proper download
      const response = await fetch(item.resultImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `glamatron-${item.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback for CORS issues - open in new tab
      console.error('Download error:', err);
      window.open(item.resultImage, '_blank');
    }
  };

  const handleDelete = (id: string) => {
    removeItem(id);
    setShowDeleteConfirm(null);
    if (selectedItem?.id === id) {
      setSelectedItemId(null);
    }
  };

  const handleShare = async (item: GalleryItem) => {
    try {
      const response = await fetch(item.resultImage);
      const blob = await response.blob();
      const file = new File([blob], `glamatron-${item.id}.jpg`, { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Glamatron Transformation',
          text: 'Check out my style transformation with Glamatron!',
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: 'My Glamatron Transformation',
          text: 'Check out my style transformation with Glamatron!',
        });
      } else {
        // Fallback: copy image URL or download
        handleDownload(item);
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Navigate between items in detail view
  const navigateItem = (direction: 'prev' | 'next') => {
    if (!selectedItem) return;
    const currentIndex = items.findIndex(i => i.id === selectedItem.id);
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + items.length) % items.length
      : (currentIndex + 1) % items.length;
    setSelectedItemId(items[newIndex].id);
  };

  // Multi-select handlers
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedIds(new Set());
    setShowBulkDeleteConfirm(false);
  };

  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    setSelectedIds(new Set(items.map(item => item.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    setIsDeleting(true);
    try {
      await removeItems(Array.from(selectedIds));
      setSelectedIds(new Set());
      setShowBulkDeleteConfirm(false);
      setIsSelectMode(false);
    } catch (error) {
      console.error('Error deleting items:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          if (selectedItem) {
            setSelectedItemId(null);
          } else {
            onClose();
          }
        }}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
              <ImageIcon size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isSelectMode ? `${selectedIds.size} Selected` : 'History'}
              </h2>
              <p className="text-sm text-slate-500">
                {isSelectMode ? (
                  `Select images to delete`
                ) : (
                  <>
                    {timePeriod !== 'all' && items.length !== allItems.length 
                      ? `${items.length} of ${allItems.length} transformations`
                      : `${items.length} ${items.length === 1 ? 'transformation' : 'transformations'}`
                    }
                    {favoritesCount > 0 && (
                      <span className="ml-2 text-rose-500">
                        • {favoritesCount} <Heart size={10} className="inline fill-current" />
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Select Mode Toggle */}
            {allItems.length > 0 && (
              <button
                onClick={toggleSelectMode}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelectMode
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isSelectMode ? <XCircle size={16} /> : <CheckSquare size={16} />}
                {isSelectMode ? 'Cancel' : 'Select'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filters Bar / Selection Controls */}
        {allItems.length > 0 && (
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-3">
            {isSelectMode ? (
              <>
                {/* Selection Controls */}
                <button
                  onClick={selectedIds.size === items.length ? deselectAll : selectAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  {selectedIds.size === items.length ? <Square size={14} /> : <CheckSquare size={14} />}
                  {selectedIds.size === items.length ? 'Deselect All' : 'Select All'}
                </button>
                
                {/* Delete Selected Button */}
                {selectedIds.size > 0 && (
                  <button
                    onClick={() => setShowBulkDeleteConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete {selectedIds.size} {selectedIds.size === 1 ? 'Image' : 'Images'}
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Time Period Filter */}
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                    className="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
                
                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="favorites">Favorites First</option>
                  </select>
                </div>
                
                {/* Quick filter: Favorites only */}
                <button
                  onClick={() => setSortBy(sortBy === 'favorites' ? 'newest' : 'favorites')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'favorites'
                      ? 'bg-rose-100 text-rose-600 border border-rose-200'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-200 hover:text-rose-500'
                  }`}
                >
                  <Heart size={14} className={sortBy === 'favorites' ? 'fill-current' : ''} />
                  Favorites
                </button>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          {items.length === 0 ? (
            // Empty state - differentiate between no items at all vs no items matching filter
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <ImageIcon size={32} className="text-slate-400" />
              </div>
              {allItems.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No transformations yet</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Your generated images will appear here. Start transforming to build your gallery!
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No matching transformations</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    No transformations found for the selected time period. Try selecting "All Time" to see everything.
                  </p>
                  <button
                    onClick={() => setTimePeriod('all')}
                    className="mt-4 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Show All
                  </button>
                </>
              )}
            </div>
          ) : (
            // Gallery grid
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((item) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`group relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 cursor-pointer transition-all ${
                      isSelectMode && isSelected 
                        ? 'ring-2 ring-rose-500 ring-offset-2' 
                        : 'hover:ring-2 hover:ring-rose-500'
                    }`}
                    onClick={() => {
                      if (isSelectMode) {
                        toggleItemSelection(item.id);
                      } else {
                        setSelectedItemId(item.id);
                      }
                    }}
                  >
                    <img
                      src={item.resultImage}
                      alt="Generated look"
                      className={`w-full h-full object-cover transition-opacity ${
                        isSelectMode && isSelected ? 'opacity-80' : ''
                      }`}
                    />
                    
                    {/* Selection checkbox overlay */}
                    {isSelectMode && (
                      <div className="absolute top-2 left-2 z-10">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                          isSelected 
                            ? 'bg-rose-500 text-white' 
                            : 'bg-white/90 text-slate-400 border border-slate-300'
                        }`}>
                          {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                        </div>
                      </div>
                    )}
                    
                    {/* Hover overlay - only show when not in select mode */}
                    {!isSelectMode && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white text-xs truncate">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Favorite badge */}
                    {item.isFavorite && !isSelectMode && (
                      <div className="absolute top-2 right-2">
                        <Heart size={16} className="text-rose-500 fill-rose-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelectedItemId(null)}
          />
          
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Navigation arrows */}
            {items.length > 1 && (
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
            
            {/* Close button */}
            <button
              onClick={() => setSelectedItemId(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <X size={20} className="text-slate-700" />
            </button>
            
            {/* Image comparison */}
            <div className="grid grid-cols-2 gap-1 bg-slate-200">
              <div className="relative aspect-[3/4] bg-slate-100">
                <img
                  src={selectedItem.originalImage}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white font-medium">
                  Original
                </div>
              </div>
              <div className="relative aspect-[3/4] bg-slate-100">
                <img
                  src={selectedItem.resultImage}
                  alt="Transformed"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-rose-500/80 backdrop-blur-sm rounded text-xs text-white font-medium">
                  Transformed
                </div>
              </div>
            </div>
            
            {/* Actions bar */}
            <div className="flex items-center justify-between p-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar size={14} />
                <span>{formatDate(selectedItem.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(selectedItem.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedItem.isFavorite 
                      ? 'bg-rose-100 text-rose-600' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Heart size={18} className={selectedItem.isFavorite ? 'fill-current' : ''} />
                </button>
                
                <button
                  onClick={() => handleShare(selectedItem)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                  title="Share"
                >
                  <Share2 size={18} />
                </button>
                
                <button
                  onClick={() => handleDownload(selectedItem)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                  title="Download"
                >
                  <Download size={18} />
                </button>
                
                {showDeleteConfirm === selectedItem.id ? (
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-sm text-slate-600">Delete?</span>
                    <button
                      onClick={() => handleDelete(selectedItem.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(selectedItem.id)}
                    className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70"
            onClick={() => !isDeleting && setShowBulkDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Delete {selectedIds.size} {selectedIds.size === 1 ? 'Image' : 'Images'}?
              </h3>
              <p className="text-slate-500 mb-6">
                This action cannot be undone. The selected images will be permanently deleted from your gallery.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowBulkDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                  className="px-6 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryModal;
