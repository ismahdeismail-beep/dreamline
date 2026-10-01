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

Single page, scroll-based navigation via anchor targets:

1. **Hero** — route search form, quick-route chips, amenity highlights
2. **Coach board** (`#next-buses`, wrapped by `#search-results`) — the single canonical
   departure listing, filtered by corridor and time of day
3. **Routes & fares directory** (`#routes`)
4. **Fleet & safety** (`#fleet`)
5. **Offices / terminals** (`#offices`)
6. Footer, floating WhatsApp hub, and modals (seat booking, M-PESA, ticket view, manage ticket)

## Key components

| Component | Role |
|---|---|
| `CoachPhoto` | 16:9 coach banner with seat-layout badge (`2+1` / `2+2` / `Sleeper`); degrades to a branded placeholder when no photo is set, so cards never render broken images |
| `NextBusesBoard` | Departure listing, corridor + time-of-day filters, empty state |
| `RoutesDirectory` | Route/fare cards |
| `FleetAndSafety` | Coach classes and safety protocols |
| `SeatBookingModal` | Seat selection → WhatsApp handoff |
| `WhatsAppAddOn` | Floating button + expandable enquiry hub |

## Coach photography

Coach banner photos live in `COACH_IMAGES` in `src/data/dreamlineData.ts` and are looked
up per coach type via `coachImageFor()`. The map is intentionally empty: candidate photos
must clear the quality bar before being wired.

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