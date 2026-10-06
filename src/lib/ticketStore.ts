import type { BookingTicket } from '../data/dreamlineData';

/**
 * Ticket persistence.
 *
 * The client has no backend, so bookings live in `localStorage`. Keys are
 * versioned: when the ticket shape changes, bump the suffix and the old payload
 * is ignored rather than half-loaded.
 */
const STORAGE_KEY = 'dreamline.tickets.v1';

function isTicket(value: unknown): value is BookingTicket {
  if (!value || typeof value !== 'object') return false;
  const ticket = value as Partial<BookingTicket>;
  return (
    typeof ticket.ticketId === 'string' &&
    typeof ticket.bookingRef === 'string' &&
    typeof ticket.busScheduleId === 'string' &&
    typeof ticket.passengerName === 'string' &&
    typeof ticket.passengerPhone === 'string' &&
    Array.isArray(ticket.seats)
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
