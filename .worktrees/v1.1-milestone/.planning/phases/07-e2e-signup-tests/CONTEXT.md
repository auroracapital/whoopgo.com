# Phase 7 Context — End-to-End Signup Smoke Suite

## Goal
Catch SSO regressions before users do. Playwright suite that hits REAL Clerk + real Google/Apple/Facebook sandbox accounts once a month (or on demand).

## Current state
- No E2E coverage on the auth surface. v1.1 Phase 6 introduces DB persistence, so silent SSO breakage would now corrupt user rows as well as block logins.

## Scope
- Playwright project `e2e/auth/` with 3 specs:
  - `google-signup.spec.ts`
  - `apple-signup.spec.ts`
  - `facebook-signup.spec.ts`
- Each test: load signup page → click provider button → complete provider flow with a dedicated test account → assert redirect to dashboard → assert `users` row exists via admin API → tear down user via Clerk Backend API.
- Credentials in GitHub Actions secrets (`TEST_GOOGLE_USER`, `TEST_APPLE_USER`, `TEST_FB_USER` + passwords).
- Scheduled GH Actions workflow: `.github/workflows/auth-smoke.yml` — cron `0 9 1 * *` (1st of month, 09:00 UTC) + `workflow_dispatch`.
- Slack/email alert on failure.

## Success criteria
- Green run end-to-end against staging.
- Manual `workflow_dispatch` passes three times in a row with no flake.
- Failure mode produces a usable stack trace + screenshot artifact.

## Rough approach
- Start Google flow first (lowest friction). Apple requires a real paid developer-linked Apple ID — document setup in `e2e/auth/README.md`.
- Facebook test user created via Graph API `/test-users` endpoint — script in `e2e/auth/setup-fb-test-user.ts`.
- Use Playwright's `storageState` to reuse sessions between assertion steps only; never cache through provider login itself.

## Out of scope
- Email/password signup (Clerk primary not used).
- Magic link flow (separate spec if needed post-Phase 10).
