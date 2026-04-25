# Phase 6 Plan — Funnel Analytics & Baseline Dashboard

## 1. Goal

Instrument PostHog across the full conversion funnel (landing → finder → checkout → activation → renewal), close all missing event gaps, add server-side eSIM lifecycle events, and ship an internal `/admin/metrics` dashboard so every v1.1 growth phase has a measured baseline.

---

## 2. Files to Touch

### New files
- `src/pages/AdminMetrics.tsx` — `/admin/metrics` dashboard page
- `src/lib/posthog-node.ts` — thin wrapper around `posthog-node` for server-side calls (imported by server.js)

### Modified files
- `src/lib/analytics.ts` — add `finderOpened`, `finderMessageSent`, `planRecommended` events; add `ip: false` to init options
- `src/components/EsimFinder.tsx` — wire `finder_opened` on mount, `finder_message_sent` on send, `plan_recommended` when AI response contains a plan link
- `src/App.tsx` — wire `plan_selected` on pricing section `<CheckoutButton>` clicks (currently fires `checkout_started` only; `plan_selected` is defined but uncalled)
- `src/pages/CheckoutSuccess.tsx` — fire `checkout_completed` + `qr_delivered` on order load
- `src/pages/AccountPage.tsx` — wire `signed_in` / `signed_up` via Clerk `useUser` hook
- `server.js` — add `posthog-node` client; fire `esim_provisioned` in eSIM provisioning handler; fire `qr_delivered` when QR is emailed; update `VITE_POSTHOG_HOST` env comment to EU; add `GET /api/admin/orders` (or similar) that verifies the user’s Clerk session JWT with `@clerk/backend` and checks an admin role/claim — **not** the existing `requireAdmin` bearer (`ADMIN_API_TOKEN`) middleware, which is for server-to-server or curl only and must never be exposed via `VITE_*` or bundled in the browser
- `src/App.tsx` — add `/admin/metrics` route (lazy-loaded, **client-side** Clerk admin guard — do not confuse with Express `requireAdmin` on `/api/orders`)
- `.env.example` — add `POSTHOG_API_KEY` (server-side, secret), `POSTHOG_HOST` (server env var, separate from `VITE_` one)
- `package.json` — add `posthog-node` and `@clerk/backend` (for JWT verification on `/api/admin/orders`)

### Read-only reference (no changes)
- `src/lib/stripe.ts` — understand Plan type for event properties
- `server.js` `requireAdmin` on `/api/orders` — bearer-token admin API for scripts/ops only; the metrics page must use a separate Clerk-JWT route (see Task 4)

---

## 3. Task Breakdown

### Task 1 — Complete client-side event coverage (2–3 hr)
Wire all missing frontend events defined in `analytics.ts` but not called:
- `plan_selected` in `App.tsx` pricing section (passed to `<CheckoutButton>` as `onSelect` callback or via wrapper)
- `checkout_completed` + `qr_delivered` in `CheckoutSuccess.tsx` (on successful order fetch)
- `signed_in` / `signed_up` in `AccountPage.tsx` (Clerk `useUser` `signedIn` state change)
- Add `finderOpened` event to `analytics.ts`; fire in `EsimFinder.tsx` on mount
- Add `finderMessageSent(messageIndex, hasDestination)` to `analytics.ts`; fire in `EsimFinder.tsx` `handleSend`
- Add `planRecommended(planId, planName, country, price)` to `analytics.ts`; fire when AI response contains a plan suggestion (detect via regex on AI message content)
- Add `ip: false` to PostHog init options in `initAnalytics()`

### Task 2 — EU data residency + GDPR hardening (0.5–1 hr)
- Update `VITE_POSTHOG_HOST` default in `.env.example` from `https://us.posthog.com` to `https://eu.posthog.com`
- Update `initAnalytics()` default host accordingly
- Verify `person_profiles: "identified_only"` already set (it is — no change)
- Add `POSTHOG_HOST` and `POSTHOG_API_KEY` to `.env.example` for server-side use

### Task 3 — Server-side event tracking via posthog-node (2–3 hr)
- `npm install posthog-node`
- Create `src/lib/posthog-node.ts`: exports `captureServerEvent(distinctId, event, properties)` using `posthog-node` PostHog client; reads `POSTHOG_API_KEY` + `POSTHOG_HOST` from `process.env`; gracefully no-ops if key absent
- In `server.js` eSIM provisioning block (after successful provider response): call `captureServerEvent(userId || sessionId, 'esim_provisioned', { order_id, provider, latency_ms })`
- In `server.js` email dispatch block (after QR email sent): call `captureServerEvent(userId || sessionId, 'qr_delivered', { order_id, delivery_method: 'email' })`
- In `server.js` Stripe webhook `checkout.session.completed` handler: call `captureServerEvent` for `checkout_completed` as server-side backup (deduplication handled by PostHog via same `session_id` property)

