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

        {/* The old three-column card grid took over a full screen of height just to
            communicate "pick a route". One swipeable row does the same job. */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:thin]">
          {filteredRoutes.map((route) => (
            <button
              key={route.id}
              type="button"
              onClick={() => onSelectRoute(route.from, route.to)}
              className="shrink-0 w-[228px] snap-start text-left bg-white/80 backdrop-blur-md border border-white/70 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-[#34398e]/40 transition-all cursor-pointer group"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#34398e]">{route.region}</p>
              <h3 className="mt-1 font-black text-slate-900 leading-tight text-[15px]">
                {route.from} <span className="text-[#e52421]">→</span> {route.to}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-slate-500">
                <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{route.estimatedHours}</span>
                <span>&bull;</span>
                <span className="text-slate-900">KSh {route.standardFare.toLocaleString()}</span>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#34398e] group-hover:gap-2 transition-all">
                Book <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
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
