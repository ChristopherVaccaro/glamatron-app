import React, { useState, useCallback } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Lightbulb,
  Wand2,
  ChevronRight,
  Image as ImageIcon,
  Loader2,
  Scissors,
  Palette,
  Eye,
  Droplet,
  Star,
  Gem
} from 'lucide-react';
import { StyleAnalysisResult, StyleMatch, StyleSuggestion, UserSelections, StyleCategory } from '../types';
import { analyzeStyleFromImage } from '../services/geminiService';

interface StyleAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyStyles: (selections: Partial<UserSelections>) => void;
}

// Helper to get icon for category
const getCategoryIcon = (category: StyleCategory) => {
  switch (category) {
    case StyleCategory.HAIR:
    case StyleCategory.HAIR_LENGTH:
    case StyleCategory.HAIR_COLOR:
      return Scissors;
    case StyleCategory.MAKEUP:
      return Palette;
    case StyleCategory.EYES:
      return Eye;
    case StyleCategory.LIPS:
      return Droplet;
    case StyleCategory.EXPRESSION:
      return Star;
    case StyleCategory.ACCESSORIES:
      return Gem;
    default:
      return Star;
  }
};

// Helper to get friendly category name
const getCategoryName = (category: StyleCategory): string => {
  switch (category) {
    case StyleCategory.HAIR:
      return 'Hair Style';
    case StyleCategory.HAIR_LENGTH:
      return 'Hair Length';
    case StyleCategory.HAIR_COLOR:
      return 'Hair Color';
    case StyleCategory.MAKEUP:
      return 'Makeup';
    case StyleCategory.EYES:
      return 'Eye Makeup';
    case StyleCategory.LIPS:
      return 'Lips';
    case StyleCategory.EXPRESSION:
      return 'Expression';
    case StyleCategory.ACCESSORIES:
      return 'Accessory';
    case StyleCategory.FACIAL_HAIR:
      return 'Facial Hair';
    default:
      return 'Style';
  }
};

