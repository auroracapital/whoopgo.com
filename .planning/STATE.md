# Project State

## Current Phase: Complete

All 5 phases shipped + eSIMVault (esimmcp.com) integration complete.

## Completed Milestones

- **Phase 1 — Foundation & Quality**: Project scaffold, CI/CD, Render deploy pipeline — DONE
- **Phase 2 — Checkout & Payments**: Stripe checkout, order flow, email confirmation — DONE
- **Phase 3 — eSIM Provisioning**: eSIM.travel API integration, QR code delivery — DONE
- **Phase 4 — User Accounts**: Auth, order history, account management — DONE
- **Phase 5 — Growth & Retention**: Referrals, analytics, SEO, retention flows — DONE
- **eSIMVault Integration**: esimmcp.com added as second eSIM provider with provider abstraction layer (PR #7, merged 2026-04-16) — DONE

## Architecture

- Primary provider: eSIM.travel
- Secondary provider: eSIMVault (esimmcp.com) via esimmcp MCP
- Provider selection abstraction in `server.js`

## Blockers

_None_

## Recent Decisions

- Merged PR #7 (feature/esimmcp-provider) with admin override after rebase — 2026-04-16
- eSIMVault added as fallback/alternative provider to reduce single-provider dependency
