import React from 'react';
import { useFilter } from '../../context/FilterContext';
import { BrainCircuit, Cpu, Database, Layers, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const MLModelView: React.FC = () => {
  const { thresholds, prediction } = useFilter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
              ARCHITECTURE & SPECIFICATION
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
            Filter Failure Prognostics Model
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mathematical formulation, input vector topology, and evaluation benchmarks
          </p>
        </div>

        <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono-tech text-slate-300">
          <span>MODEL TYPE:</span> <strong className="text-cyan-400 ml-1">Time-Series Predictive Ensemble</strong>
        </div>
      </div>

      {/* Inputs & Outputs Grid (Prompt Section 27) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Model Inputs */}
        <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5 text-xs font-mono-tech">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              INPUT FEATURE VECTOR (X_t)
            </h3>
            <span className="text-cyan-400">
              {thresholds.particleSensorConnected ? '7 Feature Channels' : '6 Feature Channels (PM Excluded)'}
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'Differential Pressure (ΔP)', type: 'Continuous (kPa)', note: 'Primary resistance metric via pressure taps' },
              { name: 'Volumetric Flow Rate (Q)', type: 'Continuous (L/min)', note: 'Airflow delivery through discharge venturi' },
              { name: 'Operating Temperature (T)', type: 'Continuous (°C)', note: 'Air viscosity & thermal expansion modifier' },
              { name: 'Housing Vibration Velocity (v_rms)', type: 'Continuous (mm/s)', note: 'Blower fan coupling & acoustic fluttering' },
              { name: 'Operating Hours (t_run)', type: 'Cumulative (h)', note: 'Accrued duty-cycle since last overhaul' },
              { 
                name: 'Particle Concentration (C_p)', 
                type: thresholds.particleSensorConnected ? 'Continuous (µg/m³)' : 'NOT AVAILABLE', 
                note: thresholds.particleSensorConnected ? 'Active downstream optical counter' : 'Excluded by hardware topology manager' 
              },
              { name: 'Historical Degradation Trajectory', type: 'Vector (30-day lag)', note: 'Autoregressive feature sequence' },
            ].map((f, i) => (
              <div key={i} className="p-2.5 bg-slate-950/70 rounded border border-slate-800 flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-white">{f.name}</div>
                  <div className="text-[10px] text-slate-400">{f.note}</div>
                </div>
                <span className={`text-[10px] font-semibold shrink-0 ${f.type === 'NOT AVAILABLE' ? 'text-slate-500' : 'text-cyan-400'}`}>
                  {f.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Model Outputs */}
        <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5 text-xs font-mono-tech">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              PREDICTIVE TARGET OUTPUTS (Y_t)
            </h3>
            <span className="text-emerald-400">Deterministic & Probabilistic</span>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'Filter Health Index (HI)', type: 'Continuous [0–100]', val: 'Synthesized condition score' },
              { name: 'Failure Probability (P_fail)', type: 'Probability [0.0–1.0]', val: '7-day and 30-day hazard rate integrals' },
              { name: 'Remaining Useful Life (RUL)', type: 'Days / Operating Hours', val: 'Quantile regression median prediction' },
              { name: 'Predicted Failure Window', type: 'Timestamp Interval', val: 'Statistical critical threshold crossing' },
              { name: 'Maintenance Action Prescription', type: 'Discrete Decision', val: 'Inspection vs Replacement dispatch' },
            ].map((out, i) => (
              <div key={i} className="p-2.5 bg-slate-950/70 rounded border border-slate-800 flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-white">{out.name}</div>
                  <div className="text-[10px] text-slate-400">{out.val}</div>
                </div>
                <span className="text-[10px] text-cyan-400 font-semibold shrink-0">{out.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Evaluation Metrics (Prompt Section 27: Strict honesty requirement!) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5 text-xs font-mono-tech">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              OFFLINE MODEL VALIDATION BENCHMARKS
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical holdout validation test results on run-to-failure benchmarks
            </p>
          </div>
          <span className="text-slate-500 text-[10px]">STANDARD INDUSTRIAL ML INTEGRITY</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-slate-950/70 rounded border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase">ACCURACY</span>
            <div className="text-base font-bold text-slate-400 mt-1">Not available</div>
            <div className="text-[9px] text-slate-500 mt-0.5">Continuous regression</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase">PRECISION</span>
            <div className="text-base font-bold text-slate-400 mt-1">Not available</div>
            <div className="text-[9px] text-slate-500 mt-0.5">Pending test matrix</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase">RECALL</span>
            <div className="text-base font-bold text-slate-400 mt-1">Not available</div>
            <div className="text-[9px] text-slate-500 mt-0.5">Pending test matrix</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase">F1 SCORE</span>
            <div className="text-base font-bold text-slate-400 mt-1">Not available</div>
            <div className="text-[9px] text-slate-500 mt-0.5">Pending test matrix</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase">RUL MAE</span>
            <div className="text-base font-bold text-slate-400 mt-1">Not available</div>
            <div className="text-[9px] text-slate-500 mt-0.5">Mean Absolute Error</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded border border-slate-800 text-center">
            <span className="text-[10px] text-cyan-400 uppercase font-semibold">MODEL CONFIDENCE</span>
            <div className="text-base font-bold text-cyan-400 mt-1">{prediction.modelConfidence}%</div>
            <div className="text-[9px] text-slate-500 mt-0.5">Ensemble agreement</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Compliance Notice:</strong> In strict compliance with scientific prognostic protocols, evaluation metrics are marked <strong className="text-slate-300">Not available</strong> until physical benchmark testing on calibrated run-to-failure rigs is completed. Fabricated ML metrics are prohibited.
        </div>
      </div>
    </div>
  );
};
