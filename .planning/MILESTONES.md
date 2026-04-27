# Milestones

## v1.0 Launch-Ready eSIM Storefront (Shipped: 2026-04-16)

**Phases completed:** 5 phases (plus eSIMVault integration addendum)

**Key accomplishments:**

- Hardened codebase foundation — CI/CD, type safety, Render deploy pipeline
- Stripe checkout integrated — all pricing tiers wired, webhook-driven order flow, email confirmation
- eSIM.travel API integrated — automated QR code provisioning and delivery on successful payment
- User accounts shipped — auth, order history, account management
- Growth & retention — analytics, SEO, referrals, retention flows
- eSIMVault (esimmcp.com) added as second provider via abstraction layer in `server.js` (PR #7, merged 2026-04-16)

**Ship evidence:** PR #6 (commit `12dce0b`) for phases 1-5; PR #7 (commit `d6d275c`) for eSIMVault.

**Tech debt accepted:** Phases shipped inline without VERIFICATION.md / SUMMARY.md artifacts (see `milestones/v1.0-MILESTONE-AUDIT.md`). No functional gaps.

---

## v1.0 Addendum (2026-04-24)

Out-of-band post-launch work executed between milestone archive (2026-04-22) and v1.1 kickoff (2026-04-24). Canonical domain `whoopgo.app`, Cloudflare DNS/SSL/Email Routing, Clerk webhook + Google/Apple/Facebook SSO, Gemini 3.1 Flash-Lite chat, Terms + Privacy (HK entity, DRAFT), single-upstream eSIM via eSIMVault, contact + Render env hygiene. Full detail: `milestones/v1.0-addendum-2026-04-24.md`. PRs #11–#17.

---

## v1.1 Trust, Conversion & Traffic (Executing — kicked off 2026-04-24, unified 2026-04-26)

**Thesis:** Turn the v1.0 storefront into a measurable, trusted, revenue-ready machine. Instrument the funnel, earn organic traffic, close the AI-finder loop, ship the mobile app the FAQ already promises, harden trust + auth + legal + payment + email infra, get paid-acquisition-ready.

**Phases (13):**
1. Phase 6 — Funnel Analytics & Baseline Dashboard
2. Phase 7 — Country Landing Pages + Programmatic SEO (100+ pages)
3. Phase 8 — AI Finder v2 (Closer Mode)
4. Phase 9 — Trust & Social Proof Layer
5. Phase 10 — Mobile App (Expo RN, iOS + Android)
6. Phase 11 — Paid Acquisition Readiness
7. Phase 12 — Clerk Webhook → DB Persistence
8. Phase 13 — E2E Signup Smoke Suite (Google / Apple / Facebook via Playwright)
9. Phase 14 — Legal Review & Remove DRAFT Banners (Bjorn Schipper, HK entity)
10. Phase 15 — Apple Pay + Google Pay Native Checkout (Stripe Express Checkout Element)
11. Phase 16 — Transactional Email via Resend (welcome, receipt, referral)
12. Phase 17 — Facebook Business Verification + Live Mode
13. Phase 18 — Admin Console (Orders + Users + Email Events, Clerk-role-gated)

**Exit criteria (union of conversion/traffic + trust/consolidation themes):**
- ≥ 10k organic sessions/month from country-specific landing pages
- AI Finder → Stripe checkout conversion ≥ 8% (vs current unknown baseline)
- Mobile app (iOS + Android) live in stores with eSIM install flow
- Full funnel analytics: session → finder → checkout → activation → renewal
- First 100 paying customers acquired through v1.1 channels (excluding v1.0 referrals)
- Every Clerk user has a matching DB row; webhook idempotent under Svix replay
- Green E2E SSO smoke run against staging (Google / Apple / Facebook); alerts on failure
- Counsel-signed Terms + Privacy under HK entity; DRAFT banners removed
- Apple Pay + Google Pay complete full order flow end-to-end including provisioning + receipt
- Branded transactional email via Resend (welcome, receipt, referral); SPF/DKIM/DMARC green; no duplicate sends on webhook retry
- Facebook app in Live mode under HK entity verification; brand-new account can complete login
- Sam + Abeeha can triage orders/users/email-events without psql / Stripe Dashboard / Clerk Dashboard

**Status:** Phase 6 PLAN.md committed (PR #27 merged 2026-04-26). Phases 7-18 awaiting `/gsd-plan-phase`. See `.planning/ROADMAP.md` for detail + open questions.

---
