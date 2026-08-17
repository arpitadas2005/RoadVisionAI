import React from 'react';
import { SeverityLevel } from '../../types';
import { formatSeverity, getSeverityBadgeColor } from '../../utils/formatters';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const { bg, text, border } = getSeverityBadgeColor(severity);
  const label = formatSeverity(severity);

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border ${padding} ${bg} ${text} ${border}`}
    >
      <span
        className={`w-2 h-2 rounded-full mr-1.5 ${
          severity === 'critical' ? 'bg-red-500 animate-pulse' : severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
        }`}
      ></span>
      {label}
    </span>
  );
};
