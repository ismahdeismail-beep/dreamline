import React, { useState } from 'react';
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

        {/* 3. COACH BOARD — single canonical departure listing.
            `#search-results` is the scroll target for the hero search and the
            quick-route chips; the board itself keeps the `#next-buses` anchor
            used by the navbar. These used to be two separate coach lists
            rendering the same SAMPLE_SCHEDULES twice. */}
        <div id="search-results">
          <NextBusesBoard
            schedules={schedulesToRender}
            searchSummary={
              searchParams
                ? { origin: searchParams.origin, destination: searchParams.destination }
                : null
            }
            onSelectBusToBook={(bus) => setSelectedBusForBooking(bus)}
            onOpenWhatsAppHub={handleOpenWhatsAppWithCustomMsg}
          />
        </div>

        {/* 4. ALL ROUTES & FARES DIRECTORY */}
        <RoutesDirectory
          onSelectRoute={handleQuickRouteSelect}
          onOpenWhatsAppHub={handleOpenWhatsAppWithCustomMsg}
        />

        {/* 5. VIP FLEET & SAFETY FIRST PROTOCOL */}
        <FleetAndSafety
          onOpenWhatsAppHub={handleOpenWhatsAppWithCustomMsg}
        />

        {/* 6. PHYSICAL BOOKING TERMINALS & OFFICES */}
        <OfficeContacts />

      </main>

      {/* 7. FOOTER */}
      <Footer
        onOpenManageTicket={() => setIsManageTicketOpen(true)}
        onOpenWhatsAppHub={handleOpenWhatsAppWithCustomMsg}
        onNavigateSection={handleNavigateSection}
      />

      {/* 8. THE CORE WHATSAPP ADD-ON (Floating Button & Expandable Hub) */}
      <WhatsAppAddOn
        isOpen={isWhatsAppHubOpen}
        onOpen={() => setIsWhatsAppHubOpen(true)}
        onClose={() => setIsWhatsAppHubOpen(false)}
        initialMessage={whatsAppInitialMsg}
        selectedRoute={selectedRouteForWhatsApp}
      />

      {/* 9. MODALS */}
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
