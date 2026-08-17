import { DashboardStats, DetectionResult, FilterOptions } from '../types';

const STORAGE_KEY = 'smart_road_damage_history_v1';

const INITIAL_SEED_DATA: DetectionResult[] = [
  {
    id: 'det-101',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hrs ago
    inputSource: 'image',
    originalMediaUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1200&auto=format&fit=crop',
    overallSeverity: 'critical',
    roadConditionScore: 35,
    processingTimeMs: 245,
    locationName: 'North Avenue & 4th Street Crossing',
    filename: 'pothole_survey_01.jpg',
    fileSize: '2.4 MB',
    resolution: '1920x1080',
    isSimulated: true,
    detections: [
      {
        id: 'box-1',
        type: 'pothole',
        label: 'Severe Pothole',
        confidence: 0.96,
        severity: 'critical',
        box: { x: 28, y: 45, width: 34, height: 28 },
        description: 'Deep structural asphalt depression with loose debris.',
        recommendedAction: 'Immediate cold-mix pothole patching & cordoning.',
      },
      {
        id: 'box-2',
        type: 'crack',
        label: 'Longitudinal Crack',
        confidence: 0.88,
        severity: 'warning',
        box: { x: 62, y: 35, width: 22, height: 40 },
        description: 'Linear pavement crack extending along traffic wheel path.',
        recommendedAction: 'Crack sealing during scheduled maintenance.',
      },
    ],
  },
  {
    id: 'det-102',
    timestamp: new Date(Date.now() - 3600000 * 14).toISOString(), // 14 hrs ago
    inputSource: 'image',
    originalMediaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
    overallSeverity: 'warning',
    roadConditionScore: 68,
    processingTimeMs: 188,
    locationName: 'Suburban Expressway Hwy 12',
    filename: 'hwy12_km42_scan.jpg',
    fileSize: '1.8 MB',
    resolution: '1920x1080',
    isSimulated: true,
    detections: [
      {
        id: 'box-3',
        type: 'surface_damage',
        label: 'Surface Raveling',
        confidence: 0.91,
        severity: 'warning',
        box: { x: 20, y: 55, width: 45, height: 30 },
        description: 'Aggregate disintegration & top binder wear.',
        recommendedAction: 'Apply protective micro-surfacing emulsion.',
      },
    ],
  },
  {
    id: 'det-103',
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(), // 1.1 days ago
    inputSource: 'video',
    originalMediaUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?q=80&w=1200&auto=format&fit=crop',
    overallSeverity: 'critical',
    roadConditionScore: 42,
    processingTimeMs: 410,
    locationName: 'Central Boulevard (Dashcam Feed)',
    filename: 'dashcam_survey_chunk4.mp4',
    fileSize: '14.2 MB',
    resolution: '1080p @ 30fps',
    isSimulated: true,
    detections: [
      {
        id: 'box-4',
        type: 'pothole',
        label: 'Medium Pothole',
        confidence: 0.94,
        severity: 'critical',
        box: { x: 40, y: 50, width: 25, height: 22 },
        description: 'Sub-base erosion hazard along passenger lane.',
        recommendedAction: 'High priority repair order issued.',
      },
      {
        id: 'box-5',
        type: 'other_defect',
        label: 'Missing Drainage Grate',
        confidence: 0.86,
        severity: 'critical',
        box: { x: 75, y: 60, width: 18, height: 25 },
        description: 'Exposed storm drain opening presenting severe wheel trap danger.',
        recommendedAction: 'Emergency safety cone placement and grate installation.',
      },
    ],
  },
  {
    id: 'det-104',
    timestamp: new Date(Date.now() - 3600000 * 50).toISOString(), // 2 days ago
    inputSource: 'image',
    originalMediaUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1200&auto=format&fit=crop',
    overallSeverity: 'safe',
    roadConditionScore: 94,
    processingTimeMs: 140,
    locationName: 'East Industrial Park Access Road',
    filename: 'clean_asphalt_inspect.jpg',
    fileSize: '3.1 MB',
    resolution: '4K (3840x2160)',
    isSimulated: true,
    detections: [
      {
        id: 'box-6',
        type: 'other_defect',
        label: 'Minor Surface Mark',
        confidence: 0.82,
        severity: 'safe',
        box: { x: 50, y: 70, width: 10, height: 10 },
        description: 'Superficial tire skid mark without depth damage.',
        recommendedAction: 'No repair required. Normal surface inspection log.',
      },
    ],
  },
];

