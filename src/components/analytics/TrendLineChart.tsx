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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-slate-100 flex flex-col h-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-1">
        Detection Trend & Hazard Volume
      </h3>
      <p className="text-xs text-slate-400 mb-4">Total detected road defects over recent inspection cycles</p>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="defects"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#cyanGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
