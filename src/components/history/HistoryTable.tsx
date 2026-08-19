import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DetectionResult } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { DamageBadge } from '../common/DamageBadge';
import { formatDate } from '../../utils/formatters';
import { Eye, Trash2, MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';

interface HistoryTableProps {
  history: DetectionResult[];
  onDelete: (id: string) => void;
  onResetFilters: () => void;
  pageSize?: number;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  history,
  onDelete,
  onResetFilters,
  pageSize = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (history.length === 0) {
    return (
      <EmptyState
        title="No Detection Data Available Yet"
        message="No inspection logs match your search or filters. Perform a new AI road scan to generate history."
        actionText="Analyze a Road Image"
        onAction={onResetFilters}
      />
    );
  }

  const totalPages = Math.ceil(history.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = history.slice(startIndex, startIndex + pageSize);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Inspection Media</th>
                <th className="py-3.5 px-4">Location & Timestamp</th>
                <th className="py-3.5 px-4">Health Index</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Detected Defects</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-xs">
                        <img
                          src={item.originalMediaUrl}
                          alt={item.locationName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <div className="font-mono text-indigo-700 font-bold">{item.id}</div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">{item.inputSource} source</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate max-w-[200px]">{item.locationName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatDate(item.timestamp)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-sm font-extrabold text-slate-900">
                      {item.roadConditionScore}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium"> /100</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <SeverityBadge severity={item.overallSeverity} size="sm" />
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {item.detections.length === 0 ? (
                        <span className="text-emerald-700 text-[11px] font-bold">Normal Surface</span>
                      ) : (
                        item.detections.map((d) => (
                          <DamageBadge key={d.id} type={d.type} />
                        ))
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/result/${item.id}`}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors border border-slate-200 shadow-xs"
                        title="View Inspection Result"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors border border-slate-200 shadow-xs"
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

      {/* Mobile Card List View */}
      <div className="block md:hidden space-y-3">
        {paginatedItems.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200/80 rounded-3xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-700">{item.id}</span>
              <SeverityBadge severity={item.overallSeverity} size="sm" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-xs">
                <img src={item.originalMediaUrl} alt={item.locationName} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-600 shrink-0" />
                  <span className="truncate">{item.locationName}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">{formatDate(item.timestamp)}</div>
                <div className="text-xs font-mono font-bold text-slate-900">
                  Health Index: {item.roadConditionScore}/100
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex flex-wrap gap-1">
                {item.detections.length === 0 ? (
                  <span className="text-emerald-700 text-[10px] font-bold">Normal Surface</span>
                ) : (
                  item.detections.map((d) => <DamageBadge key={d.id} type={d.type} />)
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/result/${item.id}`}
                  className="px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </Link>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-3xl text-xs shadow-sm">
          <div className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{startIndex + 1}</strong> to{' '}
            <strong className="text-slate-900">{Math.min(startIndex + pageSize, history.length)}</strong> of{' '}
            <strong className="text-slate-900">{history.length}</strong> inspections
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>

            <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs font-bold">
              Page {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              icon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
