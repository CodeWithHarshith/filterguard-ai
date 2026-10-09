import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { HealthGauge } from '../common/HealthGauge';
import { RULGauge } from '../common/RULGauge';
import { SensorCard } from '../common/SensorCard';
import { StatusBadge } from '../common/StatusBadge';
import { DegradationForecastChart } from '../common/DegradationForecastChart';
import { CorrelationScatterChart } from '../common/CorrelationScatterChart';
import { EquipmentSchematic } from '../common/EquipmentSchematic';
import { DataQualityCard } from '../common/DataQualityCard';
import DraggableWidgetGrid, { WidgetItem } from '@/components/ui/draggable-widget-grid';
import { 
  ShieldCheck, 
  Cpu, 
  Hourglass, 
  AlertTriangle, 
  Wrench, 
  ArrowRight, 
  TrendingDown, 
  Info, 
  Calendar, 
  Layers, 
  LayoutGrid, 
  Move, 
  RotateCcw,
  Database
} from 'lucide-react';
import { NavItemKey } from '../layout/Sidebar';
import { SUPABASE_PROJECT_ID } from '../../lib/supabase';

interface OverviewViewProps {
  onNavigate: (tab: NavItemKey) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const { 
    healthScore, 
    filterCondition, 
    overallStatus, 
    prediction, 
    sensors, 
    healthFactors, 
    lastUpdateSecondsAgo,
    forecastData,
    alerts,
    recommendations,
    selectedEquipment,
    thresholds,
    supabaseSyncStatus
  } = useFilter();

  const lifecycleStages = [
    { key: 'EXCELLENT', label: 'Clean', range: '90–100' },
    { key: 'GOOD', label: 'Loaded', range: '75–89' },
    { key: 'DEGRADED', label: 'Degraded', range: '50–74' },
    { key: 'CRITICAL', label: 'Critical', range: '30–49' },
    { key: 'FAILED', label: 'Failed', range: '<30' },
  ];

