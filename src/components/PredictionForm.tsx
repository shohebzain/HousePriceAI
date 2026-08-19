import React from 'react';
import {
  PropertyFeatures,
  LocationType,
  FurnishingStatus,
  ModelAlgorithm,
} from '../types';
import { LOCATION_PROFILES } from '../data/dataset';
import { TabType } from './Navbar';
import {
  SlidersHorizontal,
  Home,
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Car,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  RotateCcw,
  Bot,
  ExternalLink,
  BarChart3,
  BrainCircuit,
} from 'lucide-react';

interface PredictionFormProps {
  features: PropertyFeatures;
  onChange: (features: PropertyFeatures) => void;
  selectedModel: ModelAlgorithm;
  onModelChange: (model: ModelAlgorithm) => void;
  onPredict: () => void;
  loading: boolean;
  onNavigateTab?: (tab: TabType) => void;
}

const PRESET_PROPERTIES: { name: string; tag: string; features: PropertyFeatures }[] = [
  {
    name: 'Tech Corridor Smart Villa',
    tag: 'Modern',
    features: {
      location: 'Tech Corridor',
      area_sqft: 2850,
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      property_age: 4,
      stories: 2,
      mainroad: true,
      guestroom: true,
      basement: true,
      airconditioning: true,
      hotwaterheating: true,
      furnishing_status: 'Fully Furnished',
      solar_panels: true,
      smart_home: true,
      garden_or_pool: true,
    },
  },
  {
    name: 'Downtown Luxury Penthouse',
    tag: 'High-End',
    features: {
      location: 'Downtown Core',
      area_sqft: 2100,
      bedrooms: 3,
      bathrooms: 3,
      parking: 2,
      property_age: 2,
      stories: 1,
      mainroad: true,
      guestroom: false,
      basement: false,
      airconditioning: true,
      hotwaterheating: true,
      furnishing_status: 'Designer Luxury',
      solar_panels: false,
      smart_home: true,
      garden_or_pool: false,
    },
  },
  {
    name: 'Historic Old Town Estate',
    tag: 'Vintage',
    features: {
      location: 'Historic Old Town',
      area_sqft: 3400,
      bedrooms: 5,
      bathrooms: 4,
      parking: 2,
      property_age: 48,
      stories: 3,
      mainroad: true,
      guestroom: true,
      basement: true,
      airconditioning: true,
      hotwaterheating: true,
      furnishing_status: 'Semi-Furnished',
      solar_panels: false,
      smart_home: false,
      garden_or_pool: true,
    },
  },
  {
    name: 'Suburb Heights Family Home',
    tag: 'Family',
    features: {
      location: 'Suburb Heights',
      area_sqft: 1950,
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      property_age: 12,
      stories: 2,
      mainroad: true,
      guestroom: false,
      basement: false,
      airconditioning: true,
      hotwaterheating: true,
      furnishing_status: 'Semi-Furnished',
      solar_panels: false,
      smart_home: false,
      garden_or_pool: true,
    },
  },
  {
    name: 'University Starter Loft',
    tag: 'Compact',
    features: {
      location: 'University District',
      area_sqft: 950,
      bedrooms: 2,
      bathrooms: 1,
      parking: 1,
      property_age: 8,
      stories: 1,
      mainroad: true,
      guestroom: false,
      basement: false,
      airconditioning: true,
      hotwaterheating: true,
      furnishing_status: 'Unfurnished',
      solar_panels: false,
      smart_home: false,
      garden_or_pool: false,
    },
  },
];

