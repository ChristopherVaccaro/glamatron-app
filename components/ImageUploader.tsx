import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelected(e.target.result as string);
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
      <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
        <img 
          src={selectedImage} 
          alt="Original Upload" 
          className="w-full h-auto max-h-[500px] object-cover"
        />
        <button
          onClick={onClear}
          className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
        >
          <X size={20} />
        </button>
        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          Original Image
        </div>
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
        relative flex flex-col items-center justify-center p-12 text-center 
        rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
        ${isDragging 
          ? 'border-rose-500 bg-rose-50 scale-[1.02]' 
          : 'border-slate-300 bg-slate-50 hover:bg-white hover:border-slate-400'
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