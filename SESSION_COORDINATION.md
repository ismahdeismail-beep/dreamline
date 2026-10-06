# Session Coordination

Two AI sessions may work in this repo at the same time. This file is the shared
channel so they do not overwrite each other's work.

## Hard rules

1. **Never `git add -A`, `git add .`, or `git commit -a`.** Stage explicit paths
   only. A blind add will sweep another session's in-progress edits into your commit.
2. **Never `git reset --hard`, `git checkout -- .`, `git clean -fd`, or `git stash`
   without checking this file first.** These destroy other sessions' uncommitted work.
3. **Check `git status` before staging.** If you see modified files you did not
   touch, another session owns them. Leave them alone and note it below.
4. **Rebase/pull before committing** if the branch moved while you worked — the other
   session may have committed in between.
5. **Commit message should name your scope**, e.g. `feat(booking): ...`, so the other
   session can tell whose work landed.

## File ownership

Claim files here before editing them. Clear the claim in the same commit that lands
the change. Unclaimed = free to edit.

| File | Claimed by | Since | Note |
|------|-----------|-------|------|
| `src/App.tsx` | **session C** | 2026-10-06 | persistence + M-PESA wiring + seat holds |
| `src/BookingPage.tsx` | **session C** | 2026-10-06 | M-PESA CTA, seat chips, seat-map entry (session A's dock work landed in `0f99e9a`) |
| `src/components/HeroSection.tsx` | — | — | free — session A's Today/Tomorrow field landed in `0f99e9a` |
| `src/components/RoutesDirectory.tsx` | — | — | free |
| `src/components/Navbar.tsx` | — | — | free |
| `src/components/Footer.tsx` | — | — | free |
| `src/components/NextBusesBoard.tsx` | **session C** | 2026-10-06 | inventory-driven seat counter |
| `src/components/SeatMapModal.tsx` | **session C** | 2026-10-06 | renamed from `SeatBookingModal.tsx`, now a seat picker opened from `/book/:busId` |
| `src/components/ManageTicketModal.tsx` | **session C** | 2026-10-06 | deduped search against `allTickets` |
| `src/components/MpesaModal.tsx` | **session C** | 2026-10-06 | real STK push + status polling |
| `src/components/TicketModal.tsx` | — | — | free |
| `src/components/WhatsAppAddOn.tsx` | — | — | free |
| `src/components/OfficeContacts.tsx` | — | — | free |
| `src/components/FleetAndSafety.tsx` | — | — | free |
| `src/components/Button.tsx` | — | — | free |
| `src/components/CoachPhoto.tsx` | — | — | free |
| `src/data/dreamlineData.ts` | **session C** | 2026-10-06 | seat inventory helpers; `COACH_IMAGES`/`coachImageFor` deleted |
| `src/lib/ticketStore.ts` | **session C** | 2026-10-06 | new file — localStorage ticket persistence |
| `api/mpesa.js` | **session C** | 2026-10-06 | new file — Daraja STK push/query endpoint |
| `src/hooks/useModalA11y.ts` | — | — | free |
| `src/main.tsx` | — | — | free |
| `index.html` | — | — | free |
| `public/service-worker.js` | — | — | free |
| `vercel.json` | — | — | free — untouched (already excludes `api/`) |
| `package.json` / lockfile | — | — | free — **do not prune deps without claiming** |
| `.env.example` | **session C** | 2026-10-06 | Daraja variables documented |
| `README.md` | **session C** | 2026-10-06 | was released by session B in `ac9f9c3`; re-claimed to correct stale photo/M-PESA notes |
| `docs/ARCHITECTURE.md` | **session C** | 2026-10-06 | known-gaps + booking-flow rewrite |
| `docs/DEPLOYMENT.md` | **session C** | 2026-10-06 | env vars + post-deploy checklist |
| `docs/PHOTO-LICENSING.md` | session B | 2026-10-04 22:40 | provenance findings — still open; session C appended resolution notes only |
| `BUILD_NOTES.md` | — | — | append-only, never rewrite others' entries (file does not exist yet) |
| `public/coaches/`, `public/*.png` | — | — | free |

## Live edits vs claims (collision warning)

The table above said "free" while these files were **actively being edited**. Claims are
only useful if they are registered *before* the first write:

| File | Actually being edited by | Claim was |
|------|---------------------------|-----------|
| `src/App.tsx` | session A | never claimed |
| `src/components/HeroSection.tsx` | session A | never claimed |
| `src/components/RoutesDirectory.tsx` | session A | never claimed |

Session B did not touch these and has baseline hashes on record to prove it. Register
claims up front, or the table will keep saying "free" for files that are not.

## Session log

Append one line per commit. Newest last.

- `f192c04` — session A — hero crossfading coach watermark.
- `9108458` — session B — complete booking wiring, fix mojibake, prune unused deps.
  *(absorbed session A's uncommitted layout/booking edits; verified they survived.)*
- `f6359c6`, `ac9f9c3` — session B — coach photo provenance / licensing notes.
- `1f5471e` — session A — every Book control reaches `/book/:busId`; swap-button
  `col-span-2` was squeezing hero fields to ~107px on a 320px phone; Routes input
  16px on phones. Verified 19/19 desktop bookables land on the booking page and
  no box is under 140px at 320–1440px.
- `21562a2` — session C — seat inventory derived from schedule data (seeded PRNG,
  not the old hard-coded set); `SeatBookingModal` → `SeatMapModal` opened from
  `/book/:busId` (the old modal was unreachable); localStorage ticket persistence;
  real Daraja STK flow behind the new `api/mpesa.js`, disabled until `DARAJA_*` is
  set; dead `COACH_IMAGES` fallback removed; ARCHITECTURE/README/DEPLOYMENT/
  PHOTO-LICENSING corrected. E2E: seat pick → STK poll → persisted ticket → seat
  still held after reload.
- `21caacd` — session C — booking, M-PESA and Manage Ticket inputs raised to 16px
  on phones per the agreement below.

## Current agreement

- **Single contact:** `0788256042` / `+254 788 256 042` is the only phone number and
  the only contact channel. No other numbers, no email addresses.
- **WhatsApp-first booking.** M-PESA STK stays disabled ("coming soon") until it is real.
  *Satisfied as of `21562a2`: the STK flow is real and server-verified, and it keeps
  itself disabled whenever the `DARAJA_*` credentials are absent — so WhatsApp remains
  the default path.*
- **No sign-in / auth** until the user asks for it. `My Ticket` is reference lookup.
- **Every "Book"-style control must reach `/book/:busId`** — no exceptions, no falling
  back to the results list.
- **Boxes must fit at 320–1440px**: no horizontal scroll, nothing under ~140px wide,
  and form inputs at 16px on phones so iOS Safari does not zoom on focus.