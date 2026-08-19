import React, { useState } from 'react';
import { EDASummary, PropertyRecord } from '../types';
import { TabType } from './Navbar';
import {
  Database,
  CheckCircle2,
  Filter,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  Download,
  Code2,
  BrainCircuit,
  Sparkles,
} from 'lucide-react';

interface DataPipelineViewProps {
  edaSummary: EDASummary;
  dataset: PropertyRecord[];
  onExportCSV: () => void;
  onNavigateTab?: (tab: TabType) => void;
}

export const DataPipelineView: React.FC<DataPipelineViewProps> = ({
  edaSummary,
  dataset,
  onExportCSV,
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filteredDataset = dataset.filter((d) => {
    const matchesLoc = selectedLocation === 'all' || d.location === selectedLocation;
    const matchesSearch =
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.furnishing_status.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLoc && matchesSearch;
  });

  const totalPages = Math.ceil(filteredDataset.length / pageSize);
  const pagedRecords = filteredDataset.slice((page - 1) * pageSize, page * pageSize);

  const pipelineSteps = [
    {
      step: '01',
      title: 'Data Ingestion & Integrity Audit',
      desc: '1,200 residential property transactions ingested across 8 micro-market geographical tiers with continuous and discrete attributes.',
      status: 'Clean & Validated',
    },
    {
      step: '02',
      title: 'Missing Value Imputation',
      desc: 'Applied domain-specific median imputation for property age by neighborhood; modal imputation for parking spaces; and constant defaults for binary amenities.',
      status: '0% Missing Target Values',
    },
    {
      step: '03',
      title: 'Outlier Detection & Capping (IQR)',
      desc: 'Identified extreme pricing points using 1.5 × Interquartile Range (IQR). Capped values at upper and lower boundaries to preserve variance without skewing gradient steps.',
      status: 'IQR & Z-score Boundaries Applied',
    },
    {
      step: '04',
      title: 'Categorical Encoding',
      desc: 'One-Hot Encoded non-ordinal features (location, furnishing status) with dummy variable trap prevention (k-1 encoding for linear models).',
      status: 'Sparse ColumnTransformer Matrix',
    },
    {
      step: '05',
      title: 'Feature Engineering & Interactions',
      desc: 'Constructed derived econometric features: Luxury Composite Score (0-10), Total Rooms (Beds + Baths), and Vintage Architectural Preservation factor.',
      status: 'High Mutual Information',
    },
    {
      step: '06',
      title: 'Feature Scaling & Stratified Split',
      desc: 'Applied StandardScaler (z-score normalization) to numerical inputs. Split into 80% Training (960 samples) and 20% Test Evaluation (240 samples).',
      status: '80 / 20 Train-Test Split',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Pipeline Flow Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span>Data Cleaning, Preprocessing & Feature Engineering Pipeline</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Production Scikit-learn ColumnTransformer architecture and data sanitation stages
            </p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-full border border-blue-200 self-start sm:self-auto">
            Scikit-learn Pipeline
          </span>
        </div>

        {/* 6-Step Visual Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
          {pipelineSteps.map((step) => (
            <div
              key={step.step}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded">
                    STEP {step.step}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {step.status}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 mt-2">{step.title}</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Values & Outlier Audit Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing Values Report */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Missing Values Audit & Imputation Strategy</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="p-2.5">Feature</th>
                  <th className="p-2.5 text-right">Missing Count</th>
                  <th className="p-2.5 text-right">Missing %</th>
                  <th className="p-2.5">Imputation Technique</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {edaSummary.missingValuesReport.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono font-semibold text-slate-900">{row.feature}</td>
                    <td className="p-2.5 text-right font-mono text-slate-700">{row.missingCount}</td>
                    <td className="p-2.5 text-right font-mono text-slate-700">{row.percentage}%</td>
                    <td className="p-2.5 text-[11px] text-slate-600 font-medium">{row.imputationStrategy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outlier Handling Report */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Outlier Detection & IQR Boundaries (1.5 × IQR)</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="p-2.5">Attribute</th>
                  <th className="p-2.5 text-right">Outliers</th>
                  <th className="p-2.5 text-right">Lower Bound</th>
                  <th className="p-2.5 text-right">Upper Bound</th>
                  <th className="p-2.5">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {edaSummary.outlierReport.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono font-semibold text-slate-900">{row.feature}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-600">{row.outlierCount}</td>
                    <td className="p-2.5 text-right font-mono text-slate-700">${row.lowerBound.toLocaleString()}</td>
                    <td className="p-2.5 text-right font-mono text-slate-700">${row.upperBound.toLocaleString()}</td>
                    <td className="p-2.5 text-[11px] text-slate-600">{row.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interactive Dataset Viewer Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Cleaned Master Dataset Explorer</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredDataset.length} of {dataset.length} property records
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ID, Location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Location filter */}
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setPage(1);
              }}
              className="text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="all">All Locations</option>
              {edaSummary.locationAverages.map((loc) => (
                <option key={loc.location} value={loc.location}>
                  {loc.location}
                </option>
              ))}
            </select>

            <button
              onClick={onExportCSV}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                <th className="p-2.5">ID</th>
                <th className="p-2.5">Location</th>
                <th className="p-2.5 text-right">Area (sqft)</th>
                <th className="p-2.5 text-center">Beds</th>
                <th className="p-2.5 text-center">Baths</th>
                <th className="p-2.5 text-center">Age (yr)</th>
                <th className="p-2.5">Furnishing</th>
                <th className="p-2.5 text-center">Luxury</th>
                <th className="p-2.5 text-right">Price ($)</th>
                <th className="p-2.5 text-right">$/SqFt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedRecords.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 font-medium">
                  <td className="p-2.5 font-mono text-slate-400 text-[11px]">{row.id}</td>
                  <td className="p-2.5 font-semibold text-slate-900">{row.location}</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">{row.area_sqft.toLocaleString()}</td>
                  <td className="p-2.5 text-center font-mono">{row.bedrooms}</td>
                  <td className="p-2.5 text-center font-mono">{row.bathrooms}</td>
                  <td className="p-2.5 text-center font-mono">{row.property_age}</td>
                  <td className="p-2.5 text-slate-600">{row.furnishing_status}</td>
                  <td className="p-2.5 text-center font-mono font-bold text-amber-600">{row.luxury_score}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-blue-700">
                    ${row.price.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-right font-mono text-slate-500">${row.price_per_sqft}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing {(page - 1) * pageSize + 1} to{' '}
            {Math.min(page * pageSize, filteredDataset.length)} of {filteredDataset.length}
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Prev
            </button>
            <span className="font-mono px-2 text-slate-700 font-bold">
              {page} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>

        {/* Bottom CTA Redirect Buttons */}
        {onNavigateTab && (
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Cleaned dataset ready for model training and live property valuation.
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onNavigateTab('python')}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span>View Python ML Scripts</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('predict')}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Live Valuation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
