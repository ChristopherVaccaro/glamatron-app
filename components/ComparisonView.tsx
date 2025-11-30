import React, { useState, useRef, useEffect } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface ComparisonViewProps {
  originalImage: string;
  generatedImage: string;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ originalImage, generatedImage }) => {
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
    <div className="flex flex-col gap-4">
      {/* Slider View */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden select-none cursor-ew-resize group rounded-xl shadow-lg border border-slate-200 bg-slate-100 touch-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Generated Image (After) - Base */}
        <img 
          src={generatedImage} 
          alt="After" 
          className="w-full h-auto block pointer-events-none"
          onDragStart={(e) => e.preventDefault()}
        />

        {/* Original Image (Before) - Overlay */}
        {/* We use clip-path inset(top right bottom left) to reveal the left side */}
        <img 
          src={originalImage} 
          alt="Before" 
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ 
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            objectFit: 'fill' // Ensures it stretches exactly to match the base image dimensions
          }}
        />

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-rose-500">
            <ChevronsLeftRight size={16} />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-xs pointer-events-none backdrop-blur-sm z-20">
          Before
        </div>
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-xs pointer-events-none backdrop-blur-sm z-20">
          After
        </div>
      </div>
      
      <p className="text-center text-sm text-slate-500 bg-white">
        Drag the slider to compare original vs generated
      </p>
    </div>
  );
};

export default ComparisonView;