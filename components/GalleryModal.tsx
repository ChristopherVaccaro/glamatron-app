import React, { useState } from 'react';
import { X, Trash2, Heart, Download, Calendar, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { useGallery } from '../contexts/GalleryContext';
import { GalleryItem } from '../types';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, userId }) => {
  const { getUserItems, removeItem, toggleFavorite } = useGallery();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const items = getUserItems(userId);

  if (!isOpen) return null;

  const handleDownload = (item: GalleryItem) => {
    const link = document.createElement('a');
    link.href = item.resultImage;
    link.download = `glamatron-${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string) => {
    removeItem(id);
    setShowDeleteConfirm(null);
    if (selectedItem?.id === id) {
      setSelectedItem(null);
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
    setSelectedItem(items[newIndex]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          if (selectedItem) {
            setSelectedItem(null);
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
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <ImageIcon size={20} className="text-slate-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">History</h2>
              <p className="text-sm text-slate-500">{items.length} {items.length === 1 ? 'image' : 'images'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          {items.length === 0 ? (
            // Empty state
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <ImageIcon size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No creations yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Your generated images will appear here. Start transforming to build your gallery!
              </p>
            </div>
          ) : (
            // Gallery grid
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 cursor-pointer hover:ring-2 hover:ring-rose-500 transition-all"
                  onClick={() => setSelectedItem(item)}
                >
                  <img
                    src={item.resultImage}
                    alt="Generated look"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-xs truncate">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Favorite badge */}
                  {item.isFavorite && (
                    <div className="absolute top-2 right-2">
                      <Heart size={16} className="text-rose-500 fill-rose-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelectedItem(null)}
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
              onClick={() => setSelectedItem(null)}
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
                  onClick={() => handleDownload(selectedItem)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
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
    </div>
  );
};

export default GalleryModal;
