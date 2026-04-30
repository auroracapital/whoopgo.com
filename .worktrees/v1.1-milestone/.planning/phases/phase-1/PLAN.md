# Phase 1 Plan — Foundation & Quality

## Steps
1. Check/create .node-version file
2. Create .env.example with all required env vars
3. Rewrite README.md with real project info
4. Fix ESLint warning in App.tsx (testimonials.length dependency)
5. Upgrade ESLint config to type-aware rules
6. Verify: type-check + lint pass clean

## Files to create/modify
- `.node-version` — ensure exists for CI
- `.env.example` — document ANTHROPIC_API_KEY, PORT, STRIPE_* (for P2)
- `README.md` — real project docs
- `src/App.tsx` — fix useEffect dependency array
- `eslint.config.js` — add recommendedTypeChecked + parserOptions
