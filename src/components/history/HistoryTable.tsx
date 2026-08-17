import React from 'react';
import { Link } from 'react-router-dom';
import { DetectionResult } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { DamageBadge } from '../common/DamageBadge';
import { formatDate } from '../../utils/formatters';
import { Eye, Trash2, MapPin, Calendar, Clock } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface HistoryTableProps {
  history: DetectionResult[];
  onDelete: (id: string) => void;
  onResetFilters: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ history, onDelete, onResetFilters }) => {
  if (history.length === 0) {
    return (
      <EmptyState
        title="No Inspections Match Your Filter"
        message="Try resetting your search term, severity dropdown, or damage type criteria."
        actionText="Reset Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-slate-950/40">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4">Inspection Media</th>
              <th className="py-3.5 px-4">Location & Timestamp</th>
              <th className="py-3.5 px-4">Health Index</th>
              <th className="py-3.5 px-4">Severity</th>
              <th className="py-3.5 px-4">Detected Defects</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                {/* Media Thumbnail */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                      <img
                        src={item.originalMediaUrl}
                        alt={item.locationName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <div className="font-mono text-cyan-400 font-bold">{item.id}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{item.inputSource} source</div>
                    </div>
                  </div>
                </td>

                {/* Location & Time */}
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-100 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate max-w-[200px]">{item.locationName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {formatDate(item.timestamp)}
                  </div>
                </td>

                {/* Road Condition Health Score */}
                <td className="py-3 px-4">
                  <span className="font-mono text-sm font-extrabold text-slate-100">
                    {item.roadConditionScore}
                  </span>
                  <span className="text-[10px] text-slate-500"> /100</span>
                </td>

                {/* Severity Badge */}
                <td className="py-3 px-4">
                  <SeverityBadge severity={item.overallSeverity} size="sm" />
                </td>

                {/* Damage Badges */}
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {item.detections.length === 0 ? (
                      <span className="text-emerald-400 text-[11px] font-semibold">Normal Surface</span>
                    ) : (
                      item.detections.map((d) => (
                        <DamageBadge key={d.id} type={d.type} />
                      ))
                    )}
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/result/${item.id}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition-colors border border-slate-700 hover:border-cyan-500/40"
                      title="View Inspection Result"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors border border-slate-700 hover:border-red-500/40"
                      title="Delete History Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
