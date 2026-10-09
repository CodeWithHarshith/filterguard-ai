import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { StatusBadge } from '../common/StatusBadge';
import { MaintenancePriority } from '../../types';
import { 
  Wrench, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Plus, 
  FileText, 
  User, 
  ShieldAlert,
  ArrowRight,
  X
} from 'lucide-react';

export const MaintenanceView: React.FC = () => {
  const { recommendations, workOrders, createWorkOrder, selectedEquipment, userRole } = useFilter();
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetRecId, setTargetRecId] = useState<string>('');
  const [orderTitle, setOrderTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('Carlos Vance (HVAC Tech)');
  const [priority, setPriority] = useState<MaintenancePriority>('HIGH');
  const [scheduledDate, setScheduledDate] = useState('06 Nov 2026, 08:00 AM');
  const [notes, setNotes] = useState('Standard LOTO safety isolation required on main blower intake.');

  const handleOpenCreateModal = (recId?: string, defaultTitle?: string, defaultPriority?: MaintenancePriority) => {
    setTargetRecId(recId || recommendations[0]?.id || '');
    setOrderTitle(defaultTitle || 'Industrial Filter Element Replacement');
    if (defaultPriority) setPriority(defaultPriority);
    setIsModalOpen(true);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderTitle) return;

    createWorkOrder(targetRecId, {
      title: orderTitle,
      equipmentId: selectedEquipment.id,
      priority,
      status: 'OPEN',
      assignedTo,
      scheduledDate,
      notes
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
              PRESCRIPTIVE ACTIONS
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
            Predictive Maintenance Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Transform failure prognostics into scheduled work orders and parts requisition
          </p>
        </div>

        <button
          onClick={() => handleOpenCreateModal()}
          className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono-tech font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Work Order</span>
        </button>
      </div>

      {/* Recommended Actions List (Prompt Section 20) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div className="border-b border-slate-800/80 pb-3 mb-4">
          <h3 className="text-sm font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
            ACTIVE MAINTENANCE RECOMMENDATIONS
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Prescriptions generated automatically from differential pressure slope & RUL predictions
          </p>
        </div>

        <div className="space-y-4">
          {recommendations.map(rec => (
            <div
              key={rec.id}
              className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-start justify-between gap-4 text-xs font-mono-tech"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-white text-sm">{rec.title}</span>
                  <StatusBadge status={rec.priority} size="sm" />
                  <span className="text-[10px] text-slate-500">[{rec.id}]</span>
                </div>

                <div className="text-slate-300 leading-relaxed">
                  <strong className="text-slate-400 font-normal">Reason:</strong> {rec.reason}
                </div>

                <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800 text-slate-200 leading-relaxed">
                  <strong className="text-cyan-400 font-normal">Action:</strong> {rec.action}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Calendar className="w-3.5 h-3.5" />
                    Target Window: {rec.recommendedWindow}
                  </span>
                  <span>·</span>
                  <span>Status: <strong className="text-white uppercase">{rec.status}</strong></span>
                  {rec.workOrderId && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-400 font-semibold">Linked: {rec.workOrderId}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 shrink-0">
                {rec.status !== 'SCHEDULED' ? (
                  <button
                    onClick={() => handleOpenCreateModal(rec.id, rec.title, rec.priority)}
                    className="px-3.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-colors"
                  >
                    Schedule Maintenance
                  </button>
                ) : (
                  <div className="px-3 py-1.5 rounded bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 font-semibold text-center">
                    Work Order Dispatched
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatched Work Orders Table */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div className="border-b border-slate-800/80 pb-3 mb-4">
          <h3 className="text-sm font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
            DISPATCHED WORK ORDERS
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Field execution ledger and technician assignment
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-tech">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">WO ID</th>
                <th className="py-2.5 px-3">TITLE</th>
                <th className="py-2.5 px-3">EQUIPMENT</th>
                <th className="py-2.5 px-3">ASSIGNED TECH</th>
                <th className="py-2.5 px-3">SCHEDULED DATE</th>
                <th className="py-2.5 px-3">PRIORITY</th>
                <th className="py-2.5 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {workOrders.map(wo => (
                <tr key={wo.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-bold text-cyan-300">{wo.id}</td>
                  <td className="py-3 px-3 font-semibold text-white">{wo.title}</td>
                  <td className="py-3 px-3 text-slate-400">{wo.equipmentId}</td>
                  <td className="py-3 px-3 text-slate-300">{wo.assignedTo}</td>
                  <td className="py-3 px-3 text-slate-400">{wo.scheduledDate}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={wo.priority} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={wo.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Work Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0b101b] border border-slate-800 rounded-lg p-6 max-w-lg w-full text-xs font-mono-tech shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold uppercase text-white">Create Work Order</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Work Order Title:</label>
                <input
                  type="text"
                  value={orderTitle}
                  onChange={(e) => setOrderTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-100 focus:border-cyan-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Priority:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as MaintenancePriority)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-100 focus:border-cyan-500 focus:outline-hidden"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Assigned Specialist:</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-100 focus:border-cyan-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Scheduled Downtime Window:</label>
                <input
                  type="text"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-100 focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Technician Safety & Protocol Notes:</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-100 focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
