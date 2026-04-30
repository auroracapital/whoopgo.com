# Phase 9 Context — Apple Pay + Google Pay Native Checkout

## Goal
Cut checkout friction by offering Apple Pay and Google Pay via Stripe's Payment Request Button directly on the product page — no redirect to Stripe Checkout for mobile wallet users.

## Current state
- All checkout goes through Stripe Checkout (hosted redirect).
- Mobile conversion rate is the weakest funnel step.
- Stripe account is already live with cards + SEPA.

## Scope
- Integrate Stripe Payment Request Button (PRB) on the plan selection page.
- Fallback to existing Stripe Checkout when PRB unavailable (desktop Chrome without saved wallet, unsupported browsers).
- Domain verification file hosted at `/.well-known/apple-developer-merchantid-domain-association` (required by Apple Pay).
- Same webhook handler already in place — PRB creates a PaymentIntent, success triggers existing provisioning flow.
- Keep analytics parity: `checkout_started` / `checkout_completed` events must fire for PRB path too.

## Success criteria
- Apple Pay sheet appears on Safari iOS/macOS with saved cards.
- Google Pay sheet appears on Chrome Android with saved cards.
- Full order flow (eSIM provisioning, email receipt) works end-to-end from PRB.
- Desktop / unsupported browsers still see the regular Stripe Checkout button.
- Stripe Dashboard shows successful PRB test charges in test mode.

## Rough approach
- Enable Payment Request API in Stripe Dashboard (Apple Pay domain registration).
- `@stripe/stripe-js` + `@stripe/react-stripe-js` (already installed for Checkout).
- New component `<ExpressCheckout />` rendered above existing checkout button.
- Use Stripe's new Express Checkout Element (supersedes legacy PRB) — check Context7 for latest 2026 API.
- Update webhook handler only if event shape differs (it shouldn't — still `payment_intent.succeeded`).

## Out of scope
- Link (Stripe's 1-click) — separate evaluation.
- PayPal, Alipay, WeChat Pay.
- Subscription / auto-renewal via PRB.
