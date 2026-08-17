import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DetectionResult } from '../../types';

interface DamageTypeChartProps {
  history: DetectionResult[];
}

const COLORS = ['#ef4444', '#f97316', '#06b6d4', '#a855f7'];

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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-slate-100 flex flex-col h-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-1">
        Damage Type Distribution
      </h3>
      <p className="text-xs text-slate-400 mb-4">Breakdown by specific road defect classification</p>

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
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <Legend
              formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
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
