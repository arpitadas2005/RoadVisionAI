import React from 'react';
import { DetectionResult } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { DamageBadge } from '../common/DamageBadge';
import { formatPercentage, formatDate } from '../../utils/formatters';
import { MapPin, Calendar, Clock, AlertTriangle, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '../common/Button';

interface DetectionSummaryProps {
  result: DetectionResult;
  selectedDefectId: string | null;
  onSelectDefect: (id: string | null) => void;
  onExport: () => void;
}

export const DetectionSummary: React.FC<DetectionSummaryProps> = ({
  result,
  selectedDefectId,
  onSelectDefect,
  onExport,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col h-full space-y-5 shadow-sm">
      {/* Overall Condition Score Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Overall Road Health Index
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {result.roadConditionScore}
            </span>
            <span className="text-xs font-medium text-slate-500">/ 100 Health Score</span>
          </div>
        </div>
        <SeverityBadge severity={result.overallSeverity} size="md" />
      </div>

      {/* Location & Metadata Info Card */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="truncate">{result.locationName}</span>
        </div>
        <div className="flex items-center justify-between text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formatDate(result.timestamp)}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-indigo-600 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            {result.processingTimeMs} ms AI speed
          </span>
        </div>
      </div>

      {/* Itemized Defect List Header */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            Detected Road Defects ({result.detections.length})
          </h4>
          <span className="text-[10px] text-slate-500 font-mono font-medium">
            Hover to highlight box
          </span>
        </div>

        {result.detections.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>No defects detected. Road surface condition is safe and normal.</span>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {result.detections.map((det) => {
              const isSelected = selectedDefectId === det.id;
              return (
                <div
                  key={det.id}
                  onMouseEnter={() => onSelectDefect(det.id)}
                  onMouseLeave={() => onSelectDefect(null)}
                  onClick={() => onSelectDefect(isSelected ? null : det.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200/60 hover:border-slate-300 hover:bg-slate-100/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <DamageBadge type={det.type} />
                      <span className="text-xs font-bold text-slate-900">{det.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-indigo-600">
                        {formatPercentage(det.confidence)}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-medium">Model Confidence</span>
                    </div>
                  </div>

                  {det.description && (
                    <p className="text-xs text-slate-600 font-medium mb-2 leading-relaxed">
                      {det.description}
                    </p>
                  )}

                  {det.recommendedAction && (
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{det.recommendedAction}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trust & Model Verification Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 space-y-1">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
          AI Prediction Transparency & Review
        </div>
        <p className="leading-relaxed text-[10px] font-medium">
          Confidence scores represent neural model visual certainty, not guaranteed physical structural inspection. Important repair decisions should be verified by a certified field surveyor.
        </p>
      </div>

      {/* Export Action Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
        <Button
          variant="primary"
          size="md"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white"
          onClick={onExport}
          icon={<FileText className="w-4 h-4" />}
        >
          Export Inspection Report
        </Button>
      </div>
    </div>
  );
};
