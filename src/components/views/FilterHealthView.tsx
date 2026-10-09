import React from 'react';
import { useFilter } from '../../context/FilterContext';
import { HealthGauge } from '../common/HealthGauge';
import { StatusBadge } from '../common/StatusBadge';
import { HeartPulse, CheckCircle2, AlertTriangle, ShieldCheck, Layers, Gauge } from 'lucide-react';

export const FilterHealthView: React.FC = () => {
  const { 
    healthScore, 
    filterCondition, 
    overallStatus, 
    healthFactors, 
    selectedEquipment,
    thresholds 
  } = useFilter();

  const lifecycleStages = [
    { key: 'EXCELLENT', label: 'Clean', desc: 'Virgin porous media, minimal flow resistance' },
    { key: 'GOOD', label: 'Loaded', desc: 'Normal cake formation, optimal filtration efficiency' },
    { key: 'DEGRADED', label: 'Degraded', desc: 'Elevated resistance, initial flow throttling' },
    { key: 'CRITICAL', label: 'Critical', desc: 'Severe loading, media rupture hazard' },
    { key: 'FAILED', label: 'Failed', desc: 'Threshold exceeded or bypass seal failure' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
              PHYSICAL INTEGRITY ASSESSMENT
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
            Filter Condition & Health Diagnostics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-parametric health index synthesis based on real-time sensor weights · {selectedEquipment.name}
          </p>
        </div>

        <StatusBadge status={filterCondition} size="lg" />
      </div>

      {/* Main Health Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-[#0b101b] border border-slate-800/80 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-mono-tech uppercase tracking-wider text-slate-400 mb-2">
            OVERALL FILTER HEALTH
          </div>

          <HealthGauge 
            score={healthScore} 
            condition={filterCondition} 
            overallStatus={overallStatus} 
            size={220}
          />

          <div className="mt-4 p-3 bg-slate-950/60 rounded border border-slate-800/80 w-full text-xs font-mono-tech text-slate-300">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">STATUS RATING:</span>
              <strong className="text-cyan-400">{filterCondition} ({healthScore}/100)</strong>
            </div>
            <p className="text-[11px] text-slate-400 text-left leading-relaxed">
              Filter media is operating in normal loaded steady-state. Degradation slope is within nominal parameters with no signs of tear or abnormal bypass.
            </p>
          </div>
        </div>

        {/* Lifecycle Progression */}
        <div className="lg:col-span-7 bg-[#0b101b] border border-slate-800/80 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <h3 className="text-sm font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
                LIFECYCLE STAGE PROGRESSION
              </h3>
              <span className="text-xs font-mono-tech text-slate-400">
                Clean → Loaded → Degraded → Critical → Failed
              </span>
            </div>

            <div className="space-y-3">
              {lifecycleStages.map((st, i) => {
                const isCurrent = filterCondition === st.key;
                return (
                  <div
                    key={st.key}
                    className={`p-3 rounded border text-xs font-mono-tech transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-cyan-950/60 border-cyan-500/80 shadow-md shadow-cyan-950/50'
                        : 'bg-slate-900/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                        isCurrent ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {i + 1}
                      </div>
                      <div>
                        <div className={`font-semibold uppercase ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                          {st.label} {isCurrent && <span className="text-cyan-400 ml-1.5 font-normal">(CURRENT ACTIVE STATE)</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{st.desc}</div>
                      </div>
                    </div>

                    <StatusBadge status={st.key} size="sm" showDot={isCurrent} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Factor Breakdown Weights */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
              HEALTH COMPONENT WEIGHTINGS & SUB-INDEX SCORES
            </h3>
          </div>
          <span className="text-xs font-mono-tech text-slate-400">
            {thresholds.particleSensorConnected ? 'Standard 7-Factor Model' : '5-Factor Re-allocated Weights'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthFactors.map((f) => (
            <div key={f.id} className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-lg flex flex-col justify-between text-xs font-mono-tech">
              <div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold text-white">{f.name}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
                    {f.weightPercent}% Weight
                  </span>
                </div>

                <div className="my-3">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[11px] text-slate-400">Factor Sub-Score</span>
                    <span className="text-lg font-bold text-white">{f.contributionScore}/100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded ${
                        f.contributionScore >= 75 ? 'bg-emerald-500' :
                        f.contributionScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${f.contributionScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 mt-2">
                <span>Degradation Impact:</span>
                <span className={`uppercase font-semibold ${
                  f.impact === 'high' ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  {f.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
