// Postgres pool helper for the WhoopGO server.
// Graceful degradation: if DATABASE_URL is unset, `query` becomes a no-op
// that resolves to { rows: [] } and logs a warning. This keeps webhooks
// returning 200 during local dev or if the DB is temporarily unreachable.

import pg from "pg";

const { Pool } = pg;

let pool = null;
let warned = false;

export function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    if (!warned) {
      console.warn("DB not configured — DATABASE_URL missing; user persistence disabled");
      warned = true;
    }
    return null;
  }

  pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    // Render managed Postgres uses SSL; trust their CA.
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
  });

  pool.on("error", (err) => {
    console.error("Postgres pool error:", err);
  });

  return pool;
}

/**
 * Execute a parameterised query. Returns { rows } shape matching pg.
 * If no DB is configured, resolves to { rows: [] } without throwing.
 *
 * @param {string} text
 * @param {unknown[]} [params]
 * @returns {Promise<{ rows: unknown[] }>}
 */
export async function query(text, params = []) {
  const p = getPool();
  if (!p) return { rows: [] };
  return p.query(text, params);
}

export function isDbConfigured() {
  return !!process.env.DATABASE_URL;
}

// Test seam — allow tests to inject a fake pool / query fn.
export function __setPoolForTests(fake) {
  pool = fake;
}
