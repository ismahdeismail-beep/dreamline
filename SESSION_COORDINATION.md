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
| `src/App.tsx` | — | — | free |
| `src/BookingPage.tsx` | — | — | free |
| `src/components/HeroSection.tsx` | — | — | free |
| `src/components/RoutesDirectory.tsx` | — | — | free |
| `src/components/Navbar.tsx` | — | — | free |
| `src/components/Footer.tsx` | — | — | free |
| `src/components/NextBusesBoard.tsx` | — | — | free |
| `src/components/SeatBookingModal.tsx` | — | — | free |
| `src/components/ManageTicketModal.tsx` | — | — | free |
| `src/components/MpesaModal.tsx` | — | — | free |
| `src/components/TicketModal.tsx` | — | — | free |
| `src/components/WhatsAppAddOn.tsx` | — | — | free |
| `src/components/OfficeContacts.tsx` | — | — | free |
| `src/components/FleetAndSafety.tsx` | — | — | free |
| `src/components/Button.tsx` | — | — | free |
| `src/components/CoachPhoto.tsx` | — | — | free |
| `src/data/dreamlineData.ts` | — | — | free |
| `src/hooks/useModalA11y.ts` | — | — | free |
| `src/main.tsx` | — | — | free |
| `index.html` | — | — | free |
| `public/service-worker.js` | — | — | free |
| `vercel.json` | — | — | free |
| `package.json` / lockfile | — | — | free — **do not prune deps without claiming** |
| `BUILD_NOTES.md` | — | — | append-only, never rewrite others' entries |
| `public/coaches/`, `public/*.png` | — | — | free |
| `README.md` | **session B** | 2026-10-04 22:40 | coach-photography section only; released in `f7a1c40` |
| `docs/PHOTO-LICENSING.md` | **session B** | 2026-10-04 22:40 | provenance findings |

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

## Current agreement

- **Single contact:** `0788256042` / `+254 788 256 042` is the only phone number and
  the only contact channel. No other numbers, no email addresses.
- **WhatsApp-first booking.** M-PESA STK stays disabled ("coming soon") until it is real.
- **No sign-in / auth** until the user asks for it. `My Ticket` is reference lookup.
- **Every "Book"-style control must reach `/book/:busId`** — no exceptions, no falling
  back to the results list.
- **Boxes must fit at 320–1440px**: no horizontal scroll, nothing under ~140px wide,
  and form inputs at 16px on phones so iOS Safari does not zoom on focus.