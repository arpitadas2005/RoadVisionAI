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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col h-full space-y-5">
      {/* Overall Condition Score Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overall Road Health Index
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold font-mono text-slate-50">
              {result.roadConditionScore}
            </span>
            <span className="text-xs text-slate-400">/ 100 Health Score</span>
          </div>
        </div>
        <SeverityBadge severity={result.overallSeverity} size="md" />
      </div>

      {/* Location & Metadata Info Card */}
      <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{result.locationName}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {formatDate(result.timestamp)}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
            {result.processingTimeMs} ms AI speed
          </span>
        </div>
      </div>

      {/* Itemized Defect List Header */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Detected Road Defects ({result.detections.length})
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">
            Hover to highlight box
          </span>
        </div>

        {result.detections.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <DamageBadge type={det.type} />
                      <span className="text-xs font-bold text-slate-100">{det.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {formatPercentage(det.confidence)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Model Confidence</span>
                    </div>
                  </div>

                  {det.description && (
                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                      {det.description}
                    </p>
                  )}

                  {det.recommendedAction && (
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-300/90 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
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
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="font-bold text-slate-300 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          AI Prediction Transparency & Review
        </div>
        <p className="leading-relaxed text-[10px]">
          Confidence scores represent neural model visual certainty, not guaranteed physical structural inspection. Important repair decisions should be verified by a certified field surveyor.
        </p>
      </div>

      {/* Export Action Buttons */}
      <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
        <Button
          variant="primary"
          size="md"
          className="flex-1"
          onClick={onExport}
          icon={<FileText className="w-4 h-4" />}
        >
          Export Inspection Report
        </Button>
      </div>
    </div>
  );
};
