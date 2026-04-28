# PelvicFit Men — Build Log

> Chronological record of what was built, when, and the design decisions made.

---

## Timeline

### Phase 0 — Research (April 12-13, 2026)

**What:** Built the research pipeline and compiled the knowledge base.

| Step | Work Done |
|------|-----------|
| 1 | Extracted 27 YouTube transcripts using `research/extract_bulk.py` |
| 2 | Compiled into `research/compiled_dataset.txt` (~150k words) |
| 3 | Synthesized into `research/finalised_youtube_research.md` using LLM |
| 4 | Ran deep Perplexity research → `research/perplexity_full_research_report.md` |
| 5 | Topics covered: anatomy, reverse Kegels, premature ejaculation, prostate health, bladder control |

**Source Videos:** 27 transcripts from physiotherapy, urology, and yoga channels. Organized into categories: Pelvic Floor Relaxation, PE Solutions, ED Natural Solutions, Bladder Control, Prostate Health.

---

### Phase 1 — Quiz Funnel (April 12, 2026)

**What:** Built the complete 25-step quiz funnel with pricing and Stripe integration.

| Step | Work Done |
|------|-----------|
| 1 | Designed 25-step quiz flow (12 questions + info screens + pricing) |
| 2 | Built `index.html` as single-page app (~1,620 lines) |
| 3 | Integrated Meta Pixel (`27117930631145953`) and GA4 (`G-PGMSSLBB9W`) |
| 4 | Created 3 Stripe Payment Links ($9.97 / $19.97 / $29.97) |
| 5 | Built upsell flow (post-purchase bundle offer) |
| 6 | Built downsell flow (triggered by back button on offer page) |
| 7 | Added countdown timer, social proof, and micro-commitment modals |
| 8 | Built `/api/submit-quiz.js` — lead capture to Brevo |
| 9 | Set up Brevo sender domain `pelvicfit.xyz` (DNS authentication) |
| 10 | Created `privacy.html` and `terms.html` |
| 11 | Deployed to Vercel, configured custom domain |

**Design Decisions:**
- **All-in-one SPA** instead of multi-page — faster loading, no page transitions
- **Browser history management** — back button navigates within quiz, not away
- **Fake loading screen** with micro-commitment modals — increases conversion
- **Score is generated randomly (3.0-4.5)** — not calculated from answers (flagged as gap)

---

### Phase 2 — Pipeline Redesign (April 13, 2026)

**What:** Redesigned from PDF delivery to interactive dashboard with two-stage lead pipeline.

| Step | Work Done |
|------|-----------|
| 1 | Identified gap: email trigger before payment would trigger post-purchase flow |
| 2 | Designed two-stage pipeline: Lead (List 4) → Customer (List 5) |
| 3 | Built `/api/create-protocol.js` — token generation + Brevo migration |
| 4 | Updated `submit-quiz.js` — saves to unpaid leads list only |
| 5 | Created Brevo attributes: STATUS, TIER, PROTOCOL_URL, PROTOCOL_DATE |
| 6 | Created Brevo lists: List 4 (Unpaid), List 5 (Customers) |

**Design Decisions:**
- **Token-gated access** instead of login/password — frictionless, no user account needed
- **12-char alphanumeric tokens** — 4.7 trillion possibilities, brute force impractical
- **Two Brevo lists** — enables abandoned cart retargeting on List 4

---

### Phase 3 — Content Synthesis (April 13, 2026)

**What:** Created all 4 protocol content JSONs (112 days of structured exercises).

| Step | Work Done |
|------|-----------|
| 1 | Generated Firmness protocol (47 exercises, 28 deep-dives) |
| 2 | Generated Endurance protocol (43 exercises, 28 deep-dives) |
| 3 | Generated Bladder protocol (41 exercises, 28 deep-dives) |
| 4 | Generated Libido protocol (41 exercises, 28 deep-dives) |
| 5 | Used `research/synthesis_prompt.md` + LLM to synthesize from research |
| 6 | Each protocol has unique clinical basis and exercise progression |

**Content Sources:** YouTube transcripts (27 videos) + Perplexity deep research

---

