import React, { useState } from 'react';
import { FilterProvider, useFilter } from './context/FilterContext';
import { Header } from './components/layout/Header';
import { Sidebar, NavItemKey } from './components/layout/Sidebar';
import { LandingPage } from './components/views/LandingPage';
import { CommandCenterView } from './components/views/CommandCenterView';
import { LiveMonitoringView } from './components/views/LiveMonitoringView';
import { FilterHealthView } from './components/views/FilterHealthView';
import { DegradationView } from './components/views/DegradationView';
import { MLPredictionsView } from './components/views/MLPredictionsView';
import { RULView } from './components/views/RULView';
import { ExplainableAIView } from './components/views/ExplainableAIView';
import { AlertsView } from './components/views/AlertsView';
import { MaintenanceView } from './components/views/MaintenanceView';
import { LifecycleView } from './components/views/LifecycleView';
import { HistoricalTrendsView } from './components/views/HistoricalTrendsView';
import { SimulatorView } from './components/views/SimulatorView';
import { MLModelView } from './components/views/MLModelView';
import { DeviceHealthView } from './components/views/DeviceHealthView';
import { SupabaseView } from './components/views/SupabaseView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { JudgeDemoController } from './components/common/JudgeDemoController';
import { LegalModal } from './components/common/LegalModal';
import { DemoScenario } from './types';

const DashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItemKey>('command_center');
  const [showLanding, setShowLanding] = useState<boolean>(false);
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  const { setScenario, isJudgeDemoRunning } = useFilter();

  const handleLaunchScenarioFromLanding = (scenario: DemoScenario) => {
    setScenario(scenario);
    setShowLanding(false);
    setActiveTab('command_center');
  };

  if (showLanding) {
    return (
      <LandingPage
        onOpenDashboard={() => setShowLanding(false)}
        onLaunchDemoScenario={handleLaunchScenarioFromLanding}
      />
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'command_center':
      case 'overview':
      case 'draggable_grid':
        return <CommandCenterView onNavigate={setActiveTab} />;
      case 'health':
        return <FilterHealthView />;
      case 'monitoring':
        return <LiveMonitoringView />;
      case 'degradation':
        return <DegradationView />;
      case 'ml_predictions':
        return <MLPredictionsView />;
      case 'rul':
        return <RULView />;
      case 'explainable_ai':
        return <ExplainableAIView />;
      case 'maintenance':
        return <MaintenanceView />;
      case 'alerts':
        return <AlertsView />;
      case 'lifecycle':
        return <LifecycleView />;
      case 'historical':
        return <HistoricalTrendsView />;
      case 'simulator':
        return <SimulatorView />;
      case 'ml_model':
        return <MLModelView />;
      case 'device_health':
        return <DeviceHealthView />;
      case 'supabase':
        return <SupabaseView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CommandCenterView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      <Header
        onOpenLanding={() => setShowLanding(true)}
        onNavigateToAlerts={() => setActiveTab('alerts')}
        onNavigateToGrid={() => setActiveTab('command_center')}
        onNavigateToSupabase={() => setActiveTab('supabase')}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          onSelectTab={setActiveTab} 
          onOpenJudgeDemo={() => setIsJudgeDemoOpen(true)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
            {renderActiveView()}
          </main>

          {/* Section 49: Professional Engineering Footer */}
          <footer className="bg-[#090d16] border-t border-slate-800/80 px-6 py-2.5 text-[11px] font-mono-tech text-slate-400 select-none hidden md:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">FilterGuard AI</span>
              <span className="text-slate-600">|</span>
              <span>Predict. Prevent. Perform.</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400 font-semibold">Prognostics of Filter Failure Using Data Analytics</span>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLegalModalType('privacy')} 
                className="hover:text-cyan-300 transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-slate-600">|</span>
              <button 
                onClick={() => setLegalModalType('terms')} 
                className="hover:text-cyan-300 transition-colors"
              >
                Terms and Conditions
              </button>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM ONLINE
              </span>
            </div>
          </footer>
        </div>
      </div>

      {/* Floating Controlled Judge Demo Controller */}
      <JudgeDemoController
        isOpen={isJudgeDemoOpen || isJudgeDemoRunning}
        onClose={() => setIsJudgeDemoOpen(false)}
      />

      {/* Legal Modal */}
      {legalModalType && (
        <LegalModal
          isOpen={true}
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <FilterProvider>
      <DashboardContent />
    </FilterProvider>
  );
}
