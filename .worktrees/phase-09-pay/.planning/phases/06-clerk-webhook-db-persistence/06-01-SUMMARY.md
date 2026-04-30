# Phase 6 — Summary

## What shipped
Clerk webhook now persists user events to Postgres. Users created / updated / deleted in Clerk are mirrored into a `users` table via a thin repo behind the existing svix-verified handler. All three cases are unit-tested and the handler survives DB outages (errors are swallowed, webhook still returns 200 so Clerk does not retry-loop).

## Database
- **Service**: Render managed Postgres
- **ID**: `dpg-d7lk5qbbc2fs73biak60-a`
- **Name**: `whoopgo-db`
- **Plan**: `basic_256mb` (~$6/mo) — free tier not available (`hueman-db` holds the one free slot)
- **Region**: oregon (matches `whoopgo-com` service)
- **Version**: Postgres 16
- **IP allow list**: `0.0.0.0/0` (same posture as other Render DBs in this workspace; relies on strong creds + SSL)
- **Connection strings**:
  - External (Doppler `whoopgo/prd`): `…oregon-postgres.render.com:5432/whoopgo`
  - Internal (Render env var on `srv-d7akcrfkijhs73dp5c3g`): `…-a/whoopgo` (VPC short hostname)

## Migration
`migrations/001_users.sql` — creates `users` table (`clerk_id` PK, email, name, created_at, updated_at, deleted_at) + partial index on `email` filtered to `deleted_at IS NULL`. Runner tracks applied files in `_migrations`. Applied successfully on 2026-04-24.

## Handler changes
`src/server/clerk-webhook.js`:
- Imports `upsertUser / updateUser / softDeleteUser` from new `users-repo.js`.
- `user.created` → INSERT … ON CONFLICT (clerk_id) DO UPDATE (idempotent on Clerk redelivery).
- `user.updated` → UPDATE email/name/updated_at.
- `user.deleted` → UPDATE deleted_at = NOW() (soft-delete; row retained for order-history joins).
- DB errors are caught + logged; webhook still returns 200.

## New files
| File | Purpose |
|---|---|
| `migrations/001_users.sql` | users table DDL |
| `scripts/migrate.js` | forward-only migration runner |
| `src/server/db.js` | pg Pool helper, `query()`, graceful no-op when unset |
| `src/server/users-repo.js` | upsert / update / soft-delete with Clerk payload normalisation |
| `tests/clerk-webhook-db.test.js` | 8 tests — handler routing + SQL contract |

## Quality gate
- `npm run type-check` — pass
- `npm run lint` — pass
- `npm test` — 19/19 pass (4 new handler routing tests + 4 new repo SQL-contract tests + 11 pre-existing)

## Open items
- orders → DB migration is still queued as a future phase; currently `orders` Map is in-memory.
- basic_256mb is paid ($6/mo). If Sam wants to drop to free, decommission `hueman-db` first.

## Deltas vs CONTEXT.md
The original CONTEXT.md (written pre-implementation) assumed Prisma + a TS webhook file + adding `orders.user_id` + a one-shot Clerk backfill script. Sam's Phase 6 task prompt narrowed scope:
- Plain SQL migrations + `pg` driver (no Prisma).
- Keep the existing `src/server/clerk-webhook.js` (JS, not TS).
- orders → DB migration moved to a future phase.
- No Clerk-users backfill script this phase. Suggested follow-up phase: read Clerk `/v1/users` paginated, `upsertUser` each row.
Everything else (idempotent on Svix replay, soft-delete, upsert on clerk_id) matches the original intent.
