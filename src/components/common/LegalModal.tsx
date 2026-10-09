import React from 'react';
import { X, ShieldCheck, FileText, Check } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="bg-[#0b101b] border border-slate-800 rounded-xl max-w-3xl w-full p-6 text-xs font-mono-tech shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' ? (
              <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                <FileText className="w-4 h-4" />
              </div>
            )}
            <div>
              <h2 className="text-sm font-bold text-white uppercase">
                {type === 'privacy' ? 'FilterGuard AI | Privacy Policy' : 'FilterGuard AI | Terms and Conditions'}
              </h2>
              <div className="text-[11px] text-slate-400">
                Effective Date: October 2026 | Version 2.4-Industrial
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {type === 'privacy' ? (
          <div className="space-y-4 text-slate-300 leading-relaxed text-[11px]">
            <div>
              <h3 className="font-bold text-white uppercase text-xs mb-1">1. Information We Collect</h3>
              <p>FilterGuard AI collects telemetry parameters including differential pressure (kPa), volumetric flow rate (L/min), plenum temperature (°C), housing vibration (mm/s), accumulated operating hours, and particle concentration if equipped. Hardware identifiers such as ESP32 device IDs, network IP addresses, and sampling timestamps are collected strictly for equipment diagnostics.</p>
            </div>

            <div>
              <h3 className="font-bold text-white uppercase text-xs mb-1">2. Purpose of Telemetry Processing</h3>
              <p>Data collected is processed for real-time condition monitoring, failure prognostics, Remaining Useful Life (RUL) estimation, and maintenance scheduling. We do not sell or monetize industrial telemetry data to third parties.</p>
            </div>

            <div>
              <h3 className="font-bold text-white uppercase text-xs mb-1">3. Data Storage & Security</h3>
              <p>Telemetry data is stored in secured PostgreSQL databases hosted on Supabase Cloud infrastructure with Row-Level Security (RLS) policies enabled. All client transmissions use TLS 1.3 encryption.</p>
            </div>

            <div>
              <h3 className="font-bold text-white uppercase text-xs mb-1">4. No Unverified Compliance Claims</h3>
              <p>FilterGuard AI adheres to rigorous engineering standards for data segregation. We do not claim third-party certifications (e.g. ISO 27001 or SOC 2) until formally audited and certified by accredited registrars.</p>
            </div>

            <div>
              <h3 className="font-bold text-white uppercase text-xs mb-1">5. Contact Information</h3>
              <p>For questions regarding telemetry handling, contact the engineering lead at: harshithkumar.a123@gmail.com.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-slate-300 leading-relaxed text-[11px]">
            <div>
              <h3 className="font-bold text-white uppercase text-xs mb-1">1. Scope of Service</h3>
              <p>FilterGuard AI provides decision-support tools for predictive maintenance of industrial filtration equipment. The system estimates degradation trajectories and Remaining Useful Life based on mathematical models and sensor inputs.</p>
            </div>

            <div>
              <h3 className="font-bold text-white uppercase text-xs mb-1">2. Prediction Limitations & Operator Responsibility</h3>
              <p>All ML predictions, failure probabilities, and RUL estimations are mathematical estimates, not guarantees of equipment survival. Final maintenance decisions, bypass damper controls, and equipment shutdowns remain the sole responsibility of certified plant operators and maintenance engineers.</p>
            </div>

            <div>
              <h3 className="font-bold text-white uppercase text-xs mb-1">3. Demonstration Mode Disclosures</h3>
              <p>When operating in DEMO MODE, simulated values are generated for illustrative and hackathon demonstration purposes. Simulated readings must not be used for actual plant safety operations.</p>
            </div>

            <div>
              <h3 className="font-bold text-white uppercase text-xs mb-1">4. Limitation of Liability</h3>
              <p>FilterGuard AI and its developers shall not be liable for unscheduled downtime, equipment damage, or secondary production losses resulting from reliance on predictive outputs.</p>
            </div>

            <div>
              <h3 className="font-bold text-white uppercase text-xs mb-1">5. Governing Law</h3>
              <p>These terms shall be governed by standard engineering service guidelines. For inquiries, reach out to the FilterGuard AI operations desk.</p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
