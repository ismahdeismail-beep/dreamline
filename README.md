# Dreamline Express Kenya

Official marketing and ticket-booking front end for Dreamline Express, a long-distance
coach operator in Kenya. Vite + React + TypeScript single-page app, PWA-capable, with a
WhatsApp-first checkout funnel.

> Checkout hands off to WhatsApp by design. The in-app M-PESA STK modal is a complete
> but unwired stub — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#known-gaps).

## Quick start

```bash
npm install
npm run dev      # dev server
npm run lint     # type-check (tsc --noEmit)
npm run build    # production bundle → dist/
npm run preview  # serve dist/ locally
```

No environment variables are required to run the client. `GEMINI_API_KEY` is documented
in `.env.example` but is **not read by any code** — see
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md#environment-variables).

## Brand

| Token | Value | Usage |
|---|---|---|
| `--color-brand` | `#34398e` | Indigo — primary brand, prices, headings, active filter chips |
| `--color-accent` | `#e52421` | Red — primary CTAs, urgent scarcity ("4 seats left") |
| `--color-canvas` | `#f9f8fc` | Off-white page background |
| Font | Lato | Sans + display |

Emerald/WhatsApp green is deliberately reserved for WhatsApp affordances.

## Page structure

Single page, scroll-based navigation via anchor targets, plus a standalone booking route:

1. **Hero** — route search form (Today/Tomorrow/In 2 days/Next week), quick-route chips, amenity highlights
2. **Coach board** (`#next-buses`, wrapped by `#search-results`) — the single canonical
   departure listing, filtered by corridor and time of day
3. **Routes & fares directory** (`#routes`)
4. **Fleet & safety** (`#fleet`)
5. **Offices / terminals** (`#offices`)
6. Footer, floating WhatsApp hub, and modals (seat booking, M-PESA, ticket view, manage ticket)
7. **Booking page** (`/book/:busId`) — standalone route with trip summary, minimal booking form
   (name, phone, pickup, drop-off, optional seat), inline Call/WhatsApp desk buttons, and a
   floating dock that auto-hides on scroll/focus and yields to the submit CTA

## Key components

| Component | Role |
|---|---|
| `CoachPhoto` | 16:9 coach banner with seat-layout badge (`2+1` / `2+2` / `Sleeper`); degrades to a branded placeholder when no photo is set, so cards never render broken images |
| `NextBusesBoard` | Departure listing, corridor + time-of-day filters, empty state |
| `RoutesDirectory` | Route/fare cards |
| `FleetAndSafety` | Coach classes and safety protocols |
| `SeatBookingModal` | Seat selection → WhatsApp handoff |
| `WhatsAppAddOn` | Floating button + expandable enquiry hub |
| `BookingPage` | Standalone `/book/:busId` route — trip summary, minimal form, inline + floating desk access |

## Coach photography

Coach banner photos are attached per schedule via the `coachImage` field on each entry in
`SCHEDULES` (`src/data/dreamlineData.ts`), with `coachImageFor()` as a fallback lookup by
coach type. `CoachPhoto` degrades to a branded placeholder when no image is configured, so
cards never render broken images.

> **Licensing status: unresolved.** The 8 images currently in `public/coaches/` carry no
> embedded source or licence metadata and are not hosted on the official site. Treat them
> as unusable for public marketing until provenance is confirmed — see
> [docs/PHOTO-LICENSING.md](docs/PHOTO-LICENSING.md).

Candidate photos can be screened before being wired:

```bash
powershell -ExecutionPolicy Bypass -File scripts/photo-quality-gate.ps1
```

The banner renders at roughly 400×225 CSS px, so it needs ~800×450 real pixels to stay
crisp on retina and more on HiDPI phones. The gate tiers candidates:

- **USE** — landscape, aspect 1.3–2.6, short side ≥ 560 px
- **MAYBE** — landscape and usable aspect, but under the bar
- **SKIP** — portrait, square, too-wide, or thumbnail-sized

Raise the bar with `-MinShortSide 675` (3×). Only third-party images with confirmed
licensing should be added; record attribution alongside them.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — structure, data model, styling, known gaps
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — build, Vercel, GitHub, PWA checklist

## Repo

`github.com/ismahdeismail-beep/dreamline` (public). Protected rules: WhatsApp-first
checkout (contact `0788256042`, normalized to `wa.me/254788256042`), single-number
contact, and no unused server-side dependencies.