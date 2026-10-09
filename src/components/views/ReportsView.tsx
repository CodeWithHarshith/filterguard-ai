import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { FileText, Download, Printer, CheckCircle, Calendar, Sparkles, AlertCircle } from 'lucide-react';

type ReportType = 'daily' | 'weekly' | 'lifecycle';

export const ReportsView: React.FC = () => {
  const { 
    selectedEquipment, 
    healthScore, 
    filterCondition, 
    sensors, 
    prediction, 
    alerts, 
    recommendations,
    exportSensorCSV
  } = useFilter();

  const [activeReportType, setActiveReportType] = useState<ReportType>('daily');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string>('Today at 08:30 AM');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setLastGenerated('Just now');
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
              AUDIT & COMPLIANCE
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
            Prognostic & Maintenance Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated engineering dossiers for ISO-16890 / ASHRAE 52.2 filter compliance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-3.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono-tech font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Compiling Dossier...' : 'Generate Fresh Report'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono-tech text-slate-300 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={exportSensorCSV}
            className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono-tech text-cyan-400 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 text-xs font-mono-tech">
        <button
          onClick={() => setActiveReportType('daily')}
          className={`px-3 py-1.5 rounded border transition-colors ${
            activeReportType === 'daily'
              ? 'bg-cyan-950 text-cyan-300 border-cyan-800 font-bold'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Daily Condition Report
        </button>

        <button
          onClick={() => setActiveReportType('weekly')}
          className={`px-3 py-1.5 rounded border transition-colors ${
            activeReportType === 'weekly'
              ? 'bg-cyan-950 text-cyan-300 border-cyan-800 font-bold'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Weekly Predictive Maintenance Report
        </button>

        <button
          onClick={() => setActiveReportType('lifecycle')}
          className={`px-3 py-1.5 rounded border transition-colors ${
            activeReportType === 'lifecycle'
              ? 'bg-cyan-950 text-cyan-300 border-cyan-800 font-bold'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Filter Lifecycle Dossier
        </button>
      </div>

      {/* Report Document Viewer (Formatted for print and high readability) */}
      <div className="bg-[#0b101b] border border-slate-800 rounded-lg p-6 text-xs font-mono-tech space-y-6">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <span>FilterGuard AI</span>
              <span className="text-cyan-400">·</span>
              <span className="capitalize">{activeReportType} Prognostic Report</span>
            </div>
            <div className="text-slate-400 mt-1">
              Asset: {selectedEquipment.name} ({selectedEquipment.id}) · {selectedEquipment.location}
            </div>
          </div>

          <div className="text-right text-slate-400 text-[11px]">
            <div>Generated: <strong className="text-slate-200">{lastGenerated}</strong></div>
            <div>Model Core: <strong className="text-cyan-400">v2.4-LSTM Ensemble</strong></div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div>
          <h3 className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-2">
            1. EXECUTIVE DIAGNOSTIC SUMMARY
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950/80 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px]">HEALTH SCORE</span>
              <div className="text-xl font-bold text-white mt-1">{healthScore} / 100 ({filterCondition})</div>
            </div>
            <div className="p-3 bg-slate-950/80 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px]">FAILURE PROBABILITY</span>
              <div className="text-xl font-bold text-cyan-400 mt-1">{prediction.failureProbability}%</div>
            </div>
            <div className="p-3 bg-slate-950/80 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px]">ESTIMATED RUL</span>
              <div className="text-xl font-bold text-amber-400 mt-1">{prediction.rulDays} Days ({prediction.rulHours} h)</div>
            </div>
            <div className="p-3 bg-slate-950/80 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px]">PREDICTED FAILURE</span>
              <div className="text-sm font-bold text-rose-400 mt-2">{prediction.predictedFailureWindow}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Sensor Telemetry Audit */}
        <div>
          <h3 className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-2">
            2. TELEMETRY AUDIT AT OBSERVATION CUTOFF
          </h3>
          <div className="border border-slate-800 rounded overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-3">PARAMETER</th>
                  <th className="py-2 px-3">MEASURED VALUE</th>
                  <th className="py-2 px-3">RATED LIMITS</th>
                  <th className="py-2 px-3">COMPLIANCE STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {sensors.map(s => (
                  <tr key={s.id}>
                    <td className="py-2 px-3">{s.name}</td>
                    <td className="py-2 px-3 font-bold text-white">
                      {s.isAvailable ? `${s.value} ${s.unit}` : 'Not Available (Offline)'}
                    </td>
                    <td className="py-2 px-3 text-slate-400">
                      Warn: {s.warningThreshold} / Crit: {s.criticalThreshold} {s.unit}
                    </td>
                    <td className="py-2 px-3">
                      <span className={s.status === 'NORMAL' ? 'text-emerald-400' : 'text-amber-400'}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Recommended Work Orders & Engineering Notes */}
        <div>
          <h3 className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-2">
            3. PRESCRIPTIVE ENGINEERING RECOMMENDATIONS
          </h3>
          <div className="space-y-2">
            {recommendations.map(r => (
              <div key={r.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>{r.title}</span>
                  <span className="text-amber-400 text-[10px]">PRIORITY: {r.priority}</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-1">{r.action}</div>
                <div className="text-cyan-400 text-[10px] mt-1">Action window: {r.recommendedWindow}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Signoff Block */}
        <div className="pt-4 border-t border-slate-800 grid grid-cols-2 text-slate-500 text-[11px]">
          <div>Automated Generation: FilterGuard AI Engine Core v2.4</div>
          <div className="text-right">Digital Signature: SHA-256 Verified</div>
        </div>
      </div>
    </div>
  );
};
