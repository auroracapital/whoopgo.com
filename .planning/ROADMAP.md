# Roadmap — whoopgo.com

## Milestones

- ✅ **v1.0 Launch-Ready eSIM Storefront** — Phases 1-5 (shipped 2026-04-16) — see `milestones/v1.0-ROADMAP.md`
- ✅ **v1.0 Addendum** — Domain, SSO wiring, legal scaffolding, provider consolidation (2026-04-24) — see `milestones/v1.0-addendum-2026-04-24.md`
- 🚧 **v1.1 Post-Launch Trust, Auth & Consolidation** — Phases 6-12 (executing)

## Phases

<details>
<summary>✅ v1.0 Launch-Ready eSIM Storefront (Phases 1-5) — SHIPPED 2026-04-16</summary>

- [x] Phase 1: Foundation & Quality — CI, type safety, README, Render deploy
- [x] Phase 2: Checkout & Payments — Stripe integration, webhooks, success/cancel pages
- [x] Phase 3: eSIM Provisioning & Delivery — eSIM.travel + eSIMVault providers, QR delivery
- [x] Phase 4: User Accounts & Order Management — auth, order history, renewals
- [x] Phase 5: Growth & Retention — analytics, SEO, referrals, email capture

</details>

### 🚧 v1.1 Post-Launch Trust, Auth & Consolidation

Theme: Turn the launch-day scaffolding (SSO wiring, draft legal pages, single provider) into production-grade, revenue-ready infrastructure. Close every "we wired it but didn't finish it" gap from the 2026-04-24 out-of-band work.

- [ ] **Phase 6 — Clerk Webhook → DB Persistence**
  - Persist `user.created/updated/deleted` into a `users` table; link orders via `user_id` FK.
  - Success: every Clerk user has a matching DB row; webhook is idempotent under Svix replay.
- [ ] **Phase 7 — E2E Signup Smoke Suite**
  - Playwright specs for Google, Apple, Facebook SSO, running monthly on a cron and on-demand.
  - Success: green run against staging with real provider accounts; alerts on failure.
- [ ] **Phase 8 — Legal Review & Remove DRAFT Banners**
  - Engage Bjorn Schipper (plusonelegal.nl) for counsel review under HK entity (Lifecycle Innovations Limited, BRN 76545088). Adapt fiberwifi brief template.
  - Success: signed-off Terms + Privacy; DRAFT banners removed; `last_reviewed` stamp added.
- [ ] **Phase 9 — Apple Pay + Google Pay Native Checkout**
  - Stripe Payment Request / Express Checkout Element on product page; fallback to existing Checkout.
  - Success: mobile wallets complete full order flow end-to-end, including provisioning + receipt.
- [ ] **Phase 10 — Transactional Email via Resend**
  - Welcome (Clerk `user.created`), receipt + eSIM-ready (Stripe webhook), referral invite/reward. React Email templates. SPF/DKIM/DMARC green.
  - Success: no duplicate sends on webhook retry; audit log in `email_events`.
- [ ] **Phase 11 — Facebook Business Verification + Live Mode**
  - Meta Business Verification under HK entity, App Review for `public_profile` + `email`, flip app to Live.
  - Success: brand-new personal FB account can complete login; Phase 7 FB spec passes.
- [ ] **Phase 12 — Admin Dashboard (Orders + Users)**
  - In-app `/admin/*` console, Clerk-role-gated. Orders table, users table, email-events log, audit trail for admin actions.
  - Success: Sam + Abeeha triage without psql / Stripe Dashboard / Clerk Dashboard.

### Next Milestone

_v1.2 not yet defined. Likely themes: subscription / auto-renewal, EU VAT/MOSS, reseller/B2B, internationalization._
