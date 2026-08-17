import React from 'react';
import { X, Play, Scan, MapPin } from 'lucide-react';
import { Button } from '../common/Button';

interface ImagePreviewProps {
  mediaUrl: string;
  filename: string;
  isAnalyzing: boolean;
  onClear: () => void;
  onAnalyze: () => void;
  location: string;
  setLocation: (val: string) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  mediaUrl,
  filename,
  isAnalyzing,
  onClear,
  onAnalyze,
  location,
  setLocation,
}) => {
  const isVideo = filename.toLowerCase().endsWith('.mp4') || filename.toLowerCase().endsWith('.webm');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            Selected Inspection Media
          </h3>
          <p className="text-xs text-slate-400 font-mono">{filename}</p>
        </div>
        <button
          onClick={onClear}
          disabled={isAnalyzing}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Media Display Area */}
      <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden mb-5 border border-slate-800 flex items-center justify-center">
        {isAnalyzing && <div className="animate-scanline"></div>}

        {isVideo ? (
          <video src={mediaUrl} controls className="w-full h-full object-contain" />
        ) : (
          <img src={mediaUrl} alt="Inspection Preview" className="w-full h-full object-contain" />
        )}
      </div>

      {/* Custom Location Metadata Input */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          Location Tag / Road Segment Identifier
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Main Street & 5th Ave Crossing"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          disabled={isAnalyzing}
        />
      </div>

      {/* Trigger Analyze Action */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" size="md" onClick={onClear} disabled={isAnalyzing}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onAnalyze}
          isLoading={isAnalyzing}
          icon={<Scan className="w-5 h-5" />}
        >
          {isAnalyzing ? 'Running Vision AI Engine...' : 'Run AI Road Damage Detection'}
        </Button>
      </div>
    </div>
  );
};
