import React from 'react';
import { SAMPLE_ROAD_IMAGES } from '../../services/MockDetectionService';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface SampleLoaderProps {
  onSelectSample: (sampleId: string) => void;
}

export const SampleLoader: React.FC<SampleLoaderProps> = ({ onSelectSample }) => {
  return (
    <div className="mt-6 pt-6 border-t border-slate-800">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Or Test With Sample Road Data (1-Click Inspection)
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SAMPLE_ROAD_IMAGES.map((sample) => (
          <button
            key={sample.id}
            onClick={() => onSelectSample(sample.id)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
              <img
                src={sample.url}
                alt={sample.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors truncate">
                {sample.title}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{sample.type}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
