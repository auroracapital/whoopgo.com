// Clerk user-sync webhook handler.
// Extracted from server.js so it can be unit-tested without booting Express.
//
// Uses svix for signature verification (Clerk's standard webhook signer).
// Accepts a pluggable `verifier` factory for tests to inject a stub.
//
// Phase 6: persists users to Postgres via users-repo.
//   user.created → upsert
//   user.updated → update
//   user.deleted → soft-delete (preserves row for order history joins)
// If DATABASE_URL is unset the repo silently no-ops, so webhooks still 200.

import {
  upsertUser as defaultUpsert,
  updateUser as defaultUpdate,
  softDeleteUser as defaultSoftDelete,
} from "./users-repo.js";

/**
 * Build an Express-style request handler for Clerk webhooks.
 *
 * @param {object} [opts]
 * @param {() => string | undefined} [opts.getSecret]
 * @param {(secret: string) => { verify: (body: Buffer | string, headers: Record<string, unknown>) => unknown }} [opts.verifierFactory]
 * @param {{ log: (...args: unknown[]) => void, error: (...args: unknown[]) => void }} [opts.logger]
 * @param {{ upsertUser?: Function, updateUser?: Function, softDeleteUser?: Function }} [opts.repo]
 */
export function createClerkWebhookHandler(opts = {}) {
  const {
    getSecret = () => process.env.CLERK_WEBHOOK_SECRET,
    verifierFactory,
    logger = console,
    repo = {},
  } = opts;

  const upsertUser = repo.upsertUser ?? defaultUpsert;
  const updateUser = repo.updateUser ?? defaultUpdate;
  const softDeleteUser = repo.softDeleteUser ?? defaultSoftDelete;

  return async function clerkWebhookHandler(req, res) {
    const secret = getSecret();
    if (!secret) {
      return res.status(503).json({ error: "Clerk webhook not configured" });
    }

    let verifier;
    try {
      if (verifierFactory) {
        verifier = verifierFactory(secret);
      } else {
        const { Webhook } = await import("svix");
        verifier = new Webhook(secret);
      }
    } catch (err) {
      logger.error("Clerk webhook verifier init failed:", err);
      return res.status(500).json({ error: "Verifier init failed" });
    }

    let evt;
    try {
      evt = verifier.verify(req.body, {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });
    } catch (err) {
      logger.error("Clerk webhook signature verification failed:", err);
      return res.status(400).json({ error: "Invalid signature" });
    }

    const { type, data } = evt ?? {};
    try {
      switch (type) {
        case "user.created":
          await upsertUser(data);
          logger.log(
            `Clerk user.created persisted: ${data?.id} ${data?.email_addresses?.[0]?.email_address ?? ""}`
          );
          break;
        case "user.updated":
          await updateUser(data);
          logger.log(`Clerk user.updated persisted: ${data?.id}`);
          break;
        case "user.deleted":
          await softDeleteUser(data);
          logger.log(`Clerk user.deleted soft-deleted: ${data?.id}`);
          break;
        default:
          logger.log(`Clerk webhook unhandled type=${type}`);
      }
    } catch (err) {
      // Persistence failure must not break the webhook contract — Clerk will
      // retry on non-2xx. Log loudly; swallow so we don't retry-loop on
      // transient DB blips.
      logger.error(`Clerk webhook DB write failed for type=${type}:`, err);
    }

    return res.json({ received: true });
  };
}
