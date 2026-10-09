import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { 
  Sliders, 
  RotateCcw, 
  Gauge, 
  Wind, 
  Thermometer, 
  Activity, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Hourglass, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const SimulatorView: React.FC = () => {
  const { 
    selectedEquipment, 
    getSensor, 
    healthScore: baselineHealth, 
    prediction: baselinePrediction,
    thresholds,
    simulateWhatIf
  } = useFilter();

  const currentDp = getSensor('differential_pressure')?.value ?? 42.6;
  const currentFlow = getSensor('flow_rate')?.value ?? 1240;
  const currentTemp = getSensor('temperature')?.value ?? 68.4;
  const currentVib = getSensor('vibration')?.value ?? 3.2;
  const currentHours = getSensor('operating_hours')?.value ?? 4832;

  const [simDp, setSimDp] = useState<number>(currentDp);
  const [simFlow, setSimFlow] = useState<number>(currentFlow);
  const [simTemp, setSimTemp] = useState<number>(currentTemp);
  const [simVib, setSimVib] = useState<number>(currentVib);
  const [simHours, setSimHours] = useState<number>(currentHours);

  // Compute what-if simulation output
  const simResult = simulateWhatIf({
    dp: simDp,
    flow: simFlow,
    temp: simTemp,
    vib: simVib,
    hours: simHours
  });

  const handleResetToBaseline = () => {
    setSimDp(currentDp);
    setSimFlow(currentFlow);
    setSimTemp(currentTemp);
    setSimVib(currentVib);
    setSimHours(currentHours);
  };

  const handleApplyPreset = (preset: 'clean' | 'loading' | 'terminal' | 'sensor_fault') => {
    if (preset === 'clean') {
      setSimDp(25.0);
      setSimFlow(1480);
      setSimTemp(48.0);
      setSimVib(1.8);
      setSimHours(400);
    } else if (preset === 'loading') {
      setSimDp(54.0);
      setSimFlow(1050);
      setSimTemp(72.0);
      setSimVib(3.8);
      setSimHours(5100);
    } else if (preset === 'terminal') {
      setSimDp(74.0);
      setSimFlow(810);
      setSimTemp(84.0);
      setSimVib(5.6);
      setSimHours(5800);
    } else if (preset === 'sensor_fault') {
      // Discontinuous: high DP with maximum flow
      setSimDp(88.0);
      setSimFlow(1490);
      setSimTemp(52.0);
      setSimVib(1.9);
      setSimHours(currentHours);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner with Mandatory SIMULATION / DEMO DATA Labeling */}
      <div className="bg-[#0b101b] border border-amber-500/40 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-amber-400 font-bold">
                PROGNOSTIC MODEL EXPERIMENTATION ENGINE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                SIMULATION | DEMO DATA
              </span>
            </div>
            <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
              What-If Filter Simulator
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Adjust operating conditions to observe multi-parameter impact on Filter Health, Failure Risk, and Remaining Useful Life.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToBaseline}
              className="px-3.5 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-mono-tech flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset to Baseline</span>
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono-tech">
          <span className="text-slate-400">Simulation Presets:</span>
          <button
            onClick={() => handleApplyPreset('clean')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 transition-colors"
          >
            1. Fresh Cartridge (25.0 kPa)
          </button>
          <button
            onClick={() => handleApplyPreset('loading')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 transition-colors"
          >
            2. High Loading (54.0 kPa)
          </button>
          <button
            onClick={() => handleApplyPreset('terminal')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400 transition-colors"
          >
            3. Terminal Failure Zone (74.0 kPa)
          </button>
          <button
            onClick={() => handleApplyPreset('sensor_fault')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-400 transition-colors"
          >
            4. Plausibility Mismatch (Sensor Fault)
          </button>
        </div>

        {/* Anomaly Detection Banner in Simulator */}
        {simResult.isAnomaly && (
          <div className="mt-4 p-3 bg-purple-950/70 border border-purple-500/50 rounded-lg text-purple-200 text-xs font-mono-tech flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white uppercase">Physical Plausibility Warning: Sensor Anomaly</div>
              <p className="text-[11px] text-purple-300 mt-0.5">{simResult.anomalyMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Interactive Parameter Sliders & Side-by-Side Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Controls */}
        <div className="lg:col-span-7 bg-[#0b101b] border border-slate-800/80 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold font-mono-tech text-white uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Simulated Sensor Parameters</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust sliders below to test multi-regime filter response.
            </p>
          </div>

          {/* 1. Differential Pressure */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="flex items-center gap-1.5 font-semibold text-cyan-300">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                Differential Pressure (dP)
              </span>
              <span className="text-white font-bold text-base">{simDp.toFixed(1)} <span className="text-xs text-slate-400">kPa</span></span>
            </div>
            <input
              type="range"
              min={15}
              max={95}
              step={0.5}
              value={simDp}
              onChange={(e) => setSimDp(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
              <span>Nominal: 25 kPa</span>
              <span>Warning: {thresholds.differentialPressure.warning} kPa</span>
              <span>Critical: {thresholds.differentialPressure.critical} kPa</span>
            </div>
          </div>

          {/* 2. Flow Rate */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="flex items-center gap-1.5 font-semibold text-sky-300">
                <Wind className="w-3.5 h-3.5 text-sky-400" />
                Volumetric Flow Rate
              </span>
              <span className="text-white font-bold text-base">{simFlow.toFixed(0)} <span className="text-xs text-slate-400">L/min</span></span>
            </div>
            <input
              type="range"
              min={600}
              max={1600}
              step={10}
              value={simFlow}
              onChange={(e) => setSimFlow(parseFloat(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
              <span>Critical Min: 900 L/min</span>
              <span>Warning: 1,050 L/min</span>
              <span>Rated: 1,500 L/min</span>
            </div>
          </div>

          {/* 3. Temperature */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="flex items-center gap-1.5 font-semibold text-rose-300">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                Plenum Operating Temperature
              </span>
              <span className="text-white font-bold text-base">{simTemp.toFixed(1)} <span className="text-xs text-slate-400">°C</span></span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={0.5}
              value={simTemp}
              onChange={(e) => setSimTemp(parseFloat(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
              <span>Normal: 35-70 °C</span>
              <span>Warning: {thresholds.temperature.warning} °C</span>
              <span>Critical: {thresholds.temperature.critical} °C</span>
            </div>
          </div>

          {/* 4. Vibration */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="flex items-center gap-1.5 font-semibold text-amber-300">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                Filter Housing Vibration (RMS)
              </span>
              <span className="text-white font-bold text-base">{simVib.toFixed(1)} <span className="text-xs text-slate-400">mm/s</span></span>
            </div>
            <input
              type="range"
              min={0.5}
              max={15}
              step={0.1}
              value={simVib}
              onChange={(e) => setSimVib(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
              <span>Smooth: &lt; 3.0 mm/s</span>
              <span>Warning: {thresholds.vibration.warning} mm/s</span>
              <span>Critical: {thresholds.vibration.critical} mm/s</span>
            </div>
          </div>

          {/* 5. Accumulated Hours */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Accumulated Operating Hours
              </span>
              <span className="text-white font-bold text-base">{simHours.toLocaleString()} <span className="text-xs text-slate-400">hours</span></span>
            </div>
            <input
              type="range"
              min={0}
              max={7000}
              step={50}
              value={simHours}
              onChange={(e) => setSimHours(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
              <span>Installed: 0 h</span>
              <span>Standard Service Interval: {thresholds.operatingHours.serviceInterval} h</span>
            </div>
          </div>
        </div>

        {/* Right: Simulation Output & Comparison */}
        <div className="lg:col-span-5 bg-[#0b101b] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold font-mono-tech text-white uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Simulated Prognostic Response</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live baseline vs Simulated response
            </p>
          </div>

          {/* Health Comparison Card */}
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2 font-mono-tech">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>FILTER HEALTH SCORE</span>
              <StatusBadge status={simResult.condition} size="sm" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-bold text-white">{simResult.healthScore}</span>
                <span className="text-xs text-slate-400"> / 100</span>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400">Baseline: </span>
                <span className="text-cyan-300 font-bold">{baselineHealth}</span>
                <div className={`text-[10px] font-semibold ${
                  simResult.healthScore < baselineHealth ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {simResult.healthScore < baselineHealth ? `${simResult.healthScore - baselineHealth} pts` : `+${simResult.healthScore - baselineHealth} pts`}
                </div>
              </div>
            </div>
          </div>

          {/* Failure Probability Comparison */}
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2 font-mono-tech">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>FAILURE RISK PROBABILITY</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                simResult.riskLevel === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                simResult.riskLevel === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              }`}>
                {simResult.riskLevel}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-bold text-purple-300">{simResult.failureProbability}%</span>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400">Baseline: </span>
                <span className="text-slate-200 font-bold">{baselinePrediction.failureProbability}%</span>
              </div>
            </div>
          </div>

          {/* RUL Comparison */}
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2 font-mono-tech">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>ESTIMATED REMAINING USEFUL LIFE</span>
              <span className="text-[10px] text-amber-300 font-bold">ESTIMATED</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-bold text-white">{simResult.rulHours}</span>
                <span className="text-xs text-slate-400"> hours</span>
                <div className="text-xs text-amber-300 font-semibold">{simResult.rulDays} days</div>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400">Baseline: </span>
                <span className="text-slate-200 font-bold">{baselinePrediction.rulHours} h</span>
              </div>
            </div>
          </div>

          {/* Prescriptive Recommendation based on simulation */}
          <div className="p-3 bg-cyan-950/40 border border-cyan-800/50 rounded-lg text-xs font-mono-tech text-cyan-200 space-y-1">
            <div className="font-bold uppercase text-cyan-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Simulated Operator Action</span>
            </div>
            <p className="text-[11px] text-slate-300">
              {simResult.healthScore < 50 
                ? 'Immediate planned replacement indicated. Differential pressure exceedance limits filter cake capacity.'
                : simResult.healthScore < 75 
                ? 'Schedule cartridge inspection during next planned downtime window. Maintain continuous monitoring.'
                : 'Filter within nominal operating envelope. No maintenance dispatch required.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
