# Phase 2 Plan — Checkout & Payments

## Steps
1. src/lib/stripe.ts — plan catalog + Stripe publishable key export
2. src/components/CheckoutButton.tsx — reusable buy button
3. Wire buy buttons into App.tsx pricing section
4. server.js — POST /api/checkout (create session), POST /api/webhooks/stripe, GET /api/orders/:id
5. src/pages/CheckoutSuccess.tsx — show order confirmation + QR placeholder
6. src/pages/CheckoutCancel.tsx — friendly cancel/retry page
7. Add routing (React Router or hash-based) for /checkout/success and /checkout/cancel
8. Quality gate
