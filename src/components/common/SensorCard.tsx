import React from 'react';
import { SensorData } from '../../types';
import { Sparkline } from './Sparkline';
import { StatusBadge } from './StatusBadge';
import { 
  Gauge, 
  Wind, 
  Thermometer, 
  Activity, 
  Clock, 
  Sparkles, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

interface SensorCardProps {
  sensor: SensorData;
  lastUpdatedSecondsAgo?: number;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  sensor,
  lastUpdatedSecondsAgo = 2
}) => {
  const getIcon = () => {
    switch (sensor.type) {
      case 'differential_pressure':
        return <Gauge className="w-4 h-4 text-cyan-400" />;
      case 'flow_rate':
        return <Wind className="w-4 h-4 text-sky-400" />;
      case 'temperature':
        return <Thermometer className="w-4 h-4 text-amber-400" />;
      case 'vibration':
        return <Activity className="w-4 h-4 text-purple-400" />;
      case 'operating_hours':
        return <Clock className="w-4 h-4 text-emerald-400" />;
      case 'particle_concentration':
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  // If particle sensor is unavailable or offline
  if (!sensor.isAvailable) {
    return (
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-200">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              {getIcon()}
            </div>
            <span className="text-xs font-mono-tech font-semibold uppercase text-slate-300">
              {sensor.name}
            </span>
          </div>
          <StatusBadge status="DATA_UNAVAILABLE" size="sm" />
        </div>

        <div className="my-5 py-4 px-3 bg-slate-900/40 rounded border border-dashed border-slate-800 text-center">
          <AlertTriangle className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
          <div className="text-xs font-mono-tech font-semibold text-slate-300">
            Particle concentration sensor: Not available
          </div>
          <p className="text-[11px] text-slate-500 mt-1 max-w-[240px] mx-auto">
            Sensor probe uninstalled or hardware bus disconnected. ML model automatically excludes this feature.
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-500 border-t border-slate-800/60 pt-2">
          <span>CHANNEL: CH-06</span>
          <span className="text-slate-400">STATUS: EXCLUDED FROM PIPELINE</span>
        </div>
      </div>
    );
  }

  // Trend direction
  const rate = sensor.rateOfChange;
  const isPositiveRate = rate > 0.01;
  const isNegativeRate = rate < -0.01;

  // Operating Hours progress bar
  const isOperatingHours = sensor.type === 'operating_hours';
  const hoursProgress = Math.min(100, Math.round((sensor.value / sensor.warningThreshold) * 100));

  return (
    <div className="bg-[#0b101b] border border-slate-800/80 hover:border-slate-700/80 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-200 group">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">
            {getIcon()}
          </div>
          <span className="text-xs font-mono-tech font-semibold uppercase text-slate-300">
            {sensor.name}
          </span>
        </div>

        <StatusBadge status={sensor.status} size="sm" />
      </div>

      {/* Main Metric Value & Unit */}
      <div className="my-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-mono-tech font-bold tracking-tight text-white">
              {sensor.type === 'flow_rate' || sensor.type === 'operating_hours' 
                ? sensor.value.toLocaleString() 
                : sensor.value.toFixed(1)}
            </span>
            <span className="text-sm font-mono-tech text-slate-400 font-medium">
              {sensor.unit}
            </span>
          </div>

          {/* Rate of Change Indicator */}
          {!isOperatingHours && (
            <div className={`flex items-center gap-0.5 text-[11px] font-mono-tech ${
              isPositiveRate && sensor.type === 'differential_pressure' ? 'text-amber-400' :
              isNegativeRate && sensor.type === 'flow_rate' ? 'text-amber-400' :
              isPositiveRate ? 'text-slate-300' :
              isNegativeRate ? 'text-slate-300' : 'text-slate-500'
            }`}>
              {isPositiveRate && <ArrowUpRight className="w-3.5 h-3.5" />}
              {isNegativeRate && <ArrowDownRight className="w-3.5 h-3.5" />}
              {!isPositiveRate && !isNegativeRate && <Minus className="w-3.5 h-3.5" />}
              <span>{Math.abs(rate)} {sensor.unit}/h</span>
            </div>
          )}
        </div>

        {/* Secondary Context Row */}
        <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400 mt-1">
          {sensor.type === 'differential_pressure' && (
            <>
              <span>Warn: <strong className="text-amber-400">{sensor.warningThreshold} {sensor.unit}</strong></span>
              <span>Crit: <strong className="text-rose-400">{sensor.criticalThreshold} {sensor.unit}</strong></span>
            </>
          )}

          {sensor.type === 'flow_rate' && (
            <>
              <span>Degradation: <strong className="text-amber-400">-5.3%</strong></span>
              <span>Nominal: <strong className="text-slate-300">1,310 {sensor.unit}</strong></span>
            </>
          )}

          {sensor.type === 'temperature' && (
            <>
              <span>Normal: <strong className="text-slate-300">{sensor.normalRange[0]}–{sensor.normalRange[1]} {sensor.unit}</strong></span>
              <span>Crit: <strong className="text-rose-400">{sensor.criticalThreshold} {sensor.unit}</strong></span>
            </>
          )}

          {sensor.type === 'vibration' && (
            <>
              <span>ISO Limit: <strong className="text-amber-400">{sensor.warningThreshold} {sensor.unit}</strong></span>
              <span>Housing: <strong className="text-slate-300">Intact</strong></span>
            </>
          )}

          {sensor.type === 'operating_hours' && (
            <>
              <span>Service Limit: <strong className="text-slate-300">6,000 h</strong></span>
              <span>Remaining: <strong className="text-cyan-400">1,168 h</strong></span>
            </>
          )}

          {sensor.type === 'particle_concentration' && (
            <>
              <span>Optical Counter: <strong className="text-emerald-400">Active</strong></span>
              <span>Limit: <strong className="text-amber-400">{sensor.warningThreshold} {sensor.unit}</strong></span>
            </>
          )}
        </div>

        {/* Progress bar for operating hours */}
        {isOperatingHours && (
          <div className="w-full mt-2.5">
            <div className="h-1.5 w-full bg-slate-900 rounded overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-cyan-500 rounded transition-all duration-500" 
                style={{ width: `${hoursProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-500 mt-1">
              <span>0h</span>
              <span>{hoursProgress}% of 6,000h service interval</span>
              <span>6,000h</span>
            </div>
          </div>
        )}
      </div>

      {/* Sparkline */}
      {!isOperatingHours && (
        <div className="mt-1 mb-2">
          <Sparkline 
            data={sensor.history} 
            height={36} 
            status={sensor.status} 
            unit={sensor.unit}
          />
        </div>
      )}

      {/* Footer with Live Indicator */}
      <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400 border-t border-slate-800/60 pt-2 mt-auto">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-semibold uppercase">● LIVE</span>
        </div>
        <span>
          Last updated: {lastUpdatedSecondsAgo}s ago
        </span>
      </div>
    </div>
  );
};
