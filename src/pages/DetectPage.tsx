import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadZone } from '../components/detect/UploadZone';
import { CameraStream } from '../components/detect/CameraStream';
import { SampleLoader } from '../components/detect/SampleLoader';
import { ImagePreview } from '../components/detect/ImagePreview';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import {
  getActiveDetectionService,
  getStoredEngineMode,
  setStoredEngineMode,
  getStoredApiUrl,
  setStoredApiUrl,
  getStoredApiKey,
  setStoredApiKey,
  EngineMode,
} from '../services/detectionServiceFactory';
import { MockDetectionService } from '../services/MockDetectionService';
import { Upload, Camera, Sparkles, Server, Settings, Check, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button';

export const DetectPage: React.FC = () => {
  const navigate = useNavigate();

  const [engineMode, setEngineModeState] = useState<EngineMode>(getStoredEngineMode());
  const [apiUrl, setApiUrlState] = useState<string>(getStoredApiUrl());
  const [apiKey, setApiKeyState] = useState<string>(getStoredApiKey());
  const [showConfig, setShowConfig] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'failed'; message?: string }>({ status: 'idle' });

  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [locationTag, setLocationTag] = useState<string>('Sector B-4 (Survey Location)');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEngineModeChange = (mode: EngineMode) => {
    setEngineModeState(mode);
    setStoredEngineMode(mode);
  };

  const handleSaveConfig = () => {
    setStoredApiUrl(apiUrl);
    setStoredApiKey(apiKey);
    setShowConfig(false);
  };

  const handleTestConnection = async () => {
    setTestResult({ status: 'testing' });
    const service = getActiveDetectionService();
    if (service.checkHealth) {
      const isOk = await service.checkHealth();
      if (isOk) {
        setTestResult({ status: 'success', message: 'Connected successfully to AI backend endpoint.' });
      } else {
        setTestResult({ status: 'failed', message: `Could not reach endpoint at ${apiUrl}. Make sure backend server is running.` });
      }
    } else {
      setTestResult({ status: 'success', message: 'Simulated Engine Ready.' });
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMsg(null);
  };

  const handleSampleSelect = async (sampleId: string) => {
    try {
      setIsAnalyzing(true);
      setErrorMsg(null);
      const mockService = new MockDetectionService();
      const result = await mockService.detectFromSample(sampleId);
      navigate(`/result/${result.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process sample image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile) return;

    try {
      setIsAnalyzing(true);
      setErrorMsg(null);

      const detectionService = getActiveDetectionService();
      const result = await detectionService.detectImage(selectedFile, locationTag);

      navigate(`/result/${result.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'AI processing failed. Check connection or media format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMsg(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
            Road Damage Detection Workspace
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Upload media, capture live camera frames, or connect custom PyTorch / YOLO backend API
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfig(!showConfig)}
          icon={<Settings className="w-4 h-4" />}
        >
          {showConfig ? 'Hide Config' : 'AI Engine Settings'}
        </Button>
      </div>

      {/* AI Engine Selection Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Active Detection Engine Mode:
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEngineModeChange('mock')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                engineMode === 'mock'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulated Engine (Mock)</span>
            </button>

            <button
              onClick={() => handleEngineModeChange('api')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                engineMode === 'api'
                  ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Real AI API Endpoint</span>
            </button>
          </div>
        </div>

        {/* Engine Description Notice */}
        <div className="text-xs text-slate-600 font-medium">
          {engineMode === 'mock' ? (
            <span className="flex items-center gap-1.5 text-indigo-700">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              Executing on <strong>Simulated Computer Vision Service</strong>. Visual annotations, bounding boxes, and severity ratings are generated locally.
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-800">
              <Server className="w-3.5 h-3.5 shrink-0" />
              Configured to send POST requests to endpoint: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-amber-900 border border-slate-200">{apiUrl}</code>.
            </span>
          )}
        </div>

        {/* Expandable Configuration Drawer */}
        {(showConfig || engineMode === 'api') && (
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  AI Model Endpoint URL (POST multipart/form-data)
                </label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrlState(e.target.value)}
                  placeholder="http://localhost:8000/api/v1/detect"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Authorization API Key (Optional)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKeyState(e.target.value)}
                  placeholder="Bearer token or API secret"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTestConnection}
                isLoading={testResult.status === 'testing'}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Test API Connection
              </Button>

              <Button variant="secondary" size="sm" onClick={handleSaveConfig} icon={<Check className="w-3.5 h-3.5" />}>
                Save API Config
              </Button>
            </div>

            {testResult.message && (
              <div
                className={`p-2.5 rounded-xl text-xs font-mono border ${
                  testResult.status === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {testResult.message}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mode Switcher Tabs (File vs Camera) */}
      <div className="flex items-center gap-2 p-1 bg-white border border-slate-200/80 rounded-2xl w-fit shadow-xs">
        <button
          onClick={() => {
            setActiveTab('upload');
            handleClear();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload File (Image / Video)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('camera');
            handleClear();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'camera'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Live Webcam Stream</span>
        </button>
      </div>

      {/* Error Banner */}
      {errorMsg && <ErrorState title="Detection Error" message={errorMsg} onRetry={handleClear} />}

      {/* Loading State */}
      {isAnalyzing && <LoadingState />}

      {/* Workspace Body */}
      {!isAnalyzing && (
        <>
          {previewUrl && selectedFile ? (
            <ImagePreview
              mediaUrl={previewUrl}
              filename={selectedFile.name}
              isAnalyzing={isAnalyzing}
              onClear={handleClear}
              onAnalyze={handleRunAnalysis}
              location={locationTag}
              setLocation={setLocationTag}
            />
          ) : (
            <>
              {activeTab === 'upload' ? (
                <UploadZone onFileSelect={handleFileSelect} />
              ) : (
                <CameraStream onCapture={handleFileSelect} />
              )}

              {/* Sample Preset Selector */}
              <SampleLoader onSelectSample={handleSampleSelect} />
            </>
          )}
        </>
      )}
    </div>
  );
};
