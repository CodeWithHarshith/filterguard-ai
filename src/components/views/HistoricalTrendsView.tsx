import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { History, GitCompare, Calendar, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

export const HistoricalTrendsView: React.FC = () => {
  const { maintenanceCycles, selectedEquipment } = useFilter();
  const [selectedCycleA, setSelectedCycleA] = useState<string>('CYC-01');
  const [selectedCycleB, setSelectedCycleB] = useState<string>('CYC-02');
  const [metricKey, setMetricKey] = useState<'pressure' | 'flow' | 'health' | 'vibration'>('pressure');

  const cycleA = maintenanceCycles.find(c => c.cycleId === selectedCycleA) || maintenanceCycles[0];
  const cycleB = maintenanceCycles.find(c => c.cycleId === selectedCycleB) || maintenanceCycles[1];

  const timelineMilestones = [
    { title: 'Installation & Baseline', date: '12 Aug 2026', desc: 'Fresh AeroMax Pro-HEPA element fitted. Initial ΔP: 21.8 kPa, Flow: 1,490 L/min' },
    { title: 'Initial Operation (Depth Filtration)', date: '25 Aug 2026', desc: 'Linear shallow resistance increase. Fine particles trapped within fibrous depth' },
    { title: 'Cake Formation & Loading', date: '10 Sep 2026', desc: 'Surface cake established. Filtration efficiency increases to 99.98% at 38 kPa' },
    { title: 'Progressive Degradation', date: '22 Sep 2026', desc: 'ΔP crosses 42 kPa. Flow reduced by 5.3%. ML model triggers inspection recommendation' },
    { title: 'Scheduled Maintenance', date: 'Target: 06 Nov 2026', desc: 'Planned filter element exchange during scheduled changeover window' },
    { title: 'Replacement & Recalibration', date: 'Future', desc: 'Cartridge swap and pressure sensor zero-offset recalibration' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
              LONGITUDINAL LIFECYCLE
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
            Historical Filter Performance & Cycle Comparison
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate past run-to-failure cycles vs current active operating envelope
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-tech">
          <span className="text-slate-400">ARCHIVED CYCLES:</span>
          <span className="text-cyan-400 font-bold">{maintenanceCycles.length} DATASETS</span>
        </div>
      </div>

      {/* Cycle Comparison (Prompt Section 22) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5 text-xs font-mono-tech">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              MAINTENANCE CYCLE COMPARISON (CYCLE 1 vs CYCLE 2)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase text-[10px]">METRIC:</span>
            {(['pressure', 'flow', 'health', 'vibration'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMetricKey(m)}
                className={`px-2.5 py-1 rounded capitalize transition-colors ${
                  metricKey === m
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison KPI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-slate-950/70 border border-cyan-900/50 rounded-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold">{cycleA.name}</span>
              <span className="text-slate-500">{cycleA.period}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">DURATION</span>
                <div className="font-bold text-white mt-0.5">{cycleA.durationHours} h</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">FINAL ΔP</span>
                <div className="font-bold text-rose-400 mt-0.5">{cycleA.finalPressure} kPa</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">FLOW DROP</span>
                <div className="font-bold text-amber-400 mt-0.5">-{cycleA.flowDegradationPercent}%</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/70 border border-sky-900/50 rounded-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-sky-300 font-bold">{cycleB.name}</span>
              <span className="text-slate-500">{cycleB.period}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">RUNTIME SO FAR</span>
                <div className="font-bold text-white mt-0.5">{cycleB.durationHours} h</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">CURRENT ΔP</span>
                <div className="font-bold text-cyan-300 mt-0.5">{cycleB.finalPressure} kPa</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">FLOW DROP</span>
                <div className="font-bold text-amber-400 mt-0.5">-{cycleB.flowDegradationPercent}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Degradation Curves Comparison Graph */}
        <div className="p-4 bg-slate-950/90 rounded border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-slate-400 text-[11px]">
            <span>X-Axis: Operating Hours (0 to 5,500 h)</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-3 h-0.5 bg-cyan-400" /> Cycle 1 (Q1-Q2)
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-3 h-0.5 bg-sky-400" /> Cycle 2 (Current)
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto py-2">
            <svg viewBox="0 0 740 200" className="w-full min-w-[580px] h-auto">
              {/* Grid */}
              {[40, 80, 120, 160].map(y => (
                <line key={y} x1="40" y1={y} x2="720" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              ))}

              {/* Curve A (Cycle 1) */}
              {(() => {
                const ptsA = (cycleA.points || []).map(pt => {
                  const x = 50 + (pt.hours / 5500) * 650;
                  const val = pt[metricKey];
                  const max = metricKey === 'pressure' ? 75 : metricKey === 'flow' ? 1600 : 100;
                  const y = 180 - (val / max) * 150;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(' ');

                const ptsB = (cycleB.points || []).map(pt => {
                  const x = 50 + (pt.hours / 5500) * 650;
                  const val = pt[metricKey];
                  const max = metricKey === 'pressure' ? 75 : metricKey === 'flow' ? 1600 : 100;
                  const y = 180 - (val / max) * 150;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(' ');

                return (
                  <>
                    <polyline fill="none" stroke="#06b6d4" strokeWidth="2.5" points={ptsA} />
                    <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5 3" points={ptsB} />
                  </>
                );
              })()}
            </svg>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 text-right">
            Cycle 2 shows improved loading longevity due to optimized upstream pre-filter media upgrade.
          </div>
        </div>
      </div>

      {/* Filter Lifecycle Progression Timeline (Section 21) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5 text-xs font-mono-tech">
        <div className="border-b border-slate-800/80 pb-3 mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            FILTER LIFECYCLE CHRONOLOGY (FLT-001)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Installation → Operation → Loading → Degradation → Maintenance → Replacement
          </p>
        </div>

        <div className="relative border-l-2 border-slate-800 ml-3 pl-5 space-y-6">
          {timelineMilestones.map((ms, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-cyan-500 border-2 border-[#0b101b]" />
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">{ms.title}</span>
                <span className="text-slate-500 text-[10px]">[{ms.date}]</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                {ms.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
