import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDetectionById } from '../services/storageService';
import { DetectionResult } from '../types';
import { AnnotatedCanvas } from '../components/result/AnnotatedCanvas';
import { DetectionSummary } from '../components/result/DetectionSummary';
import { ExportReportModal } from '../components/result/ExportReportModal';
import { ErrorState } from '../components/common/ErrorState';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button';

export const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<DetectionResult | null>(null);
  const [selectedDefectId, setSelectedDefectId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const found = getDetectionById(id);
      if (found) {
        setResult(found);
      }
    }
  }, [id]);

  if (!result) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState
          title="Inspection Record Not Found"
          message={`No road detection entry matches ID "${id}". It may have been deleted or not saved.`}
          onRetry={() => navigate('/detect')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Result Page Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/detect">
            <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                AI Visual Inspection Result
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                {result.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Annotated bounding box analysis and road hazard report
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/detect">
            <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>
              Inspect Another Road
            </Button>
          </Link>
        </div>
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Visual Canvas Viewer (7 Columns on Large Screens) */}
        <div className="lg:col-span-7">
          <AnnotatedCanvas
            result={result}
            selectedDefectId={selectedDefectId}
            onSelectDefect={setSelectedDefectId}
          />
        </div>

        {/* Right Defect & Health Summary Panel (5 Columns) */}
        <div className="lg:col-span-5">
          <DetectionSummary
            result={result}
            selectedDefectId={selectedDefectId}
            onSelectDefect={setSelectedDefectId}
            onExport={() => setIsExportModalOpen(true)}
          />
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        result={result}
      />
    </div>
  );
};