### Task 4 — `/admin/metrics` dashboard page (3–4 hr)
- Create `src/pages/AdminMetrics.tsx`: React page with Clerk auth guard (redirect to `/account` if not admin)
- KPI cards row: Total Orders (from the Clerk-protected admin orders API below), Revenue (sum of order prices), Conversion Rate placeholder (finder_opened → checkout_completed, computed from PostHog API)
- PostHog dashboard embed: use PostHog's [Dashboard embed](https://posthog.com/docs/product-analytics/dashboards#embed-a-dashboard) iframe with `?embedded=true` — requires `VITE_POSTHOG_DASHBOARD_ID` env var pointing to a manually-created PostHog dashboard
- **Orders data from the browser:** add `GET /api/admin/orders` in `server.js` that accepts `Authorization: Bearer <Clerk session JWT>` (from `useAuth().getToken()` on the client), verifies it with `@clerk/backend` `verifyToken`, checks admin (public metadata / org role — same rule as the React guard), returns the same order list shape as `/api/orders` but capped (e.g. last 20). **Do not** call `/api/orders` from the React app: that route uses `requireAdmin` + `ADMIN_API_TOKEN`, which is server-only; putting that token in `VITE_*` would leak it in the JS bundle.
- Recent orders table: fetch from `/api/admin/orders` (with Clerk bearer), show last 20 with plan, country, status, timestamp
- Add `/admin/metrics` route in `App.tsx` router (lazy import, wrapped in admin guard component)
- Add link in account page for admin users

### Task 5 — Verification + PostHog funnel setup guide (0.5–1 hr)
- Add `POSTHOG_API_KEY`, `POSTHOG_HOST`, `VITE_POSTHOG_DASHBOARD_ID` to Render env vars documentation (update `.env.example` comments)
- Write `.planning/phases/06/VERIFICATION.md` documenting: how to verify each event fires in PostHog Live Events view, funnel configuration steps in PostHog UI, and smoke test commands

---

## 4. Success Criteria

1. PostHog Live Events view shows all 10 funnel events firing without gaps during a manual end-to-end test (landing → finder → plan select → checkout → success page)
2. Server-side `esim_provisioned` and `qr_delivered` events appear in PostHog attributed to the correct distinct_id even when browser tab is closed before success page loads
3. `/admin/metrics` route loads without error for an admin-role Clerk user and renders KPI cards + orders table
4. EU PostHog host is active: network tab on production shows PostHog calls hitting `eu.posthog.com`, not `us.posthog.com`
5. Zero TypeScript errors (`npm run type-check` passes)
6. PostHog funnel report `finder_opened → plan_selected → checkout_started → checkout_completed → qr_delivered` is configurable (all 5 events present in PostHog event list)

---

## 5. Verification Commands

```bash
# Type check — must pass clean
npm run type-check

# Lint
npm run lint

# Smoke test: start dev server and manually walk the funnel
npm run dev
# → Open localhost, trigger finder, select plan, complete checkout (Stripe test mode)
# → Check PostHog Live Events for: finder_opened, finder_message_sent, plan_recommended, plan_selected, checkout_started, checkout_completed, qr_delivered

# Verify EU host in use (after env var update + rebuild)
# In browser DevTools Network tab, filter by "posthog" → confirm requests go to eu.posthog.com

# Verify server-side events
# curl -X POST /api/checkout with test planId → watch PostHog for esim_provisioned via Node SDK
# (or check server logs for posthog-node "capture" calls)

# Admin metrics page
# Sign in with admin Clerk user → navigate to /admin/metrics → verify no JS errors, KPI cards render
```

---

## 6. Goal-Backward Check

The phase goal is: instrument the full conversion funnel and ship a baseline metrics dashboard so v1.1 growth phases are measurable.

Tasks 1–3 collectively wire all 10 funnel events across both client and server, closing every gap identified in the research. Task 4 ships the `/admin/metrics` dashboard that surfaces live order data and embeds the PostHog funnel — giving Sam a single URL to monitor conversion from the moment Phase 6 ships. Task 5 ensures the setup is reproducible and the funnel is configured in PostHog UI. Executing all 5 tasks delivers exactly the phase goal: a measured, instrumented funnel with a dashboard baseline ready for Phase 7+ growth work.
