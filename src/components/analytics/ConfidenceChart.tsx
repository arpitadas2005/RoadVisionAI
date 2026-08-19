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
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-slate-900 flex flex-col h-full shadow-sm">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-1">
        AI Certainty & Confidence Distribution
      </h3>
      <p className="text-xs text-slate-500 font-medium mb-4">Model detection confidence score distribution</p>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
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
            <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
