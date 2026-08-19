import React from 'react';
import {
  Sparkles,
  BarChart3,
  BrainCircuit,
  Database,
  Code2,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';

export type TabType = 'predict' | 'eda' | 'models' | 'pipeline' | 'python';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onExportCSV: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onExportCSV }) => {
  const tabs = [
    { id: 'predict' as TabType, label: 'Valuation & Predictor', icon: Sparkles, badge: 'Live ML' },
    { id: 'eda' as TabType, label: 'EDA Studio', icon: BarChart3, badge: 'Insights' },
    { id: 'models' as TabType, label: 'Model Evaluation', icon: BrainCircuit, badge: '5 Algorithms' },
    { id: 'pipeline' as TabType, label: 'Data Cleaning & Preprocessing', icon: Database, badge: 'Pipeline' },
    { id: 'python' as TabType, label: 'Python ML Code', icon: Code2, badge: 'Export' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('predict')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  HousePrice<span className="text-blue-600">.ML</span>
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  GB Regressor R² 0.942
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Residential Real Estate Valuation & Econometrics Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              id="export-dataset-btn"
              onClick={onExportCSV}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
              title="Download clean dataset as CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Export Dataset</span>
              <span className="text-slate-400 font-normal">(.csv)</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="flex md:hidden overflow-x-auto space-x-1 py-2 border-t border-slate-100 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
