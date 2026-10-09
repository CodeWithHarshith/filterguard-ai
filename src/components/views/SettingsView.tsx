import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { 
  Sliders, 
  Save, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  UserCheck, 
  Database, 
  ExternalLink, 
  Copy, 
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DEFAULT_THRESHOLDS } from '../../data/mockData';
import { UserRole } from '../../types';
import { SUPABASE_PROJECT_ID, SUPABASE_URL } from '../../lib/supabase';
import { SUPABASE_SQL_SCHEMA } from '../../services/supabaseService';

export const SettingsView: React.FC = () => {
  const { 
    thresholds, 
    updateThresholds, 
    toggleParticleSensor, 
    userRole, 
    setUserRole,
    supabaseSyncStatus,
    testSupabaseConnection,
    syncToSupabaseNow,
    autoSyncEnabled,
    setAutoSyncEnabled
  } = useFilter();

  const [formThresholds, setFormThresholds] = useState(thresholds);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncMsg(null);
    const res = await syncToSupabaseNow();
    setIsSyncing(false);
    if (res.success) {
      setSyncMsg('All active telemetry & prediction records uploaded to Supabase!');
    } else {
      setSyncMsg(res.error || 'Sync executed.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholds(formThresholds);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    setFormThresholds(DEFAULT_THRESHOLDS);
    updateThresholds(DEFAULT_THRESHOLDS);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
              INSTRUMENTATION CALIBRATION
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
            Threshold Configuration & Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure dynamic warning and critical setpoints, alarm persistence, and hardware channel topology
          </p>
        </div>

        {/* Role Privileges Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono-tech">
          <span className="text-slate-400">ACTIVE ROLE:</span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold uppercase">
            {userRole}
          </span>
        </div>
      </div>

      {/* Role Selection Switcher (Prompt Section 33) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5 text-xs font-mono-tech">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              ROLE-BASED ACCESS CONTROL (RBAC)
            </h3>
          </div>
          <span className="text-slate-500 text-[11px]">Select persona for UI demonstration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              role: 'OPERATOR' as UserRole,
              title: 'Operator',
              permissions: 'View telemetry dashboards, inspect live sparklines, acknowledge basic operator warnings.'
            },
            {
              role: 'MAINTENANCE_ENGINEER' as UserRole,
              title: 'Maintenance Engineer',
              permissions: 'Inspect ML prognostic forecasts, evaluate RUL, dispatch work orders, schedule filter replacement.'
            },
            {
              role: 'ADMINISTRATOR' as UserRole,
              title: 'Administrator',
              permissions: 'Full calibration rights, tune warning/critical setpoints, adjust debounce persistence, configure topology.'
            }
          ].map(r => (
            <div
              key={r.role}
              onClick={() => setUserRole(r.role)}
              className={`p-3.5 rounded border cursor-pointer transition-all ${
                userRole === r.role
                  ? 'bg-cyan-950/60 border-cyan-500/80 shadow-md shadow-cyan-950/40 text-slate-100'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className={userRole === r.role ? 'text-white' : 'text-slate-300'}>{r.title}</span>
                {userRole === r.role && <Check className="w-4 h-4 text-cyan-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{r.permissions}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Supabase Cloud Backend Section */}
      <div className="bg-[#0b101b] border border-cyan-500/30 rounded-lg p-5 text-xs font-mono-tech space-y-4 shadow-lg shadow-cyan-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <span>Supabase PostgreSQL Backend</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  CONNECTED
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Project ID: <strong className="text-white">{SUPABASE_PROJECT_ID}</strong> · URL: <strong className="text-slate-300">{SUPABASE_URL}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center gap-1.5 transition-colors"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
            </button>

            <a
              href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <span>SQL Editor</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>

            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 hover:bg-emerald-900 font-bold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {syncMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {[
            { key: 'sensor_readings', name: 'sensor_readings', desc: 'Telemetry & Sparklines' },
            { key: 'filter_health', name: 'filter_health', desc: 'Health index & weights' },
            { key: 'predictions', name: 'predictions', desc: 'RUL & Failure risk' },
            { key: 'alerts', name: 'alerts', desc: 'Active & acknowledged alarms' },
            { key: 'work_orders', name: 'work_orders', desc: 'Dispatched work orders' },
          ].map(tbl => {
            const isReady = (supabaseSyncStatus.tablesStatus as any)[tbl.key];
            return (
              <div key={tbl.key} className="p-2.5 bg-slate-950/70 border border-slate-800 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{tbl.name}</span>
                  {isReady === true ? (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                      <AlertTriangle className="w-3 h-3" /> Ready to Create
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{tbl.desc}</div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 gap-2">
          <div className="flex items-center gap-2">
            <span>Continuous Ingestion:</span>
            <button
              type="button"
              onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                autoSyncEnabled ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-500'
              }`}
            >
              {autoSyncEnabled ? 'AUTO-SYNC ACTIVE (20s)' : 'AUTO-SYNC PAUSED'}
            </button>
          </div>

          <div>
            Last Cloud Sync: <strong className="text-slate-200">{supabaseSyncStatus.lastSyncTime || 'Pending first cycle'}</strong>
            {supabaseSyncStatus.syncedRecordsCount > 0 && (
              <span className="ml-1 text-cyan-400">({supabaseSyncStatus.syncedRecordsCount} records uploaded)</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Threshold Form */}
      <form onSubmit={handleSave} className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5 text-xs font-mono-tech space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              ALARM SETPOINTS & TOLERANCE ENVELOPES
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Warning thresholds trigger early diagnostic alerts; Critical thresholds trigger immediate escalation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Defaults</span>
            </button>

            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-500/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Setpoints</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 rounded text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Threshold setpoints saved and propagated to live prognostics engine!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Differential Pressure */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-3">
            <div className="font-bold text-white text-sm">Differential Pressure (kPa)</div>
            <div className="space-y-2">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Warning Setpoint:</label>
                <input
                  type="number"
                  step="0.5"
                  value={formThresholds.differentialPressure.warning}
                  onChange={(e) => setFormThresholds({
                    ...formThresholds,
                    differentialPressure: { ...formThresholds.differentialPressure, warning: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Critical Setpoint:</label>
                <input
                  type="number"
                  step="0.5"
                  value={formThresholds.differentialPressure.critical}
                  onChange={(e) => setFormThresholds({
                    ...formThresholds,
                    differentialPressure: { ...formThresholds.differentialPressure, critical: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white"
                />
              </div>
            </div>
          </div>

          {/* Flow Rate */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-3">
            <div className="font-bold text-white text-sm">Flow Rate (L/min)</div>
            <div className="space-y-2">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Warning Minimum:</label>
                <input
                  type="number"
                  value={formThresholds.flowRate.warning}
                  onChange={(e) => setFormThresholds({
                    ...formThresholds,
                    flowRate: { ...formThresholds.flowRate, warning: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Critical Minimum:</label>
                <input
                  type="number"
                  value={formThresholds.flowRate.critical}
                  onChange={(e) => setFormThresholds({
                    ...formThresholds,
                    flowRate: { ...formThresholds.flowRate, critical: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white"
                />
              </div>
            </div>
          </div>

          {/* Temperature */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-3">
            <div className="font-bold text-white text-sm">Operating Temperature (°C)</div>
            <div className="space-y-2">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Warning Limit:</label>
                <input
                  type="number"
                  step="0.5"
                  value={formThresholds.temperature.warning}
                  onChange={(e) => setFormThresholds({
                    ...formThresholds,
                    temperature: { ...formThresholds.temperature, warning: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Critical Limit:</label>
                <input
                  type="number"
                  step="0.5"
                  value={formThresholds.temperature.critical}
                  onChange={(e) => setFormThresholds({
                    ...formThresholds,
                    temperature: { ...formThresholds.temperature, critical: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white"
                />
              </div>
            </div>
          </div>

          {/* Vibration */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-3">
            <div className="font-bold text-white text-sm">Housing Vibration (mm/s)</div>
            <div className="space-y-2">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Warning (ISO Zone B):</label>
                <input
                  type="number"
                  step="0.1"
                  value={formThresholds.vibration.warning}
                  onChange={(e) => setFormThresholds({
                    ...formThresholds,
                    vibration: { ...formThresholds.vibration, warning: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Critical (ISO Zone C):</label>
                <input
                  type="number"
                  step="0.1"
                  value={formThresholds.vibration.critical}
                  onChange={(e) => setFormThresholds({
                    ...formThresholds,
                    vibration: { ...formThresholds.vibration, critical: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white"
                />
              </div>
            </div>
          </div>

          {/* Operating Hours Interval */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-3">
            <div className="font-bold text-white text-sm">Operating Hours Limit (h)</div>
            <div className="space-y-2">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Service Interval Target:</label>
                <input
                  type="number"
                  value={formThresholds.operatingHours.serviceInterval}
                  onChange={(e) => setFormThresholds({
                    ...formThresholds,
                    operatingHours: { serviceInterval: parseInt(e.target.value) || 6000 }
                  })}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Debounce Anti-Chatter (seconds):</label>
                <input
                  type="number"
                  value={formThresholds.debounceSeconds}
                  onChange={(e) => setFormThresholds({
                    ...formThresholds,
                    debounceSeconds: parseInt(e.target.value) || 5
                  })}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white"
                />
              </div>
            </div>
          </div>

          {/* Particle Sensor Hardware Link */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-3 flex flex-col justify-between">
            <div>
              <div className="font-bold text-white text-sm">Particle Sensor Channel</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Toggle physical hardware probe attachment state
              </p>
            </div>

            <div className="p-3 bg-slate-900/60 rounded border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Sensor Status:</span>
                <span className={`font-bold ${formThresholds.particleSensorConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {formThresholds.particleSensorConnected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleParticleSensor}
                className="mt-3 w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs"
              >
                {formThresholds.particleSensorConnected ? 'Simulate Disconnect' : 'Reconnect Hardware Probe'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
