import React from 'react';
import {
  X,
  Printer,
  MessageSquare,
  CheckCircle2,
  Bus,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { BookingTicket, DEFAULT_WHATSAPP_NUMBER, buildWhatsAppLink } from '../data/dreamlineData';

interface TicketModalProps {
  ticket: BookingTicket | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ ticket, onClose }) => {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const msg = `*DREAMLINE BUS KENYA - OFFICIAL E-TICKET*\n\nBooking Ref: ${ticket.bookingRef}\nPassenger: ${ticket.passengerName}\nCoach: ${ticket.coachName} (${ticket.busNumber})\nRoute: ${ticket.origin} -> ${ticket.destination}\nDeparture: ${ticket.departureTime} (${ticket.departureDate})\nSeats: ${ticket.seats.join(', ')}\nPickup: ${ticket.pickupPoint}\nM-Pesa Code: ${ticket.mpesaReceiptNo || 'PAID'}\n\nPlease report 30 minutes before departure time. Safe travels!`;
    const link = buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, msg);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full text-white shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Header Controls (Hidden on print) */}
        <div className="p-4 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Booking Confirmed & Issued
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Slip */}
        <div id="printable-ticket" className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-slate-900 to-slate-950">
          
          {/* Ticket Header Brand */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
                <Bus className="w-6 h-6 stroke-[2.3]" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight font-['Outfit'] text-white">
                  DREAMLINE EXPRESS
                </h2>
                <p className="text-[11px] text-amber-400 font-semibold tracking-wider uppercase">
                  Official Travel Boarding Pass • Kenya
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                Booking Reference
              </span>
              <span className="text-base font-extrabold text-amber-400 font-mono tracking-wider">
                {ticket.bookingRef}
              </span>
            </div>
          </div>

          {/* Route & Schedule Showcase */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Origin Station</span>
                <span className="text-lg font-black text-white font-['Outfit']">{ticket.origin}</span>
                <span className="text-xs text-amber-300 block font-mono">{ticket.departureTime}</span>
              </div>

              <div className="flex flex-col items-center px-4">
                <span className="text-[10px] text-amber-400 font-mono font-bold">DIRECT COACH</span>
                <div className="w-20 h-0.5 bg-amber-400/40 relative my-1">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400"></div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{ticket.departureDate}</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Destination</span>
                <span className="text-lg font-black text-white font-['Outfit']">{ticket.destination}</span>
                <span className="text-xs text-amber-300 block font-mono">{ticket.arrivalTime}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Boarding Stage</span>
                <span className="text-slate-300 font-medium truncate block">{ticket.pickupPoint}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">Dropoff Stage</span>
                <span className="text-slate-300 font-medium truncate block">{ticket.dropoffPoint}</span>
              </div>
            </div>
          </div>

          {/* Passenger & Seats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-dashed border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Passenger</span>
              <span className="font-bold text-white block truncate">{ticket.passengerName}</span>
              <span className="text-slate-400 text-[10px] font-mono">ID: {ticket.idNumber}</span>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Seats Assigned</span>
              <span className="text-base font-black text-amber-400 font-mono block">
                {ticket.seats.join(', ')}
              </span>
              <span className="text-slate-400 text-[10px]">{ticket.coachType}</span>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Assigned Coach</span>
              <span className="font-bold text-white block truncate">{ticket.coachName}</span>
              <span className="text-amber-400 text-[10px] font-mono font-bold">{ticket.busNumber}</span>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Payment Status</span>
              <span className="inline-flex items-center gap-1 text-amber-400 font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {ticket.paymentStatus}
              </span>
              <span className="text-slate-400 text-[10px] block font-mono">
                M-Pesa: {ticket.mpesaReceiptNo || 'N/A'}
              </span>
            </div>
          </div>

          {/* Barcode & Security stamp representation */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>NTSA Regulated & Safety Tracked</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Please arrive at the terminal 30 minutes prior to departure. Luggage allowance: 20kg.
              </p>
            </div>

            <div className="w-20 h-20 bg-white p-1.5 rounded-xl flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-slate-950" />
            </div>
          </div>

        </div>

        {/* Footer Actions (Hidden on print) */}
        <div className="p-4 sm:px-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <button
            onClick={handleWhatsAppShare}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Send Ticket to WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
