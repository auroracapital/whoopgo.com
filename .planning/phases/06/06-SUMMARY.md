---
phase: 6
plan: 1
subsystem: analytics
tags: [posthog, analytics, admin-dashboard, server-side-events, gdpr]
dependency_graph:
  requires: [phase-5]
  provides: [funnel-analytics, admin-metrics-page, server-side-events]
  affects: [phase-7, phase-8, phase-9, phase-10, phase-11]
tech_stack:
  added: [posthog-node, "@clerk/backend"]
  patterns: [server-side-event-capture, clerk-jwt-verification, eu-data-residency]
key_files:
  created:
    - src/lib/posthog-node.js
    - src/pages/AdminMetrics.tsx
    - .planning/phases/06/VERIFICATION.md
  modified:
    - src/lib/analytics.ts
    - src/components/EsimFinder.tsx
    - src/App.tsx
    - src/pages/CheckoutSuccess.tsx
    - src/pages/AccountPage.tsx
    - src/main.tsx
    - server.js
    - .env.example
    - package.json
decisions:
  - "Admin route placed in main.tsx (React Router) not App.tsx — main.tsx is the router root in this project"
  - "posthog-node written as plain ESM .js (not .ts) to match server.js module system"
  - "POSTHOG_API_KEY and VITE_POSTHOG_KEY can share same project key — PostHog client keys are public by design"
  - "ip: false added to PostHog init for GDPR compliance"
  - "verifyToken from @clerk/backend used for /api/admin/orders — never exposes ADMIN_API_TOKEN to browser"
metrics:
  duration: "~2 hours (implementation pre-committed)"
  completed: "2026-04-29"
  tasks_completed: 5
  files_changed: 11
---

# Phase 6 Plan 1: Funnel Analytics & Baseline Dashboard Summary

PostHog instrumented across full 10-event conversion funnel (client + server) with EU data residency, and `/admin/metrics` dashboard page with Clerk JWT-gated orders API.

## What Was Built

**Task 1 — Client-side event coverage**
- Added `finderOpened`, `finderMessageSent`, `planRecommended` to `analytics.ts`
- Wired `finder_opened` on `EsimFinder` mount, `finder_message_sent` on send, `plan_recommended` via regex detection of plan links in AI responses
- Wired `plan_selected` in `App.tsx` pricing section (both card click and button)
- Wired `checkout_completed` + `qr_delivered` in `CheckoutSuccess.tsx` on order load
- Wired `signed_in` / `signed_up` in `AccountPage.tsx` via Clerk `useUser`
- Added `ip: false` to PostHog init

**Task 2 — EU data residency + GDPR hardening**
- Default PostHog host changed to `https://eu.posthog.com` in both `analytics.ts` and `.env.example`
- `POSTHOG_API_KEY`, `POSTHOG_HOST`, `VITE_POSTHOG_DASHBOARD_ID` added to `.env.example` with comments

**Task 3 — Server-side events via posthog-node**
- `src/lib/posthog-node.js`: lazy-init PostHog client, `captureServerEvent(distinctId, event, properties)`, graceful no-op when key absent, `flushAt: 1` ensures events not lost on exit
- `server.js`: fires `esim_provisioned` after provider response (with `latency_ms`), `qr_delivered` after email dispatch, `checkout_completed` backup from Stripe webhook handler

**Task 4 — `/admin/metrics` dashboard**
- `src/pages/AdminMetrics.tsx`: KPI cards (Total Orders, Revenue, Conversion Rate placeholder), PostHog dashboard iframe embed (env-var gated), recent orders table (last 20)
- `GET /api/admin/orders` in `server.js`: accepts `Authorization: Bearer <Clerk JWT>`, verifies via `@clerk/backend` `verifyToken`, checks `publicMetadata.role === 'admin'`, returns last 20 orders — never exposes `ADMIN_API_TOKEN` to browser
- Route registered in `main.tsx` (React Router root), admin link visible in `AccountPage.tsx` for admin users

**Task 5 — Verification guide**
- `.planning/phases/06/VERIFICATION.md`: event checklist, funnel setup steps, Render env var list, smoke test commands

## Deviations from Plan

**1. [Rule 1 - Minor] Admin route in main.tsx, not App.tsx**
- Plan said "add `/admin/metrics` route in `App.tsx`"
- This project's React Router root is `main.tsx`; `App.tsx` is the landing page component, not the router
- Route correctly placed in `main.tsx` — no behavior difference

No other deviations. Plan executed as written.

## Quality Gate

- `npm run type-check`: PASS (zero errors)
- `npm run lint`: PASS (zero warnings)

## Known Stubs

- **Conversion Rate KPI card** in `AdminMetrics.tsx` shows a placeholder ("—") — wiring it requires a PostHog API query for funnel data, which needs `VITE_POSTHOG_DASHBOARD_ID` and a PostHog Insights API call. Intentional: the PostHog dashboard iframe embed provides the actual funnel view; the KPI card placeholder is labelled "via PostHog" in the UI.
- **PostHog dashboard iframe** requires `VITE_POSTHOG_DASHBOARD_ID` env var; renders a "Configure PostHog Dashboard ID" message until set. Expected — Render env var must be set post-deploy per VERIFICATION.md.

## Self-Check: PASSED

- src/lib/posthog-node.js: FOUND
- src/pages/AdminMetrics.tsx: FOUND
- .planning/phases/06/VERIFICATION.md: FOUND
- Implementation commit e4daa2c: FOUND
- npm run type-check: PASS
- npm run lint: PASS
