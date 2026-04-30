# Phase 10 Context — Transactional Email via Resend

## Goal
Send branded transactional email from whoopgo.app: welcome, receipt, referral invite/reward. Triggered from Clerk webhook (Phase 6) and Stripe webhook (existing).

## Current state
- Cloudflare Email Routing forwards `support@whoopgo.app` → `info@auroracapital.nl` (inbound only).
- No outbound transactional email. Order confirmation email today is whatever Stripe Checkout sends (generic, unbranded).
- Resend is already registered in ops partner registry, API key in Doppler.

## Scope
- Resend SDK integration.
- Domain verification for `whoopgo.app` (SPF, DKIM, DMARC records in Cloudflare).
- React Email templates:
  - `welcome.tsx` — fired from Clerk `user.created`
  - `receipt.tsx` — fired from Stripe `checkout.session.completed` (replaces Stripe's generic receipt)
  - `esim-ready.tsx` — QR code + install instructions (currently inline in app, move to Resend for consistency)
  - `referral-invite.tsx` — user-triggered share
  - `referral-reward.tsx` — on successful referral conversion
- From address: `hello@whoopgo.app` (Resend) and `support@whoopgo.app` (reply-to).
- Audit log of sends in `email_events` table.

## Success criteria
- Test signup produces welcome email within 10s, rendered correctly in Gmail + Apple Mail + Outlook web.
- Test purchase produces branded receipt + eSIM-ready email replacing Stripe's.
- SPF/DKIM/DMARC all green in Resend dashboard and MXToolbox.
- Unsubscribe links on marketing-ish emails (referral invite) per CAN-SPAM / GDPR.
- No duplicate sends on webhook retries (idempotency key per event id).

## Rough approach
- React Email + Resend standard setup.
- Dispatcher: `src/email/send.ts` with typed template map.
- Event handlers add `email_events` row before send; Resend webhook marks delivered/bounced.
- Render env: `RESEND_API_KEY` from Doppler.

## Out of scope
- Drip campaigns / lifecycle marketing (Klaviyo territory).
- SMS notifications.
