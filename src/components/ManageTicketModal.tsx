import React, { useState } from 'react';
import { useModalA11y } from '../hooks/useModalA11y';
import { 
  X, 
  Search, 
  Ticket as TicketIcon, 
  Calendar, 
  MapPin, 
  MessageSquare, 
  Printer, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { BookingTicket, DEMO_TICKETS, DEFAULT_WHATSAPP_NUMBER, DISPLAY_WHATSAPP_NUMBER, buildWhatsAppLink } from '../data/dreamlineData';

interface ManageTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTickets: BookingTicket[];
  onViewTicket: (ticket: BookingTicket) => void;
}

export const ManageTicketModal: React.FC<ManageTicketModalProps> = ({
  isOpen,
  onClose,
  allTickets,
  onViewTicket
}) => {
  // NOTE: this modal is always mounted and toggled via `isOpen`. The guard must
  // come *after* the hooks, otherwise opening it changes the hook count between
  // renders and React throws "Rendered more hooks than during the previous render".
  const dialogRef = useModalA11y<HTMLDivElement>(isOpen, onClose);

  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundTicket, setFoundTicket] = useState<BookingTicket | null>(null);

  const handleSearch = (searchTerm?: string) => {
    const q = (searchTerm !== undefined ? searchTerm : query).trim().toLowerCase();
    if (!q) return;

    setSearched(true);
    const combined = [...allTickets, ...DEMO_TICKETS];
    const match = combined.find(
      t => t.bookingRef.toLowerCase() === q ||
           t.passengerPhone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, '')) ||
           t.idNumber.toLowerCase() === q
    );
    setFoundTicket(match || null);
  };

  const handleWhatsAppAssistance = (ticket: BookingTicket) => {
    const msg = `Habari Dreamline Team! I have a question regarding my booking: ${ticket.bookingRef} (${ticket.passengerName}) from ${ticket.origin} to ${ticket.destination} on ${ticket.departureDate} at ${ticket.departureTime}. Could you please assist me with seat change / boarding info?`;
    const link = buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, msg);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-ticket-title"
        tabIndex={-1}
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full text-white shadow-2xl overflow-hidden my-auto animate-in fade-in duration-200"
      >
        
        {/* Header */}
        <div className="p-5 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <TicketIcon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 id="manage-ticket-title" className="font-bold text-base text-white font-['Lato']">
                Manage & Retrieve Tickets
              </h3>
              <p className="text-xs text-slate-400">
                Print boarding pass, review trip, or request changes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input form */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Enter Booking Reference (e.g. DL-89204-KE) or Phone Number:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={`e.g. DL-89204-KE or ${DISPLAY_WHATSAPP_NUMBER}`}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSearch()}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>

            {/* Quick Demo Test Buttons */}
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <span>Try sample ticket:</span>
              <button
                type="button"
                onClick={() => {
                  setQuery('DL-89204-KE');
                  handleSearch('DL-89204-KE');
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-mono cursor-pointer"
              >
                DL-89204-KE (NBO-MSA)
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuery('DL-55192-KE');
                  handleSearch('DL-55192-KE');
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-mono cursor-pointer"
              >
                DL-55192-KE (NBO-KSM)
              </button>
            </div>
          </div>

          {/* Search Result */}
          {searched && (
            <div className="pt-2">
              {foundTicket ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-amber-400">
                        {foundTicket.bookingRef}
                      </span>
                      <h4 className="text-base font-bold text-white font-['Lato'] mt-0.5">
                        {foundTicket.origin} → {foundTicket.destination}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {foundTicket.coachName} • Departure: {foundTicket.departureTime} ({foundTicket.departureDate})
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                      {foundTicket.paymentStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Passenger</span>
                      <span className="font-semibold text-white truncate block">{foundTicket.passengerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Seats</span>
                      <span className="font-mono font-bold text-amber-400 block">{foundTicket.seats.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Pickup Stage</span>
                      <span className="text-slate-300 truncate block">{foundTicket.pickupPoint}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">M-Pesa Receipt</span>
                      <span className="font-mono text-emerald-400 block">{foundTicket.mpesaReceiptNo || 'PAID'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppAssistance(foundTicket)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-semibold cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-emerald-400" />
                      <span>WhatsApp Desk</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onViewTicket(foundTicket);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View & Print</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 text-xs">
                  <AlertCircle className="w-7 h-7 text-amber-400 mx-auto" />
                  <p className="font-semibold text-white">No booking record found for "{query}"</p>
                  <p className="text-slate-400 text-[11px]">
                    Please verify your reference number or contact our WhatsApp support team for manual verification.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
