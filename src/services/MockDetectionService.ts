import type { DetectionResult, InputSource } from '../types';
import type { IDetectionService } from './IDetectionService';
import { saveDetection } from './storageService';

export const SAMPLE_ROAD_IMAGES = [
  {
    id: 'sample-pothole',
    title: 'Severe Urban Pothole',
    subtitle: 'North Avenue & 4th Street',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1200&auto=format&fit=crop',
    type: 'Pothole + Crack',
    location: 'North Avenue & 4th Street Crossing',
  },
  {
    id: 'sample-crack',
    title: 'Highway Pavement Cracks',
    subtitle: 'Suburban Expressway Hwy 12',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
    type: 'Surface Raveling',
    location: 'Suburban Expressway Hwy 12, Km 42',
  },
  {
    id: 'sample-clean',
    title: 'New Asphalt Surface',
    subtitle: 'East Industrial Park Access Road',
    url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1200&auto=format&fit=crop',
    type: 'Normal / Safe Road',
    location: 'East Industrial Park Access Road',
  },
];

export class MockDetectionService implements IDetectionService {
  public getServiceStatus() {
    return {
      isMock: true,
      engineName: 'SmartRoad-Vision-YOLOv8 (Simulated Engine)',
      version: 'v1.4.2-demo',
    };
  }

  public async detectImage(file: File | Blob, customLocation?: string): Promise<DetectionResult> {
    const startTime = performance.now();
    const objectUrl = URL.createObjectURL(file);
    const fileName = (file as File).name || 'inspection_media.jpg';
    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    // Simulate AI inference calculation latency (1.1s)
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const isVideo = file.type.startsWith('video');
    const inputSource: InputSource = isVideo ? 'video' : 'image';

    const nameSeed = fileName.length + file.size;

    let overallSeverity: 'critical' | 'warning' | 'safe' = 'critical';
    let roadConditionScore = 44;
    let detections = [];

    if (nameSeed % 3 === 0) {
      overallSeverity = 'critical';
      roadConditionScore = 38;
      detections = [
        {
          id: `det-${Date.now()}-1`,
          type: 'pothole' as const,
          label: 'Critical Pothole',
          confidence: 0.95,
          severity: 'critical' as const,
          box: { x: 25, y: 42, width: 38, height: 32 },
          description: 'Deep pavement cavity exposing sub-grade layer with jagged edges.',
          recommendedAction: 'Immediate cold-patch filling & traffic diversion warning.',
        },
        {
          id: `det-${Date.now()}-2`,
          type: 'crack' as const,
          label: 'Transverse Crack',
          confidence: 0.89,
          severity: 'warning' as const,
          box: { x: 65, y: 30, width: 25, height: 48 },
          description: 'Thermal stress crack extending across lane width.',
          recommendedAction: 'Rubberized asphalt sealant application.',
        },
      ];
    } else if (nameSeed % 3 === 1) {
      overallSeverity = 'warning';
      roadConditionScore = 71;
      detections = [
        {
          id: `det-${Date.now()}-1`,
          type: 'surface_damage' as const,
          label: 'Asphalt Raveling',
          confidence: 0.92,
          severity: 'warning' as const,
          box: { x: 18, y: 48, width: 55, height: 34 },
          description: 'Disintegration of aggregate particles on top friction course.',
          recommendedAction: 'Apply slurry seal coating during seasonal maintenance.',
        },
      ];
    } else {
      overallSeverity = 'safe';
      roadConditionScore = 96;
      detections = [
        {
          id: `det-${Date.now()}-1`,
          type: 'other_defect' as const,
          label: 'Minor Surface Mark',
          confidence: 0.81,
          severity: 'safe' as const,
          box: { x: 42, y: 65, width: 14, height: 12 },
          description: 'Surface rubber mark. No structural pavement defect found.',
          recommendedAction: 'Routine monitoring. Safe road condition grade.',
        },
      ];
    }

    const endTime = performance.now();
    const result: DetectionResult = {
      id: `det-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      inputSource,
      originalMediaUrl: objectUrl,
      detections,
      overallSeverity,
      roadConditionScore,
      processingTimeMs: Math.round(endTime - startTime),
      locationName: customLocation || 'Survey Sector B-7 (GPS Verified)',
      filename: fileName,
      fileSize: fileSizeMb,
      resolution: '1920x1080',
      isSimulated: true,
    };

    saveDetection(result);
    return result;
  }

  public async detectFromSample(sampleId: string): Promise<DetectionResult> {
    const startTime = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 950));

    const sample = SAMPLE_ROAD_IMAGES.find((s) => s.id === sampleId) || SAMPLE_ROAD_IMAGES[0];

    let overallSeverity: 'critical' | 'warning' | 'safe' = 'critical';
    let roadConditionScore = 36;
    let detections = [];

    if (sample.id === 'sample-pothole') {
      overallSeverity = 'critical';
      roadConditionScore = 34;
      detections = [
        {
          id: 'box-p1',
          type: 'pothole' as const,
          label: 'Severe Pothole',
          confidence: 0.97,
          severity: 'critical' as const,
          box: { x: 26, y: 40, width: 38, height: 32 },
          description: 'High-risk road depression exposing sub-base course.',
          recommendedAction: 'Emergency crew dispatch & cold asphalt filling.',
        },
        {
          id: 'box-p2',
          type: 'crack' as const,
          label: 'Alligator Cracking',
          confidence: 0.91,
          severity: 'warning' as const,
          box: { x: 64, y: 35, width: 26, height: 45 },
          description: 'Interconnected fatigue cracks resembling alligator skin.',
          recommendedAction: 'Full depth patch repair.',
        },
      ];
    } else if (sample.id === 'sample-crack') {
      overallSeverity = 'warning';
      roadConditionScore = 69;
      detections = [
        {
          id: 'box-c1',
          type: 'surface_damage' as const,
          label: 'Surface Raveling & Wearing',
          confidence: 0.93,
          severity: 'warning' as const,
          box: { x: 22, y: 50, width: 52, height: 35 },
          description: 'Loss of asphalt binder causing loose surface aggregate.',
          recommendedAction: 'Micro-surfacing seal coat application.',
        },
      ];
    } else {
      overallSeverity = 'safe';
      roadConditionScore = 95;
      detections = [
        {
          id: 'box-s1',
          type: 'other_defect' as const,
          label: 'Minor Skid Mark',
          confidence: 0.84,
          severity: 'safe' as const,
          box: { x: 45, y: 68, width: 12, height: 10 },
          description: 'Superficial friction mark.',
          recommendedAction: 'Safe road surface. No structural work required.',
        },
      ];
    }

    const endTime = performance.now();
    const result: DetectionResult = {
      id: `det-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      inputSource: 'image',
      originalMediaUrl: sample.url,
      detections,
      overallSeverity,
      roadConditionScore,
      processingTimeMs: Math.round(endTime - startTime),
      locationName: sample.location,
      filename: `${sample.id}.jpg`,
      fileSize: '2.1 MB',
      resolution: '1920x1080',
      isSimulated: true,
    };

    saveDetection(result);
    return result;
  }

  public async detectVideoFrame(_mediaUrl: string): Promise<DetectionResult> {
    return this.detectFromSample('sample-pothole');
  }
}

export const detectionService: IDetectionService = new MockDetectionService();
