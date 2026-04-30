# CONVENTIONS

## Language & Style

- **TypeScript** for client (`src/**/*.ts`, `*.tsx`), **plain JS (ESM)** for server (`server.js`). Server uses JSDoc `@type`/`@param` annotations where types matter (e.g. `server.js:51`, `232`).
- **ESM everywhere** — `"type": "module"` in `package.json`; server uses `import` + `fileURLToPath` shim for `__dirname`.
- **Double quotes** in TS/React source; single quotes only in `main.tsx` / `eslint.config.js` (mixed — no enforced quote style in ESLint config).
- **2-space indent**, no semicolons omitted — standard Prettier defaults (no `.prettierrc` committed).

## Imports

- **Alias**: `@/lib/...`, `@/components/...`, `@/components/ui/...` — always prefer alias over `../../`.
- **Lucide icons**: import from `lucide-react` at top of file, not per-use.
- **React**: hooks imported by name (`import { useState } from "react"`), no default `React` import (React 19 JSX transform).

## UI / Styling

- **Tailwind CSS v4** via `@tailwindcss/vite`. No `tailwind.config.js` — config lives in `src/index.css` via `@theme`.
- **shadcn-style components** under `src/components/ui/` using `class-variance-authority` + `cn()` from `@/lib/utils`.
- **`cn()` helper** (`src/lib/utils.ts`) = `twMerge(clsx(...))`.
- **Dark mode**: class-based (`document.documentElement.classList.add("dark")`), toggle in `App.tsx:41-61`, persisted to `localStorage.whoopgo-theme`.
- **Framer Motion**: use `motion.*` + `AnimatePresence`, spring transitions preferred (see `App.tsx:78`).
- **Color tokens**: hardcoded hex (e.g. `#5B7FC7` for the moon/sun icons) — no token file yet; colors mostly driven by Tailwind palette + dark mode classes.

## Naming

- **Components**: `PascalCase.tsx` (`EsimFinder`, `CheckoutButton`, `OrderDashboard`).
- **UI primitives**: `kebab-case.tsx` under `ui/` (shadcn convention — `button.tsx`, `globe-satellites.tsx`).
- **Lib modules**: `kebab-case.ts` (`auth-provider.tsx`, `auth-context.ts`).
- **Plan IDs**: `{region}-{data}-{duration}` slug format (`us-1gb-7d`, `eu-unlimited-30d`, `global-10gb-30d`) — used as Stripe metadata AND as keys in `PLANS` dict.
- **Env vars**: `SCREAMING_SNAKE_CASE`; browser-exposed vars prefixed `VITE_` (enforced by Vite).

## Server Patterns

- **Section comments**: `// ─── Section Name ───` (box-drawing chars) — acts as TOC in `server.js`.
- **Console logging**: `console.log` for success, `console.warn` for missing-key soft-fails, `console.error` for caught exceptions.
- **Graceful degradation**: missing API keys warn-and-continue rather than crash (see `server.js:24-33`). Client code follows same pattern (`src/lib/auth.ts:27` try/catch around Clerk).
- **Async fire-and-forget**: `void provisionEsim(...)` (`server.js:212`) — webhook returns immediately, provisioning happens out-of-band.

## Money

- Prices stored as **integer USD cents** everywhere (`price: 499` = $4.99). Stripe expects cents; `PLANS` catalog mirrors it.

## React

- **Hooks-only** — no class components.
- **Colocate state**: no global state manager (no Redux/Zustand). Auth via Clerk context, theme local to `App`, chat state local to `EsimFinder`.
- **`useCallback`/`useEffect`** used deliberately (see theme hook) — not reflexively.
- **Route components** in `src/pages/`, reusable in `src/components/`.

## Commits & Branches

- Per README: `feature/*` -> `dev` -> `main`, **squash merges**.
- CI gates every PR: lint + type-check + build (`.github/workflows/ci.yml`).
- Deploy gated on same three checks before Render API call (`.github/workflows/deploy.yml`).
