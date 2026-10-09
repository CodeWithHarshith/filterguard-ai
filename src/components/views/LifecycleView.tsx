import React from 'react';
import { useFilter } from '../../context/FilterContext';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Wrench, 
  ShieldCheck, 
  ArrowRight,
  RotateCcw,
  Calendar,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface LifecycleEvent {
  stage: string;
  title: string;
  date: string;
  hours: number;
  dp: number;
  status: 'COMPLETED' | 'ACTIVE' | 'UPCOMING';
  notes: string;
}

export const LifecycleView: React.FC = () => {
  const { selectedEquipment, overallStatus, healthScore } = useFilter();

  const lifecycleStages: LifecycleEvent[] = [
    {
      stage: '1. Installed',
      title: 'Filter Assembly Initial Mounting',
      date: '12 Aug 2026',
      hours: 0,
      dp: 24.2,
      status: 'COMPLETED',
      notes: 'New AeroMax Pro-HEPA 9000-X cartridge inserted into plenum housing A-1. Seals integrity tested.'
    },
    {
      stage: '2. Commissioned',
      title: 'Baseline Airflow Calibration',
      date: '13 Aug 2026',
      hours: 24,
      dp: 26.0,
      status: 'COMPLETED',
      notes: 'ESP32 pressure transducer zeroed. Rated volumetric flow verified at 1,500 L/min under clean media condition.'
    },
    {
      stage: '3. Healthy',
      title: 'Initial High Efficiency Operation',
      date: '20 Aug 2026',
      hours: 720,
      dp: 28.5,
      status: 'COMPLETED',
      notes: 'Particle filtration efficiency > 99.97% at 0.3 µm. Constant delta pressure within nominal envelope.'
    },
    {
      stage: '4. Loading',
      title: 'Particulate Dust Cake Formation',
      date: '10 Sep 2026',
      hours: 2400,
      dp: 36.8,
      status: 'COMPLETED',
      notes: 'Interstitial pleat loading begins. Pressure rise velocity observed at +0.12 kPa/h.'
    },
    {
      stage: '5. Degrading',
      title: 'Accelerated Hydraulic Resistance',
      date: '28 Sep 2026',
      hours: 4832,
      dp: 42.6,
      status: 'ACTIVE',
      notes: 'Current state: Differential pressure at 42.6 kPa. Flow drops by 5.3%. Health index calculated at 82 / 100.'
    },
    {
      stage: '6. Maintenance Recommended',
      title: 'Predictive Horizon Threshold Reached',
      date: 'Estimated 24 Oct 2026',
      hours: 5450,
      dp: 54.0,
      status: 'UPCOMING',
      notes: 'Prognostic model schedules work order dispatch prior to terminal pressure limit.'
    },
    {
      stage: '7. Maintenance',
      title: 'Planned Cartridge Changeout',
      date: 'Estimated 02 Nov 2026',
      hours: 5650,
      dp: 68.0,
      status: 'UPCOMING',
      notes: 'Controlled shutdown for filter element extraction and manifold sanitation.'
    },
    {
      stage: '8. Recovered',
      title: 'Post-Maintenance Condition Re-verification',
      date: 'Estimated 03 Nov 2026',
      hours: 5674,
      dp: 25.5,
      status: 'UPCOMING',
      notes: 'Zero-hour reset of operational counters and historical degradation cycle archiving.'
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
                END-TO-END ASSET CHRONOLOGY
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-slate-900 text-slate-300 border border-slate-800">
                CYCLE #106 CURRENT
              </span>
            </div>
            <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
              Filter Lifecycle Timeline
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Traceability from installation and commissioning through loading, degradation, maintenance recommendation, and recovery.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <StatusBadge status={overallStatus} size="lg" />
            <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono-tech text-slate-300">
              Health: <span className="text-white font-bold">{healthScore} / 100</span>
            </div>
          </div>
        </div>

        {/* Current Lifecycle Stage Pill */}
        <div className="mt-4 p-3 bg-slate-950/70 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono-tech">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Phase:</span>
            <span className="text-amber-400 font-bold uppercase">5. DEGRADING (Hydraulic Resistance Climbing)</span>
          </div>
          <div className="text-slate-400">
            Total Accrued Hours: <span className="text-white font-bold">{selectedEquipment.operatingHours} h</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Lifecycle Stepper */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-xl p-6">
        <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8 font-mono-tech">
          {lifecycleStages.map((st, i) => (
            <div key={st.stage} className="relative group">
              {/* Dot */}
              <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                st.status === 'COMPLETED' ? 'bg-emerald-950 border-emerald-400 text-emerald-400' :
                st.status === 'ACTIVE' ? 'bg-amber-950 border-amber-400 text-amber-400 animate-pulse' :
                'bg-slate-900 border-slate-700 text-slate-600'
              }`}>
                {st.status === 'COMPLETED' ? (
                  <CheckCircle2 className="w-2.5 h-2.5" />
                ) : (
                  <div className={`w-1.5 h-1.5 rounded-full ${st.status === 'ACTIVE' ? 'bg-amber-400' : 'bg-slate-600'}`} />
                )}
              </div>

              {/* Card */}
              <div className={`p-4 rounded-lg border transition-colors ${
                st.status === 'ACTIVE' 
                  ? 'bg-slate-950 border-cyan-500/50 shadow-sm shadow-cyan-500/10' 
                  : st.status === 'COMPLETED'
                  ? 'bg-slate-950/60 border-slate-800'
                  : 'bg-slate-950/30 border-slate-900 opacity-75'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase">{st.stage}</span>
                    <span className="text-sm font-bold text-white">{st.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">{st.date}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      st.status === 'COMPLETED' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' :
                      st.status === 'ACTIVE' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40' :
                      'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}>
                      {st.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400">ACCUMULATED HOURS</span>
                    <div className="text-white font-bold">{st.hours} h</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400">DIFFERENTIAL PRESSURE</span>
                    <div className="text-cyan-300 font-bold">{st.dp} kPa</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] uppercase text-slate-400">OPERATIONAL NOTES</span>
                    <div className="text-slate-300 text-[11px] leading-relaxed">{st.notes}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
