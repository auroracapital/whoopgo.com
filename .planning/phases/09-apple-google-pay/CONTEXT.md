# Phase 9 — Apple Pay + Google Pay

**Milestone:** v1.1
**Status:** executing
**Created:** 2026-04-24

## Goal

Enable Apple Pay and Google Pay as payment options on the Stripe Checkout flow so mobile users can pay with a single tap instead of typing a card.

## Scope

- Serve Apple Pay domain association file at `/.well-known/apple-developer-merchantid-domain-association` (Stripe's standard file).
- Register `whoopgo.app` as an Apple Pay domain in Stripe (`POST /v1/apple_pay/domains`).
- Enable Apple Pay + Google Pay on Stripe Checkout sessions. They are wallet overlays on `card`, not separate `payment_method_types` values, so the fix is to drop the explicit `payment_method_types: ["card"]` restriction and let Stripe Dashboard settings control which methods render.

## Out of scope

- Switching from Stripe Checkout redirect to Payment Element / Express Checkout Element (larger refactor, not required).
- Native iOS/Android in-app purchase.

## References

- https://docs.stripe.com/apple-pay
- https://docs.stripe.com/payments/checkout/apple-pay
- https://docs.stripe.com/apple-pay/web/domain-registration
