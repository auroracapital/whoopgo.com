# WhoopGO! — eSIM Storefront

Instant eSIM plans for travelers. Buy, activate, and connect worldwide — no physical SIM needed.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **Backend**: Express (Node.js) — serves the SPA and proxies AI/payment calls
- **AI Assistant**: Anthropic Claude (Haiku) for eSIM plan recommendations
- **Payments**: Stripe Checkout
- **eSIM Provisioning**: Airalo API (QR code delivery via Resend)
- **Auth**: Clerk (magic link + Google OAuth)
- **Deploy**: Render (web service)

## Getting Started

```bash
cp .env.example .env
# Fill in your API keys (see .env.example for all required vars)

npm install
npm run dev          # Vite dev server on :5173
node server.js       # Express API server on :3001
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + Vite production build |
| `npm run type-check` | Run `tsc --noEmit` |
| `npm run lint` | ESLint with type-aware rules |
| `npm run preview` | Preview production build locally |
| `npm start` | Start Express server (production) |

## Environment Variables

See `.env.example` for a full list with descriptions. Required at minimum:

- `ANTHROPIC_API_KEY` — powers the AI eSIM finder chat
- `STRIPE_SECRET_KEY` + `VITE_STRIPE_PUBLISHABLE_KEY` — payment processing
- `STRIPE_WEBHOOK_SECRET` — validates Stripe webhook events
- `AIRALO_CLIENT_ID` + `AIRALO_CLIENT_SECRET` — eSIM provisioning
- `RESEND_API_KEY` — transactional email (QR code delivery)
- `VITE_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` — user auth

## Project Structure

```
src/
  App.tsx                    # Main SPA — landing page, pricing, AI finder
  components/
    EsimFinder.tsx           # AI chat widget
    CheckoutFlow.tsx         # Stripe payment flow
    AuthModal.tsx            # Clerk auth modal
    OrderDashboard.tsx       # User account / order history
    ui/                      # Radix-based design system components
  lib/
    stripe.ts                # Stripe client + helpers
    airalo.ts                # Airalo eSIM API client
    resend.ts                # Email delivery
    utils.ts                 # cn() and shared utils
server.js                    # Express API server
  POST /api/chat             # AI assistant proxy
  POST /api/checkout         # Create Stripe checkout session
  POST /api/webhooks/stripe  # Stripe webhook handler
  GET  /api/orders/:id       # Order lookup
```

## CI/CD

GitHub Actions runs lint + type-check + build on every PR. Merges to `main` auto-deploy to Render.

## Branch Strategy

`feature/*` → `dev` → `main`. Use squash merges.
