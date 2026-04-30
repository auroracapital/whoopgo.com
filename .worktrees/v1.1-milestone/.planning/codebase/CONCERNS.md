# CONCERNS

Concrete risks, sharp edges, and tech debt discovered during the mapping pass. Ordered by severity.

## P0 — Production data loss

- **In-memory order store** (`server.js:52`): `const orders = new Map()`. Every Render deploy/restart drops all orders. Already flagged in source (`// Phase 4 replaces with DB`), but the webhook path already writes paid orders into it — so a Render cold start between checkout and `/checkout/success` polling = user sees "order not found" after paying. Needs Postgres/Redis **before any real traffic**.
- **`GET /api/orders` has no auth** (`server.js:306`): returns ALL orders when no `userId`/`email` filter provided. Anyone can list every customer's email, plan, ICCID, activation code. Treat as critical PII leak.
- **`GET /api/orders/:sessionId`** (`server.js:300`): unauthenticated lookup by Stripe session ID. IDs are unguessable (~`cs_live_...`) so practical risk is low, but any leaked session ID exposes QR + activation code permanently.

## P1 — Security

- **CORS wide open** (`server.js:12`): `app.use(cors())` allows any origin to POST to `/api/chat`, `/api/checkout`, `/api/contact`, `/api/newsletter/subscribe`. Cost + abuse exposure — someone can burn your Anthropic budget from any site. Lock to `https://whoopgo.com` + Render preview origins.
- **No rate limiting anywhere**. `/api/chat` proxies to Claude Haiku with `max_tokens: 300` — one bad actor in a loop = real money. Add `express-rate-limit` keyed on IP + per-route budgets.
- **Clerk JWT not verified server-side**. `/api/auth/*` are stubs (`server.js:321`, `336`). `/api/orders` filtering relies on client-supplied `userId`/`email` query params — trivially spoofed. Need `@clerk/backend` `verifyToken()` on any authed route.
- **Anthropic key fingerprint in logs** (`server.js:27`): `apiKey.slice(0, 8)` — fine for sk-ant prefix but sets a precedent; scrub before production log aggregation.
- **No Stripe webhook idempotency**. A replayed `checkout.session.completed` creates a second order + triggers second provisioning + second charge from Airalo. Dedupe on `event.id` or `session.id`.

## P1 — Correctness / Consistency

- **Plan catalog duplicated three times**:
  - `server.js:38-48` (9 plans, authoritative for Stripe pricing)
  - `src/lib/stripe.ts:14-96` (9 plans, authoritative for UI)
  - `src/lib/airalo.ts:36-46` (9 plans, authoritative for Airalo slug mapping)
  - `server.js:55-88` Anthropic system prompt embeds yet another price list (has MORE countries than the actual catalog — UK, DE, IT, ES, JP, TH, TR don't exist as plan IDs).
  - Chat can recommend plans we can't sell.
- **AI prompt price drift**: system prompt lists `$3.99` / `$7.99` / `$11.99` / `$19.99` Thailand plans not in `PLANS`. Any user who asks for Thailand gets a recommendation that breaks at checkout.
- **Dual eSIM providers, one codepath**: `selectProvider()` can route to `esimmcp` but Airalo-specific slug map (`AIRALO_PACKAGE_MAP`) is the only slug source. `callEsimmcpApi` (`server.js:489`) must have its own mapping — verify symmetry.

## P2 — Build / Deploy

- **`dist/` is tracked in git** (listed in `ls -la` output). Render CI also runs `npm run build` in `deploy.yml:32`, so the committed `dist/` is redundant + can drift. Add to `.gitignore`.
- **Deploy workflow doesn't gate on CI workflow**. `deploy.yml` re-runs lint+type-check+build independently. If CI passes but deploy fails (flaky network, etc.), `main` has a "green" commit that isn't live. Consider `workflow_run` trigger or a shared composite action.
- **`build:prod` script** (`package.json:14`) skips type-check (`"vite build"` only) vs `build` (`"tsc -b && vite build"`). Dead alias or a footgun — delete or use consistently.
- **TypeScript 6.0 + typescript-eslint 8.58**: TS 6.0 is very new; double-check `typescript-eslint` fully supports it or pin to ~5.x for stability.

## P2 — Code health

- **`App.tsx` is 1097 lines**. Landing + pricing + FAQ + contact + theme + nav all in one component. Hard to maintain, impossible to lazy-load sections. Split into `src/pages/Landing/{Hero,Pricing,Finder,Faq,Contact}.tsx`.
- **`server.js` is 800 lines, single file**. Extract providers (`lib/airalo.js`, `lib/esimmcp.js`, `lib/resend.js`) + routes (`routes/checkout.js`, `routes/orders.js`, `routes/chat.js`).
- **No tests** (see `TESTING.md`). Refactors above are risky without a safety net.
- **`auth-context.ts` is 2 lines**. Either inline it or delete — dead-weight file.
- **Unused `FIVESIM_API_KEY`-style patterns**: `.env.example` documents `VITE_POSTHOG_HOST` but PostHog init tolerates missing keys silently — no warning if misconfigured in prod.

## P3 — UX / Product

- **Checkout success page polls** (`CheckoutSuccess.tsx`). If Airalo provisioning is slow / fails, user sees perpetual loader. Add timeout + "we'll email you" fallback.
- **Webhook failure path**: `provisionEsim` catch-block (`server.js:291`) sets status `failed` but nothing notifies the user or triggers retry. Stripe was already charged.
- **Email-only order identification**: `/api/orders?email=` returns orders matching an email string — anyone who guesses a customer's email can list their orders. See P0.

## Quick wins (< 1 hr each)

1. Lock CORS to `whoopgo.com` origin.
2. Add `express-rate-limit` to `/api/chat`, `/api/contact`, `/api/newsletter/subscribe`.
3. Remove `dist/` from git; add to `.gitignore`.
4. Delete `auth-context.ts` or document its role.
5. Consolidate plan catalog into one JSON file imported both client + server.
6. Sync AI system prompt to real catalog (or generate it from the catalog).
