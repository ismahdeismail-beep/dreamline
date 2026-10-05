import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, CreditCard, MessageCircle, MapPin, PhoneCall } from 'lucide-react';
import {
  BusSchedule,
  coachImageFor,
  buildWhatsAppLink,
  DEFAULT_WHATSAPP_NUMBER,
  DISPLAY_WHATSAPP_NUMBER,
  TEL_LINK,
} from './data/dreamlineData';
import { CoachPhoto } from './components/CoachPhoto';

interface BookingPageProps {
  bus: BusSchedule | null;
  onBack: () => void;
}

/**
 * Standalone booking page reached at /book/:busId. It deliberately asks for the
 * minimum needed to reserve and reach the passenger: name, phone and (optionally)
 * a seat. Payment stays on M-PESA STK push once it goes live.
 */
export const BookingPage: React.FC<BookingPageProps> = ({ bus, onBack }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickup, setPickup] = useState(bus?.pickupPoints?.[0] ?? 'Main Terminal');
  const [dropoff, setDropoff] = useState(bus?.dropoffPoints?.[0] ?? 'Main Stage');
  const [seat, setSeat] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  // The dock floats over a long form on a phone, so it must get out of the way
  // while the passenger is scrolling or typing and return once they pause.
  const [dockIdle, setDockIdle] = useState(true);
  // ...and it must never sit on top of the primary CTA, which is full width and
  // therefore always crosses the bottom-right corner the dock occupies.
  const [submitVisible, setSubmitVisible] = useState(false);

  // A short, readable seat range beats a full interactive map on a phone.
  const seatOptions = useMemo(() => {
    if (!bus) return [];
    return Array.from({ length: Math.min(24, Math.max(6, bus.totalSeats - 6)) }, (_, i) => `${i + 1}A`);
  }, [bus]);

  useEffect(() => {
    const submit = document.querySelector('form button[type="submit"]');
    if (!submit || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setSubmitVisible(entry.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(submit);
    return () => io.disconnect();
  }, [bus]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const wake = () => {
      setDockIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setDockIdle(true), 1100);
    };
    const onFocusIn = (e: FocusEvent) => {
      if ((e.target as HTMLElement)?.matches?.('input, select, textarea')) setDockIdle(false);
    };
    const onFocusOut = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setDockIdle(true), 900);
    };
    window.addEventListener('scroll', wake, { passive: true });
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      window.removeEventListener('scroll', wake);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      clearTimeout(timer);
    };
  }, []);

  if (!bus) {
    return (
      <main className="min-h-screen bg-[#f9f8fc] flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-sm">
          <h1 className="text-xl font-black text-slate-900">That departure is no longer available</h1>
          <p className="text-sm text-slate-500 mt-2">Pick another bus or ask our desk and we&apos;ll sort you out.</p>
          <div className="mt-5 flex flex-col gap-2">
            <button onClick={onBack} className="py-2.5 rounded-xl bg-[#34398e] text-white text-sm font-bold cursor-pointer">
              Back to departures
            </button>
            <a href={TEL_LINK} className="py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-700 flex items-center justify-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> Call the desk
            </a>
          </div>
        </div>
      </main>
    );
  }

  const seats = seat ? [seat] : [];
  const total = seats.length * bus.regularPrice;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError('Please enter your full name.');
    if (phone.replace(/\D/g, '').length < 9) return setError('Please enter a valid phone number.');
    setError('');

    const lines = [
      `Hi Dreamline, I'd like to book a seat.`,
      ``,
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Bus: ${bus.busNumber} — ${bus.coachName}`,
      `Route: ${bus.origin} → ${bus.destination}`,
      `Departs: ${bus.departureTime} (arrives ${bus.arrivalTime})`,
      `Pickup: ${pickup}`,
      `Drop-off: ${dropoff}`,
      seat ? `Seat: ${seat}` : `Seat: Any available`,
      `Fare: KSh ${total.toLocaleString()}`,
      ``,
      `Please confirm availability. Thank you.`,
    ];
    window.open(buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, lines.join('\n')), '_blank', 'noopener');
    setSent(true);
  };

  const field =
    'w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#34398e] focus:ring-2 focus:ring-[#34398e]/15';

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f6fc] via-white to-[#f7f6fc]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-6 space-y-4">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-[#34398e] cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> All departures
        </button>

        {/* Trip summary */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-3xl overflow-hidden shadow-sm">
          <CoachPhoto
            coachType={bus.coachType}
            src={bus.coachImage ?? coachImageFor(bus.coachType)}
            alt={`${bus.coachName} — ${bus.coachType}`}
            className="h-32 w-full"
          />
          <div className="p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#34398e]">{bus.busNumber}</p>
            <h1 className="text-lg font-black text-slate-900">{bus.coachName}</h1>
            <p className="text-xs text-slate-500">{bus.coachType}</p>

            <div className="mt-3 flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="text-base font-black text-slate-900">{bus.departureTime}</p>
                <p className="text-[11px] font-bold text-slate-500">{bus.origin}</p>
              </div>
              <div className="text-center px-2">
                <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-center"><Clock className="w-3 h-3" />{bus.duration}</span>
                <div className="w-14 h-0.5 bg-slate-200 my-1.5 mx-auto" />
                <span className="text-[10px] font-bold text-emerald-600">Direct</span>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-slate-900">{bus.arrivalTime}</p>
                <p className="text-[11px] font-bold text-slate-500">{bus.destination}</p>
              </div>
            </div>
          </div>
        </div>

        {sent ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-lg font-black text-slate-900 mt-3">Request sent</h2>
            <p className="text-sm text-slate-500 mt-1">
              Your details opened in WhatsApp. Our desk will confirm your seat shortly.
            </p>
            <button onClick={onBack} className="mt-5 px-5 py-2.5 rounded-xl bg-[#34398e] text-white text-sm font-bold cursor-pointer">
              Book another trip
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-3xl p-5 space-y-4 shadow-sm">
            <h2 className="text-base font-black text-slate-900">Reserve your seat</h2>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kennedy Mwangi Otieno" className={field} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Phone number</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XX XXX XXX" inputMode="tel" className={field} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Pickup</label>
                <select value={pickup} onChange={(e) => setPickup(e.target.value)} className={field}>
                  {bus.pickupPoints.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Drop-off</label>
                <select value={dropoff} onChange={(e) => setDropoff(e.target.value)} className={field}>
                  {bus.dropoffPoints.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Seat <span className="font-normal text-slate-400">(optional)</span></label>
              <div className="flex flex-wrap gap-1.5">
                {seatOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeat((cur) => (cur === s ? '' : s))}
                    className={`w-11 h-9 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer border ${
                      seat === s
                        ? 'bg-[#34398e] text-white border-[#34398e]'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-[#34398e]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#f9f8fc] rounded-2xl border border-slate-200 p-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
              <span className="text-xl font-black text-[#34398e]">KSh {total.toLocaleString()}</span>
            </div>

            {error && <p className="text-xs font-bold text-[#e52421]">{error}</p>}

            {/* Inline desk access. The floating dock is quicker, but it yields to
                scroll/focus and sits bottom-right, so this stays the guaranteed
                way to reach a human without any overlay in the way. */}
            <div className="flex items-stretch gap-2">
              <a
                href={TEL_LINK}
                className="flex-1 min-h-11 py-2.5 px-3 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-700 flex items-center justify-center gap-1.5 hover:border-[#34398e] hover:text-[#34398e]"
              >
                <PhoneCall className="w-4 h-4 shrink-0" aria-hidden="true" /> Call desk
              </a>
              <a
                href={buildWhatsAppLink(
                  DEFAULT_WHATSAPP_NUMBER,
                  `Habari Dreamline! I'd like help booking a seat on the ${bus.coachName} (${bus.busNumber}) from ${bus.origin} to ${bus.destination}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-11 py-2.5 px-3 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-700 flex items-center justify-center gap-1.5 hover:border-[#25D366] hover:text-[#128C4A]"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" /> WhatsApp desk
              </a>
            </div>

            <button type="submit" className="w-full py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
              <MessageCircle className="w-4 h-4 fill-white" /> Confirm on WhatsApp
            </button>

            <button
              type="button"
              disabled
              className="w-full py-3 rounded-2xl bg-slate-100 text-slate-400 text-sm font-bold cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> Pay with M-PESA (STK) — coming soon
            </button>
          </form>
        )}
      </div>

      {/* The landing page has a floating call/WhatsApp dock; the booking page is a
          standalone route, so it needs its own or the desk is unreachable while
          someone is mid-form. */}
      <div
        data-testid="booking-dock"
        className={`fixed bottom-5 right-5 z-50 flex flex-col gap-3 print:hidden transition-all duration-300 ${
          dockIdle && !submitVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <a
          href={TEL_LINK}
          aria-label={`Call the desk on ${DISPLAY_WHATSAPP_NUMBER}`}
          className="w-14 h-14 rounded-full bg-[#34398e]/85 backdrop-blur-xl text-white flex items-center justify-center shadow-xl shadow-indigo-950/30 hover:bg-[#34398e] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#34398e]/30 border border-white/25"
        >
          <PhoneCall className="w-6 h-6" aria-hidden="true" />
        </a>
        <a
          href={buildWhatsAppLink(
            DEFAULT_WHATSAPP_NUMBER,
            `Habari Dreamline! I'd like to book a seat on the ${bus.coachName} (${bus.busNumber}) from ${bus.origin} to ${bus.destination}.`
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open WhatsApp desk"
          className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl shadow-emerald-950/40 hover:bg-[#20ba59] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
        >
          <MessageCircle className="w-7 h-7 fill-white" aria-hidden="true" />
        </a>
      </div>
    </main>
  );
};
