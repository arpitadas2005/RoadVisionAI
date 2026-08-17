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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-full">
      {/* Canvas Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">AI Visual Overlay Viewer</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            {result.detections.length} Boxes
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Box Visibility */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              showOverlays
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {showOverlays ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showOverlays ? 'Hide Boxes' : 'Show Boxes'}</span>
          </button>

          {/* Severity Filter Dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none focus:border-cyan-400"
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
        className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center"
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
      <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Source: {result.filename || 'Camera Capture'}</span>
        <span>Processing Latency: {result.processingTimeMs}ms</span>
      </div>
    </div>
  );
};
