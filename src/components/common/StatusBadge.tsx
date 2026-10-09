import React from 'react';
import { SensorStatus, OverallStatus, FilterCondition, AlertSeverity } from '../../types';

interface StatusBadgeProps {
  status: SensorStatus | OverallStatus | FilterCondition | AlertSeverity | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true
}) => {
  const getColors = () => {
    switch (status) {
      case 'NORMAL':
      case 'HEALTHY':
      case 'EXCELLENT':
      case 'GOOD':
        return {
          text: 'text-emerald-400',
          dot: 'bg-emerald-400',
          border: 'border-emerald-500/20',
          bg: 'bg-emerald-950/30'
        };
      case 'WARNING':
      case 'DEGRADED':
      case 'MEDIUM':
        return {
          text: 'text-amber-400',
          dot: 'bg-amber-400',
          border: 'border-amber-500/25',
          bg: 'bg-amber-950/30'
        };
      case 'CRITICAL':
      case 'FAILED':
      case 'FAILURE_PREDICTED':
      case 'HIGH':
        return {
          text: 'text-rose-400',
          dot: 'bg-rose-400',
          border: 'border-rose-500/30',
          bg: 'bg-rose-950/40'
        };
      case 'INFORMATION':
      case 'LOW':
        return {
          text: 'text-sky-400',
          dot: 'bg-sky-400',
          border: 'border-sky-500/25',
          bg: 'bg-sky-950/30'
        };
      case 'SENSOR_OFFLINE':
      case 'DATA_UNAVAILABLE':
      case 'NOT AVAILABLE':
      default:
        return {
          text: 'text-slate-400',
          dot: 'bg-slate-500',
          border: 'border-slate-800',
          bg: 'bg-slate-900/60'
        };
    }
  };

  const colors = getColors();

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wider',
    lg: 'text-sm px-3 py-1.5 tracking-wider'
  }[size];

  // Format label text cleanly
  const label = status.replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono-tech font-medium uppercase border rounded ${colors.bg} ${colors.border} ${colors.text} ${sizeClasses}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${colors.dot} ${
            status === 'CRITICAL' || status === 'FAILURE_PREDICTED' ? 'animate-pulse' : ''
          }`}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
};
