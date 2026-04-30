// User repository: Clerk webhook handlers call these to persist user rows.
// Isolated behind a small interface so handlers are trivially testable.

import { query, isDbConfigured } from "./db.js";

function firstEmail(data) {
  const emails = data?.email_addresses;
  if (!Array.isArray(emails) || emails.length === 0) return null;
  const primaryId = data?.primary_email_address_id;
  const primary = emails.find((e) => e?.id === primaryId) ?? emails[0];
  return primary?.email_address ?? null;
}

function fullName(data) {
  const first = data?.first_name ?? "";
  const last = data?.last_name ?? "";
  const joined = `${first} ${last}`.trim();
  return joined || null;
}

/**
 * Upsert a user on `user.created`. Idempotent — safe to re-run if Clerk
 * redelivers the webhook.
 */
export async function upsertUser(data, { queryFn = query } = {}) {
  if (!isDbConfigured()) return { rows: [], skipped: true };
  const clerkId = data?.id;
  if (!clerkId) throw new Error("user event missing data.id");
  return queryFn(
    `INSERT INTO users (clerk_id, email, name)
     VALUES ($1, $2, $3)
     ON CONFLICT (clerk_id) DO UPDATE SET
       email = EXCLUDED.email,
       name = EXCLUDED.name,
       updated_at = NOW(),
       deleted_at = NULL`,
    [clerkId, firstEmail(data), fullName(data)]
  );
}

/**
 * Update email / name on `user.updated`.
 */
export async function updateUser(data, { queryFn = query } = {}) {
  if (!isDbConfigured()) return { rows: [], skipped: true };
  const clerkId = data?.id;
  if (!clerkId) throw new Error("user event missing data.id");
  return queryFn(
    `UPDATE users
     SET email = $2, name = $3, updated_at = NOW()
     WHERE clerk_id = $1`,
    [clerkId, firstEmail(data), fullName(data)]
  );
}

/**
 * Soft-delete on `user.deleted`. Preserves the row so orders referencing
 * this clerk_id remain queryable for audit / refund history.
 */
export async function softDeleteUser(data, { queryFn = query } = {}) {
  if (!isDbConfigured()) return { rows: [], skipped: true };
  const clerkId = data?.id;
  if (!clerkId) throw new Error("user event missing data.id");
  return queryFn(
    `UPDATE users SET deleted_at = NOW(), updated_at = NOW() WHERE clerk_id = $1`,
    [clerkId]
  );
}
