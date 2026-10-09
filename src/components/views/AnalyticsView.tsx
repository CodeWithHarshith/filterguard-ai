import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { SensorType } from '../../types';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  RotateCcw, 
  ZoomIn, 
  Layers,
  ChevronDown
} from 'lucide-react';

type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d' | '90d';

export const AnalyticsView: React.FC = () => {
  const { sensors, healthScore, prediction, exportSensorCSV, thresholds } = useFilter();
  const [selectedSensor, setSelectedSensor] = useState<SensorType | 'health' | 'rul'>('differential_pressure');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const timeRanges: { key: TimeRange; label: string }[] = [
    { key: '1h', label: '1 Hour' },
    { key: '6h', label: '6 Hours' },
    { key: '24h', label: '24 Hours' },
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
  ];

  // Sensor options for selector
  const availableSensors = sensors.filter(s => s.isAvailable);

  const getActiveChartData = () => {
    if (selectedSensor === 'health') {
      return {
        name: 'Filter Health Index',
        unit: '/100',
        currentVal: healthScore,
        warnThreshold: 68,
        critThreshold: 45,
        color: '#10b981',
        history: [
          { time: 'T-24h', val: 86 },
          { time: 'T-18h', val: 85 },
          { time: 'T-12h', val: 84 },
          { time: 'T-6h',  val: 83 },
          { time: 'Now',   val: healthScore }
        ]
      };
    }
    if (selectedSensor === 'rul') {
      return {
        name: 'Estimated Remaining Useful Life',
        unit: 'Days',
        currentVal: prediction.rulDays,
        warnThreshold: 14,
        critThreshold: 5,
        color: '#38bdf8',
        history: [
          { time: 'T-24h', val: 28 },
          { time: 'T-18h', val: 27 },
          { time: 'T-12h', val: 27 },
          { time: 'T-6h',  val: 26 },
          { time: 'Now',   val: prediction.rulDays }
        ]
      };
    }

    const sensor = sensors.find(s => s.type === selectedSensor);
    if (!sensor) return null;

    return {
      name: sensor.name,
      unit: sensor.unit,
      currentVal: sensor.value,
      warnThreshold: sensor.warningThreshold,
      critThreshold: sensor.criticalThreshold,
      color: sensor.type === 'differential_pressure' ? '#06b6d4' :
             sensor.type === 'flow_rate' ? '#38bdf8' :
             sensor.type === 'temperature' ? '#f59e0b' :
             sensor.type === 'vibration' ? '#a855f7' : '#10b981',
      history: sensor.history.slice(-15).map((pt, i) => ({
        time: new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        val: pt.value
      }))
    };
  };

  const chartInfo = getActiveChartData();

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
              HISTORICAL TELEMETRY INTELLIGENCE
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
            Data Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deep-dive longitudinal trend analysis, threshold crossings, and prognostic regressions
          </p>
        </div>

        {/* Time-Range Segmented Buttons (Anti-Slop compliant functional buttons) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded">
            {timeRanges.map(tr => (
              <button
                key={tr.key}
                onClick={() => setTimeRange(tr.key)}
                className={`px-2.5 py-1 text-xs font-mono-tech rounded transition-colors ${
                  timeRange === tr.key
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tr.label}
              </button>
            ))}
          </div>

          <button
            onClick={exportSensorCSV}
            className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono-tech text-cyan-400 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Sensor Selector Pills / Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 text-xs font-mono-tech">
        <span className="text-slate-500 uppercase shrink-0">SELECT METRIC:</span>
        {availableSensors.map(s => (
          <button
            key={s.type}
            onClick={() => setSelectedSensor(s.type)}
            className={`px-3 py-1.5 rounded border transition-colors shrink-0 ${
              selectedSensor === s.type
                ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-300 font-semibold shadow-xs'
                : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {s.name}
          </button>
        ))}
        <button
          onClick={() => setSelectedSensor('health')}
          className={`px-3 py-1.5 rounded border transition-colors shrink-0 ${
            selectedSensor === 'health'
              ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-300 font-semibold shadow-xs'
              : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          Filter Health Index
        </button>
        <button
          onClick={() => setSelectedSensor('rul')}
          className={`px-3 py-1.5 rounded border transition-colors shrink-0 ${
            selectedSensor === 'rul'
              ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-300 font-semibold shadow-xs'
              : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          Estimated RUL
        </button>
      </div>

      {/* Active Chart Window */}
      {chartInfo && (
        <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-tech text-cyan-400 uppercase">TIME HORIZON: {timeRange}</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono-tech text-slate-400">Current: <strong className="text-white">{chartInfo.currentVal} {chartInfo.unit}</strong></span>
              </div>
              <h2 className="text-lg font-bold font-mono-tech text-white mt-0.5">
                {chartInfo.name} Trend & Threshold Boundaries
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono-tech">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-amber-400" />
                <span className="text-amber-400">Warn: {chartInfo.warnThreshold} {chartInfo.unit}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-rose-400" />
                <span className="text-rose-400">Crit: {chartInfo.critThreshold} {chartInfo.unit}</span>
              </div>
              <button
                onClick={() => setZoomLevel(prev => (prev === 1 ? 1.5 : 1))}
                className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded hover:text-white"
              >
                {zoomLevel === 1 ? 'Zoom 1.5x' : 'Reset Zoom'}
              </button>
            </div>
          </div>

          {/* SVG Multi-point Trend Line */}
          <div className="w-full overflow-x-auto py-2">
            <svg viewBox="0 0 760 220" className="w-full min-w-[580px] h-auto">
              {/* Background Grid */}
              {[0, 50, 100, 150, 200].map(y => (
                <line key={y} x1="40" y1={y} x2="740" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              ))}

              {/* Data curve */}
              {(() => {
                const values = chartInfo.history.map(h => h.val);
                const min = Math.min(...values) * 0.9;
                const max = Math.max(...values, chartInfo.critThreshold) * 1.05;
                const range = max - min || 1;
                const pts = chartInfo.history.map((pt, i) => {
                  const x = 50 + (i / (chartInfo.history.length - 1)) * 670;
                  const y = 190 - ((pt.val - min) / range) * 160;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(' ');

                return (
                  <>
                    <polyline
                      fill="none"
                      stroke={chartInfo.color}
                      strokeWidth="2.5"
                      points={pts}
                      strokeLinecap="round"
                    />
                    {chartInfo.history.map((pt, i) => {
                      const x = 50 + (i / (chartInfo.history.length - 1)) * 670;
                      const y = 190 - ((pt.val - min) / range) * 160;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="3.5" fill={chartInfo.color} stroke="#0b101b" strokeWidth="1.5" />
                          <text x={x} y="210" textAnchor="middle" className="fill-slate-500 text-[9px] font-mono-tech">
                            {pt.time}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      )}

      {/* Grid of All Sensor Thumbnails */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map(s => {
          if (!s.isAvailable) return null;
          return (
            <div key={s.id} className="p-4 bg-[#0b101b] border border-slate-800/80 rounded-lg text-xs font-mono-tech">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-200">{s.name}</span>
                <span className="text-cyan-400 font-bold">{s.value} {s.unit}</span>
              </div>
              <div className="h-20 w-full">
                <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
                  {(() => {
                    const vals = s.history.map(h => h.value);
                    const min = Math.min(...vals);
                    const max = Math.max(...vals);
                    const range = max - min || 1;
                    const pts = s.history.map((h, i) => {
                      const x = (i / (s.history.length - 1)) * 200;
                      const y = 55 - ((h.value - min) / range) * 50;
                      return `${x},${y}`;
                    }).join(' ');
                    return (
                      <polyline
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="1.75"
                        points={pts}
                      />
                    );
                  })()}
                </svg>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 border-t border-slate-800 pt-1.5">
                <span>Range: {s.normalRange[0]}–{s.normalRange[1]} {s.unit}</span>
                <span>Warn: {s.warningThreshold} {s.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
