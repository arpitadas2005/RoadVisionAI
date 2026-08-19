import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DamageTypeChart } from '../components/dashboard/DamageTypeChart';
import { SeverityChart } from '../components/dashboard/SeverityChart';
import { TrendLineChart } from '../components/analytics/TrendLineChart';
import { ConfidenceChart } from '../components/analytics/ConfidenceChart';
import { InsightsCard } from '../components/analytics/InsightsCard';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Download, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [history, setHistory] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch User Detections for Charts
      const detRes = await fetch('http://localhost:8000/api/v1/detections', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (detRes.ok) {
        const detData = await detRes.json();
        setHistory(detData);
      } else {
        setHistory([]);
      }

      // 2. Fetch User Summary Metrics
      const sumRes = await fetch('http://localhost:8000/api/v1/analytics/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummary(sumData);
      }
    } catch (err) {
      setError('Failed to connect to analytics service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [token]);

  const handleExportCsv = () => {
    if (history.length === 0) return;

    const headers = ['ID', 'Date', 'Location', 'Severity', 'Condition Score', 'Defects Count'];
    const rows = history.map((item) => [
      item.id,
      item.timestamp,
      `"${(item.locationName || '').replace(/"/g, '""')}"`,
      item.overallSeverity,
      item.roadConditionScore,
      item.detections?.length || 0,
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

  if (isLoading) {
    return <LoadingState title="Generating Analytics Dashboard..." message="Aggregating user inspection records from database..." />;
  }

  // Derive stats for InsightsCard
  const stats = {
    totalInspections: summary?.total_detections ?? history.length,
    totalDamagedImages: (summary?.critical_count || 0) + (summary?.high_count || 0) + (summary?.medium_count || 0),
    criticalCount: summary?.critical_count ?? history.filter((h) => h.overallSeverity === 'critical').length,
    warningCount: summary?.medium_count ?? history.filter((h) => h.overallSeverity === 'warning').length,
    safeCount: summary?.low_count ?? history.filter((h) => h.overallSeverity === 'safe').length,
    mostCommonType: summary?.most_common_damage_type || 'Pothole',
    averageConfidence: 0.92,
    averageConditionScore: summary?.average_road_health_index ?? 75,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Infrastructure Visual Analytics & Trends
          </h2>
          <p className="text-xs font-medium text-slate-500">
            User-isolated macro statistics, defect frequency analysis, AI certainty ratings, and operational trends
          </p>
        </div>

        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExportCsv} icon={<Download className="w-4 h-4" />}>
            Export Analytics CSV
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {history.length === 0 ? (
        <EmptyState
          title="No Detection Data Available Yet"
          message="You currently have 0 road inspection entries saved in the database. Perform a new AI road scan to generate visual analytics."
          actionText="Analyze a Road Image"
          onAction={() => navigate('/detect')}
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};
