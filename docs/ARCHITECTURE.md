# Architecture

Technical reference for the Dreamline client application.

## Overview

Dreamline is a **single-page React application with exactly one server-side file**. All
domain data (schedules, routes, offices, tickets) ships as static TypeScript modules in
`src/data/`, and runtime state lives in React `useState` hooks inside `App.tsx`. Checkout
hands off to WhatsApp by default; M-PESA STK push goes through `api/mpesa.js`, a Vercel
serverless function that keeps the Daraja credentials off the client.

```
┌────────────────────────────── Browser ───────────────────────────────┐
│  index.html                                                         │
│   └─ src/main.tsx  → React root + service worker registration       │
│       └─ src/App.tsx  (owns ALL application state)                  │
│           ├─ presentational components (Navbar, Hero, sections...)  │
│           ├─ overlays (SeatMap, M-PESA, Ticket, Manage)             │
│           ├─ src/lib/ticketStore.ts  (localStorage persistence)     │
│           └─ src/data/dreamlineData.ts (static domain data)         │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ fetch('/api/mpesa')  [M-PESA only]
                               ▼
                    ┌──────────────────────────┐
                    │  api/mpesa.js (Vercel)   │  Daraja OAuth + STK push
                    │  → Safaricom Daraja API  │  + STK status query
                    └──────────────────────────┘
```

## Technology choices

| Concern | Implementation |
|---|---|
| Build | Vite 8 (rolldown) — `vite.config.ts` wires `@vitejs/plugin-react` + `@tailwindcss/vite`, `@` alias to `src/`, `import.meta.dirname` for paths |
| Language | TypeScript 7, strict-ish via `tsconfig.json`; `npm run lint` = `tsc --noEmit` |
| Styling | Tailwind CSS 4 — **plugin-only config**, no `tailwind.config.js` / `postcss.config.js` |
| Icons | lucide-react (tree-shaken named imports) |
| State | Local component state only; no Redux/Zustand/Context yet |
| Routing | Custom `window.history.pushState` + pathname matching (no React Router); `vercel.json` SPA rewrite for `/book/:busId` deep links (the rewrite explicitly excludes `api/`) |
| Server | `api/mpesa.js` — one Vercel Node function, native `fetch`, **zero server-side npm dependencies** |

## State ownership (`src/App.tsx`)

All state is declared at the root and passed down as props:

