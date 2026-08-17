import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HistoryTable } from '../components/history/HistoryTable';
import { FilterBar } from '../components/history/FilterBar';
import { LoadingState } from '../components/common/LoadingState';
import { FilterOptions } from '../types';
import { Trash2, AlertTriangle, Search } from 'lucide-react';
import { Button } from '../components/common/Button';

export const HistoryPage: React.FC = () => {
  const { token } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state matching FilterOptions interface
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    severity: 'all',
    damageType: 'all',
    dateRange: 'all',
    sortBy: 'newest',
  });

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/api/v1/detections', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setRecords(data);
        setFilteredRecords(data);
      } else {
        setRecords([]);
        setFilteredRecords([]);
      }
    } catch (err) {
      setError('Unable to load inspection history from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  // Filter & Search Logic
  useEffect(() => {
    let result = [...records];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.locationName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.overallSeverity.toLowerCase().includes(q)
      );
    }

    if (filters.severity !== 'all') {
      result = result.filter((r) => r.overallSeverity.toLowerCase() === filters.severity.toLowerCase());
    }

    if (filters.damageType !== 'all') {
      result = result.filter((r) =>
        r.detections.some((d: any) => d.type?.toLowerCase() === filters.damageType.toLowerCase())
      );
    }

    setFilteredRecords(result);
  }, [filters, records]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      severity: 'all',
      damageType: 'all',
      dateRange: 'all',
      sortBy: 'newest',
    });
  };

  const handleDeleteRecord = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/detections/${deleteTargetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setRecords((prev) => prev.filter((r) => r.id !== deleteTargetId));
        setDeleteTargetId(null);
      } else {
        alert('Access Denied: You cannot delete this record or session expired.');
      }
    } catch (err) {
      alert('Failed to delete inspection record.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingState title="Loading Inspection History..." message="Retrieving survey logs from secure database..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h2 className="text-2xl font-black text-slate-50 tracking-tight">Inspection History Audit</h2>
          <p className="text-xs text-slate-400">Searchable log of previous AI road damage detection surveys</p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        onClearAll={() => setRecords([])}
        totalCount={filteredRecords.length}
      />

      {/* History Table / Records List */}
      <HistoryTable
        history={filteredRecords}
        onDelete={(id: string) => setDeleteTargetId(id)}
        onResetFilters={handleResetFilters}
      />

      {/* Confirmation Delete Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-500/10 rounded-2xl border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-50">Delete Inspection Record?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete inspection record <strong className="text-cyan-400">{deleteTargetId}</strong>? This action will permanently remove the record from your account history.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteTargetId(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-500 border-red-500"
                isLoading={isDeleting}
                onClick={handleDeleteRecord}
                icon={<Trash2 className="w-4 h-4" />}
              >
                Delete Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
