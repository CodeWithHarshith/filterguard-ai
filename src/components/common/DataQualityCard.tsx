import React from 'react';
import { useFilter } from '../../context/FilterContext';
import { CheckCircle2, XCircle, Clock, Zap, Database } from 'lucide-react';

export const DataQualityCard: React.FC = () => {
  const { sensors, lastUpdateSecondsAgo } = useFilter();

  return (
    <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
            DATA QUALITY & TELEMETRY HEALTH
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono-tech text-emerald-400">
          <Zap className="w-3.5 h-3.5" />
          <span>SAMPLING: 0.4 Hz (2.5s)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {sensors.map((s) => {
          const isAvailable = s.isAvailable;
          return (
            <div 
              key={s.id} 
              className={`p-2.5 rounded border text-xs font-mono-tech flex flex-col justify-between ${
                isAvailable ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-950/80 border-slate-900 opacity-60'
              }`}
            >
              <div className="text-[10px] text-slate-400 uppercase truncate" title={s.name}>
                {s.type.replace(/_/g, ' ')}
              </div>

              <div className="flex items-center gap-1.5 my-1.5">
                {isAvailable ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400 font-semibold text-[11px]">ONLINE</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-400 font-medium text-[10px]">UNAVAILABLE</span>
                  </>
                )}
              </div>

              <div className="text-[9px] text-slate-500 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span>{isAvailable ? `${lastUpdateSecondsAgo}s ago` : 'No signal'}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-500 border-t border-slate-800/60 pt-2.5 mt-3">
        <span>Packet Loss: 0.00% · CRC Checksum: Valid</span>
        <span>Gateway: Modbus TCP / MQTT Gateway GW-04 (192.168.10.42)</span>
      </div>
    </div>
  );
};
