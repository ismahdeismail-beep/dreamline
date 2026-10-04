import React, { useState } from 'react';
import { useModalA11y } from '../hooks/useModalA11y';
import {
  X,
  Bus,
  MapPin,
  User,
  Phone,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Info,
  Armchair,
  ChevronDown,
} from 'lucide-react';
import { 
  BusSchedule, 
  DEFAULT_WHATSAPP_NUMBER, 
  buildWhatsAppLink 
} from '../data/dreamlineData';

interface SeatBookingModalProps {
  // Non-nullable: App renders this component only when a bus is selected.
  // Typing it as nullable previously forced a `if (!bus) return null` guard that
  // sat before the hooks and made the hook count change between renders.
  bus: BusSchedule;
  onClose: () => void;
  onProceedToMpesa: (bookingData: {
    bus: BusSchedule;
    seats: string[];
    passengerName: string;
    passengerPhone: string;
    passengerEmail: string;
    idNumber: string;
    pickupPoint: string;
    dropoffPoint: string;
    totalAmount: number;
  }) => void;
}

export const SeatBookingModal: React.FC<SeatBookingModalProps> = ({
  bus,
  onClose,
  onProceedToMpesa
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [pickupPoint, setPickupPoint] = useState(bus.pickupPoints[0] || 'Main Terminal');
  const [dropoffPoint, setDropoffPoint] = useState(bus.dropoffPoints[0] || 'Main Stage');
  const [errorMsg, setErrorMsg] = useState('');
  // Seat selection is optional; keep the (tall) seat map collapsed on phones.
  const [seatsOpen, setSeatsOpen] = useState(false);

  // This modal is mounted only while a bus is selected, so it is always "open".
  const dialogRef = useModalA11y<HTMLDivElement>(true, onClose);

  // Fixed simulated booked seats for realistic realism
  const bookedSeatNumbers = new Set(['1B', '2A', '4A', '4B', '6C', '7A', '8B', '9C']);

  const isVipCoach = bus.coachType.includes('VIP');
  const seatPrice = isVipCoach ? bus.vipPrice : bus.regularPrice;
  // Seat choice is optional: with none selected we quote one seat and the desk
  // assigns it on confirmation, so nobody is blocked from booking.
  const billableSeats = Math.max(selectedSeats.length, 1);
  const totalAmount = billableSeats * seatPrice;

  // Generate seat rows (e.g. 10 rows)
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleSeatClick = (seatCode: string) => {
    if (bookedSeatNumbers.has(seatCode)) return;
    setErrorMsg('');

    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatCode));
    } else {
      if (selectedSeats.length >= 4) {
        setErrorMsg('Maximum 4 seats can be selected per transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };

  const validateInputs = () => {
    // Only the two fields the desk genuinely needs are mandatory. Everything
    // else (seat choice, ID, email) is optional so the form works for everyone.
    if (!passengerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return false;
    }
    if (!passengerPhone.trim() || passengerPhone.replace(/\s/g, '').length < 9) {
      setErrorMsg('Please enter a valid phone number, e.g. 0712 345 678.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleMpesaClick = () => {
    if (!validateInputs()) return;
    onProceedToMpesa({
      bus,
      seats: selectedSeats,
      passengerName,
      passengerPhone,
      passengerEmail: '',
      idNumber,
      pickupPoint,
      dropoffPoint,
      totalAmount
    });
  };

  const handleWhatsAppBookingDesk = () => {
    if (!validateInputs()) return;
    const seatStr = selectedSeats.length ? selectedSeats.join(', ') : 'any available seat';
    const msg = `Habari Dreamline! I would like to reserve ${billableSeats} seat(s) [${seatStr}] on ${bus.coachName} (${bus.busNumber}) from ${bus.origin} to ${bus.destination} on ${bus.departureDate} at ${bus.departureTime}. Passenger: ${passengerName} (Phone: ${passengerPhone}). Total: KSh ${totalAmount.toLocaleString()}. Please reserve and advise payment.`;
    const link = buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, msg);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="seat-booking-title"
        tabIndex={-1}
        className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full text-slate-900 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >

        {/* Modal Top Header */}
        <div className="p-5 sm:px-7 bg-[#f9f8fc] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#34398e]/10 text-[#34398e] flex items-center justify-center">
              <Bus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="seat-booking-title" className="text-base sm:text-lg font-bold text-slate-900">
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
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split 2 columns (Left: Interactive Bus Layout, Right: Passenger & Boarding details) */}
        <div className="p-5 sm:p-7 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          
          {/* Seats are optional, so on small screens the seat map stays collapsed by
              default — otherwise it alone is taller than the whole modal and the
              user must scroll ~850px just to reach the form. Always shown on lg+. */}
            <button
              type="button"
              onClick={() => setSeatsOpen(o => !o)}
              aria-expanded={seatsOpen}
              className="lg:hidden w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#34398e]/5 border border-[#34398e]/15 text-left cursor-pointer"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-[#34398e]">
                <Armchair className="w-4 h-4" />
                {seatsOpen ? 'Hide seat map' : 'Choose seats (optional)'}
              </span>
              <span className="text-xs font-semibold text-[#34398e]/70 flex items-center gap-1">
                {selectedSeats.length > 0 ? `${selectedSeats.length} selected` : seatsOpen ? 'Tap a seat' : 'Skip'}
                <ChevronDown className={`w-4 h-4 transition-transform ${seatsOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {/* LEFT: COACH SEAT MAP (Lg: col-span-6) */}
          <div className={`${seatsOpen ? 'flex' : 'hidden'} lg:flex lg:col-span-6 bg-gradient-to-b from-[#34398e] to-[#24285f] border border-[#34398e] rounded-2xl p-4 sm:p-5 flex-col justify-between`}>
            <div>
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

                {/* Seat Rows Grid */}
                <div className="space-y-2">
                  {rows.map((rowNum) => {
                    const seatA = `${rowNum}A`;
                    const seatB = `${rowNum}B`;
                    const seatC = `${rowNum}C`;

                    return (
                      <div key={rowNum} className="flex items-center justify-between gap-1">
                        {/* Left Side (VIP Single Recliner 1A or Executive 2 seats) */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={bookedSeatNumbers.has(seatA)}
                            onClick={() => handleSeatClick(seatA)}
                            className={`w-9 h-9 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center cursor-pointer ${
                              bookedSeatNumbers.has(seatA)
                                ? 'bg-white/5 text-white/25 cursor-not-allowed border border-white/10'
                                : selectedSeats.includes(seatA)
                                ? 'bg-white text-[#34398e] shadow-md shadow-black/25 scale-105 font-extrabold'
                                : 'bg-white/25 hover:bg-white/40 text-white border border-white/60'
                            }`}
                          >
                            {bookedSeatNumbers.has(seatA) ? '✕' : seatA}
                          </button>
                        </div>

                        {/* Aisle */}
                        <div className="w-7 text-center text-[10px] text-slate-600 font-mono">
                          {rowNum}
                        </div>

                        {/* Right Side (Seats B & C) */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={bookedSeatNumbers.has(seatB)}
                            onClick={() => handleSeatClick(seatB)}
                            className={`w-9 h-9 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center cursor-pointer ${
                              bookedSeatNumbers.has(seatB)
                                ? 'bg-white/5 text-white/25 cursor-not-allowed border border-white/10'
                                : selectedSeats.includes(seatB)
                                ? 'bg-white text-[#34398e] shadow-md shadow-black/25 scale-105 font-extrabold'
                                : 'bg-white/25 hover:bg-white/40 text-white border border-white/60'
                            }`}
                          >
                            {bookedSeatNumbers.has(seatB) ? '✕' : seatB}
                          </button>

                          <button
                            type="button"
                            disabled={bookedSeatNumbers.has(seatC)}
                            onClick={() => handleSeatClick(seatC)}
                            className={`w-9 h-9 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center cursor-pointer ${
                              bookedSeatNumbers.has(seatC)
                                ? 'bg-white/5 text-white/25 cursor-not-allowed border border-white/10'
                                : selectedSeats.includes(seatC)
                                ? 'bg-white text-[#34398e] shadow-md shadow-black/25 scale-105 font-extrabold'
                                : 'bg-white/25 hover:bg-white/40 text-white border border-white/60'
                            }`}
                          >
                            {bookedSeatNumbers.has(seatC) ? '✕' : seatC}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center pt-3 text-[10px] text-slate-500 uppercase tracking-widest">
                  Back of Coach
                </div>
              </div>
            </div>

            {/* Selected seats tag list */}
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
              <span className="text-slate-400">Chosen Seats:</span>
              <span className="font-mono font-bold text-white">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
              </span>
            </div>
          </div>

          {/* RIGHT: PASSENGER DETAILS & BOARDING (Lg: col-span-6) */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Boarding & Dropping Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                    Pickup Terminal
                  </label>
                  <select
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#34398e] focus:ring-2 focus:ring-[#34398e]/15"
                  >
                    {bus.pickupPoints.map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                    Dropoff Terminal
                  </label>
                  <select
                    value={dropoffPoint}
                    onChange={(e) => setDropoffPoint(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#34398e] focus:ring-2 focus:ring-[#34398e]/15"
                  >
                    {bus.dropoffPoints.map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Passenger Inputs */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-white" />
                    Full name
                  </label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="e.g. Kennedy Mwangi Otieno"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#34398e] focus:ring-2 focus:ring-[#34398e]/15"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      Phone number
                    </label>
                    <input
                      type="tel"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      placeholder="0712 345 678"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#34398e] focus:ring-2 focus:ring-[#34398e]/15 font-mono"
                    />
                  </div>
                </div>

                {/* National ID / Passport and Email are intentionally not asked
                    for. Bookings are confirmed on WhatsApp; we only need enough
                    to identify and reach the passenger. */}
              </div>

              {/* Price Calculation Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Fare ({billableSeats} seat(s) × KSh {seatPrice.toLocaleString()})</span>
                  <span className="font-mono">KSh {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Passenger Service Charge & VAT</span>
                  <span className="font-mono text-emerald-600">Included (KES 0.00)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Total Payable</span>
                  <span className="text-xl font-extrabold text-[#34398e] font-mono">
                    KSh {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* DUAL CHECKOUT OPTIONS */}
            <div className="pt-4 space-y-2.5">
              {/* Primary: reserve on WhatsApp — the desk confirms and takes payment */}
              <button
                type="button"
                onClick={handleWhatsAppBookingDesk}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Reserve {billableSeats} seat — send to WhatsApp</span>
              </button>

              {/* M-Pesa STK push is intentionally not offered yet.
                  Bookings are taken on WhatsApp for now; this button is
                  re-enabled once the Daraja STK integration goes live. */}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
