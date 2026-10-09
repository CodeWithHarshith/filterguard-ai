import React from 'react';
import { useFilter } from '../../context/FilterContext';
import { 
  Cpu, 
  Sparkles, 
  Layers, 
  ArrowDown, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck,
  HelpCircle,
  Database
} from 'lucide-react';

export const MLPredictionsView: React.FC = () => {
  const { prediction, thresholds } = useFilter();

  const pipelineSteps = [
    { title: 'INPUT SENSOR DATA', desc: 'Differential pressure, flow velocity, temperature, vibration, hours, particle concentration' },
    { title: 'DATA PREPROCESSING', desc: 'Outlier rejection, zero-drift offset calibration, 2.5s rolling average smoothing' },
    { title: 'FEATURE ENGINEERING', desc: 'Pressure slope (dΔP/dt), inverse flow resistance ratio, vibration spectral band energy' },
    { title: 'ML MODEL', desc: 'Bidirectional LSTM + Gradient Boosted Regressor ensemble trained on 15,000h run-to-failure cycles' },
    { title: 'FAILURE PROBABILITY', desc: 'Time-to-failure probabilistic distribution across 7-day and 30-day forecast horizons' },
    { title: 'RUL ESTIMATION', desc: 'Quantile regression Remaining Useful Life output with 90% confidence uncertainty interval' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
              INFERENCE ENGINE
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono-tech tracking-tight text-white mt-1">
            Machine Learning Predictions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            AI-driven prediction of filter degradation and potential failure
          </p>
        </div>

        <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono-tech text-slate-300">
          <span className="text-slate-400">STATUS:</span> <span className="text-emerald-400 font-semibold">MODEL ONLINE (v2.4)</span>
        </div>
      </div>

      {/* Primary ML Risk Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-[#0b101b] border border-slate-800/80 rounded-lg flex flex-col justify-between">
          <div className="text-[10px] font-mono-tech text-slate-400 uppercase">FAILURE PROBABILITY</div>
          <div className="text-3xl font-mono-tech font-bold text-white mt-2">
            {prediction.failureProbability}%
          </div>
          <div className="text-[10px] font-mono-tech text-amber-400 mt-2">
            Overall Failure Risk
          </div>
        </div>

        <div className="p-4 bg-[#0b101b] border border-slate-800/80 rounded-lg flex flex-col justify-between">
          <div className="text-[10px] font-mono-tech text-slate-400 uppercase">7-DAY FAILURE RISK</div>
          <div className="text-3xl font-mono-tech font-bold text-emerald-400 mt-2">
            {prediction.risk7Day}%
          </div>
          <div className="text-[10px] font-mono-tech text-slate-400 mt-2">
            Near-term risk window
          </div>
        </div>

        <div className="p-4 bg-[#0b101b] border border-slate-800/80 rounded-lg flex flex-col justify-between">
          <div className="text-[10px] font-mono-tech text-slate-400 uppercase">30-DAY FAILURE RISK</div>
          <div className="text-3xl font-mono-tech font-bold text-amber-400 mt-2">
            {prediction.risk30Day}%
          </div>
          <div className="text-[10px] font-mono-tech text-slate-400 mt-2">
            Extended forecast risk
          </div>
        </div>

        <div className="p-4 bg-[#0b101b] border border-slate-800/80 rounded-lg flex flex-col justify-between">
          <div className="text-[10px] font-mono-tech text-slate-400 uppercase">FAILURE WINDOW</div>
          <div className="text-lg font-mono-tech font-bold text-rose-400 mt-2 leading-tight">
            {prediction.predictedFailureWindow}
          </div>
          <div className="text-[10px] font-mono-tech text-slate-400 mt-2">
            Statistically predicted
          </div>
        </div>

        <div className="p-4 bg-[#0b101b] border border-slate-800/80 rounded-lg flex flex-col justify-between">
          <div className="text-[10px] font-mono-tech text-slate-400 uppercase">MODEL CONFIDENCE</div>
          <div className="text-3xl font-mono-tech font-bold text-cyan-400 mt-2">
            {prediction.modelConfidence}%
          </div>
          <div className="text-[10px] font-mono-tech text-slate-400 mt-2">
            Ensemble agreement score
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs font-mono-tech text-slate-400 flex items-center justify-between">
        <span>* Clearly labeled: All numbers are <strong>Demo / predicted values</strong> until connected to the physical plant model.</span>
        <span className="text-cyan-400">ENFORCE PREDICTIVE INTEGRITY</span>
      </div>

      {/* Pipeline Diagram (Section 12) */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
        <div className="border-b border-slate-800/80 pb-3 mb-4">
          <h3 className="text-sm font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
            PROGNOSTICS PIPELINE ARCHITECTURE
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Sequential feature transformation from raw edge sensor acquisition to actionable maintenance dispatch
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {pipelineSteps.map((step, idx) => (
            <div key={step.title} className="p-4 bg-slate-950/70 rounded border border-slate-800/80 flex flex-col justify-between text-xs font-mono-tech relative">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span>STAGE 0{idx + 1}</span>
                  {idx < pipelineSteps.length - 1 && <span className="text-cyan-500 font-bold">↓</span>}
                </div>
                <div className="font-bold text-white text-sm uppercase">{step.title}</div>
                <p className="text-slate-400 text-[11px] mt-2 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance & Model Explanation (Section 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Feature Importance */}
        <div className="lg:col-span-5 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800/80 pb-3 mb-4">
              <h3 className="text-sm font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
                FEATURE IMPORTANCE (SHAP VALUES)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Relative contribution to degradation prediction
              </p>
            </div>

            <div className="space-y-3">
              {prediction.featureImportance.map((feat) => (
                <div key={feat.name} className="text-xs font-mono-tech">
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span>{feat.name}</span>
                    <span className="text-cyan-400 font-semibold">{feat.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-cyan-500 rounded" 
                      style={{ width: `${feat.score}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono-tech text-slate-500">
            Computed via TreeExplainer on 1,000 background validation samples.
          </div>
        </div>

        {/* Why is the model predicting this? (Section 13) */}
        <div className="lg:col-span-7 bg-[#0b101b] border border-slate-800/80 rounded-lg p-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
            <h3 className="text-sm font-mono-tech font-semibold uppercase tracking-wider text-slate-200">
              WHY IS THE MODEL PREDICTING THIS?
            </h3>
            <span className="text-xs font-mono-tech text-cyan-400">Model-derived insights</span>
          </div>

          <div className="space-y-3">
            {prediction.insights.map((insight, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950/70 rounded border border-slate-800/80 flex items-start gap-3 text-xs font-mono-tech text-slate-300 leading-relaxed">
                <span className="w-5 h-5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 shrink-0 flex items-center justify-center font-bold text-[10px]">
                  0{idx + 1}
                </span>
                <div>
                  <span>{insight}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-800/60 text-[11px] font-mono-tech text-slate-400">
            <strong className="text-slate-200">Model Explanation Note:</strong> These explanations are generated by feature attribution algorithms and reflect mathematical deviations from baseline filter parameters.
          </div>
        </div>
      </div>
    </div>
  );
};
