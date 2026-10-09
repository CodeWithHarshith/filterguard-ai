import React from 'react';
import { SensorPoint } from '../../types';

interface SparklineProps {
  data: SensorPoint[];
  color?: string;
  height?: number;
  width?: number | string;
  showMinMax?: boolean;
  unit?: string;
  status?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  height = 42,
  showMinMax = false,
  unit = '',
  status = 'NORMAL'
}) => {
  if (!data || data.length < 2) {
    return <div className="h-10 flex items-center justify-center text-xs text-slate-500 font-mono-tech">No signal</div>;
  }

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min === 0 ? 1 : max - min;

  const strokeColor = 
    status === 'CRITICAL' ? '#f43f5e' :
    status === 'WARNING' ? '#f59e0b' :
    '#06b6d4'; // cyan-500

  const fillColor = 
    status === 'CRITICAL' ? 'rgba(244, 63, 94, 0.12)' :
    status === 'WARNING' ? 'rgba(245, 158, 11, 0.12)' :
    'rgba(6, 182, 212, 0.12)';

  // Build SVG polyline points
  const svgWidth = 240;
  const paddingY = 4;
  const effectiveHeight = height - paddingY * 2;

  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * svgWidth;
    const y = height - paddingY - ((d.value - min) / range) * effectiveHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${svgWidth},${height}`;

  const lastPoint = points.split(' ').pop() || '0,0';
  const [lastX, lastY] = lastPoint.split(',');

  return (
    <div className="w-full flex flex-col justify-end">
      <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id={`grad-${status}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={fillColor} />
              <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
            </linearGradient>
          </defs>

          {/* Fill */}
          <polygon points={areaPoints} fill={`url(#grad-${status})`} />

          {/* Stroke Line */}
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Live pulsing head point */}
          <circle
            cx={lastX}
            cy={lastY}
            r="3"
            fill={strokeColor}
            className="animate-ping opacity-75"
          />
          <circle
            cx={lastX}
            cy={lastY}
            r="2.5"
            fill={strokeColor}
          />
        </svg>
      </div>

      {showMinMax && (
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono-tech mt-1">
          <span>MIN: {min} {unit}</span>
          <span>MAX: {max} {unit}</span>
        </div>
      )}
    </div>
  );
};
