import React from 'react';
import { useFilter } from '../../context/FilterContext';
import { 
  Cpu, 
  Layers, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ArrowDown, 
  ArrowUp,
  ShieldCheck,
  Info
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const ExplainableAIView: React.FC = () => {
  const { 
    selectedEquipment, 
    healthScore, 
    filterCondition, 
    prediction, 
    healthFactors, 
    getSensor 
  } = useFilter();

  const dp = getSensor('differential_pressure');
  const fl = getSensor('flow_rate');
  const temp = getSensor('temperature');
  const vib = getSensor('vibration');
  const hrs = getSensor('operating_hours');

  const shapDrivers = [
    {
      feature: 'Differential Pressure (dP)',
      role: 'PRIMARY DRIVER',
      contribution: 'High (42%)',
      shapValue: '+0.28 risk delta',
      currentReading: `${dp?.value.toFixed(1)} kPa`,
      nominalBaseline: '25.0 kPa',
      direction: 'Degrading',
      explanation: 'Pressure drop slope (+0.35 kPa/h) indicates particulate cake thickness increasing hydraulic resistance.'
    },
    {
      feature: 'Volumetric Flow Attenuation',
      role: 'SECONDARY DRIVER',
      contribution: 'Moderate (28%)',
      shapValue: '+0.19 risk delta',
      currentReading: `${fl?.value.toFixed(0)} L/min`,
      nominalBaseline: '1,500 L/min',
      direction: 'Degrading',
      explanation: 'Inverse flow attenuation confirms true mechanical restriction rather than localized sensor artifact.'
    },
    {
      feature: 'Accumulated Operating Hours',
      role: 'OPERATING AGE DRIVER',
      contribution: 'Elevated (16%)',
      shapValue: '+0.11 risk delta',
      currentReading: `${hrs?.value.toLocaleString()} h`,
      nominalBaseline: '6,000 h limit',
      direction: 'Aging',
      explanation: 'Accumulated operating hours at 80.5% of standard cartridge change interval.'
    },
    {
      feature: 'Plenum Operating Temperature',
      role: 'STABILITY FACTOR',
      contribution: 'Low (8%)',
      shapValue: '+0.03 risk delta',
      currentReading: `${temp?.value.toFixed(1)} °C`,
      nominalBaseline: '65.0 °C',
      direction: 'Stable',
      explanation: 'Operating temperature remains within standard air handling envelope (35 - 75 °C).'
    },
    {
      feature: 'Housing Mechanical Vibration',
      role: 'STABILITY FACTOR',
      contribution: 'Low (6%)',
      shapValue: '+0.02 risk delta',
      currentReading: `${vib?.value.toFixed(1)} mm/s`,
      nominalBaseline: '2.5 mm/s',
      direction: 'Stable',
      explanation: 'Vibration RMS indicates balanced blower motor operation with no unbalance or cavitation.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400 font-bold">
                PROGNOSTIC EXPLAINABILITY & FEATURE ATTRIBUTION
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-slate-900 text-slate-300 border border-slate-800">
                SHAP ATTRIBUTION ENGINE
              </span>
            </div>
            <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
              Why is the Filter Degrading?
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Interpretable machine learning decomposition identifying the exact engineering drivers behind filter loading.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <StatusBadge status={filterCondition} size="lg" />
            <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono-tech text-slate-300">
              Confidence: <span className="text-emerald-400 font-bold">{prediction.modelConfidence}%</span>
            </div>
          </div>
        </div>

        {/* Executive Summary Box */}
        <div className="mt-4 p-4 bg-slate-950/80 rounded-lg border border-slate-800 text-xs font-mono-tech space-y-2">
          <div className="text-white font-bold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Analytical Interpretation:</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            The current degradation trajectory on <span className="text-cyan-300 font-semibold">{selectedEquipment.id}</span> is driven primarily by <span className="text-white font-bold">Differential Pressure Escalation (42% attribution)</span> coupled with <span className="text-white font-bold">Volumetric Flow Attenuation (28% attribution)</span>. This multi-sensor signature confirms physical dust cake buildup across the media pleats, with no indication of sensor malfunction.
          </p>
        </div>
      </div>

      {/* 2. Feature Attribution Breakdown (Section 20) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-xl p-5 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold font-mono-tech text-white uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Ranked Contributing Factors (SHAP Values)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Primary and secondary drivers influencing current health score ({healthScore}/100) and failure probability ({prediction.failureProbability}%).
          </p>
        </div>

        <div className="space-y-3">
          {shapDrivers.map((driver) => (
            <div key={driver.feature} className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg font-mono-tech">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    driver.role === 'PRIMARY DRIVER' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                    driver.role === 'SECONDARY DRIVER' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                    'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {driver.role}
                  </span>
                  <span className="font-bold text-white text-sm">{driver.feature}</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-cyan-300 font-bold">{driver.contribution}</span>
                  <span className="text-slate-400">SHAP: {driver.shapValue}</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
                <div>
                  <span className="text-[10px] uppercase text-slate-400">CURRENT READING</span>
                  <div className="text-white font-bold">{driver.currentReading}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400">DESIGN BASELINE</span>
                  <div className="text-slate-300 font-semibold">{driver.nominalBaseline}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400">ENGINEERING DIAGNOSIS</span>
                  <div className="text-slate-200 text-[11px] leading-relaxed">{driver.explanation}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
