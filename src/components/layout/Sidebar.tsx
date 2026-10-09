import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  HeartPulse, 
  Cpu, 
  Hourglass, 
  BarChart3, 
  AlertTriangle, 
  Wrench, 
  History, 
  FileText, 
  BrainCircuit, 
  Sliders,
  LayoutGrid,
  Database,
  TrendingDown,
  Layers,
  Sparkles,
  ShieldCheck,
  Wifi,
  FileCode,
  ShieldAlert,
  Play
} from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { SUPABASE_PROJECT_ID } from '../../lib/supabase';
import { LegalModal } from '../common/LegalModal';

export type NavItemKey = 
  | 'command_center'
  | 'overview'
  | 'health' 
  | 'monitoring' 
  | 'degradation'
  | 'ml_predictions' 
  | 'rul' 
  | 'explainable_ai'
  | 'maintenance' 
  | 'alerts' 
  | 'lifecycle'
  | 'historical' 
  | 'simulator'
  | 'ml_model' 
  | 'device_health'
  | 'supabase'
  | 'reports' 
  | 'settings'
  | 'draggable_grid';

interface SidebarProps {
  activeTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  onOpenJudgeDemo?: () => void;
}

interface NavSection {
  title: string;
  items: {
    key: NavItemKey;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    tag?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, onOpenJudgeDemo }) => {
  const { activeAlertsCount, connectionMode, isJudgeDemoRunning } = useFilter();
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  const sections: NavSection[] = [
    {
      title: 'PRIMARY DASHBOARD',
      items: [
        { key: 'command_center', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" />, tag: 'GRID' },
      ]
    },
    {
      title: 'MONITORING',
      items: [
        { key: 'health', label: 'Filter Health', icon: <HeartPulse className="w-4 h-4" /> },
        { key: 'monitoring', label: 'Sensor Data', icon: <Activity className="w-4 h-4" /> },
        { key: 'degradation', label: 'Degradation Analysis', icon: <TrendingDown className="w-4 h-4" /> },
      ]
    },
    {
      title: 'PREDICTION',
      items: [
        { key: 'ml_predictions', label: 'Failure Forecast', icon: <Cpu className="w-4 h-4" /> },
        { key: 'rul', label: 'Remaining Useful Life', icon: <Hourglass className="w-4 h-4" /> },
        { key: 'explainable_ai', label: 'Explainable AI', icon: <Sparkles className="w-4 h-4" /> },
      ]
    },
    {
      title: 'MAINTENANCE',
      items: [
        { key: 'maintenance', label: 'Maintenance Copilot', icon: <Wrench className="w-4 h-4" /> },
        { key: 'alerts', label: 'Alerts & Events', icon: <AlertTriangle className="w-4 h-4" />, badge: activeAlertsCount },
        { key: 'lifecycle', label: 'Filter Lifecycle', icon: <Layers className="w-4 h-4" /> },
      ]
    },
    {
      title: 'ANALYSIS & LAB',
      items: [
        { key: 'historical', label: 'Historical Intelligence', icon: <History className="w-4 h-4" /> },
        { key: 'simulator', label: 'What-If Simulator', icon: <Sliders className="w-4 h-4" />, tag: 'LAB' },
        { key: 'ml_model', label: 'Model Intelligence', icon: <BrainCircuit className="w-4 h-4" /> },
      ]
    },
    {
      title: 'SYSTEM & CLOUD',
      items: [
        { key: 'device_health', label: 'Device & Data Health', icon: <Wifi className="w-4 h-4" /> },
        { key: 'supabase', label: 'Supabase Cloud Hub', icon: <Database className="w-4 h-4" />, tag: 'CONNECTED' },
        { key: 'reports', label: 'Condition Reports', icon: <FileText className="w-4 h-4" /> },
        { key: 'settings', label: 'Threshold Settings', icon: <Sliders className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#090e18] border-r border-slate-800/80 shrink-0 select-none">
        {/* Navigation Sections */}
        <nav className="p-2 space-y-3 flex-1 overflow-y-auto no-scrollbar">
          {sections.map((sec) => (
            <div key={sec.title} className="space-y-0.5">
              <div className="px-3 py-1 text-[10px] font-mono-tech text-slate-400 uppercase tracking-wider font-semibold">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const isActive = activeTab === item.key || (item.key === 'command_center' && activeTab === 'overview');
                return (
                  <button
                    key={item.key}
                    onClick={() => onSelectTab(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs font-mono-tech transition-colors ${
                      isActive
                        ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.tag && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        item.tag === 'CONNECTED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                        item.tag === 'LAB' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                        'bg-slate-900 text-slate-300 border border-slate-800'
                      }`}>
                        {item.tag}
                      </span>
                    )}

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Judge Demo Quick Action in Sidebar */}
        {onOpenJudgeDemo && (
          <div className="p-2.5 border-t border-slate-800/80 bg-slate-950/60">
            <button
              onClick={onOpenJudgeDemo}
              className={`w-full py-1.5 px-3 rounded text-xs font-mono-tech font-bold flex items-center justify-center gap-2 transition-colors ${
                isJudgeDemoRunning
                  ? 'bg-rose-950 border border-rose-500/40 text-rose-300'
                  : 'bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900'
              }`}
            >
              <Play className="w-3 h-3 text-cyan-400" />
              <span>{isJudgeDemoRunning ? 'Judge Demo Active' : 'Open Judge Demo Bar'}</span>
            </button>
          </div>
        )}

        {/* Bottom Hardware & Supabase Cloud Indicator */}
        <div className="p-3 border-t border-slate-800/80 text-[11px] font-mono-tech text-slate-400 bg-slate-950/40 space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">HARDWARE MODE</span>
            <span className="text-amber-400 font-bold">{connectionMode.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">SUPABASE CLOUD</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/60">
            <button 
              onClick={() => setLegalModalType('privacy')} 
              className="hover:text-cyan-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>|</span>
            <button 
              onClick={() => setLegalModalType('terms')} 
              className="hover:text-cyan-300 transition-colors"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#090d16] border-t border-slate-800 px-2 py-1.5 flex items-center justify-around select-none">
        {[
          { key: 'command_center', label: 'Center', icon: <LayoutDashboard className="w-4 h-4" /> },
          { key: 'monitoring', label: 'Sensors', icon: <Activity className="w-4 h-4" /> },
          { key: 'simulator', label: 'Sim', icon: <Sliders className="w-4 h-4" /> },
          { key: 'rul', label: 'RUL', icon: <Hourglass className="w-4 h-4" /> },
          { key: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-4 h-4" />, badge: activeAlertsCount },
          { key: 'supabase', label: 'Cloud', icon: <Database className="w-4 h-4" /> },
        ].map((item) => {
          const isActive = activeTab === item.key || (item.key === 'command_center' && activeTab === 'overview');
          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key as NavItemKey)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded relative text-[10px] font-mono-tech transition-colors ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Legal Modal */}
      {legalModalType && (
        <LegalModal
          isOpen={true}
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      )}
    </>
  );
};
