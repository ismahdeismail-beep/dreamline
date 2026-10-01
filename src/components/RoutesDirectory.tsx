import React, { useState } from 'react';
import { Search, MessageSquare, ChevronRight } from 'lucide-react';
import { POPULAR_ROUTES, RouteDetail, DEFAULT_WHATSAPP_NUMBER, buildWhatsAppLink } from '../data/dreamlineData';

interface RoutesDirectoryProps {
  onSelectRoute: (from: string, to: string) => void;
  onOpenWhatsAppHub: (msg?: string) => void;
}

export const RoutesDirectory: React.FC<RoutesDirectoryProps> = ({
  onSelectRoute,
  onOpenWhatsAppHub
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

  const handleWhatsAppRouteCheck = (route: RouteDetail) => {
    window.open(
      buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, `Hi, ${route.from} to ${route.to} availability and fare?`),
      '_blank', 'noopener,noreferrer'
    );
  };

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
            <div key={route.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-[#34398e]/40 hover:shadow-md transition-all">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{route.region} · {route.distanceKm} km</p>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">{route.from} → {route.to}</h3>
                <div className="grid grid-cols-3 gap-2 mt-3 py-2.5 px-3 bg-[#f9f8fc] rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Time</span>
                    <span className="text-xs font-black text-slate-900">{route.estimatedHours}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Standard</span>
                    <span className="text-xs font-black text-[#34398e]">KSh {route.standardFare}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">VIP</span>
                    <span className="text-xs font-black text-slate-900">KSh {route.vipFare}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2.5">{route.popularPickup} → {route.popularDropoff}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleWhatsAppRouteCheck(route)}
                  className="py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-600 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => onSelectRoute(route.from, route.to)}
                  className="py-2.5 rounded-xl bg-[#34398e] hover:bg-[#282c6e] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  Book <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-600"><span className="font-black text-slate-900">Going elsewhere?</span> Narok, Kendu Bay, Yala and more via connecting shuttles.</p>
          <button
            onClick={() => onOpenWhatsAppHub('Habari! Regional route info please.')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" /> Ask on WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};
