import React, { useState } from 'react';
import { getHistory, getDashboardStats } from '../services/storageService';
import { DamageTypeChart } from '../components/dashboard/DamageTypeChart';
import { SeverityChart } from '../components/dashboard/SeverityChart';
import { TrendLineChart } from '../components/analytics/TrendLineChart';
import { ConfidenceChart } from '../components/analytics/ConfidenceChart';
import { InsightsCard } from '../components/analytics/InsightsCard';
import { BarChart3, Download } from 'lucide-react';
import { Button } from '../components/common/Button';

export const AnalyticsPage: React.FC = () => {
  const [history] = useState(getHistory());
  const [stats] = useState(getDashboardStats());

  const handleExportCsv = () => {
    const headers = ['ID', 'Date', 'Location', 'Severity', 'Condition Score', 'Defects Count'];
    const rows = history.map((item) => [
      item.id,
      item.timestamp,
      `"${item.locationName.replace(/"/g, '""')}"`,
      item.overallSeverity,
      item.roadConditionScore,
      item.detections.length,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `road_damage_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-50 tracking-tight flex items-center gap-2">
            Infrastructure Visual Analytics & Trends
          </h2>
          <p className="text-xs text-slate-400">
            Macro statistics, defect frequency analysis, AI certainty ratings, and operational trends
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleExportCsv} icon={<Download className="w-4 h-4" />}>
          Export Analytics CSV
        </Button>
      </div>

      {/* Operational Recommendations Card */}
      <InsightsCard stats={stats} />

      {/* Charts Grid (2x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80">
          <TrendLineChart history={history} />
        </div>
        <div className="h-80">
          <DamageTypeChart history={history} />
        </div>
        <div className="h-80">
          <SeverityChart history={history} />
        </div>
        <div className="h-80">
          <ConfidenceChart history={history} />
        </div>
      </div>
    </div>
  );
};
