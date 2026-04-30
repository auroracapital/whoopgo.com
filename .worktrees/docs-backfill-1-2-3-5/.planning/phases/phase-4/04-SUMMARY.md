# Phase 4 Summary — User Accounts (Clerk)

**Status:** Shipped (pre-existing, retro-documented 2026-04-24)
**Branch merged from:** `fix/api-orders-auth` (and predecessors) → `main`
**Package:** `@clerk/clerk-react@^5.61.5`

## What shipped

Clerk React wiring across the storefront with three integration points:

1. `src/lib/auth-provider.tsx` — `<ClerkProvider publishableKey={...} afterSignOutUrl="/">` wraps the app, reads `VITE_CLERK_PUBLISHABLE_KEY` from env.
2. `src/lib/auth.ts` — custom `useAuth()` hook built on `useUser` + `useClerk` exposing sign-in/sign-out handlers and user state to the app.
3. `src/components/AuthModal.tsx` — `<SignIn />` component rendered inside a modal for inline auth (no full-page redirect).

Server-side order auth also shipped (not part of phase-4 strictly, but unblocked by this phase):
- `/api/orders` admin-only gate via bearer-token HMAC comparison
- `/api/orders/by-user` frontend-facing endpoint scoped to the authenticated Clerk user

## Verification artifacts

- Commit `acd2992` — split `/api/orders` for frontend vs admin
- Commit `4b080ae` — HMAC bearer comparison (timing-leak fix)
- PR #8 — admin auth requirement for `/api/orders`

## Outstanding blockers (carryover)

1. **Doppler project** — provisioned 2026-04-24 (`whoopgo` project, configs: dev/stg/prd). Clerk keys NOT yet populated — Sam to pull `pk_live_*` / `sk_live_*` from `dashboard.clerk.com` (log in via "Login with GitHub") and run:
   ```
   doppler secrets set --project whoopgo --config prd \
     VITE_CLERK_PUBLISHABLE_KEY="pk_live_..." \
     CLERK_SECRET_KEY="sk_live_..."
   ```
   (Repeat for `stg` if staging uses a separate Clerk instance.)

2. **Clerk welcome email** — must be disabled BEFORE first real signup. Clerk dashboard → User & Authentication → Email, Phone, Username → Email addresses → toggle off "Welcome email". No programmatic API for this setting.

3. **Eslint hygiene** — PR [#10](https://github.com/auroracapital/whoopgo.com/pull/10) (`chore/lint-ignore-worktrees`) adds `.worktrees` + `node_modules` to globalIgnores so parallel-agent worktrees don't break lint. Unrelated to Clerk; awaiting standard review.
