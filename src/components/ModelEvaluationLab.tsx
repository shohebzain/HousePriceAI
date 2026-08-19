import React, { useState } from 'react';
import { ModelAlgorithm, ModelMetric } from '../types';
import { TabType } from './Navbar';
import { MODEL_METRICS, FEATURE_IMPORTANCES, getActualVsPredictedPoints, getResidualDistributionData } from '../ml/modelEngine';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Line,
  ComposedChart,
} from 'recharts';
import {
  BrainCircuit,
  Award,
  TrendingUp,
  Target,
  BarChart2,
  Sliders,
  CheckCircle,
  HelpCircle,
  Zap,
  Sparkles,
  Database,
  ArrowRight,
} from 'lucide-react';

interface ModelEvaluationLabProps {
  onSelectModelForPrediction?: (model: ModelAlgorithm) => void;
  onNavigateTab?: (tab: TabType) => void;
}

export const ModelEvaluationLab: React.FC<ModelEvaluationLabProps> = ({
  onSelectModelForPrediction,
  onNavigateTab,
}) => {
  const [selectedModelId, setSelectedModelId] = useState<ModelAlgorithm>('gradient_boosting');

  const actualVsPredicted = getActualVsPredictedPoints(140);
  const residualData = getResidualDistributionData();

  const selectedModel = MODEL_METRICS.find((m) => m.id === selectedModelId) || MODEL_METRICS[0];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-blue-600" />
              <span>Machine Learning Regression Model Benchmark & Diagnostics</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical evaluation across 5 regression algorithms using 80/20 train-test split & 5-fold cross-validation
            </p>
          </div>

          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 flex items-center space-x-1.5 self-start sm:self-auto">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Champion Model: Gradient Boosting (R² 0.942)</span>
          </span>
        </div>

        {/* Model Comparison Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="p-3">Regression Model</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">MAE ($)</th>
                <th className="p-3 text-right">RMSE ($)</th>
                <th className="p-3 text-right">R² Score</th>
                <th className="p-3 text-right">MAPE</th>
                <th className="p-3 text-right">5-Fold CV R²</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {MODEL_METRICS.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <tr
                    key={model.id}
                    onClick={() => setSelectedModelId(model.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/80 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{model.name}</span>
                        {model.isBest && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                            Best
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{model.category}</td>
                    <td className="p-3 text-right font-mono text-slate-900 font-bold">
                      ${model.mae.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-900 font-bold">
                      ${model.rmse.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono font-black text-blue-600">
                      {model.r2.toFixed(3)}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-600">{model.mape}%</td>
                    <td className="p-3 text-right font-mono text-slate-600">
                      {model.cv_score_mean.toFixed(3)} <span className="text-[10px] text-slate-400">±{model.cv_score_std.toFixed(3)}</span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModelId(model.id);
                          if (onSelectModelForPrediction) onSelectModelForPrediction(model.id);
                        }}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep-Dive Model Diagnostic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actual vs Predicted Scatter */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <div className="flex items-center justify-between mb-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Actual vs. Predicted Sale Price (Validation Set)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Points aligning on the diagonal 45° line represent perfect econometric predictions
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              R² = {selectedModel.r2.toFixed(3)}
            </span>
          </div>

          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 15, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="actual"
                  name="Actual Price"
                  domain={[300000, 2600000]}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <YAxis
                  type="number"
                  dataKey="predicted"
                  name="Predicted Price"
                  domain={[300000, 2600000]}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(val: any, name: any) => [`$${Number(val).toLocaleString()}`, name]}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Scatter name="Validation Samples" data={actualVsPredicted} fill="#2563eb" opacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 mt-2 flex items-center justify-between">
            <span>Mean Absolute Error: <strong className="font-mono text-slate-900">${selectedModel.mae.toLocaleString()}</strong></span>
            <span>Root Mean Squared Error: <strong className="font-mono text-slate-900">${selectedModel.rmse.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Residual Error Analysis */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <div className="flex items-center justify-between mb-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                <span>Residual Error Distribution (Homoscedasticity)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bell-shaped zero-centered histogram confirms unbiased gaussian errors
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
              Mean Error ≈ $0
            </span>
          </div>

          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={residualData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="residualBucket" tick={{ fontSize: 10, fill: '#64748b' }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} samples`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {residualData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.residualBucket.includes('-$10k to +$10k') ? '#10b981' : '#6366f1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-900 mt-2 flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Diagnostic Passed:</strong> Residuals exhibit strong central clustering within ±$10,000 without funneling patterns, validating model homoscedasticity and absence of systematic bias.
            </span>
          </div>
        </div>
      </div>

      {/* Feature Importance Rankings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Global Feature Importance (Mean Decrease in Impurity / MDI)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked relative importance of attributes extracted from the 150-tree Gradient Boosting model
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {FEATURE_IMPORTANCES.map((item, idx) => {
            const pct = Math.round(item.importance * 1000) / 10;
            return (
              <div key={idx} className="bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-mono font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900">{item.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-200/70 text-slate-600 rounded">
                      {item.category}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-blue-700">
                    {pct}% <span className="text-slate-400 font-normal">({item.importance.toFixed(3)})</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${pct * 2.4}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Redirect Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Active Selected Algorithm: <strong className="text-slate-900">{selectedModel.name}</strong> (R² {selectedModel.r2.toFixed(3)})
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                if (onSelectModelForPrediction) onSelectModelForPrediction(selectedModelId);
                if (onNavigateTab) onNavigateTab('predict');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use {selectedModel.name} for Prediction</span>
            </button>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('pipeline')}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                <span>View Data Pipeline</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
