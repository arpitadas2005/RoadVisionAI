import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Video, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSizeMb?: number;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelect,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'],
  maxSizeMb = 25,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = (file: File) => {
    setErrorMsg(null);

    // Validate type
    const isAccepted = acceptedTypes.some((type) => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    });

    if (!isAccepted) {
      setErrorMsg(`Unsupported format (${file.type || 'unknown'}). Please upload a JPG, PNG, WebP, or MP4 file.`);
      return;
    }

    // Validate size
    if (file.size > maxSizeMb * 1024 * 1024) {
      setErrorMsg(`File size exceeds the ${maxSizeMb}MB maximum limit.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[260px] ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-500/10 scale-[0.99]'
            : 'border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900/90'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
          <Upload className="w-8 h-8" />
        </div>

        <h3 className="text-base font-bold text-slate-100 mb-1">
          Drag & drop road image or video here
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          Upload pavement photos, surveyor snapshots, or dashcam video streams for instant AI inspection.
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> JPG, PNG, WebP
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Video className="w-3.5 h-3.5 text-amber-400" /> MP4, WebM (Max {maxSizeMb}MB)
          </span>
        </div>

        <Button variant="secondary" size="sm" type="button" onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}>
          Browse Device Files
        </Button>
      </div>

      {errorMsg && (
        <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
