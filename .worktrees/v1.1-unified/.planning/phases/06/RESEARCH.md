# Phase 6 Research — Funnel Analytics & Baseline Dashboard

## What "Funnel Analytics" Means for WhoopGO

WhoopGO is a transactional eSIM storefront with a single conversion path:

```
Session → AI Finder interaction → Plan selected → Checkout started → Stripe redirect
→ Checkout completed → eSIM provisioned → QR delivered → (Renewal later)
```

The v1.1 success exit criterion is: **AI Finder → Stripe checkout conversion ≥ 8%** and **full funnel: session → finder → checkout → activation → renewal** measured. Right now, zero of those steps have measured baselines. Phase 6 establishes them.

---

## Existing Analytics State

PostHog is **already integrated** (Phase 5 work). Key findings:

- `src/lib/analytics.ts` — PostHog wrapper with `initAnalytics()` + typed `events` object
- `index.html` — PostHog snippet injected inline; initialized from `VITE_POSTHOG_KEY`
- `src/main.tsx` — calls `initAnalytics()` on app mount
- **Events already firing:**
  - `plan_selected` — in `analytics.ts` (defined, but not called anywhere in the codebase yet)
  - `checkout_started` — fired in `CheckoutButton.tsx` on click
  - `checkout_completed` — defined, but **not called** in `CheckoutSuccess.tsx`
  - `email_captured` — fired in `EmailCapture.tsx`
  - `signed_in` / `signed_up` — defined, not wired to Clerk auth events
  - `contact_submitted` — defined, not wired in contact form

**Gap summary:** Roughly half the defined events are wired; none of the eSIM activation or renewal steps are tracked at all. The PostHog instance receives `capture_pageview: true` so page views are flowing, but the structured funnel is not.

No GA4, no Segment, no Amplitude. PostHog is the right call — it's already in the stack, has funnels + session recordings + feature flags built in, and is GDPR-compliant with EU data residency option.

---

## Industry-Standard Funnel Events for eSIM / SaaS Conversion

| Step | Event Name | Key Properties |
|------|-----------|----------------|
| Session start | `$pageview` (auto) | referrer, utm_source, utm_medium, utm_campaign |
| Finder opened | `finder_opened` | entry_point (hero, pricing, nav) |
| Finder message sent | `finder_message_sent` | message_index, has_destination |
| Plan recommended | `plan_recommended` | plan_id, plan_name, country, price |
| Plan selected | `plan_selected` | plan_id, plan_name, price, country, source (finder/pricing) |
| Checkout started | `checkout_started` | plan_id, plan_name, price, country |
| Checkout completed | `checkout_completed` | session_id, plan_id, price, country |
| eSIM provisioned | `esim_provisioned` | order_id, provider, latency_ms |
| QR delivered | `qr_delivered` | order_id, delivery_method (email/page) |
| Renewal initiated | `renewal_initiated` | order_id, plan_id |
| Signup | `signed_up` | method (clerk/magic-link) |
| Login | `signed_in` | method |

PostHog funnel analysis requires consistent event ordering; the above sequence maps directly to a PostHog Funnel with steps: `finder_opened → plan_selected → checkout_started → checkout_completed → qr_delivered`.

---

## Tooling Recommendation

**PostHog — keep and extend.** Already in the stack, no migration cost. For Phase 6 specifically:

1. **Event completion** — wire the 5 missing events (`checkout_completed`, `plan_selected` from App.tsx pricing section, `finder_opened`, `finder_message_sent`, `plan_recommended`, `signed_in`/`signed_up` via Clerk)
2. **Server-side events** — `esim_provisioned` and `qr_delivered` should fire from `server.js` via PostHog Node SDK so they're reliable even if the user closes the tab. Use `posthog-node`.
3. **PostHog Funnels** — configure the 5-step funnel in PostHog UI once events are flowing. Export as shareable link for the `/admin/metrics` dashboard.
4. **`/admin/metrics` page** — a React page behind `requireAdmin` middleware showing: PostHog iframe embed (dashboard embed API) + key KPI cards populated from `/api/orders` + a PostHog events stream. No custom DB aggregations needed in Phase 6 — pull directly from PostHog's API.

**Do NOT add GA4** — it duplicates PostHog, adds cookie consent complexity, and WhoopGO's scale doesn't need it yet.

---

## Data Privacy (GDPR)

WhoopGO's Privacy Policy already mentions PostHog for analytics. GDPR obligations for Phase 6:

1. **EU data residency** — switch `VITE_POSTHOG_HOST` to `https://eu.posthog.com` (Amplitude scholarship uses EU server zone; PostHog has same). This keeps EU visitor data in EU. One env var change.
2. **Cookie consent** — PostHog's `person_profiles: "identified_only"` (already set) means anonymous users don't get a persistent profile — compliant for analytics-without-consent under GDPR Recital 47 (legitimate interest for aggregate stats). No consent banner required for the analytics events in scope.
3. **IP anonymization** — enable `ip: false` in PostHog init to strip IPs server-side. One-line change.
4. **Data retention** — PostHog default is 1 year for events; acceptable. No change needed.
5. **eSIM activation data** — `qr_delivered` and `esim_provisioned` server-side events must NOT include the QR code string or ICCID. Only order_id + latency metadata.
