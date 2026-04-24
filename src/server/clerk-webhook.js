// Clerk user-sync webhook handler.
// Extracted from server.js so it can be unit-tested without booting Express.
//
// Uses svix for signature verification (Clerk's standard webhook signer).
// Accepts a pluggable `verifier` factory for tests to inject a stub.

/**
 * Build an Express-style request handler for Clerk webhooks.
 *
 * @param {object} [opts]
 * @param {() => string | undefined} [opts.getSecret] - returns signing secret (defaults to process.env.CLERK_WEBHOOK_SECRET)
 * @param {(secret: string) => { verify: (body: Buffer | string, headers: Record<string, unknown>) => unknown }} [opts.verifierFactory]
 *   - factory that builds a svix-compatible verifier (defaults to real svix.Webhook)
 * @param {{ log: (...args: unknown[]) => void, error: (...args: unknown[]) => void }} [opts.logger]
 */
export function createClerkWebhookHandler(opts = {}) {
  const {
    getSecret = () => process.env.CLERK_WEBHOOK_SECRET,
    verifierFactory,
    logger = console,
  } = opts;

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
    switch (type) {
      case "user.created":
        // TODO: upsert user in DB (Phase 4+ when persistent store lands)
        logger.log(
          `Clerk user.created: ${data?.id} ${data?.email_addresses?.[0]?.email_address ?? ""}`
        );
        break;
      case "user.updated":
        logger.log(`Clerk user.updated: ${data?.id}`);
        break;
      case "user.deleted":
        logger.log(`Clerk user.deleted: ${data?.id}`);
        break;
      default:
        logger.log(`Clerk webhook unhandled type=${type}`);
    }

    return res.json({ received: true });
  };
}
