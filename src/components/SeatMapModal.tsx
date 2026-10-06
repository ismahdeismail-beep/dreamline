import React, { useState } from 'react';
import { useModalA11y } from '../hooks/useModalA11y';
import { X, Bus, Info, Armchair, Check } from 'lucide-react';
import {
  BusSchedule,
  bookedSeatsFor,
  seatRowsFor,
} from '../data/dreamlineData';

interface SeatMapModalProps {
  // Non-nullable: App renders this component only from a booking that has a bus.
  bus: BusSchedule;
  /** Seats already sold on this departure, plus any held by local tickets. */
  extraBookedSeats?: string[];
  /** Seats the passenger has picked so far in the booking form. */
  selectedSeats: string[];
  onApply: (seats: string[]) => void;
  onClose: () => void;
}

const MAX_SEATS = 4;

/**
 * Interactive seat map for one departure.
 *
 * Occupancy comes from `bookedSeatsFor()` — the same inventory the board's
 * "seats left" counter and the booking form read — so a seat that is sold here
 * is unavailable everywhere else. The dialog only picks seats; passenger details
 * stay on the booking page so there is one form to fill in, not two.
 */
export const SeatMapModal: React.FC<SeatMapModalProps> = ({
  bus,
  extraBookedSeats,
  selectedSeats,
  onApply,
  onClose,
}) => {
  const [selection, setSelection] = useState<string[]>(selectedSeats);
  const [errorMsg, setErrorMsg] = useState('');

  // Mounted only while the map is open, so it is always "open".
  const dialogRef = useModalA11y<HTMLDivElement>(true, onClose);

  const booked = bookedSeatsFor(bus, extraBookedSeats);
  const rows = seatRowsFor(bus);
  const freeCount = bus.totalSeats - booked.size;
  const isVipCoach = bus.coachType.includes('VIP');
  const seatPrice = isVipCoach ? bus.vipPrice : bus.regularPrice;
  const billableSeats = Math.max(selection.length, 1);
  const totalAmount = billableSeats * seatPrice;

  const handleSeatClick = (seatCode: string) => {
    if (booked.has(seatCode)) return;
    setErrorMsg('');
    if (selection.includes(seatCode)) {
      setSelection(selection.filter((seat) => seat !== seatCode));
      return;
    }
    if (selection.length >= MAX_SEATS) {
      setErrorMsg(`Maximum ${MAX_SEATS} seats per booking.`);
      return;
    }
    setSelection([...selection, seatCode]);
  };

  const seatButton = (seatCode: string) => {
    const isBooked = booked.has(seatCode);
    const isSelected = selection.includes(seatCode);
    return (
      <button
        key={seatCode}
        type="button"
        disabled={isBooked}
        aria-pressed={isSelected}
        aria-label={
          isBooked
            ? `Seat ${seatCode}, occupied`
            : `Seat ${seatCode}, ${isSelected ? 'selected' : 'available'}`
        }
        onClick={() => handleSeatClick(seatCode)}
        className={`w-9 h-9 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center ${
          isBooked
            ? 'bg-white/5 text-white/25 cursor-not-allowed border border-white/10'
            : isSelected
            ? 'bg-white text-[#34398e] shadow-md shadow-black/25 scale-105 font-extrabold cursor-pointer'
            : 'bg-white/25 hover:bg-white/40 text-white border border-white/60 cursor-pointer'
        }`}
      >
        {isBooked ? '✕' : seatCode}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="seat-map-title"
        tabIndex={-1}
        className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full text-slate-900 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:px-6 bg-[#f9f8fc] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#34398e]/10 text-[#34398e] flex items-center justify-center">
              <Bus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="seat-map-title" className="text-base sm:text-lg font-bold text-slate-900">
                  {bus.coachName}
                </h3>
                <span className="text-xs font-bold bg-[#34398e]/10 text-[#34398e] px-2 py-0.5 rounded">
                  {bus.busNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {bus.origin} → {bus.destination} • {bus.departureTime} ({bus.departureDate})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close seat map"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: the map scrolls, the summary stays pinned */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <div className="bg-gradient-to-b from-[#34398e] to-[#24285f] border border-[#34398e] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                Interactive Coach Seat Map
              </span>
              <span className="text-xs text-white/70 font-medium">
                {isVipCoach ? 'VIP 2x1 Recliner Layout' : 'Executive 2x2 Layout'}
              </span>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-around p-2.5 bg-white/5 rounded-xl border border-white/15 text-[11px] mb-5">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-white/25 border border-white/60"></div>
                <span className="text-slate-400">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-white border border-white"></div>
                <span className="text-white font-medium">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[9px]">
                  ✕
                </div>
                <span className="text-slate-500">Occupied</span>
              </div>
            </div>

            {/* Coach Floor Boundary */}
            <div className="relative border-2 border-dashed border-white/15 rounded-2xl p-4 bg-slate-900/60 max-w-[320px] mx-auto">
              {/* Windshield & Driver Section (Kenyan RHD: Steering Wheel on Right) */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/15">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Entrance Door
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-white bg-black/35 px-2.5 py-1 rounded-md">
                  <span>Driver Cabin</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-white inline-block"></span>
                </div>
              </div>

              {/* Seat Rows Grid — sized to this coach's real capacity */}
              <div className="space-y-2">
                {rows.map((row) => (
                  <div key={row.row} className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">{row.left.map(seatButton)}</div>

                    {/* Aisle */}
                    <div className="w-7 text-center text-[10px] text-slate-600 font-mono">
                      {row.row}
                    </div>

                    <div className="flex items-center gap-1.5">{row.right.map(seatButton)}</div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-3 text-[10px] text-slate-500 uppercase tracking-widest">
                Back of Coach
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer: availability + fare + confirm */}
        <div className="p-5 sm:px-6 border-t border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">
              {freeCount} of {bus.totalSeats} seats still free
            </span>
            <span className="font-mono font-bold text-slate-900">
              {selection.length > 0 ? selection.join(', ') : 'None selected'}
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">
              {billableSeats} seat(s) × KSh {seatPrice.toLocaleString()}
            </span>
            <span className="text-base font-extrabold text-[#34398e] font-mono">
              KSh {totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setSelection([]);
                setErrorMsg('');
              }}
              className="px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:border-[#34398e] hover:text-[#34398e] transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => onApply(selection)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#34398e] hover:bg-[#2a2f78] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {selection.length > 0
                ? `Use ${selection.length} seat${selection.length > 1 ? 's' : ''}`
                : 'Skip — let the desk assign a seat'}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Armchair className="w-3.5 h-3.5 shrink-0" />
            Occupied seats cannot be selected. Availability updates from tickets booked
            on this device.
          </p>
        </div>
      </div>
    </div>
  );
};
