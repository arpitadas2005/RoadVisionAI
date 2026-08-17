import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface CameraStreamProps {
  onCapture: (file: File) => void;
}

export const CameraStream: React.FC<CameraStreamProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        setIsInitializing(true);
        setError(null);
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        setStream(activeStream);
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
      } catch (err: any) {
        console.warn('Camera access denied or unavailable:', err);
        setError('Camera access unavailable or permission denied. Please allow camera permissions or upload an image file instead.');
      } finally {
        setIsInitializing(false);
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `live_webcam_inspection_${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });
        onCapture(file);
      }
    }, 'image/jpeg', 0.92);
  };

  if (error) {
    return (
      <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-full w-fit mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-200 mb-1">Webcam Input Unavailable</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
      <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden mb-4 border border-slate-800">
        {isInitializing && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-cyan-400 font-mono bg-slate-950">
            Initializing Live Camera Feed...
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-[10px] font-mono font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          LIVE CAMERA FEED
        </div>
      </div>

      <Button
        variant="primary"
        size="md"
        onClick={handleCaptureSnapshot}
        icon={<Camera className="w-4 h-4" />}
        disabled={isInitializing}
      >
        Capture Frame for AI Analysis
      </Button>
    </div>
  );
};
