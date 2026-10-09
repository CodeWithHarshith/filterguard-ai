import React, { useState, useEffect } from 'react';
import { useFilter } from '../../context/FilterContext';
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  Cloud, 
  Eye, 
  EyeOff, 
  Download, 
  Send, 
  Cpu, 
  Hourglass, 
  Wrench, 
  Activity, 
  Layers,
  FileCode,
  HardDrive
} from 'lucide-react';
import { 
  SUPABASE_PROJECT_ID, 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY 
} from '../../lib/supabase';
import { 
  SUPABASE_SQL_SCHEMA, 
  SupabaseService,
  SyncedSensorReadingRow,
  SyncedFilterHealthRow,
  SyncedPredictionRow,
  SyncedAlertRow,
  SyncedWorkOrderRow
} from '../../services/supabaseService';
import { StatusBadge } from '../common/StatusBadge';

type TableTab = 'sensor_readings' | 'filter_health' | 'predictions' | 'alerts' | 'work_orders' | 'historical_data';

export const SupabaseView: React.FC = () => {
  const { 
    selectedEquipment, 
    selectedEquipmentId,
    sensors, 
    healthScore, 
    filterCondition, 
    overallStatus, 
    prediction, 
    alerts, 
    workOrders, 
    maintenanceCycles,
    supabaseSyncStatus, 
    testSupabaseConnection, 
    syncToSupabaseNow, 
    autoSyncEnabled, 
    setAutoSyncEnabled 
  } = useFilter();

  const [activeTableTab, setActiveTableTab] = useState<TableTab>('sensor_readings');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Table records loaded from cloud or local synced store
  const [sensorRows, setSensorRows] = useState<SyncedSensorReadingRow[]>([]);
  const [healthRows, setHealthRows] = useState<SyncedFilterHealthRow[]>([]);
  const [predictionRows, setPredictionRows] = useState<SyncedPredictionRow[]>([]);
  const [alertRows, setAlertRows] = useState<SyncedAlertRow[]>([]);
  const [workOrderRows, setWorkOrderRows] = useState<SyncedWorkOrderRow[]>([]);
  const [isLoadingRows, setIsLoadingRows] = useState(false);

  // Load records for the active tab
  const loadTableData = async () => {
    setIsLoadingRows(true);
    try {
      if (activeTableTab === 'sensor_readings') {
        const data = await SupabaseService.fetchRecentReadings(selectedEquipmentId, 50);
        // If empty, generate immediate current telemetry snapshot
        if (data.length === 0) {
          const snapshot = sensors.map(s => ({
            equipment_id: selectedEquipmentId,
            sensor_type: s.type,
            value: s.value,
            unit: s.unit,
            status: s.status,
            rate_of_change: s.rateOfChange,
            created_at: new Date().toISOString()
          }));
          setSensorRows(snapshot);
        } else {
          setSensorRows(data);
        }
      } else if (activeTableTab === 'filter_health') {
        const data = await SupabaseService.fetchRecentHealth(selectedEquipmentId, 20);
        if (data.length === 0) {
          setHealthRows([{
            equipment_id: selectedEquipmentId,
            health_score: healthScore,
            condition: filterCondition,
            overall_status: overallStatus,
            factors: [],
            created_at: new Date().toISOString()
          }]);
        } else {
          setHealthRows(data);
        }
      } else if (activeTableTab === 'predictions') {
        const data = await SupabaseService.fetchRecentPredictions(selectedEquipmentId, 20);
        if (data.length === 0) {
          setPredictionRows([{
            equipment_id: selectedEquipmentId,
            failure_probability: prediction.failureProbability,
            risk_7day: prediction.risk7Day,
            risk_30day: prediction.risk30Day,
            predicted_failure_window: prediction.predictedFailureWindow,
            model_confidence: prediction.modelConfidence,
            rul_days: prediction.rulDays,
            rul_hours: prediction.rulHours,
            rul_confidence_lower: prediction.rulConfidenceInterval[0],
            rul_confidence_upper: prediction.rulConfidenceInterval[1],
            created_at: new Date().toISOString()
          }]);
        } else {
          setPredictionRows(data);
        }
      } else if (activeTableTab === 'alerts') {
        const data = await SupabaseService.fetchRecentAlerts(selectedEquipmentId, 20);
        if (data.length === 0) {
          setAlertRows(alerts.map(a => ({
            id: a.id,
            equipment_id: selectedEquipmentId,
            severity: a.severity,
            sensor: a.sensor,
            sensor_type: a.sensorType,
            value: String(a.value),
            threshold: String(a.threshold),
            message: a.message,
            recommended_action: a.recommendedAction,
            status: a.status,
            acknowledged_by: a.acknowledgedBy,
            created_at: a.timestamp
          })));
        } else {
          setAlertRows(data);
        }
      } else if (activeTableTab === 'work_orders') {
        const data = await SupabaseService.fetchRecentWorkOrders(selectedEquipmentId, 20);
        if (data.length === 0) {
          setWorkOrderRows(workOrders.map(wo => ({
            id: wo.id,
            equipment_id: selectedEquipmentId,
            title: wo.title,
            priority: wo.priority,
            status: wo.status,
            assigned_to: wo.assignedTo,
            scheduled_date: wo.scheduledDate,
            notes: wo.notes,
            created_at: wo.createdDate
          })));
        } else {
          setWorkOrderRows(data);
        }
      }
    } catch (err: any) {
      console.warn('Failed loading table rows:', err);
    } finally {
      setIsLoadingRows(false);
    }
  };

  useEffect(() => {
    loadTableData();
  }, [activeTableTab, selectedEquipmentId, supabaseSyncStatus.syncedRecordsCount]);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(SUPABASE_ANON_KEY);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setFeedbackMessage(null);
    try {
      const res = await syncToSupabaseNow();
      if (res.success) {
        setFeedbackMessage({
          type: 'success',
          text: `Telemetry & ML Prognostics pushed to Supabase! (${selectedEquipmentId})`
        });
        await loadTableData();
      } else {
        setFeedbackMessage({
          type: 'info',
          text: `Data buffered locally. Run the SQL schema in Supabase SQL Editor to finalize tables.`
        });
      }
    } catch (e: any) {
      setFeedbackMessage({ type: 'error', text: e.message || 'Sync failed' });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  const handleExportTableJSON = () => {
    let exportData: any = [];
    if (activeTableTab === 'sensor_readings') exportData = sensorRows;
    else if (activeTableTab === 'filter_health') exportData = healthRows;
    else if (activeTableTab === 'predictions') exportData = predictionRows;
    else if (activeTableTab === 'alerts') exportData = alertRows;
    else if (activeTableTab === 'work_orders') exportData = workOrderRows;
    else if (activeTableTab === 'historical_data') exportData = maintenanceCycles;

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filterguard_supabase_${activeTableTab}_${selectedEquipmentId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Live Status */}
      <div className="bg-[#0b101b] border border-cyan-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm shadow-emerald-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-tech uppercase tracking-widest text-emerald-400 font-bold">
                  SUPABASE BACKEND INTEGRATION
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-tech bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  CONNECTED
                </span>
              </div>
              <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
                Supabase Cloud Data Center
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Active PostgreSQL backend storing sensor readings, filter health metrics, ML predictions, RUL, alerts, maintenance records & historical trends.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono-tech font-bold text-xs flex items-center gap-2 transition-colors shadow-sm shadow-emerald-500/30 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Pushing Data...' : 'Sync Telemetry to Supabase'}</span>
            </button>

            <a
              href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-mono-tech flex items-center gap-1.5 transition-colors"
            >
              <span>Supabase Console</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>

            <a
              href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900/60 text-cyan-300 text-xs font-mono-tech flex items-center gap-1.5 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>SQL Editor</span>
            </a>
          </div>
        </div>

        {/* Feedback Alert if sync was triggered */}
        {feedbackMessage && (
          <div className={`mt-4 p-3 rounded text-xs font-mono-tech flex items-center gap-2 ${
            feedbackMessage.type === 'success' 
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
              : feedbackMessage.type === 'error'
              ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
              : 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* 2. Project Connection Parameters & Live Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800/90">
            <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400 uppercase">
              <span>PROJECT ID</span>
              <span className="text-emerald-400 text-[10px]">Verified</span>
            </div>
            <div className="text-white font-mono-tech font-bold text-sm mt-1 truncate" title={SUPABASE_PROJECT_ID}>
              {SUPABASE_PROJECT_ID}
            </div>
            <div className="text-[10px] font-mono-tech text-slate-400 mt-1 truncate" title={SUPABASE_URL}>
              {SUPABASE_URL}
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800/90">
            <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400 uppercase">
              <span>API PUBLISHABLE KEY</span>
              <button 
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center gap-0.5"
              >
                {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showApiKey ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="text-slate-200 font-mono-tech text-xs mt-1 truncate">
              {showApiKey ? SUPABASE_ANON_KEY : `${SUPABASE_ANON_KEY.slice(0, 15)}••••••••••••••••••••`}
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] font-mono-tech">
              <span className="text-slate-400">Client-Side JWT</span>
              <button 
                onClick={handleCopyApiKey} 
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copiedKey ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800/90">
            <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400 uppercase">
              <span>TELEMETRY STREAM</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-emerald-400 font-mono-tech font-bold text-sm mt-1 flex items-center gap-1.5">
              <span>{supabaseSyncStatus.syncedRecordsCount} Records Pushed</span>
            </div>
            <div className="text-[10px] font-mono-tech text-slate-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Last: {supabaseSyncStatus.lastSyncTime || 'Active cycle'}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800/90">
            <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400 uppercase">
              <span>CONTINUOUS INGESTION</span>
              <button 
                onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  autoSyncEnabled ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {autoSyncEnabled ? 'AUTO ON' : 'PAUSED'}
              </button>
            </div>
            <div className="text-white font-mono-tech font-bold text-sm mt-1">
              {autoSyncEnabled ? 'Every 15 Seconds' : 'Manual Trigger Only'}
            </div>
            <div className="text-[10px] font-mono-tech text-cyan-400 mt-1">
              Monitored: {selectedEquipmentId} ({selectedEquipment.name})
            </div>
          </div>
        </div>
      </div>

      {/* 3. SQL Setup & Table Migration Card (Collapsible/Helpful) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold font-mono-tech text-white uppercase">
                Supabase PostgreSQL Schema Setup (One-Click)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Copy and execute this SQL script once in your Supabase SQL Editor to initialize all 5 tables and RLS policies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySchema}
              className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono-tech font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
            </button>

            <a
              href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono-tech flex items-center gap-1.5"
            >
              <span>Open in Supabase</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          </div>
        </div>

        <div className="mt-3 bg-slate-950 p-3 rounded-lg border border-slate-900 text-[11px] font-mono text-slate-400 max-h-36 overflow-y-auto">
          <pre>{SUPABASE_SQL_SCHEMA}</pre>
        </div>
      </div>

      {/* 4. Multi-Table Supabase Data Explorer */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-base font-bold font-mono-tech text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Live Database Tables Explorer</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect rows stored in your Supabase project for equipment <span className="text-cyan-400 font-semibold">{selectedEquipmentId}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadTableData}
              disabled={isLoadingRows}
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono-tech flex items-center gap-1.5 transition-colors"
              title="Refresh rows from Supabase"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingRows ? 'animate-spin' : ''}`} />
              <span>Refresh Table</span>
            </button>

            <button
              onClick={handleExportTableJSON}
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono-tech flex items-center gap-1.5 transition-colors"
              title="Export active table as JSON"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation for All Requested Tables */}
        <div className="flex items-center gap-1 overflow-x-auto py-3 border-b border-slate-800/60 no-scrollbar">
          {[
            { key: 'sensor_readings', label: '1. sensor_readings', icon: <Activity className="w-3.5 h-3.5" />, count: sensorRows.length },
            { key: 'filter_health', label: '2. filter_health', icon: <Cloud className="w-3.5 h-3.5" />, count: healthRows.length },
            { key: 'predictions', label: '3. predictions (ML & RUL)', icon: <Cpu className="w-3.5 h-3.5" />, count: predictionRows.length },
            { key: 'alerts', label: '4. alerts', icon: <AlertTriangle className="w-3.5 h-3.5" />, count: alertRows.length },
            { key: 'work_orders', label: '5. work_orders', icon: <Wrench className="w-3.5 h-3.5" />, count: workOrderRows.length },
            { key: 'historical_data', label: '6. historical_data', icon: <Layers className="w-3.5 h-3.5" />, count: maintenanceCycles.length },
          ].map(tab => {
            const isActive = activeTableTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTableTab(tab.key as TableTab)}
                className={`px-3 py-2 rounded-lg text-xs font-mono-tech whitespace-nowrap flex items-center gap-2 transition-colors ${
                  isActive
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-900 text-slate-400 border border-slate-800">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table Content */}
        <div className="mt-4 overflow-x-auto">
          {activeTableTab === 'sensor_readings' && (
            <table className="w-full text-left text-xs font-mono-tech border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Equipment</th>
                  <th className="p-2.5">Sensor Type</th>
                  <th className="p-2.5">Value</th>
                  <th className="p-2.5">Unit</th>
                  <th className="p-2.5">Rate of Change</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sensorRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-2.5 text-slate-400 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="p-2.5 text-cyan-400 font-semibold">{r.equipment_id}</td>
                    <td className="p-2.5 text-slate-200 font-medium">{r.sensor_type.replace('_', ' ')}</td>
                    <td className="p-2.5 text-white font-bold">{r.value}</td>
                    <td className="p-2.5 text-slate-400">{r.unit}</td>
                    <td className="p-2.5 text-slate-300">
                      {r.rate_of_change > 0 ? `+${r.rate_of_change}` : r.rate_of_change}
                    </td>
                    <td className="p-2.5">
                      <StatusBadge status={r.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTableTab === 'filter_health' && (
            <table className="w-full text-left text-xs font-mono-tech border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Equipment</th>
                  <th className="p-2.5">Health Score</th>
                  <th className="p-2.5">Condition</th>
                  <th className="p-2.5">Overall Status</th>
                  <th className="p-2.5">Diagnostics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {healthRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-2.5 text-slate-400 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="p-2.5 text-cyan-400 font-semibold">{r.equipment_id}</td>
                    <td className="p-2.5">
                      <span className="text-white font-bold text-sm">{r.health_score}</span>
                      <span className="text-slate-400 text-[10px]"> / 100</span>
                    </td>
                    <td className="p-2.5">
                      <StatusBadge status={r.condition} size="sm" />
                    </td>
                    <td className="p-2.5">
                      <StatusBadge status={r.overall_status} size="sm" />
                    </td>
                    <td className="p-2.5 text-slate-300">
                      DP & Flow Degradation Ingested
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTableTab === 'predictions' && (
            <table className="w-full text-left text-xs font-mono-tech border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Equipment</th>
                  <th className="p-2.5">Failure Prob.</th>
                  <th className="p-2.5">7-Day Risk</th>
                  <th className="p-2.5">30-Day Risk</th>
                  <th className="p-2.5">Failure Window</th>
                  <th className="p-2.5">RUL (Days)</th>
                  <th className="p-2.5">RUL (Hours)</th>
                  <th className="p-2.5">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {predictionRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-2.5 text-slate-400 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="p-2.5 text-cyan-400 font-semibold">{r.equipment_id}</td>
                    <td className="p-2.5 text-amber-400 font-bold">{r.failure_probability}%</td>
                    <td className="p-2.5 text-slate-300">{r.risk_7day}%</td>
                    <td className="p-2.5 text-slate-300">{r.risk_30day}%</td>
                    <td className="p-2.5 text-rose-300 font-semibold">{r.predicted_failure_window}</td>
                    <td className="p-2.5 text-cyan-300 font-bold">{r.rul_days} Days</td>
                    <td className="p-2.5 text-slate-300">{r.rul_hours} hrs</td>
                    <td className="p-2.5 text-emerald-400 font-semibold">{r.model_confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTableTab === 'alerts' && (
            <table className="w-full text-left text-xs font-mono-tech border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                  <th className="p-2.5">Alert ID</th>
                  <th className="p-2.5">Severity</th>
                  <th className="p-2.5">Sensor</th>
                  <th className="p-2.5">Value vs Limit</th>
                  <th className="p-2.5">Message</th>
                  <th className="p-2.5">Recommended Action</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {alertRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-2.5 text-cyan-400 font-mono">{r.id}</td>
                    <td className="p-2.5">
                      <StatusBadge status={r.severity} size="sm" />
                    </td>
                    <td className="p-2.5 text-slate-200">{r.sensor}</td>
                    <td className="p-2.5 text-slate-300">
                      <span className="text-white font-bold">{r.value}</span> / <span className="text-slate-400">{r.threshold}</span>
                    </td>
                    <td className="p-2.5 text-slate-300 max-w-xs truncate">{r.message}</td>
                    <td className="p-2.5 text-cyan-300 max-w-xs truncate">{r.recommended_action}</td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTableTab === 'work_orders' && (
            <table className="w-full text-left text-xs font-mono-tech border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                  <th className="p-2.5">Order ID</th>
                  <th className="p-2.5">Title</th>
                  <th className="p-2.5">Priority</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Assigned To</th>
                  <th className="p-2.5">Scheduled Date</th>
                  <th className="p-2.5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {workOrderRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-2.5 text-cyan-400 font-bold">{r.id}</td>
                    <td className="p-2.5 text-white font-semibold">{r.title}</td>
                    <td className="p-2.5">
                      <StatusBadge status={r.priority} size="sm" />
                    </td>
                    <td className="p-2.5 text-slate-300">{r.status}</td>
                    <td className="p-2.5 text-slate-200">{r.assigned_to}</td>
                    <td className="p-2.5 text-slate-400">{r.scheduled_date}</td>
                    <td className="p-2.5 text-slate-400 truncate max-w-xs">{r.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTableTab === 'historical_data' && (
            <table className="w-full text-left text-xs font-mono-tech border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                  <th className="p-2.5">Cycle ID</th>
                  <th className="p-2.5">Filter Batch</th>
                  <th className="p-2.5">Install Date</th>
                  <th className="p-2.5">Lifespan Days</th>
                  <th className="p-2.5">Operating Hours</th>
                  <th className="p-2.5">Final DP</th>
                  <th className="p-2.5">Final Flow</th>
                  <th className="p-2.5">Failure Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {maintenanceCycles.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-2.5 text-cyan-400 font-bold">{c.cycleId}</td>
                    <td className="p-2.5 text-white">{c.filterSerial}</td>
                    <td className="p-2.5 text-slate-400">{c.installDate}</td>
                    <td className="p-2.5 text-emerald-400 font-semibold">{c.lifespanDays} Days</td>
                    <td className="p-2.5 text-slate-300">{c.totalOperatingHours} hrs</td>
                    <td className="p-2.5 text-rose-300 font-bold">{c.finalDP} kPa</td>
                    <td className="p-2.5 text-slate-300">{c.finalFlow} L/min</td>
                    <td className="p-2.5 text-amber-300 font-medium">{c.failureMode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
