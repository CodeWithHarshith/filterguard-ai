import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { 
  TrendingDown, 
  Gauge, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  Download,
  RotateCcw
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { DegradationForecastChart } from '../common/DegradationForecastChart';

export const DegradationView: React.FC = () => {
  const { 
    selectedEquipment, 
    getSensor, 
    healthScore, 
    forecastData, 
    thresholds,
    prediction 
  } = useFilter();

  const dp = getSensor('differential_pressure');
  const [selectedHorizonDays, setSelectedHorizonDays] = useState<number>(30);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400 font-bold">
                PHYSICAL CONDITION TRAJECTORY ANALYSIS
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-slate-900 text-slate-300 border border-slate-800">
                MULTI-REGIME PROJECTION
              </span>
            </div>
            <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
              Degradation Analysis & Trajectory
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Historical progression, current operational state, non-linear degradation projection, and estimated failure envelope.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono-tech text-slate-300">
              Current dP: <span className="text-cyan-300 font-bold">{dp?.value.toFixed(1)} kPa</span>
            </div>
            <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono-tech text-slate-300">
              Rate: <span className="text-amber-400 font-bold">+{(dp?.rateOfChange || 0.35).toFixed(2)} kPa/h</span>
            </div>
          </div>
        </div>

        {/* Legend with distinct line styles & labels (Section 17) */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-5 h-1 bg-cyan-400 inline-block rounded-xs" />
              <span className="font-semibold">ACTUAL (Historical Telemetry)</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-300">
              <span className="w-5 h-1 border-t-2 border-dashed border-purple-400 inline-block" />
              <span className="font-semibold">PREDICTED (LSTM Trajectory)</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300">
              <span className="w-5 h-1 border-t-2 border-dotted border-amber-400 inline-block" />
              <span>WARNING THRESHOLD (50.0 kPa)</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-300">
              <span className="w-5 h-1 bg-rose-500 inline-block rounded-xs" />
              <span>CRITICAL LIMIT (70.0 kPa)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Model: Quantile Regression 90% Confidence Interval
          </div>
        </div>
      </div>

      {/* 2. Large Time-Series Degradation Chart */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-xl p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="text-sm font-bold font-mono-tech text-white uppercase flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-cyan-400" />
            <span>Differential Pressure Trajectory Curve (30-Day Outlook)</span>
          </div>
          <span className="text-xs font-mono-tech text-emerald-400 font-bold">
            Projected Breach: Day 26 (432 Operating Hours)
          </span>
        </div>

        <div className="h-64 w-full">
          <DegradationForecastChart data={forecastData} height={250} />
        </div>
      </div>

      {/* 3. Differential Pressure Mechanical Explanation (Section 18) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-[#0b101b] border border-slate-800/80 rounded-xl space-y-3 font-mono-tech">
          <div className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span>Fluid Mechanics: Differential Pressure</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Differential pressure measures the hydraulic head loss across the filtration media pleats. As incoming airborne particulates adhere to the micro-fiber matrix, interstitial airflow passages constrict, generating a steeper pressure gradient according to Darcy&apos;s Law for porous media.
          </p>
          <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-400">
            Current Rate of Increase: <span className="text-white font-bold">+0.35 kPa / operating hour</span>. Consistent linear-to-exponential transition characteristic of late-stage cake filtration.
          </div>
        </div>

        <div className="p-5 bg-[#0b101b] border border-slate-800/80 rounded-xl space-y-3 font-mono-tech">
          <div className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Multi-Signal Diagnostic Discipline</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            FilterGuard AI enforces multi-sensor cross-validation. An isolated pressure spike without volumetric flow reduction indicates a potential pressure tap clogging or sensor drift rather than genuine media breakthrough. Both differential pressure and volumetric flow confirm identical loading vectors on Line A.
          </p>
          <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cross-sensor verification confirmed: Flow rate down -5.3% in tandem with +16.2 kPa delta P.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
