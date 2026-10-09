import React from 'react';
import { FilterCondition, OverallStatus } from '../../types';

interface HealthGaugeProps {
  score: number; // 0 - 100
  condition: FilterCondition;
  overallStatus: OverallStatus;
  size?: number;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
  score,
  condition,
  overallStatus,
  size = 190
}) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270-degree gauge (3/4 of circle)
  const angleRange = 270;
  const strokeDashoffset = circumference - (circumference * (angleRange / 360) * (score / 100));
  const arcLength = circumference * (angleRange / 360);

  const getScoreColor = () => {
    if (score >= 80) return { stroke: '#10b981', text: 'text-emerald-400', glow: 'rgba(16, 185, 129, 0.2)' }; // Emerald
    if (score >= 65) return { stroke: '#06b6d4', text: 'text-cyan-400', glow: 'rgba(6, 182, 212, 0.2)' }; // Cyan
    if (score >= 45) return { stroke: '#f59e0b', text: 'text-amber-400', glow: 'rgba(245, 158, 11, 0.2)' }; // Amber
    return { stroke: '#f43f5e', text: 'text-rose-400', glow: 'rgba(244, 63, 94, 0.2)' }; // Rose
  };

  const { stroke, text, glow } = getScoreColor();

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-[225deg]"
      >
        {/* Background Track Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />

        {/* Value Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
        />
      </svg>

      {/* Center Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2">
        <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400">
          HEALTH INDEX
        </span>
        <div className="flex items-baseline justify-center gap-1 my-0.5">
          <span className={`text-4xl md:text-5xl font-mono-tech font-bold tracking-tight ${text}`}>
            {score}
          </span>
          <span className="text-sm font-mono-tech text-slate-500">/100</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs font-mono-tech font-semibold tracking-wider text-slate-300 uppercase">
            {condition}
          </span>
          <span className="text-slate-600">·</span>
          <span className={`text-[10px] font-mono-tech uppercase ${text}`}>
            {overallStatus}
          </span>
        </div>
      </div>
    </div>
  );
};
