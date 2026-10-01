# Deployment

How to build, deploy, and configure Dreamline.

## Local build

```bash
npm install       # install dependencies
npm run lint      # type-check (tsc --noEmit)
npm run build     # production bundle → dist/
npm run preview   # serve dist/ locally
```

Build output:

```
dist/
├── index.html                      (~1.8 kB)
├── assets/index-*.css              (~47 kB, ~8 kB gzip)
├── assets/index-*.js               (~325 kB, ~91 kB gzip)
├── manifest.json                   (PWA manifest)
├── service-worker.js               (offline cache worker)
├── logo.png                        (brand logo, ~124 kB)
├── android-chrome-192x192.png      (PWA icon)
├── android-chrome-512x512.png      (PWA icon)
├── apple-touch-icon.png
├── favicon.ico / favicon-16x16.png / favicon-32x32.png
├── amenities/                      (official amenity icons)
├── brand/                          (brand asset library)
└── images/                         (hero imagery)
```

## Vercel

The project is deployed on Vercel under the `dreamline` project.

### Prerequisites

- Vercel CLI (`npm i -g vercel`)
- A Vercel access token (stored outside the repo; export it per-shell, never commit it)

### Deploy a preview

```powershell
# PowerShell — set the token for this shell only
$env:VERCEL_TOKEN = "<your token>"

vercel deploy -y --no-wait
```

Notes learned the hard way:

- `vercel whoami` hangs in this environment — don't use it as a health check.
- Always pass the token via `VERCEL_TOKEN` env var; `--token` on the command line is unreliable here.
- The repo's `.vercel/` directory is linked to project `ismahdeismail-beeps-projects/dreamline`.

### Production

`git push origin main` triggers the production deployment when Vercel's Git integration is connected. Otherwise promote a preview with `vercel promote`.

## GitHub

The repo is `ismahdeismail-beep/dreamline` (public).

- The default authenticated account may not have push rights — switch with:
  ```powershell
  gh auth switch --user ismahdeismail-beep
  git push origin main
  gh auth switch --user <your-account>   # switch back afterwards
  ```
- Set `GIT_TERMINAL_PROMPT=0` and `GCM_INTERACTIVE=never` to avoid credential prompts hanging CI-style runs.

## Environment variables

| Variable | Where | Status |
|---|---|---|
| `GEMINI_API_KEY` | `.env.local` (gitignored) | Placeholder — not read by any code yet |

`.env.local` is ignored via the `.env*` rule in `.gitignore`. For Vercel, add env vars in the project dashboard (Settings → Environment Variables) — nothing is required to run the current client.

## PWA

- **Manifest:** `public/manifest.json` — linked from `index.html` via `<link rel="manifest">`. Theme color `#34398e`, background `#f9f8fc`.
- **Service worker:** `public/service-worker.js`, cache name `dreamline-pwa-v3`. Registered in `src/main.tsx` on `window.load` **in production only** — do not enable in dev, or Vite modules get cached and changes stop showing up.
- **Icons:** the manifest points at real 192×192 and 512×512 PNGs (`android-chrome-192x192.png`, `android-chrome-512x512.png`, both `purpose: "any maskable"`), so install prompts render correctly. This replaces an earlier setup that pointed at hero JPGs.
- **After any manifest or service-worker change**, bump the `CACHE_NAME` in `service-worker.js` and hard-refresh (or unregister the old worker) — cached copies persist aggressively.
- `logo.png` is precached by the service worker.

## Post-deploy checklist

1. `npm run lint` → exit 0
2. `npm run build` → exit 0
3. Push to `origin/main`
4. `vercel deploy -y --no-wait` (or let Git integration handle it)
5. Smoke-test: search a route → coach board filters to the matching corridor → select seat → "Continue on WhatsApp" opens `wa.me/254788256042` (local format `0788256042`)
6. Verify no horizontal overflow at 390 px and zero console errors
7. Confirm the service worker registered and `/logo.png` resolves in the deployed build
