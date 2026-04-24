---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: Conversion, Traffic & Trust
status: planning
last_updated: "2026-04-24T00:00:00.000Z"
last_activity: "v1.1 milestone kicked off 2026-04-24 — 6 phases (6-11) drafted"
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
shipped_milestones:
  - version: v1.0
    name: Launch-Ready eSIM Storefront
    shipped: 2026-04-16
  - version: v1.0-addendum
    name: Domain, SSO wiring, legal scaffolding, provider consolidation
    shipped: 2026-04-24
---

# Project State

## Current Phase: v1.1 milestone drafted — awaiting phase planning

v1.1 "Conversion, Traffic & Trust" kicked off 2026-04-24. 6 phases drafted in ROADMAP.md (6-11): Funnel Analytics, Country SEO Pages, AI Finder v2, Trust Layer, Mobile App, Paid Acquisition. Open questions for Sam logged in ROADMAP.md. Run `/gsd-plan-phase 6` next.

## Completed Milestones

- **v1.0 Launch-Ready eSIM Storefront** (2026-04-16) — Phases 1-5 shipped.
- **v1.0 Addendum** (2026-04-24) — Domain `whoopgo.app` canonical, Cloudflare DNS/SSL/Email Routing, Clerk webhook + Google/Apple/Facebook SSO wired, Gemini 3.1 Flash-Lite replaces Anthropic for `/api/chat`, Terms + Privacy pages (DRAFT under HK entity), `support@whoopgo.app` routing, single-upstream eSIM provisioning (eSIMVault), contact info + Render env hygiene. Details in `milestones/v1.0-addendum-2026-04-24.md`.

## Architecture

- **Domain**: `whoopgo.app` canonical; `whoopgo.com` 301 redirect.
- **Auth**: Clerk (Google + Apple + Facebook SSO). FB in Development mode — Phase 11 flips to Live.
- **eSIM provisioning**: single upstream — eSIMVault via `esimmcp`.
- **AI chat**: Gemini 3.1 Flash-Lite via `/api/chat`.
- **Payments**: Stripe Checkout (native wallets added in Phase 9).
- **Email**: Cloudflare routing inbound; Resend outbound in Phase 10.

## Blockers

_None blocking Phase 6. Open questions for Sam in ROADMAP.md must be answered before Phase 7+ planning._

## Recent Decisions

- v1.1 milestone kicked off 2026-04-24 covering 6 phases (6–11): Conversion, Traffic & Trust.
- v1.0 addendum file codifies out-of-band work without rewriting v1.0 scope.
- eSIM provider consolidation: dropped Airalo + eSIM.travel paths, eSIMVault only.
