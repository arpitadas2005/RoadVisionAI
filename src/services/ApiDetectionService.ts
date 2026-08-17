import type { DetectionResult, InputSource, SeverityLevel, DamageType } from '../types';
import type { IDetectionService } from './IDetectionService';
import { saveDetection } from './storageService';

// Standard Backend API Payload Schema
export interface ApiDetectionResponse {
  detections: Array<{
    damage_type: string; // 'pothole' | 'crack' | 'surface_damage' | 'other_defect'
    confidence: number; // 0.0 to 1.0
    bounding_box: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    severity: string; // 'critical' | 'warning' | 'safe'
    description?: string;
    recommended_action?: string;
  }>;
  overall_condition?: string;
  road_condition_score?: number;
  processing_time_ms?: number;
  location_name?: string;
}

export class ApiDetectionService implements IDetectionService {
  private apiUrl: string;
  private apiKey: string;
  private timeoutMs: number;

  constructor(
    apiUrl: string = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api/v1/detect',
    apiKey: string = import.meta.env.VITE_AI_API_KEY || '',
    timeoutMs: number = 15000
  ) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.timeoutMs = timeoutMs;
  }

  public getServiceStatus() {
    return {
      isMock: false,
      engineName: 'Real PyTorch / YOLO Backend API',
      version: 'v1.0.0-remote',
      endpoint: this.apiUrl,
    };
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const res = await fetch(this.apiUrl.replace(/\/detect$/, '/health'), {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  }

  public async detectImage(file: File | Blob, customLocation?: string): Promise<DetectionResult> {
    const startTime = performance.now();
    const isVideo = file.type.startsWith('video');
    const inputSource: InputSource = isVideo ? 'video' : 'image';
    const objectUrl = URL.createObjectURL(file);
    const fileName = (file as File).name || 'inspection_media.jpg';
    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    const formData = new FormData();
    formData.append('file', file);
    if (customLocation) {
      formData.append('location', customLocation);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers: Record<string, string> = {};
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    let response: Response;
    try {
      response = await fetch(this.apiUrl, {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`AI API request timed out after ${this.timeoutMs / 1000} seconds.`);
      }
      throw new Error(`Failed to connect to AI API endpoint at ${this.apiUrl}. Check backend server status.`);
    }

    if (!response.ok) {
      if (response.status === 413) {
        throw new Error('File size too large for the AI backend API processing limit.');
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication failed. Valid API Key required in configuration.');
      }
      const errText = await response.text().catch(() => '');
      throw new Error(`AI Backend returned HTTP error ${response.status}: ${errText || response.statusText}`);
    }

    let apiData: ApiDetectionResponse;
    try {
      apiData = await response.json();
    } catch {
      throw new Error('Invalid JSON response format returned by the AI detection server.');
    }

    if (!apiData || !Array.isArray(apiData.detections)) {
      throw new Error('Malformed AI detection payload: expected "detections" array in JSON response.');
    }

    // Normalize detections
    const detections = apiData.detections.map((d, index) => {
      let type: DamageType = 'other_defect';
      const rawType = (d.damage_type || '').toLowerCase();
      if (rawType.includes('pothole')) type = 'pothole';
      else if (rawType.includes('crack')) type = 'crack';
      else if (rawType.includes('surface') || rawType.includes('raveling')) type = 'surface_damage';

      let severity: SeverityLevel = 'warning';
      const rawSev = (d.severity || '').toLowerCase();
      if (rawSev.includes('critical') || rawSev.includes('high')) severity = 'critical';
      else if (rawSev.includes('safe') || rawSev.includes('low') || rawSev.includes('normal')) severity = 'safe';

      return {
        id: `det-${Date.now()}-${index}`,
        type,
        label: d.damage_type || 'Road Defect',
        confidence: typeof d.confidence === 'number' ? Math.min(1.0, Math.max(0.0, d.confidence)) : 0.85,
        severity,
        box: {
          x: d.bounding_box?.x ?? 20,
          y: d.bounding_box?.y ?? 20,
          width: d.bounding_box?.width ?? 30,
          height: d.bounding_box?.height ?? 30,
        },
        description: d.description || `${d.damage_type} hazard detected by neural model.`,
        recommendedAction: d.recommended_action || 'Inspect road location during scheduled maintenance.',
      };
    });

    // Compute overall severity
    let overallSeverity: SeverityLevel = 'safe';
    if (detections.some((d) => d.severity === 'critical')) {
      overallSeverity = 'critical';
    } else if (detections.some((d) => d.severity === 'warning')) {
      overallSeverity = 'warning';
    }

    // Compute condition score
    let roadConditionScore = apiData.road_condition_score;
    if (typeof roadConditionScore !== 'number') {
      if (overallSeverity === 'critical') roadConditionScore = 35;
      else if (overallSeverity === 'warning') roadConditionScore = 70;
      else roadConditionScore = 95;
    }

    const endTime = performance.now();
    const result: DetectionResult = {
      id: `api-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      inputSource,
      originalMediaUrl: objectUrl,
      detections,
      overallSeverity,
      roadConditionScore,
      processingTimeMs: apiData.processing_time_ms || Math.round(endTime - startTime),
      locationName: customLocation || apiData.location_name || 'API Survey Sector',
      filename: fileName,
      fileSize: fileSizeMb,
      resolution: '1920x1080',
      isSimulated: false,
    };

    saveDetection(result);
    return result;
  }

  public async detectFromSample(_sampleId: string): Promise<DetectionResult> {
    throw new Error('Sample testing is intended for mock engine mode. Upload an image to analyze with real API.');
  }

  public async detectVideoFrame(_mediaUrl: string): Promise<DetectionResult> {
    throw new Error('Direct video frame detection via URL requires file upload.');
  }
}
