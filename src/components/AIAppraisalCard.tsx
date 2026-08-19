import React from 'react';
import { AIAppraisalReport } from '../types';
import {
  Sparkles,
  Award,
  TrendingUp,
  Hammer,
  AlertTriangle,
  FileText,
  BadgeCheck,
} from 'lucide-react';

interface AIAppraisalCardProps {
  report: AIAppraisalReport | null;
  loading: boolean;
  onClose?: () => void;
}

export const AIAppraisalCard: React.FC<AIAppraisalCardProps> = ({
  report,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-purple-200 shadow-sm p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto text-purple-600 animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Gemini 3.7 AI Appraisal in Progress
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Synthesizing neighborhood econometrics, comparative listing trends, and renovation ROI opportunities...
          </p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl border border-purple-200/80 shadow-xs p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-purple-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">
                AI Certified Real Estate Appraisal Report
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded-full border border-purple-200">
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Econometric assessment & value optimization intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-purple-900 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
            Appraised: {report.fairMarketValuation}
          </span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          <FileText className="w-3.5 h-3.5 text-purple-600" />
          <span>Executive Summary & Pricing Rationale</span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{report.executiveSummary}</p>
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500">
            Negotiation Range: <strong className="text-slate-900 font-mono">{report.valuationRange}</strong>
          </span>
          <span className="text-slate-500">
            Comparable Position: <strong className="text-slate-900">{report.comparableInsight}</strong>
          </span>
        </div>
      </div>

      {/* Key Drivers */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center space-x-1.5">
          <Award className="w-3.5 h-3.5 text-blue-600" />
          <span>Primary Valuation Catalysts</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {report.keyDrivers.map((driver, idx) => (
            <div
              key={idx}
              className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start space-x-2 shadow-2xs"
            >
              <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{driver}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Renovation ROI Upside */}
      {report.renovationUpside && report.renovationUpside.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center space-x-1.5">
            <Hammer className="w-3.5 h-3.5 text-amber-600" />
            <span>High-ROI Renovation & Value Creation Opportunities</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.renovationUpside.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900">{item.recommendation}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-mono font-bold rounded border border-emerald-200 shrink-0">
                    ROI: {item.roi}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Est. Cost</span>
                    <span className="font-mono text-slate-700 font-semibold">{item.estimatedCost}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Projected Value Add</span>
                    <span className="font-mono text-emerald-700 font-bold">{item.projectedValueAdd}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Trend & Risk Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Trend */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Neighborhood Market Horizon</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{report.marketTrendOutlook}</p>
        </div>

        {/* Risk */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Risk & Liquidity Assessment</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{report.riskAssessment}</p>
        </div>
      </div>
    </div>
  );
};
