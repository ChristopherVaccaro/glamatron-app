import React, { useRef, useState } from 'react';
import { Upload, X, Replace } from 'lucide-react';
import { Analytics } from '../utils/analytics';

interface ImageUploaderProps {
  onImageSelected: (base64: string, filename: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

// Fixed height for consistent container sizing - taller for professional look
const CONTAINER_HEIGHT = 'h-[400px] sm:h-[500px] md:h-[65vh] lg:h-[70vh] md:max-h-[750px]';

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      Analytics.photoUpload();
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          // Extract filename without extension
          const filename = file.name.replace(/\.[^/.]+$/, '') || 'image';
          onImageSelected(e.target.result as string, filename);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  if (selectedImage) {
    return (
      <div 
        className={`relative group rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-50 ${CONTAINER_HEIGHT} ${isDragging ? 'ring-2 ring-rose-500 ring-offset-2' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          accept="image/*"
          className="hidden"
        />
        <img 
          src={selectedImage} 
          alt="Original Upload" 
          className="w-full h-full object-contain"
        />
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-rose-500/20 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-white rounded-xl p-4 shadow-lg text-center">
              <Replace size={32} className="mx-auto text-rose-500 mb-2" />
              <p className="font-medium text-slate-700">Drop to replace image</p>
            </div>
          </div>
        )}
        <button
          onClick={onClear}
          className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors z-10"
          title="Remove image"
        >
          <X size={20} />
        </button>
        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          Original Image
        </div>
        {/* Replace hint on hover */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white text-xs rounded backdrop-blur-sm transition-colors flex items-center gap-1.5 opacity-0 group-hover:opacity-100"
        >
          <Replace size={14} />
          Replace
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center text-center p-8
        rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
        border-slate-200 bg-white
        ${CONTAINER_HEIGHT}
        ${isDragging 
          ? 'border-rose-500 bg-rose-50 scale-[1.02]' 
          : 'hover:bg-slate-50 hover:border-slate-400'
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />
      
      <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-rose-100 text-rose-500' : 'bg-white text-slate-400 shadow-sm'}`}>
        <Upload size={32} />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-700 mb-1">
        Upload a photo
      </h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto">
        Drag and drop or click to select a clear photo of a face.
      </p>
    </div>
  );
};

export default ImageUploader;