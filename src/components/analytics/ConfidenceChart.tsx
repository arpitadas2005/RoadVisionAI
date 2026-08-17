import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DetectionResult } from '../../types';

interface ConfidenceChartProps {
  history: DetectionResult[];
}

export const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ history }) => {
  const buckets = {
    '80-85%': 0,
    '85-90%': 0,
    '90-95%': 0,
    '95-100%': 0,
  };

  history.forEach((item) => {
    item.detections.forEach((d) => {
      const conf = d.confidence * 100;
      if (conf >= 95) buckets['95-100%']++;
      else if (conf >= 90) buckets['90-95%']++;
      else if (conf >= 85) buckets['85-90%']++;
      else buckets['80-85%']++;
    });
  });

  const data = Object.entries(buckets).map(([name, count]) => ({ name, count }));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-slate-100 flex flex-col h-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-1">
        AI Certainty & Confidence Distribution
      </h3>
      <p className="text-xs text-slate-400 mb-4">Model detection confidence score distribution</p>

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
            <Bar dataKey="count" fill="#22d3ee" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
