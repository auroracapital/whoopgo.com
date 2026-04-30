# STRUCTURE

Repo root: the repository root (clone this repo locally). Flat layout — frontend in `src/`, backend in one `server.js`, shared plan catalog duplicated client/server.

## Top-level

| Path | Purpose |
|---|---|
| `server.js` | Express API + SPA host (~800 LOC, all routes + provider logic) |
| `index.html` | Vite HTML entry (PostHog script tag likely lives here or in a loader) |
| `package.json` | Scripts + single dependency list (no workspaces) |
| `vite.config.ts` | Vite plugins (React + Tailwind), `@` alias, dev proxy, manual chunks |
| `tsconfig.json` | Project references -> `tsconfig.app.json` + `tsconfig.node.json` |
| `eslint.config.js` | Flat config, `tseslint.recommendedTypeChecked`, React Hooks, React Refresh |
| `.env.example` | All required env vars documented with phase-grouping comments |
| `.node-version` | `20` |
| `.github/workflows/ci.yml` | Lint + type-check + build on PR/push |
| `.github/workflows/deploy.yml` | Render deploy trigger on push to `main` |
| `public/` | Favicons, logos (svg/png/webp), `robots.txt`, `sitemap.xml` |
| `dist/` | Vite build output — checked in (!) |
| `README.md` | Stack + getting-started + project structure overview |

## `src/` tree

```
src/
  main.tsx                          # Entrypoint: AuthProvider + BrowserRouter + 4 routes
  App.tsx                           # Landing SPA (1097 LOC) — hero, pricing, finder, contact
  index.css                         # Tailwind v4 + design tokens + dark mode
  assets/                           # (empty)
  components/
    AuthModal.tsx                   # Clerk sign-in modal wrapper (79 LOC)
    CheckoutButton.tsx              # POST /api/checkout -> redirect (87 LOC)
    EmailCapture.tsx                # Newsletter signup (98 LOC)
    EsimFinder.tsx                  # AI chat widget -> /api/chat (226 LOC)
    OrderDashboard.tsx              # Account page order history (136 LOC)
    ui/
      button.tsx                    # shadcn-style CVA button
      card.tsx
      globe-satellites.tsx          # cobe 3D globe
      input.tsx
      label.tsx                     # Radix Label wrapper
      textarea.tsx
  lib/
    airalo.ts                       # Airalo types + AIRALO_PACKAGE_MAP (46 LOC)
    analytics.ts                    # PostHog wrapper + typed event helpers (60 LOC)
    auth-context.ts                 # (2 LOC — likely re-export)
    auth-provider.tsx               # Clerk <ClerkProvider> wrapper
    auth.ts                         # useAuth() hook wrapping Clerk (58 LOC)
    stripe.ts                       # PLANS[] catalog + stripePublishableKey (102 LOC)
    utils.ts                        # cn() tailwind-merge helper (6 LOC)
  pages/
    AccountPage.tsx                 # Signed-in user order history (91 LOC)
    CheckoutCancel.tsx              # Stripe cancel landing (59 LOC)
    CheckoutSuccess.tsx             # Polls /api/orders/:id for QR (189 LOC)
```

## Convention Notes

- **Path alias**: `@/*` -> `src/*` (configured in `vite.config.ts:9` + `tsconfig.app.json`)
- **Single App.tsx**: landing page is NOT split into section files — all in one component tree. Pricing + testimonials + FAQ + contact all inlined.
- **Plan catalog lives twice**: `src/lib/stripe.ts` (client display) + `server.js:38` (server authoritative). Keep in sync manually.
- **No `api/` folder**: all routes inside single `server.js` — section comment headers (`─── Stripe Checkout ───`) act as navigation.
- **`public/` icons**: multiple logo variants (`logo-nav`, `logo-small`, `logo-trimmed`, full-png + webp + svg) — choose per context.
- **`dist/` is tracked**: verify `.gitignore` — README implies Render pulls the built artifact rather than rebuilding.
