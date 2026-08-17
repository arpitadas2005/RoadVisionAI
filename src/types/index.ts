export type DamageType = 'pothole' | 'crack' | 'surface_damage' | 'other_defect';

export type SeverityLevel = 'critical' | 'warning' | 'safe';

export type InputSource = 'image' | 'video' | 'webcam';

export interface BoundingBox {
  x: number;       // Percent 0..100 (left)
  y: number;       // Percent 0..100 (top)
  width: number;   // Percent 0..100
  height: number;  // Percent 0..100
}

export interface DetectedObject {
  id: string;
  type: DamageType;
  label: string;
  confidence: number; // 0.0 to 1.0 (e.g. 0.94)
  severity: SeverityLevel;
  box: BoundingBox;
  description?: string;
  recommendedAction?: string;
}

export interface DetectionResult {
  id: string;
  timestamp: string;
  inputSource: InputSource;
  originalMediaUrl: string;
  annotatedMediaUrl?: string;
  detections: DetectedObject[];
  overallSeverity: SeverityLevel;
  roadConditionScore: number; // 0 (worst) to 100 (best/safe)
  processingTimeMs: number;
  locationName: string;
  filename?: string;
  fileSize?: string;
  resolution?: string;
  isSimulated: boolean;
}

export interface FilterOptions {
  search: string;
  damageType: string;
  severity: string;
  dateRange: string;
  sortBy: string;
}

export interface DashboardStats {
  totalInspections: number;
  totalDamagedImages: number;
  criticalCount: number;
  warningCount: number;
  safeCount: number;
  mostCommonType: string;
  averageConfidence: number;
  averageConditionScore: number;
}
