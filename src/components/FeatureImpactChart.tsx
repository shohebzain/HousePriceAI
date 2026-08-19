import React from 'react';
import { FeatureContribution } from '../types';
import { Layers, ArrowUp, ArrowDown, HelpCircle, CheckCircle2 } from 'lucide-react';

interface FeatureImpactChartProps {
  contributions: FeatureContribution[];
  basePrice: number;
  finalPrice: number;
}

export const FeatureImpactChart: React.FC<FeatureImpactChartProps> = ({
  contributions,
  basePrice,
  finalPrice,
}) => {
  const maxImpact = Math.max(...contributions.map((c) => Math.abs(c.impact)), 100000);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Feature Contribution & SHAP-Style Attribution</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Marginal value added or deducted from the baseline market reference price (${basePrice.toLocaleString()})
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Value Add (+)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 font-medium">Depreciation / Discount (-)</span>
          </div>
        </div>
      </div>

      {/* Feature Contributions List */}
      <div className="space-y-3 pt-1">
        {contributions.map((item, idx) => {
          const isPos = item.impact >= 0;
          const barWidthPercent = Math.min(100, Math.round((Math.abs(item.impact) / maxImpact) * 100));

          return (
            <div key={idx} className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 transition-all hover:bg-slate-50">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900">{item.name}</span>
                  <span className="text-[11px] px-2 py-0.5 bg-white text-slate-600 font-mono rounded border border-slate-200">
                    {String(item.value)}
                  </span>
                </div>
                <div className="flex items-center space-x-1 font-mono font-bold text-xs">
                  {isPos ? (
                    <span className="text-emerald-700 flex items-center">
                      <ArrowUp className="w-3 h-3 mr-0.5" />
                      +${item.impact.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-rose-700 flex items-center">
                      <ArrowDown className="w-3 h-3 mr-0.5" />
                      -${Math.abs(item.impact).toLocaleString()}
                    </span>
                  )}
                  <span className="text-slate-400 text-[10px] font-normal">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all ${
                    isPos ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(5, barWidthPercent)}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
                <span>{item.explanation}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isPos ? 'Increases valuation' : 'Reduces valuation'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary calculation footer */}
      <div className="mt-4 p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Baseline Reference: <strong className="font-mono">${basePrice.toLocaleString()}</strong> + Net Features Attribution = <strong className="font-mono text-blue-900">${finalPrice.toLocaleString()}</strong>
          </span>
        </div>
        <span className="text-blue-700 font-semibold text-[11px]">
          100% Transparent Attribution
        </span>
      </div>
    </div>
  );
};
