# plan.md: Agency Website Master Blueprint

> The master plan for building a premium, award-level website for a software development and creative agency.
> Replace `[AGENCY]` with the final brand name.
>
> **Stack:** [Astro](https://astro.build/) (frontend) + [PocketBase](https://pocketbase.io/) extended in Go via `main.go` (database, CMS admin, API, file storage).

---

## 0. Business Rules (decided 2026-11-10, override anytime)

| Rule | Implementation |
|---|---|
| **Positioning (2-person team)** | **Main market:** direct-booking websites for riads, hotels, guest houses and tourism businesses in Morocco (homepage). **Second offer:** white-label development for agencies in France/Europe (`/white-label`). Packaged offers: Site Vitrine · Réservation directe · Maintenance & croissance (monthly). "2 founders, one single contact" is a selling point. Only 4 niche-relevant demo projects are published until real case studies exist. |
| **Two markets: Morocco + international** | Bilingual site: **French by default** at `/` (Morocco, France, francophone Africa), **English** at `/en/` (rest of the world). Arabic can be added later as a third locale. The form asks "In Morocco / Outside Morocco (+ country)" and leads are tagged `[MA]` / `[INTL]` in notification emails. |
| **No prices anywhere public** | No price ranges, no budget question. Every project is quoted **only after reading the client's CDC (cahier des charges) or after a meeting**. The `leads.budget` field is internal and filled by the team after the meeting. |
| **CDC-first conversion** | The form asks "Do you have a CDC?" → **Yes**: upload it (PDF/Word/ZIP, 15 MB, stored as a protected file). **Not yet**: choose a meeting type (in person in Morocco / video / phone). The auto-reply email (FR or EN) explains the next step. |
| **Brand** | Accent colour **Majorelle blue** (`#4f46e5` light / `#5850ec` dark), a nod to Marrakech's Jardin Majorelle. Logo = 8-pointed **zellige star** with an open centre (`web/src/components/ui/Logo.astro`, `public/favicon.svg`). **Light & dark mode** with a header switch: follows the system by default, remembers the visitor's choice. All colours are theme tokens in `web/src/styles/global.css`. |
| **Simple, calm motion** | Page changes = a short 0.25 s fade of the content only (header/footer stay still). No full-screen curtain, no custom cursor, no pinned horizontal scroll, no WebGL on phones. Keep: text reveals, smooth scroll, subtle hovers, small hero blob on desktop. |
| **No fake proof** | Placeholder projects, stats and testimonials appear only in local dev. On the live site those sections stay hidden until real content is added in PocketBase. |

## Table of Contents

1. [Competitor Research & Animation Analysis](#1-competitor-research--animation-analysis)
2. [Brand Positioning & Design Principles](#2-brand-positioning--design-principles)
3. [Site Map & User Journey](#3-site-map--user-journey)
4. [Content Strategy](#4-content-strategy)
5. [Tech Stack](#5-tech-stack)
6. [Project Directory Structure](#6-project-directory-structure)
7. [Homepage: Section-by-Section Breakdown](#7-homepage-section-by-section-breakdown)
8. [Inner Pages Breakdown](#8-inner-pages-breakdown)
9. [Animation & Micro-Interaction Catalogue](#9-animation--micro-interaction-catalogue)
10. [Animation Tooling Map (GSAP vs Framer Motion vs WebGL)](#10-animation-tooling-map)
11. [Performance & Accessibility Budget](#11-performance--accessibility-budget)
12. [SEO, Analytics & Conversion Tracking](#12-seo-analytics--conversion-tracking)
13. [Build Roadmap & Milestones](#13-build-roadmap--milestones)
14. [Launch Checklist](#14-launch-checklist)

---

## 1. Competitor Research & Animation Analysis

### 1.1 Reference Agencies to Study (Awwwards / CSSDA / FWA tier)

| Agency type | What to study | Signature movement pattern |
|---|---|---|
| Creative-dev studios (e.g., Active Theory, Locomotive, Lusion, Resn) | Immersive WebGL heroes, custom cursors | 3D scenes that react to scroll and pointer |
| Product/dev agencies (e.g., Ueno-style, Instrument, Basic/Dept) | Case-study storytelling, clear service architecture | Pinned scroll narratives, staggered text reveals |
| Boutique digital studios (e.g., Obys, Dogstudio, Immersive Garden) | Typography as the hero, editorial layouts | Split-text reveals, smooth scroll, page-transition masks |
| SaaS-grade dev shops (e.g., Linear-style marketing, Vercel-style) | Clarity, speed, trust signals | Subtle gradients, micro-interactions, glow and spotlight hovers |

> Do a live research pass on Awwwards "Sites of the Day" filtered by *Agency* and *Portfolio* before design kickoff. Capture 10 to 15 references in a shared moodboard (Figma or Milanote) and tag each with the pattern it shows.

### 1.2 Common Site Structure Across Winners

```
Home → Work (Case Studies) → Services/Capabilities → About/Studio → Insights/Journal → Careers → Contact
```

- **Home** acts as a highlight reel: bold statement, best work, services, proof, CTA.
- **Work** is the core conversion engine. Every top agency puts case studies first.
- **Services** are framed as *outcomes* ("Launch an MVP in 8 weeks"), not tasks.
- **About** builds credibility through people, process, values and culture.
- **Contact** is usually a short form or a guided brief builder, never a long form.

### 1.3 How Winners Use "Movement"

| Category | Patterns observed |
|---|---|
| **Scroll-triggered** | Line-by-line text reveals (mask + translateY), pinned sections with horizontal scroll, parallax images, scale-up media on enter, scroll-scrubbed video or 3D |
| **Page transitions** | Full-screen color wipes, shared-element morphs (thumbnail grows into case hero), curtain or mask reveals, fade + slight scale |
| **Hover states** | Magnetic buttons, custom cursor that morphs ("View", "Drag", "Play"), image-reveal-on-hover lists, distortion shaders on images, underline draw-ins |
| **Ambient** | Marquee tickers, noise/grain overlays, slowly morphing gradient blobs, WebGL particle fields |
| **Loading** | Branded preloader with counter (0 to 100), logo draw-on, intro sequence that hands off to the hero |

### 1.4 Core Trust & Conversion Sections

1. **Bold value proposition**: one sentence covering who you help and what outcome you deliver.
2. **Selected work**: 3 to 6 flagship case studies with measurable results.
3. **Client logos**: a recognisable-brands strip.
4. **Metrics / impact numbers**: e.g., "120+ products shipped", "4.9 Clutch rating".
5. **Testimonials**: real names, titles and photos (video if possible).
6. **Process**: a 4 to 5 step "How we work" that lowers perceived risk.
7. **Awards & press**: Awwwards, Clutch, CSSDA, featured-in badges.
8. **Team / humans**: faces build trust far more than stock imagery.
9. **Tech expertise**: a stack grid (React, Next.js, Node, AWS and so on).
10. **Repeated CTA**: a "Start a project" CTA in the nav, mid-page and footer.
11. **Interactive scope calculator / project estimator**: visitors pick a project type, features and timeline, and see an estimated range. It qualifies the lead *before* contact and increases time on site.
12. **Global contact drawer + WhatsApp**: contact opens as a slide-out drawer or full-screen modal from any page (no page reload), with a direct WhatsApp option for zero-friction contact.

### 1.5 Key Lessons from the Benchmark

- **The site itself is the proof.** Agencies such as Locomotive, Immersive Garden, Active Theory, Resn and Noomo use their own website as their strongest case study. Its quality *is* the sales pitch.
- **WebGL is optional; precision is not.** Immersive Garden and Active Theory win with spatial WebGL scenes. Locomotive wins with oversized typography and very precise DOM transitions. Both reach a steady 60fps on desktop and mobile.
- **Smooth scrolling, never scrolljacking.** *Scrolljacking* changes the speed, direction or mapping of the user's scroll and traps them. It hurts accessibility and raises bounce rates. *Smooth scrolling* (Lenis) only eases the native input, keeps the real scrollbar and respects OS settings. We use Lenis + ScrollTrigger `scrub` only.
- **Controlled friction can differentiate.** Noomo (a Site of the Year winner) used an unexpected upward scroll from hero to work. User testing showed higher engagement and recall. A novel navigation moment is allowed **only if** it is user-tested, keyboard-accessible and disabled under reduced motion. Limit it to one signature moment at most.
- **A concept behind the visuals.** Noomo's "pixels and glass" idea (pixels = digital craft, glass = transparency with clients) shows how a brand metaphor can drive every visual choice. Define our own metaphor in Phase 0.

---

## 2. Brand Positioning & Design Principles

### 2.1 Positioning Statement (draft)

> **[AGENCY] is a design-led engineering studio that builds fast, beautiful digital products for ambitious startups and brands.**

### 2.2 Design Principles

1. **Motion with meaning.** Every animation guides attention or communicates state. Nothing is decorative only.
2. **Typography first.** Large, confident display type is the main visual.
3. **Performance is a feature.** A premium feel must never cost speed (Lighthouse ≥ 90).
4. **Show, don't tell.** Real work, real results, real people.
5. **Accessible by default.** Respect `prefers-reduced-motion`, keyboard navigation and contrast.
6. **Smooth, never hijacked.** The scroll stays the user's. We ease it but never change its speed, direction or mapping.
7. **Pace the cognitive load.** Alternate intense visual moments (hero, work) with calm typographic moments (manifesto, process) so the page breathes.

### 2.3 Visual Language

| Token | Recommendation |
|---|---|
| Palette | Near-black `#0A0A0A`, off-white `#F4F2EE`, one electric accent (e.g., `#5B5BFF` or `#C6FF3D`), plus neutral greys |
| Display font | Variable grotesk (e.g., *PP Neue Montreal*, *Satoshi*, *General Sans*) |
| Body font | *Inter* / *Geist* |
| Mono (code accents) | *JetBrains Mono* / *Geist Mono* |
| Grid | 12 columns, 24px gutter (desktop); 4 columns, 16px gutter (mobile) |
| Radius | 0 to 4px (editorial) or 16 to 24px (product/soft). Pick one and stay consistent |
| Texture | Subtle film grain overlay (2 to 4% opacity) |
| Theme | Dark-first with a light mode toggle (optional) |

---

## 3. Site Map & User Journey

### 3.1 Site Map

```
/
├── /work                       → Case study index (filterable)
│   └── /work/[slug]            → Individual case study
├── /services                   → Services overview
│   └── /services/[slug]        → Service detail (Web, Mobile, Product Design, AI, Branding)
├── /about                      → Studio, team, values, process
├── /insights                   → Blog / journal
│   └── /insights/[slug]        → Article
├── /careers                    → Open roles + culture
│   └── /careers/[slug]         → Role detail
├── /contact                    → Project brief form + booking
├── /privacy                    → Legal
├── /terms                      → Legal
└── /404                        → Playful, animated not-found page
```

### 3.2 Primary User Journey (Hero → Contact)

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ 1. HOOK      │ → │ 2. PROOF     │ → │ 3. CLARITY   │ → │ 4. TRUST     │
│ Hero         │   │ Selected Work│   │ Services     │   │ Logos, Stats │
│ statement    │   │ + results    │   │ + Process    │   │ Testimonials │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
                                                                  ↓
                   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
                   │ 7. CONVERT   │ ← │ 6. INTENT    │ ← │ 5. HUMANISE  │
                   │ Contact form │   │ Big CTA      │   │ Team/Culture │
                   │ / book call  │   │ "Let's talk" │   │ Awards       │
                   └──────────────┘   └──────────────┘   └──────────────┘
```

**Visitor mindset at each stage:**

| Stage | Visitor question | Our answer |
|---|---|---|
| Hook | "Is this for me?" | A clear headline plus a striking visual in under 3 seconds |
| Proof | "Can they actually do it?" | Case studies with outcomes |
| Clarity | "What exactly do they offer?" | Outcome-based services |
| Trust | "Do others trust them?" | Logos, numbers, testimonials |
| Humanise | "Will I like working with them?" | Team, process, culture |
| Intent | "What's the next step?" | One obvious CTA |
| Convert | "Is this easy?" | A short, guided, friendly form |

### 3.2.1 Scroll-Depth Pacing (Homepage)

Visitors move through four states: **visual awe → intellectual alignment → empirical trust → actionable desire.**

| Scroll depth | Phase | Sections | Cognitive load | Goal |
|---|---|---|---|---|
| 0–15% | **Hook** | Preloader, Hero | High visual / low text | "This is a premium, highly capable studio" |
| 15–30% | **Alignment** | Manifesto | Calm, typographic | Shared worldview and approach |
| 30–60% | **Evidence** | Selected Work, Logos, Stats | High visual, invites lingering | Proof of competence |
| 60–80% | **Logic** | Services, Process, **Scope Calculator** | Interactive, rational | Visitor moves from watching to participating; lead self-qualifies |
| 80–100% | **Conversion** | Testimonials, CTA, oversized footer | Low friction | Contact with zero friction (drawer, form, WhatsApp, booking) |

### 3.3 Secondary Journeys

- **Recruiter / candidate:** Home → About → Careers → Role → Apply.
- **Researcher / SEO visitor:** Insights article → related case study → Contact.
- **Returning lead:** Direct to /work or /contact (sticky nav CTA).

---

## 4. Content Strategy

### 4.1 Voice & Tone

- Confident, concise, human. No jargon soup.
- Lead with **outcomes**, then **capabilities**.
- Use active verbs: *Build, Launch, Scale, Ship*.

### 4.2 Content Pillars

| Pillar | Formats | Where it lives |
|---|---|---|
| Craft (work) | Case studies, process breakdowns | /work |
| Expertise | Technical articles, guides | /insights |
| Culture | Team spotlights, behind the scenes | /about, /careers |
| Results | Metrics, testimonials, awards | Global components |

### 4.3 Case Study Template (every project)

1. Hero: project title, client, one-line result, hero media (video loop)
2. Meta: industry, services, timeline, stack, live link
3. The Challenge (2 to 3 short paragraphs)
4. The Approach: strategy, design, engineering
5. Visual showcase: full-bleed images, device mockups, video
6. Tech highlights: architecture, notable solutions
7. Results: 3 to 4 big numbers (e.g., "+212% conversions")
8. Client testimonial
9. Next project: large teaser with page transition

### 4.4 Content Inventory Needed Before Build

- [ ] 6 or more case studies (copy, metrics, 10 to 20 assets each)
- [ ] 5 service descriptions
- [ ] 8 to 12 client logos (SVG, monochrome)
- [ ] 4 to 6 testimonials (name, role, photo)
- [ ] Team photos (consistent lighting and background)
- [ ] Hero reel / showreel video (15 to 30s loop, compressed)
- [ ] 3 launch articles for /insights
- [ ] Award badges and press mentions

---

## 5. Tech Stack

### 5.0 Architecture Overview

```
                ┌────────────────────────────────────────────┐
  Editors ───►  │  PocketBase (Go binary, built from main.go)│
  (/_/ admin)   │  • SQLite database (collections)           │
                │  • REST API + realtime                     │
                │  • File storage (images, videos, CVs)      │
                │  • Go hooks: leads email, Turnstile check, │
                │    rebuild webhook, CRM sync               │
                └───────────────┬────────────────────────────┘
                                │ build-time fetch (Content Layer loader)
                                │ + runtime POST (contact / careers forms)
                                ▼
                ┌────────────────────────────────────────────┐
  Visitors ───► │  Astro site (static HTML, islands only     │
                │  where interaction needs JS)               │
                │  GSAP · Lenis · Three.js · View Transitions│
                └────────────────────────────────────────────┘
```

- **Astro renders every page statically at build time.** It pulls content from PocketBase through a custom Content Layer loader, which gives near-zero JS and the best possible Core Web Vitals.
- **PocketBase is the single backend.** It holds the database, the admin UI for editing content, the file/media storage and the form endpoints.
- **Content publishing:** a Go hook in `main.go` fires on every create/update/delete in content collections and calls the hosting provider's deploy hook (or GitHub `repository_dispatch`) to rebuild the site.
- **Forms:** the browser POSTs directly to the PocketBase REST API (`/api/collections/leads/records`). Go hooks validate the Turnstile token, send the notification email and push the lead to the CRM.

### 5.1 Frontend Core (Astro)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 5+** (`output: 'static'`) | Ships zero JS by default, island architecture, Content Layer, built-in View Transitions |
| Language | **TypeScript** (strict) | Safety and maintainability |
| Styling | **Tailwind CSS v4** (via `@tailwindcss/vite`) + CSS variables (design tokens) | Speed, consistency, small CSS |
| Interactive islands | **React 19** via `@astrojs/react`, used **only** for stateful UI (contact wizard, work filter, testimonial carousel) | Keeps JS limited to where it's needed |
| Content | **Astro Content Layer** + custom **PocketBase loader** | Typed collections with Zod schemas at build time |
| Images | `astro:assets` `<Image />` / `<Picture />` (AVIF/WebP), remote images from PocketBase allowed in `image.domains` | Automatic optimisation |
| Fonts | Self-hosted woff2 + Astro Fonts API (or `@fontsource-variable/*`) | No layout shift |
| Icons | **astro-icon** (Lucide set) | Inline SVG, zero runtime |
| Sitemap / SEO | `@astrojs/sitemap`, `astro-seo` | Generated at build |
| PocketBase SDK | **`pocketbase` JS SDK** | Typed API calls from loaders and islands |

### 5.2 Motion & 3D

| Need | Library |
|---|---|
| Scroll-driven timelines, pinning, text splitting | **GSAP** + **ScrollTrigger** + **SplitText** (all plugins free since GSAP 3.13) |
| Layout reflow (filters, reordering) | **GSAP Flip** |
| Drag with inertia (carousels, galleries) | **GSAP Draggable** + **InertiaPlugin** |
| Component animation inside React islands (form steps, chips) | **Motion** (formerly Framer Motion), only inside islands |
| Small vanilla UI animations outside islands | **Motion** vanilla API (`animate`, `inView`) or plain CSS |
| Smooth scrolling | **Lenis** (synced with the GSAP ticker, persisted across navigations) |
| Page transitions + shared-element morphs | **Astro View Transitions** (`<ClientRouter />`, `transition:name`, `transition:animate`) + custom GSAP curtain |
| WebGL / 3D | **Three.js** (vanilla) or **OGL** (lighter) in a client-only `<script>`. No React needed |
| Shaders | Custom GLSL imported with `vite-plugin-glsl` |
| Lottie (optional) | **dotLottie web** player for icon animations |

### 5.3 Backend & Data (PocketBase + Go)

| Need | Choice |
|---|---|
| Database / CMS | **PocketBase** (SQLite) used as a Go framework: custom binary from `backend/main.go` |
| Admin UI | Built-in PocketBase dashboard at `/_/` (content editing for the team) |
| Schema management | Go migrations in `backend/migrations/` (`migratecmd`, automigrate in dev) so the schema is version-controlled |
| File storage | PocketBase file fields (local disk or **S3-compatible**, e.g. Cloudflare R2 / Backblaze B2) with built-in thumbnails |
| Form validation | Zod on the client + PocketBase collection field rules + Go hook validation on the server |
| Email | PocketBase mailer (SMTP via **Resend**, Postmark or SES) triggered from Go hooks |
| Booking | **Cal.com** embed |
| CRM hook | Go hook → HubSpot / Pipedrive API after a lead is created |
| Spam protection | **Cloudflare Turnstile**, verified in a Go `OnRecordCreateRequest` hook + PocketBase built-in rate limits |
| Rebuild trigger | Go hook on content collections → deploy hook URL (debounced, about 30s) |
| Backups | PocketBase built-in scheduled backups to S3 |

### 5.4 Infrastructure & Quality

| Need | Choice |
|---|---|
| Frontend hosting | **Cloudflare Pages**, **Netlify** or **Vercel** (static deploy + deploy hook) |
| Backend hosting | Small **VPS** (Hetzner / DigitalOcean) or **Fly.io** with a persistent volume, running the single Go binary as a systemd service or Docker container |
| TLS / proxy | PocketBase built-in autocert (`serve yourdomain.com`), or **Caddy** in front |
| Domains | `[agency].com` → Astro, `api.[agency].com` → PocketBase |
| Analytics | **Plausible** / **Umami** (light) or PostHog |
| Error monitoring | **Sentry** (browser) + structured logs from PocketBase (built-in logs UI) |
| Linting / format | ESLint + Prettier (with `prettier-plugin-astro`) or Biome; `gofmt` + `go vet` for Go |
| Testing | **Vitest** (unit), **Playwright** (e2e + visual regression), Go `testing` package with `tests.ApiScenario` for hooks |
| Type checking | `astro check` + `tsc` |
| CI | GitHub Actions: lint, `astro check`, test, `go test ./...`, Lighthouse CI, build the Go binary |
| Package manager | **pnpm** (frontend), **Go modules** (backend) |
| Type generation | `pocketbase-typegen` → `web/src/types/pocketbase.ts` |

### 5.5 PocketBase Collections (schema)

| Collection | Key fields | API rules |
|---|---|---|
| `projects` | title, slug, client, summary, cover (file), hero_video (file), gallery (files), services (relation), industry, stack (json), year, results (json), body (editor), featured (bool), order, published (bool) | List/View: `published = true`; write: admins only |
| `services` | title, slug, outcome, description, capabilities (json), icon (file), order | Public read |
| `testimonials` | quote, name, role, company, photo (file), video (file), project (relation) | Public read |
| `clients` | name, logo (file, SVG), url, order | Public read |
| `team` | name, role, photo (file), alt_photo (file), bio, socials (json), order | Public read |
| `posts` | title, slug, excerpt, cover (file), category, body (editor), author (relation → team), published_at, published | Public read when published |
| `jobs` | title, slug, department, location, type, description (editor), open (bool) | Public read when open |
| `awards` | name, org, year, project (relation), badge (file) | Public read |
| `stats` | label, value, suffix, order | Public read |
| `estimator_options` | group (project_type / feature), label, label_en, description, description_en, base_weeks, icon, order (**no price fields by design**) | Public read (powers the Project Scoper) |
| `leads` | name, email, company, services (select, multi), budget (select), timeline (select), message, attachment (file), **estimate (json: selections + computed range)**, channel (form / drawer / whatsapp / booking), source_page, utm (json) | **Create: public** (guarded by Turnstile hook + rate limit); List/View/Update/Delete: admins only |
| `applications` | job (relation), name, email, portfolio_url, cv (file), message | Create: public (guarded); others: admins only |
| `subscribers` | email (unique), confirmed (bool) | Create: public (guarded) |

### 5.6 `backend/main.go` Responsibilities

```go
package main

import (
	"log"
	"os"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "our_agency/backend/migrations"
	"our_agency/backend/hooks"
)

func main() {
	app := pocketbase.New()

	// Version-controlled schema (auto-generate migrations when running with `go run`)
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{Automigrate: isGoRun})

	// Leads: verify Turnstile before create, then email + CRM after create
	app.OnRecordCreateRequest("leads", "applications", "subscribers").BindFunc(hooks.VerifyTurnstile)
	app.OnRecordAfterCreateSuccess("leads").BindFunc(hooks.NotifyNewLead)     // team email + auto-reply
	app.OnRecordAfterCreateSuccess("leads").BindFunc(hooks.SyncLeadToCRM)

	// Content changes → trigger static rebuild of the Astro site (debounced)
	content := []string{"projects", "services", "testimonials", "clients", "team", "posts", "jobs", "awards", "stats"}
	app.OnRecordAfterCreateSuccess(content...).BindFunc(hooks.TriggerRebuild)
	app.OnRecordAfterUpdateSuccess(content...).BindFunc(hooks.TriggerRebuild)
	app.OnRecordAfterDeleteSuccess(content...).BindFunc(hooks.TriggerRebuild)

	// PocketBase already exposes GET /api/health (used for uptime monitoring).
	// Custom routes (e.g. newsletter confirm) go in app.OnServe().BindFunc(...)

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
```

**Environment variables (backend):** `TURNSTILE_SECRET`, `DEPLOY_HOOK_URL`, `CRM_API_KEY`, `LEADS_NOTIFY_EMAIL`, SMTP and S3 settings (configured in the admin UI or applied from env at startup).

**Environment variables (frontend):** `PUBLIC_PB_URL`, `PUBLIC_TURNSTILE_SITE_KEY`, `PB_BUILD_TOKEN` (optional superuser/service token used only at build time if any collection needs authenticated reads).

---

## 6. Project Directory Structure

A monorepo with two apps: `web/` (Astro) and `backend/` (PocketBase in Go).

```
our_agency/
├── plan.md                              # ← this file
├── README.md
├── .github/workflows/
│   ├── web.yml                          # lint, astro check, tests, Lighthouse CI, deploy
│   └── backend.yml                      # go vet, go test, build binary / Docker image
│
├── backend/                             # ── PocketBase (Go) ─────────────────────
│   ├── main.go                          # App bootstrap, hook registration, routes
│   ├── go.mod
│   ├── go.sum
│   ├── hooks/
│   │   ├── turnstile.go                 # Verify Cloudflare Turnstile on public creates
│   │   ├── leads.go                     # Notify team + auto-reply email
│   │   ├── crm.go                       # Push leads to HubSpot / Pipedrive
│   │   ├── rebuild.go                   # Debounced deploy-hook trigger
│   │   ├── config.go                    # .env loader + env helper
│   │   └── templates/                   # Embedded email HTML templates
│   │       ├── lead_notification.html
│   │       └── lead_autoreply.html
│   ├── migrations/                      # Version-controlled schema (Go migrations)
│   │   ├── 1730000000_init_collections.go
│   │   └── 1730000001_seed_content.go
│   ├── pb_data/                         # SQLite DB + uploads (git-ignored)
│   ├── Dockerfile                       # Multi-stage build → tiny static binary
│   └── .env.example
│
└── web/                                 # ── Astro frontend ──────────────────────
    ├── astro.config.mjs                 # integrations: react, sitemap; image domains; vite glsl
    ├── tsconfig.json
    ├── package.json
    ├── .env.example                     # PUBLIC_PB_URL, PUBLIC_TURNSTILE_SITE_KEY
    ├── public/
    │   ├── fonts/                       # Self-hosted woff2 variable fonts
    │   ├── images/                      # favicons, static OG fallbacks
    │   ├── videos/                      # Hero/showreel loops (mp4 + webm) if not in PocketBase
    │   └── models/                      # .glb 3D assets (Draco compressed)
    ├── tests/
    │   ├── e2e/                         # Playwright
    │   └── unit/                        # Vitest
    │
    └── src/
        ├── content.config.ts            # Content Layer collections using the PocketBase loader
        │
        ├── pages/
        │   ├── index.astro              # Home
        │   ├── work/
        │   │   ├── index.astro          # Case study index (filter island)
        │   │   └── [slug].astro         # getStaticPaths() from projects collection
        │   ├── services/
        │   │   ├── index.astro
        │   │   └── [slug].astro
        │   ├── about.astro
        │   ├── insights/
        │   │   ├── index.astro
        │   │   └── [slug].astro
        │   ├── careers/
        │   │   ├── index.astro
        │   │   └── [slug].astro
        │   ├── contact.astro
        │   ├── privacy.astro
        │   ├── terms.astro
        │   ├── 404.astro
        │   ├── robots.txt.ts
        │   └── og/[...slug].png.ts      # Build-time OG images (satori / astro-og-canvas)
        │
        ├── layouts/
        │   ├── BaseLayout.astro         # <head>, SEO, <ClientRouter />, fonts, Lenis, cursor
        │   ├── PageLayout.astro
        │   └── ArticleLayout.astro
        │
        ├── components/
        │   ├── layout/
        │   │   ├── Header.astro         # transition:persist
        │   │   ├── MenuOverlay.astro
        │   │   ├── Footer.astro
        │   │   ├── Preloader.astro
        │   │   └── PageTransition.astro # Curtain overlay driven by astro:* events
        │   ├── sections/                # Static Astro sections + small <script> for motion
        │   │   ├── Hero.astro
        │   │   ├── Manifesto.astro
        │   │   ├── SelectedWork.astro
        │   │   ├── Services.astro
        │   │   ├── Process.astro
        │   │   ├── Stats.astro
        │   │   ├── LogoMarquee.astro
        │   │   ├── Testimonials.astro
        │   │   ├── TechStack.astro
        │   │   ├── Awards.astro
        │   │   ├── InsightsPreview.astro
        │   │   └── CtaBanner.astro
        │   ├── ui/                      # Button.astro, MagneticButton.astro, Tag.astro, Card.astro
        │   ├── webgl/
        │   │   ├── HeroCanvas.astro     # <canvas> + client script (lazy-loaded)
        │   │   └── DistortionCanvas.astro
        │   └── islands/                 # React islands (only stateful UI)
        │       ├── ProjectBriefForm.tsx # client:visible, Motion + Zod + PocketBase SDK
        │       ├── ScopeCalculator.tsx  # client:visible, estimator (options from PocketBase)
        │       ├── ContactDrawer.tsx    # client:idle, global slide-out contact (transition:persist)
        │       ├── WorkFilter.tsx       # client:idle (or vanilla + GSAP Flip)
        │       ├── NewsletterForm.tsx   # client:visible
        │       └── ApplicationForm.tsx  # client:visible
        │
        ├── scripts/                     # Vanilla TS motion modules (imported by components)
        │   ├── motion/
        │   │   ├── init.ts              # Runs on astro:page-load, cleans on astro:before-swap
        │   │   ├── lenis.ts             # Lenis instance + GSAP ticker sync
        │   │   ├── gsap.ts              # Register ScrollTrigger, SplitText, Flip, Draggable, Inertia
        │   │   ├── splitReveal.ts       # [data-reveal="lines"] auto-binding
        │   │   ├── parallax.ts          # [data-parallax]
        │   │   ├── magnetic.ts          # [data-magnetic]
        │   │   ├── marquee.ts           # [data-marquee]
        │   │   ├── counter.ts           # [data-counter]
        │   │   ├── cursor.ts            # Custom cursor + [data-cursor="view|drag|play"]
        │   │   ├── hoverPreview.ts      # Cursor-following image lists
        │   │   └── pageTransition.ts    # Curtain timeline on navigation
        │   └── webgl/
        │       ├── heroBlob.ts          # Three.js / OGL scene
        │       ├── distortion.ts
        │       ├── renderer.ts          # Single renderer, DPR cap, render-on-demand loop
        │       ├── dispose.ts           # Deep dispose of geometries/materials/textures
        │       └── shaders/
        │           ├── blob.vert.glsl
        │           ├── blob.frag.glsl
        │           └── distortion.frag.glsl
        │
        ├── lib/
        │   ├── pocketbase.ts            # PocketBase SDK client (PUBLIC_PB_URL)
        │   ├── pbLoader.ts              # Custom Astro Content Layer loader for PB collections
        │   ├── pbFile.ts                # Build file URLs + thumbs (?thumb=800x0)
        │   ├── validations/contact.ts   # Zod schemas shared by islands
        │   ├── seo.ts
        │   └── utils/
        │       ├── reducedMotion.ts
        │       ├── device.ts            # isTouch, GPU tier
        │       └── media.ts
        │
        ├── styles/
        │   ├── global.css               # @import "tailwindcss"; base styles
        │   └── tokens.css               # Colors, spacing, easing curves, durations
        │
        └── types/
            └── pocketbase.ts            # Generated by pocketbase-typegen
```

### 6.1 Content Layer Loader (sketch)

```ts
// web/src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { pbLoader } from './lib/pbLoader';

const projects = defineCollection({
  loader: pbLoader({ collection: 'projects', filter: 'published = true', sort: 'order', expand: 'services' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    client: z.string(),
    summary: z.string(),
    cover: z.string(),          // resolved to full file URL by the loader
    results: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    featured: z.boolean(),
  }),
});

export const collections = { projects /*, services, posts, team, testimonials, clients, jobs, awards, stats */ };
```

The loader uses `pb.collection(name).getFullList()`, uses `slug` as the entry id, maps file names to `${PB_URL}/api/files/{collectionId}/{id}/{file}`, and stores `updated` as the digest so Astro only re-processes changed entries.

---

## 7. Homepage: Section-by-Section Breakdown

> Target length: about 9 to 11 viewport heights on desktop. Each section has one job.

### 7.0 Preloader (first visit only)

- **Content:** Agency logomark + `000 → 100` counter.
- **Motion:** Counter ticks (GSAP), logo strokes draw on (SVG `stroke-dashoffset`), then a curtain wipes up to reveal the hero. The hero headline animation starts exactly as the curtain clears. **Premium option:** instead of a DOM curtain, a GLSL shader transition dissolves the preloader directly into the WebGL hero background, so the two feel like one continuous scene.
- **Rules:** Max 1.8s. Skipped on repeat visits (sessionStorage). Disabled under reduced motion.

### 7.1 Header / Navigation (global)

- **Content:** Logo · Work · Services · About · Insights · **[Start a project]** button · local time / availability indicator ("Available for Q1 2027 projects ●").
- **Motion:**
  - Hides on scroll down and reveals on scroll up (translateY).
  - Gets a blur backdrop after 100px of scroll.
  - Nav links: text "roll" hover (letters slide up and are replaced).
  - CTA: magnetic button with fill-from-cursor hover.
  - Mobile: full-screen overlay menu with staggered link reveal and a clip-path circle expanding from the burger.

### 7.2 Hero

- **Content:**
  - H1: *"We design & engineer digital products that move people."*
  - Sub: one line covering who we serve and the outcome.
  - CTAs: **Start a project** (primary) · **See our work** (secondary).
  - Scroll indicator.
  - Background: WebGL morphing gradient blob, **or** a full-bleed showreel video loop.
- **Motion:**
  - Headline split into lines; each line slides up from a mask (stagger 0.08s, `expo.out`).
  - The WebGL blob reacts to pointer position (uniforms lerped) and scroll velocity.
  - On scroll: headline scales down and fades slightly; the blob drifts (ScrollTrigger scrub).
- **Fallback:** Static gradient image on low-power devices, on reduced motion, or without WebGL.

### 7.3 Manifesto / Intro Statement

- **Content:** A 2 to 3 sentence paragraph on who we are, in large type.
- **Motion:** **Scroll-scrubbed word highlight**: words go from 20% to 100% opacity as the user scrolls (GSAP ScrollTrigger `scrub: true`). Optional inline images/pills that pop in mid-sentence.

### 7.4 Selected Work (Featured Case Studies)

- **Content:** 4 to 6 projects. Each has a thumbnail/video, client, title, tags and a result metric.
- **Layout option A:** Pinned **horizontal scroll** gallery (desktop), vertical stack on mobile.
- **Layout option B:** Large stacked cards that scale and stack ("card-stack" pin effect).
- **Motion:**
  - Media scales from 0.85 to 1 and clip-path opens on enter.
  - Image parallax inside the card (inner translateY).
  - Hover: custom cursor becomes a "View" pill; WebGL RGB-shift/ripple distortion on the image; video starts playing.
  - Click: **shared-element transition**. The thumbnail expands to become the case study hero (Astro `transition:name={`project-${slug}`}` on both the card media and the case hero).
- **CTA:** "View all work →"

### 7.5 Services / Capabilities

- **Content:** 4 to 5 services, each with a title, one-line outcome, sub-capabilities and an icon or visual.
  1. Web Platforms & Web Apps
  2. Mobile Apps (iOS / Android / React Native)
  3. Product & UX/UI Design
  4. AI & Automation Integration
  5. Brand & Creative Development
- **Layout:** Large typographic accordion list (one row per service).
- **Motion:**
  - Hover a row: a preview image follows the cursor (lerped position + slight rotation), the row background fills from the left, and the arrow rotates.
  - Click: accordion expands (native `<details>` + GSAP height tween, or CSS `interpolate-size: allow-keywords`) to reveal capabilities.
  - On enter: rows reveal with a stagger and a line divider that draws from left to right.

### 7.6 Process ("How we work")

- **Content:** 4 steps: **Discover → Design → Build → Launch & Grow**. Each has a title, 1 to 2 sentences, a timeline estimate and deliverables.
- **Motion:** Section **pins**. A vertical progress line fills as the user scrolls; each step activates in turn (number counter, text reveal, accompanying visual crossfade). On mobile: simple stacked reveals.

### 7.6.1 Project Scoper ★ lead qualification (duration only, no prices)

- **Purpose:** Turns the visitor from observer into participant. It qualifies leads before contact and increases dwell time, **without ever showing a price** (see §0).
- **Content / steps:**
  1. **Project type** (selection cards): Landing page · Marketing website · E-commerce · Web app / SaaS · Mobile app.
  2. **Features** (toggles): multilingual, accounts, online payments (CMI/Stripe), admin dashboard, integrations, AI, motion/3D.
  3. **Result panel:** estimated duration (weeks range) and complexity (light / medium / high), with two CTAs: **"I have a CDC"** (opens the drawer with CDC upload pre-selected) and **"Book a meeting"**. The selections are saved in `leads.estimate`.
- **Data:** Options and week weights come from PocketBase `estimator_options` (FR + EN labels), with built-in defaults while the collection is empty.
- **Copy rule:** "Indicative estimate, not a quote." Pricing comes after the CDC review or the meeting.
- **Motion:** Selection cards spring on select. Result numbers tween with GSAP `snap` (whole weeks / rounded currency). Progress bars fill according to scope. The result panel is sticky on desktop and a bottom sheet on mobile. Under reduced motion, numbers update instantly with a 200ms opacity fade.
- **Implementation:** React island `ScopeCalculator.tsx` (`client:visible`). Also reused on `/services` and `/contact`.

### 7.7 Impact Stats

- **Content:** 4 numbers, e.g. `120+ products shipped` · `40+ clients worldwide` · `98% client retention` · `9 awards`.
- **Motion:** Numbers count up on enter (GSAP, once). Rolling-digit "odometer" style for extra polish.

### 7.8 Client Logo Marquee

- **Content:** 10 to 14 monochrome client logos.
- **Motion:** Infinite marquee whose speed and direction react to scroll velocity. Pauses on hover. Logos go from grey to full colour on hover.

### 7.9 Testimonials

- **Content:** 3 to 5 quotes with name, role, company, photo (and optional video).
- **Motion:** Draggable carousel (GSAP Draggable + InertiaPlugin) and a custom cursor showing "Drag". Quote text reveals by line on slide change. Optional "play video" hover bubble.

### 7.10 Tech Stack & Expertise

- **Content:** A grid of technologies (Astro, React, Next.js, Node, Go, PocketBase, TypeScript, React Native, Python, AWS, OpenAI/Anthropic, Figma). Stored in PocketBase so the team can edit it.
- **Motion:** Grid cells have a **spotlight hover** (radial gradient follows the cursor across the grid). Staggered fade-in on enter.

### 7.11 Awards & Recognition

- **Content:** A list of awards (Awwwards SOTD, CSSDA, Clutch Top Agency) with year and project.
- **Motion:** Table rows reveal with a stagger; hovering a row shows the award badge image floating near the cursor.

### 7.12 Insights Preview

- **Content:** The latest 3 articles (cover, category, title, read time).
- **Motion:** Card hover: image zooms inside a fixed frame (scale 1.05), title underline draws in, card lifts slightly.

### 7.13 Big CTA Banner

- **Content:** Huge type, *"Have an idea? Let's build it."*, with a giant **[Start a project]** button and an email link.
- **Contact channels:** Start a project (opens the global drawer) · **WhatsApp** (`wa.me` link with a pre-filled message) · Book a call (Cal.com) · copy email.
- **Motion:** Background colour transitions as the section enters (the page "inverts"). Headline scales with scroll. Circular button is magnetic and has rotating text ("START A PROJECT • START A PROJECT •"). Email has copy-to-clipboard with a "Copied!" toast.

### 7.14 Footer

- **Content:** Sitemap links, socials (LinkedIn, Dribbble, GitHub, X, Behance), office locations with live local time, newsletter input, legal links, and a giant wordmark.
- **Motion:** **Footer reveal** (the footer sits fixed behind the content and is uncovered as the last section scrolls away). The giant wordmark letters stagger in. A "Back to top" button smooth-scrolls via Lenis.

---

## 8. Inner Pages Breakdown

### 8.1 /work: Case Study Index
- Filter chips (All · Web · Mobile · Design · AI). Filtering uses **GSAP Flip** to reflow the grid (all projects are rendered statically; filtering only toggles visibility, so no fetch is needed).
- Toggle between **grid view** and **list view**. In list view, hovering shows a floating preview image.
- Infinite / "load more" with staggered entry.

### 8.2 /work/[slug]: Case Study
- Follows the template in §4.3.
- Shared-element entry from the index or home.
- Sticky meta sidebar on desktop.
- Full-bleed media with parallax, before/after slider, autoplay muted video.
- Results numbers count up.
- "Next project" footer: scroll-to-load or a hold-to-navigate interaction.

### 8.3 /services and /services/[slug]
- Overview: the same typographic list as on the homepage, plus pricing models (Fixed scope · Dedicated team · Retainer).
- Detail: outcome headline, what's included, process, related case studies, FAQs (animated accordion), CTA.

### 8.4 /about
- Studio manifesto (scroll-scrubbed text).
- Values (pinned cards stack).
- Team grid: hovering swaps the photo to a candid/fun photo; a click opens a bio modal.
- Office/culture photo gallery (horizontal drag).
- Timeline of milestones (horizontal scroll).

### 8.5 /insights and /insights/[slug]
- Category filters, featured post hero.
- Article: reading progress bar, code blocks with syntax highlighting, table of contents with active-section highlighting, share buttons, related posts.

### 8.6 /careers
- Culture pitch, perks grid, open roles list (hover row fill), application form or ATS link.

### 8.7 /contact (Conversion Page)
- **Global contact drawer:** every "Start a project" CTA on the site opens `ContactDrawer.tsx` (slide-out on desktop, full-screen sheet on mobile) without leaving the page. It persists across navigations (`transition:persist`), traps focus, closes on Esc, and updates the URL hash (`#contact`) so it can be linked. The `/contact` route stays as the SEO and no-JS fallback.
- **Paths:** (1) multi-step project brief form (pre-filled when coming from the Scope Calculator), (2) "Book a 30-min call" (Cal.com embed), (3) **WhatsApp** direct chat, (4) email.
- **Multi-step form:**
  1. What do you need? (selectable chips: Website, Web App, Mobile App, Design, AI, Other)
  2. Do you have a CDC? **Yes** → upload it · **Not yet** → preferred meeting (in person / video / phone). *(No budget question, see §0.)*
  3. Timeline (chips: ASAP, 1–3 months, 3–6 months, Flexible)
  4. Where are you based? In Morocco / Outside Morocco (+ country)
  5. About you: name, email, phone/WhatsApp, company, project details
- **Implementation:** React island `ProjectBriefForm.tsx` (`client:visible`). On submit it calls `pb.collection('leads').create(formData)` with the Turnstile token; Go hooks in `main.go` verify the token, email the team, send the auto-reply and sync the CRM. File uploads go straight into the PocketBase `attachment` field.
- **Motion:** Step transitions slide and fade (Motion `AnimatePresence` inside the island, direction-aware). Progress bar fills. Chips have spring-scale on select. Inline validation shakes softly on error. Success state: animated checkmark (SVG draw) plus confetti or particle burst, and a "We'll reply within 24h" message.
- **Also show:** Direct email, office addresses, response-time promise, NDA available.

### 8.8 /404
- Playful interactive scene (e.g., draggable physics letters "404" using Matter.js) with a "Back home" magnetic button.

---

## 9. Animation & Micro-Interaction Catalogue

### 9.1 Global Motion Tokens (`tokens.css`)

```css
:root {
  /* Easing */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-circ: cubic-bezier(0.85, 0, 0.15, 1);

  /* Durations */
  --dur-xs: 150ms;   /* micro: hovers, toggles */
  --dur-sm: 300ms;   /* buttons, small UI */
  --dur-md: 600ms;   /* reveals */
  --dur-lg: 1000ms;  /* section/hero reveals */
  --dur-xl: 1400ms;  /* page transitions */

  /* Stagger */
  --stagger-text: 0.06s;
  --stagger-items: 0.1s;
}
```

### 9.2 Full Animation Inventory

| # | Name | Where | Trigger | Tool | Notes |
|---|---|---|---|---|---|
| 1 | Preloader counter + curtain | Global (first visit) | Load | GSAP timeline | ≤1.8s, skippable |
| 2 | Smooth scroll | Global | Scroll | Lenis | Disabled on touch for native feel (optional) |
| 3 | Page transition (wipe/mask) | Route change | Navigation | Astro `<ClientRouter />` + GSAP curtain on `astro:before-preparation` / `astro:after-swap` | 0.8 to 1.2s total |
| 4 | Shared-element case transition | Work → Case | Click | Astro `transition:name` (native View Transitions) | Thumbnail → hero |
| 5 | Custom cursor | Global (desktop) | Pointer move | GSAP `quickTo` | States: default, link, view, drag, play, hidden |
| 6 | Magnetic buttons | CTAs, socials | Hover | GSAP `quickTo` | Strength 0.3 to 0.5 |
| 7 | Text roll hover | Nav links, buttons | Hover | CSS / Motion | Duplicate text slides up |
| 8 | Underline draw | Inline links | Hover | CSS `scaleX` | Origin left in, right out |
| 9 | Split-text line reveal | All headings | Scroll enter | GSAP SplitText + ScrollTrigger | Mask + yPercent 100 → 0 |
| 10 | Scroll-scrubbed word highlight | Manifesto | Scroll (scrub) | GSAP ScrollTrigger | Opacity 0.2 → 1 per word |
| 11 | Hero WebGL blob | Hero | Pointer + scroll | Three.js / OGL + custom shader | Noise-displaced sphere |
| 12 | Hero scroll-out | Hero | Scroll (scrub) | GSAP | Scale 1 → 0.9, opacity |
| 13 | Horizontal pinned gallery | Selected Work | Scroll (pin) | GSAP ScrollTrigger | Desktop only |
| 14 | Media clip-path reveal | Images/videos | Scroll enter | GSAP | `inset(100% 0 0 0)` → `inset(0)` |
| 15 | Image parallax | Media blocks | Scroll (scrub) | GSAP ScrollTrigger | yPercent ±10 |
| 16 | Image hover distortion | Work cards | Hover | Three.js / OGL shader | RGB shift + ripple |
| 17 | Cursor-following preview | Services list, Work list, Awards | Hover | GSAP `quickTo` | Lerped + rotation from velocity |
| 18 | Row background fill | Services, Careers | Hover | CSS `clip-path` / `scaleY` | Direction-aware (enter from top or bottom) |
| 19 | Accordion expand | Services, FAQ | Click | `<details>` + GSAP / CSS `interpolate-size` | Height auto + content fade |
| 20 | Pinned process progress | Process | Scroll (pin + scrub) | GSAP | Line fill + step activation |
| 21 | Number count-up / odometer | Stats, case results | Scroll enter (once) | GSAP | Easing `power2.out` |
| 22 | Velocity marquee | Logos, footer | Scroll velocity | GSAP + Lenis velocity | Reverse on scroll up |
| 23 | Draggable carousel | Testimonials, gallery | Drag | GSAP Draggable + InertiaPlugin | Inertia + snap |
| 24 | Spotlight grid hover | Tech stack | Pointer move | CSS vars + JS | `radial-gradient` at cursor |
| 25 | Card hover lift + zoom | Insights cards | Hover | CSS | translateY -4px, img scale 1.05 |
| 26 | Section color inversion | CTA banner | Scroll enter | GSAP | Body bg/text swap |
| 27 | Rotating circular text | CTA button | Ambient | CSS `@keyframes` | 12s linear infinite |
| 28 | Copy-to-clipboard toast | Email links | Click | Motion (vanilla `animate`) | Spring in, auto-dismiss |
| 29 | Footer reveal | Footer | Scroll | CSS `position: sticky` + GSAP | Footer behind content |
| 30 | Header hide/show | Header | Scroll direction | GSAP + Lenis direction | Plus blur backdrop; `transition:persist` |
| 31 | Mobile menu overlay | Header | Click | GSAP timeline | Circle clip-path + staggered links |
| 32 | Filter grid reflow | /work | Click filter | GSAP Flip | |
| 33 | Multi-step form transitions | /contact | Next/Back | Motion `AnimatePresence` (React island) | Direction-aware |
| 34 | Chip select spring | /contact | Click | Motion `whileTap` (React island) | Scale 0.95 → 1 |
| 35 | Input focus | Forms | Focus | CSS | Label floats, border animates |
| 36 | Error shake | Forms | Validation fail | Motion keyframes (React island) | x: [0,-6,6,-4,4,0] |
| 37 | Success checkmark + burst | /contact | Submit success (PocketBase create OK) | SVG draw + Motion / canvas-confetti | |
| 38 | Reading progress bar | Articles | Scroll | CSS scroll-driven animation (`animation-timeline: scroll()`) with GSAP fallback | scaleX |
| 39 | TOC active indicator | Articles | Scroll | IntersectionObserver + GSAP Flip | |
| 40 | Team photo swap | /about | Hover | CSS crossfade | |
| 41 | Physics 404 | /404 | Drag | Matter.js / Rapier | |
| 42 | Grain overlay | Global | Ambient | CSS animated noise | Very subtle |
| 43 | Button press | All buttons | Active | CSS / Motion | scale 0.97 |
| 44 | Availability pulse dot | Header | Ambient | CSS `@keyframes` | Green ping |
| 45 | Live local time | Header/Footer | Interval | JS | Per office timezone |
| 46 | Preloader → hero shader dissolve | Global (first visit) | Load complete | GLSL + GSAP | Optional premium version of #1 |
| 47 | Scope calculator card select + number tween | Home, /services, /contact | Click / slider | Motion (island) + GSAP `snap` | Rounded values, no jitter |
| 48 | Scope progress bars | Scope calculator | Selection change | GSAP `scaleX` | Fill according to scope |
| 49 | Contact drawer open/close | Global | CTA click / Esc | Motion `AnimatePresence` (island) | Slide + backdrop blur; focus trap |
| 50 | Footer curtain pull | Footer | Scroll end | CSS z-index layering + GSAP parallax | `<main>` scrolls up to reveal the fixed footer |

---

## 10. Animation Tooling Map

**Rule of thumb:** *GSAP owns the scroll and the page, Astro owns the transitions, Motion lives only inside React islands, WebGL owns the wow.*

| Use case | ✅ Use | Why |
|---|---|---|
| Scroll-scrubbed / pinned timelines | **GSAP ScrollTrigger** | Industry standard, precise scrubbing and pinning |
| Text splitting & reveals | **GSAP SplitText** | Robust line splitting with masks |
| Cursor, magnetic, high-frequency pointer | **GSAP `quickTo`** | Fast, framework-free |
| Layout changes (filters, reordering) | **GSAP Flip** | FLIP on plain DOM, no framework needed |
| Drag / throw gestures | **GSAP Draggable + Inertia** | Works on static Astro markup |
| Page transitions & shared elements | **Astro View Transitions** (`<ClientRouter />`, `transition:name`) + GSAP curtain | Native browser API, built into Astro |
| Mount/unmount, form step animations | **Motion `AnimatePresence`** (React islands only) | Declarative inside stateful components |
| Simple scroll-linked progress | **CSS scroll-driven animations** | Zero JS where supported |
| Hero 3D object, shaders, distortion | **Three.js / OGL + GLSL** in a client script | GPU-powered, no React overhead |
| Simple hovers, underlines, keyframes | **Plain CSS** | Zero JS cost |

### Implementation Rules (Astro-specific)

1. **Default to zero JS.** Sections are `.astro` components. Motion is attached with data attributes (`data-reveal`, `data-parallax`, `data-magnetic`, `data-cursor`) and bound by modules in `src/scripts/motion/`.
2. **Use React islands only for stateful UI** (`client:visible` / `client:idle`). Never hydrate a whole section just to animate it.
3. **Respect the View Transitions lifecycle.** Initialise all GSAP/Lenis bindings on `document.addEventListener('astro:page-load', init)`, and clean up on `astro:before-swap` (`ctx.revert()`, `ScrollTrigger.getAll().forEach(t => t.kill())`). Wrap every page's animations in a single `gsap.context()`.
4. **Persist global elements** (header, cursor, WebGL canvas, Lenis wrapper) with `transition:persist` so they don't re-mount between pages.
5. **Register GSAP plugins once** in `scripts/motion/gsap.ts`.
6. **One frame loop only.** Create Lenis with `autoRaf: false` and drive it from GSAP's ticker so both share one time base (two separate requestAnimationFrame loops cause jitter): (`lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t * 1000))`; `gsap.ticker.lagSmoothing(0)`). Call `lenis.scrollTo(0, { immediate: true })` after each swap.
7. **Animate only `transform` and `opacity`** (and `clip-path` sparingly). Never animate layout properties.
8. **One persistent WebGL canvas** for the whole site. Swap scenes on navigation instead of creating new canvases.
9. **Lazy-load WebGL** with a dynamic `import()` after the hero text paints (`requestIdleCallback`). Use a static poster image as an LCP-safe fallback.
10. **Gate heavy effects** by capability: `matchMedia('(pointer: fine)')`, `navigator.hardwareConcurrency`, GPU tier (`detect-gpu`), and `prefers-reduced-motion`.
11. **Use `gsap.matchMedia()`** for separate desktop and mobile timelines.
12. **Pause off-screen**: stop the render loop when the canvas is out of view or the tab is hidden, and pause videos when not in view.
13. **Avoid FOUC on reveals.** Set initial hidden states in CSS under `html.js-ready` only, so content stays visible without JS and for crawlers.
14. **Refresh ScrollTrigger after every navigation.** Client-side navigation does not reload the page, so old trigger positions stay in memory. After `astro:page-load`, wait for `document.fonts.ready` plus one frame (or about 100ms), then call `ScrollTrigger.refresh()`. Also refresh after lazy images or videos change the layout.
15. **Use `will-change` only while animating.** Add it right before a tween (`onStart`) and remove it on `onComplete`. Applying it everywhere "just in case" exhausts compositor memory.
16. **Choose GSAP vs native View Transitions per transition:**
    - **Astro View Transitions** (default) for instant swaps and shared-element morphs (thumbnail → case hero).
    - **GSAP-driven transition** when the outro must *finish on the outgoing page before navigation* or needs sequencing across several targets (split text, curtain, WebGL fade). Hook it on `astro:before-preparation` (play the outro and await it) and `astro:after-swap` (play the intro).
17. **No scrolljacking.** Never override wheel/touch speed or direction. Pinned sections must still advance at the native scroll rate and stay keyboard-scrollable.
18. **Event handlers that start tweens** (hover, click) must reuse a single tween or `quickTo` and must be registered inside the page's `gsap.context()` so they are reverted on navigation. This prevents leaks from rapid repeated interaction.

---

## 11. Performance & Accessibility Budget

### 11.1 Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance (mobile) | ≥ 90 |
| LCP | < 2.0s |
| INP | < 200ms |
| CLS | < 0.05 |
| Initial JS (home, gzipped) | < 120 KB (excluding lazy WebGL chunk). Astro ships zero JS by default, so this budget is mostly GSAP + Lenis |
| WebGL chunk (lazy) | < 250 KB |
| Hero video | < 2.5 MB, H.264 + VP9/AV1, poster frame |
| Fonts | ≤ 3 woff2 files, `font-display: swap`, preload display font |

### 11.2 Performance Tactics

- Fully static Astro output served from a CDN; JS only for islands and motion scripts.
- `astro:assets` `<Image />` / `<Picture />` with AVIF/WebP and correct `sizes`. Remote PocketBase images are optimised at build time, and PocketBase `?thumb=` handles admin previews.
- Preload the display font; subset fonts; `font-display: swap`.
- Draco/meshopt-compressed `.glb`, KTX2 textures.
- Videos: `preload="none"` below the fold, IntersectionObserver play/pause. Serve large videos from S3/R2-backed PocketBase storage or a CDN.
- Code-split GSAP plugins and Three.js; load only what each page uses (Astro bundles `<script>` per component).
- Use `prefetch` (Astro built-in, `prefetchAll` on hover) for instant navigations.
- PocketBase is never in the critical path for page views. It's only called at build time and on form submits.
- Put PocketBase behind Caddy/Cloudflare with gzip and long cache headers for `/api/files/*`.

### 11.3 Accessibility (WCAG 2.2 AA)

- `prefers-reduced-motion`: *reduce* motion; don't *remove* feedback (see §11.5).
- WCAG **2.2.2 Pause, Stop, Hide** and **2.3.3 Animation from Interactions** are explicit acceptance criteria.
- Custom cursor is decorative only; the native cursor stays functional for assistive tech, and it is hidden on touch devices.
- All interactive elements are keyboard reachable with visible focus rings.
- Split text keeps the accessible name (`aria-label` on the parent, `aria-hidden` on fragments).
- Colour contrast ≥ 4.5:1 for body text.
- Pause controls for autoplay video and marquees (WCAG 2.2.2).
- Semantic landmarks, skip-to-content link, proper heading order.

---

### 11.4 WebGL / GPU Budget & Memory Management

Because the canvas persists across Astro navigations, the site behaves like a long-running single-page app. GPU memory leaks will build up unless they are handled.

| Rule | How |
|---|---|
| **Dispose explicitly** | When a scene or object leaves, call `geometry.dispose()`, `material.dispose()`, `texture.dispose()` (and render targets). The GPU does not garbage-collect. `scripts/webgl/dispose.ts` traverses and disposes deeply |
| **Cache safely** | Texture/material caches use a `WeakRef` or `FinalizationRegistry`, or are cleared explicitly on scene swap, so no GPU orphans are left behind |
| **Monitor in dev** | Show `renderer.info.memory.geometries` / `.textures` and `renderer.info.render.calls` in a dev overlay (or stats-gl). If the numbers climb while navigating back and forth, there is a leak |
| **Cut draw calls** | Particles and repeated objects use **`InstancedMesh`** (thousands of copies in one draw call). Varied geometries with a shared material use **`BatchedMesh`** |
| **Cap pixel ratio** | `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`. A DPR of 3 renders 9× the pixels of DPR 1. Lower it dynamically (to 1.5 or 1) if the frame time goes above 16ms |
| **Render on demand** | Do not run a continuous loop for idle scenes. Render only when the pointer/scroll changes or a tween is active; pause when off-screen or the tab is hidden |
| **Keep shaders cheap** | Limit fragment shader complexity, avoid heavy post-processing on mobile, and use KTX2/Basis textures plus Draco/meshopt models |
| **Target** | A steady 60fps on a mid-range Android device and an iPhone from the last 3 years. Otherwise fall back to the static poster |

### 11.5 Reduced-Motion Strategy (replace movement, keep feedback)

- **CSS:** Under `@media (prefers-reduced-motion: reduce)`, swap ~300ms transform transitions for **~200ms opacity fades**. Elements reach their final state at once: no bounce, settle or overshoot.
- **JavaScript:** CSS cannot stop JS animations. Read `matchMedia('(prefers-reduced-motion: reduce)')` and build all timelines inside **`gsap.matchMedia()`** so they revert or jump to their end state automatically when the preference is on.
- **Lenis:** Not started (native scroll). Pinned and horizontal sections become normal vertical stacks.
- **WebGL:** No camera motion, parallax or fast particles. Show a static render or a slow, local colour shift.
- **Page transitions:** Instant swap or a short crossfade.
- **Never lose information:** If an animation conveyed state (a spinner, progress, success), replace it with text or a static indicator (e.g., "Sending…", "Sent ✓").

### 11.6 Motion Accessibility QA

- Iterate quickly with Chrome DevTools → "Emulate CSS prefers-reduced-motion", but **final QA must toggle the real OS setting** (macOS, iOS, Windows, Android).
- Playwright e2e runs a second project with `reducedMotion: 'reduce'`. It asserts that modals, the contact drawer, page transitions, the scope calculator and counters reach their final visible state immediately, with no continuous motion and no lost state.
- Bug reports must name the lost information, e.g. *"form submit has no visible feedback because the spinner is suppressed without a text replacement"*, not just "turn off animation".

## 12. SEO, Analytics & Conversion Tracking

### 12.1 SEO
- `SEO.astro` component in `BaseLayout` (title, description, canonical, OG, Twitter). SEO fields (`seo_title`, `seo_description`, `og_image`) stored per record in PocketBase.
- Build-time OG images (`pages/og/[...slug].png.ts` via satori / `astro-og-canvas`) for case studies and articles.
- JSON-LD: `Organization`, `LocalBusiness`, `CreativeWork` (case studies), `Article`, `BreadcrumbList`, `JobPosting`.
- `@astrojs/sitemap` + `robots.txt.ts` generated at build from PocketBase content.
- Static HTML output, so all animated text is in the HTML for crawlers.

### 12.2 Analytics Events
| Event | Trigger |
|---|---|
| `cta_click` | Any "Start a project" button (with location property) |
| `case_study_view` | Case page view + scroll depth 50/90% |
| `contact_step_complete` | Each form step |
| `contact_submit` | Successful submission (with service, has_cdc, market) |
| `booking_scheduled` | Cal.com callback |
| `email_copy` | Email copy click |
| `estimator_start` / `estimator_complete` | Scope calculator first interaction / result shown (with project type and range) |
| `estimator_send` | "Send this scope to us" clicked |
| `contact_drawer_open` | Drawer opened (with source CTA and page) |
| `whatsapp_click` | WhatsApp link clicked (with location) |

### 12.3 Conversion Optimisation
- Sticky "Start a project" CTA in the header on every page.
- At least 3 CTA touchpoints on the homepage (hero, mid-page after work, final banner).
- Response-time promise and "no-obligation" microcopy near forms.
- A/B test hero headline and CTA copy after launch (PostHog).

---

## 13. Build Roadmap & Milestones

| Phase | Duration | Deliverables |
|---|---|---|
| **0. Discovery** | Week 1 | Moodboard (10 to 15 Awwwards refs), positioning, content inventory, sitemap sign-off |
| **1. Design System** | Week 2 | Typography, colour, grid, tokens, components in Figma, motion principles doc |
| **2. UI Design** | Weeks 3–4 | Home, Work, Case, Services, About, Contact (desktop + mobile), motion prototypes (Figma Smart Animate / Rive / quick code prototypes) |
| **3a. Backend Foundation** | Week 5 | `backend/main.go`, Go migrations for all collections (§5.5), API rules, Turnstile + email + rebuild hooks, S3 storage, backups, deploy to VPS at `api.[agency].com` |
| **3b. Frontend Foundation** | Week 5 | Astro project, Tailwind tokens, PocketBase Content Layer loader, generated types, layouts, `<ClientRouter />`, Lenis + GSAP lifecycle setup, CI/CD |
| **4. Pages & Sections** | Weeks 6–7 | All sections built as `.astro` components wired to PocketBase collections; React islands for forms and filters |
| **5. Motion Pass** | Weeks 8–9 | All animations from §9, View Transitions + curtain, cursor, Three.js hero and distortion |
| **6. Content Load** | Week 9 | Case studies, articles, team and testimonials entered in the PocketBase admin (`/_/`); verify the rebuild webhook |
| **7. QA & Optimisation** | Week 10 | Cross-browser/device QA, Lighthouse, a11y audit, reduced-motion pass, load testing |
| **8. Launch** | Week 11 | DNS, analytics, Search Console, monitoring, submit to Awwwards/CSSDA |

---

## 14. Launch Checklist

**Technical**
- [ ] Lighthouse ≥ 90 on all four categories (mobile)
- [ ] Core Web Vitals pass (LCP, INP, CLS)
- [ ] Tested on Chrome, Safari (macOS + iOS), Firefox, Edge, Android Chrome
- [ ] Reduced-motion mode verified
- [ ] WebGL fallback verified (disable WebGL in browser)
- [ ] Keyboard-only navigation verified
- [ ] 404 and error boundaries in place
- [ ] Forms: validation, spam protection, email delivery, CRM sync tested
- [ ] Sentry and analytics events firing
- [ ] View Transitions: animations re-init and clean up correctly across 10+ consecutive navigations (no duplicate ScrollTriggers, no memory leaks)
- [ ] `renderer.info.memory` stays flat after 20 back-and-forth navigations (no GPU leaks)
- [ ] WebGL holds 60fps on a mid-range Android device and a recent iPhone; DPR is capped at 2
- [ ] Reduced motion verified with the **real OS setting** on macOS/iOS/Windows/Android, plus the Playwright `reducedMotion: 'reduce'` suite passing
- [ ] No scrolljacking: scroll speed/direction is native; pinned sections are keyboard-scrollable
- [ ] Scope calculator ranges reviewed by the business owner; "estimate, not a quote" microcopy present
- [ ] Contact drawer: focus trap, Esc to close, `#contact` deep link, WhatsApp link opens on mobile and desktop

**PocketBase / Backend**
- [ ] Superuser account secured (strong password, MFA/OTP enabled)
- [ ] API rules reviewed: content collections are read-only to the public; `leads`/`applications` are create-only
- [ ] Rate limits enabled for public create endpoints
- [ ] CORS limited to the site's domains
- [ ] Scheduled backups to S3 configured and a restore tested
- [ ] SMTP configured and test email received
- [ ] Rebuild hook fires on publish and the site updates within a few minutes
- [ ] Migrations committed; production runs the same binary built in CI
- [ ] `/api/health` monitored (UptimeRobot / Better Stack)

**SEO & Content**
- [ ] Meta titles and descriptions on every page
- [ ] OG images render correctly (test on LinkedIn/X/Slack)
- [ ] Sitemap submitted to Google Search Console
- [ ] Structured data validated (Rich Results Test)
- [ ] All images have alt text
- [ ] Copy proofread and links checked

**Business**
- [ ] Privacy policy and cookie consent (if needed for region)
- [ ] Clutch / LinkedIn / Dribbble profiles link to the new site
- [ ] Awwwards / CSSDA / FWA submissions prepared (screenshots + video)
- [ ] Launch announcement (LinkedIn, X, newsletter)

---

*Last updated: 2026-11-10*
