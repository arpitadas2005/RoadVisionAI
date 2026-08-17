import React from 'react';
import { FilterOptions } from '../../types';
import { Search, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';

interface FilterBarProps {
  filters: FilterOptions;
  onChange: (updated: FilterOptions) => void;
  onReset: () => void;
  onClearAll: () => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  onClearAll,
  totalCount,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Bar Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search by location, filename, or hazard label..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset Filters
          </Button>
          <Button variant="danger" size="sm" onClick={onClearAll} icon={<Trash2 className="w-3.5 h-3.5" />}>
            Clear History
          </Button>
        </div>
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/80 text-xs">
        {/* Damage Type Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Damage Type:</span>
          <select
            value={filters.damageType}
            onChange={(e) => onChange({ ...filters, damageType: e.target.value })}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Defect Types</option>
            <option value="pothole">Pothole</option>
            <option value="crack">Road Crack</option>
            <option value="surface_damage">Surface Damage</option>
            <option value="other_defect">Other Defect</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Severity:</span>
          <select
            value={filters.severity}
            onChange={(e) => onChange({ ...filters, severity: e.target.value })}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="safe">Safe</option>
          </select>
        </div>

        {/* Sort Order Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Sort By:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="severity">Highest Severity</option>
            <option value="health_asc">Lowest Health Score</option>
          </select>
        </div>

        <div className="ml-auto text-slate-400 font-mono text-[11px]">
          Showing <span className="text-cyan-400 font-bold">{totalCount}</span> entries
        </div>
      </div>
    </div>
  );
};
