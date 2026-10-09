import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  Sliders, 
  Zap, 
  Cloud, 
  X,
  AlertTriangle
} from 'lucide-react';
import { SUPABASE_PROJECT_ID, SUPABASE_URL } from '../../lib/supabase';
import { SUPABASE_SQL_SCHEMA, SupabaseService } from '../../services/supabaseService';
import { useFilter } from '../../context/FilterContext';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const { 
    supabaseSyncStatus, 
    testSupabaseConnection, 
    syncToSupabaseNow, 
    autoSyncEnabled, 
    setAutoSyncEnabled 
  } = useFilter();

  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    const res = await syncToSupabaseNow();
    setIsSyncing(false);
    if (res.success) {
      setSyncFeedback('Successfully uploaded telemetry, health, predictions, and alerts to Supabase!');
    } else {
      setSyncFeedback(res.error || 'Sync completed with in-memory fallback. Make sure tables are created in Supabase.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="bg-[#0b101b] border border-cyan-500/40 rounded-xl p-6 max-w-2xl w-full text-xs font-mono-tech shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <span>Supabase Cloud Integration</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  CONNECTED
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                PostgreSQL & Realtime Cloud Backend
              </div>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Credentials Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-slate-950/80 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase">PROJECT ID</span>
            <div className="text-white font-bold mt-0.5 flex items-center gap-1.5">
              <span>{SUPABASE_PROJECT_ID}</span>
              <a 
                href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-0.5 text-[10px]"
              >
                <span>Dashboard</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase">PROJECT URL</span>
            <div className="text-slate-200 truncate mt-0.5 text-[11px] font-semibold" title={SUPABASE_URL}>
              {SUPABASE_URL}
            </div>
          </div>
        </div>

        {/* Sync Controls & Auto-Sync Switch */}
        <div className="p-4 bg-slate-950/90 rounded border border-slate-800 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span>Continuous Cloud Ingestion</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Auto-syncs live telemetry & prognostics every 15s to Supabase
            </div>
            {supabaseSyncStatus.lastSyncTime && (
              <div className="text-[10px] text-emerald-400 mt-1">
                Last Synced: {supabaseSyncStatus.lastSyncTime} ({supabaseSyncStatus.syncedRecordsCount} records uploaded)
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
              className={`px-3 py-1.5 rounded border text-xs font-bold transition-colors ${
                autoSyncEnabled 
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {autoSyncEnabled ? 'Auto-Sync: ON' : 'Auto-Sync: OFF'}
            </button>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {syncFeedback && (
          <div className="p-3 bg-cyan-950/60 border border-cyan-500/40 rounded mb-4 text-cyan-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* Database Tables Verification */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 uppercase text-[10px] font-semibold">
              SUPABASE POSTGRESQL TABLES VERIFICATION
            </span>
            <button
              onClick={testSupabaseConnection}
              className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Re-check Tables</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { key: 'sensor_readings', name: 'sensor_readings', desc: 'Telemetry series' },
              { key: 'filter_health', name: 'filter_health', desc: 'Health score & factors' },
              { key: 'predictions', name: 'predictions', desc: 'RUL & failure risk' },
              { key: 'alerts', name: 'alerts', desc: 'Threshold alarms' },
              { key: 'work_orders', name: 'work_orders', desc: 'Maintenance actions' },
            ].map((t) => {
              const status = (supabaseSyncStatus.tablesStatus as any)[t.key];
              return (
                <div key={t.key} className="p-2.5 bg-slate-950/60 rounded border border-slate-800 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{t.name}</span>
                    {status === true ? (
                      <span className="text-emerald-400 text-[10px] flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    ) : (
                      <span className="text-amber-400 text-[10px] flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> Setup Needed
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{t.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SQL Schema Generation Section */}
        <div className="border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-white font-semibold">PostgreSQL DDL Migration Script</div>
              <div className="text-[10px] text-slate-400">
                Run this once in your Supabase SQL editor to create all tables and RLS policies
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] flex items-center gap-1"
              >
                <span>Open SQL Editor</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>

              <button
                onClick={handleCopySchema}
                className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
          </div>

          <div className="relative bg-slate-950 p-3 rounded border border-slate-900 text-[10px] text-slate-400 font-mono overflow-x-auto max-h-36">
            <pre>{SUPABASE_SQL_SCHEMA}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
