import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DetectionResult } from '../../types';

interface DamageTypeChartProps {
  history: DetectionResult[];
}

const COLORS = ['#4F46E5', '#F59E0B', '#06B6D4', '#8B5CF6'];

export const DamageTypeChart: React.FC<DamageTypeChartProps> = ({ history }) => {
  const typeCounts: Record<string, number> = {
    Pothole: 0,
    Crack: 0,
    'Surface Damage': 0,
    'Other Defect': 0,
  };

  history.forEach((item) => {
    item.detections.forEach((d) => {
      if (d.type === 'pothole') typeCounts['Pothole']++;
      else if (d.type === 'crack') typeCounts['Crack']++;
      else if (d.type === 'surface_damage') typeCounts['Surface Damage']++;
      else typeCounts['Other Defect']++;
    });
  });

  const data = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-slate-900 flex flex-col h-full shadow-sm">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-1">
        Damage Type Distribution
      </h3>
      <p className="text-xs text-slate-500 font-medium mb-4">Breakdown by specific road defect classification</p>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
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
            <Legend
              formatter={(value) => <span className="text-xs text-slate-600 font-bold">{value}</span>}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
