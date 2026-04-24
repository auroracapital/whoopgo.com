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

## v1.1 Conversion, Traffic & Trust (In Planning — kicked off 2026-04-24)

**Thesis:** Turn the v1.0 storefront into a revenue machine. Measure the funnel, earn organic traffic, close the AI-finder loop, ship the mobile app the FAQ already promises, stand up trust signals, get paid-ready.

**Phases (6):**
1. Phase 6 — Funnel Analytics & Baseline Dashboard
2. Phase 7 — Country Landing Pages + Programmatic SEO (100+ pages)
3. Phase 8 — AI Finder v2 (Closer Mode)
4. Phase 9 — Trust & Social Proof Layer
5. Phase 10 — Mobile App (Expo RN, iOS + Android)
6. Phase 11 — Paid Acquisition Readiness

**Exit criteria:** 10k organic sessions/mo, finder→checkout ≥8%, mobile app live, full funnel instrumented, 100 v1.1-attributed paying customers. See `.planning/ROADMAP.md` for detail + open questions.

---
