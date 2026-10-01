import React, { useState } from 'react';
import {
  Route as RouteIcon,
  MessageSquare,
  ArrowRight,
  Search,
  ChevronRight
} from 'lucide-react';
import { 
  POPULAR_ROUTES, 
  RouteDetail, 
  DEFAULT_WHATSAPP_NUMBER, 
  buildWhatsAppLink 
} from '../data/dreamlineData';

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
    const matchesSearch = 
      r.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.popularPickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.popularDropoff.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const handleWhatsAppRouteCheck = (route: RouteDetail) => {
    const msg = `Hi, I want to check ${route.from} to ${route.to} bus availability, departures, and pricing for this week.`;
    const link = buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, msg);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="routes" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
              <RouteIcon className="w-4 h-4" />
              <span>Extensive Route Network</span>
              <span aria-hidden="true">·</span>
              <span>Coast to Border</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit'] text-white">
              Dreamline Routes & Fares
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
              Connecting Mombasa, Nairobi, Nakuru, Kisumu, Kisii, Busia, Narok, Homabay, Kendu Bay, and beyond with scheduled daily luxury services.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search towns or stages..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Region Filter Segmented Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedRegion === region
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
            >
              <div className="space-y-4">
                {/* Route Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {route.region}
                    </span>
                    <h3 className="text-xl font-bold font-['Outfit'] text-white flex items-center gap-2 mt-0.5">
                      <span>{route.from}</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                      <span>{route.to}</span>
                    </h3>
                  </div>

                  <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-md text-slate-300 font-mono">
                    {route.distanceKm} km
                  </span>
                </div>

                {/* Key Route Metrics */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Est. Time</span>
                    <span className="text-xs font-bold text-white font-mono">{route.estimatedHours}</span>
                  </div>
                  <div className="border-x border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Standard</span>
                    <span className="text-xs font-bold text-amber-400 font-mono">KSh {route.standardFare}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">VIP Recliner</span>
                    <span className="text-xs font-bold text-amber-300 font-mono">KSh {route.vipFare}</span>
                  </div>
                </div>

                {/* Terminals & Highlights */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-2 text-slate-400">
                    <span className="text-slate-500 font-medium">Pickup:</span>
                    <span className="text-slate-300 font-medium truncate">{route.popularPickup}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-400">
                    <span className="text-slate-500 font-medium">Dropoff:</span>
                    <span className="text-slate-300 font-medium truncate">{route.popularDropoff}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/80">
                    "{route.highlight}"
                  </p>
                </div>
              </div>

              {/* Action Buttons for Route */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2.5">
                {/* 1. WhatsApp Button (Prompt requirement) */}
                <button
                  type="button"
                  onClick={() => handleWhatsAppRouteCheck(route)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/40 text-xs font-bold transition-colors cursor-pointer"
                  title={`Enquire ${route.from} to ${route.to} on WhatsApp`}
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-amber-400" />
                  <span>WhatsApp</span>
                </button>

                {/* 2. Book Online */}
                <button
                  type="button"
                  onClick={() => onSelectRoute(route.from, route.to)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                >
                  <span>Book Online</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Can't find your town? Banner */}
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base font-bold text-white font-['Outfit']">
              Travelling to Narok, Oyugis, Keroka, Kendu Bay, Yala, or Butere?
            </h4>
            <p className="text-xs text-slate-300">
              Dreamline operates connecting shuttle stages and parcel drop-offs across regional Western Kenya and Rift Valley.
            </p>
          </div>
          <button
            onClick={() => onOpenWhatsAppHub('Habari Dreamline! I am looking for connecting route information and fares for regional destinations.')}
            className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Ask Regional Route on WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};
