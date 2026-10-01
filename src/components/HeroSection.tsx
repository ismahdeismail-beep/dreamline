import React, { useState } from 'react';
import {
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
  MessageSquare,
} from 'lucide-react';
import {
  KENYAN_CITIES,
  DEFAULT_WHATSAPP_NUMBER,
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

  const benefits = [
    { icon: Armchair, title: 'VIP Seating', desc: '2x1 ultra-wide recliners' },
    { icon: ShieldCheck, title: 'Safety First', desc: 'NTSA compliant coaches' },
    { icon: Radio, title: 'GPS Tracked', desc: '24/7 fleet telemetry' },
    { icon: Wifi, title: 'Free Wi-Fi', desc: 'High-speed on board' },
    { icon: Clock, title: 'On Schedule', desc: 'Guaranteed departures' },
    { icon: MessageSquare, title: 'WhatsApp Desk', desc: 'Instant booking support' },
  ];

  return (
    <section className="relative bg-slate-950 text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Hero background image with dark overlay for readability */}
      <div className="absolute inset-0 bg-[url('/images/hero-1.jpg')] no-repeat center/cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950" />

      <div className="relative max-w-7xl mx-auto">

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-400">
            <span>Kenya's Premier Luxury Coach Operator</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Outfit'] text-white text-balance leading-tight">
            Book tickets effortlessly online.{' '}
            <span className="text-amber-400">Affordable Rates.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            VIP recliners, GPS tracked coaches, free Wi-Fi, professional drivers, and instant WhatsApp booking.
          </p>

          {/* WhatsApp callout */}
          <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-700 py-1.5 px-4 rounded-full text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Prefer WhatsApp?</span>
            <button
              onClick={() => onOpenWhatsAppHub()}
              className="text-amber-400 font-bold hover:underline cursor-pointer"
            >
              Chat for availability & next bus
            </button>
          </div>
        </div>

        {/* Search Card */}
        <div className="mt-10 max-w-5xl mx-auto bg-slate-900/95 border border-slate-800 rounded-2xl shadow-xl p-5 sm:p-7 backdrop-blur-xl">
          <form onSubmit={handleSearchSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">

              {/* Origin */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Departure City
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-3.5 text-sm font-semibold text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  {KENYAN_CITIES.map((city) => (
                    <option key={city} value={city} className="bg-slate-900 text-white">{city}</option>
                  ))}
                </select>
              </div>

              {/* Swap */}
              <div className="md:col-span-1 flex justify-center pb-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 flex items-center justify-center border border-slate-700 transition-transform active:scale-95 cursor-pointer"
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
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-3.5 text-sm font-semibold text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  {KENYAN_CITIES.filter(c => c !== origin).map((city) => (
                    <option key={city} value={city} className="bg-slate-900 text-white">{city}</option>
                  ))}
                </select>
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

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
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

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleWhatsAppRouteEnquiry}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enquire on WhatsApp</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Search Coaches</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Corridor chips */}
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
              className="px-3 py-1 rounded-lg bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{c.from} → {c.to}</span>
              <span className="text-[10px] text-amber-400/80 font-mono">({c.tag})</span>
            </button>
          ))}
        </div>

        {/* Benefits grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center space-y-1.5 hover:border-amber-500/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">{title}</h4>
              <p className="text-[11px] text-slate-400">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
