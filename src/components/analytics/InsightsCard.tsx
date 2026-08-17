import React from 'react';
import { Lightbulb, AlertOctagon, TrendingUp, ShieldCheck } from 'lucide-react';
import { DashboardStats } from '../../types';

interface InsightsCardProps {
  stats: DashboardStats;
}

export const InsightsCard: React.FC<InsightsCardProps> = ({ stats }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-slate-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Smart City Operational Insights
          </h3>
          <p className="text-xs text-slate-400">Automated maintenance prioritization recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-red-400 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4" />
            High Priority Repair Clusters
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Potholes comprise {stats.mostCommonType} hazards. Immediate dispatch is advised for North Avenue & Expressway sectors.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            Preventative Micro-Surfacing
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Raveling and linear crack counts indicate early binder oxidation. Slurry sealing will prevent sub-grade breakdown.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Model Accuracy Audit
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI confidence ratings average {(stats.averageConfidence * 100).toFixed(1)}%, ensuring minimal false positive survey logs.
          </p>
        </div>
      </div>
    </div>
  );
};