| State | Type | Purpose |
|---|---|---|
| `searchParams` | `{origin, destination, date, passengers} \| null` | Active search from HeroSection |
| `allTickets` | `BookingTicket[]` | Ticket store — loaded from `localStorage`, seeded with `DEMO_TICKETS` when empty, written back on every change |
| `pendingMpesaData` | `MpesaCheckout \| null` | Opens `MpesaModal` (set by the booking page's M-PESA button) |
| `activeTicketToView` | `BookingTicket \| null` | Opens TicketModal |
| `paidTicketId` | `string \| null` | Lets the booking page show its paid confirmation after the ticket view closes |
| `mpesaEnabled` | `boolean` | Result of `GET /api/mpesa` — controls whether the M-PESA button is live or "coming soon" |
| `bookedSeatHolds` | `Record<string, string[]>` | Derived (`useMemo`) seat codes held by `allTickets`, keyed by schedule id |
| `isWhatsAppHubOpen` / `whatsAppInitialMsg` / `selectedRouteForWhatsApp` | — | Floating WhatsApp hub state |
| `isManageTicketOpen` | `boolean` | ManageTicketModal visibility |
| `activeTabFilter` | `'All' \| 'Morning' \| 'Afternoon' \| 'Night'` | Schedule time filter |

### Derived data

```ts
displayedSchedules = SAMPLE_SCHEDULES.filter(match origin + destination)
schedulesToRender  = displayedSchedules.length ? displayedSchedules : SAMPLE_SCHEDULES.slice(0, 4)
```

If a searched city pair has no sample schedule, the UI falls back to the first four schedules rather than showing an empty state.

## Booking flow (WhatsApp-first, M-PESA optional)

Every "Book"-style control lands on `/book/:busId`. From there the passenger picks
details and chooses one of two checkouts:

```
HeroSection / NextBusesBoard / RoutesDirectory
  → goToBooking(busId) → /book/:busId  → BookingPage
        │
        ├─ "Confirm on WhatsApp" (default, always available)
        │     → buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, full booking summary)
        │     → window.open wa.me deep link
        │     → booking desk confirms seats & sends M-PESA payment instructions
        │     → flow ends (no ticket generated client-side)
        │
        └─ "Pay KSh N with M-PESA"   [only when GET /api/mpesa says configured]
              → validate name + phone → App.setPendingMpesaData(checkout)
              → MpesaModal
                    POST /api/mpesa {action:'stkpush', phone, amount, reference}
                    → Safaricom Daraja pushes a PIN prompt to the handset
                    → poll POST {action:'query'} every 3s (max ~60s)
                    → only ResultCode 0 issues a ticket:
                        App.handlePaymentSuccess → allTickets (persisted)
                        → TicketModal opens over the booking page
```

Seat choice is optional everywhere: with no seat selected the desk assigns one, so the
fare is quoted as `max(seats, 1) × seatPrice` (`vipPrice` for VIP coaches,
`regularPrice` otherwise).

**M-PESA without credentials:** `api/mpesa.js` answers `501 { configured:false }` while
any `DARAJA_*` variable is missing, `mpesaEnabled` stays `false`, and the button renders
disabled as "coming soon". Nothing in the client ever sees a Daraja secret.

**Persistence:** `src/lib/ticketStore.ts` reads and writes `dreamline.tickets.v1` in
`localStorage`. `App` seeds `DEMO_TICKETS` only when nothing is stored, saves on every
change, and derives `bookedSeatHolds` from the stored tickets — so a booked seat stays
taken after a refresh. Storage failures (private mode, quota) degrade to in-memory state.

## Component map

### Layout / sections

| Component | Responsibility | Key props |
|---|---|---|
| `Navbar` | Brand, section links, Manage Ticket, WhatsApp CTA | `onOpenManageTicket`, `onOpenWhatsAppHub`, `onNavigateSection` |
| `HeroSection` | Headline, search form (origin/destination/date/passengers/tier), corridor chips, benefits grid | `onSearch`, `onOpenWhatsAppHub`, `onSelectRouteQuick` |
| `NextBusesBoard` | Upcoming departures with seat-availability signals | `schedules`, `onSelectBusToBook`, `onOpenWhatsAppHub` |
| `RoutesDirectory` | Full corridor + fare listing | `onSelectRoute`, `onOpenWhatsAppHub` |
| `FleetAndSafety` | Amenities and safety credentials | `onOpenWhatsAppHub` |
| `OfficeContacts` | Physical terminals/offices from `OFFICE_LOCATIONS` | — |
| `Footer` | Sitemap, contact, quick actions | `onOpenManageTicket`, `onOpenWhatsAppHub`, `onNavigateSection` |

### Overlays

| Component | Trigger | Notes |
|---|---|---|
| `WhatsAppAddOn` | Floating button / any WhatsApp CTA | Expandable hub with quick-reply chips, phone edit, copy-number. Brand-green surface |
| `SeatMapModal` | "Open full seat map" on the booking page | Interactive map built from `seatRowsFor()`; occupancy from `bookedSeatsFor()`; returns the chosen codes to the form (max 4). Renders on `/book/:busId` |
| `MpesaModal` | `pendingMpesaData != null` | Real STK push via `api/mpesa.js`: initiate → poll → ticket only on Safaricom success. Renders on both routes |
| `TicketModal` | `activeTicketToView != null` | E-ticket / boarding pass render. Also rendered on the booking route so a payment there confirms visibly |
| `ManageTicketModal` | `isManageTicketOpen` | Searches `allTickets` (which already contains the seeded demo bookings), opens one in TicketModal |

### Interaction convention

Section components never call each other. They receive **callback props** from `App.tsx` (`onSelectRouteQuick`, `onOpenWhatsAppHub`, …), keeping `App.tsx` the single coordinator.

## Data model (`src/data/dreamlineData.ts`)

### Interfaces

```ts
interface BusSchedule {
  id; coachName; busNumber; coachType;
  origin; destination; departureDate; departureTime; arrivalTime; duration;
  pickupPoints: string[]; dropoffPoints: string[];
  amenities: string[];
  regularPrice: number; vipPrice: number;
  availableSeats: number; totalSeats: number;
  // ...as defined in source
}

interface RouteDetail  { /* corridor + fare metadata */ }
interface OfficeLocation { /* physical terminal */ }

interface BookingTicket {
  ticketId;        // "TKT-#####" generated on payment
  bookingRef;      // from M-PESA receipt step
  busScheduleId; coachName; busNumber; coachType;
  origin; destination; departureDate; departureTime; arrivalTime;
  pickupPoint; dropoffPoint;
  seats: string[];
  passengerName; passengerPhone; passengerEmail; idNumber;
  totalAmount;
  paymentMethod;   // 'M-PESA'
  paymentStatus;   // 'PAID'
  mpesaReceiptNo;
  bookedAt;
}
```

### Exports

| Export | Kind | Purpose |
|---|---|---|
| `KENYAN_CITIES` | `string[]` | Search dropdown options |
| `DEFAULT_WHATSAPP_NUMBER` / `DISPLAY_WHATSAPP_NUMBER` | `'0788256042'` | Single standardized contact number |
| `POPULAR_ROUTES` | `RouteDetail[]` | Routes directory data |
| `SAMPLE_SCHEDULES` | `BusSchedule[]` | Searchable departures |
| `OFFICE_LOCATIONS` | `OfficeLocation[]` | Office contacts section |
| `DEMO_TICKETS` | `BookingTicket[]` | Pre-seeded tickets for Manage flow |
| `buildWhatsAppLink(phone, message)` | fn | `wa.me` deep link with encoded text |
| `seatRowsFor(bus)` | fn | Seat grid for a departure (2+1 or 2+2 per row), sized to `totalSeats` |
| `seatCodesFor(bus)` | fn | Every seat code in row order — the chip list and map both read it |
| `bookedSeatsFor(bus, extra?)` | fn | Deterministic occupancy (seeded by schedule id) unioned with local holds |
| `availableSeatsFor(bus, extra?)` | fn | `totalSeats − booked`, clamped at 0 — the board's "N of M seats left" |
| `getTimeOfDayCategory(departureTime)` | fn | Buckets `"06:30 AM"` → `Morning` \| `Afternoon` \| `Night` for the board filter |

`src/lib/ticketStore.ts` adds `loadTickets()` / `saveTickets()` over the
`dreamline.tickets.v1` localStorage key, validating the shape on read.

### Seat inventory

`BusSchedule.availableSeats` is the declared number of sellable seats. The *identity* of
those seats is derived from the schedule id with a seeded PRNG (FNV-1a + mulberry32) so it
is stable across reloads and never uses `Math.random`. Seats held by tickets stored on the
device are folded in through the `extraBookedSeats` argument, which `App` derives from
`allTickets` (`bookedSeatHolds`).

## Styling system

- **Palette:** light theme. `--color-canvas` `#f9f8fc` is the page background; `--color-brand` `#34398e` (indigo) carries primary brand, prices, headings and active filter chips; `--color-accent` `#e52421` (red) is reserved for primary CTAs and urgent scarcity cues such as "4 of 33 seats left". Defined in `src/index.css` under `@theme`.
- **Type:** Lato throughout, mapped to `--font-sans` / `--font-display` and set on `body` plus all headings in `@layer base`.
- **Brand exceptions:** emerald/WhatsApp green is intentionally retained in `WhatsAppAddOn.tsx`, `MpesaModal.tsx`, and the WhatsApp affordances on the coach board.
- **No dark mode.** The previous `slate-950` + amber dark theme has been removed.

### Tailwind v4 source scanning

Tailwind v4 scans the project for class names automatically. Two folders outside `src/`
are excluded via `@source not` in `src/index.css`:

- `zip/` — a stale clone of this project
- `unused-photos/` — staging folder of unreviewed candidate coach photos

Excluding them stops dead utilities (for example `bg-[url('/images/hero-1.jpg')]`) being
emitted from markup that no longer exists in `src/`, which cut the production CSS from
56.41 kB to ~47 kB.

## PWA

- `public/manifest.json` — app name, theme color `#34398e`, background `#f9f8fc`, and real 192/512 icons (`android-chrome-192x192.png`, `android-chrome-512x512.png`). The manifest previously pointed at hero JPGs, which produced poor install prompts; that is fixed.
- `public/service-worker.js` — network-first navigations, cache-first hashed assets, cache name `dreamline-pwa-v4`, precaching `/logo.png` and the hero images. `/api/*` responses are never cached, so a stale `{configured:false}` probe cannot keep M-PESA disabled after credentials land.
- Registered in `src/main.tsx` on `window.load`, **production only** (`import.meta.env.PROD`) — a service worker in dev caches stale modules. Registration had been dropped entirely at one point, orphaning the manifest.

## Coach photography

`BusSchedule.coachImage` (optional, per schedule) is the only wiring path; `CoachPhoto`
renders an indigo branded placeholder when it is unset, so cards degrade cleanly instead
of showing broken images. Every schedule sets it to one of the three Dreamline-livery
photos in `public/images/` (matched to coach type), which feed the departure cards and the
booking header; the hero card and fleet cards use the same pool directly. The eight
`public/coaches/*` candidates stay withdrawn — no verifiable licence
(docs/PHOTO-LICENSING.md).

The type-level `COACH_IMAGES` map and `coachImageFor()` were deleted: each schedule
supplies its own `coachImage`, so the fallback could never fire. New candidates must clear
`scripts/photo-quality-gate.ps1` (landscape, aspect 1.3–2.6, short side ≥ 560 px) and have
confirmed licensing before being wired.

## Known gaps

1. **Almost no server.** The only server-side code is `api/mpesa.js` (M-PESA STK). There
   is no database, no user accounts and no server-rendered HTML. Unused server-side
   packages were removed from `package.json`; add them back only when there is real code
   to use them.
2. **M-PESA needs Daraja credentials.** The flow is complete end to end (push → poll →
   ticket), but it stays disabled until the five `DARAJA_*` variables are configured —
   see docs/DEPLOYMENT.md#m-pesa-daraja. Local `npm run dev` has no server function, so
   the button reads "coming soon" there.
3. **Payments are not reconciled server-side.** A ticket exists only in this browser's
   `localStorage`; there is no shared record of a sale, and another device cannot see it.
   The STK callback URL is required by Daraja but nothing consumes it yet.
4. **Seat holds are local.** Occupancy combines static schedule data with tickets booked
   on this device — two passengers on two devices can still pick the same seat, and the
   WhatsApp desk remains the authority on final allocation.
5. **Gemini not wired.** `GEMINI_API_KEY` is documented in `.env.example` but no code
   imports an AI SDK or reads the key.
6. **Routing is hand-rolled.** `window.history.pushState` + pathname matching covers
   `/` and `/book/:busId` only; there is no router library, no 404 route and no route
   params beyond the bus id.

## Type checking

```bash
npm run lint   # tsc --noEmit — the project's only static analysis gate
```

There is no ESLint/Prettier configuration in the repository.
