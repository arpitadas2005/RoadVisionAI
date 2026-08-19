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
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[260px] shadow-sm ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
            : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4 shadow-xs">
          <Upload className="w-8 h-8" />
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1">
          Drag & drop road image or video here
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mb-4 font-medium">
          Upload pavement photos, surveyor snapshots, or dashcam video streams for instant AI inspection.
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 font-semibold">
          <span className="flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600" /> JPG, PNG, WebP
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Video className="w-3.5 h-3.5 text-amber-600" /> MP4, WebM (Max {maxSizeMb}MB)
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
        <div className="mt-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
