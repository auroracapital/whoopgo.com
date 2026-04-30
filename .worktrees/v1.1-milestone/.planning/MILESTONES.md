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

## v1.1 Post-Launch Trust & Consolidation (Executing, drafted 2026-04-24)

**Theme:** Turn launch-day scaffolding into production-grade, revenue-ready infrastructure. Close every "wired but not finished" gap from the v1.0 addendum.

**Phases:**

- Phase 6 — Clerk Webhook → DB Persistence
- Phase 7 — E2E Signup Smoke Suite (Google / Apple / Facebook via Playwright)
- Phase 8 — Legal Review & Remove DRAFT Banners (Bjorn Schipper, HK entity)
- Phase 9 — Apple Pay + Google Pay Native Checkout (Stripe Express Checkout Element)
- Phase 10 — Transactional Email via Resend (welcome, receipt, referral)
- Phase 11 — Facebook Business Verification + Live Mode
- Phase 12 — Admin Dashboard (Orders + Users, Clerk-role-gated)

**Status:** All phases at CONTEXT.md stage; no plans or implementation yet.

---
