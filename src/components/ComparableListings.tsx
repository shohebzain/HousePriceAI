import React from 'react';
import { PropertyRecord } from '../types';
import { Building2, Bed, Bath, Maximize2, Sparkles, Check } from 'lucide-react';

interface ComparableListingsProps {
  comps: PropertyRecord[];
  onSelectComp?: (comp: PropertyRecord) => void;
}

export const ComparableListings: React.FC<ComparableListingsProps> = ({
  comps,
  onSelectComp,
}) => {
  if (!comps || comps.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Comparable Market Listings (Comps)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Closest benchmark properties recently recorded in this neighborhood
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {comps.length} Closest Matches
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {comps.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectComp && onSelectComp(item)}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
                <span>{item.id}</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                  Comp
                </span>
              </div>
              <div className="text-base font-bold font-mono text-slate-900">
                ${item.price.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">
                ${item.price_per_sqft}/sq ft · {item.location}
              </div>

              <div className="grid grid-cols-3 gap-1 my-3 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <div className="flex items-center space-x-1">
                  <Bed className="w-3 h-3 text-slate-400" />
                  <span>{item.bedrooms} bd</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bath className="w-3 h-3 text-slate-400" />
                  <span>{item.bathrooms} ba</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Maximize2 className="w-3 h-3 text-slate-400" />
                  <span>{item.area_sqft} sqft</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100 flex items-center justify-between">
              <span>{item.furnishing_status}</span>
              <span className="text-[10px] text-slate-400">{item.property_age} yrs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
