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

### What Works
- Full marketing landing page: Hero, Features (bento grid), How It Works, Pricing, Social Proof, Testimonials, FAQ, Contact, Footer
- Animated globe with satellites in hero
- Dark/light mode with localStorage persistence
- Responsive mobile nav with hamburger menu
- Scroll progress bar
- AI-powered eSIM Finder (chat widget) backed by Claude Haiku via `/api/chat`
- Complete plan catalogue hard-coded in system prompt: country, regional, and global plans
- Static pricing section (Tourist $9.99 / Traveler $29.99 / Explorer $49.99)
- Deployed to Render

### What's Missing
- No real purchase/checkout flow — "Get Started" buttons are inert
- No payment integration (Stripe or otherwise)
- No user accounts / auth
- No real eSIM provisioning API integration (plans are fictional/static)
- No mobile app (referenced in FAQ + hero CTA but doesn't exist)
- No email delivery for QR codes
- No analytics or tracking
- No tests of any kind
- No CI/CD pipeline (no GitHub Actions)
- README is the default Vite template — not project-specific

## Revenue Model

Direct eSIM plan sales (transactional). Tiered pricing:
- Tourist: $9.99 / 5GB / 7 days
- Traveler: $29.99 / 15GB / 15 days (flagship)
- Explorer: $49.99 / Unlimited / 30 days

Country and regional plans also available via the AI finder ($3.99–$54.99 range). Margin comes from wholesale eSIM provider markup.
