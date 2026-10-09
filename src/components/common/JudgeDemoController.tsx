import React from 'react';
import { useFilter } from '../../context/FilterContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  X
} from 'lucide-react';
import { JUDGE_DEMO_STEPS } from '../../data/judgeDemoSteps';

interface JudgeDemoControllerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeDemoController: React.FC<JudgeDemoControllerProps> = ({ isOpen, onClose }) => {
  const { 
    judgeDemoStepIndex, 
    setJudgeDemoStep, 
    nextJudgeDemoStep, 
    prevJudgeDemoStep, 
    resetJudgeDemo, 
    isJudgeDemoRunning, 
    startJudgeDemo, 
    stopJudgeDemo, 
    currentJudgeDemoStep 
  } = useFilter();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-lg w-full bg-[#0b101b] border border-cyan-500/50 rounded-xl p-4 shadow-2xl font-mono-tech select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-cyan-300 uppercase">
            Controlled Judge Demo Sequence (14 Steps)
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-0.5 rounded">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Step {judgeDemoStepIndex + 1} of {JUDGE_DEMO_STEPS.length}:
          </span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
            {currentJudgeDemoStep.phase}
          </span>
        </div>

        <div className="font-bold text-white text-sm">
          {currentJudgeDemoStep.title}
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded border border-slate-800">
          {currentJudgeDemoStep.description}
        </p>

        {/* Real-time telemetry values for this step */}
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] py-1 border-y border-slate-800/60 text-slate-400">
          <div>
            <div>dP</div>
            <div className="text-cyan-300 font-bold text-xs">{currentJudgeDemoStep.dp} kPa</div>
          </div>
          <div>
            <div>Flow</div>
            <div className="text-white font-bold text-xs">{currentJudgeDemoStep.flow} L/m</div>
          </div>
          <div>
            <div>Health</div>
            <div className="text-emerald-400 font-bold text-xs">{currentJudgeDemoStep.health}/100</div>
          </div>
          <div>
            <div>RUL</div>
            <div className="text-amber-400 font-bold text-xs">{currentJudgeDemoStep.rulHours} h</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevJudgeDemoStep}
              disabled={judgeDemoStepIndex === 0}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs flex items-center gap-1 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={nextJudgeDemoStep}
              disabled={judgeDemoStepIndex === JUDGE_DEMO_STEPS.length - 1}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs flex items-center gap-1 disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (isJudgeDemoRunning) {
                  stopJudgeDemo();
                } else {
                  startJudgeDemo();
                }
              }}
              className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors ${
                isJudgeDemoRunning 
                  ? 'bg-rose-950 border border-rose-500/50 text-rose-300' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
              }`}
            >
              {isJudgeDemoRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isJudgeDemoRunning ? 'Pause' : 'Auto Play'}</span>
            </button>

            <button
              onClick={resetJudgeDemo}
              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title="Reset Demo to Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
