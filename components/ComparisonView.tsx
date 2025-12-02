import React, { useState, useRef, useEffect } from 'react';
import { ChevronsLeftRight, X } from 'lucide-react';

interface ComparisonViewProps {
  originalImage: string;
  generatedImage: string;
  onClear?: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ originalImage, generatedImage, onClear }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsResizing(true);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMove = (clientX: number) => {
    if (!isResizing || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsResizing(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-ew-resize bg-slate-100 touch-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* Generated Image (After) - Base */}
      <img 
        src={generatedImage} 
        alt="After" 
        className="w-full h-full object-contain pointer-events-none"
        onDragStart={(e) => e.preventDefault()}
      />

      {/* Original Image (Before) - Overlay */}
      <img 
        src={originalImage} 
        alt="Before" 
        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
        style={{ 
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      />

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-700 border-2 border-slate-200">
          <ChevronsLeftRight size={18} />
        </div>
      </div>

      {/* X button to upload new image */}
      {onClear && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors z-30 cursor-pointer"
          title="Upload new image"
        >
          <X size={20} />
        </button>
      )}

      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-xs pointer-events-none backdrop-blur-sm z-20">
        Before
      </div>
      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-xs pointer-events-none backdrop-blur-sm z-20">
        After
      </div>
    </div>
  );
};

export default ComparisonView;