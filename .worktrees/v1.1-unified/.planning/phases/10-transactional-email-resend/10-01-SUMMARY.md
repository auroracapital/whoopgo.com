# Phase 10 — Transactional Email via Resend — Summary

**Status:** shipped (pending PR review)
**Branch:** `feature/phase-10-resend`
**Date:** 2026-04-24

## What shipped

- `src/server/email.js` — transactional email module wrapping the official `resend` SDK.
  - `createEmailSender({ client, getApiKey, defaults, logger })` — DI-friendly factory; tests inject a stub Resend client.
  - `sendWelcomeEmail(user)` — fired on `user.created` Clerk events. Plain-text + HTML, brand-consistent (`#E67E3C` orange → `#5B7FC7` blue gradient). HTML-escapes user-provided fields.
  - `sendOrderReceipt({ user, plan, country, qrCode, iccid, activationCode, amountCents, sessionId })` — fired on `checkout.session.completed` after eSIM provisioning. Inlines the QR code, surfaces LPA manual code when present, includes price receipt and order ID.
  - From: `WhoopGO! <support@whoopgo.app>`, reply-to `support@whoopgo.app`.
- `src/server/clerk-webhook.js` — `user.created` branch now fires `sendWelcomeEmail` asynchronously. Failures are logged but never break the 200 webhook contract. New `opts.email.sendWelcomeEmail` injection point for tests.
- `server.js` — `provisionEsim` now calls `sendOrderReceipt` with plan/QR/ICCID/LPA/price. Legacy inline `sendEsimEmail` helper removed (superseded). Fixed pre-existing `provider is not defined` bug in the log line.
- `tests/email.test.js` — 14 new tests covering both templates, Clerk wiring, HTML escaping, no-API-key skip, no-email skip, Resend API error surface, and "welcome failure must not fail the webhook."

## Resend infrastructure

- Domain `whoopgo.app` registered with Resend (id `0915e28b-57ef-4ab5-a5dc-70aa5e64bc32`, region `us-east-1`).
- DKIM + SPF records added to Cloudflare zone `2e0ebaa425654d6a37640fdafaa4534e`:
  - `resend._domainkey` TXT (DKIM public key)
  - `send` MX `feedback-smtp.us-east-1.amazonses.com` priority 10
  - `send` TXT `v=spf1 include:amazonses.com ~all`
- Resend domain **status: verified** (DKIM + both SPF records green).
- `RESEND_API_KEY` copied from `upres` Doppler project → `whoopgo` Doppler project → Render service `srv-d7akcrfkijhs73dp5c3g` (per-var PUT, HTTP 200).

## Quality gate

- `npm run type-check`: clean.
- `npm run lint`: clean.
- `npm test`: **31 pass, 0 fail** (14 new + 17 pre-existing).
- No outbound calls in tests — Resend client is stubbed.

## Deferred

- Referral invite / referral reward emails (explicit out-of-scope per task).
- `email_events` audit table + idempotency keys (Phase 10 CONTEXT mentions this; not in minimal MVP).
- React Email templates / `esim-ready.tsx` dedicated template (inline HTML meets acceptance criteria for v1.1).

## Operational notes

- Welcome email fires on every `user.created` — Sam confirmed this is intended (Clerk wasn't sending one).
- Order receipt supersedes Stripe's generic receipt; Stripe receipts can be disabled in Stripe Dashboard if desired (not done automatically).
- If `RESEND_API_KEY` is unset in an environment, both template functions log a warn and return `{ skipped: true }` — non-breaking.
