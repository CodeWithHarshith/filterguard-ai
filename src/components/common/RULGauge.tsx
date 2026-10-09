import React from 'react';
import { MLPrediction } from '../../types';

interface RULGaugeProps {
  prediction: MLPrediction;
}

export const RULGauge: React.FC<RULGaugeProps> = ({ prediction }) => {
  // Compute progress on the timeline
  // Full scale: 0 to 60 days
  const maxScaleDays = 60;
  const currentDays = prediction.rulDays;
  const clampedDays = Math.max(0, Math.min(maxScaleDays, currentDays));
  // 0 days left = at failure (100% right), 60 days left = at now (0% left)
  const remainingPercent = Math.min(100, Math.max(0, (clampedDays / maxScaleDays) * 100));
  // Marker position from left: 100% - remainingPercent
  const markerPosition = 100 - remainingPercent;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Primary Readout */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="text-[11px] font-mono-tech uppercase tracking-wider text-slate-400">
            ESTIMATED REMAINING USEFUL LIFE (RUL)
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl md:text-4xl font-mono-tech font-bold text-cyan-400 tracking-tight">
              {prediction.rulDays} <span className="text-xl font-normal text-slate-300">DAYS</span>
            </span>
            <span className="text-slate-500 font-mono-tech text-xs">/</span>
            <span className="text-sm font-mono-tech text-slate-400">
              ~{prediction.rulHours.toLocaleString()} operating hours
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-[11px] font-mono-tech uppercase tracking-wider text-slate-400">
            CONFIDENCE INTERVAL (90%)
          </div>
          <div className="text-sm font-mono-tech text-slate-200 mt-1">
            {prediction.rulConfidenceInterval[0]} – {prediction.rulConfidenceInterval[1]} days
            <span className="text-xs text-slate-500 ml-1.5">(Conf: {prediction.modelConfidence}%)</span>
          </div>
        </div>
      </div>

      {/* Industrial Timeline Bar */}
      <div className="py-2">
        <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            NOW (OPERATIONAL)
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            SERVICE WINDOW
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            PREDICTED FAILURE
          </span>
        </div>

        <div className="relative w-full h-3 bg-slate-900 rounded border border-slate-800 flex items-center">
          {/* Color track segments */}
          <div className="absolute left-0 top-0 bottom-0 w-[55%] bg-emerald-500/15 border-r border-emerald-500/30" />
          <div className="absolute left-[55%] top-0 bottom-0 w-[30%] bg-amber-500/15 border-r border-amber-500/30" />
          <div className="absolute left-[85%] top-0 bottom-0 right-0 bg-rose-500/20" />

          {/* Current Position Marker */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-10"
            style={{ left: `${Math.max(4, Math.min(94, markerPosition))}%` }}
          >
            <div className="relative -translate-x-1/2 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-[#090d16] shadow-md shadow-cyan-500/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-500 mt-2">
          <span>0h Elapsed</span>
          <span>Recommended Service: {prediction.recommendedMaintenanceWindow}</span>
          <span>Critical Threshold: {prediction.predictedFailureWindow}</span>
        </div>
      </div>

      {/* Disclaimers required by prompt */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded p-2.5 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
        <span className="text-cyan-400 font-mono-tech font-semibold">NOTE:</span>
        <span>
          RUL and failure windows are <strong className="text-slate-300">statistical ML estimates</strong> based on time-series degradation models and operating cycles. Model confidence is <strong className="text-slate-300">{prediction.modelConfidence}%</strong>. Not a guaranteed mechanical failure date.
        </span>
      </div>
    </div>
  );
};
