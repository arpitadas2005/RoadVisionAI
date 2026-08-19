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
  accentColor?: 'cyan' | 'red' | 'amber' | 'emerald' | 'indigo' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'indigo',
}) => {
  const accentBorders = {
    indigo: 'border-l-4 border-l-indigo-600',
    purple: 'border-l-4 border-l-purple-600',
    cyan: 'border-l-4 border-l-cyan-600',
    red: 'border-l-4 border-l-red-500',
    amber: 'border-l-4 border-l-amber-500',
    emerald: 'border-l-4 border-l-emerald-500',
  };

  const iconBgColors = {
    indigo: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    purple: 'bg-purple-50 text-purple-600 border border-purple-100',
    cyan: 'bg-cyan-50 text-cyan-600 border border-cyan-100',
    red: 'bg-red-50 text-red-600 border border-red-100',
    amber: 'bg-amber-50 text-amber-600 border border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  };

  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-2xl p-5 text-slate-900 transition-all hover:shadow-md hover:border-slate-300 shadow-sm ${accentBorders[accentColor]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl shadow-xs ${iconBgColors[accentColor]}`}>{icon}</div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          {value}
        </div>
        {trend && (
          <span
            className={`text-xs font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
              trend.isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-2 text-xs font-medium text-slate-500">{subtitle}</p>}
    </div>
  );
};