### Phase 4 — Interactive Dashboard (April 13-14, 2026)

**What:** Built the premium 28-day protocol dashboard SPA.

| Step | Work Done |
|------|-----------|
| 1 | Designed dark-themed, mobile-first dashboard UI |
| 2 | Built `plan/index.html` (~1,158 lines) |
| 3 | Implemented phase-based timeline with locked/unlocked states |
| 4 | Built session view with exercise blocks, deep-dive sections |
| 5 | Added progress tracking (streak counter, completion %) |
| 6 | Protocol switcher for bundle buyers |
| 7 | Completion celebration screen |
| 8 | Added `vercel.json` rewrite: `/plan/:token` → `/plan/index.html` |

**Design Decisions:**
- **SPA with vanilla JS** — no framework, no build step, instant deployment
- **Dark theme (#0a0e2a / #111640)** — premium feel, reduces eye strain for daily use
- **Phase-based locking** — Days 8-28 locked until prior phases complete
- **Gradient CTAs** — `#1abc9c → #2ecc71` for primary actions

---

### Phase 5 — Exercise Illustrations (April 14, 2026)

**What:** Generated 14 AI anatomical exercise illustrations and integrated them into the dashboard.

| Step | Work Done |
|------|-----------|
| 1 | Defined visual style: 3D anatomy, dark background, red-orange muscle highlights |
| 2 | Generated 14 PNGs via AI image generation |
| 3 | Copied to `content/images/` |
| 4 | Built `scripts/map-images.js` — pattern-matches exercise names to images |
| 5 | Ran mapper: 60 of 172 exercises matched |
| 6 | Updated dashboard to render images in exercise blocks |

**Image Style:** Neutral gray-brown anatomical figure, pelvic/target muscles highlighted in glowing red-orange, dark black background, no text/labels.

---

### Phase 6 — Redis Removal & Deployment (April 14, 2026)

**What:** Removed Upstash Redis dependency, shipped localStorage-first MVP.

| Step | Work Done |
|------|-----------|
| 1 | Removed `@upstash/redis` from `package.json` |
| 2 | Rewrote `create-protocol.js` — Brevo only, no Redis |
| 3 | Rewrote `protocol.js` — format-based token validation, no Redis |
| 4 | Updated dashboard init — reads from localStorage, URL params as fallback |
| 5 | Updated `index.html` — saves profile to localStorage after create-protocol |
| 6 | Set Vercel env vars via API: BREVO_LIST_UNPAID, BREVO_LIST_CUSTOMERS |
| 7 | Created missing Brevo attributes (GOAL, EXPERIENCE, SCORE, QUIZ_DATE, QUIZ_ANSWERS) |
| 8 | Pushed and deployed to production |

**Design Decision:**
- **localStorage-first** — eliminates external DB provisioning for MVP
- **Trade-off:** No cross-device sync. Acceptable for Phase 1.
- **`?plan=` URL param** — ensures correct protocol loads on any device (from email link)

---

### Phase 7 — Documentation & Organization (April 15, 2026)

**What:** Created `docs/` folder with comprehensive documentation.

| Step | Work Done |
|------|-----------|
| 1 | Created `docs/README.md` — documentation index |
| 2 | Created `docs/MASTER_REFERENCE.md` — all credentials + architecture |
| 3 | Created `docs/BUILD_LOG.md` — this file |
| 4 | Created `docs/GAP_ANALYSIS.md` — known issues + fixes |
| 5 | Created `docs/FUTURE_ROADMAP.md` — planned features |
| 6 | Created `docs/TESTING_CHECKLIST.md` — E2E testing guide |
| 7 | Moved legacy `PROJECT_DOCS.md` → referenced from docs |

---

## Git History Summary

| Commit | Message |
|--------|---------|
| `767aec9` | Initial quiz funnel + Brevo integration |
| `8b52c41` | `feat: interactive dashboard with 4 protocols + exercise images` |
| `cc01031` | `fix: remove Redis dependency — localStorage-first MVP` |
| `03514ce` | `fix(G4): embed plan in dashboard URL for cross-device support` |

Branch `v1-interactive-dashboard` created at `03514ce` as a snapshot of the v1 release.
