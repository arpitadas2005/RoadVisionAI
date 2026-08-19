import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DetectionResult } from '../../types';

interface TrendLineChartProps {
  history: DetectionResult[];
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ history }) => {
  // Group detection runs by day
  const dailyCounts: Record<string, { date: string; total: string; defects: number }> = {};

  history.slice().reverse().forEach((item) => {
    const d = new Date(item.timestamp);
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!dailyCounts[key]) {
      dailyCounts[key] = { date: key, total: item.id, defects: 0 };
    }
    dailyCounts[key].defects += item.detections.length;
  });

  const data = Object.values(dailyCounts);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-slate-900 flex flex-col h-full shadow-sm">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-1">
        Detection Trend & Hazard Volume
      </h3>
      <p className="text-xs text-slate-500 font-medium mb-4">Total detected road defects over recent inspection cycles</p>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E2E8F0',
                borderRadius: '12px',
                color: '#0F172A',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="defects"
              stroke="#4F46E5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#indigoGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
