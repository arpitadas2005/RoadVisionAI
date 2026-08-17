import React from 'react';

interface HealthGaugeCardProps {
  score: number; // 0 to 100
}

export const HealthGaugeCard: React.FC<HealthGaugeCardProps> = ({ score }) => {
  let label = 'EXCELLENT';
  let colorClass = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
  let barColor = 'bg-emerald-500';

  if (score < 50) {
    label = 'CRITICAL HAZARD';
    colorClass = 'text-red-400 border-red-500/40 bg-red-500/10';
    barColor = 'bg-red-500';
  } else if (score < 75) {
    label = 'MODERATE DEGRADATION';
    colorClass = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    barColor = 'bg-amber-500';
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Road Health Condition Score
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Aggregate visual surface health index</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
          {label}
        </span>
      </div>

      <div className="flex items-end gap-3 my-3">
        <span className="text-4xl font-extrabold font-mono text-slate-50">{score}</span>
        <span className="text-sm text-slate-400 font-semibold mb-1">/ 100 Index Score</span>
      </div>

      {/* Health Bar */}
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
        <span>0 (Critical)</span>
        <span>50 (Warning)</span>
        <span>100 (Safe)</span>
      </div>
    </div>
  );
};
