# Phase 9 — Apple Pay + Google Pay — Summary

**Status:** shipped (code)
**Date:** 2026-04-24
**Branch:** feature/phase-09-pay

## Changes

1. **Apple Pay domain association file**
   - Added `public/.well-known/apple-developer-merchantid-domain-association` (Stripe's standard file, 9094 bytes, fetched from https://stripe.com/files/apple-pay/...).
   - Added explicit Express route in `server.js` serving the file at `/.well-known/apple-developer-merchantid-domain-association` as `text/plain`, declared BEFORE `express.static(dist)` and the SPA catch-all.
   - Uses `{ dotfiles: "allow" }` — required because Express/`send` denies dotfile paths by default (verified locally: without it, returns 404).

2. **Checkout session — wallet enablement**
   - Removed `payment_method_types: ["card"]` from `stripe.checkout.sessions.create` call in `/api/checkout`. Apple Pay and Google Pay are NOT separate `payment_method_types` values — they are wallet overlays on `card`. Omitting the list lets Stripe Checkout auto-include every method enabled in the Dashboard.
   - Added an inline comment documenting the Dashboard + domain-registration prerequisites so this isn't reverted by future refactors.

## Test results

- `npm run type-check` — clean
- `npm run lint` — clean
- `npm test` — 19 pass / 0 fail
- Smoke test: spun up minimal Express app with the new route, `GET /.well-known/apple-developer-merchantid-domain-association` → `200 text/plain`, body length 9094 bytes ✓

## Manual steps required (Sam)

The Stripe secret key is **not** in Doppler (`whoopgo/prd` has no `STRIPE_SECRET_KEY` — it's managed directly in Render env). So the following two actions must be done by Sam after the PR merges and deploys:

1. **Register whoopgo.app as Apple Pay domain** (one-time, via Stripe Dashboard or CLI):
   ```
   curl -sS https://api.stripe.com/v1/apple_pay/domains \
     -u $STRIPE_SECRET_KEY: \
     -d domain_name=whoopgo.app
   ```
   Or: Dashboard → Settings → Payment methods → Apple Pay → Add new domain → `whoopgo.app`.
   Stripe will probe `/.well-known/apple-developer-merchantid-domain-association` and verify.

2. **Enable Apple Pay + Google Pay in Stripe Dashboard**:
   - Dashboard → Settings → Payment methods
   - Toggle ON: **Apple Pay**, **Google Pay**
   - Both should already be available since `card` is enabled — wallets inherit from it.

## Verification after Sam's manual steps

- Open pricing page on iPhone Safari (signed in to iCloud with a card in Wallet) → click Buy → on Stripe Checkout, Apple Pay sheet should appear.
- Open pricing page on Chrome desktop with saved cards → Google Pay button should render on Checkout.
- Or: `stripe.checkout.sessions.retrieve(<id>)` — `payment_method_types` will include `card` and the wallet methods will appear in the hosted UI.

## Out of scope / deferred

- Inline Express Checkout Element on the pricing page (would need React refactor). Current Checkout redirect is kept; it natively renders Apple/Google Pay once domain is verified + methods are enabled.