  const [isOverviewDraggable, setIsOverviewDraggable] = useState(true);
  const [overviewWidgetItems, setOverviewWidgetItems] = useState<WidgetItem[]>([
    { id: 'sensor-dp-01', size: 'wide', label: 'Differential Pressure' },
    { id: 'sensor-fl-01', size: 'wide', label: 'Flow Rate' },
    { id: 'sensor-temp-01', size: 'sm', label: 'Operating Temperature' },
    { id: 'sensor-vib-01', size: 'sm', label: 'Housing Vibration' },
    { id: 'sensor-hrs-01', size: 'wide', label: 'Operating Hours' },
    { id: 'sensor-part-01', size: 'sm', label: 'Particle Concentration' },
  ]);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Filter Health Overview (Prompt Section 6) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
                PROGNOSTICS OF FILTER FAILURE USING DATA ANALYTICS
              </span>
            </div>
            <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
              Filter Health Overview
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time condition monitoring and AI-powered failure prognostics · {selectedEquipment.name} ({selectedEquipment.id})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('draggable_grid')}
              className="px-3 py-1.5 rounded bg-cyan-950/70 border border-cyan-500/40 hover:bg-cyan-900/60 text-xs font-mono-tech text-cyan-300 flex items-center gap-1.5 transition-colors shadow-xs"
              title="Customize dashboard layout with draggable widgets"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
              <span>Draggable Grid</span>
            </button>
            <StatusBadge status={overallStatus} size="lg" />
            <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono-tech text-slate-300 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Installed: {selectedEquipment.installationDate}</span>
            </div>
          </div>
        </div>

        {/* Supabase Cloud Live Ingestion Bar */}
        <div className="mt-4 p-3 bg-slate-950/80 rounded-lg border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-emerald-950/90 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-bold">Supabase Cloud Connected:</span>
                <span className="text-cyan-400 font-mono">{SUPABASE_PROJECT_ID}</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 font-semibold px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  POSTGRESQL SYNC ACTIVE
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Storing sensor readings, filter health metrics, ML predictions, RUL, alerts & maintenance records in Supabase.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-emerald-400 font-semibold">
              {supabaseSyncStatus.syncedRecordsCount} Records Pushed
            </span>
            <button
              onClick={() => onNavigate('supabase')}
              className="px-3 py-1.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Supabase Hub</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 2. Top Trio: Health Score + Failure Probability + RUL (Section 37 Visual Hierarchy) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
          {/* Health Gauge Box */}
          <div className="lg:col-span-4 bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 flex flex-col items-center justify-center">
            <HealthGauge 
              score={healthScore} 
              condition={filterCondition} 
              overallStatus={overallStatus} 
            />
            <div className="w-full mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 text-center text-xs font-mono-tech">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">CONDITION</span>
                <div className="font-semibold text-slate-200 mt-0.5">{filterCondition}</div>
              </div>
              <div className="border-l border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">LAST MAINT</span>
                <div className="font-semibold text-slate-200 mt-0.5">{selectedEquipment.lastMaintenanceDate}</div>
              </div>
            </div>
          </div>

          {/* Failure Probability Box */}
          <div className="lg:col-span-3 bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-[11px] font-mono-tech uppercase text-slate-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  FAILURE PROBABILITY
                </span>
                <span className="text-[10px] font-mono-tech text-cyan-400 font-semibold">DEMO PREDICTED</span>
              </div>

              <div className="my-4">
                <div className="text-4xl font-mono-tech font-bold text-white tracking-tight">
                  {prediction.failureProbability}%
                </div>
                <div className="text-xs font-mono-tech text-slate-400 mt-1">
                  Overall ML Risk Index
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-800/80 pt-3 text-xs font-mono-tech">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">7-Day Failure Risk:</span>
                  <span className="text-amber-400 font-semibold">{prediction.risk7Day}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">30-Day Failure Risk:</span>
                  <span className="text-rose-400 font-semibold">{prediction.risk30Day}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Model Confidence:</span>
                  <span className="text-emerald-400 font-semibold">{prediction.modelConfidence}%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('ml_predictions')}
              className="mt-3 w-full py-1.5 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono-tech text-cyan-400 flex items-center justify-center gap-1 transition-colors"
            >
              <span>View Model Insights</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* RUL Gauge Box */}
          <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 flex flex-col justify-between">
            <RULGauge prediction={prediction} />

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs font-mono-tech">
              <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">PREDICTED FAILURE</span>
                <div className="text-rose-400 font-semibold mt-0.5">{prediction.predictedFailureWindow}</div>
              </div>
              <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">SERVICE WINDOW</span>
                <div className="text-amber-400 font-semibold mt-0.5">{prediction.recommendedMaintenanceWindow}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Sensor Monitoring Cards (Draggable Widget Grid) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-mono-tech font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Move className="w-4 h-4 text-cyan-400" />
              LIVE SENSOR MONITORING & DRAGGABLE TILES
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
              DRAGGABLE
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono-tech text-slate-400">
            <button
              onClick={() => setIsOverviewDraggable(!isOverviewDraggable)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
                isOverviewDraggable 
                  ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 font-semibold' 
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title="Toggle draggable rearrangement"
            >
              <Move className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isOverviewDraggable ? 'Drag Mode: ON' : 'Drag Mode: LOCKED'}</span>
            </button>

            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              ● LIVE
            </span>
            <span>· Updated: {lastUpdateSecondsAgo}s ago</span>
          </div>
        </div>

        {isOverviewDraggable ? (
          <div>
            <div className="text-[11px] font-mono-tech text-slate-400 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Grab any card to rearrange layout (mouse drag, touch long-press 350ms, or Alt + arrow keys).</span>
              <button 
                onClick={() => setOverviewWidgetItems([
                  { id: 'sensor-dp-01', size: 'wide', label: 'Differential Pressure' },
                  { id: 'sensor-fl-01', size: 'wide', label: 'Flow Rate' },
                  { id: 'sensor-temp-01', size: 'sm', label: 'Operating Temperature' },
                  { id: 'sensor-vib-01', size: 'sm', label: 'Housing Vibration' },
                  { id: 'sensor-hrs-01', size: 'wide', label: 'Operating Hours' },
                  { id: 'sensor-part-01', size: 'sm', label: 'Particle Concentration' },
                ])}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Positions</span>
              </button>
            </div>
            <DraggableWidgetGrid
              items={overviewWidgetItems}
              onChange={setOverviewWidgetItems}
              editable={true}
              maxColumns={3}
              cellSize={250}
              gap={16}
              radius={12}
              renderItem={(item) => {
                const sensor = sensors.find(s => s.id === item.id);
                if (!sensor) return null;
                return (
                  <div className="h-full w-full">
                    <SensorCard sensor={sensor} lastUpdatedSecondsAgo={lastUpdateSecondsAgo} />
                  </div>
                );
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensors.map((sensor) => (
              <SensorCard 
                key={sensor.id} 
                sensor={sensor} 
                lastUpdatedSecondsAgo={lastUpdateSecondsAgo} 
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. Filter Condition & Contributing Factors Analysis (Prompt Section 9) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
              FILTER CONDITION & CONTRIBUTING FACTORS
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Weighted breakdown of physical degradation components toward health score ({healthScore}/100)
            </p>
          </div>

          {/* Visual Lifecycle Progression (Clean -> Loaded -> Degraded -> Critical -> Failed) */}
          <div className="flex items-center gap-1 text-[11px] font-mono-tech">
            {lifecycleStages.map((stage, idx) => {
              const isCurrent = filterCondition === stage.key;
              return (
                <React.Fragment key={stage.key}>
                  <div className={`px-2 py-1 rounded text-center border transition-all ${
                    isCurrent 
                      ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300 font-bold shadow-xs' 
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                  }`}>
                    <div>{stage.label}</div>
                  </div>
                  {idx < lifecycleStages.length - 1 && (
                    <span className="text-slate-600">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Contributing Factor Sliders / Weightings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {healthFactors.map((f) => (
            <div key={f.id} className="p-3 bg-slate-950/60 rounded border border-slate-800/80 text-xs font-mono-tech">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold">{f.name}</span>
                <span className="text-cyan-400">{f.weightPercent}% weight</span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-900 rounded overflow-hidden mt-2 border border-slate-800">
                <div 
                  className={`h-full rounded ${
                    f.contributionScore >= 75 ? 'bg-emerald-500' :
                    f.contributionScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${f.contributionScore}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                <span>Sub-Score: <strong className="text-slate-200">{f.contributionScore}/100</strong></span>
                <span className={`uppercase font-semibold ${
                  f.impact === 'high' ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  {f.impact} impact
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Sensor Correlation & Degradation Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <CorrelationScatterChart />
        </div>
        <div className="lg:col-span-6">
          <DegradationForecastChart data={forecastData} />
        </div>
      </div>

      {/* 6. ML Prediction Reasoning / Explanation (Section 13) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
              WHY IS THE MODEL PREDICTING THIS?
            </h3>
          </div>
          <span className="text-xs font-mono-tech text-slate-400">
            Model-derived insights (Confidence: {prediction.modelConfidence}%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prediction.insights.map((insight, idx) => (
            <div key={idx} className="p-3 bg-slate-900/60 rounded border border-slate-800/80 flex items-start gap-2.5 text-xs font-mono-tech text-slate-300 leading-relaxed">
              <span className="w-5 h-5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shrink-0 flex items-center justify-center font-bold text-[10px]">
                {idx + 1}
              </span>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Active Alerts & Maintenance Recommendations Quick Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Active Alerts */}
        <div className="lg:col-span-6 bg-[#0b101b] border border-slate-800/80 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
                  ACTIVE ALERTS ({alerts.filter(a => a.status === 'NEW').length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('alerts')}
                className="text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 2).map((a) => (
                <div key={a.id} className="p-3 bg-slate-900/70 rounded border border-slate-800 flex flex-col gap-1.5 text-xs font-mono-tech">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={a.severity} size="sm" />
                    <span className="text-[10px] text-slate-400">{a.timestamp}</span>
                  </div>
                  <div className="text-slate-200 font-semibold">{a.sensor}: {a.value}</div>
                  <div className="text-slate-400 text-[11px] leading-relaxed">{a.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Maintenance Recommendations */}
        <div className="lg:col-span-6 bg-[#0b101b] border border-slate-800/80 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
                  PREDICTIVE RECOMMENDATIONS
                </h3>
              </div>
              <button
                onClick={() => onNavigate('maintenance')}
                className="text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Maintenance hub</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recommendations.slice(0, 2).map((rec) => (
                <div key={rec.id} className="p-3 bg-slate-900/70 rounded border border-slate-800 flex flex-col gap-1.5 text-xs font-mono-tech">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{rec.title}</span>
                    <StatusBadge status={rec.priority} size="sm" />
                  </div>
                  <div className="text-slate-400 text-[11px]">{rec.action}</div>
                  <div className="text-[10px] text-cyan-400">Target window: {rec.recommendedWindow}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 8. Equipment Schematic */}
      <EquipmentSchematic />

      {/* 9. Data Quality Telemetry */}
      <DataQualityCard />
    </div>
  );
};
