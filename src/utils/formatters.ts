import { DamageType, SeverityLevel } from '../types';

export function formatDamageType(type: DamageType): string {
  switch (type) {
    case 'pothole':
      return 'Pothole';
    case 'crack':
      return 'Road Crack';
    case 'surface_damage':
      return 'Surface Damage';
    case 'other_defect':
      return 'Other Defect';
    default:
      return type;
  }
}

export function formatSeverity(severity: SeverityLevel): string {
  switch (severity) {
    case 'critical':
      return 'Critical Hazard';
    case 'warning':
      return 'Warning';
    case 'safe':
      return 'Normal / Safe';
    default:
      return severity;
  }
}

export function getSeverityBadgeColor(severity: SeverityLevel): {
  bg: string;
  text: string;
  border: string;
  glow: string;
} {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-red-500/15',
        text: 'text-red-400',
        border: 'border-red-500/40',
        glow: 'shadow-red-500/20',
      };
    case 'warning':
      return {
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        glow: 'shadow-amber-500/20',
      };
    case 'safe':
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        glow: 'shadow-emerald-500/20',
      };
  }
}

export function getDamageTypeBadgeColor(type: DamageType): {
  bg: string;
  text: string;
  border: string;
} {
  switch (type) {
    case 'pothole':
      return { bg: 'bg-red-950/50', text: 'text-red-300', border: 'border-red-700/50' };
    case 'crack':
      return { bg: 'bg-amber-950/50', text: 'text-amber-300', border: 'border-amber-700/50' };
    case 'surface_damage':
      return { bg: 'bg-cyan-950/50', text: 'text-cyan-300', border: 'border-cyan-700/50' };
    case 'other_defect':
      return { bg: 'bg-purple-950/50', text: 'text-purple-300', border: 'border-purple-700/50' };
  }
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatPercentage(num: number): string {
  return `${(num * 100).toFixed(1)}%`;
}
