import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { 
  ShieldAlert, 
  Bell, 
  Activity, 
  Play, 
  Pause, 
  ChevronDown, 
  User, 
  Check, 
  ExternalLink,
  Database,
  LayoutGrid
} from 'lucide-react';
import { DemoScenario, UserRole } from '../../types';
import { SupabaseStatusModal } from '../common/SupabaseStatusModal';

interface HeaderProps {
  onOpenLanding: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToGrid?: () => void;
  onNavigateToSupabase?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenLanding, 
  onNavigateToAlerts, 
  onNavigateToGrid,
  onNavigateToSupabase 
}) => {
  const { 
    equipmentList, 
    selectedEquipmentId, 
    setSelectedEquipmentId,
    selectedEquipment,
    isLive, 
    setIsLive,
    lastUpdateSecondsAgo,
    currentScenario,
    setScenario,
    activeAlertsCount,
    userRole,
    setUserRole,
    supabaseSyncStatus,
    connectionMode,
    esp32State
  } = useFilter();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showScenarioMenu, setShowScenarioMenu] = useState(false);
  const [showEquipmentMenu, setShowEquipmentMenu] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const scenarios: { key: DemoScenario; label: string; desc: string }[] = [
    { key: 'NORMAL', label: 'NORMAL', desc: 'Clean, healthy filter' },
    { key: 'DEGRADING', label: 'DEGRADING', desc: 'Baseline gradual loading (Prompt demo)' },
    { key: 'WARNING', label: 'WARNING', desc: 'Sensors near limits, alert pending' },
    { key: 'CRITICAL', label: 'CRITICAL', desc: 'Severe pressure drop, failure imminent' },
  ];

  const roles: { key: UserRole; label: string }[] = [
    { key: 'OPERATOR', label: 'Operator' },
    { key: 'MAINTENANCE_ENGINEER', label: 'Maintenance Engineer' },
    { key: 'ADMINISTRATOR', label: 'Administrator' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & System Online */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onOpenLanding}>
            <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono-tech font-bold text-white text-base tracking-tight">FilterGuard</span>
                <span className="font-mono-tech font-bold text-cyan-400 text-base">AI</span>
              </div>
              <div className="hidden sm:block text-[10px] text-slate-400 font-mono-tech leading-none">
                Predict. Prevent. Perform.
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono-tech text-slate-400 pl-2 border-l border-slate-800">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-300 font-semibold">{esp32State.deviceId}</span>
            <span className="text-slate-600">|</span>
            <span className={`font-semibold px-1.5 py-0.2 rounded text-[10px] ${
              connectionMode === 'LIVE' 
                ? 'text-emerald-300 bg-emerald-950 border border-emerald-500/40' 
                : 'text-amber-300 bg-amber-950 border border-amber-500/40'
            }`}>
              {connectionMode.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Middle: Equipment Selector */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowEquipmentMenu(!showEquipmentMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono-tech text-slate-200 transition-colors"
            >
              <span className="text-cyan-400 font-semibold">{selectedEquipment.id}</span>
              <span className="text-slate-400 truncate max-w-[170px]">{selectedEquipment.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showEquipmentMenu && (
              <div className="absolute left-0 mt-1 w-64 bg-slate-900 border border-slate-800 rounded shadow-xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] font-mono-tech text-slate-400 border-b border-slate-800 uppercase">
                  Select Monitored Equipment
                </div>
                {equipmentList.map(eq => (
                  <button
                    key={eq.id}
                    onClick={() => {
                      setSelectedEquipmentId(eq.id);
                      setShowEquipmentMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-mono-tech flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                      eq.id === selectedEquipmentId ? 'text-cyan-400 bg-slate-800/40' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{eq.id} - {eq.name}</div>
                      <div className="text-[10px] text-slate-400">{eq.location}</div>
                    </div>
                    {eq.id === selectedEquipmentId && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Simulation Controls, Alerts, Role, Landing Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Scenario Selector */}
          <div className="relative">
            <button
              onClick={() => setShowScenarioMenu(!showScenarioMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-mono-tech hover:bg-slate-800 transition-colors"
              title="Change simulated physical condition"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-semibold">SCENARIO:</span>
              <span>{currentScenario}</span>
              <ChevronDown className="w-3 h-3 text-amber-400" />
            </button>

            {showScenarioMenu && (
              <div className="absolute right-0 mt-1 w-56 bg-slate-900 border border-slate-800 rounded shadow-xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] font-mono-tech text-slate-400 border-b border-slate-800 uppercase">
                  Select Demo Scenario
                </div>
                {scenarios.map(s => (
                  <button
                    key={s.key}
                    onClick={() => {
                      setScenario(s.key);
                      setShowScenarioMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs font-mono-tech flex flex-col hover:bg-slate-800/80 transition-colors ${
                      s.key === currentScenario ? 'text-amber-400 bg-slate-800/50' : 'text-slate-300'
                    }`}
                  >
                    <span className="font-semibold">{s.label}</span>
                    <span className="text-[10px] text-slate-400">{s.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live / Pause Ticker */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded border text-xs font-mono-tech transition-colors ${
              isLive 
                ? 'bg-slate-900 border-slate-800 text-cyan-400 hover:border-slate-700' 
                : 'bg-amber-950/40 border-amber-800/50 text-amber-300'
            }`}
            title={isLive ? 'Pause real-time stream' : 'Resume real-time stream'}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isLive ? `${lastUpdateSecondsAgo}s` : 'PAUSED'}</span>
          </button>

          {/* Draggable Widget Grid Shortcut Button */}
          {onNavigateToGrid && (
            <button
              onClick={onNavigateToGrid}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60 text-xs font-mono-tech transition-colors shadow-xs"
              title="Interactive Draggable Widget Grid & AI Observability"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-bold">WIDGETS</span>
            </button>
          )}

          {/* Supabase Cloud Connection Button */}
          <button
            onClick={() => {
              if (onNavigateToSupabase) {
                onNavigateToSupabase();
              } else {
                setIsSupabaseModalOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 text-xs font-mono-tech transition-colors shadow-xs"
            title="Supabase Cloud Backend (oqjujyxzmlxntdujmwam) · View live telemetry tables & ML predictions"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline font-bold">SUPABASE:</span>
            <span className="text-[11px] font-semibold text-emerald-300">CLOUD</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Alerts Notification Bell */}
          <button
            onClick={onNavigateToAlerts}
            className="relative p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            title="Active Alerts"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1 min-w-[16px] h-4 bg-rose-500 text-[10px] font-mono-tech font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono-tech text-slate-300 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline capitalize">{userRole.toLowerCase().replace('_', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-slate-800 rounded shadow-xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] font-mono-tech text-slate-400 border-b border-slate-800 uppercase">
                  Switch Active Role
                </div>
                {roles.map(r => (
                  <button
                    key={r.key}
                    onClick={() => {
                      setUserRole(r.key);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs font-mono-tech flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      r.key === userRole ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span>{r.label}</span>
                    {r.key === userRole && <Check className="w-3 h-3 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Landing Page Link */}
          <button
            onClick={onOpenLanding}
            className="hidden sm:flex items-center gap-1 text-xs font-mono-tech text-slate-400 hover:text-cyan-300 pl-1 transition-colors"
            title="Return to Landing Page"
          >
            <span>Landing</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      <SupabaseStatusModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </header>
  );
};
