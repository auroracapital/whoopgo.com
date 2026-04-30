# Phase 12 Context — Admin Dashboard (Orders + Users)

## Goal
Stop using psql + Stripe Dashboard + Clerk Dashboard as the operational UI. Ship an in-app admin console for orders, users, and basic support actions.

## Current state
- Admin API endpoints exist (order list, refund, resend QR) but no UI.
- Sam + Abeeha triage orders by SSH'ing into the DB or cross-referencing Stripe + Clerk dashboards. Slow and error-prone.
- Phase 6 lands a real `users` table, which makes a proper admin users view feasible.

## Scope
- New routes under `/admin/*`, guarded by Clerk role check (`role === 'admin'` on user metadata).
- Views:
  - `/admin` — dashboard (today's orders, revenue, active users, failed provisioning alerts).
  - `/admin/orders` — table with filter/search, row detail drawer (Stripe link, eSIM provisioning status, resend QR, refund).
  - `/admin/users` — list, search by email, detail view with order history, soft-delete, role toggle.
  - `/admin/email-events` — log of Resend sends (depends on Phase 10).
- Role management: Sam grants admin via Clerk user metadata; UI reads that.
- Audit log table: every admin action (refund, role change, resend QR) stored with actor + timestamp.

## Success criteria
- Sam + Abeeha can run full support flows without touching psql or Stripe dashboard.
- Non-admin users hitting `/admin/*` get 404 (not 403, don't leak existence).
- All mutating actions produce an audit row.
- Mobile-usable (support triage from phone).

## Rough approach
- Reuse existing React + tokens; shadcn DataTable for lists.
- Server-side pagination (expect >1k orders over time).
- Clerk `has()` helper for role gate both client and server.
- Stripe customer/refund via existing server-side SDK.

## Out of scope
- Multi-tenant / reseller admin (no B2B yet).
- Financial reporting / cohort analysis (FinOps dashboard territory).
- Abeeha-specific scoped role (single `admin` role for v1.1; scoped roles post-v1.2).
