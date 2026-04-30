# Phase 4.2 — Clerk User-Sync Webhook

**Status:** Shipped
**Branch:** `feature/clerk-webhook-user-sync` → PR to `main`

## What

Added a Clerk webhook endpoint at `POST /api/webhooks/clerk` that receives
`user.created`, `user.updated`, and `user.deleted` events from the Clerk
dashboard and logs them. Wiring for DB persistence is marked with a `TODO`
for when the persistent user store lands.

## Why

Closes the last gap in Phase 4 (Clerk auth). Without this, users who sign up
or update their profile in Clerk never reach our backend — we rely on the
frontend passing `userId` into checkout metadata, but profile updates, account
deletions, and out-of-band user mutations are invisible.

## Implementation

- **Handler:** `src/server/clerk-webhook.js` exports `createClerkWebhookHandler()`
  — factory returns an Express handler and accepts a pluggable
  `verifierFactory` for tests. Follows the same raw-body pattern as the Stripe
  webhook (`app.use("/api/webhooks/clerk", express.raw(...))`).
- **Signature verification:** `svix` (Clerk's standard webhook signer). Rejects
  bad signatures with `400`; returns `503` when `CLERK_WEBHOOK_SECRET` is unset
  so misconfigured environments fail loud.
- **Tests:** `tests/clerk-webhook.test.js` (node:test) — 7 cases covering
  missing secret, missing headers, bad signature, `user.created`/`updated`/
  `deleted`, and unhandled event types. All pass.

## Files changed

- `server.js` — wire raw-body middleware + mount handler
- `src/server/clerk-webhook.js` — new handler module
- `tests/clerk-webhook.test.js` — new unit tests
- `.env.example` — document `CLERK_WEBHOOK_SECRET`
- `package.json` — add `svix` dep + `test` script (node:test)

## Dependency added

- `svix@^1.x` — Clerk's standard webhook signer (not a Clerk-specific lib)

## Deployment checklist (manual)

1. Add `CLERK_WEBHOOK_SECRET` to Doppler (`whoopgo/prd` + `whoopgo/stg`).
2. In the Clerk dashboard → **Webhooks** → **Add Endpoint**:
   - URL: `https://whoopgo-com.onrender.com/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy the signing secret (starts with `whsec_`) → Doppler.
3. Redeploy Render web service so the env var is picked up.
4. Smoke test from the Clerk dashboard "Send test event" button.

## Quality gate

- `npm run type-check` — pass
- `npm run lint` — pass
- `npm test` — 7/7 pass
