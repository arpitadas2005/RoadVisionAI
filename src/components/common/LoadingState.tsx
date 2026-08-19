import React, { useState, useEffect } from 'react';
import { Cpu, Search, CheckCircle2 } from 'lucide-react';

interface LoadingStateProps {
  title?: string;
  message?: string;
  subtitle?: string;
}

const STEPS = [
  'Analyzing road image...',
  'Detecting road damage...',
  'Preparing results...',
];

export const LoadingState: React.FC<LoadingStateProps> = ({ title, message, subtitle }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgress(55);
    }, 450);

    const timer2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgress(85);
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-slate-900/90 rounded-3xl border border-slate-800 my-4 shadow-2xl shadow-cyan-950/20">
      {/* Animated Spinner Icon */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
        <div className="absolute inset-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
          <Search className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Progressive Step Text */}
      <h3 className="text-xl font-black text-slate-50 mb-2 tracking-tight transition-all">
        {title || message || STEPS[currentStepIndex]}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6">
        {subtitle || 'Neural computer vision pipeline is segmenting road surface features and calculating defect severity ratings.'}
      </p>

      {/* Progress Bar Container */}
      <div className="w-full max-w-xs bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800 mb-6">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-4 text-xs font-semibold">
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1.5 transition-colors ${
              idx <= currentStepIndex ? 'text-cyan-400' : 'text-slate-600'
            }`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                idx <= currentStepIndex ? 'text-cyan-400' : 'text-slate-700'
              }`}
            />
            <span className="hidden sm:inline">{step.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
