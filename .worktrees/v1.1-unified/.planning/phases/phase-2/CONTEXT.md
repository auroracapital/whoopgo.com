# Phase 2 Context — Checkout & Payments

## Approach
- Stripe Checkout (hosted) — simplest PCI-compliant path, no card data touches our server
- Each plan tier gets a Stripe Price ID created dynamically via the API (no hardcoded price IDs)
- Server creates a checkout session, client redirects to Stripe-hosted page
- Success page reads session_id from URL, confirms order
- Webhook: checkout.session.completed persists order to in-memory store (Phase 4 will add DB)

## Plan catalog (matches AI assistant + pricing section in App.tsx)
Tourist: $4.99 (1GB/7d), Traveler: $14.99 (5GB/30d), Explorer: $29.99 (15GB/30d)
Regional/Global plans also supported via dynamic price creation.

## Files
- src/lib/stripe.ts — Stripe client + plan catalog
- src/components/CheckoutButton.tsx — buy button component
- server.js — add POST /api/checkout, POST /api/webhooks/stripe, GET /api/orders/:sessionId
- src/pages/CheckoutSuccess.tsx — success page
- src/pages/CheckoutCancel.tsx — cancel page
