
## 2026-10-01 WhatsApp-first simplification
- Product rule set by user: site must stay as simple as possible; BEFORE configuring M-PESA STK, users must be connected to WhatsApp (0788256042) for further info.
- Commit 11aac35 pushed (cb35f67..11aac35).
- SeatBookingModal: single primary CTA "Continue on WhatsApp"; STK button removed; ID + email fields removed (name/phone optional prefills); validation = seats only.
- App.tsx: pendingMpesaData, handleProceedToMpesa, handlePaymentSuccess, MpesaModal import/render all removed. MpesaModal.tsx kept on disk, unwired, for future Daraja integration.
- BUG FIXED: buildWhatsAppLink emitted wa.me/0788256042 (local format WhatsApp rejects). Now normalizes leading 0 -> 254, so links are wa.me/254788256042.
- Footer claim changed from "Instant M-PESA STK" to "Easy M-PESA Payment / Pay after WhatsApp confirmation".
- Docs written: README.md rewritten, docs/ARCHITECTURE.md, docs/DEPLOYMENT.md (all reflect WhatsApp-first flow + STK as known gap).
- Verified: LINT_EXIT=0, BUILD_EXIT=0, PUSH_EXIT=0, DEPLOY_EXIT=0.
- New preview: https://dreamline-mhquyggki-ismahdeismail-beeps-projects.vercel.app

## 2026-10-01 Repo cleanup
- Commit 1329602 pushed (11aac35..1329602): 16 files, +184/-1884.
- Removed unused deps: @google/genai, express, dotenv, motion, tsx, @types/express, autoprefixer. Kept: esbuild (vite 8 needs it), @types/node (vite.config path/process), tailwindcss.
- Deleted bun.lock (0 bytes) and metadata.json (AI Studio leftover claiming MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API).
- Removed ~50 dead imports across 10 files via node scan script (script logic: parse import stmt, test each alias with \b word boundary against body excluding the import itself).
- package.json: name react-example -> dreamline; clean script now node -e rmSync (old m -rf was broken on Windows cmd).
- Bundle after cleanup: JS 333.43 kB (92.73 gzip), CSS 52.46 kB (8.93 gzip).
- Verified LINT_EXIT=0, BUILD_EXIT=0, PUSH_EXIT=0, DEPLOY_EXIT=0.
- New preview: https://dreamline-gq2mcbo0b-ismahdeismail-beeps-projects.vercel.app
- Kept intentionally: MpesaModal.tsx (future STK), .env.example (README refs), hero-2/3.jpg (manifest icons).

## CROSS-SESSION COORDINATION (2026-10-01 ~22:55, from session hidden-moon / zip\dreamline clone)
### Session map (opencode.db)
- ses_f07c "quick-lagoon" (parent, dir Dreamline/) -- OTHER MAIN SESSION, title "Errors and debugs fixing", owns light re-theme master plan.
- ses_f06fc "shiny-harbor" -- its subagent: "Update index.html + manifest with real logo + Lato" (IN PROGRESS), brand asset download done.
- ses_f0775 "glowing-meadow" -- its subagent: 7-step light re-theme (icons->index.html->index.css->components->fonts->declutter->verify), STEP 1 in progress.
- ses_f08f "hidden-moon" (dir Dreamline/zip) -- THIS session: docs, repo cleanup, WhatsApp-first checkout, contact numbers, Vercel deploys.
### Their pushed commit 7c258d8 (already on origin/main)
- Muted brass/gold @theme ramp, dark first-paint fix, hero bg class fix, service-worker rewrite (was broken: invalid /public/* precache globs), sentence-case eyebrow.
### Their UNCOMMITTED WIP in zip\dreamline (DO NOT TOUCH / DO NOT git add -A)
- M index.html, src/App.tsx, src/components/HeroSection.tsx, src/index.css + untracked public/favicon*.png, favicon.ico, apple-touch-icon.png, public/icons/
- Direction: FULL LIGHT RE-THEME -- bg #f9f8fc, text #17141f, brand indigo #34398e remapped over amber-* names, red #e52421 accent, Lato font (from dreamline.co.ke).
- Verified by me mid-flight: LINT_EXIT=0, BUILD_EXIT=0 on their WIP.
### Ownership agreement (read before editing!)
- Other session owns: theme/index.html/index.css/manifest/favicons/all component surfaces/declutter/screenshots/commit+deploy of re-theme.
- This session owns: docs (README, docs/ARCHITECTURE, docs/DEPLOYMENT), Vercel deploys of completed milestones, repo hygiene.
- Docs are currently STALE (still describe slate-950+amber dark theme, JPG manifest icons). Update them AFTER the re-theme commit lands.
- Protect: WhatsApp-first checkout rule (0788256042 before STK), buildWhatsAppLink 0->254 normalization, single-number contact rule.
- Supermemory unavailable (SUPERMEMORY_API_KEY not set) -- this file is the shared ledger instead.
