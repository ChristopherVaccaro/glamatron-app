import React, { useState, useCallback } from 'react';
import { Sparkles, Download, RefreshCw, Wand2, ArrowRight, Dices } from 'lucide-react';
import { 
  StyleCategory, 
  UserSelections, 
  GenerationState 
} from './types';
import { 
  HAIR_OPTIONS,
  HAIR_LENGTH_OPTIONS,
  HAIR_COLOR_OPTIONS,
  EXPRESSION_OPTIONS,
  MAKEUP_OPTIONS, 
  EYE_OPTIONS,
  LIP_OPTIONS,
  GLASSES_OPTIONS,
  PIERCING_OPTIONS,
  HEADWEAR_OPTIONS,
  JEWELRY_OPTIONS,
  FACE_EXTRAS_OPTIONS
} from './constants';
import StyleSelector from './components/StyleSelector';
import ImageUploader from './components/ImageUploader';
import ComparisonView from './components/ComparisonView';
import { generateStyledImage } from './services/geminiService';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalFilename, setOriginalFilename] = useState<string>('image');
  
  const [selections, setSelections] = useState<UserSelections>({
    [StyleCategory.HAIR]: null,
    [StyleCategory.HAIR_LENGTH]: null,
    [StyleCategory.HAIR_COLOR]: null,
    [StyleCategory.ACCESSORIES]: [],
    [StyleCategory.MAKEUP]: null,
    [StyleCategory.EXPRESSION]: null,
    [StyleCategory.EYES]: null,
    [StyleCategory.LIPS]: null,
  });

  const [genState, setGenState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    resultImage: null,
  });

  const handleSelection = useCallback((category: StyleCategory, value: string) => {
    setSelections(prev => {
      // Handle multi-select for accessories
      if (category === StyleCategory.ACCESSORIES) {
        if (value === 'CLEAR_ALL') return { ...prev, [category]: [] };
        
        const current = prev[category] as string[];
        const exists = current.includes(value);
        return {
          ...prev,
          [category]: exists 
            ? current.filter(v => v !== value)
            : [...current, value]
        };
      }

      // Handle single select for others
      // Clicking the same option again deselects it
      return {
        ...prev,
        [category]: prev[category] === value ? null : (value === '' ? null : value)
      };
    });
  }, []);

  // Core generation logic extracted to handle both manual and random triggers
  const executeGeneration = async (activeSelections: UserSelections) => {
    if (!selectedImage) return;

    // Check if at least one style is selected
    const hasSelection = 
      activeSelections[StyleCategory.HAIR] || 
      activeSelections[StyleCategory.HAIR_LENGTH] ||
      activeSelections[StyleCategory.HAIR_COLOR] ||
      activeSelections[StyleCategory.MAKEUP] || 
      activeSelections[StyleCategory.EXPRESSION] ||
      activeSelections[StyleCategory.EYES] || 
      activeSelections[StyleCategory.LIPS] ||
      activeSelections[StyleCategory.ACCESSORIES].length > 0;

    if (!hasSelection) {
      setGenState(prev => ({ ...prev, error: "Please select at least one style option." }));
      return;
    }

    setGenState({ isLoading: true, error: null, resultImage: null });

    try {
      const result = await generateStyledImage(selectedImage, activeSelections);
      setGenState({ isLoading: false, error: null, resultImage: result });
    } catch (err: any) {
      setGenState({ 
        isLoading: false, 
        error: err.message || "Something went wrong. Please try again.", 
        resultImage: null 
      });
    }
  };

  const handleGenerateClick = () => {
    executeGeneration(selections);
  };

  const handleRandomize = () => {
    if (!selectedImage) return;

    // Helper to get random item from array
    const getRandom = <T extends { value: string }>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)].value;
    
    // Helper to maybe get an item (X% chance)
    const maybeGet = <T extends { value: string }>(arr: T[], chance: number = 0.5) => Math.random() < chance ? getRandom(arr) : null;

    // Collect all accessories
    const allAccessories = [
      ...GLASSES_OPTIONS,
      ...PIERCING_OPTIONS,
      ...HEADWEAR_OPTIONS,
      ...JEWELRY_OPTIONS,
      ...FACE_EXTRAS_OPTIONS
    ];

    // Pick 1 to 3 random accessories
    const numAccessories = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
    const randomAccessories: string[] = [];
    const usedIndices = new Set<number>();
    
    for (let i = 0; i < numAccessories; i++) {
        let index;
        let attempts = 0;
        do {
            index = Math.floor(Math.random() * allAccessories.length);
            attempts++;
        } while (usedIndices.has(index) && attempts < 10);
        
        usedIndices.add(index);
        randomAccessories.push(allAccessories[index].value);
    }

    const newSelections: UserSelections = {
      [StyleCategory.HAIR]: maybeGet(HAIR_OPTIONS, 0.7), 
      [StyleCategory.HAIR_LENGTH]: maybeGet(HAIR_LENGTH_OPTIONS, 0.4),
      [StyleCategory.HAIR_COLOR]: maybeGet(HAIR_COLOR_OPTIONS, 0.5),
      [StyleCategory.MAKEUP]: maybeGet(MAKEUP_OPTIONS, 0.6),
      [StyleCategory.EXPRESSION]: maybeGet(EXPRESSION_OPTIONS, 0.5),
      [StyleCategory.EYES]: maybeGet(EYE_OPTIONS, 0.5),
      [StyleCategory.LIPS]: maybeGet(LIP_OPTIONS, 0.5),
      [StyleCategory.ACCESSORIES]: randomAccessories
    };

    // Update UI with new selections
    setSelections(newSelections);

    // Trigger generation immediately with the new selections
    executeGeneration(newSelections);
  };

  const handleDownload = () => {
    if (genState.resultImage) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `${originalFilename}_styled_${timestamp}.jpg`;
      
      const link = document.createElement('a');
      link.href = genState.resultImage;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-rose-500 p-2 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent">
              StyleMirror AI
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Gemini
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Controls */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* 1. Upload Section */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">1</span>
                Upload Photo
              </h2>
              <ImageUploader 
                selectedImage={selectedImage}
                onImageSelected={(img, filename) => {
                  setSelectedImage(img);
                  setOriginalFilename(filename);
                  setGenState(prev => ({ ...prev, resultImage: null }));
                }}
                onClear={() => {
                  setSelectedImage(null);
                  setGenState(prev => ({ ...prev, resultImage: null }));
                  setSelections({
                    [StyleCategory.HAIR]: null,
                    [StyleCategory.HAIR_LENGTH]: null,
                    [StyleCategory.HAIR_COLOR]: null,
                    [StyleCategory.ACCESSORIES]: [],
                    [StyleCategory.MAKEUP]: null,
                    [StyleCategory.EXPRESSION]: null,
                    [StyleCategory.EYES]: null,
                    [StyleCategory.LIPS]: null,
                  });
                }}
              />
            </section>

            {/* 2. Style Selectors */}
            {selectedImage && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">2</span>
                    Customize Look
                  </h2>
                  <button
                    onClick={handleRandomize}
                    disabled={genState.isLoading}
                    className={`
                      text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-colors
                      ${genState.isLoading 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                      }
                    `}
                  >
                    <Dices size={14} />
                    Surprise Me
                  </button>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-8">
                  
                  {/* Hair Section */}
                  <div>
                    <h3 className="text-md font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Hair</h3>
                    <StyleSelector 
                      title="Hair Style" 
                      category={StyleCategory.HAIR} 
                      options={HAIR_OPTIONS} 
                      selections={selections} 
                      onSelect={handleSelection} 
                    />
                    <div className="h-4"></div>
                    <StyleSelector 
                      title="Hair Length" 
                      category={StyleCategory.HAIR_LENGTH} 
                      options={HAIR_LENGTH_OPTIONS} 
                      selections={selections} 
                      onSelect={handleSelection} 
                    />
                    <div className="h-4"></div>
                    <StyleSelector 
                      title="Hair Color" 
                      category={StyleCategory.HAIR_COLOR} 
                      options={HAIR_COLOR_OPTIONS} 
                      selections={selections} 
                      onSelect={handleSelection} 
                    />
                  </div>
                  
                  {/* Makeup Section */}
                  <div>
                    <h3 className="text-md font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Face & Expression</h3>
                    <StyleSelector 
                      title="Expression" 
                      category={StyleCategory.EXPRESSION} 
                      options={EXPRESSION_OPTIONS} 
                      selections={selections} 
                      onSelect={handleSelection} 
                    />
                    <div className="h-4"></div>
                    <StyleSelector 
                      title="Makeup Base" 
                      category={StyleCategory.MAKEUP} 
                      options={MAKEUP_OPTIONS} 
                      selections={selections} 
                      onSelect={handleSelection} 
                    />
                    <div className="h-4"></div>
                    <StyleSelector 
                      title="Eyes & Contacts" 
                      category={StyleCategory.EYES} 
                      options={EYE_OPTIONS} 
                      selections={selections} 
                      onSelect={handleSelection} 
                    />
                    <div className="h-4"></div>
                    <StyleSelector 
                      title="Lips" 
                      category={StyleCategory.LIPS} 
                      options={LIP_OPTIONS} 
                      selections={selections} 
                      onSelect={handleSelection} 
                    />
                  </div>

                  {/* Accessories Section */}
                  <div>
                    <h3 className="text-md font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Accessories</h3>
                    <StyleSelector 
                      title="Eyewear" 
                      category={StyleCategory.ACCESSORIES} 
                      options={GLASSES_OPTIONS} 
                      selections={selections} 
                      onSelect={handleSelection}
                      multiSelect 
                    />
                    <div className="h-4"></div>
                    <StyleSelector 
                      title="Piercings" 
                      category={StyleCategory.ACCESSORIES} 
                      options={PIERCING_OPTIONS} 
                      selections={selections} 
                      onSelect={handleSelection}
                      multiSelect 
                    />
                    <div className="h-4"></div>
                    <StyleSelector 
                      title="Headwear" 
                      category={StyleCategory.ACCESSORIES} 
                      options={HEADWEAR_OPTIONS} 
                      selections={selections} 
                      onSelect={handleSelection}
                      multiSelect 
                    />
                    <div className="h-4"></div>
                    <StyleSelector 
                      title="Jewelry & Neckwear" 
                      category={StyleCategory.ACCESSORIES} 
                      options={JEWELRY_OPTIONS} 
                      selections={selections} 
                      onSelect={handleSelection}
                      multiSelect 
                    />
                    <div className="h-4"></div>
                    <StyleSelector 
                      title="Extras & Face Art" 
                      category={StyleCategory.ACCESSORIES} 
                      options={FACE_EXTRAS_OPTIONS} 
                      selections={selections} 
                      onSelect={handleSelection}
                      multiSelect 
                    />
                  </div>

                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: Results & Actions */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 space-y-6">
              
              {/* Result Area */}
              <div className={`
                bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 relative
                ${!genState.resultImage ? 'min-h-[400px] flex items-center justify-center' : ''}
              `}>
                
                {/* Empty State */}
                {!selectedImage && !genState.resultImage && (
                  <div className="text-center p-8 text-slate-400">
                    <Wand2 size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Upload an image to start magic</p>
                  </div>
                )}

                {/* Loading State */}
                {genState.isLoading && (
                  <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-500" size={24} />
                    </div>
                    <p className="mt-4 text-slate-600 font-medium animate-pulse">Applying styles...</p>
                  </div>
                )}

                {/* Error State */}
                {genState.error && (
                   <div className="absolute inset-0 z-20 bg-white/95 flex flex-col items-center justify-center p-6 text-center">
                     <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
                       <RefreshCw size={32} />
                     </div>
                     <p className="text-red-600 font-medium mb-2">Oops!</p>
                     <p className="text-slate-600 text-sm max-w-sm mb-6">{genState.error}</p>
                     <button 
                      onClick={() => setGenState(prev => ({...prev, error: null}))}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800"
                     >
                       Try Again
                     </button>
                   </div>
                )}

                {/* Comparison / Result View */}
                {genState.resultImage && !genState.isLoading && selectedImage && (
                  <div className="bg-white p-4">
                     <ComparisonView 
                       originalImage={selectedImage} 
                       generatedImage={genState.resultImage} 
                     />
                     <div className="mt-4 flex justify-end">
                      <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                      >
                        <Download size={18} />
                        Download Result
                      </button>
                     </div>
                  </div>
                )}
                
                {/* Preview Placeholder if image selected but not generated */}
                {selectedImage && !genState.resultImage && !genState.isLoading && !genState.error && (
                   <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
                     <img 
                       src={selectedImage} 
                       alt="Preview" 
                       className="absolute inset-0 w-full h-full object-cover opacity-10 blur-xl scale-110" 
                     />
                     <div className="relative z-10 text-center max-w-md bg-white/80 p-6 rounded-2xl backdrop-blur-sm shadow-sm">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Transform?</h3>
                        <p className="text-slate-600 mb-6">
                          Select your desired styles on the left or try the "Surprise Me" button, then click Generate.
                        </p>
                        <ArrowRight className="mx-auto text-rose-400 animate-bounce" size={24} />
                     </div>
                   </div>
                )}
              </div>

              {/* Primary Action Button */}
              {selectedImage && (
                <button
                  onClick={handleGenerateClick}
                  disabled={genState.isLoading}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg shadow-xl shadow-rose-500/20 
                    flex items-center justify-center gap-3 transition-all duration-300
                    ${genState.isLoading 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-rose-600 to-violet-600 text-white hover:shadow-rose-500/40 hover:-translate-y-1'
                    }
                  `}
                >
                  {genState.isLoading ? 'Processing...' : 'Generate New Look'}
                  {!genState.isLoading && <Sparkles size={20} />}
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;