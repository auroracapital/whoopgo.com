# WhoopGO!

## Description

WhoopGO! is a travel eSIM marketplace — an online storefront and AI-powered plan finder that helps travelers purchase and activate instant eSIM data plans for 100+ countries worldwide, with no roaming fees and no physical SIM required.

## Vision & Purpose

Make mobile data abroad effortless. Travelers scan a QR code and get connected in minutes — no carrier lock-in, no store visits, instant activation. WhoopGO! positions itself as the "data for every destination" brand with a premium, trust-first experience.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| UI | Radix UI primitives, shadcn/ui components, Framer Motion, Lucide icons |
| 3D / Visuals | Cobe (WebGL globe), custom animated satellite globe component |
| Backend | Express v5 (Node.js), single `server.js`, serves Vite build + `/api/chat` |
| AI | Anthropic Claude (`claude-haiku-4-5`) — conversational eSIM plan recommender |
| Markdown | react-markdown (AI chat responses) |
| Deployment | Render (Node >= 20, `npm run start`) |
| Repo | GitHub — `auroracapital/whoopgo.com` |

## Current State

**Shipped:** v1.0 — Launch-Ready eSIM Storefront (2026-04-16). See `.planning/MILESTONES.md`.

### What Works
- Full marketing landing page (Hero, Features, How It Works, Pricing, Social Proof, Testimonials, FAQ, Contact, Footer)
- Animated globe with satellites, dark/light mode, responsive mobile nav, scroll progress bar
- AI-powered eSIM Finder (chat widget) backed by Claude Haiku via `/api/chat`
- Stripe Checkout integrated for all pricing tiers with webhook-driven order flow
- eSIM.travel primary provider + eSIMVault (esimmcp.com) secondary — QR code provisioning + email delivery
- User auth, order history, account management, renewals
- Analytics, SEO, referrals, email capture
- CI/CD via GitHub Actions, deployed to Render

### Known Tech Debt
- Phases shipped without VERIFICATION.md / SUMMARY.md artifacts (see `milestones/v1.0-MILESTONE-AUDIT.md`)
- No mobile app (referenced in FAQ + hero CTA) — deferred

### Next Milestone
**v1.1 Conversion, Traffic & Trust** (Phases 6-11) — in planning. Turns the v1.0 storefront into a revenue machine: funnel analytics baseline, 100+ country SEO landing pages, AI Finder v2 (closer mode), trust/social-proof layer, mobile app (iOS + Android), and paid-acquisition readiness. See `.planning/ROADMAP.md`.

## Revenue Model

Direct eSIM plan sales (transactional). Tiered pricing:
- Tourist: $9.99 / 5GB / 7 days
- Traveler: $29.99 / 15GB / 15 days (flagship)
- Explorer: $49.99 / Unlimited / 30 days

Country and regional plans also available via the AI finder ($3.99–$54.99 range). Margin comes from wholesale eSIM provider markup.
