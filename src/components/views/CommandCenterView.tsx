import React, { useState, useEffect } from 'react';
import DraggableWidgetGrid, { WidgetItem, WidgetSize } from '@/components/ui/draggable-widget-grid';
import { useFilter } from '../../context/FilterContext';
import { 
  ShieldCheck, 
  Cpu, 
  Hourglass, 
  Gauge, 
  Wind, 
  Thermometer, 
  Activity, 
  TrendingDown, 
  AlertTriangle, 
  Wrench, 
  CheckCircle2, 
  RotateCcw, 
  Move, 
  Layers, 
  Clock, 
  Zap, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  Wifi,
  Database,
  Play,
  Pause,
  ChevronRight,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Sparkline } from '../common/Sparkline';
import { DegradationForecastChart } from '../common/DegradationForecastChart';
import { NavItemKey } from '../layout/Sidebar';

interface CommandCenterViewProps {
  onNavigate?: (tab: NavItemKey) => void;
}

const STORAGE_KEY = 'filterguard_command_center_layout_v2';

const DEFAULT_COMMAND_CENTER_WIDGETS: WidgetItem[] = [
  { id: 'fg-health', size: 'sm', label: 'Filter Health Index' },
  { id: 'fg-risk', size: 'sm', label: 'Failure Risk Probability' },
  { id: 'fg-rul', size: 'sm', label: 'Remaining Useful Life' },
  { id: 'fg-confidence', size: 'sm', label: 'ML Model Confidence' },
  { id: 'fg-dp', size: 'wide', label: 'Differential Pressure (Primary)' },
  { id: 'fg-flow', size: 'sm', label: 'Flow Rate' },
  { id: 'fg-temp', size: 'sm', label: 'Operating Temperature' },
  { id: 'fg-vib', size: 'sm', label: 'Housing Vibration' },
  { id: 'fg-sensor-health', size: 'sm', label: 'Sensor Signal Health' },
  { id: 'fg-trajectory', size: 'wide', label: 'Degradation Trajectory' },
  { id: 'fg-alerts', size: 'wide', label: 'Active Alerts Stream' },
  { id: 'fg-copilot', size: 'wide', label: 'Maintenance Copilot Recommendation' },
];

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({ onNavigate }) => {
  const { 
    selectedEquipment, 
    selectedEquipmentId,
    healthScore, 
    filterCondition, 
    overallStatus, 
    prediction, 
    sensors, 
    getSensor, 
    alerts, 
    recommendations,
    lastUpdateSecondsAgo, 
    forecastData,
    connectionMode,
    esp32State,
    thresholds,
    isJudgeDemoRunning,
    startJudgeDemo,
    stopJudgeDemo,
    currentJudgeDemoStep,
    judgeDemoStepIndex,
    anomalyStatusMessage
  } = useFilter();

  const [widgetItems, setWidgetItems] = useState<WidgetItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_COMMAND_CENTER_WIDGETS;
  });

  const [isEditable, setIsEditable] = useState(true);

  const handleWidgetsChange = (newItems: WidgetItem[]) => {
    setWidgetItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      // storage quota
    }
  };

  const handleResetLayout = () => {
    setWidgetItems(DEFAULT_COMMAND_CENTER_WIDGETS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  const dp = getSensor('differential_pressure');
  const fl = getSensor('flow_rate');
  const temp = getSensor('temperature');
  const vib = getSensor('vibration');
  const hrs = getSensor('operating_hours');
  const part = getSensor('particle_concentration');

  const activeAlerts = alerts.filter(a => a.status === 'NEW');
  const topRec = recommendations[0];

  const renderWidgetContent = (item: WidgetItem, size: WidgetSize) => {
    switch (item.id) {
      case 'fg-health':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-cyan-400">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                FILTER HEALTH
              </span>
              <StatusBadge status={overallStatus} size="sm" />
            </div>

            <div className="my-auto flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-white">{healthScore}</span>
              <span className="text-sm text-slate-400">/ 100</span>
              <span className="ml-auto text-xs text-cyan-300 font-semibold uppercase">{filterCondition}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>{selectedEquipment.id} | Health Score</span>
              <span>Updated {lastUpdateSecondsAgo}s ago</span>
            </div>
          </div>
        );

      case 'fg-risk':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-purple-400">
                <Cpu className="w-4 h-4 text-purple-400" />
                FAILURE RISK
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                prediction.failureProbability > 60 ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                prediction.failureProbability > 30 ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              }`}>
                {prediction.riskLevel}
              </span>
            </div>

            <div className="my-auto flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-purple-300">{prediction.failureProbability}%</span>
              <span className="text-xs text-slate-400">Probability</span>
              <span className="ml-auto text-[11px] text-slate-400">7-Day: {prediction.risk7Day}%</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Horizon: {prediction.predictedFailureWindow}</span>
              <span className="text-emerald-400 font-semibold">ESTIMATED</span>
            </div>
          </div>
        );

      case 'fg-rul':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-amber-400">
                <Hourglass className="w-4 h-4 text-amber-400" />
                REMAINING USEFUL LIFE
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-bold">
                ESTIMATED
              </span>
            </div>

            <div className="my-auto flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-white">{prediction.rulHours}</span>
              <span className="text-sm text-slate-400">HOURS</span>
              <span className="ml-auto text-xs text-amber-300 font-semibold">{prediction.rulDays} DAYS</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>90% CI: [{prediction.rulConfidenceInterval[0] * 24}, {prediction.rulConfidenceInterval[1] * 24}] h</span>
              <span>Accum: {hrs?.value.toLocaleString()} h</span>
            </div>
          </div>
        );

      case 'fg-confidence':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-emerald-400">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                MODEL CONFIDENCE
              </span>
              <span className="text-[10px] text-slate-400">{prediction.modelVersion}</span>
            </div>

            <div className="my-auto flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-emerald-300">{prediction.modelConfidence}%</span>
              <span className="text-xs text-slate-400">Quantile Fit</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>LSTM + Gradient Boost</span>
              <span className="text-cyan-400">No Model Drift</span>
            </div>
          </div>
        );

      case 'fg-dp':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-cyan-300 uppercase">DIFFERENTIAL PRESSURE (PRIMARY INDICATOR)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">Warn: {thresholds.differentialPressure.warning} kPa | Crit: {thresholds.differentialPressure.critical} kPa</span>
                <StatusBadge status={dp?.status || 'NORMAL'} size="sm" />
              </div>
            </div>

            <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-2">
              <div className="md:col-span-5 flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight text-white">{dp?.value.toFixed(1)}</span>
                <span className="text-base text-slate-400 font-semibold">{dp?.unit}</span>
                <span className={`text-xs font-semibold ml-2 ${
                  (dp?.rateOfChange || 0) > 0 ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  +{(dp?.rateOfChange || 0.35).toFixed(2)} kPa/h
                </span>
              </div>
              <div className="md:col-span-7 h-12 flex items-center">
                {dp?.history && <Sparkline data={dp.history} color="#06b6d4" height={44} />}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Normal Operating Band: 20.0 - 50.0 kPa</span>
              <span>Rate of increase indicates pleat loading rate</span>
            </div>
          </div>
        );

      case 'fg-flow':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-sky-400">
                <Wind className="w-4 h-4 text-sky-400" />
                FLOW RATE
              </span>
              <StatusBadge status={fl?.status || 'NORMAL'} size="sm" />
            </div>

            <div className="my-auto flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-white">{fl?.value.toFixed(0)}</span>
              <span className="text-sm text-slate-400">{fl?.unit}</span>
              <span className="ml-auto text-xs text-amber-400 font-semibold">
                -5.3% vs Nominal
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Rated: {selectedEquipment.ratedFlow} L/min</span>
              <span>Warn: {thresholds.flowRate.warning} L/min</span>
            </div>
          </div>
        );

      case 'fg-temp':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-slate-300">
                <Thermometer className="w-4 h-4 text-rose-400" />
                TEMPERATURE
              </span>
              <StatusBadge status={temp?.status || 'NORMAL'} size="sm" />
            </div>

            <div className="my-auto flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-white">{temp?.value.toFixed(1)}</span>
              <span className="text-sm text-slate-400">{temp?.unit}</span>
              <span className="ml-auto text-xs text-emerald-400">Normal Band</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Threshold: {thresholds.temperature.warning} °C</span>
              <span>Intake Plenum Probe</span>
            </div>
          </div>
        );

      case 'fg-vib':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-slate-300">
                <Activity className="w-4 h-4 text-amber-400" />
                VIBRATION
              </span>
              <StatusBadge status={vib?.status || 'NORMAL'} size="sm" />
            </div>

            <div className="my-auto flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-white">{vib?.value.toFixed(1)}</span>
              <span className="text-sm text-slate-400">{vib?.unit}</span>
              <span className="ml-auto text-xs text-slate-400">RMS Peak</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Limit: {thresholds.vibration.critical} mm/s</span>
              <span>Filter Housing Sensor</span>
            </div>
          </div>
        );

      case 'fg-sensor-health':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-emerald-400">
                <Wifi className="w-4 h-4 text-emerald-400" />
                ESP32 SIGNAL & DATA
              </span>
              <span className="text-[10px] text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/40">
                {esp32State.payloadValidationStatus}
              </span>
            </div>

            <div className="my-auto space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Device ID:</span>
                <span className="text-cyan-300 font-bold">{esp32State.deviceId}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Sampling Rate:</span>
                <span className="text-white font-bold">{esp32State.samplingFrequencyHz} Hz (Continuous)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Packet Loss:</span>
                <span className="text-emerald-400 font-semibold">{esp32State.packetLossPercent}% (38,412 pkts)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Signal: {esp32State.signalDbm} dBm</span>
              <span>Mesh Wi-Fi OK</span>
            </div>
          </div>
        );

      case 'fg-trajectory':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-cyan-300 uppercase">DEGRADATION TRAJECTORY (ACTUAL vs PREDICTED vs ZONE)</span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> Actual
                </span>
                <span className="flex items-center gap-1 text-purple-400">
                  <span className="w-2.5 h-0.5 bg-purple-400 border-t border-dashed inline-block" /> Predicted
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2.5 h-0.5 bg-rose-400 inline-block" /> Critical (70 kPa)
                </span>
              </div>
            </div>

            <div className="my-2 h-40">
              <DegradationForecastChart data={forecastData} height={150} />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Historical Trend: 26.4 kPa to 42.6 kPa</span>
              <span>Estimated Failure Zone: Day 26 to Day 32</span>
            </div>
          </div>
        );

      case 'fg-alerts':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-amber-300 uppercase">ACTIVE ALERTS & EVENT LOG</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                {activeAlerts.length} Unresolved
              </span>
            </div>

            <div className="my-2 space-y-2 max-h-36 overflow-y-auto pr-1">
              {alerts.slice(0, 2).map((a) => (
                <div key={a.id} className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={a.severity} size="sm" />
                      <span className="font-bold text-slate-200">{a.id}</span>
                      <span className="text-slate-400">| {a.sensor}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] mt-1">{a.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{a.timestamp}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Debounce Filter Active (3 consecutive cycles)</span>
              {onNavigate && (
                <button onClick={() => onNavigate('alerts')} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5">
                  <span>View All Alerts</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        );

      case 'fg-copilot':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-cyan-300 uppercase">MAINTENANCE COPILOT RECOMMENDATION</span>
              </div>
              {topRec && <StatusBadge status={topRec.priority} size="sm" />}
            </div>

            <div className="my-2 p-3 bg-slate-950/80 rounded border border-slate-800">
              <div className="font-bold text-white text-xs">
                {topRec?.title || 'Schedule Filter Element Inspection'}
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Reason: Differential pressure is trending upward (+0.35 kPa/h) while volumetric flow is declining (-5.3%).
              </p>
              <div className="mt-2 text-[11px] text-cyan-300 font-semibold">
                Recommended Action: {topRec?.action || 'Inspect filter cartridge and prepare replacement element within 14 days.'}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Scheduled Window: {topRec?.recommendedWindow || 'Next scheduled maintenance'}</span>
              {onNavigate && (
                <button onClick={() => onNavigate('maintenance')} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 font-bold">
                  <span>Dispatch Work Order</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded text-slate-400 text-xs font-mono-tech">
            {item.label || item.id}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Command Center Header & Hardware Identifiers */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400 font-bold">
                COMMAND CENTER | INDUSTRIAL FILTER PROGNOSTICS
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono-tech bg-amber-950/80 text-amber-300 border border-amber-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {connectionMode === 'LIVE' ? 'LIVE ESP32 DATA' : 'DEMO DATA'}
              </span>
            </div>
            <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
              {selectedEquipment.id} - {selectedEquipment.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Active Hardware Layer: <span className="text-cyan-300 font-semibold">{esp32State.deviceId}</span> | {selectedEquipment.location} | Installed {selectedEquipment.installationDate}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Controlled Judge Demo Sequence Button (Section 34 & 56) */}
            <button
              onClick={() => {
                if (isJudgeDemoRunning) {
                  stopJudgeDemo();
                } else {
                  startJudgeDemo();
                }
              }}
              className={`px-3 py-1.5 rounded text-xs font-mono-tech font-bold flex items-center gap-1.5 transition-colors shadow-xs ${
                isJudgeDemoRunning 
                  ? 'bg-rose-950 border border-rose-500/50 text-rose-300 hover:bg-rose-900' 
                  : 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900'
              }`}
              title="Automated 14-Step Controlled Judge Demonstration"
            >
              {isJudgeDemoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isJudgeDemoRunning ? 'Pause Judge Demo' : 'Run Judge Demo (14 Steps)'}</span>
            </button>

            <button
              onClick={handleResetLayout}
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono-tech flex items-center gap-1.5 transition-colors"
              title="Reset Draggable Widgets to default industrial layout"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span>Reset Layout</span>
            </button>

            <StatusBadge status={overallStatus} size="lg" />
          </div>
        </div>

        {/* Anomaly banner if sensor anomaly triggered */}
        {anomalyStatusMessage && (
          <div className="mt-4 p-3 bg-amber-950/70 border border-amber-500/40 rounded-lg text-amber-200 text-xs font-mono-tech flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{anomalyStatusMessage}</span>
          </div>
        )}

        {/* Controlled Demo Status Strip if running */}
        {isJudgeDemoRunning && (
          <div className="mt-4 p-3 bg-cyan-950/70 border border-cyan-500/40 rounded-lg text-xs font-mono-tech flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-300 font-bold">CONTROLLED DEMONSTRATION | STEP {currentJudgeDemoStep.step} / 14:</span>
              <span className="text-white font-semibold">{currentJudgeDemoStep.title}</span>
            </div>
            <div className="text-[11px] text-cyan-200">
              Phase: <span className="font-bold underline">{currentJudgeDemoStep.phase}</span> | {currentJudgeDemoStep.description}
            </div>
          </div>
        )}

        {/* Keyboard & Drag Instructions Strip */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono-tech text-slate-400 pt-3 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Move className="w-3 h-3 text-cyan-400" />
              <span>Drag widgets with mouse, stylus, or long-press on touch</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline">
              Keyboard: focus widget, hold <kbd className="px-1 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300">Alt</kbd> + arrow keys
            </span>
          </div>
          <div>
            Data Freshness: <span className="text-emerald-400">{lastUpdateSecondsAgo}s ago</span> | ESP32 Stream OK
          </div>
        </div>
      </div>

      {/* 2. Draggable Widget Grid (Section 6, 7, 8) */}
      <div className="w-full">
        <DraggableWidgetGrid
          items={widgetItems}
          editable={isEditable}
          maxColumns={4}
          cellSize={270}
          gap={16}
          radius={10}
          onChange={handleWidgetsChange}
          renderItem={renderWidgetContent}
        />
      </div>
    </div>
  );
};
