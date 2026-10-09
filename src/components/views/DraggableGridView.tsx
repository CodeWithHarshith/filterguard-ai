import React, { useState } from 'react';
import DraggableWidgetGrid, { WidgetItem, WidgetSize } from '@/components/ui/draggable-widget-grid';
import { useFilter } from '../../context/FilterContext';
import { 
  LayoutGrid, 
  Move, 
  RotateCcw, 
  Sparkles, 
  Activity, 
  Gauge, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  Cpu, 
  Hourglass, 
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Demo from '@/components/ui/demo';

type BoardMode = 'industrial' | 'observability';

const INITIAL_INDUSTRIAL_WIDGETS: WidgetItem[] = [
  { id: 'fg-health', size: 'wide', label: 'Filter Health Index' },
  { id: 'fg-pressure', size: 'wide', label: 'Differential Pressure' },
  { id: 'fg-rul', size: 'sm', label: 'Remaining Useful Life' },
  { id: 'fg-prediction', size: 'sm', label: 'ML Failure Risk' },
  { id: 'fg-flow', size: 'wide', label: 'Flow Delivery Rate' },
  { id: 'fg-temp', size: 'sm', label: 'Plenum Temperature' },
  { id: 'fg-vib', size: 'sm', label: 'Housing Vibration' },
  { id: 'fg-alerts', size: 'wide', label: 'Active Alerts Stream' },
  { id: 'fg-particle', size: 'sm', label: 'Particle Concentration' },
];

export const DraggableGridView: React.FC = () => {
  const { 
    healthScore, 
    filterCondition, 
    overallStatus, 
    getSensor, 
    prediction, 
    alerts, 
    lastUpdateSecondsAgo,
    selectedEquipment 
  } = useFilter();

  const [boardMode, setBoardMode] = useState<BoardMode>('industrial');
  const [industrialItems, setIndustrialItems] = useState<WidgetItem[]>(INITIAL_INDUSTRIAL_WIDGETS);
  const [isEditable, setIsEditable] = useState(true);
  const [maxColumns, setMaxColumns] = useState(4);

  const dp = getSensor('differential_pressure');
  const fl = getSensor('flow_rate');
  const temp = getSensor('temperature');
  const vib = getSensor('vibration');
  const part = getSensor('particle_concentration');

  const handleResetLayout = () => {
    setIndustrialItems([...INITIAL_INDUSTRIAL_WIDGETS]);
  };

  const renderIndustrialWidget = (item: WidgetItem, size: WidgetSize) => {
    switch (item.id) {
      case 'fg-health':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-cyan-400">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                FILTER HEALTH INDEX
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                {overallStatus}
              </span>
            </div>

            <div className="my-auto flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-white">{healthScore}</span>
              <span className="text-sm text-slate-400">/ 100</span>
              <span className="ml-auto text-xs text-slate-300 font-semibold uppercase">{filterCondition}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>{selectedEquipment.id} · Line A Intake</span>
              <span>Updated {lastUpdateSecondsAgo}s ago</span>
            </div>
          </div>
        );

      case 'fg-pressure':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-cyan-300">
                <Gauge className="w-4 h-4 text-cyan-400" />
                DIFFERENTIAL PRESSURE
              </span>
              <span className="text-amber-400 text-[10px] flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +0.35 kPa/h
              </span>
            </div>

            <div className="my-auto">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-white">{dp?.value.toFixed(1) || '42.6'}</span>
                <span className="text-sm text-slate-400">kPa</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Warn limit: 50.0 kPa · Crit: 70.0 kPa
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span className="text-cyan-400">NORMAL OPERATING RANGE</span>
              <span className="text-emerald-400">STATUS: {dp?.status || 'NORMAL'}</span>
            </div>
          </div>
        );

      case 'fg-rul':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-cyan-400">
                <Hourglass className="w-4 h-4 text-cyan-400" />
                EST. RUL
              </span>
              <span className="text-[10px] text-slate-400">90% CI</span>
            </div>

            <div className="my-auto">
              <div className="text-3xl font-bold text-cyan-300">
                {prediction.rulDays} <span className="text-base text-slate-400 font-normal">DAYS</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                ~{prediction.rulHours} operating hours
              </div>
            </div>

            <div className="text-[10px] text-amber-400 border-t border-slate-800/80 pt-2 truncate">
              Fail: {prediction.predictedFailureWindow}
            </div>
          </div>
        );

      case 'fg-prediction':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-rose-300">
                <Cpu className="w-4 h-4 text-cyan-400" />
                FAILURE RISK
              </span>
              <span className="text-[10px] text-cyan-400">{prediction.modelConfidence}% Conf</span>
            </div>

            <div className="my-auto">
              <div className="text-3xl font-bold text-white">{prediction.failureProbability}%</div>
              <div className="text-[11px] text-amber-400 mt-1">7-Day Risk: {prediction.risk7Day}%</div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
              LSTM Model Prediction
            </div>
          </div>
        );

      case 'fg-flow':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-sky-300">
                <Wind className="w-4 h-4 text-sky-400" />
                AIRFLOW DELIVERY RATE
              </span>
              <span className="text-amber-400 text-[10px]">-5.3% degradation</span>
            </div>

            <div className="my-auto">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-white">{fl?.value.toLocaleString() || '1,240'}</span>
                <span className="text-sm text-slate-400">L/min</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Nominal benchmark: 1,310 L/min · Minimum safe: 900 L/min
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Main Discharge Venturi</span>
              <span className="text-emerald-400">{fl?.status || 'NORMAL'}</span>
            </div>
          </div>
        );

      case 'fg-temp':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-amber-300">
                <Thermometer className="w-4 h-4 text-amber-400" />
                TEMPERATURE
              </span>
            </div>

            <div className="my-auto">
              <div className="text-3xl font-bold text-white">{temp?.value.toFixed(1) || '68.4'}°C</div>
              <div className="text-[11px] text-slate-400 mt-1">Normal: 45–72°C</div>
            </div>

            <div className="text-[10px] text-emerald-400 border-t border-slate-800/80 pt-2">
              Plenum Sensor Online
            </div>
          </div>
        );

      case 'fg-vib':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-purple-300">
                <Activity className="w-4 h-4 text-purple-400" />
                VIBRATION
              </span>
            </div>

            <div className="my-auto">
              <div className="text-3xl font-bold text-white">{vib?.value.toFixed(1) || '3.2'} <span className="text-xs text-slate-400">mm/s</span></div>
              <div className="text-[11px] text-slate-400 mt-1">ISO Zone A/B Intact</div>
            </div>

            <div className="text-[10px] text-emerald-400 border-t border-slate-800/80 pt-2">
              Fan Drive Stable
            </div>
          </div>
        );

      case 'fg-alerts':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                ACTIVE ALERTS STREAM
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800/50">
                {alerts.filter(a => a.status === 'NEW').length} PENDING
              </span>
            </div>

            <div className="my-auto space-y-1.5">
              {alerts.slice(0, 2).map(a => (
                <div key={a.id} className="text-xs flex items-center justify-between gap-2 p-1.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-200 truncate">{a.message}</span>
                  <span className="text-amber-400 text-[10px] shrink-0">{a.value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Debounced Alarms</span>
              <span className="text-cyan-400">View Console →</span>
            </div>
          </div>
        );

      case 'fg-particle':
        return (
          <div className="flex flex-col justify-between h-full p-4 bg-[#0d1424] text-slate-100 font-mono-tech select-none">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                PARTICLES
              </span>
            </div>

            <div className="my-auto">
              {part?.isAvailable ? (
                <>
                  <div className="text-3xl font-bold text-white">{part.value.toFixed(1)} <span className="text-xs text-slate-400">µg/m³</span></div>
                  <div className="text-[11px] text-emerald-400 mt-1">Optical counter online</div>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold text-slate-400">NOT AVAILABLE</div>
                  <div className="text-[11px] text-slate-500 mt-1">Excluded from ML</div>
                </>
              )}
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
              Downstream Sensor
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-slate-900 text-slate-200">
            {item.label || item.id}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
              CUSTOMIZABLE DASHBOARD
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
            Draggable Widget Grid
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Rearrangeable real-time monitoring and AI observability widgets powered by Motion and exact tiling algorithm
          </p>
        </div>

        {/* Board Switcher & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono-tech">
            <button
              onClick={() => setBoardMode('industrial')}
              className={`px-3 py-1.5 rounded transition-colors ${
                boardMode === 'industrial'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FilterGuard Industrial
            </button>
            <button
              onClick={() => setBoardMode('observability')}
              className={`px-3 py-1.5 rounded transition-colors ${
                boardMode === 'observability'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AI Observability Suite
            </button>
          </div>

          {boardMode === 'industrial' && (
            <>
              <button
                onClick={() => setIsEditable(!isEditable)}
                className={`px-3 py-1.5 rounded border text-xs font-mono-tech flex items-center gap-1.5 transition-colors ${
                  isEditable 
                    ? 'bg-slate-900 border-cyan-500/50 text-cyan-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
                title="Toggle drag-and-drop customization"
              >
                <Move className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isEditable ? 'Editing Enabled' : 'Locked'}</span>
              </button>

              <button
                onClick={handleResetLayout}
                className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono-tech text-slate-300 flex items-center gap-1.5 transition-colors"
                title="Reset widgets to initial arrangement"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* User Interaction Instructions Hint */}
      <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg text-xs font-mono-tech text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-semibold uppercase">HOW TO REARRANGE:</span>
          <span>Click & drag with mouse · Press & hold 350ms on touch · Or hold <strong className="text-slate-200">Alt + Arrow Keys</strong> on focused widget.</span>
        </div>
        <span className="text-slate-500 text-[11px]">Zero-gap exact rectangle tiling</span>
      </div>

      {/* Main Board View */}
      {boardMode === 'industrial' ? (
        <div className="bg-[#0b101b] border border-slate-800/80 rounded-xl p-4 md:p-6 shadow-xl">
          <DraggableWidgetGrid
            items={industrialItems}
            onChange={setIndustrialItems}
            editable={isEditable}
            maxColumns={maxColumns}
            cellSize={220}
            gap={14}
            radius={16}
            renderItem={renderIndustrialWidget}
          />
        </div>
      ) : (
        <div className="bg-[#0b101b] border border-slate-800/80 rounded-xl p-4 md:p-6 shadow-xl overflow-hidden">
          <Demo />
        </div>
      )}
    </div>
  );
};
