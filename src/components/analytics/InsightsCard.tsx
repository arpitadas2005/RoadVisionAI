import React from 'react';
import { Lightbulb, AlertOctagon, TrendingUp, ShieldCheck } from 'lucide-react';
import { DashboardStats } from '../../types';

interface InsightsCardProps {
  stats: DashboardStats;
}

export const InsightsCard: React.FC<InsightsCardProps> = ({ stats }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-slate-900 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            Smart City Operational Insights
          </h3>
          <p className="text-xs text-slate-500 font-medium">Automated maintenance prioritization recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
          <div className="text-xs font-bold text-red-600 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4" />
            High Priority Repair Clusters
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Potholes comprise {stats.mostCommonType} hazards. Immediate dispatch is advised for North Avenue & Expressway sectors.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
          <div className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            Preventative Micro-Surfacing
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Raveling and linear crack counts indicate early binder oxidation. Slurry sealing will prevent sub-grade breakdown.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Model Accuracy Audit
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            AI confidence ratings average {(stats.averageConfidence * 100).toFixed(1)}%, ensuring minimal false positive survey logs.
          </p>
        </div>
      </div>
    </div>
  );
};
