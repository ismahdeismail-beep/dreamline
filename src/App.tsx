import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { NextBusesBoard } from './components/NextBusesBoard';
import { RoutesDirectory } from './components/RoutesDirectory';
import { FleetAndSafety } from './components/FleetAndSafety';
import { OfficeContacts } from './components/OfficeContacts';
import { Footer } from './components/Footer';
import { WhatsAppAddOn } from './components/WhatsAppAddOn';
import { MpesaModal } from './components/MpesaModal';
import { TicketModal } from './components/TicketModal';
import { ManageTicketModal } from './components/ManageTicketModal';

import {
  SAMPLE_SCHEDULES,
  BookingTicket,
  DEMO_TICKETS,
} from './data/dreamlineData';
import { loadTickets, saveTickets } from './lib/ticketStore';
import { BookingPage, type MpesaCheckout } from './BookingPage';

/** Local calendar date as YYYY-MM-DD (same as HeroSection's picker). */
const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function App() {
  // Dedicated booking page at /book/:busId. Kept as a tiny path check so the
  // app stays dependency-free while the URL stays shareable.
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const goToBooking = (busId: string) => {
    const next = '/book/' + encodeURIComponent(busId);
    window.history.pushState({}, '', next);
    setPath(next);
    // Starting a fresh booking must not inherit the previous payment's
    // confirmation — the new page mounts with a clean form.
    setPaidTicketId(null);
    window.scrollTo(0, 0);
  };
  const goHome = () => {
    window.history.pushState({}, '', '/');
    setPath('/');
    // Leaving a booking clears the paid confirmation, so the next /book/:busId
    // starts on a clean form.
    setPaidTicketId(null);
    window.scrollTo(0, 0);
  };

  // Navigation / Modals state
  const [isWhatsAppHubOpen, setIsWhatsAppHubOpen] = useState(false);
  const [whatsAppInitialMsg, setWhatsAppInitialMsg] = useState<string | undefined>(undefined);
  const [selectedRouteForWhatsApp, setSelectedRouteForWhatsApp] = useState<{ from: string; to: string } | undefined>(undefined);
  
  const [isManageTicketOpen, setIsManageTicketOpen] = useState(false);
  const [activeTicketToView, setActiveTicketToView] = useState<BookingTicket | null>(null);
  
  // Booking flow state
  const [pendingMpesaData, setPendingMpesaData] = useState<MpesaCheckout | null>(null);

  // Tickets live in localStorage, so Manage Ticket and the seat holds below
  // survive a reload instead of re-seeding from DEMO_TICKETS every time.
  const [allTickets, setAllTickets] = useState<BookingTicket[]>(() => loadTickets() ?? DEMO_TICKETS);
  useEffect(() => {
    saveTickets(allTickets);
  }, [allTickets]);

  // Seat codes held by tickets booked on this device, keyed by schedule id.
  // The seat map, the board counter and the booking form all read from this.
  const bookedSeatHolds = useMemo<Record<string, string[]>>(() => {
    const holds: Record<string, string[]> = {};
    for (const ticket of allTickets) {
      if (!ticket.busScheduleId) continue;
      (holds[ticket.busScheduleId] ??= []).push(...ticket.seats);
    }
    return holds;
  }, [allTickets]);

  // M-PESA is only offered once `api/mpesa.js` reports real Daraja credentials.
  const [mpesaEnabled, setMpesaEnabled] = useState(false);
  const [paidTicketId, setPaidTicketId] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/mpesa', { headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data?.configured === true) setMpesaEnabled(true);
      })
      .catch(() => {
        // No server function in dev — the M-PESA button stays "coming soon".
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  // Any "Book" affordance that has no specific bus behind it lands on the soonest
  // departure, so a tap always reaches the booking page.
  const goToSoonestBooking = () => {
    const soonest = schedulesToRender[0];
    if (soonest) {
      goToBooking(soonest.id);
    }
  };

  const handleQuickRouteSelect = (from: string, to: string) => {
    setSearchParams({
      origin: from,
      destination: to,
      date: todayIso(),
      passengers: 1
    });
    setSelectedRouteForWhatsApp({ from, to });

    // Tapping a route always reaches the booking page: prefer the soonest bus on
    // that corridor, then any departure to that destination, then any departure
    // at all. Never dump the passenger back on the results list.
    const match = schedulesToRender.find(
      (s) => s.origin === from && s.destination === to
    ) ?? schedulesToRender.find((s) => s.destination === to);

    if (match) {
      goToBooking(match.id);
      return;
    }

    goToSoonestBooking();
  };

  const handleStartMpesaCheckout = (checkout: MpesaCheckout) => {
    setPendingMpesaData(checkout);
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
    setPaidTicketId(newTicket.ticketId);
    setActiveTicketToView(newTicket);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // /book/:busId renders the standalone booking page instead of the landing page.
  const bookMatch = path.match(/^\/book\/([^/]+)\/?$/);
  if (bookMatch) {
    const wantedId = decodeURIComponent(bookMatch[1]);
    // The full timetable, not `schedulesToRender`: after a filtered search a
    // deep link to a coach outside the results used to render the "no longer
    // available" page for a perfectly valid departure.
    const bus =
      SAMPLE_SCHEDULES.find((s) => s.id === wantedId) ??
      SAMPLE_SCHEDULES.find((s) => s.busNumber === wantedId) ??
      null;
    return (
      <>
        {/* Keyed by departure so switching buses remounts a clean form. */}
        <BookingPage
          key={wantedId}
          bus={bus}
          onBack={goHome}
          extraBookedSeats={bus ? bookedSeatHolds[bus.id] ?? [] : []}
          mpesaEnabled={mpesaEnabled}
          onPayWithMpesa={handleStartMpesaCheckout}
          paidTicketId={paidTicketId}
        />

        {/* Payment and ticket overlays belong to this route too — without them a
            M-PESA payment on /book/:busId would confirm with nothing on screen. */}
        {pendingMpesaData && (
          <MpesaModal
            bookingData={pendingMpesaData}
            onClose={() => setPendingMpesaData(null)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
        {activeTicketToView && (
          <TicketModal
            ticket={activeTicketToView}
            onClose={() => setActiveTicketToView(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f8fc] text-slate-900 flex flex-col font-sans">
      
      {/* 1. TOP NAVBAR */}
      <Navbar
        onOpenManageTicket={() => setIsManageTicketOpen(true)}
        onOpenWhatsAppHub={handleOpenWhatsAppWithCustomMsg}
        onNavigateSection={handleNavigateSection}
        onBook={goToSoonestBooking}
      />

      <main className="flex-1">
        
        {/* 2. HERO SECTION WITH SEARCH ENGINE & WHATSAPP SHORTCUTS */}
        <div id="hero">
          <HeroSection
            onSearch={handleHeroSearch}
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
            extraBookedSeats={bookedSeatHolds}
            onSelectBusToBook={(bus) => goToBooking(bus.id)}
            onOpenWhatsAppHub={handleOpenWhatsAppWithCustomMsg}
          />
        </div>

        {/* 4. ALL ROUTES & FARES DIRECTORY */}
        <RoutesDirectory
          onSelectRoute={handleQuickRouteSelect}
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
        onBook={goToSoonestBooking}
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
      {/* A. M-PESA STK Push Checkout Modal */}
      {pendingMpesaData && (
        <MpesaModal
          bookingData={pendingMpesaData}
          onClose={() => setPendingMpesaData(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* B. Official e-Ticket & Boarding Pass View */}
      {activeTicketToView && (
        <TicketModal
          ticket={activeTicketToView}
          onClose={() => setActiveTicketToView(null)}
        />
      )}

      {/* C. Manage / Retrieve Existing Ticket Modal */}
      <ManageTicketModal
        isOpen={isManageTicketOpen}
        onClose={() => setIsManageTicketOpen(false)}
        allTickets={allTickets}
        onViewTicket={(ticket) => setActiveTicketToView(ticket)}
      />

    </div>
  );
}
