import React, { useState } from 'react';
import { Search, ChevronRight, Clock, MapPin } from 'lucide-react';
import { POPULAR_ROUTES, RouteDetail } from '../data/dreamlineData';

interface RoutesDirectoryProps {
  onSelectRoute: (from: string, to: string) => void;
}

export const RoutesDirectory: React.FC<RoutesDirectoryProps> = ({
  onSelectRoute
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const regions = ['All', 'Inter-City', 'Western Kenya', 'Rift Valley', 'Coast'];

  const filteredRoutes = POPULAR_ROUTES.filter((r) => {
    const matchesRegion = selectedRegion === 'All' || r.region === selectedRegion;
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q || r.from.toLowerCase().includes(q) || r.to.toLowerCase().includes(q);
    return matchesRegion && matchesSearch;
  });

  return (
    <section id="routes" className="py-14 px-4 sm:px-6 lg:px-8 bg-[#f9f8fc]">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#34398e]">Route network</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">Routes & fares</h2>
            <p className="text-sm text-slate-500">Daily services across Kenya.</p>
          </div>
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search town..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#34398e]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                selectedRegion === region ? 'bg-[#34398e] text-white' : 'bg-white text-slate-600 border border-slate-300 hover:border-[#34398e]'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoutes.map((route) => (
            <div key={route.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col hover:border-[#34398e]/40 hover:shadow-md transition-all">
              <div className="h-1 w-full bg-gradient-to-r from-[#34398e] to-[#e52421]" />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#34398e]">{route.region}</p>
                    <h3 className="text-lg font-black text-slate-900 leading-tight mt-1">
                      {route.from} <span className="text-[#e52421]">→</span> {route.to}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{route.distanceKm} km</p>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-[#f9f8fc] border border-slate-100 py-3">
                  <div className="px-2 text-center">
                    <dt className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Time</dt>
                    <dd className="text-sm font-black text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />{route.estimatedHours}
                    </dd>
                  </div>
                  <div className="px-2 text-center">
                    <dt className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Standard</dt>
                    <dd className="text-sm font-black text-slate-900 mt-0.5">{route.standardFare.toLocaleString()}</dd>
                  </div>
                  <div className="px-2 text-center">
                    <dt className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">VIP</dt>
                    <dd className="text-sm font-black text-[#34398e] mt-0.5">{route.vipFare.toLocaleString()}</dd>
                  </div>
                </dl>

                <p className="mt-3 text-[11px] text-slate-500 flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-slate-300" />
                  <span>{route.popularPickup} → {route.popularDropoff}</span>
                </p>

                <button
                  type="button"
                  onClick={() => onSelectRoute(route.from, route.to)}
                  className="mt-4 w-full py-2.5 rounded-xl bg-[#34398e] hover:bg-[#282c6e] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  Book this route <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-600">
            <span className="font-black text-slate-900">Going elsewhere?</span> Narok, Kendu Bay, Yala and more are served via connecting shuttles — call our desk for a route and fare quote.
          </p>
        </div>
      </div>
    </section>
  );
};
