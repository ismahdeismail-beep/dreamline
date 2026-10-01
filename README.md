# Dreamline

**Kenyan luxury long-distance coach booking — search routes, reserve seats, pay with M-PESA, and manage e-tickets, all in the browser.**

[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646cff)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)](https://tailwindcss.com)

> Live preview: **https://dreamline-qq90b2ie6-ismahdeismail-beeps-projects.vercel.app**

---

## Features

- **Route search** — pick departure/arrival city, date, passenger count and coach tier; results filter against the sample schedule data.
- **Seat selection** — interactive seat map per coach with live fare calculation (Standard vs VIP Recliner).
- **WhatsApp-first checkout** — select seats, then continue to WhatsApp where the booking desk confirms availability and sends M-PESA payment instructions. (M-PESA STK push is **not** live yet — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#known-gaps).)
- **E-ticket & boarding pass** — printable ticket view with seat, pickup/dropoff, and payment details (demo tickets).
- **Ticket management** — retrieve and re-open tickets by ID; demo tickets are pre-loaded.
- **WhatsApp integration** — floating chat hub plus contextual "enquire" buttons that pre-fill route-specific messages.
- **Routes directory** — full list of corridors and fares with quick-select.
- **Live "next buses" board** — departures with seat availability indicators.
- **Fleet & safety** — amenity and compliance highlights.
- **Office contacts** — physical booking terminals and office locations.
- **PWA** — web app manifest + service worker for installability and basic offline caching.

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript 7 |
| Build | Vite 8 (rolldown) |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| Icons | lucide-react |
| Animation | motion |
| Fonts | Outfit, Plus Jakarta Sans (Google Fonts) |
| Hosting | Vercel |
| Optional (not yet wired) | `@google/genai`, express, dotenv |

> **Note:** `@google/genai`, `express`, and `dotenv` are declared in `package.json` but no code imports them yet — there is no server and no Gemini feature in the current client. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#known-gaps).

## Prerequisites

- **Node.js 20+** (developed on v24.17.0)
- **npm 11+** (developed on 11.19.0)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional today, required once Gemini features land)
cp .env.example .env.local
# then edit .env.local and set GEMINI_API_KEY=<your key>

# 3. Start the dev server (http://localhost:3000)
npm run dev
```

The app runs fully client-side — it works even without a Gemini key.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server on port **3000**, bound to `0.0.0.0` |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Type-check only (`tsc --noEmit`) |
| `npm run clean` | Remove `dist/` and `server.js` |

## Project structure

```
dreamline/
├── index.html                 # HTML shell, fonts, manifest link, root div
├── public/
│   ├── manifest.json          # PWA manifest (install metadata + icons)
│   ├── service-worker.js      # Offline cache service worker
│   └── images/                # Hero imagery
├── src/
│   ├── main.tsx               # React entry + service worker registration
│   ├── App.tsx                # Root component — owns all app state
│   ├── index.css              # Tailwind entry
│   ├── data/
│   │   └── dreamlineData.ts   # Types, sample schedules, routes, offices, helpers
│   └── components/
│       ├── Navbar.tsx             # Top navigation + manage-ticket entry
│       ├── HeroSection.tsx        # Headline + search form + corridor chips
│       ├── NextBusesBoard.tsx     # Live departures board
│       ├── RoutesDirectory.tsx    # All routes & fares
│       ├── FleetAndSafety.tsx     # Fleet / safety highlights
│       ├── OfficeContacts.tsx     # Physical terminals & offices
│       ├── Footer.tsx             # Footer + quick actions
│       ├── WhatsAppAddOn.tsx      # Floating WhatsApp button + chat hub
│       ├── SeatBookingModal.tsx   # Seat map + passenger details → WhatsApp handoff
│       ├── MpesaModal.tsx         # M-PESA STK checkout (kept, NOT wired yet)
│       ├── TicketModal.tsx        # E-ticket / boarding pass view
│       └── ManageTicketModal.tsx  # Retrieve & list existing tickets
├── docs/
│   ├── ARCHITECTURE.md        # Component map, state flow, data model
│   └── DEPLOYMENT.md          # Vercel deploy, PWA, env setup
└── package.json
```

## Environment variables

| Variable | File | Status | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | `.env.local` | **Placeholder only** | Reserved for future Gemini-powered features. Not read by any code today. |

`.env.local` is gitignored (`.env*` in `.gitignore`) — never commit real keys.

## How booking works

```
Search (HeroSection)
   → filter SAMPLE_SCHEDULES (App.tsx)
   → "Select Seat" opens SeatBookingModal
   → pick seat(s), optionally add name + phone
   → "Continue on WhatsApp"
        → wa.me deep link with full booking summary (route, seats, fare)
        → booking desk confirms seats + sends M-PESA payment instructions
```

The site deliberately keeps this path simple: **users are connected to the WhatsApp number (`0788256042`) for further info before any payment happens.** Online M-PESA STK push will be wired in later once the Daraja integration is configured.

Demo tickets are viewable via "Manage Ticket" but live only in React state — a page refresh resets them to the demo set. There is no backend database.

## Theming

- Dark-first design: `slate-950` background with a **single amber accent** (`amber-400/500`) for CTAs, prices, and highlights.
- WhatsApp surfaces (`WhatsAppAddOn.tsx`) and the M-PESA modal keep their brand greens deliberately.
- Tailwind v4 is configured purely through the Vite plugin — there is no `tailwind.config.js`.

## Contact

**Dreamline reservations (WhatsApp / phone):** `0788256042`

All contact numbers across the app are standardized to this single number.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — components, state management, data model, booking flow
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Vercel deployments, PWA setup, environment config

## License

Private project — all rights reserved.
