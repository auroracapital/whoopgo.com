-- Phase 6: Clerk user persistence
-- Syncs Clerk users into Postgres so /api/orders/by-user can eventually
-- JOIN on a real user row rather than relying solely on userId metadata.

CREATE TABLE IF NOT EXISTS users (
  clerk_id    TEXT PRIMARY KEY,
  email       TEXT,
  name        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (email) WHERE deleted_at IS NULL;
