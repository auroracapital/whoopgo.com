# Roadmap — whoopgo.com

## Milestones

- ✅ **v1.0 Launch-Ready eSIM Storefront** — Phases 1-5 (shipped 2026-04-16) — see `milestones/v1.0-ROADMAP.md`
- ✅ **v1.0 Addendum** — Domain, SSO wiring, legal scaffolding, provider consolidation (2026-04-24) — see `milestones/v1.0-addendum-2026-04-24.md`
- 🚧 **v1.1 Trust, Conversion & Traffic** — Phases 6-18 (executing)

## Phases

<details>
<summary>✅ v1.0 Launch-Ready eSIM Storefront (Phases 1-5) — SHIPPED 2026-04-16</summary>

- [x] Phase 1: Foundation & Quality — CI, type safety, README, Render deploy
- [x] Phase 2: Checkout & Payments — Stripe integration, webhooks, success/cancel pages
- [x] Phase 3: eSIM Provisioning & Delivery — eSIM.travel + eSIMVault providers, QR delivery
- [x] Phase 4: User Accounts & Order Management — auth, order history, renewals
- [x] Phase 5: Growth & Retention — analytics, SEO, referrals, email capture

</details>

### 🚧 v1.1 Trust, Conversion & Traffic (Phases 6-18)

**Thesis.** v1.0 shipped a functional storefront but zero measured demand AND a stack of "wired but not finished" gaps from the 2026-04-24 addendum. v1.1 unifies both threads: (a) turn the storefront into a revenue machine — rank for high-intent travel-eSIM keywords, convert with a sharper AI finder + country landing pages, ship the promised mobile app, instrument every step; (b) close every trust/auth/legal/payment/email gap so we are production-grade, not launch-day-grade.

**Success metrics (exit criteria):**

_Conversion / traffic / growth:_
- ≥ 10k organic sessions/month from country-specific landing pages
- AI Finder → Stripe checkout conversion ≥ 8% (vs current unknown baseline)
- Mobile app (iOS + Android) live in stores with eSIM install flow
- Full funnel analytics: session → finder → checkout → activation → renewal
- First 100 paying customers acquired through v1.1 channels (excluding v1.0 referrals)

_Trust / consolidation:_
- Every Clerk user has a matching DB row; webhook idempotent under Svix replay
- Green E2E SSO smoke run against staging (Google / Apple / Facebook); alerts on failure
- Counsel-signed Terms + Privacy under HK entity; DRAFT banners removed; `last_reviewed` stamp added
- Apple Pay + Google Pay complete full order flow end-to-end including provisioning + receipt
- Branded transactional email via Resend (welcome, receipt, referral); SPF/DKIM/DMARC green; no duplicate sends on webhook retry; audit log in `email_events`
- Facebook app in Live mode under HK entity verification; brand-new account can complete login
- Sam + Abeeha can triage orders/users/email-events without psql / Stripe Dashboard / Clerk Dashboard

**Phases:**

#### Conversion / Traffic / Growth (6-11)

- [ ] **Phase 6 — Funnel Analytics & Baseline Dashboard**
  Instrument GA4 + PostHog across landing → finder → checkout → activation → renewal. Ship an internal `/admin/metrics` dashboard so every subsequent phase is measured against a known baseline. Prerequisite for every growth phase below. _PLAN.md committed via PR #27 (2026-04-26)._

- [ ] **Phase 7 — Country Landing Pages + Programmatic SEO**
  Generate 100+ country/regional landing pages (`/esim/japan`, `/esim/europe`, etc.) with unique copy, local pricing, travel-context hooks, and schema.org markup. Sitemap, canonical tags, internal linking, og-images per country. Target long-tail "eSIM {country}" queries.

- [ ] **Phase 8 — AI Finder v2 (Closer Mode)**
  Upgrade the Gemini finder from recommender to closer: multi-turn memory, destination+duration extraction, one-tap "Buy now" CTA inside the chat, abandonment-recovery email, A/B tested prompt variants. Target ≥8% chat→checkout.

- [ ] **Phase 9 — Trust & Social Proof Layer**
  Real review collection (post-activation NPS), Trustpilot widget, verified-buyer testimonials, press/partner logos, live activation counter, refund guarantee banner. Reduce first-purchase friction.

