# Phase 6 Context — Clerk Webhook → DB Persistence

## Goal
Persist Clerk user lifecycle events into the app database so users are first-class rows, linkable to orders and downstream features (referrals, admin UI, transactional email).

## Current state
- Clerk webhook endpoint exists at `/api/webhooks/clerk` (PR #11) but only verifies the Svix signature and logs the event.
- Orders are stored without a `user_id` FK — guest checkout only.
- Google / Apple / Facebook SSO all land in Clerk but nothing hits our DB.

## Scope
- Handle `user.created`, `user.updated`, `user.deleted` events.
- Upsert into a `users` table keyed by `clerk_user_id`; store email, name, primary auth provider, created_at, updated_at, deleted_at (soft delete).
- Backfill existing Clerk users once via a one-shot admin script.
- Add `user_id` column to `orders` and backfill by email match where possible.
- Idempotent handler (Svix replay-safe).

## Success criteria
- A fresh signup via Google/Apple/Facebook creates a matching row in `users` within <2s of the webhook firing.
- `user.deleted` soft-deletes the row (keeps orders intact).
- Orders placed by a signed-in user carry `user_id`; guest orders stay null.
- Handler passes replay test (same event delivered twice → single row).

## Rough approach
- Prisma migration for `users` + `orders.user_id`.
- `src/webhooks/clerk.ts` switch on event type, upsert helper.
- Admin backfill script: `scripts/backfill-clerk-users.ts`.
- Unit tests for each event type, integration test with a recorded Svix payload.

## Out of scope
- User-facing profile page (Phase 12 admin dashboard).
- Stripe customer linkage (Phase 10 will tie user_id ↔ stripe_customer_id).
