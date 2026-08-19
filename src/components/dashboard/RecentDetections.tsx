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
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-slate-900 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            Recent Inspection Activity
          </h3>
          <p className="text-xs text-slate-500 font-medium">Latest road survey scans and AI results</p>
        </div>
        <Link
          to="/history"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
        >
          <span>View All Logs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm font-medium">No recent inspections recorded.</div>
      ) : (
        <div className="space-y-3">
          {recent.map((item) => (
            <Link
              key={item.id}
              to={`/result/${item.id}`}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all group shadow-xs"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden shrink-0 shadow-xs">
                  <img
                    src={item.originalMediaUrl}
                    alt={item.locationName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {item.locationName}
                    </span>
                    <SeverityBadge severity={item.overallSeverity} size="sm" />
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {formatDate(item.timestamp)}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-indigo-600">
                      {item.detections.length} defect(s)
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 shrink-0">
                {item.detections.slice(0, 1).map((d) => (
                  <DamageBadge key={d.id} type={d.type} />
                ))}
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
