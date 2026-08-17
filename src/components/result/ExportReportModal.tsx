import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { DetectionResult } from '../../types';
import { Download, Printer, Check, Copy } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: DetectionResult;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `road_damage_report_${result.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Road Inspection Report" maxWidth="xl">
      <div className="space-y-4">
        {/* Printable Summary Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3 font-mono">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-cyan-400 font-bold">
            <span>MUNICIPAL ROAD SURVEY AUDIT</span>
            <span>ID: {result.id}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div><span className="text-slate-500">Location:</span> {result.locationName}</div>
            <div><span className="text-slate-500">Date/Time:</span> {formatDate(result.timestamp)}</div>
            <div><span className="text-slate-500">Health Index:</span> {result.roadConditionScore}/100</div>
            <div><span className="text-slate-500">Severity:</span> {result.overallSeverity.toUpperCase()}</div>
            <div><span className="text-slate-500">Defects Found:</span> {result.detections.length}</div>
            <div><span className="text-slate-500">AI Latency:</span> {result.processingTimeMs}ms</div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-slate-500 block mb-1">Itemized Defects:</span>
            {result.detections.map((d, i) => (
              <div key={i} className="text-slate-300 py-0.5">
                • [{d.type.toUpperCase()}] {d.label} - Confidence: {(d.confidence * 100).toFixed(1)}% ({d.severity})
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={handleCopyJson} icon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}>
            {copied ? 'Copied JSON!' : 'Copy JSON'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadJson} icon={<Download className="w-4 h-4" />}>
            Download JSON
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} icon={<Printer className="w-4 h-4" />}>
            Print Report
          </Button>
        </div>
      </div>
    </Modal>
  );
};
