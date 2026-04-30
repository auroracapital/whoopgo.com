# INTEGRATIONS

All external services wired through `server.js` (single integration point) or client-side for Clerk/Stripe.js. Secrets enumerated in `.env.example`.

## Anthropic Claude (AI eSIM Finder)

- **Where**: `server.js:29` (client init), `server.js:90-118` (`POST /api/chat`)
- **Model**: `claude-haiku-4-5-20251001` (hardcoded)
- **Env**: `ANTHROPIC_API_KEY`
- **Prompt**: Full system prompt inlined at `server.js:55-88` — country/regional/global plan catalog + guidelines
- **Client**: `src/components/EsimFinder.tsx` — posts `{messages: [{type, content}]}` to `/api/chat`

## Stripe (Payments)

- **Where**: `server.js:32` (client init), `server.js:121` (`POST /api/checkout`), `server.js:174` (`POST /api/webhooks/stripe`)
- **Env**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_STRIPE_PUBLISHABLE_KEY`
- **Flow**: Checkout session created with plan metadata -> redirect -> webhook (`checkout.session.completed`) triggers `provisionEsim()` fire-and-forget
- **Client**: `src/components/CheckoutButton.tsx`, `src/lib/stripe.ts` (plan catalog), `src/pages/CheckoutSuccess.tsx` polls `/api/orders/:sessionId`
- **Raw body**: `express.raw()` scoped to webhook route before JSON middleware (`server.js:15`)

## Airalo (primary eSIM provider)

- **Where**: `server.js:347-420` (`callAiraloApi`)
- **Env**: `AIRALO_CLIENT_ID`, `AIRALO_CLIENT_SECRET`, `AIRALO_API_ENV` (sandbox|production)
- **Endpoints**: `POST /token` (OAuth2 client-credentials) -> `POST /orders` with package slug
- **Package slug map**: `src/lib/airalo.ts` (`AIRALO_PACKAGE_MAP`) + duplicated server-side in `server.js`
- **Response shape**: `AiraloOrderResponse` type in `src/lib/airalo.ts`

## eSIMMCP / eSIMVault (secondary eSIM provider)

- **Where**: `server.js:489` (`callEsimmcpApi`)
- **Env**: `ESIMMCP_API_URL`, `ESIMMCP_API_TOKEN`, `ESIMMCP_PLAN_IDS` (comma-separated allowlist), `ESIM_PROVIDER` (force override)
- **Selection**: `selectProvider()` at `server.js:234-252` — plan-ID allowlist or env override, else default Airalo

## Resend (Email)

- **Where**: `server.js:620-707` (QR delivery + contact + newsletter)
- **Env**: `RESEND_API_KEY`, `EMAIL_FROM` (`orders@whoopgo.com`), `RESEND_AUDIENCE_ID` (newsletter)
- **Used by**: post-provisioning QR email, `/api/contact`, `/api/newsletter/subscribe` (double opt-in via audience add)

## Clerk (Auth)

- **Where**: `src/lib/auth-provider.tsx`, `src/lib/auth.ts` (`useAuth` hook wraps `@clerk/clerk-react`)
- **Env**: `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- **Behavior**: Hook gracefully no-ops if publishable key missing (try/catch around `useUser()`)
- **Server**: `server.js:321` (`/api/auth/magic-link`), `server.js:336` (`/api/auth/signout`) — stubs, Clerk handles real flow

## PostHog (Analytics)

- **Where**: `src/lib/analytics.ts` — `window.posthog` wrapper, pre-defined events (`planSelected`, `checkoutStarted`, `checkoutCompleted`, `emailCaptured`, `signedIn`, `signedUp`)
- **Env**: `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST` (default `https://us.posthog.com`)
- **Init**: `initAnalytics()` called from `src/main.tsx:13`
- **Server mirror**: `POST /api/analytics/event` at `server.js:724` (accepts events, currently no-op forward)

## Render (Hosting)

- **Service**: `srv-d7akcrfkijhs73dp5c3g`
- **Deploy**: `.github/workflows/deploy.yml` curls `api.render.com/v1/services/.../deploys` with `${{ secrets.RENDER_API_KEY }}` on every push to `main`
