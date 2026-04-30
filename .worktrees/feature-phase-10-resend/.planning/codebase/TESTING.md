# TESTING

**Current state: no automated tests.** Repo has no `test/`, `tests/`, `__tests__/`, `*.test.ts`, or `*.spec.ts` files. `package.json` has no `test` script. Quality is enforced entirely by typing + linting + build success.

## What runs in CI

`.github/workflows/ci.yml` on every PR/push to `main` or `dev`:

1. `npm ci`
2. `npm run lint` — ESLint flat config with `typescript-eslint recommendedTypeChecked` + React Hooks + React Refresh rules. Fails on any lint error.
3. `npm run type-check` — `tsc --noEmit` across both `tsconfig.app.json` (src) and `tsconfig.node.json` (vite config).
4. `npm run build` — `tsc -b && vite build`. Catches import errors, chunk issues, missing modules.

`.github/workflows/deploy.yml` re-runs the same three gates on `main` before triggering the Render deploy via API.

## Manual verification flows (implicit)

These are the paths a human would walk; none are automated:

- **AI chat**: `POST /api/chat` with sample messages -> expect non-empty `content` from Claude Haiku.
- **Checkout**: pricing card -> `CheckoutButton` -> Stripe test card `4242 4242 4242 4242` -> `/checkout/success?session_id=...`.
- **Webhook**: `stripe listen --forward-to localhost:3001/api/webhooks/stripe` then trigger `checkout.session.completed`.
- **Airalo sandbox**: set `AIRALO_API_ENV=sandbox` + sandbox creds, run provisioning end-to-end, verify order transitions `provisioning` -> `ready` with QR payload.
- **Email delivery**: verify Resend sends QR email post-provision (check Resend dashboard since no receipt UI).
- **Order polling**: `CheckoutSuccess.tsx` polls `GET /api/orders/:sessionId` until `status === "ready"`.
- **Auth**: Clerk magic link flow via `AuthModal.tsx` -> confirm `useAuth()` hook populates user on `/account`.

## Recommended additions (not yet present)

- **Unit**: Vitest (already Vite-compatible) for `src/lib/*` — especially `stripe.ts` `getPlanById`, `analytics.ts` event shapes, `airalo.ts` `AIRALO_PACKAGE_MAP` key parity with `server.js PLANS`.
- **API contract**: Supertest against `server.js` for `/api/chat` (mock Anthropic), `/api/checkout` (mock Stripe), `/api/webhooks/stripe` (signed fixture payload).
- **E2E**: Playwright for the purchase happy path — since Vite dev + Express are independent processes, use `--web-server` with both.
- **Provider-selection matrix**: unit test `selectProvider()` across env combinations (`ESIM_PROVIDER` forced, `ESIMMCP_PLAN_IDS` allowlist, key-presence fallback).
- **Plan catalog drift**: lint that keys in `server.js:PLANS` === keys in `src/lib/stripe.ts:PLANS` === keys in `AIRALO_PACKAGE_MAP`.

## How to run what exists

```bash
npm run lint          # ESLint
npm run type-check    # tsc --noEmit
npm run build         # type-check + vite build
npm run dev           # Vite :5173 (frontend only — proxies to :3001)
node server.js        # Express :3001 (needed for /api/*)
npm run preview       # preview production bundle locally
```

## Gaps worth flagging

- No pre-commit hooks (no `husky`, no `lint-staged`). Contributors can push lint-failing code locally; CI catches it.
- No coverage instrumentation.
- No smoke test on deploy — Render deploy succeeds if the container boots, even if `/api/chat` 500s.
