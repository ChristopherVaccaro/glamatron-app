import React, { useRef, useState } from 'react';
import { Upload, X, Replace, AlertCircle } from 'lucide-react';
import { Analytics } from '../utils/analytics';

interface ImageUploaderProps {
  onImageSelected: (base64: string, filename: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

// Validation constants
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif'];

// Fixed height for consistent container sizing - taller for professional look
const CONTAINER_HEIGHT = 'h-[400px] sm:h-[500px] md:h-[65vh] lg:h-[70vh] md:max-h-[750px]';

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
        return `Invalid file type. Please upload a ${ALLOWED_EXTENSIONS.join(', ').toUpperCase()} image.`;
      }
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return `File too large (${sizeMB}MB). Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
    }
    
    return null;
  };

  const handleFile = (file: File) => {
    // Clear any previous error
    setValidationError(null);
    
    // Validate file
    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      // Auto-clear error after 5 seconds
      setTimeout(() => setValidationError(null), 5000);
      return;
    }
    
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
        className={`relative group rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-50 ${CONTAINER_HEIGHT} ${isDragging ? 'ring-2 ring-[#0f172a] ring-offset-2' : ''}`}
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
          aria-label="Remove image"
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
          aria-label="Replace image"
        >
          <Replace size={14} />
          Replace
        </button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label="Upload a photo. Drag and drop or click to select a clear photo of a face."
      className={`
        relative flex flex-col items-center justify-center text-center p-8
        rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
        border-slate-200 bg-white
        ${CONTAINER_HEIGHT}
        ${isDragging 
          ? 'border-rose-500 bg-rose-50 scale-[1.02]' 
          : 'hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:ring-offset-2 focus:border-[#0f172a]'
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
      
      <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-rose-100 text-rose-500' : 'bg-white text-slate-500 shadow-sm'}`}>
        <Upload size={32} />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-700 mb-1">
        Upload a photo
      </h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto">
        Drag and drop or click to select a clear photo of a face.
      </p>
      <p className="text-xs text-slate-500 mt-2">
        JPG, PNG, WebP, HEIC • Max {MAX_FILE_SIZE_MB}MB
      </p>
      
      {/* Validation Error */}
      {validationError && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{validationError}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); setValidationError(null); }}
            className="ml-auto p-1 hover:bg-red-100 rounded"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;