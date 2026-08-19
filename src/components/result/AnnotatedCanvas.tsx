import React, { useRef, useEffect, useState } from 'react';
import { DetectionResult } from '../../types';
import { drawBoundingBoxesOnCanvas } from '../../utils/canvasUtils';
import { Layers, Eye, EyeOff } from 'lucide-react';

interface AnnotatedCanvasProps {
  result: DetectionResult;
  selectedDefectId: string | null;
  onSelectDefect: (id: string | null) => void;
}

export const AnnotatedCanvas: React.FC<AnnotatedCanvasProps> = ({
  result,
  selectedDefectId,
  onSelectDefect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [showOverlays, setShowOverlays] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'safe'>('all');

  const renderCanvas = () => {
    if (!canvasRef.current || !imageRef.current || !showOverlays) {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      return;
    }
    drawBoundingBoxesOnCanvas(
      canvasRef.current,
      imageRef.current,
      result.detections,
      selectedDefectId,
      severityFilter
    );
  };

  useEffect(() => {
    renderCanvas();
    window.addEventListener('resize', renderCanvas);
    return () => window.removeEventListener('resize', renderCanvas);
  }, [result, selectedDefectId, showOverlays, severityFilter]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 flex flex-col h-full shadow-sm">
      {/* Canvas Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-900">AI Visual Overlay Viewer</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
            {result.detections.length} Boxes
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Box Visibility */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
              showOverlays
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {showOverlays ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showOverlays ? 'Hide Boxes' : 'Show Boxes'}</span>
          </button>

          {/* Severity Filter Dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="warning">Warning Only</option>
            <option value="safe">Safe Only</option>
          </select>
        </div>
      </div>

      {/* Main Image + Overlay Canvas Wrapper */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-900 flex items-center justify-center shadow-inner"
      >
        <img
          ref={imageRef}
          src={result.originalMediaUrl}
          alt={result.locationName}
          onLoad={renderCanvas}
          className="w-full h-full object-contain"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>

      {/* Footer Diagnostic Notice */}
      <div className="mt-3 text-[11px] text-slate-500 font-medium flex items-center justify-between">
        <span>Source: {result.filename || 'Camera Capture'}</span>
        <span>Processing Latency: {result.processingTimeMs}ms</span>
      </div>
    </div>
  );
};
