import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PredictionOutput, PropertyFeatures, ModelAlgorithm } from '../types';
import { AnimatedPriceNumber } from './AnimatedPriceNumber';
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Building,
  KeyRound,
  Percent,
  Sliders,
  Sparkles,
  ArrowUpRight,
  HelpCircle,
  Award,
  ChevronRight,
  Info,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Scale,
} from 'lucide-react';

interface ValuationResultCardProps {
  prediction: PredictionOutput;
  features: PropertyFeatures;
  onApplyWhatIf: (modified: Partial<PropertyFeatures>) => void;
  onRequestAIAppraisal: () => void;
  aiAppraisalLoading: boolean;
  onSelectModel?: (model: ModelAlgorithm) => void;
}

export const ValuationResultCard: React.FC<ValuationResultCardProps> = ({
  prediction,
  features,
  onApplyWhatIf,
  onRequestAIAppraisal,
  aiAppraisalLoading,
  onSelectModel,
}) => {
  const [activeWhatIf, setActiveWhatIf] = useState<string | null>(null);
  const [rangeMethod, setRangeMethod] = useState<'ensemble_std' | 'residual_ci'>('ensemble_std');
  const [showExplanation, setShowExplanation] = useState(true);

  const modelLabels: Record<ModelAlgorithm, string> = {
    gradient_boosting: 'Gradient Boosting',
    random_forest: 'Random Forest',
    ensemble: 'Super Ensemble',
    ridge_regression: 'Ridge (L2)',
    linear_regression: 'Linear OLS',
    decision_tree: 'Decision Tree',
  };

  // Determine active displayed range based on selected method
  const isEnsembleMethod = rangeMethod === 'ensemble_std';
  const activeLower = isEnsembleMethod ? prediction.confidenceLowerEnsemble : prediction.confidenceLowerCI;
  const activeUpper = isEnsembleMethod ? prediction.confidenceUpperEnsemble : prediction.confidenceUpperCI;
  const activeSpread = activeUpper - activeLower;
  const activeSpreadPercent = Math.round((activeSpread / prediction.predictedPrice) * 100 * 10) / 10;

  // Position of predicted price on the range bar (0 to 100%)
  const markerPositionPercent = Math.min(
    95,
    Math.max(5, Math.round(((prediction.predictedPrice - activeLower) / (activeUpper - activeLower || 1)) * 100))
  );

  const whatIfScenarios = [
    {
      id: 'add_bath',
      title: '+1 Bathroom Addition',
      desc: 'Adds 1 full bathroom fixture',
      apply: () => onApplyWhatIf({ bathrooms: features.bathrooms + 1 }),
      estimatedDelta: '+$37,200',
    },
    {
      id: 'add_area',
      title: '+350 Sq Ft Extension',
      desc: 'Expands gross living area',
      apply: () => onApplyWhatIf({ area_sqft: features.area_sqft + 350 }),
      estimatedDelta: '+$108,500',
    },
    {
      id: 'add_pool',
      title: 'Install Luxury Pool & Garden',
      desc: 'Adds outdoor recreational living',
      apply: () => onApplyWhatIf({ garden_or_pool: true }),
      estimatedDelta: '+$59,000',
      disabled: features.garden_or_pool,
    },
    {
      id: 'renovate_age',
      title: 'Full Renovation (Age = 0)',
      desc: 'Restores to brand new condition',
      apply: () => onApplyWhatIf({ property_age: 0 }),
      estimatedDelta: `+$${Math.round(features.property_age * 2400).toLocaleString()}`,
      disabled: features.property_age === 0,
    },
    {
      id: 'upgrade_luxury',
      title: 'Designer Luxury Furnishing',
      desc: 'High-end designer staging & bespoke finishes',
      apply: () => onApplyWhatIf({ furnishing_status: 'Designer Luxury', smart_home: true }),
      estimatedDelta: '+$75,000',
      disabled: features.furnishing_status === 'Designer Luxury',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
    >
      {/* Top Banner with Price & Dual Price Range Display */}
      <div className="bg-slate-900 text-white p-6 sm:p-7 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-600/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Building className="w-32 h-32" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>Machine Learning Fair Market Valuation</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Model: {modelLabels[prediction.selectedModel] || prediction.selectedModel}
            </span>
          </div>

          {/* Primary Valuation & Price Range Display */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Point Estimate (7 cols) with Smooth Count-Up Animation */}
            <div className="sm:col-span-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Estimated Expected Price
              </span>
              <div className="flex items-baseline space-x-2">
                <motion.div
                  key={`val-${prediction.predictedPrice}`}
                  initial={{ scale: 0.95, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono"
                >
                  <AnimatedPriceNumber
                    value={prediction.predictedPrice}
                    duration={0.8}
                    prefix="$"
                  />
                </motion.div>
                <span className="text-xs font-semibold text-slate-400">USD</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1 font-mono">
                <span>$</span>
                <AnimatedPriceNumber
                  value={prediction.pricePerSqFt}
                  prefix=""
                  duration={0.6}
                />
                <span>/sq ft · {prediction.marketPercentile}th percentile</span>
              </div>
            </div>

            {/* Estimated Price Range (6 cols) */}
            <div className="sm:col-span-6 bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 backdrop-blur-xs">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Estimated Price Range</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {isEnsembleMethod ? '±1.96σ Ensemble' : '95% Model CI'}
                </span>
              </div>

              <div className="text-lg font-black font-mono text-emerald-400 flex items-center space-x-1">
                <AnimatedPriceNumber value={activeLower} duration={0.75} prefix="$" />
                <span>–</span>
                <AnimatedPriceNumber value={activeUpper} duration={0.75} prefix="$" />
              </div>

              <div className="text-[11px] text-slate-300 mt-1 flex items-center justify-between">
                <span>
                  Spread: <strong className="text-white font-mono"><AnimatedPriceNumber value={activeSpread} prefix="$" duration={0.6} /></strong> ({activeSpreadPercent}%)
                </span>
                <span className="text-slate-400 font-mono">
                  {isEnsembleMethod
                    ? `σ = ±$${prediction.ensembleStdDev.toLocaleString()}`
                    : `RMSE = ±$${MODEL_METRICS_MAP[prediction.selectedModel]?.rmse.toLocaleString() || '24,350'}`}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Range Visual Bar */}
          <div className="pt-2 border-t border-slate-800/90">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
              <span className="text-slate-400">Low: ${activeLower.toLocaleString()}</span>
              <span className="text-blue-300 font-bold">Target: ${prediction.predictedPrice.toLocaleString()}</span>
              <span className="text-slate-400">High: ${activeUpper.toLocaleString()}</span>
            </div>

            {/* Gradient Visual Band with Marker */}
            <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div className="w-full h-full bg-gradient-to-r from-blue-500/40 via-emerald-500/80 to-purple-500/40 rounded-full" />
              {/* Marker with Spring Transition */}
              <motion.div
                className="absolute top-0 bottom-0 w-2.5 bg-white rounded-full shadow-md border-2 border-blue-600 -ml-1"
                animate={{ left: `${markerPositionPercent}%` }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                title={`Expected: $${prediction.predictedPrice.toLocaleString()}`}
              />
            </div>

            {/* Range Calculation Method Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400 text-[11px]">Range Formula:</span>
                <button
                  onClick={() => setRangeMethod('ensemble_std')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    isEnsembleMethod
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Ensemble Models Std Dev (σ)
                </button>
                <button
                  onClick={() => setRangeMethod('residual_ci')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    !isEnsembleMethod
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Best-Model Residual CI (RMSE)
                </button>
              </div>

              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <span>{showExplanation ? 'Hide Context' : 'Explain Range Context'}</span>
                {showExplanation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Context Section: Why Price Ranges Matter */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-blue-50/70 border-b border-blue-100 p-4 sm:p-5 text-xs text-slate-700 space-y-3 overflow-hidden"
          >
            <div className="flex items-center space-x-1.5 text-blue-900 font-bold">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Why Price Ranges Provide Critical Real-World Decision Context</span>
            </div>

            <p className="leading-relaxed text-slate-600 text-[11.5px]">
              A single point estimate (<strong>${prediction.predictedPrice.toLocaleString()}</strong>) represents the statistical expected mean price, but real estate transactions naturally occur across a pricing band due to micro-market liquidity, buyer urgency, and qualitative attributes. The estimated range of <strong>${activeLower.toLocaleString()} to ${activeUpper.toLocaleString()}</strong> provides the following real-world utility:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* Buyer Context */}
              <div className="bg-white p-3 rounded-xl border border-blue-200/80 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-1 flex items-center space-x-1 text-[11px]">
                  <Scale className="w-3 h-3 text-blue-600" />
                  <span>Buyer Negotiation Floor</span>
                </span>
                <p className="text-[10.5px] text-slate-600 leading-normal">
                  Offers submitted near <strong>${activeLower.toLocaleString()}</strong> represent aggressive, value-hunting bids, while offers closer to the target price have higher acceptance probability without overpaying.
                </p>
              </div>

              {/* Seller Context */}
              <div className="bg-white p-3 rounded-xl border border-blue-200/80 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-1 flex items-center space-x-1 text-[11px]">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span>Seller Listing Ceiling</span>
                </span>
                <p className="text-[10.5px] text-slate-600 leading-normal">
                  Setting an initial asking price near <strong>${activeUpper.toLocaleString()}</strong> tests maximum buyer demand in a strong seller's market, with room for structured counter-offers.
                </p>
              </div>

              {/* Model Consensus & Appraisal Risk */}
              <div className="bg-white p-3 rounded-xl border border-blue-200/80 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-1 flex items-center space-x-1 text-[11px]">
                  <ShieldCheck className="w-3 h-3 text-indigo-600" />
                  <span>Appraisal Safety Margin</span>
                </span>
                <p className="text-[10.5px] text-slate-600 leading-normal">
                  Mortgage bank underwriters mandate valuation cushions. A narrow spread (${activeSpread.toLocaleString()}, ±{activeSpreadPercent}%) indicates high model agreement and minimal appraisal risk.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key Metric Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 border-b border-slate-100 bg-slate-50/50">
        {/* Price / Sq Ft */}
        <div className="p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            <span>Price / Sq Ft</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            <AnimatedPriceNumber value={prediction.pricePerSqFt} prefix="$" duration={0.6} />
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Based on {features.area_sqft} sq ft</div>
        </div>

        {/* Market Percentile */}
        <div className="p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Market Tier</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            <AnimatedPriceNumber value={prediction.marketPercentile} prefix="" duration={0.6} />th{' '}
            <span className="text-xs text-slate-400 font-normal">percentile</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Top {100 - prediction.marketPercentile}% of all sales</div>
        </div>

        {/* Monthly Rental Income */}
        <div className="p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
            <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
            <span>Rental Estimate</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            <AnimatedPriceNumber value={prediction.estimatedRentMonthly} prefix="$" duration={0.6} />
            <span className="text-xs text-slate-400 font-normal">/mo</span>
          </div>
          <div className="text-[10px] text-indigo-600 font-medium mt-0.5">
            {prediction.rentalYieldPercent}% gross cap yield
          </div>
        </div>

        {/* Luxury Composite Score */}
        <div className="p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Luxury Rating</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {prediction.luxuryScore} <span className="text-xs text-slate-400 font-normal">/ 10</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Amenities & Fixture tier</div>
        </div>
      </div>

      {/* Model Consensus Bar */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Multi-Model Regression Consensus</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Ensemble Mean: ${prediction.ensembleMean?.toLocaleString() || prediction.predictedPrice.toLocaleString()} (σ = ±${prediction.ensembleStdDev?.toLocaleString() || '18,500'})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.entries(prediction.modelPredictions) as [ModelAlgorithm, number][]).map(([modId, price]) => {
            const isSelected = prediction.selectedModel === modId;
            const priceNum = Number(price);
            const diff = priceNum - prediction.predictedPrice;
            return (
              <button
                key={modId}
                type="button"
                onClick={() => onSelectModel && onSelectModel(modId)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-500/10 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 mb-0.5">
                  <span className="truncate font-medium">{modelLabels[modId] || modId}</span>
                  {isSelected && (
                    <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold font-mono text-slate-900">
                  <AnimatedPriceNumber value={priceNum} prefix="$" duration={0.6} />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {diff === 0 ? 'Baseline' : diff > 0 ? `+${diff.toLocaleString()}` : `${diff.toLocaleString()}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* "What-If" Sensitivity Simulator */}
      <div className="p-5 bg-slate-50/40">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>What-If Valuation Sensitivity Simulator</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Simulate upgrades & renovation scenarios to view instant property value uplift
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
          {whatIfScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                setActiveWhatIf(scenario.id);
                scenario.apply();
              }}
              disabled={scenario.disabled}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                scenario.disabled
                  ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                  : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-xs cursor-pointer'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{scenario.title}</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {scenario.estimatedDelta}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{scenario.desc}</p>
              </div>
              <div className="mt-2 text-[10px] font-semibold text-blue-600 flex items-center space-x-0.5">
                <span>Apply Scenario</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Real Estate Appraisal Button Footer */}
      <div className="p-4 bg-slate-100/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <span>Generate in-depth AI Property Appraisal & Investment Report with Gemini 3.7</span>
        </div>

        <button
          id="generate-ai-appraisal-btn"
          onClick={onRequestAIAppraisal}
          disabled={aiAppraisalLoading}
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60"
        >
          {aiAppraisalLoading ? (
            <span>Generating Expert Appraisal...</span>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Appraisal Report</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

const MODEL_METRICS_MAP: Record<string, { rmse: number }> = {
  gradient_boosting: { rmse: 24350 },
  random_forest: { rmse: 31200 },
  ensemble: { rmse: 29410 },
  ridge_regression: { rmse: 46210 },
  linear_regression: { rmse: 48579 },
  decision_tree: { rmse: 52400 },
};
