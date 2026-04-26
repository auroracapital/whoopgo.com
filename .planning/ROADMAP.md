# Roadmap — whoopgo.com

## Milestones

- ✅ **v1.0 Launch-Ready eSIM Storefront** — Phases 1-5 (shipped 2026-04-16) — see `milestones/v1.0-ROADMAP.md`
- ✅ **v1.0 Addendum** — Domain, SSO wiring, legal scaffolding, provider consolidation (2026-04-24) — see `milestones/v1.0-addendum-2026-04-24.md`
- 🎯 **v1.1 Conversion, Traffic & Trust** — Phases 6-11 (in planning)

## Phases

<details>
<summary>✅ v1.0 Launch-Ready eSIM Storefront (Phases 1-5) — SHIPPED 2026-04-16</summary>

- [x] Phase 1: Foundation & Quality — CI, type safety, README, Render deploy
- [x] Phase 2: Checkout & Payments — Stripe integration, webhooks, success/cancel pages
- [x] Phase 3: eSIM Provisioning & Delivery — eSIM.travel + eSIMVault providers, QR delivery
- [x] Phase 4: User Accounts & Order Management — auth, order history, renewals
- [x] Phase 5: Growth & Retention — analytics, SEO, referrals, email capture

</details>

### 🎯 v1.1 Conversion, Traffic & Trust (Phases 6-11)

**Thesis.** v1.0 shipped a functional storefront but zero measured demand. v1.1 turns it into a revenue machine: rank for high-intent travel-eSIM keywords, convert the traffic with a sharper AI finder + country-specific landing pages, close the mobile-app gap the FAQ already promises, and instrument every step so we know what's working.

**Success metrics (exit criteria):**
- ≥ 10k organic sessions/month from country-specific landing pages
- AI Finder → Stripe checkout conversion ≥ 8% (vs current unknown baseline)
- Mobile app (iOS + Android) live in stores with eSIM install flow
- Full funnel analytics: session → finder → checkout → activation → renewal
- First 100 paying customers acquired through v1.1 channels (excluding v1.0 referrals)

**Phases:**

- [ ] **Phase 6 — Funnel Analytics & Baseline Dashboard**
  Instrument GA4 + PostHog across landing → finder → checkout → activation → renewal. Ship an internal `/admin/metrics` dashboard so every subsequent phase is measured against a known baseline. Prerequisite for every growth phase below.

- [ ] **Phase 7 — Country Landing Pages + Programmatic SEO**
  Generate 100+ country/regional landing pages (`/esim/japan`, `/esim/europe`, etc.) with unique copy, local pricing, travel-context hooks, and schema.org markup. Sitemap, canonical tags, internal linking, og-images per country. Target long-tail "eSIM {country}" queries.

- [ ] **Phase 8 — AI Finder v2 (Closer Mode)**
  Upgrade the Gemini finder from recommender to closer: multi-turn memory, destination+duration extraction, one-tap "Buy now" CTA inside the chat, abandonment-recovery email, A/B tested prompt variants. Target ≥8% chat→checkout.

- [ ] **Phase 9 — Trust & Social Proof Layer**
  Real review collection (post-activation NPS), Trustpilot widget, verified-buyer testimonials, press/partner logos, live activation counter, refund guarantee banner. Reduce first-purchase friction.

- [ ] **Phase 10 — Mobile App (Expo RN)**
  Ship the iOS + Android app already promised in the FAQ/hero. Native eSIM install (iOS 17.4+ direct-install API), push notifications for activation + low-data, biometric account access, plan renewal one-tap. TestFlight → production submission.

- [ ] **Phase 11 — Paid Acquisition Readiness**
  Pixel + conversion API setup (Meta, Google, TikTok), UTM taxonomy, landing page variants for paid traffic, LTV/CAC dashboard, affiliate program v1. Gate: only run paid after Phase 6 baseline + Phase 9 trust layer shipped.

**Open questions for Sam (needs input before Phase 6 kickoff):**
1. Paid-acquisition budget ceiling for v1.1 (affects Phase 11 scope — lean affiliate-only vs. funded Meta/Google test).
2. Mobile app: Expo managed workflow (fast, cross-platform) or native Swift/Kotlin for iOS 17.4+ eSIM install APIs that may need native modules?
3. Is there a target geography for the SEO push (EU-first, US-first, global) — impacts Phase 7 prioritisation and hreflang strategy.
4. Does Lifecycle Innovations (HK) entity have the app-store developer accounts set up, or is that Phase 10 prerequisite work?

### Next Milestone

_v1.2 not yet defined. Likely themes: subscription / auto-renewal, EU VAT/MOSS, reseller/B2B, internationalization._
