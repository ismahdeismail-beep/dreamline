import React, { useState } from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { NextBusesBoard } from './components/NextBusesBoard';
import { RoutesDirectory } from './components/RoutesDirectory';
import { FleetAndSafety } from './components/FleetAndSafety';
import { OfficeContacts } from './components/OfficeContacts';
import { Footer } from './components/Footer';
import { WhatsAppAddOn } from './components/WhatsAppAddOn';
import { SeatBookingModal } from './components/SeatBookingModal';
import { MpesaModal } from './components/MpesaModal';
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
  const [pendingMpesaData, setPendingMpesaData] = useState<{
    bus: BusSchedule;
    seats: string[];
    passengerName: string;
    passengerPhone: string;
    passengerEmail: string;
    idNumber: string;
    pickupPoint: string;
    dropoffPoint: string;
    totalAmount: number;
  } | null>(null);

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

  const handleProceedToMpesa = (bookingData: typeof pendingMpesaData) => {
    setSelectedBusForBooking(null);
    setPendingMpesaData(bookingData);
  };

  const handlePaymentSuccess = (receiptData: {
    bookingRef: string;
    mpesaReceipt: string;
    paidAt: string;
  }) => {
    if (!pendingMpesaData) return;

    const newTicket: BookingTicket = {
      ticketId: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
      bookingRef: receiptData.bookingRef,
      busScheduleId: pendingMpesaData.bus.id,
      coachName: pendingMpesaData.bus.coachName,
      busNumber: pendingMpesaData.bus.busNumber,
      coachType: pendingMpesaData.bus.coachType,
      origin: pendingMpesaData.bus.origin,
      destination: pendingMpesaData.bus.destination,
      departureDate: pendingMpesaData.bus.departureDate,
      departureTime: pendingMpesaData.bus.departureTime,
      arrivalTime: pendingMpesaData.bus.arrivalTime,
      pickupPoint: pendingMpesaData.pickupPoint,
      dropoffPoint: pendingMpesaData.dropoffPoint,
      seats: pendingMpesaData.seats,
      passengerName: pendingMpesaData.passengerName,
      passengerPhone: pendingMpesaData.passengerPhone,
      passengerEmail: pendingMpesaData.passengerEmail,
      idNumber: pendingMpesaData.idNumber,
      totalAmount: pendingMpesaData.totalAmount,
      paymentMethod: 'M-PESA',
      paymentStatus: 'PAID',
      mpesaReceiptNo: receiptData.mpesaReceipt,
      bookedAt: `${new Date().toLocaleDateString()} ${receiptData.paidAt}`
    };

    setAllTickets([newTicket, ...allTickets]);
    setPendingMpesaData(null);
    setActiveTicketToView(newTicket);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f8fc] text-slate-900 flex flex-col font-sans">
      
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
        <section id="search-results" className="py-14 px-4 sm:px-6 lg:px-8 bg-[#f9f8fc] border-t border-slate-200">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-[#34398e]">
                    {searchParams ? `${searchParams.origin} to ${searchParams.destination}` : 'Top scheduled coaches'}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs text-slate-500">
                    {displayedSchedules.length > 0 ? `${displayedSchedules.length} departures` : 'Express coaches available'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Select time & reserve seats
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
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-600 text-xs font-bold transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask on WhatsApp</span>
              </button>
            </div>

            {/* Coaches List */}
            <div className="space-y-4">
              {schedulesToRender.map((bus) => (
                <div
                  key={bus.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#34398e]/40 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group shadow-sm"
                >
                  {/* Left: Coach Details & Times */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#34398e] bg-[#34398e]/10 px-2.5 py-0.5 rounded">
                        {bus.busNumber}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">
                        {bus.coachName}
                      </h4>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {bus.coachType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-500">Departure</span>
                        <div className="text-lg font-extrabold text-slate-900">{bus.departureTime}</div>
                        <div className="text-xs text-[#34398e] font-semibold">{bus.origin}</div>
                      </div>

                      <div className="hidden sm:flex flex-col items-center px-4">
                        <span className="text-[10px] text-slate-500">{bus.duration}</span>
                        <div className="w-24 h-0.5 bg-slate-200 relative my-1">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#34398e]"></div>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold">Direct</span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-500">Arrival</span>
                        <div className="text-lg font-extrabold text-slate-900">{bus.arrivalTime}</div>
                        <div className="text-xs text-[#34398e] font-semibold">{bus.destination}</div>
                      </div>

                      <div className="space-y-0.5 pl-4 border-l border-slate-200">
                        <span className="text-xs text-slate-500">Pickup</span>
                        <div className="text-xs text-slate-700 font-medium max-w-[200px] truncate">
                          {bus.pickupPoints[0]}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
                      {bus.amenities.map((a, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#f9f8fc] rounded border border-slate-200">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Pricing & Actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 lg:min-w-[200px] pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:pl-6 border-slate-200">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-slate-500 block">Standard</span>
                      <span className="text-2xl font-black text-[#34398e]">
                        KSh {bus.regularPrice.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        VIP: KSh {bus.vipPrice.toLocaleString()}
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
                        className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-600 transition-colors cursor-pointer"
                        title="Inquire this bus on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      {/* Select Seats Online */}
                      <button
                        type="button"
                        onClick={() => setSelectedBusForBooking(bus)}
                        className="py-2.5 px-5 rounded-xl bg-[#e52421] hover:bg-[#c11e1c] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
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
      {/* A. Coach Seat Booking Modal */}
      {selectedBusForBooking && (
        <SeatBookingModal
          bus={selectedBusForBooking}
          onClose={() => setSelectedBusForBooking(null)}
          onProceedToMpesa={handleProceedToMpesa}
        />
      )}

      {/* B. M-PESA STK Push Checkout Modal */}
      {pendingMpesaData && (
        <MpesaModal
          bookingData={pendingMpesaData}
          onClose={() => setPendingMpesaData(null)}
          onPaymentSuccess={handlePaymentSuccess}
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
