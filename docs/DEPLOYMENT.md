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
├── index.html                 (~1.6 kB)
├── assets/index-*.css         (~55 kB, ~9 kB gzip)
├── assets/index-*.js          (~343 kB, ~95 kB gzip)
├── manifest.json              (PWA manifest)
├── service-worker.js          (offline cache worker)
└── images/                    (hero imagery)
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

- **Manifest:** `public/manifest.json` — linked from `index.html` via `<link rel="manifest">`.
- **Service worker:** `public/service-worker.js`, registered in `src/main.tsx` on `window.load`.
- **Icons:** currently points at the hero JPGs. For proper install prompts, provide purpose-built icons:
  - `public/icons/icon-192.png` (192×192)
  - `public/icons/icon-512.png` (512×512)
  - optional `maskable-512.png` for Android adaptive icons

  Then update the `icons` array in `manifest.json` and re-deploy.

After changing the manifest or service worker, hard-refresh (or unregister the old SW) — cached copies can persist.

## Post-deploy checklist

1. `npm run lint` → exit 0
2. `npm run build` → exit 0
3. Push to `origin/main`
4. `vercel deploy -y --no-wait` (or let Git integration handle it)
5. Smoke-test: search a route → select seat → "Continue on WhatsApp" opens `wa.me/254788256042` (local format `0788256042`)
