import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DetectionResult } from '../../types';

interface SeverityChartProps {
  history: DetectionResult[];
}

export const SeverityChart: React.FC<SeverityChartProps> = ({ history }) => {
  const critical = history.filter((h) => h.overallSeverity === 'critical').length;
  const warning = history.filter((h) => h.overallSeverity === 'warning').length;
  const safe = history.filter((h) => h.overallSeverity === 'safe').length;

  const data = [
    { name: 'Critical', count: critical, color: '#ef4444' },
    { name: 'Warning', count: warning, color: '#f97316' },
    { name: 'Safe Surface', count: safe, color: '#10b981' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-slate-100 flex flex-col h-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-1">
        Severity Breakdown
      </h3>
      <p className="text-xs text-slate-400 mb-4">Categorization of inspected road locations</p>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
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
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
