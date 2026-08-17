import type { DetectionResult } from '../types';

export interface IDetectionService {
  detectImage(file: File | Blob, customLocation?: string): Promise<DetectionResult>;
  detectFromSample(sampleId: string): Promise<DetectionResult>;
  detectVideoFrame(mediaUrl: string): Promise<DetectionResult>;
  getServiceStatus(): {
    isMock: boolean;
    engineName: string;
    version: string;
    endpoint?: string;
  };
  checkHealth?(): Promise<boolean>;
}
