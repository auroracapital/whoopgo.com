# ARCHITECTURE

Single-origin SPA + API. Vite builds the React app into `dist/`; Express serves `dist/` statically AND hosts `/api/*` routes on the same port (`3001` default). In dev, Vite (`:5173`) proxies `/api` to Express (`:3001`).

## Request Lifecycle

1. **Static asset** -> `server.js:20` (`express.static("dist")`)
2. **SPA fallback** -> `server.js:796` (`GET /{*path}` -> `dist/index.html`) so React Router owns the URL
3. **API call** -> JSON middleware (`server.js:17`) -> route handler
4. **Stripe webhook** -> raw-body middleware scoped BEFORE JSON middleware (`server.js:15`) so signature verification sees bytes-as-sent

## Frontend Composition

`src/main.tsx` mounts `<AuthProvider>` (Clerk) -> `<BrowserRouter>` -> 4 routes:

| Route | Component | File |
|---|---|---|
| `/` | `App` | `src/App.tsx` (1097 lines — landing + pricing + finder + contact) |
| `/checkout/success` | `CheckoutSuccess` | `src/pages/CheckoutSuccess.tsx` (polls order status) |
| `/checkout/cancel` | `CheckoutCancel` | `src/pages/CheckoutCancel.tsx` |
| `/account` | `AccountPage` | `src/pages/AccountPage.tsx` (shows `OrderDashboard`) |

`App.tsx` composes the single-page experience: nav + hero with `GlobeSatellites` (cobe), pricing grid using `PLANS` from `src/lib/stripe.ts`, `EsimFinder` AI chat widget, `EmailCapture` newsletter, contact form, theme toggle (persists to `localStorage` key `whoopgo-theme`). Routing only kicks in post-checkout / account.

## Backend Composition — `server.js`

Monolithic single-file (~800 lines, hand-rolled). Logical sections delimited by `─── Section ───` comments:

- **Plan catalog** (`server.js:38-48`) — source of truth for prices in cents, duplicated from `src/lib/stripe.ts`
- **Order store** (`server.js:52`) — `Map<sessionId, order>`, NON-PERSISTENT (lost on restart)
- **`POST /api/chat`** — Anthropic proxy, caps at `max_tokens: 300`
- **`POST /api/checkout`** — creates Stripe Checkout Session with plan metadata
- **`POST /api/webhooks/stripe`** — on `checkout.session.completed`: creates order, fires `provisionEsim()` async (no await)
- **Provider selector** (`selectProvider`, `server.js:234`) — Airalo default, eSIMMCP optional
- **`provisionEsim`** (`server.js:255`) — calls selected provider, persists QR to order, triggers `sendEsimEmail`
- **`callAiraloApi`** (`server.js:347`) — OAuth2 token -> POST /orders -> extract QR
- **`callEsimmcpApi`** (`server.js:489`) — alternate provider
- **`sendEsimEmail`** (`server.js:620`) — Resend HTML email with embedded QR
- **`GET /api/orders/:id` / `GET /api/orders`** — read order(s)
- **Misc**: `/api/auth/*` stubs, `/api/analytics/event`, `/api/newsletter/subscribe` (Resend audience), `/api/contact` (Resend email)
- **SPA fallback** (`server.js:796`)

## Data Flow — Purchase

```
User -> App.tsx (pricing grid) -> CheckoutButton.tsx -> POST /api/checkout
     -> Stripe Checkout (hosted) -> user pays
     -> Stripe webhook -> server.js:174 -> provisionEsim() (async)
     -> Airalo/eSIMMCP API -> QR data -> orders Map
     -> Resend email to customer (QR + activation code)
User -> /checkout/success?session_id=cs_... -> polls GET /api/orders/:sessionId -> displays QR
```

## State & Persistence

- **No database.** `orders` is in-process `Map`. Restart = data loss. Called out as "Phase 4 replaces with DB" in `server.js:50`.
- **No session store.** Clerk handles auth state client-side; server does not validate Clerk JWTs currently (`/api/auth/*` are stubs).
- **Local preferences**: theme (`whoopgo-theme`) in `localStorage`.

## Build Output

- `vite build` -> `dist/` (committed-to-server static bundle)
- Vendor chunking configured (`vite.config.ts:19-28`): `clerk`, `motion`, `icons`, `vendor` (React+router)
- `npm run build` = `tsc -b && vite build` (type-check gate before bundling)
