// Server-side PostHog event capture via posthog-node.
// Loaded by server.js (plain ESM .js — not TypeScript).
// Gracefully no-ops when POSTHOG_API_KEY is absent so local dev
// without a PostHog account never throws.

// Lazy-init promise — resolves to a PostHog client or null.
let _initPromise = null;
let _client = null;

async function init() {
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    const apiKey = process.env.POSTHOG_API_KEY;
    if (!apiKey) return null;
    try {
      const { PostHog } = await import("posthog-node");
      const host = process.env.POSTHOG_HOST ?? "https://eu.posthog.com";
      _client = new PostHog(apiKey, { host, flushAt: 1, flushInterval: 0 });
      return _client;
    } catch {
      return null;
    }
  })();
  return _initPromise;
}

/**
 * Capture a server-side PostHog event.
 *
 * @param {string} distinctId  - User identifier (Clerk userId or Stripe session ID)
 * @param {string} event       - Event name (snake_case)
 * @param {Record<string, unknown>} [properties] - Optional event properties
 */
export async function captureServerEvent(distinctId, event, properties = {}) {
  try {
    const client = await init();
    if (!client) return;
    client.capture({ distinctId, event, properties });
    // Flush immediately so events are not lost if process exits
    await client.flushAsync();
  } catch {
    // Never throw from analytics — silently swallow
  }
}
