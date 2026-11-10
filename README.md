# [AGENCY] Website

Award-level agency website. See [`plan.md`](plan.md) for the full blueprint.

| Part | Stack | Folder |
|---|---|---|
| Frontend | Astro 7 · Tailwind 4 · GSAP · Lenis · Three.js · React islands (Motion) | `web/` |
| Backend | PocketBase v0.40 extended in Go (`main.go`) | `backend/` |

## Requirements

- Node.js ≥ 22.23.4
- Go ≥ 1.27 (auto-downloaded toolchain is fine)
- Git

## Setup on a new computer (e.g. a partner), get the exact same site

The database is **not** in Git (it holds passwords and secret keys). Instead, the database **structure** is in `backend/migrations/` and all the **content** (services, scoper options, 12 example projects, 3 blog posts, cover images) is recreated by `web/scripts/seed.mjs`. Result: the same site, with your own admin account.

Windows PowerShell:

```powershell
git clone https://github.com/zouhairi1/agency.git
cd agency

# 1. Backend: create the database + your own admin account, then start it (keep this terminal open)
cd backend
go run . migrate up
go run . superuser upsert you@example.com "a-strong-password"
go run . serve                       # http://127.0.0.1:8090  ·  admin: http://127.0.0.1:8090/_/
```

In a **second terminal**:

```powershell
cd agency\web
copy .env.example .env
npm install
npx playwright install chromium      # used by the seed script to generate cover images

# 2. Load the content (use the admin account created above)
$env:PB_ADMIN_EMAIL="you@example.com"; $env:PB_ADMIN_PASSWORD="a-strong-password"
node scripts/seed.mjs

# 3. Start the website
npm run dev                          # http://localhost:4321  (English: /en/)
```

To get the latest changes later: `git pull`, then re-run `node scripts/seed.mjs` if content changed, and restart both terminals.

## Run locally

**1. Backend (PocketBase)**: terminal 1

```bash
cd backend
cp .env.example .env          # optional locally
go run . serve                # http://127.0.0.1:8090  ·  admin: http://127.0.0.1:8090/_/
```

`go run` enables **automigrate**: collection changes you make in the dashboard are written to `backend/migrations/` so they can be committed.

Create an admin account (first time):

```bash
go run . superuser upsert you@example.com "a-strong-password"
```

**2. Frontend (Astro)**: terminal 2

```bash
cd web
cp .env.example .env
npm install
npm run dev                   # http://localhost:4321
```

Content is loaded from PocketBase **at build/dev start**. After adding content in the dashboard, restart `npm run dev` (in production, the rebuild webhook does this automatically).
While collections are empty, the site shows fallback content from `web/src/data/site.ts`.

## Fill PocketBase with starter content

Loads 5 services, the project scoper options, 12 **example** projects and 3 blog articles (FR + EN), with generated cover images. Safe to run again (updates by slug). PocketBase must be running.

```powershell
cd web
$env:PB_ADMIN_EMAIL="you@example.com"; $env:PB_ADMIN_PASSWORD="your-password"
node scripts/seed.mjs
```

The example projects are marked "(concept)": replace them with real case studies in the dashboard.

## Visual check (screenshots)

```powershell
cd web
npm run build; npm run preview -- --port 4399   # terminal A
node scripts/screenshots.mjs screenshots          # terminal B → desktop + mobile PNGs
node scripts/mobile-audit.mjs audit               # phone/tablet check: sideways scroll, small tap targets, tiny text
```

`mobile-audit.mjs` emulates a real **touch** phone (360 / 390 / 768 px). Always test with touch: some bugs only appear without a mouse.

## Build

```bash
# backend: single binary
cd backend && go build -o pocketbase .

# frontend: static site in web/dist
cd web && npm run build
```

## How content flows

```
PocketBase dashboard (/_/) ──edit──▶ Go hook (rebuild.go, debounced 30s) ──▶ DEPLOY_HOOK_URL
                                                                              │
Astro build ◀── pbLoader (src/lib/pbLoader.ts) ◀── PocketBase REST API ◀──────┘
```

Forms (`ContactForm.tsx`) post directly to `/api/collections/leads/records`.
Go hooks then verify Turnstile, email the team + auto-reply, and forward the lead to the CRM webhook.

## Project map

```
backend/
  main.go                 hook registration
  hooks/                  turnstile, leads (emails), crm, rebuild
  hooks/templates/        email HTML templates
  migrations/             version-controlled schema (13 collections + rate limits)
web/src/
  content.config.ts       PocketBase collections → Astro content
  layouts/BaseLayout.astro
  components/layout/      Header, Footer, Curtain (page transition), Cursor
  components/sections/    Homepage sections
  components/islands/     ContactForm, ContactDrawer (React + Motion)
  scripts/motion/         GSAP/Lenis lifecycle + data-attribute modules
  scripts/webgl/          Three.js hero blob, shaders, dispose helpers
```

## Motion data attributes

| Attribute | Effect |
|---|---|
| `data-reveal="lines\|words\|fade"` | Reveal on scroll (`data-reveal-immediate`, `data-reveal-delay`) |
| `data-scrub-words` | Words light up with scroll |
| `data-media-reveal` | Clip-path media reveal |
| `data-parallax="10"` | Parallax (yPercent) |
| `data-counter data-value="120"` | Count-up |
| `data-marquee="35"` + `data-marquee-track` | Velocity-reactive marquee |
| `data-horizontal` + `data-horizontal-track` | Pinned horizontal scroll (desktop) |
| `data-magnetic="0.3"` | Magnetic hover |
| `data-hover-preview` + `data-preview-src` | Cursor-following image preview |
| `data-cursor="view\|drag\|play\|hidden"` | Custom cursor state |
| `data-open-contact` | Opens the global contact drawer |
| `data-transition="morph"` | Skip curtain → native shared-element transition |

All motion respects `prefers-reduced-motion`.
