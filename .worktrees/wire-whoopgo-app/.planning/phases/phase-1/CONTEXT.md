# Phase 1 Context — Foundation & Quality

## What exists
- React 19 + TypeScript + Vite SPA
- Express server (server.js) for Anthropic API proxy + static serving
- Tailwind CSS v4, Framer Motion, Radix UI components
- EsimFinder AI chat component, globe visualization
- CI: GitHub Actions (ci.yml + deploy.yml) already exist
- Type-check passes clean; 1 ESLint warning (missing dep in useEffect)

## What's needed
- Fix the ESLint warning
- Create .env.example documenting all env vars
- Replace boilerplate README with real project docs
- Add type-aware ESLint rules (per roadmap success criteria)
- Add .node-version file (referenced in CI but may be missing)

## Tech decisions
- No new dependencies needed — just config + docs
- ESLint upgrade: add parserOptions.project for type-aware rules
