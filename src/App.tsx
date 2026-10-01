import {
  useState
} from 'react';
import {
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { NextBusesBoard } from './components/NextBusesBoard';
import { RoutesDirectory } from './components/RoutesDirectory';
import { FleetAndSafety } from './components/FleetAndSafety';
import { OfficeContacts } from './components/OfficeContacts';
import { Footer } from './components/Footer';
import { WhatsAppAddOn } from './components/WhatsAppAddOn';
import { SeatBookingModal } from './components/SeatBookingModal';
import { TicketModal } from './components/TicketModal';
import { ManageTicketModal } from './components/ManageTicketModal';

import { 
  SAMPLE_SCHEDULES, 
  BusSchedule, 
  BookingTicket, 
  DEMO_TICKETS, 
  DEFAULT_WHATSAPP_NUMBER, 
  buildWhatsAppLink 
} from './data/dreamlineData';

export default function App() {
  // Navigation / Modals state
  const [isWhatsAppHubOpen, setIsWhatsAppHubOpen] = useState(false);
  const [whatsAppInitialMsg, setWhatsAppInitialMsg] = useState<string | undefined>(undefined);
  const [selectedRouteForWhatsApp, setSelectedRouteForWhatsApp] = useState<{ from: string; to: string } | undefined>(undefined);
  
  const [isManageTicketOpen, setIsManageTicketOpen] = useState(false);
  const [activeTicketToView, setActiveTicketToView] = useState<BookingTicket | null>(null);
  
  // Booking flow state
  const [selectedBusForBooking, setSelectedBusForBooking] = useState<BusSchedule | null>(null);

  // Tickets stored in state
  const [allTickets, setAllTickets] = useState<BookingTicket[]>(DEMO_TICKETS);

  // Search Results State
  const [searchParams, setSearchParams] = useState<{
    origin: string;
    destination: string;
    date: string;
    passengers: number;
  } | null>(null);

  const [activeTabFilter, setActiveTabFilter] = useState<'All' | 'Morning' | 'Afternoon' | 'Night'>('All');

  // Handle Search Submission from Hero
  const handleHeroSearch = (params: { origin: string; destination: string; date: string; passengers: number }) => {
    setSearchParams(params);
    const searchSection = document.getElementById('search-results');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered schedules for search
  const displayedSchedules = SAMPLE_SCHEDULES.filter((bus) => {
    if (!searchParams) return true;
    const matchesOrigin = bus.origin.toLowerCase() === searchParams.origin.toLowerCase();
    const matchesDest = bus.destination.toLowerCase() === searchParams.destination.toLowerCase();
    return matchesOrigin && matchesDest;
  });

  // Fallback if specific pair has no direct schedule in sample data
  const fallbackSchedules = SAMPLE_SCHEDULES.slice(0, 4);
  const schedulesToRender = displayedSchedules.length > 0 ? displayedSchedules : fallbackSchedules;

  const handleOpenWhatsAppWithCustomMsg = (msg?: string) => {
    setWhatsAppInitialMsg(msg);
    setIsWhatsAppHubOpen(true);
  };

  const handleQuickRouteSelect = (from: string, to: string) => {
    setSearchParams({
      origin: from,
      destination: to,
      date: '2026-10-02',
      passengers: 1
    });
    setSelectedRouteForWhatsApp({ from, to });
    const section = document.getElementById('search-results');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. TOP NAVBAR */}
      <Navbar
        onOpenManageTicket={() => setIsManageTicketOpen(true)}
        onOpenWhatsAppHub={handleOpenWhatsAppWithCustomMsg}
        onNavigateSection={handleNavigateSection}
      />

      <main className="flex-1">
        
        {/* 2. HERO SECTION WITH SEARCH ENGINE & WHATSAPP SHORTCUTS */}
        <div id="hero">
          <HeroSection
            onSearch={handleHeroSearch}
            onOpenWhatsAppHub={handleOpenWhatsAppWithCustomMsg}
            onSelectRouteQuick={handleQuickRouteSelect}
          />
        </div>

        {/* 3. SEARCH RESULTS & AVAILABLE COACHES BOARD */}
        <section id="search-results" className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-slate-900">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-amber-400 font-mono">
                    {searchParams ? `${searchParams.origin} to ${searchParams.destination}` : 'Top Scheduled Luxury Coaches'}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-300">
                    {displayedSchedules.length > 0 ? `${displayedSchedules.length} departures found` : 'Showing available express coaches'}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-['Outfit'] text-white mt-0.5">
                  Select Departure Time & Reserve Seats
                </h3>
              </div>

              {/* Direct WhatsApp quote for current search */}
              <button
                type="button"
                onClick={() => {
                  const o = searchParams?.origin || 'Nairobi';
                  const d = searchParams?.destination || 'Mombasa';
                  const msg = `Habari Dreamline! What are the available buses from ${o} to ${d} today? Please share times and seat prices.`;
                  const link = buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, msg);
                  window.open(link, '_blank', 'noopener,noreferrer');
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/40 text-xs font-bold transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-amber-400" />
                <span>Ask Availability on WhatsApp</span>
              </button>
            </div>

            {/* Coaches List */}
            <div className="space-y-4">
              {schedulesToRender.map((bus) => (
                <div
                  key={bus.id}
                  className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group shadow-md"
                >
                  {/* Left: Coach Details & Times */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded">
                        {bus.busNumber}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold font-['Outfit'] text-white">
                        {bus.coachName}
                      </h4>
                      <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {bus.coachType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-400">Departure</span>
                        <div className="text-lg font-extrabold text-white font-mono">{bus.departureTime}</div>
                        <div className="text-xs text-amber-300 font-semibold">{bus.origin}</div>
                      </div>

                      <div className="hidden sm:flex flex-col items-center px-4">
                        <span className="text-[10px] text-slate-400 font-mono">{bus.duration}</span>
                        <div className="w-24 h-0.5 bg-slate-700 relative my-1">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400"></div>
                        </div>
                        <span className="text-[10px] text-amber-400 font-mono">Express Transit</span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-400">Arrival</span>
                        <div className="text-lg font-extrabold text-white font-mono">{bus.arrivalTime}</div>
                        <div className="text-xs text-amber-300 font-semibold">{bus.destination}</div>
                      </div>

                      <div className="space-y-0.5 pl-4 border-l border-slate-800">
                        <span className="text-xs text-slate-400">Pickup Stage</span>
                        <div className="text-xs text-slate-200 font-medium max-w-[200px] truncate">
                          {bus.pickupPoints[0]}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-400">
                      {bus.amenities.map((a, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Pricing & Actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 lg:min-w-[200px] pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-slate-400 block">Standard Fare</span>
                      <span className="text-2xl font-black text-amber-400 font-mono">
                        KSh {bus.regularPrice.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        VIP Recliner: KSh {bus.vipPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* WhatsApp Enquiry for this specific bus */}
                      <button
                        type="button"
                        onClick={() => {
                          const msg = `Habari Dreamline! Please confirm availability for the ${bus.departureTime} departure (${bus.coachName} - ${bus.busNumber}) from ${bus.origin} to ${bus.destination}. What seats are free?`;
                          const link = buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, msg);
                          window.open(link, '_blank', 'noopener,noreferrer');
                        }}
                        className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/40 transition-colors cursor-pointer"
                        title="Inquire this bus on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4 fill-amber-400" />
                      </button>

                      {/* Select Seats Online */}
                      <button
                        type="button"
                        onClick={() => setSelectedBusForBooking(bus)}
                        className="py-2.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Select Seat</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. NEXT AVAILABLE BUSES LIVE BOARD (Highlight Feature) */}
        <NextBusesBoard
          schedules={SAMPLE_SCHEDULES}
          onSelectBusToBook={(bus) => setSelectedBusForBooking(bus)}
          onOpenWhatsAppHub={handleOpenWhatsAppWithCustomMsg}
        />

        {/* 5. ALL ROUTES & FARES DIRECTORY */}
        <RoutesDirectory
          onSelectRoute={handleQuickRouteSelect}
          onOpenWhatsAppHub={handleOpenWhatsAppWithCustomMsg}
        />

        {/* 6. VIP FLEET & SAFETY FIRST PROTOCOL */}
        <FleetAndSafety
          onOpenWhatsAppHub={handleOpenWhatsAppWithCustomMsg}
        />

        {/* 7. PHYSICAL BOOKING TERMINALS & OFFICES */}
        <OfficeContacts />

      </main>

      {/* 8. FOOTER */}
      <Footer
        onOpenManageTicket={() => setIsManageTicketOpen(true)}
        onOpenWhatsAppHub={handleOpenWhatsAppWithCustomMsg}
        onNavigateSection={handleNavigateSection}
      />

      {/* 9. THE CORE WHATSAPP ADD-ON (Floating Button & Expandable Hub) */}
      <WhatsAppAddOn
        isOpen={isWhatsAppHubOpen}
        onOpen={() => setIsWhatsAppHubOpen(true)}
        onClose={() => setIsWhatsAppHubOpen(false)}
        initialMessage={whatsAppInitialMsg}
        selectedRoute={selectedRouteForWhatsApp}
      />

      {/* 10. MODALS */}
      {/* A. Coach Seat Booking Modal — hands off to WhatsApp for confirmation */}
      {selectedBusForBooking && (
        <SeatBookingModal
          bus={selectedBusForBooking}
          onClose={() => setSelectedBusForBooking(null)}
        />
      )}

      {/* C. Official e-Ticket & Boarding Pass View */}
      {activeTicketToView && (
        <TicketModal
          ticket={activeTicketToView}
          onClose={() => setActiveTicketToView(null)}
        />
      )}

      {/* D. Manage / Retrieve Existing Ticket Modal */}
      <ManageTicketModal
        isOpen={isManageTicketOpen}
        onClose={() => setIsManageTicketOpen(false)}
        allTickets={allTickets}
        onViewTicket={(ticket) => setActiveTicketToView(ticket)}
      />

    </div>
  );
}
