import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertCircle, RefreshCw } from 'lucide-react';
import { analyzeSwingImage } from '../services/geminiService';

const SwingAnalyzer: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    
    setIsAnalyzing(true);
    // Extract base64 data and mime type
    const mimeType = imagePreview.split(';')[0].split(':')[1];
    const base64Data = imagePreview.split(',')[1];

    const result = await analyzeSwingImage(base64Data, mimeType);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
      <div className="bg-gray-800 p-4 text-white flex items-center justify-between border-b border-gray-700">
         <div className="flex items-center gap-2">
          <Camera className="w-6 h-6 text-club-gold" />
          <h2 className="font-serif text-xl font-bold text-gray-100">Form Critique</h2>
        </div>
        <span className="text-xs text-club-gold uppercase tracking-widest">Vision AI</span>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-800/50">
        {!imagePreview ? (
          <div 
            onClick={triggerFileInput}
            className="border-2 border-dashed border-gray-600 bg-gray-800/50 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-gray-800 transition-all group"
          >
            <div className="bg-gray-700 p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-gray-300 font-medium">Upload your "Swing"</p>
            <p className="text-xs text-gray-500 mt-1">JPG or PNG supported</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-700 bg-black">
              <img src={imagePreview} alt="Swing Upload" className="w-full h-64 object-contain opacity-90" />
              <button 
                onClick={() => { setImagePreview(null); setAnalysis(null); }}
                className="absolute top-2 right-2 bg-gray-900/80 hover:bg-gray-900 text-red-400 p-2 rounded-full shadow-sm backdrop-blur-sm"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {!analysis && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-club-gold hover:bg-yellow-600 text-gray-900 font-bold py-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Consulting the Spirits...
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    Judge My Form
                  </>
                )}
              </button>
            )}

            {analysis && (
              <div className="bg-gray-800 p-6 rounded-xl border border-emerald-500/30 shadow-lg animate-fade-in">
                <h3 className="font-serif text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🧐</span> Expert Observation
                </h3>
                <div className="prose prose-invert prose-stone text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {analysis}
                </div>
              </div>
            )}
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    </div>
  );
};

export default SwingAnalyzer;