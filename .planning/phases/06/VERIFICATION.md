# Phase 6 — Verification Guide

## 1. Client-Side Events (PostHog Live Events)

Start the dev server: `npm run dev`

Walk the funnel manually and confirm each event appears in PostHog Live Events
(`https://eu.posthog.com` → project → Live Events):

| Step | Action | Expected Event |
|------|--------|----------------|
| 1 | Load landing page (`/`) | — (pageview auto-captured) |
| 2 | Open AI Finder modal | `finder_opened` |
| 3 | Send a message in Finder | `finder_message_sent` (props: `message_index`, `has_destination`) |
| 4 | AI returns a plan suggestion | `plan_recommended` (props: `plan_id`, `plan_name`, `country`, `price`) |
| 5 | Click any pricing plan card | `plan_selected` (props: `plan_id`, `plan_name`, `price`) |
| 6 | Checkout button clicked | `checkout_started` |
| 7 | Stripe test checkout completed | `checkout_completed` + `qr_delivered` (on `/checkout/success`) |
| 8 | Sign in via Clerk | `signed_in` (prop: `method`) |
| 9 | New user registers | `signed_up` (prop: `method`) |

Verify network requests hit `eu.posthog.com`, not `us.posthog.com`:
- DevTools → Network → filter by `posthog` → inspect request host.

## 2. Server-Side Events (posthog-node)

These fire from `server.js` and appear in PostHog attributed to the user's Clerk `userId`
or Stripe `client_reference_id`:

| Event | Trigger | Properties |
|-------|---------|------------|
| `esim_provisioned` | eSIM provisioning handler (after provider success) | `order_id`, `provider`, `latency_ms` |
| `qr_delivered` | Email dispatch block | `order_id`, `delivery_method: 'email'` |
| `checkout_completed` | Stripe webhook `checkout.session.completed` | `session_id`, `plan_id`, `price` |

**Smoke test:**
```bash
# Start server locally with POSTHOG_API_KEY set
POSTHOG_API_KEY=phc_... node server.js

# Trigger a test checkout via Stripe CLI webhook replay
stripe trigger checkout.session.completed

# Watch PostHog Live Events for checkout_completed from server source
```

Check server logs for `posthog-node` capture calls — the library logs `[PostHog] Captured` in debug mode.

## 3. PostHog Funnel Configuration

In PostHog UI (eu.posthog.com):

1. Go to **Insights** → **+ New insight** → **Funnel**
2. Add steps in order:
   - `finder_opened`
   - `plan_selected`
   - `checkout_started`
   - `checkout_completed`
   - `qr_delivered`
3. Set time window to **14 days**
4. Save as **"Conversion Funnel v1"**
5. Add to a dashboard, then copy the dashboard ID into `VITE_POSTHOG_DASHBOARD_ID`

## 4. Admin Metrics Page

1. Ensure Clerk user has `publicMetadata.role = "admin"` set via Clerk Dashboard
2. Navigate to `/admin/metrics`
3. Verify:
   - KPI cards render (Total Orders, Revenue, Conversion Rate placeholder)
   - Orders table shows last 20 orders fetched from `/api/admin/orders`
   - PostHog dashboard iframe embeds (requires `VITE_POSTHOG_DASHBOARD_ID` set)
4. Non-admin user → redirected to `/account`

## 5. Render Environment Variables

Add to Render service (whoopgo-api):

```
POSTHOG_API_KEY=phc_<server-side-key>
POSTHOG_HOST=https://eu.posthog.com
VITE_POSTHOG_KEY=phc_<client-side-key>
VITE_POSTHOG_HOST=https://eu.posthog.com
VITE_POSTHOG_DASHBOARD_ID=<dashboard-id-from-posthog-ui>
```

Note: `VITE_POSTHOG_KEY` and `POSTHOG_API_KEY` can be the same project API key — PostHog
project keys are not secret (they appear in JS bundles by design). Only use different keys
if you want separate server vs client sources in PostHog.

## 6. Quality Gate Commands

```bash
npm run type-check   # must pass clean (zero errors)
npm run lint         # must pass clean (zero warnings)
```
