import React from 'react';
import { StatCard } from '../common/StatCard';
import { DashboardStats } from '../../types';
import { Camera, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface KpiGridProps {
  stats: DashboardStats;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Detections"
        value={stats.totalInspections}
        subtitle={`${stats.totalDamagedImages} damaged surface locations`}
        icon={<Camera className="w-5 h-5" />}
        accentColor="cyan"
      />
      <StatCard
        title="Critical Damage"
        value={stats.criticalCount}
        subtitle="Severe potholes & sub-grade hazards"
        icon={<AlertOctagon className="w-5 h-5" />}
        accentColor="red"
      />
      <StatCard
        title="Warning Count"
        value={stats.warningCount}
        subtitle="Cracks & asphalt unraveling"
        icon={<AlertTriangle className="w-5 h-5" />}
        accentColor="amber"
      />
      <StatCard
        title="Safe Road Surface"
        value={stats.safeCount}
        subtitle={`Avg Road Score: ${stats.averageConditionScore}/100`}
        icon={<CheckCircle2 className="w-5 h-5" />}
        accentColor="emerald"
      />
    </div>
  );
};
