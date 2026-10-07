import type { BookingTicket } from '../data/dreamlineData';

/**
 * Ticket persistence.
 *
 * The client has no backend, so bookings live in `localStorage`. Keys are
 * versioned: when the ticket shape changes, bump the suffix and the old payload
 * is ignored rather than half-loaded.
 */
const STORAGE_KEY = 'dreamline.tickets.v1';

const isString = (value: unknown): value is string => typeof value === 'string';
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

function isTicket(value: unknown): value is BookingTicket {
  if (!value || typeof value !== 'object') return false;
  const t = value as Partial<BookingTicket>;
  return (
    // Every field the ticket, manage-booking, and share views render — a
    // partially-shaped entry used to pass the old check and then crash the
    // search handler on `undefined.toLowerCase()`.
    isString(t.ticketId) &&
    isString(t.bookingRef) &&
    isString(t.busScheduleId) &&
    isString(t.coachName) &&
    isString(t.busNumber) &&
    isString(t.coachType) &&
    isString(t.origin) &&
    isString(t.destination) &&
    isString(t.departureDate) &&
    isString(t.departureTime) &&
    isString(t.arrivalTime) &&
    isString(t.pickupPoint) &&
    isString(t.dropoffPoint) &&
    Array.isArray(t.seats) &&
    t.seats.every(isString) &&
    isString(t.passengerName) &&
    isString(t.passengerPhone) &&
    isString(t.passengerEmail) &&
    isString(t.idNumber) &&
    isFiniteNumber(t.totalAmount) &&
    isString(t.bookedAt) &&
    isString(t.paymentStatus)
  );
}

/** Returns saved tickets, or `null` when nothing usable is stored yet. */
export function loadTickets(): BookingTicket[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(isTicket);
  } catch {
    // Private mode, quota, or corrupt JSON — fall back to the seeded demo data.
    return null;
  }
}

/** Writes tickets, ignoring storage failures (private mode, full quota). */
export function saveTickets(tickets: BookingTicket[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch {
    // Nothing to do: the session keeps working, it just will not survive reload.
  }
}
