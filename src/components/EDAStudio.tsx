import React, { useState, useMemo } from 'react';
import { EDASummary, LocationType, PropertyRecord } from '../types';
import { TabType } from './Navbar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  Line,
  ComposedChart,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  ScatterChart as ScatterIcon,
  Layers,
  Activity,
  Filter,
  CheckCircle2,
  PieChart,
  Sliders,
  Sparkles,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react';

interface EDAStudioProps {
  edaSummary: EDASummary;
  dataset: PropertyRecord[];
  onNavigateTab?: (tab: TabType) => void;
  onSelectLocationForPredict?: (loc: LocationType) => void;
}

export const EDAStudio: React.FC<EDAStudioProps> = ({
  edaSummary,
  dataset,
  onNavigateTab,
  onSelectLocationForPredict,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [activeChartTab, setActiveChartTab] = useState<'dist' | 'scatter' | 'locations' | 'correlation' | 'bedrooms'>('dist');

  // Filtered dataset for EDA exploration
  const filteredData = useMemo(() => {
    if (selectedLocation === 'all') return dataset;
    return dataset.filter((d) => d.location === selectedLocation);
  }, [dataset, selectedLocation]);

  // Price Distribution Histogram Bins
  const priceHistogramData = useMemo(() => {
    const minP = 250000;
    const maxP = 3000000;
    const binCount = 14;
    const binSize = (maxP - minP) / binCount;

    const bins = Array.from({ length: binCount }, (_, i) => {
      const lower = minP + i * binSize;
      const upper = lower + binSize;
      const label = `$${Math.round(lower / 1000)}k-$${Math.round(upper / 1000)}k`;
      return {
        bin: label,
        lower,
        upper,
        count: 0,
      };
    });

    for (const d of filteredData) {
      for (const b of bins) {
        if (d.price >= b.lower && d.price < b.upper) {
          b.count++;
          break;
        }
      }
    }

    return bins;
  }, [filteredData]);

  // Area vs Price Scatter Points (Sampled for smooth rendering)
  const scatterPoints = useMemo(() => {
    return filteredData.slice(0, 300).map((d) => ({
      area: d.area_sqft,
      price: d.price,
      priceK: Math.round(d.price / 1000),
      location: d.location,
      bedrooms: d.bedrooms,
      bathrooms: d.bathrooms,
    }));
  }, [filteredData]);

  // Location comparison bar data
  const locationBarData = useMemo(() => {
    return edaSummary.locationAverages.map((loc) => ({
      location: loc.location,
      avgPriceK: Math.round(loc.avgPrice / 1000),
      avgSqFtPrice: loc.avgSqFtPrice,
      count: loc.count,
    }));
  }, [edaSummary]);

  // Bedroom vs Price bar data
  const bedroomBarData = useMemo(() => {
    return edaSummary.bedroomAverages.map((b) => ({
      bedrooms: `${b.bedrooms} Beds`,
      avgPriceK: Math.round(b.avgPrice / 1000),
      count: b.count,
    }));
  }, [edaSummary]);

  // Matrix Heatmap helpers
  const { features: corrFeatures, matrix: corrMatrix } = edaSummary.correlationMatrix;

  const getHeatmapColor = (value: number) => {
    if (value === 1) return 'bg-blue-600 text-white';
    if (value >= 0.7) return 'bg-blue-500 text-white';
    if (value >= 0.5) return 'bg-blue-400 text-white';
    if (value >= 0.3) return 'bg-blue-200 text-blue-900';
    if (value >= 0.1) return 'bg-blue-50 text-blue-800';
    if (value >= -0.1) return 'bg-slate-100 text-slate-700';
    if (value >= -0.3) return 'bg-rose-100 text-rose-800';
    return 'bg-rose-400 text-white';
  };

  return (
    <div className="space-y-6">
      {/* Header Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Records */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Dataset Size</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
            {edaSummary.totalRecords.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Cleaned Records</span>
        </div>

        {/* Mean Price */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Mean Price (μ)</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
            ${edaSummary.priceStats.mean.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Std: ${edaSummary.priceStats.std.toLocaleString()}</span>
        </div>

        {/* Median Price */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Median Price (M)</span>
          <span className="text-xl font-bold font-mono text-blue-600 mt-1 block">
            ${edaSummary.priceStats.median.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">IQR: ${(edaSummary.priceStats.q75 - edaSummary.priceStats.q25).toLocaleString()}</span>
        </div>

        {/* Mean Area */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Average Living Area</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
            {edaSummary.areaStats.mean.toLocaleString()} <span className="text-xs font-normal text-slate-500">sqft</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Range: 750 – 5,800</span>
        </div>

        {/* Skewness */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Price Skewness</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
            +{edaSummary.priceStats.skewness}
          </span>
          <span className="text-[10px] text-amber-600 font-semibold">Moderate Right-Skew</span>
        </div>

        {/* Kurtosis */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Price Kurtosis</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
            {edaSummary.priceStats.kurtosis}
          </span>
          <span className="text-[10px] text-slate-400">Leptokurtic Tail</span>
        </div>
      </div>

      {/* Main EDA Chart Viewport */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        {/* Navigation Tabs and Neighborhood Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div className="flex items-center flex-wrap gap-1.5">
            {[
              { id: 'dist' as const, label: 'Price Distribution & KDE', icon: BarChart3 },
              { id: 'scatter' as const, label: 'Area vs Price Scatter', icon: ScatterIcon },
              { id: 'locations' as const, label: 'Location Breakdown', icon: Layers },
              { id: 'bedrooms' as const, label: 'Bedroom Price Analysis', icon: PieChart },
              { id: 'correlation' as const, label: 'Correlation Heatmap', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeChartTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveChartTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Neighborhood filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Neighborhoods ({dataset.length})</option>
              {edaSummary.locationAverages.map((loc) => (
                <option key={loc.location} value={loc.location}>
                  {loc.location} ({loc.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 1. Price Distribution Histogram */}
        {activeChartTab === 'dist' && (
          <div className="pt-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Residential Property Price Histogram & Density
                </h4>
                <p className="text-xs text-slate-500">
                  Frequency distribution across $195k bin intervals ({filteredData.length} records)
                </p>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Log-Normal Form: μ = ${edaSummary.priceStats.mean.toLocaleString()}
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceHistogramData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="bin" tick={{ fontSize: 10, fill: '#64748b' }} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(value: any) => [`${value} properties`, 'Count']}
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-700 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Distribution Insight:</strong> The price curve exhibits standard positive right-skewness typical of housing markets, with the primary cluster between <strong>$550,000 and $1,100,000</strong>. Tree-based ensembles and gradient boosting naturally handle this non-normal target distribution.
              </span>
            </div>
          </div>
        )}

        {/* 2. Scatter Plot: Area vs Price */}
        {activeChartTab === 'scatter' && (
          <div className="pt-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Living Area (Square Footage) vs Sale Price Scatter Plot
                </h4>
                <p className="text-xs text-slate-500">
                  Visualizing bivariate correlation and positive linear elasticity (Pearson r = 0.88)
                </p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    dataKey="area"
                    name="Area"
                    unit=" sqft"
                    domain={[600, 6000]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="priceK"
                    name="Price"
                    unit="k"
                    domain={[200, 3200]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(val: any, name: any) => [
                      name === 'Area' ? `${val} sq ft` : `$${(val * 1000).toLocaleString()}`,
                      name,
                    ]}
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Scatter name="Properties" data={scatterPoints} fill="#2563eb" opacity={0.65} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Econometric Finding:</strong> Square footage represents the single highest predictor of residential value ($38.5% total model weight), exhibiting strong constant returns to scale before tapering for ultra-luxury mansions above 4,800 sq ft.
              </span>
            </div>
          </div>
        )}

        {/* 3. Location Breakdown */}
        {activeChartTab === 'locations' && (
          <div className="pt-4 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Average House Valuation by Neighborhood Micro-Market
              </h4>
              <p className="text-xs text-slate-500">
                Evaluating geographical price premiums and price per square foot across sub-markets
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationBarData} margin={{ top: 10, right: 10, left: 10, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="location" tick={{ fontSize: 10, fill: '#64748b' }} angle={-20} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="k" />
                  <Tooltip
                    formatter={(val: any) => [`$${(val * 1000).toLocaleString()}`, 'Average Price']}
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="avgPriceK" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Location metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {edaSummary.locationAverages.map((loc) => (
                <div
                  key={loc.location}
                  className="p-3 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 rounded-xl border border-slate-100 text-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 block truncate">{loc.location}</span>
                    <span className="text-sm font-mono font-bold text-blue-700 block mt-0.5">
                      ${loc.avgPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      ${loc.avgSqFtPrice}/sqft · {loc.count} sales
                    </span>
                  </div>

                  {onSelectLocationForPredict && (
                    <button
                      type="button"
                      onClick={() => onSelectLocationForPredict(loc.location as LocationType)}
                      className="mt-2 text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-0.5 cursor-pointer"
                    >
                      <span>Predict in this Area</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Bedroom Price Analysis */}
        {activeChartTab === 'bedrooms' && (
          <div className="pt-4 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Valuation by Bedroom Layout Configuration
              </h4>
              <p className="text-xs text-slate-500">
                Stepped escalation in average price from 1-bedroom lofts to 6-bedroom estates
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bedroomBarData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="bedrooms" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="k" />
                  <Tooltip
                    formatter={(val: any) => [`$${(val * 1000).toLocaleString()}`, 'Average Price']}
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="avgPriceK" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 5. Correlation Heatmap */}
        {activeChartTab === 'correlation' && (
          <div className="pt-4 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Pearson Correlation Coefficient ($r$) Matrix
              </h4>
              <p className="text-xs text-slate-500">
                Pairwise linear correlations between all continuous and engineered features
              </p>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-xs font-bold text-slate-700 bg-slate-50">Feature</th>
                    {corrFeatures.map((f, i) => (
                      <th key={i} className="p-2 text-xs font-bold text-slate-700 bg-slate-50">
                        {f}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {corrMatrix.map((row, rIdx) => (
                    <tr key={rIdx} className="border-t border-slate-100">
                      <td className="p-2 text-left text-xs font-bold text-slate-900 bg-slate-50/50">
                        {corrFeatures[rIdx]}
                      </td>
                      {row.map((val, cIdx) => (
                        <td key={cIdx} className="p-1">
                          <div
                            className={`py-2 px-1 rounded text-xs font-mono font-bold transition-all ${getHeatmapColor(
                              val
                            )}`}
                            title={`${corrFeatures[rIdx]} vs ${corrFeatures[cIdx]}: r = ${val}`}
                          >
                            {val > 0 && val !== 1 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>High Positive Correlation: <strong>Area (+0.88)</strong>, <strong>Bathrooms (+0.64)</strong>, <strong>Luxury (+0.58)</strong></span>
              <span>Inverse Factor: <strong>Property Age (-0.24)</strong></span>
            </div>
          </div>
        )}

        {/* Bottom CTA Redirect Buttons */}
        {onNavigateTab && (
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Ready to test predictions or compare machine learning algorithms?
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onNavigateTab('predict')}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Go to Valuation Predictor</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('models')}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <BrainCircuit className="w-3.5 h-3.5 text-blue-600" />
                <span>Model Evaluation Lab</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
