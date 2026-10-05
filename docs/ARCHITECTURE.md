# Architecture

Technical reference for the Dreamline client application.

## Overview

Dreamline is a **single-page React application with no backend**. All domain data (schedules, routes, offices, tickets) ships as static TypeScript modules in `src/data/`, and all runtime state lives in React `useState` hooks inside `App.tsx`. Checkout hands off to WhatsApp — no payment API is called from the client.

```
┌────────────────────────────── Browser ───────────────────────────────┐
│  index.html                                                         │
│   └─ src/main.tsx  → React root + service worker registration       │
│       └─ src/App.tsx  (owns ALL application state)                  │
│           ├─ presentational components (Navbar, Hero, sections...)  │
│           ├─ modal components (Seat, M-PESA, Ticket, Manage)        │
│           └─ src/data/dreamlineData.ts (static domain data)         │
└──────────────────────────────────────────────────────────────────────┘
```

## Technology choices

| Concern | Implementation |
|---|---|
| Build | Vite 8 (rolldown) — `vite.config.ts` wires `@vitejs/plugin-react` + `@tailwindcss/vite`, `@` alias to `src/`, `import.meta.dirname` for paths |
| Language | TypeScript 7, strict-ish via `tsconfig.json`; `npm run lint` = `tsc --noEmit` |
| Styling | Tailwind CSS 4 — **plugin-only config**, no `tailwind.config.js` / `postcss.config.js` |
| Icons | lucide-react (tree-shaken named imports) |
| State | Local component state only; no Redux/Zustand/Context yet |
| Routing | Custom `window.history.pushState` + pathname matching (no React Router); `vercel.json` SPA rewrite for `/book/:busId` deep links |

## State ownership (`src/App.tsx`)

All state is declared at the root and passed down as props:

| State | Type | Purpose |
|---|---|---|
| `searchParams` | `{origin, destination, date, passengers} \| null` | Active search from HeroSection |
| `allTickets` | `BookingTicket[]` | Ticket store, initialised with `DEMO_TICKETS` |
| `selectedBusForBooking` | `BusSchedule \| null` | Opens SeatBookingModal |
| `activeTicketToView` | `BookingTicket \| null` | Opens TicketModal |
| `isWhatsAppHubOpen` / `whatsAppInitialMsg` / `selectedRouteForWhatsApp` | — | Floating WhatsApp hub state |
| `isManageTicketOpen` | `boolean` | ManageTicketModal visibility |
| `activeTabFilter` | `'All' \| 'Morning' \| 'Afternoon' \| 'Night'` | Schedule time filter |

### Derived data

```ts
displayedSchedules = SAMPLE_SCHEDULES.filter(match origin + destination)
schedulesToRender  = displayedSchedules.length ? displayedSchedules : SAMPLE_SCHEDULES.slice(0, 4)
```

If a searched city pair has no sample schedule, the UI falls back to the first four schedules rather than showing an empty state.

## Booking flow (WhatsApp-first)

Checkout is deliberately simple: **users are connected to the WhatsApp number for further info before any payment is attempted.** M-PESA STK push is not configured yet, so the payment modal is unwired.

```
HeroSection.onSearch(params)
  → setSearchParams → scroll to #search-results
  → App renders schedulesToRender list
        │
        ├─ "Ask Availability" button → buildWhatsAppLink() → window.open
        │
        └─ "Select Seat" → setSelectedBusForBooking(bus)
              → SeatBookingModal
                    collects: seats[] (required),
                              passengerName + passengerPhone (optional prefills),
                              pickupPoint, dropoffPoint
              → "Continue on WhatsApp" (single primary CTA)
                    → buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, msg)
                    → window.open wa.me deep link with full booking summary
                    → booking desk confirms seats & sends M-PESA payment instructions
                    → flow ends (no ticket is generated client-side)
```

**Deferred to a later phase:** wiring `MpesaModal` for real Daraja STK push after the booking desk confirms the reservation. The component exists and type-checks but is not rendered by `App.tsx`.

**Persistence:** demo tickets seeded from `DEMO_TICKETS` exist only in memory. Refreshing the page re-seeds `allTickets`.

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
| `SeatBookingModal` | `selectedBusForBooking != null` | Seat map, optional name/phone → single "Continue on WhatsApp" CTA |
| `MpesaModal` | **not wired** — never rendered | Kept for the future Daraja STK integration; `App.tsx` no longer imports it |
| `TicketModal` | `activeTicketToView != null` | E-ticket / boarding pass render |
| `ManageTicketModal` | `isManageTicketOpen` | Lists `allTickets`, opens one in TicketModal |

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
| `coachImageFor(coachType)` | fn | Maps a coach type to its banner image, or `undefined` |
| `getTimeOfDayCategory(departureTime)` | fn | Buckets `"06:30 AM"` → `Morning` \| `Afternoon` \| `Night` for the board filter |

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
- `public/service-worker.js` — cache-first asset caching, cache name `dreamline-pwa-v3`, precaching `/logo.png`.
- Registered in `src/main.tsx` on `window.load`, **production only** (`import.meta.env.PROD`) — a service worker in dev caches stale modules. Registration had been dropped entirely at one point, orphaning the manifest.

## Coach photography

`COACH_IMAGES` in `src/data/dreamlineData.ts` maps coach types to banner images, resolved
per card through `coachImageFor()`. `BusSchedule.coachImage` overrides the type-level
mapping for an individual departure. `CoachPhoto` renders an indigo branded placeholder
when nothing is configured, so cards degrade cleanly instead of showing broken images.

The map is intentionally empty. Candidates in `unused-photos/` must clear
`scripts/photo-quality-gate.ps1` (landscape, aspect 1.3–2.6, short side ≥ 560 px) and have
confirmed licensing before being wired.

## Known gaps

1. **No backend — and no server stack.** The client is a pure SPA. Unused server-side packages (`express`, `tsx`, `dotenv`) and the unused Gemini/animation SDKs (`@google/genai`, `motion`) were removed from `package.json` during repo cleanup; add them back only when there is real code to use them.
2. **Gemini not wired.** `GEMINI_API_KEY` is documented in `.env.example` but no code imports an AI SDK or reads the key.
3. **M-PESA STK deliberately deferred.** Checkout hands off to WhatsApp instead. `MpesaModal.tsx` is a complete but unwired stub — hooking it up requires Safaricom Daraja credentials, a server endpoint to initiate/verify STK pushes, and a re-connect of `SeatBookingModal` → `MpesaModal`.
4. **No persistence.** Bookings are lost on refresh; there is no `localStorage`/DB layer.
5. **No routing.** Single page; navigation is scroll-based via `document.getElementById(...).scrollIntoView()`.
6. **Seat map is static.** Occupied seats are a hard-coded set (`1B, 2A, 4A, 4B, 6C, 7A, 8B, 9C`) — no real inventory.

## Type checking

```bash
npm run lint   # tsc --noEmit — the project's only static analysis gate
```

There is no ESLint/Prettier configuration in the repository.
