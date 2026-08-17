import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'cyan' | 'red' | 'amber' | 'emerald';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'cyan',
}) => {
  const accentBorders = {
    cyan: 'border-l-4 border-l-cyan-500',
    red: 'border-l-4 border-l-red-500',
    amber: 'border-l-4 border-l-amber-500',
    emerald: 'border-l-4 border-l-emerald-500',
  };

  const iconBgColors = {
    cyan: 'bg-cyan-500/10 text-cyan-400',
    red: 'bg-red-500/10 text-red-400',
    amber: 'bg-amber-500/10 text-amber-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
  };

  return (
    <div
      className={`bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 text-slate-100 transition-all hover:border-slate-700 ${accentBorders[accentColor]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${iconBgColors[accentColor]}`}>{icon}</div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl lg:text-3xl font-extrabold text-slate-50 tracking-tight font-mono">
          {value}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold flex items-center gap-0.5 ${
              trend.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-2 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
