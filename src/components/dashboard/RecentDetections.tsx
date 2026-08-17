import React from 'react';
import { Link } from 'react-router-dom';
import { DetectionResult } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { DamageBadge } from '../common/DamageBadge';
import { formatDate } from '../../utils/formatters';
import { ArrowRight, MapPin } from 'lucide-react';

interface RecentDetectionsProps {
  detections: DetectionResult[];
}

export const RecentDetections: React.FC<RecentDetectionsProps> = ({ detections }) => {
  const recent = detections.slice(0, 5);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Recent Inspection Activity
          </h3>
          <p className="text-xs text-slate-400">Latest road survey scans and AI results</p>
        </div>
        <Link
          to="/history"
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <span>View All Logs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">No recent inspections recorded.</div>
      ) : (
        <div className="space-y-3">
          {recent.map((item) => (
            <Link
              key={item.id}
              to={`/result/${item.id}`}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-800/50 transition-all group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                  <img
                    src={item.originalMediaUrl}
                    alt={item.locationName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 truncate">
                      {item.locationName}
                    </span>
                    <SeverityBadge severity={item.overallSeverity} size="sm" />
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {formatDate(item.timestamp)}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-cyan-400">
                      {item.detections.length} defect(s)
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 shrink-0">
                {item.detections.slice(0, 1).map((d) => (
                  <DamageBadge key={d.id} type={d.type} />
                ))}
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
