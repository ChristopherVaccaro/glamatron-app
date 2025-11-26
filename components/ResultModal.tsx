import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Share2, RefreshCw, Sparkles } from 'lucide-react';
import ComparisonView from './ComparisonView';

interface ResultModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  originalImage: string;
  generatedImage: string | null;
  onDownload: () => void;
  onShare: () => void;
  onTryAgain: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  isLoading = false,
  onClose,
  originalImage,
  generatedImage,
  onDownload,
  onShare,
  onTryAgain,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setDragY(0);
      onClose();
    }, 300);
  };

  // Touch handlers for swipe-to-dismiss (only on drag handle)
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only start drag from the handle area
    const target = e.target as HTMLElement;
    if (!target.closest('[data-drag-handle]')) return;
    
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) {
      // Add resistance - drag becomes harder the further you pull
      const resistance = 0.5;
      const dampedDiff = diff * resistance;
      setDragY(dampedDiff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Require 120px of dampened drag (which means ~240px actual drag) to dismiss
    if (dragY > 120) {
      handleClose();
    } else {
      setDragY(0);
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-end justify-center transition-all duration-300 ${
        isClosing ? 'bg-black/0' : 'bg-black/60'
      }`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Modal Sheet */}
      <div
        ref={modalRef}
        className={`
          w-full max-w-lg bg-white rounded-t-3xl overflow-hidden
          transform transition-transform duration-300 ease-out
          ${isClosing ? 'translate-y-full' : 'translate-y-0'}
          max-h-[92vh] flex flex-col
        `}
        style={{ transform: `translateY(${isClosing ? '100%' : `${dragY}px`})` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle - Only swipe from here to dismiss */}
        <div data-drag-handle className="flex justify-center pt-4 pb-3 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3">
          <h2 className="text-lg font-bold text-slate-900">
            {isLoading ? 'Creating Your Look...' : 'Your Transformation'}
          </h2>
          {!isLoading && (
            <button
              onClick={handleClose}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X size={22} />
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
            <div className="relative mb-6">
              {/* Pulsing background */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-violet-400 rounded-full blur-xl opacity-30 animate-pulse scale-150" />
              {/* Spinner */}
              <div className="relative w-20 h-20 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-500" size={28} />
            </div>
            <p className="text-slate-600 font-medium text-center animate-pulse">
              Applying your styles...
            </p>
            <p className="text-slate-400 text-sm mt-2 text-center">
              This usually takes 10-20 seconds
            </p>
          </div>
        )}

        {/* Comparison View - Only show when not loading and have result */}
        {!isLoading && generatedImage && (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <div className="bg-slate-100 rounded-2xl overflow-hidden">
                <ComparisonView
                  originalImage={originalImage}
                  generatedImage={generatedImage}
                />
              </div>
              
              {/* Hint */}
              <p className="text-center text-xs text-slate-400 mt-2 mb-4">
                Drag the slider to compare before & after
              </p>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-slate-100 bg-white safe-area-pb">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={onShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 active:scale-[0.98] transition-all"
                >
                  <Share2 size={18} />
                  Share
                </button>
                <button
                  onClick={onDownload}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all"
                >
                  <Download size={18} />
                  Save
                </button>
              </div>
              <button
                onClick={() => {
                  handleClose();
                  onTryAgain();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 text-slate-500 hover:text-slate-700 font-medium transition-colors"
              >
                <RefreshCw size={16} />
                Adjust & Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultModal;
