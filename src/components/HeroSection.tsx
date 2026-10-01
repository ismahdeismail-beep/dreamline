import React, { useState } from 'react';
import { 
  Bus, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRightLeft, 
  Search, 
  ShieldCheck, 
  Wifi, 
  Armchair, 
  Clock, 
  Radio, 
  Award,
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { 
  KENYAN_CITIES, 
  DEFAULT_WHATSAPP_NUMBER, 
  DISPLAY_WHATSAPP_NUMBER, 
  buildWhatsAppLink 
} from '../data/dreamlineData';

interface HeroSectionProps {
  onSearch: (params: { origin: string; destination: string; date: string; passengers: number }) => void;
  onOpenWhatsAppHub: (message?: string) => void;
  onSelectRouteQuick: (from: string, to: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onOpenWhatsAppHub,
  onSelectRouteQuick
}) => {
  const [origin, setOrigin] = useState('Nairobi');
  const [destination, setDestination] = useState('Mombasa');
  const [travelDate, setTravelDate] = useState('2026-10-02');
  const [passengers, setPassengers] = useState(1);
  const [seatClass, setSeatClass] = useState('All Classes');

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ origin, destination, date: travelDate, passengers });
  };

  const handleWhatsAppRouteEnquiry = () => {
    const msg = `Habari Dreamline! I am looking to book a bus from ${origin} to ${destination} on ${travelDate} for ${passengers} passenger(s) (${seatClass}). Could you please advise on available buses, departure times, and total fare?`;
    const link = buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, msg);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const topCorridors = [
    { from: 'Nairobi', to: 'Mombasa', tag: 'Most Popular' },
    { from: 'Nairobi', to: 'Kisumu', tag: 'Fast Highway' },
    { from: 'Nairobi', to: 'Nakuru', tag: 'Hourly' },
    { from: 'Nairobi', to: 'Kisii', tag: 'Direct VIP' },
    { from: 'Nairobi', to: 'Busia', tag: 'Border Express' }
  ];

  return (
    <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto">
        
        {/* Editorial Pill-Free Subtitle & Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-400">
            <span>Kenya's Premier Luxury Long-Distance Coach Operator</span>
            <span aria-hidden="true">·</span>
            <span>Est. Quality</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Outfit'] text-white text-balance leading-tight">
            Book and manage tickets effortlessly online. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">Affordable Rates.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Experience royal travel across Kenya. VIP Recliners, GPS tracked coaches, complimentary Wi-Fi, professional drivers, and instant WhatsApp booking support.
          </p>

          {/* Prompt WhatsApp Integration Quick Notification Callout */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-slate-900/90 border border-emerald-500/30 py-1.5 px-4 rounded-full text-xs text-slate-200 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Prefer WhatsApp?</span>
            <button
              onClick={() => onOpenWhatsAppHub()}
              className="text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Chat directly for availability & next bus</span>
              <MessageSquare className="w-3.5 h-3.5 fill-emerald-400" />
            </button>
          </div>
        </div>

        {/* Core Interactive Search & Booking Card */}
        <div className="mt-10 max-w-5xl mx-auto bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-7 backdrop-blur-xl">
          <form onSubmit={handleSearchSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
              
              {/* Origin */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Departure City
                </label>
                <div className="relative">
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-3.5 text-sm font-semibold text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
                  >
                    {KENYAN_CITIES.map((city) => (
                      <option key={city} value={city} className="bg-slate-900 text-white">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center pb-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 flex items-center justify-center border border-slate-700 transition-transform active:scale-95 shadow-sm cursor-pointer"
                  title="Swap Origin and Destination"
                  aria-label="Swap Origin and Destination"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Destination */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Arrival City
                </label>
                <div className="relative">
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-3.5 text-sm font-semibold text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
                  >
                    {KENYAN_CITIES.filter(c => c !== origin).map((city) => (
                      <option key={city} value={city} className="bg-slate-900 text-white">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Travel Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  min="2026-10-01"
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3.5 text-sm font-semibold text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
                />
              </div>

              {/* Passengers */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  Passengers
                </label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-3.5 text-sm font-semibold text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num} className="bg-slate-900 text-white">
                      {num} {num === 1 ? 'Seat' : 'Seats'}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Bottom Form Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
              
              {/* Class Selection */}
              <div className="flex items-center gap-2 text-xs text-slate-400 self-start sm:self-center">
                <span className="font-medium text-slate-300">Coach Tier:</span>
                <div className="flex gap-1.5">
                  {['All Classes', 'VIP 2x1', 'Executive'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSeatClass(tier)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        seatClass === tier 
                          ? 'bg-amber-400 text-slate-950 font-bold' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Dual CTAs */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* 1. Direct WhatsApp Check Button (Prompt: "Check availability on WhatsApp") */}
                <button
                  type="button"
                  onClick={handleWhatsAppRouteEnquiry}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
                  title="Check Availability and Next Bus on WhatsApp directly"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Enquire on WhatsApp</span>
                </button>

                {/* 2. Main Search Button */}
                <button
                  type="submit"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Search Coaches</span>
                </button>
              </div>

            </div>
          </form>
        </div>

        {/* Quick Route Shortcut Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Trending corridors:</span>
          {topCorridors.map((c) => (
            <button
              key={`${c.from}-${c.to}`}
              onClick={() => {
                setOrigin(c.from);
                setDestination(c.to);
                onSelectRouteQuick(c.from, c.to);
              }}
              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{c.from} → {c.to}</span>
              <span className="text-[10px] text-amber-400/80 font-mono">({c.tag})</span>
            </button>
          ))}
        </div>

        {/* Value Proposition & Key Benefits (From Dreamline Brain Tree research) */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 text-center space-y-1.5 hover:border-amber-500/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
              <Armchair className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">VIP Seating</h4>
            <p className="text-[11px] text-slate-400">2x1 ultra-wide recliners with leg rests</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 text-center space-y-1.5 hover:border-amber-500/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Safety First</h4>
            <p className="text-[11px] text-slate-400">NTSA compliant & vetted co-drivers</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 text-center space-y-1.5 hover:border-amber-500/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">GPS Tracked</h4>
            <p className="text-[11px] text-slate-400">24/7 central speed & fleet telemetry</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 text-center space-y-1.5 hover:border-amber-500/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
              <Wifi className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Free Wi-Fi</h4>
            <p className="text-[11px] text-slate-400">High-speed browsing & USB ports</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 text-center space-y-1.5 hover:border-amber-500/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">On Schedule</h4>
            <p className="text-[11px] text-slate-400">Guaranteed punctual departures</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 text-center space-y-1.5 hover:border-emerald-500/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
              <MessageSquare className="w-4 h-4 fill-emerald-400" />
            </div>
            <h4 className="text-xs font-bold text-white">WhatsApp Desk</h4>
            <p className="text-[11px] text-slate-400">Instant seat hold & fare quotes</p>
          </div>
        </div>

      </div>
    </section>
  );
};