- [ ] **Phase 10 — Mobile App (Expo RN)**
  Ship the iOS + Android app already promised in the FAQ/hero. Native eSIM install (iOS 17.4+ direct-install API), push notifications for activation + low-data, biometric account access, plan renewal one-tap. TestFlight → production submission.

- [ ] **Phase 11 — Paid Acquisition Readiness**
  Pixel + conversion API setup (Meta, Google, TikTok), UTM taxonomy, landing page variants for paid traffic, LTV/CAC dashboard, affiliate program v1. Gate: only run paid after Phase 6 baseline + Phase 9 trust layer + Phase 17 FB Live shipped.

#### Trust / Auth / Legal / Payment / Email (12-18)

- [ ] **Phase 12 — Clerk Webhook → DB Persistence**
  Persist `user.created/updated/deleted` into a `users` table; link orders via `user_id` FK. Success: every Clerk user has a matching DB row; webhook is idempotent under Svix replay.

- [ ] **Phase 13 — E2E Signup Smoke Suite**
  Playwright specs for Google, Apple, Facebook SSO, running monthly on a cron and on-demand. Success: green run against staging with real provider accounts; alerts on failure.

- [ ] **Phase 14 — Legal Review & Remove DRAFT Banners**
  Engage Bjorn Schipper (plusonelegal.nl) for counsel review under HK entity (Lifecycle Innovations Limited, BRN 76545088). Adapt fiberwifi brief template. Success: signed-off Terms + Privacy; DRAFT banners removed; `last_reviewed` stamp added.

- [ ] **Phase 15 — Apple Pay + Google Pay Native Checkout**
  Stripe Payment Request / Express Checkout Element on product page; fallback to existing Checkout. Success: mobile wallets complete full order flow end-to-end, including provisioning + receipt.

- [ ] **Phase 16 — Transactional Email via Resend**
  Welcome (Clerk `user.created`), receipt + eSIM-ready (Stripe webhook), referral invite/reward. React Email templates. SPF/DKIM/DMARC green. Success: no duplicate sends on webhook retry; audit log in `email_events`.

- [ ] **Phase 17 — Facebook Business Verification + Live Mode**
  Meta Business Verification under HK entity, App Review for `public_profile` + `email`, flip app to Live. Success: brand-new personal FB account can complete login; Phase 13 FB spec passes.

- [ ] **Phase 18 — Admin Console (Orders + Users + Email Events)**
  In-app `/admin/*` console, Clerk-role-gated. Builds on Phase 6's `/admin/metrics`: adds orders table, users table, email-events log (from Phase 16), audit trail for admin actions. Success: Sam + Abeeha triage without psql / Stripe Dashboard / Clerk Dashboard.

**Phase dependency notes:**
- Phase 11 (Paid) depends on Phases 6, 9, 17 (need analytics baseline + trust layer + FB Live before spending).
- Phase 18 (Admin Console) depends on Phases 6, 12, 16 (extends `/admin/metrics`, needs DB-persisted users, needs `email_events` table).
- Phase 13 (E2E SSO) depends on Phase 17 to flip the FB-spec from "expected fail in Dev mode" to required-green.
- Phase 16 (Email) is independent of growth phases but wanted before Phase 11 (paid traffic) for branded receipts.

**Open questions for Sam (needs input before further phase planning):**
1. Paid-acquisition budget ceiling for v1.1 (affects Phase 11 scope — lean affiliate-only vs. funded Meta/Google test).
2. Mobile app: Expo managed workflow (fast, cross-platform) or native Swift/Kotlin for iOS 17.4+ eSIM install APIs that may need native modules?
3. Is there a target geography for the SEO push (EU-first, US-first, global) — impacts Phase 7 prioritisation and hreflang strategy.
4. Does Lifecycle Innovations (HK) entity have the app-store developer accounts set up, or is that Phase 10 prerequisite work?
5. Bjorn Schipper (plusonelegal.nl) availability for Phase 14 legal review — when can we kick off?

### Next Milestone

_v1.2 not yet defined. Likely themes: subscription / auto-renewal, EU VAT/MOSS, reseller/B2B, internationalization._
