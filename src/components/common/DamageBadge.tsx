import React from 'react';
import { DamageType } from '../../types';
import { formatDamageType, getDamageTypeBadgeColor } from '../../utils/formatters';

interface DamageBadgeProps {
  type: DamageType;
  showIcon?: boolean;
}

export const DamageBadge: React.FC<DamageBadgeProps> = ({ type }) => {
  const { bg, text, border } = getDamageTypeBadgeColor(type);
  const label = formatDamageType(type);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg} ${text} ${border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {label}
    </span>
  );
};
