import React, { useState } from 'react';
import { ForecastPoint } from '../../types';

interface DegradationForecastChartProps {
  data: ForecastPoint[];
  height?: number;
}

export const DegradationForecastChart: React.FC<DegradationForecastChartProps> = ({
  data,
  height = 280
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ForecastPoint | null>(null);

  const padding = { top: 25, right: 35, bottom: 35, left: 45 };
  const width = 760;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Pressure range: 20 to 85 kPa
  const minPressure = 20;
  const maxPressure = 85;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - ((val - minPressure) / (maxPressure - minPressure)) * innerHeight;

  // Separate actual points from future predictions
  // Points up to day <= 0 are actual
  const todayIndex = data.findIndex(d => d.day === 0);

  // Build Actual line path
  const actualData = data.slice(0, todayIndex + 1);
  const actualPath = actualData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(d.actualPressure!)}`).join(' ');

  // Build Predicted line path
  const predictedData = data.slice(todayIndex);
  const predictedPath = predictedData.map((d, i) => {
    const idx = todayIndex + i;
    return `${i === 0 ? 'M' : 'L'} ${getX(idx)},${getY(d.predictedPressure)}`;
  }).join(' ');

  // Build Confidence Area (Upper and Lower) for future points
  const upperPoints = predictedData.map((d, i) => `${getX(todayIndex + i)},${getY(d.confidenceUpper)}`);
  const lowerPoints = [...predictedData].reverse().map((d, i) => {
    const idx = data.length - 1 - i;
    return `${getX(idx)},${getY(d.confidenceLower)}`;
  });
  const confidenceArea = `M ${upperPoints.join(' L ')} L ${lowerPoints.join(' L ')} Z`;

  // Threshold lines
  const warningY = getY(50);
  const criticalY = getY(70);

  return (
    <div className="w-full flex flex-col bg-[#0b101b] border border-slate-800/80 rounded-lg p-4 select-none">
      {/* Header & Legends */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-slate-800/60 pb-2.5">
        <div>
          <h3 className="text-sm font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
            FILTER DEGRADATION FORECAST (DELTA-P)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pressure differential buildup curve vs failure threshold
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-tech">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400" />
            <span className="text-slate-300">ACTUAL DATA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-cyan-300" />
            <span className="text-slate-300">ML PREDICTED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-cyan-500/15 border border-cyan-500/30 rounded-xs" />
            <span className="text-slate-400">UNCERTAINTY</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-amber-400" />
            <span className="text-amber-400">WARN (50 kPa)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-rose-500" />
            <span className="text-rose-400">CRIT (70 kPa)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[580px] h-auto overflow-visible"
        >
          {/* Horizontal Grid lines */}
          {[20, 30, 40, 50, 60, 70, 80].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-500 text-[10px] font-mono-tech"
                >
                  {val} kPa
                </text>
              </g>
            );
          })}

          {/* Warning Threshold Line */}
          <line
            x1={padding.left}
            y1={warningY}
            x2={width - padding.right}
            y2={warningY}
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="5 4"
            opacity="0.85"
          />

          {/* Critical Threshold Line */}
          <line
            x1={padding.left}
            y1={criticalY}
            x2={width - padding.right}
            y2={criticalY}
            stroke="#f43f5e"
            strokeWidth="1.5"
            strokeDasharray="5 4"
            opacity="0.85"
          />

          {/* Shaded Confidence Band (Uncertainty) */}
          <path
            d={confidenceArea}
            fill="rgba(6, 182, 212, 0.08)"
            stroke="rgba(6, 182, 212, 0.25)"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Today Separator line */}
          <line
            x1={getX(todayIndex)}
            y1={padding.top}
            x2={getX(todayIndex)}
            y2={height - padding.bottom}
            stroke="#38bdf8"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.4"
          />
          <text
            x={getX(todayIndex)}
            y={padding.top - 6}
            textAnchor="middle"
            className="fill-sky-400 text-[10px] font-mono-tech font-semibold"
          >
            NOW (TODAY)
          </text>

          {/* Actual Line */}
          <path
            d={actualPath}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Actual Points */}
          {actualData.map((d, i) => (
            <circle
              key={i}
              cx={getX(i)}
              cy={getY(d.actualPressure!)}
              r={i === todayIndex ? 5 : 3}
              fill={i === todayIndex ? '#38bdf8' : '#0891b2'}
              stroke="#0b101b"
              strokeWidth="2"
              className="cursor-pointer transition-transform hover:scale-150"
              onMouseEnter={() => setHoveredPoint(d)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Current Live Pulse */}
          <circle
            cx={getX(todayIndex)}
            cy={getY(actualData[todayIndex].actualPressure!)}
            r="8"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            className="animate-ping"
          />

          {/* Predicted Line (Dashed) */}
          <path
            d={predictedPath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />

          {/* Predicted Points */}
          {predictedData.map((d, i) => {
            const idx = todayIndex + i;
            if (i === 0) return null; // already drawn today
            const isRulCrossing = d.day === 26;
            return (
              <g key={idx}>
                <circle
                  cx={getX(idx)}
                  cy={getY(d.predictedPressure)}
                  r={isRulCrossing ? 5 : 3}
                  fill={isRulCrossing ? '#f43f5e' : '#38bdf8'}
                  stroke="#0b101b"
                  strokeWidth="2"
                  className="cursor-pointer transition-transform hover:scale-150"
                  onMouseEnter={() => setHoveredPoint(d)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}

          {/* X-Axis Dates */}
          {data.map((d, i) => (
            <text
              key={i}
              x={getX(i)}
              y={height - padding.bottom + 18}
              textAnchor="middle"
              className={`text-[9.5px] font-mono-tech ${
                d.day === 0 ? 'fill-sky-400 font-semibold' : 'fill-slate-400'
              }`}
            >
              {d.date}
            </text>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded shadow-xl text-xs font-mono-tech z-20 flex items-center gap-3">
            <span className="text-cyan-400 font-semibold">{hoveredPoint.date}</span>
            {hoveredPoint.actualPressure !== undefined && (
              <span className="text-slate-200">
                Actual: <strong className="text-white">{hoveredPoint.actualPressure} kPa</strong>
              </span>
            )}
            <span className="text-slate-300">
              Predicted: <strong className="text-cyan-300">{hoveredPoint.predictedPressure} kPa</strong>
            </span>
            <span className="text-slate-500">
              CI: [{hoveredPoint.confidenceLower} – {hoveredPoint.confidenceUpper} kPa]
            </span>
          </div>
        )}
      </div>

      {/* Mandatory Uncertainty Disclaimer */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono-tech">
        <span>The shaded region represents model uncertainty (90% confidence interval).</span>
        <span className="text-cyan-400">RUL estimated at day +26</span>
      </div>
    </div>
  );
};
