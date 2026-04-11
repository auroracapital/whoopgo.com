# Roadmap — v1.0

## Milestone: v1.0 — Launch-Ready eSIM Storefront

**Goal:** Transform the marketing site into a functioning purchase funnel — real checkout, real eSIM provisioning, and the infrastructure to acquire and retain paying customers.

---

## Phase 1 — Foundation & Quality

**Goal:** Harden the existing codebase before building on it — proper CI, type safety, and a project README that reflects reality.

**Repo:** `whoopgo.com`

**Status:**

**Success Criteria:**
- GitHub Actions CI: lint + type-check passes on every PR
- README describes the actual project, setup, and env vars
- `ANTHROPIC_API_KEY` documented in `.env.example`
- No TypeScript errors on `tsc --noEmit`
- ESLint configured with type-aware rules (currently using basic config)

---

## Phase 2 — Checkout & Payments

**Goal:** Wire up Stripe so users can actually buy a plan. "Get Started" buttons open a real checkout flow.

**Repo:** `whoopgo.com`

**Status:**

**Success Criteria:**
- Stripe Checkout or Payment Element integrated
- Each pricing tier (Tourist / Traveler / Explorer) has a working buy button
- Country/plan selection captured before checkout (from AI finder or manual selector)
- Stripe webhooks handled: `checkout.session.completed` confirmed
- Test mode end-to-end verified (card → success page)
- Success/cancel pages implemented

---

## Phase 3 — eSIM Provisioning & Delivery

**Goal:** Connect a real eSIM wholesale API (e.g. Airalo, eSIM Access, BSCS) so purchased plans trigger actual QR code generation and email delivery.

**Repo:** `whoopgo.com`

**Status:**

**Success Criteria:**
- eSIM provider API integrated in backend
- On successful Stripe payment: API called, QR code fetched
- QR code delivered to customer email (transactional email via Resend or SendGrid)
- Order record persisted (at minimum: Stripe session ID, email, plan, QR code, timestamp)
- Error handling: failed provisioning triggers refund or manual review queue

---

## Phase 4 — User Accounts & Order Management

**Goal:** Let users log in to view their active eSIMs, track data usage, and manage renewals.

**Repo:** `whoopgo.com`

**Status:**

**Success Criteria:**
- Auth implemented (Clerk or NextAuth — magic link / Google OAuth)
- Order history page: shows plan, expiry, QR code download
- Usage display if eSIM provider API supports it
- "Renew" CTA with discount for Explorer plan (per FAQ promise)
- Account dashboard accessible from nav

---

## Phase 5 — Growth & Retention

**Goal:** Close the loop on acquisition and retention — analytics, SEO, referral mechanics, and email capture.

**Repo:** `whoopgo.com`

**Status:**

**Success Criteria:**
- Analytics integrated (PostHog or Plausible) — purchase funnel tracked
- SEO: meta tags, OG images, sitemap.xml, robots.txt
- Email list capture (pre-purchase and post-purchase flows)
- Referral or discount code system (at minimum: Stripe coupon support)
- Core Web Vitals green on Lighthouse
- Contact form actually sends messages (currently static)
