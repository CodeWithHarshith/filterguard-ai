import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { StatusBadge } from '../common/StatusBadge';
import { AlertSeverity, AlertStatus } from '../../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  ShieldCheck, 
  Clock, 
  Sliders, 
  BellRing,
  ArrowRight,
  Info
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { 
    alerts, 
    acknowledgeAlert, 
    resolveAlert, 
    thresholds, 
    updateThresholds,
    userRole 
  } = useFilter();

  const [severityFilter, setSeverityFilter] = useState<'ALL' | AlertSeverity>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AlertStatus>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
              SAFETY & EVENT MANAGEMENT
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
            Alerts & Events Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time debounced alarms with automated diagnostic remediation guides
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-tech">
          <div className="p-2 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300">
            Critical: <strong>{alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length}</strong>
          </div>
          <div className="p-2 rounded bg-amber-950/40 border border-amber-800/60 text-amber-300">
            Warning: <strong>{alerts.filter(a => a.severity === 'WARNING' && a.status !== 'RESOLVED').length}</strong>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Total: <strong>{alerts.length}</strong>
          </div>
        </div>
      </div>

      {/* Intelligent Debounce & Correlation Alert Rules Banner (Section 19) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-4 text-xs font-mono-tech">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold uppercase tracking-wider text-slate-200">
              INTELLIGENT ALARM LOGIC & DEBOUNCE RULES
            </h3>
          </div>
          <span className="text-slate-400 text-[11px]">
            Anti-chatter persistence: <strong>{thresholds.debounceSeconds}s delay</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 text-[11px] leading-relaxed">
          <div className="p-3 bg-slate-950/70 rounded border border-slate-800">
            <div className="text-cyan-400 font-semibold mb-1">RULE 01: MULTI-SENSOR COMPOUND TRIP</div>
            <div>
              IF [ΔP &gt; 50 kPa] AND [Flow &lt; 1,050 L/min] AND [Hours &gt; 4,500 h] persist for &gt; 3 cycles, escalate severity from WARNING to HIGH DEGRADATION ALERT.
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded border border-slate-800">
            <div className="text-emerald-400 font-semibold mb-1">RULE 02: NOISE FILTERING & ZERO-CHATTER</div>
            <div>
              Single sensor spikes caused by line ramp-up are automatically debounced to prevent spurious alarm trips.
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0b101b] border border-slate-800/80 rounded-lg p-3 text-xs font-mono-tech">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 uppercase mr-1">SEVERITY:</span>
          {(['ALL', 'CRITICAL', 'WARNING', 'INFORMATION'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded transition-colors ${
                severityFilter === sev
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 uppercase mr-1">STATUS:</span>
          {(['ALL', 'NEW', 'ACKNOWLEDGED', 'RESOLVED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === st
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-[#0b101b] border border-slate-800/80 rounded-lg text-slate-400 font-mono-tech text-xs">
            No alerts matching the selected filter criteria.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-[#0b101b] border rounded-lg p-4 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all ${
                alert.severity === 'CRITICAL' ? 'border-rose-900/40 bg-rose-950/10' :
                alert.severity === 'WARNING' ? 'border-amber-900/40 bg-amber-950/10' :
                'border-slate-800/80'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={alert.severity} size="sm" />
                  <span className="text-xs font-mono-tech font-bold text-white">{alert.id}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-mono-tech text-slate-300">{alert.sensor}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-mono-tech text-slate-400">{alert.timestamp}</span>
                </div>

                <div className="text-sm font-mono-tech font-semibold text-white">
                  {alert.message}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech text-slate-300">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-900">
                    <span className="text-slate-400 text-[10px] uppercase">READING / THRESHOLD:</span>
                    <div className="mt-0.5 font-bold text-cyan-300">{alert.value} (Limit: {alert.threshold})</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-900">
                    <span className="text-slate-400 text-[10px] uppercase">RECOMMENDED ACTION:</span>
                    <div className="mt-0.5 text-slate-200">{alert.recommendedAction}</div>
                  </div>
                </div>

                {alert.acknowledgedBy && (
                  <div className="text-[11px] font-mono-tech text-slate-400 flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Acknowledged by <strong className="text-slate-200">{alert.acknowledgedBy}</strong> ({alert.acknowledgedAt})</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row md:flex-col items-center gap-2 shrink-0">
                {alert.status === 'NEW' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono-tech text-slate-200 transition-colors"
                  >
                    Acknowledge
                  </button>
                )}

                {alert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="w-full px-3 py-1.5 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-xs font-mono-tech text-emerald-300 font-semibold transition-colors"
                  >
                    Mark Resolved
                  </button>
                )}

                {alert.status === 'RESOLVED' && (
                  <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono-tech text-slate-400">
                    RESOLVED
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