export const PredictionForm: React.FC<PredictionFormProps> = ({
  features,
  onChange,
  selectedModel,
  onModelChange,
  onPredict,
  loading,
  onNavigateTab,
}) => {
  const updateField = <K extends keyof PropertyFeatures>(field: K, value: PropertyFeatures[K]) => {
    onChange({ ...features, [field]: value });
  };

  const locations: LocationType[] = [
    'Downtown Core',
    'Tech Corridor',
    'Waterfront Bay',
    'Suburb Heights',
    'University District',
    'Green Hills',
    'Metro Central',
    'Historic Old Town',
  ];

  const furnishingOptions: FurnishingStatus[] = [
    'Unfurnished',
    'Semi-Furnished',
    'Fully Furnished',
    'Designer Luxury',
  ];

  const models: { id: ModelAlgorithm; name: string; badge: string }[] = [
    { id: 'gradient_boosting', name: 'Gradient Boosting', badge: 'R² 0.942 · Best' },
    { id: 'random_forest', name: 'Random Forest', badge: 'R² 0.924' },
    { id: 'ensemble', name: 'Ensemble Consensus', badge: 'R² 0.948 · Meta' },
    { id: 'ridge_regression', name: 'Ridge (L2)', badge: 'R² 0.868' },
    { id: 'linear_regression', name: 'Linear OLS', badge: 'R² 0.856' },
    { id: 'decision_tree', name: 'Decision Tree', badge: 'R² 0.839' },
  ];

  const locProfile = LOCATION_PROFILES[features.location];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
      {/* Header & Preset selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <span>Property Attributes & Features</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure residential parameters to estimate fair market property valuation
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-xs text-slate-400 font-medium mr-1">Presets:</span>
          {PRESET_PROPERTIES.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onChange(preset.features)}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 transition-colors"
            >
              {preset.tag}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-5">
        {/* Location Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Location / Neighborhood Micro-Market</span>
            </span>
            <span className="text-xs text-blue-600 font-semibold normal-case">
              Base: ${locProfile?.basePerSqFt}/sq ft
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {locations.map((loc) => {
              const isSelected = features.location === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  id={`loc-${loc.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => updateField('location', loc)}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold shadow-xs ring-1 ring-blue-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold truncate">{loc}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ${LOCATION_PROFILES[loc].basePerSqFt}/sqft · Walk {LOCATION_PROFILES[loc].walkScore}
                  </div>
                </button>
              );
            })}
          </div>
          {locProfile && (
            <p className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-700">{features.location}: </span>
              {locProfile.description} (School Rating: {locProfile.avgSchoolRating}/10)
            </p>
          )}
        </div>

        {/* Primary Metrics: Area & Rooms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Living Area (Sq Ft) */}
          <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Living Area (Square Footage)</span>
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min="500"
                  max="10000"
                  step="25"
                  value={features.area_sqft}
                  onChange={(e) => updateField('area_sqft', Math.max(400, Number(e.target.value) || 500))}
                  className="w-24 text-right px-2 py-1 bg-white border border-slate-300 rounded-md font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <span className="text-xs font-semibold text-slate-500">sq ft</span>
              </div>
            </div>
            <input
              type="range"
              min="650"
              max="6000"
              step="25"
              value={features.area_sqft}
              onChange={(e) => updateField('area_sqft', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>650 sq ft (Studio)</span>
              <span>2,400 sq ft (Median)</span>
              <span>6,000+ sq ft (Mansion)</span>
            </div>
          </div>

          {/* Property Age */}
          <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Property Age (Years)</span>
              </label>
              <div className="flex items-center space-x-1">
                <span className="font-mono text-sm font-bold text-slate-900">
                  {features.property_age === 0 ? 'Brand New (0)' : `${features.property_age} yrs`}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              step="1"
              value={features.property_age}
              onChange={(e) => updateField('property_age', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0 (New Build)</span>
              <span>25 yrs (Mature)</span>
              <span>70+ yrs (Historic)</span>
            </div>
          </div>
        </div>

        {/* Room Counters (Beds, Baths, Parking, Stories) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Bedrooms */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Bed className="w-3.5 h-3.5 text-slate-500" />
              <span>Bedrooms</span>
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => updateField('bedrooms', num)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    features.bedrooms === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Bath className="w-3.5 h-3.5 text-slate-500" />
              <span>Bathrooms</span>
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => updateField('bathrooms', num)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    features.bathrooms === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Parking Spaces */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Car className="w-3.5 h-3.5 text-slate-500" />
              <span>Parking Spaces</span>
            </label>
            <div className="flex items-center space-x-1">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => updateField('parking', num)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    features.parking === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Stories */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Stories / Floors</span>
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => updateField('stories', num)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    features.stories === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Furnishing Status */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Interior & Furnishing Standard
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {furnishingOptions.map((opt) => {
              const isSelected = features.furnishing_status === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField('furnishing_status', opt)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Amenities & Fixtures Checklist */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Special Features & Luxury Amenities
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { key: 'airconditioning' as const, label: 'Central AC / HVAC', desc: '+$28k avg' },
              { key: 'basement' as const, label: 'Finished Basement', desc: '+$42k avg' },
              { key: 'garden_or_pool' as const, label: 'Private Pool / Garden', desc: '+$58k avg' },
              { key: 'smart_home' as const, label: 'Smart Home Automation', desc: '+$19k avg' },
              { key: 'solar_panels' as const, label: 'Solar Power Array', desc: '+$22k avg' },
              { key: 'guestroom' as const, label: 'Guest Suite', desc: '+$31k avg' },
              { key: 'hotwaterheating' as const, label: 'Hydronic Heating', desc: '+$16k avg' },
              { key: 'mainroad' as const, label: 'Main Road Frontage', desc: '+$24k avg' },
            ].map(({ key, label, desc }) => {
              const checked = !!features[key];
              return (
                <label
                  key={key}
                  className={`flex items-start space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    checked
                      ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-500/10'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => updateField(key, e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <div className="text-xs">
                    <span className={`font-semibold block ${checked ? 'text-blue-950' : 'text-slate-700'}`}>
                      {label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{desc}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Machine Learning Model Selector */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Machine Learning Algorithm</span>
            </label>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('models')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <BrainCircuit className="w-3 h-3" />
                <span>Open Diagnostic Lab & Metrics</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {models.map((m) => {
              const isSelected = selectedModel === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onModelChange(m.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{m.name}</div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-300' : 'text-slate-400'}`}>
                    {m.badge}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculate Button & Secondary Navigation CTA */}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            id="predict-valuation-btn"
            onClick={onPredict}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-75 cursor-pointer"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Computing Econometric Valuation...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Calculate House Price Valuation</span>
              </>
            )}
          </button>

          {onNavigateTab && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigateTab('eda')}
                className="py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Explore EDA Studio</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('pipeline')}
                className="py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>View Data Pipeline</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
