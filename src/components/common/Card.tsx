import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 text-slate-100 transition-all duration-200 ${
        hoverEffect ? 'hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
