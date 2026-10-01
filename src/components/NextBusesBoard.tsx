import React, { useState } from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import {
  BusSchedule,
  DEFAULT_WHATSAPP_NUMBER,
  buildWhatsAppLink,
  coachImageFor,
  getTimeOfDayCategory,
  TimeOfDay,
} from '../data/dreamlineData';
import { CoachPhoto } from './CoachPhoto';

interface NextBusesBoardProps {
  schedules: BusSchedule[];
  onSelectBusToBook: (bus: BusSchedule) => void;
  onOpenWhatsAppHub: (msg?: string) => void;
  /** Active hero-search / quick-route selection, surfaced in the board header. */
  searchSummary?: { origin: string; destination: string } | null;
}

const TIME_BUCKETS: Array<'All' | TimeOfDay> = ['All', 'Morning', 'Afternoon', 'Night'];

export const NextBusesBoard: React.FC<NextBusesBoardProps> = ({
  schedules,
  onSelectBusToBook,
  onOpenWhatsAppHub,
  searchSummary = null,
}) => {
  const [selectedCorridor, setSelectedCorridor] = useState<string>('All');
  const [timeBucket, setTimeBucket] = useState<'All' | TimeOfDay>('All');

  const corridors = ['All', 'Mombasa', 'Kisumu', 'Nakuru', 'Kisii', 'Busia'];

  const filtered = schedules.filter((s) => {
    if (selectedCorridor !== 'All' && s.destination !== selectedCorridor) return false;
    if (timeBucket !== 'All' && getTimeOfDayCategory(s.departureTime) !== timeBucket) return false;
    return true;
  });

  // Only offer time buckets that actually match the current corridor, so the
  // filter row never shows dead options.
  const availableBuckets = TIME_BUCKETS.filter(
    (b) =>
      b === 'All' ||
      schedules.some(
        (s) =>
          (selectedCorridor === 'All' || s.destination === selectedCorridor) &&
          getTimeOfDayCategory(s.departureTime) === b,
      ),
  );

  const resetFilters = () => {
    setSelectedCorridor('All');
    setTimeBucket('All');
  };

  const handleWhatsAppInquiry = (bus: BusSchedule) => {
    const msg = `Habari Dreamline! Seats for the ${bus.departureTime} ${bus.origin} → ${bus.destination} (${bus.coachName})?`;
    window.open(buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, msg), '_blank', 'noopener,noreferrer');
  };

  const heading = searchSummary
    ? `${searchSummary.origin} → ${searchSummary.destination}`
    : 'Next buses';
  const subheading = searchSummary
    ? `${filtered.length} ${filtered.length === 1 ? 'departure' : 'departures'} matching your search`
    : 'Pick a departure and reserve your seat.';

  return (
    <section id="next-buses" className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-emerald-600">● Live departures</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">{heading}</h2>
            <p className="text-sm text-slate-500">{subheading}</p>
          </div>
          <button
            onClick={() => onOpenWhatsAppHub('Habari! Next departures from my city?')}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer self-start"
          >
            Ask on WhatsApp →
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {corridors.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCorridor(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCorridor === c
                    ? 'bg-[#34398e] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c === 'All' ? 'All' : `→ ${c}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {availableBuckets.map((b) => (
                <button
                  key={b}
                  onClick={() => setTimeBucket(b)}
                  aria-pressed={timeBucket === b}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    timeBucket === b
                      ? 'bg-[#e52421] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
            {(selectedCorridor !== 'All' || timeBucket !== 'All') && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 px-6 bg-[#f9f8fc] border border-dashed border-slate-300 rounded-2xl">
            <p className="font-black text-slate-900">No departures match those filters</p>
            <p className="text-sm text-slate-500 mt-1">
              Try another corridor or time of day — or ask us directly and we&apos;ll find you a seat.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold cursor-pointer hover:border-[#34398e]"
              >
                Clear filters
              </button>
              <button
                onClick={() => onOpenWhatsAppHub('Habari! Do you have seats on this route?')}
                className="px-4 py-2 rounded-xl bg-white border border-emerald-600 text-emerald-700 text-xs font-bold cursor-pointer"
              >
                Ask on WhatsApp
              </button>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((bus) => {
            const few = bus.availableSeats <= 6;
            return (
              <div key={bus.id} className="bg-[#f9f8fc] border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#34398e]/40 hover:shadow-md transition-all">
                <CoachPhoto
                  coachType={bus.coachType}
                  src={bus.coachImage ?? coachImageFor(bus.coachType)}
                  alt={`${bus.coachName} — ${bus.coachType}`}
                  className="aspect-[16/9] w-full border-b border-slate-200"
                />
                <div className="p-5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#34398e]">{bus.busNumber}</span>
                      <h3 className="font-black text-base text-slate-900">{bus.coachName}</h3>
                      <span className="text-xs text-slate-500">{bus.coachType}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-[#34398e]">KSh {bus.regularPrice.toLocaleString()}</div>
                      <div className="text-[11px] text-slate-500">VIP {bus.vipPrice.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-3 bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-slate-900">{bus.departureTime}</div>
                      <div className="text-[11px] font-bold text-slate-500">{bus.origin}</div>
                    </div>
                    <div className="text-center px-2">
                      <span className="text-[10px] text-slate-400">{bus.duration}</span>
                      <div className="w-14 h-0.5 bg-slate-200 my-1 mx-auto" />
                      <span className="text-[10px] font-bold text-emerald-600">Direct</span>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-slate-900">{bus.arrivalTime}</div>
                      <div className="text-[11px] font-bold text-slate-500">{bus.destination}</div>
                    </div>
                  </div>

                  <p className={`mt-3 text-xs font-bold ${few ? 'text-[#e52421]' : 'text-emerald-600'}`}>
                    {bus.availableSeats} of {bus.totalSeats} seats left
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppInquiry(bus)}
                    className="py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-600 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectBusToBook(bus)}
                    className="py-2.5 rounded-xl bg-[#e52421] hover:bg-[#c11e1c] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    Select Seat <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};
