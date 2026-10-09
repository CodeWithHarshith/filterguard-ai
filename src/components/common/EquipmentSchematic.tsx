import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { StatusBadge } from './StatusBadge';

export const EquipmentSchematic: React.FC = () => {
  const { selectedEquipment, sensors, thresholds } = useFilter();
  const [activeProbe, setActiveProbe] = useState<string | null>(null);

  const dp = sensors.find(s => s.type === 'differential_pressure');
  const fl = sensors.find(s => s.type === 'flow_rate');
  const temp = sensors.find(s => s.type === 'temperature');
  const vib = sensors.find(s => s.type === 'vibration');
  const part = sensors.find(s => s.type === 'particle_concentration');

  return (
    <div className="w-full bg-[#0b101b] border border-slate-800/80 rounded-lg p-4 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-slate-800/60 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
              EQUIPMENT SCHEMATIC & SENSOR TOPOLOGY
            </h3>
            <span className="text-xs text-slate-500 font-mono-tech">[{selectedEquipment.id}]</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Physical instrumentation map: Air Inlet → Pre-filter → Main Filter → Fan → Outlet
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={selectedEquipment.status} size="sm" />
          <span className="text-xs text-slate-400 font-mono-tech">{selectedEquipment.location}</span>
        </div>
      </div>

      {/* Schematic Diagram Canvas */}
      <div className="relative w-full overflow-x-auto py-2 bg-slate-950/60 rounded border border-slate-900">
        <svg viewBox="0 0 780 200" className="w-full min-w-[620px] h-auto">
          <defs>
            {/* Airflow gradient */}
            <linearGradient id="airflow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
            </linearGradient>

            {/* Filter pleat pattern */}
            <pattern id="pleats" width="10" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 5 20 L 10 0" fill="none" stroke="#475569" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Main Air Duct Enclosure */}
          <rect x="30" y="50" width="700" height="100" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          
          {/* Airflow channel fill */}
          <rect x="30" y="52" width="700" height="96" fill="url(#airflow)" />

          {/* 1. Air Inlet Section */}
          <g>
            <text x="50" y="40" className="fill-slate-400 text-[10px] font-mono-tech uppercase font-semibold">1. AIR INLET</text>
            <path d="M 40 70 L 65 100 L 40 130" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 55 70 L 80 100 L 55 130" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
          </g>

          {/* Temperature Sensor Probe */}
          <g 
            className="cursor-pointer" 
            onClick={() => setActiveProbe('temp')}
            onMouseEnter={() => setActiveProbe('temp')}
          >
            <line x1="120" y1="25" x2="120" y2="75" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="120" cy="75" r="4" fill="#f59e0b" />
            <circle cx="120" cy="25" r="7" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
            <text x="120" y="28" textAnchor="middle" className="fill-amber-400 text-[8px] font-mono-tech font-bold">T</text>
            <text x="120" y="15" textAnchor="middle" className="fill-amber-400 text-[9px] font-mono-tech">TEMP-01</text>
          </g>

          {/* 2. Pre-Filter Stage */}
          <g>
            <rect x="160" y="55" width="22" height="90" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <line x1="165" y1="55" x2="165" y2="145" stroke="#475569" strokeDasharray="4 2" />
            <line x1="175" y1="55" x2="175" y2="145" stroke="#475569" strokeDasharray="4 2" />
            <text x="171" y="40" textAnchor="middle" className="fill-slate-400 text-[9px] font-mono-tech uppercase">PRE-FILTER</text>
          </g>

          {/* Upstream Pressure Tap (P1) */}
          <g 
            className="cursor-pointer"
            onClick={() => setActiveProbe('dp')}
            onMouseEnter={() => setActiveProbe('dp')}
          >
            <line x1="220" y1="25" x2="220" y2="60" stroke="#06b6d4" strokeWidth="2" />
            <circle cx="220" cy="60" r="4" fill="#06b6d4" />
            <circle cx="220" cy="25" r="7" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            <text x="220" y="28" textAnchor="middle" className="fill-cyan-400 text-[8px] font-mono-tech font-bold">P1</text>
          </g>

          {/* 3. Main Filter Stage (AeroMax Pro-HEPA) */}
          <g>
            <rect x="260" y="53" width="70" height="94" fill="#132338" stroke="#0284c7" strokeWidth="2" />
            <rect x="265" y="55" width="60" height="90" fill="url(#pleats)" />
            <text x="295" y="40" textAnchor="middle" className="fill-cyan-300 text-[10px] font-mono-tech font-bold uppercase">
              MAIN HEPA FILTER
            </text>
            <text x="295" y="103" textAnchor="middle" className="fill-cyan-400/70 text-[9px] font-mono-tech">
              MEDIA 9000-X
            </text>
          </g>

          {/* Downstream Pressure Tap (P2) & Delta-P Bridge */}
          <g 
            className="cursor-pointer"
            onClick={() => setActiveProbe('dp')}
            onMouseEnter={() => setActiveProbe('dp')}
          >
            <line x1="360" y1="25" x2="360" y2="60" stroke="#06b6d4" strokeWidth="2" />
            <circle cx="360" cy="60" r="4" fill="#06b6d4" />
            <circle cx="360" cy="25" r="7" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            <text x="360" y="28" textAnchor="middle" className="fill-cyan-400 text-[8px] font-mono-tech font-bold">P2</text>
            
            {/* Bridge connection representing transmitter */}
            <path d="M 220 25 C 220 10, 360 10, 360 25" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 2" />
            <rect x="270" y="2" width="50" height="15" rx="3" fill="#0c4a6e" stroke="#0284c7" strokeWidth="1" />
            <text x="295" y="12" textAnchor="middle" className="fill-cyan-200 text-[8px] font-mono-tech font-bold">
              ΔP TRANSMITTER
            </text>
          </g>

          {/* 4. Particle Sensor (Downstream) */}
          <g 
            className="cursor-pointer"
            onClick={() => setActiveProbe('particle')}
            onMouseEnter={() => setActiveProbe('particle')}
          >
            <line 
              x1="430" 
              y1="25" 
              x2="430" 
              y2="70" 
              stroke={thresholds.particleSensorConnected ? '#10b981' : '#64748b'} 
              strokeWidth="2" 
            />
            <circle 
              cx="430" 
              cy="70" 
              r="4" 
              fill={thresholds.particleSensorConnected ? '#10b981' : '#64748b'} 
            />
            <circle 
              cx="430" 
              cy="25" 
              r="7" 
              fill="#0f172a" 
              stroke={thresholds.particleSensorConnected ? '#10b981' : '#64748b'} 
              strokeWidth="2" 
            />
            <text x="430" y="28" textAnchor="middle" className={`text-[8px] font-mono-tech font-bold ${thresholds.particleSensorConnected ? 'fill-emerald-400' : 'fill-slate-400'}`}>
              PM
            </text>
            <text x="430" y="15" textAnchor="middle" className={`text-[8.5px] font-mono-tech ${thresholds.particleSensorConnected ? 'fill-emerald-400' : 'fill-slate-500'}`}>
              {thresholds.particleSensorConnected ? 'PARTICLE' : 'OFFLINE'}
            </text>
          </g>

          {/* 5. Exhaust Blower Fan with Vibration Probe */}
          <g 
            className="cursor-pointer"
            onClick={() => setActiveProbe('vib')}
            onMouseEnter={() => setActiveProbe('vib')}
          >
            <circle cx="530" cy="100" r="32" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            {/* Fan Blades */}
            <path d="M 530 100 L 530 75 A 25 25 0 0 1 550 90 Z" fill="#94a3b8" opacity="0.6" />
            <path d="M 530 100 L 555 100 A 25 25 0 0 1 545 120 Z" fill="#94a3b8" opacity="0.6" />
            <path d="M 530 100 L 530 125 A 25 25 0 0 1 510 110 Z" fill="#94a3b8" opacity="0.6" />
            <path d="M 530 100 L 505 100 A 25 25 0 0 1 515 80 Z" fill="#94a3b8" opacity="0.6" />
            <circle cx="530" cy="100" r="8" fill="#334155" />

            <text x="530" y="40" textAnchor="middle" className="fill-slate-400 text-[9px] font-mono-tech uppercase">
              EXHAUST FAN
            </text>

            {/* Vibration Sensor on Housing */}
            <rect x="522" y="145" width="16" height="22" rx="2" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
            <text x="530" y="160" textAnchor="middle" className="fill-purple-400 text-[8px] font-mono-tech font-bold">VIB</text>
            <text x="530" y="180" textAnchor="middle" className="fill-purple-400 text-[8.5px] font-mono-tech">ACC-01</text>
          </g>

          {/* 6. Flow Venturi Duct & Flow Sensor */}
          <g 
            className="cursor-pointer"
            onClick={() => setActiveProbe('flow')}
            onMouseEnter={() => setActiveProbe('flow')}
          >
            {/* Venturi constriction */}
            <path d="M 620 50 L 640 68 L 660 68 L 680 50" fill="none" stroke="#334155" strokeWidth="2" />
            <path d="M 620 150 L 640 132 L 660 132 L 680 150" fill="none" stroke="#334155" strokeWidth="2" />
            <line x1="650" y1="25" x2="650" y2="68" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="650" cy="25" r="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <text x="650" y="28" textAnchor="middle" className="fill-sky-400 text-[8px] font-mono-tech font-bold">FL</text>
            <text x="650" y="15" textAnchor="middle" className="fill-sky-400 text-[8.5px] font-mono-tech">VENTURI</text>
          </g>

          {/* Clean Air Outlet */}
          <g>
            <text x="710" y="40" className="fill-slate-400 text-[9px] font-mono-tech uppercase font-semibold">OUTLET</text>
            <path d="M 700 70 L 725 100 L 700 130" fill="none" stroke="#10b981" strokeWidth="2" />
            <path d="M 715 70 L 740 100 L 715 130" fill="none" stroke="#10b981" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Interactive Probe Inspector Card */}
      <div className="mt-3 p-3 bg-slate-900/80 rounded border border-slate-800 text-xs font-mono-tech flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">PROBE TELEMETRY:</span>
          {activeProbe === 'dp' && (
            <span className="text-cyan-300">
              ΔP Transmitter across Media: <strong className="text-white">{dp?.value.toFixed(1)} {dp?.unit}</strong> ({dp?.status})
            </span>
          )}
          {activeProbe === 'flow' && (
            <span className="text-sky-300">
              Discharge Venturi Flow: <strong className="text-white">{fl?.value.toLocaleString()} {fl?.unit}</strong> ({fl?.status})
            </span>
          )}
          {activeProbe === 'temp' && (
            <span className="text-amber-300">
              Inlet Plenum Temperature: <strong className="text-white">{temp?.value.toFixed(1)} {temp?.unit}</strong> ({temp?.status})
            </span>
          )}
          {activeProbe === 'vib' && (
            <span className="text-purple-300">
              Fan Bearing Vibration: <strong className="text-white">{vib?.value.toFixed(1)} {vib?.unit}</strong> ({vib?.status})
            </span>
          )}
          {activeProbe === 'particle' && (
            <span className="text-emerald-300">
              Downstream Optical Particle Counter: {part?.isAvailable ? (
                <strong className="text-white">{part.value.toFixed(1)} {part.unit}</strong>
              ) : (
                <strong className="text-slate-400">NOT AVAILABLE</strong>
              )}
            </span>
          )}
          {!activeProbe && (
            <span className="text-slate-400">
              Hover or click any probe on the physical schematic to view instrument specifications and live reading.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>Rated Flow: <strong className="text-slate-200">{selectedEquipment.ratedFlow} L/min</strong></span>
          <span>·</span>
          <span>Max ΔP: <strong className="text-slate-200">{selectedEquipment.maxDifferentialPressure} kPa</strong></span>
        </div>
      </div>
    </div>
  );
};