const StyleAnalyzerModal: React.FC<StyleAnalyzerModalProps> = ({
  isOpen,
  onClose,
  onApplyStyles
}) => {
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<StyleAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatches, setSelectedMatches] = useState<Set<number>>(new Set());

  // Handle file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setReferenceImage(event.target?.result as string);
      setAnalysisResult(null);
      setError(null);
      setSelectedMatches(new Set());
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceImage(event.target?.result as string);
        setAnalysisResult(null);
        setError(null);
        setSelectedMatches(new Set());
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Analyze the uploaded image
  const handleAnalyze = async () => {
    if (!referenceImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeStyleFromImage(referenceImage);
      setAnalysisResult(result);
      
      // Auto-select all available matches
      const availableIndices = new Set<number>();
      result.matches.forEach((match, idx) => {
        if (match.isAvailable && match.matchedOption) {
          availableIndices.add(idx);
        }
      });
      setSelectedMatches(availableIndices);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle match selection
  const toggleMatch = (index: number) => {
    const match = analysisResult?.matches[index];
    if (!match?.isAvailable || !match?.matchedOption) return;

    setSelectedMatches(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Apply selected styles
  const handleApplyStyles = () => {
    if (!analysisResult) return;

    const selections: Partial<UserSelections> = {
      [StyleCategory.ACCESSORIES]: []
    };

    selectedMatches.forEach(index => {
      const match = analysisResult.matches[index];
      if (!match.matchedOption) return;

      if (match.category === StyleCategory.ACCESSORIES) {
        (selections[StyleCategory.ACCESSORIES] as string[]).push(match.matchedOption.value);
      } else {
        (selections as any)[match.category] = match.matchedOption.value;
      }
    });

    onApplyStyles(selections);
    onClose();
  };

  // Reset state
  const handleReset = () => {
    setReferenceImage(null);
    setAnalysisResult(null);
    setError(null);
    setSelectedMatches(new Set());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Style Analyzer</h2>
              <p className="text-sm text-slate-500">Copy styles from any reference photo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Section */}
          {!analysisResult && (
            <div className="space-y-4">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center transition-all
                  ${referenceImage 
                    ? 'border-slate-400 bg-slate-50' 
                    : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }
                `}
              >
                {referenceImage ? (
                  <div className="space-y-4">
                    <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={referenceImage}
                        alt="Reference"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        Choose Different
                      </button>
                      <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Analyze Style
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-slate-700 font-medium">Upload a reference photo</p>
                        <p className="text-sm text-slate-500 mt-1">
                          Drop an image here or click to browse
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                        <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded">Celebrity looks</span>
                        <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded">Magazine photos</span>
                        <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded">Red carpet</span>
                        <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded">Social media</span>
                      </div>
                    </div>
                  </label>
                )}
              </div>

              {/* How it works */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  How it works
                </h3>
                <ol className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    <span>Upload a photo with a style you love (celebrity, influencer, magazine)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    <span>AI analyzes hair, makeup, accessories, and more</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    <span>Select which styles to apply to your own transformation</span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Analysis Failed</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-6">
              {/* Reference Image & Vibe */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                  <img
                    src={referenceImage!}
                    alt="Reference"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-600">Overall Vibe</span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">{analysisResult.overallVibe}</p>
                  <button
                    onClick={handleReset}
                    className="mt-2 text-sm text-slate-600 hover:text-slate-800 underline"
                  >
                    Analyze different photo
                  </button>
                </div>
              </div>

              {/* Matched Styles */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Available Styles ({analysisResult.matches.filter(m => m.isAvailable).length})
                  </h3>
                  <button
                    onClick={() => {
                      const allAvailable = new Set<number>();
                      analysisResult.matches.forEach((m, i) => {
                        if (m.isAvailable) allAvailable.add(i);
                      });
                      setSelectedMatches(allAvailable);
                    }}
                    className="text-sm text-slate-600 hover:text-slate-800"
                  >
                    Select All
                  </button>
                </div>
                <div className="space-y-2">
                  {analysisResult.matches
                    .filter(m => m.isAvailable && m.matchedOption)
                    .map((match, idx) => {
                      const originalIndex = analysisResult.matches.indexOf(match);
                      const Icon = getCategoryIcon(match.category);
                      const isSelected = selectedMatches.has(originalIndex);
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleMatch(originalIndex)}
                          className={`
                            w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-3
                            ${isSelected 
                              ? 'border-slate-700 bg-slate-50' 
                              : 'border-slate-200 hover:border-slate-400 bg-white'
                            }
                          `}
                        >
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                            ${isSelected ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}
                          `}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-slate-500 uppercase">
                                {getCategoryName(match.category)}
                              </span>
                              <span className="text-xs text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                                {Math.ceil(match.matchConfidence)}% match
                              </span>
                            </div>
                            <p className="font-medium text-slate-800 truncate">
                              {match.matchedOption?.label}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              Detected: {match.originalDescription}
                            </p>
                          </div>
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                            ${isSelected 
                              ? 'bg-slate-800 border-slate-800' 
                              : 'border-slate-300'
                            }
                          `}>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Suggestions - Styles not in our library */}
              {analysisResult.suggestions.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Style Suggestions ({analysisResult.suggestions.length})
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">
                    These styles were detected but aren't in our current library.
                  </p>
                  <div className="space-y-2">
                    {analysisResult.suggestions.slice(0, 6).map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-amber-50 border border-amber-200 rounded-xl"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-amber-700 uppercase">
                            {getCategoryName(suggestion.category)}
                          </span>
                        </div>
                        <p className="font-medium text-slate-700 text-sm">{suggestion.description}</p>
                        {suggestion.reason && (
                          <p className="text-xs text-slate-500 mt-1">{suggestion.reason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {analysisResult && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {selectedMatches.size} style{selectedMatches.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={handleApplyStyles}
                disabled={selectedMatches.size === 0}
                className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                Apply Styles
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleAnalyzerModal;
