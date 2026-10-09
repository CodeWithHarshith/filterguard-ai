import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { RULGauge } from '../common/RULGauge';
import { DegradationForecastChart } from '../common/DegradationForecastChart';
import { Hourglass, AlertCircle, Calendar, Sliders, ArrowRight } from 'lucide-react';

export const RULView: React.FC = () => {
  const { prediction, forecastData, selectedEquipment } = useFilter();
  const [loadMultiplier, setLoadMultiplier] = useState<number>(1.0);

  // Adjusted RUL based on simulated production line duty cycle
  const adjustedRulDays = Math.max(1, Math.round(prediction.rulDays / loadMultiplier));
  const adjustedRulHours = adjustedRulDays * 24;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
              PROGNOSTICS HORIZON
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
            Remaining Useful Life (RUL)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Statistical time-to-maintenance estimation with quantile uncertainty bounds · {selectedEquipment.name}
          </p>
        </div>

        <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono-tech text-slate-300">
          <span>ALGORITHM:</span> <strong className="text-cyan-400 ml-1">Weibull Hazard Rate + LSTM</strong>
        </div>
      </div>

      {/* Main RUL Display Card (Prompt Section 14) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-6">
        <RULGauge prediction={prediction} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-800/80 text-xs font-mono-tech">
          <div className="p-3 bg-slate-950/70 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase">LOWER ESTIMATE (P10)</span>
            <div className="text-lg font-bold text-slate-200 mt-1">
              {prediction.rulConfidenceInterval[0]} Days
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Conservative replacement window</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded border border-slate-800">
            <span className="text-cyan-400 text-[10px] uppercase font-semibold">MEDIAN ESTIMATE (P50)</span>
            <div className="text-lg font-bold text-cyan-400 mt-1">
              {prediction.rulDays} Days ({prediction.rulHours} h)
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Statistical target failure point</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase">UPPER ESTIMATE (P90)</span>
            <div className="text-lg font-bold text-slate-200 mt-1">
              {prediction.rulConfidenceInterval[1]} Days
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Optimistic runtime ceiling</div>
          </div>
        </div>
      </div>

      {/* Predictive Degradation Graph (Prompt Section 15) */}
      <DegradationForecastChart data={forecastData} />

      {/* What-If Operational Sensitivity Simulator */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5 text-xs font-mono-tech">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              OPERATIONAL SENSITIVITY & WHAT-IF SCENARIOS
            </h3>
          </div>
          <span className="text-slate-400 text-[11px]">
            Simulate duty-cycle variation impact on RUL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-slate-300 mb-2">
                <span>Production Line Speed / Particulate Load Multiplier:</span>
                <strong className="text-cyan-400 font-bold">{loadMultiplier.toFixed(1)}x</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={loadMultiplier}
                onChange={(e) => setLoadMultiplier(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.5x (Light Duty)</span>
                <span>1.0x (Standard)</span>
                <span>2.0x (Heavy Overhaul)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/70 rounded border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              At <strong className="text-slate-200">{loadMultiplier.toFixed(1)}x</strong> load, filter loading velocity accelerates by <strong className="text-cyan-400">{Math.round((loadMultiplier - 1) * 100)}%</strong>, shifting the predicted critical threshold earlier.
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 rounded border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">ADJUSTED REMAINING USEFUL LIFE</div>
              <div className="text-3xl font-bold text-cyan-300 mt-2">
                {adjustedRulDays} Days <span className="text-sm font-normal text-slate-400">({adjustedRulHours} h)</span>
              </div>
              <div className="text-[11px] text-amber-400 mt-2">
                {loadMultiplier > 1.0 ? `⚠️ RUL reduced by ${prediction.rulDays - adjustedRulDays} days under elevated line stress.` : 'Nominal baseline schedule preserved.'}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 mt-3 border-t border-slate-800/80 pt-2">
              Based on empirical power-law cake resistance model: ΔP = r_0 * μ * v + α * c_m * v^2 * t
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
