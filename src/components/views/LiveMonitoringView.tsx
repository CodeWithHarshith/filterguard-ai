import React from 'react';
import { useFilter } from '../../context/FilterContext';
import { SensorCard } from '../common/SensorCard';
import { StatusBadge } from '../common/StatusBadge';
import { Sparkline } from '../common/Sparkline';
import { DataQualityCard } from '../common/DataQualityCard';
import { 
  Activity, 
  RefreshCw, 
  Download, 
  SlidersHorizontal, 
  Clock, 
  Radio,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const LiveMonitoringView: React.FC = () => {
  const { 
    sensors, 
    lastUpdateSecondsAgo, 
    isLive, 
    setIsLive, 
    toggleParticleSensor,
    thresholds,
    exportSensorCSV,
    selectedEquipment
  } = useFilter();

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
              PHYSICAL TELEMETRY STREAM
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
            Live Sensor Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Continuous acquisition across multi-channel industrial instrumentation · {selectedEquipment.name}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={toggleParticleSensor}
            className={`px-3 py-1.5 rounded text-xs font-mono-tech border transition-colors ${
              thresholds.particleSensorConnected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Particle Sensor: {thresholds.particleSensorConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </button>

          <button
            onClick={() => setIsLive(!isLive)}
            className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono-tech text-cyan-400 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLive ? 'animate-spin' : ''}`} />
            <span>{isLive ? 'STREAMING (1 Hz)' : 'PAUSED'}</span>
          </button>

          <button
            onClick={exportSensorCSV}
            className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono-tech font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 6 Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor) => (
          <SensorCard
            key={sensor.id}
            sensor={sensor}
            lastUpdatedSecondsAgo={lastUpdateSecondsAgo}
          />
        ))}
      </div>

      {/* Comprehensive Telemetry Table */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
              DETAILED SENSOR TELEMETRY & HARDWARE PROBES
            </h3>
          </div>
          <span className="text-xs font-mono-tech text-slate-400">
            Bus: Modbus RTU over RS-485 / 19200 baud
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-tech">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">SENSOR CHANNEL</th>
                <th className="py-2.5 px-3">LOCATION</th>
                <th className="py-2.5 px-3">CURRENT VALUE</th>
                <th className="py-2.5 px-3">RATE OF CHANGE</th>
                <th className="py-2.5 px-3">NORMAL BAND</th>
                <th className="py-2.5 px-3">THRESHOLDS (WARN / CRIT)</th>
                <th className="py-2.5 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sensors.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    {s.name}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {s.sensorLocation || 'Line A Duct'}
                  </td>
                  <td className="py-3 px-3 font-bold text-cyan-300">
                    {s.isAvailable ? (
                      `${s.type === 'flow_rate' || s.type === 'operating_hours' ? s.value.toLocaleString() : s.value.toFixed(1)} ${s.unit}`
                    ) : (
                      <span className="text-slate-400 font-normal">Not Available</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {s.isAvailable && s.type !== 'operating_hours' ? (
                      <span className={`inline-flex items-center gap-1 ${
                        s.rateOfChange > 0 && s.type === 'differential_pressure' ? 'text-amber-400' :
                        s.rateOfChange < 0 && s.type === 'flow_rate' ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                        {s.rateOfChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {s.rateOfChange} {s.unit}/h
                      </span>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {s.normalRange[0]} - {s.normalRange[1]} {s.unit}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-amber-400">{s.warningThreshold} {s.unit}</span>
                    <span className="text-slate-600 mx-1">/</span>
                    <span className="text-rose-400">{s.criticalThreshold} {s.unit}</span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={s.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Quality & Diagnostic Telemetry */}
      <DataQualityCard />
    </div>
  );
};
