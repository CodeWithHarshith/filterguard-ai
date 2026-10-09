import React from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Activity, 
  Cpu, 
  Hourglass, 
  Wrench, 
  CheckCircle2, 
  Database, 
  Zap, 
  TrendingUp,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { DemoScenario } from '../../types';

interface LandingPageProps {
  onOpenDashboard: () => void;
  onLaunchDemoScenario: (scenario: DemoScenario) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenDashboard,
  onLaunchDemoScenario
}) => {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-mono-tech font-bold text-lg">
                <span className="text-white">FilterGuard</span>
                <span className="text-cyan-400">AI</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono-tech">
                Predict. Prevent. Perform.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onLaunchDemoScenario('DEGRADING')}
              className="px-3.5 py-1.5 rounded border border-slate-700 hover:border-slate-600 bg-slate-900 text-xs font-mono-tech text-slate-300 transition-colors"
            >
              Launch Demo
            </button>
            <button
              onClick={onOpenDashboard}
              className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono-tech font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 max-w-6xl mx-auto w-full text-center">
        {/* Anti-slop subtle background grid */}
        <div className="absolute inset-0 bg-grid-industrial opacity-60 pointer-events-none -z-10" />

        {/* Project Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900/90 border border-slate-800 text-xs font-mono-tech text-cyan-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>PROGNOSTICS OF FILTER FAILURE USING DATA ANALYTICS</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Predict Filter Failure <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
            Before It Happens.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Monitor filter health in real time, detect degradation early, estimate remaining useful life, and make data-driven predictive maintenance decisions.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenDashboard}
            className="w-full sm:w-auto px-6 py-3 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono-tech font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]"
          >
            <span>Open Monitoring Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onLaunchDemoScenario('DEGRADING')}
            className="w-full sm:w-auto px-6 py-3 rounded border border-slate-700 hover:border-slate-500 bg-slate-900/80 text-slate-200 font-mono-tech font-medium text-sm transition-colors"
          >
            Launch Demo (DEGRADING Baseline)
          </button>
        </div>

        {/* Live Hero KPI Showcase Preview */}
        <div className="mt-12 bg-[#0b101b] border border-slate-800 rounded-lg p-5 max-w-4xl mx-auto shadow-2xl text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs font-mono-tech gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 uppercase">TELEMETRY BENCHMARK · PRODUCTION LINE A</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-300 font-semibold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SUPABASE SYNCED
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-bold">HEALTH: 82 / 100</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-400 font-bold">RUL: 26 DAYS (624 h)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-tech">
            <div className="p-3 bg-slate-900/60 rounded border border-slate-800/80">
              <div className="text-slate-400 text-[10px] uppercase">DIFFERENTIAL PRESSURE</div>
              <div className="text-xl font-bold text-white mt-1">42.6 <span className="text-xs text-slate-400">kPa</span></div>
              <div className="text-[10px] text-amber-400 mt-1">Warning: 50.0 kPa</div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded border border-slate-800/80">
              <div className="text-slate-400 text-[10px] uppercase">FLOW RATE</div>
              <div className="text-xl font-bold text-white mt-1">1,240 <span className="text-xs text-slate-400">L/min</span></div>
              <div className="text-[10px] text-slate-400 mt-1">-5.3% degradation</div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded border border-slate-800/80">
              <div className="text-slate-400 text-[10px] uppercase">TEMPERATURE</div>
              <div className="text-xl font-bold text-white mt-1">68.4 <span className="text-xs text-slate-400">°C</span></div>
              <div className="text-[10px] text-emerald-400 mt-1">Within normal band</div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded border border-slate-800/80">
              <div className="text-slate-400 text-[10px] uppercase">FAILURE PROBABILITY</div>
              <div className="text-xl font-bold text-cyan-400 mt-1">18.4%</div>
              <div className="text-[10px] text-slate-400 mt-1">Model Conf: 91.7%</div>
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End Workflow Diagram */}
      <section className="px-6 py-12 bg-[#090d16] border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
              PHYSICAL TO PREDICTIVE PIPELINE
            </h2>
            <p className="text-xl font-bold text-white mt-1">
              End-to-End Prognostics Workflow
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-xs font-mono-tech text-center">
            {[
              { step: '01', title: 'Sensor Data', desc: '5+ live industrial telemetry streams', icon: <Activity className="w-4 h-4 text-cyan-400 mx-auto" /> },
              { step: '02', title: 'Processing', desc: 'Debounce, zero-offset, CRC validation', icon: <Database className="w-4 h-4 text-sky-400 mx-auto" /> },
              { step: '03', title: 'Filter Health', desc: 'Multi-factor degradation indices', icon: <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto" /> },
              { step: '04', title: 'ML Prediction', desc: 'Time-series failure probability', icon: <Cpu className="w-4 h-4 text-purple-400 mx-auto" /> },
              { step: '05', title: 'RUL Estimator', desc: 'Remaining hours & failure window', icon: <Hourglass className="w-4 h-4 text-amber-400 mx-auto" /> },
              { step: '06', title: 'Smart Alerts', desc: 'Multi-condition debounced alerts', icon: <ShieldAlert className="w-4 h-4 text-rose-400 mx-auto" /> },
              { step: '07', title: 'Maintenance', desc: 'Prescriptive work order execution', icon: <Wrench className="w-4 h-4 text-cyan-400 mx-auto" /> },
            ].map((st, i) => (
              <div key={st.step} className="p-3 bg-slate-900/60 border border-slate-800 rounded flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-cyan-500/80 font-bold">{st.step}</div>
                  <div className="my-1.5">{st.icon}</div>
                  <div className="font-semibold text-slate-200">{st.title}</div>
                </div>
                <div className="text-[10px] text-slate-400 mt-2">{st.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="px-6 py-16 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0b101b] border border-slate-800 p-5 rounded-lg flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded bg-cyan-950/80 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-mono-tech font-bold text-white uppercase">Real-Time Monitoring</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Monitor differential pressure, airflow rate, temperature, vibration, and operating hours continuously with live sparklines and rate-of-change metrics.
              </p>
            </div>
            <button 
              onClick={onOpenDashboard}
              className="mt-4 text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View live streams</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#0b101b] border border-slate-800 p-5 rounded-lg flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded bg-sky-950/80 border border-sky-800/40 flex items-center justify-center text-sky-400 mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-mono-tech font-bold text-white uppercase">AI Predictions</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Time-series predictive models quantify 7-day and 30-day failure risk, feature contributions, and model confidence scores to catch degradation early.
              </p>
            </div>
            <button 
              onClick={onOpenDashboard}
              className="mt-4 text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Explore inference</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#0b101b] border border-slate-800 p-5 rounded-lg flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded bg-amber-950/80 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-3">
                <Hourglass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-mono-tech font-bold text-white uppercase">RUL Estimation</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Estimate Remaining Useful Life (RUL) with statistical confidence intervals and degradation forecast graphs displaying model uncertainty.
              </p>
            </div>
            <button 
              onClick={onOpenDashboard}
              className="mt-4 text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Check forecast curves</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#0b101b] border border-slate-800 p-5 rounded-lg flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-3">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-mono-tech font-bold text-white uppercase">Predictive Maintenance</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Turn AI insights into actionable maintenance recommendations, prevent unplanned downtime, and automatically dispatch work orders.
              </p>
            </div>
            <button 
              onClick={onOpenDashboard}
              className="mt-4 text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Manage work orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-6 bg-[#090d16] text-xs font-mono-tech text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">FilterGuard AI</span>
            <span>·</span>
            <span>Industrial Predictive Maintenance Platform</span>
          </div>
          <div>
            Prognostics of Filter Failure Using Data Analytics · 2026
          </div>
        </div>
      </footer>
    </div>
  );
};