export function getHistory(): DetectionResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_DATA));
      return INITIAL_SEED_DATA;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load history from LocalStorage:', err);
    return INITIAL_SEED_DATA;
  }
}

export function saveDetection(result: DetectionResult): void {
  try {
    const current = getHistory();
    const updated = [result, ...current.filter((item) => item.id !== result.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save detection result:', err);
  }
}

export function getDetectionById(id: string): DetectionResult | undefined {
  const history = getHistory();
  return history.find((item) => item.id === id);
}

export function deleteDetection(id: string): void {
  try {
    const current = getHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete history item:', err);
  }
}

export function clearHistory(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
}

export function filterHistory(history: DetectionResult[], options: FilterOptions): DetectionResult[] {
  return history.filter((item) => {
    // Search query match
    if (options.search.trim()) {
      const q = options.search.toLowerCase();
      const matchLoc = item.locationName.toLowerCase().includes(q);
      const matchFile = (item.filename || '').toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      const matchLabel = item.detections.some((d) => d.label.toLowerCase().includes(q));
      if (!matchLoc && !matchFile && !matchId && !matchLabel) return false;
    }

    // Damage Type Filter
    if (options.damageType !== 'all') {
      const hasType = item.detections.some((d) => d.type === options.damageType);
      if (!hasType) return false;
    }

    // Severity Filter
    if (options.severity !== 'all') {
      if (item.overallSeverity !== options.severity) return false;
    }

    return true;
  }).sort((a, b) => {
    if (options.sortBy === 'oldest') {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    if (options.sortBy === 'severity') {
      const severityRank = { critical: 3, warning: 2, safe: 1 };
      return severityRank[b.overallSeverity] - severityRank[a.overallSeverity];
    }
    if (options.sortBy === 'health_asc') {
      return a.roadConditionScore - b.roadConditionScore;
    }
    // Default: newest first
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}

export function getDashboardStats(): DashboardStats {
  const history = getHistory();
  const totalInspections = history.length;
  const totalDamagedImages = history.filter((h) => h.overallSeverity !== 'safe').length;
  const criticalCount = history.filter((h) => h.overallSeverity === 'critical').length;
  const warningCount = history.filter((h) => h.overallSeverity === 'warning').length;
  const safeCount = history.filter((h) => h.overallSeverity === 'safe').length;

  // Type breakdown
  const typeCounts: Record<string, number> = { pothole: 0, crack: 0, surface_damage: 0, other_defect: 0 };
  let totalConfidenceSum = 0;
  let totalDetectionsCount = 0;
  let totalConditionSum = 0;

  history.forEach((item) => {
    totalConditionSum += item.roadConditionScore;
    item.detections.forEach((d) => {
      typeCounts[d.type] = (typeCounts[d.type] || 0) + 1;
      totalConfidenceSum += d.confidence;
      totalDetectionsCount++;
    });
  });

  let mostCommonType = 'Pothole';
  let maxCount = 0;
  Object.entries(typeCounts).forEach(([type, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonType = type === 'surface_damage' ? 'Surface Damage' : type === 'other_defect' ? 'Other Defect' : type.charAt(0).toUpperCase() + type.slice(1);
    }
  });

  return {
    totalInspections,
    totalDamagedImages,
    criticalCount,
    warningCount,
    safeCount,
    mostCommonType,
    averageConfidence: totalDetectionsCount > 0 ? totalConfidenceSum / totalDetectionsCount : 0.9,
    averageConditionScore: totalInspections > 0 ? Math.round(totalConditionSum / totalInspections) : 75,
  };
}
