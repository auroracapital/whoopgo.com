# STACK

WhoopGO! eSIM storefront — single-repo full-stack TypeScript/JavaScript app. React 19 SPA served by an Express 5 API on the same origin. No database yet; orders held in an in-memory `Map`.

## Runtime

- Node `>=20` (`.node-version` pins 20)
- ESM throughout (`"type": "module"` in `package.json`)
- Single process: `node server.js` serves `dist/` static assets + `/api/*`

## Frontend

- **React 19.2** with `react-dom` 19.2
- **TypeScript ~6.0** (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — project references)
- **Vite 8** (`vite.config.ts`) — dev server on `:5173` with `/api` proxied to `:3001`
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no `postcss.config` — integrated)
- **Framer Motion 12** for landing-page animation
- **Radix UI** primitives (`@radix-ui/react-label`, `@radix-ui/react-slot`) + `class-variance-authority` + `tailwind-merge` = shadcn-style UI kit under `src/components/ui/`
- **lucide-react** icons, **cobe** for the 3D globe, **react-markdown** for AI chat rendering
- **react-router-dom v7** client-side routing (4 routes wired in `src/main.tsx`)

## Backend

- **Express 5.2** in `server.js` — single-file, ~800 lines, hand-rolled route handlers
- **@anthropic-ai/sdk 0.84** — Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) for the eSIM finder chat at `/api/chat`
- **Stripe 22** server SDK + **@stripe/stripe-js 9** client — Checkout Sessions + webhook signature verification
- Raw-body middleware scoped to `/api/webhooks/stripe` only
- **@clerk/clerk-react 5.61** for auth (magic link + Google OAuth) — Clerk handles signin UI client-side
- **cors 2.8** — wide-open CORS currently

## AI / eSIM / Email

- Anthropic Claude Haiku 4.5 (hardcoded model ID in `server.js:104`)
- **Airalo Partners API** — OAuth2 client-credentials against `sandbox-partners-api.airalo.com/v2` or prod `www.airalo.com/api/v2`
- **eSIMVault / eSIMMCP** — optional second provider, selected via `ESIM_PROVIDER` env or `ESIMMCP_PLAN_IDS` plan-ID allowlist (provider-abstraction lives in `server.js:218-252`)
- **Resend** — transactional email for QR delivery, contact form, newsletter double opt-in

## Analytics & Ops

- **PostHog** (browser SDK loaded via script tag — referenced through `window.posthog` in `src/lib/analytics.ts`)
- **Render** web service (`srv-d7akcrfkijhs73dp5c3g`) deploy triggered from GitHub Actions
