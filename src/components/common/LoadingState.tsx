import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200/80 my-4 shadow-sm">
      {/* Animated Spinner Icon */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        <div className="absolute inset-4 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-xs">
          <Search className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Progressive Step Text */}
      <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight transition-all">
        {title || message || STEPS[currentStepIndex]}
      </h3>
      <p className="text-xs font-medium text-slate-500 max-w-sm mb-6">
        {subtitle || 'Neural computer vision pipeline is segmenting road surface features and calculating defect severity ratings.'}
      </p>

      {/* Progress Bar Container */}
      <div className="w-full max-w-xs bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200 mb-6">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-4 text-xs font-semibold">
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1.5 transition-colors ${
              idx <= currentStepIndex ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                idx <= currentStepIndex ? 'text-indigo-600' : 'text-slate-300'
              }`}
            />
            <span className="hidden sm:inline">{step.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
