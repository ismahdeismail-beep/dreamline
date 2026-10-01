import React, { useState } from 'react';
import { 
  Clock, 
  Bus, 
  MapPin, 
  MessageSquare, 
  Armchair, 
  Shield, 
  Wifi, 
  Sparkles,
  ChevronRight,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  BusSchedule, 
  DEFAULT_WHATSAPP_NUMBER, 
  buildWhatsAppLink 
} from '../data/dreamlineData';

interface NextBusesBoardProps {
  schedules: BusSchedule[];
  onSelectBusToBook: (bus: BusSchedule) => void;
  onOpenWhatsAppHub: (msg?: string) => void;
}

export const NextBusesBoard: React.FC<NextBusesBoardProps> = ({
  schedules,
  onSelectBusToBook,
  onOpenWhatsAppHub
}) => {
  const [selectedCorridor, setSelectedCorridor] = useState<string>('All Corridors');

  const corridors = [
    'All Corridors',
    'Nairobi → Mombasa',
    'Nairobi → Kisumu',
    'Nairobi → Nakuru',
    'Nairobi → Kisii',
    'Nairobi → Busia'
  ];

  const filteredSchedules = schedules.filter((s) => {
    if (selectedCorridor === 'All Corridors') return true;
    const key = `${s.origin} → ${s.destination}`;
    return key === selectedCorridor;
  });

  const handleWhatsAppInquiry = (bus: BusSchedule) => {
    const msg = `Habari Dreamline! What is the status of the ${bus.departureTime} bus (${bus.coachName} - ${bus.busNumber}) from ${bus.origin} to ${bus.destination}? Are there still seats available for today, and what is the current price?`;
    const link = buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, msg);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="next-buses" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>Live Departure Board</span>
              <span aria-hidden="true">·</span>
              <span>Updated Real-Time</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Outfit'] mt-1 text-white">
              Next Available Buses Across Kenya
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mt-1">
              Guaranteed departures with instant online reservation or 1-tap WhatsApp seat inquiry directly to our station desk.
            </p>
          </div>

          {/* Quick WhatsApp helper banner */}
          <div className="p-3 bg-slate-950/80 border border-amber-500/30 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 fill-[#25D366]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Looking for a specific route time?</p>
              <button
                onClick={() => onOpenWhatsAppHub('Habari Dreamline! Could you share the next bus departures from my city?')}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Ask next bus on WhatsApp</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Corridor Filter Tabs (Interactive filter control) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {corridors.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCorridor(c)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCorridor === c
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchedules.map((bus) => {
            const isFewSeats = bus.availableSeats <= 6;
            return (
              <div 
                key={bus.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Top card info */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                        {bus.busNumber}
                      </span>
                      <h3 className="font-bold text-base text-white font-['Outfit'] mt-0.5">
                        {bus.coachName}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {bus.coachType}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-400">From</div>
                      <div className="text-lg font-extrabold text-amber-400 font-mono">
                        KSh {bus.regularPrice.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        VIP: KSh {bus.vipPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Route & Times */}
                  <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800/80 space-y-2 mb-3.5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs text-slate-400 font-medium">Departs</div>
                        <div className="text-base font-bold text-white font-mono">{bus.departureTime}</div>
                        <div className="text-[11px] font-semibold text-amber-300">{bus.origin}</div>
                      </div>

                      <div className="flex flex-col items-center px-2">
                        <span className="text-[10px] text-slate-500 font-medium">{bus.duration}</span>
                        <div className="w-16 h-0.5 bg-slate-700 relative my-1">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        </div>
                        <span className="text-[10px] text-amber-400 font-mono">Direct Express</span>
                      </div>

                      <div className="space-y-0.5 text-right">
                        <div className="text-xs text-slate-400 font-medium">Est. Arrival</div>
                        <div className="text-base font-bold text-white font-mono">{bus.arrivalTime}</div>
                        <div className="text-[11px] font-semibold text-amber-300">{bus.destination}</div>
                      </div>
                    </div>

                    {/* Pick-up station note */}
                    <div className="text-[11px] text-slate-400 pt-1.5 border-t border-slate-800 flex items-center justify-between">
                      <span className="truncate max-w-[200px]">Boarding: {bus.pickupPoints[0]}</span>
                      <span className="text-slate-500">Today</span>
                    </div>
                  </div>

                  {/* Amenities / Key features */}
                  <div className="flex flex-wrap gap-1.5 mb-4 text-[10px] text-slate-300">
                    {bus.amenities.slice(0, 3).map((amenity, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Seat urgency status */}
                  <div className="flex items-center justify-between text-xs mb-4">
                    <span className="text-slate-400">Seats Available:</span>
                    <span className={`font-mono font-bold ${isFewSeats ? 'text-amber-400' : 'text-amber-400'}`}>
                      {bus.availableSeats} of {bus.totalSeats} seats left
                    </span>
                  </div>
                </div>

                {/* DUAL ACTION BUTTONS (As requested: Online Booking + WhatsApp Route Check) */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                  {/* WhatsApp Check Button */}
                  <button
                    type="button"
                    onClick={() => handleWhatsAppInquiry(bus)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 text-xs font-bold transition-colors cursor-pointer"
                    title="Inquire about this bus on WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-amber-400" />
                    <span>WhatsApp</span>
                  </button>

                  {/* Select Seats Online */}
                  <button
                    type="button"
                    onClick={() => onSelectBusToBook(bus)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10 transition-all cursor-pointer"
                  >
                    <span>Select Seat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
