# whoopgo.app domain wiring (2026-04-24)

## Status
- Cloudflare zone: `2e0ebaa425654d6a37640fdafaa4534e` (active)
- Render service: `srv-d7akcrfkijhs73dp5c3g` (whoopgo-com)
- Custom domains registered on Render:
  - `whoopgo.app` (apex) — `cdm-d7ligt3eo5us73dlbkjg`, verification `unverified` (waiting on DNS propagation + SSL issuance)
  - `www.whoopgo.app` (redirects to apex) — `cdm-d7ligt3eo5us73dlbkkg`

## DNS records added to Cloudflare
- `A @` → `216.24.57.1` (Render apex IP), proxied=false
- `CNAME www` → `whoopgo-com.onrender.com`, proxied=false

Both records are unproxied to allow Render's Let's Encrypt issuance on first hit.

## Clerk (manual step — Sam)
1. Open Clerk dashboard → Configure → Domains → Change primary domain
2. Enter `whoopgo.app`
3. Paste the 5 DNS CNAME target values Clerk returns back into this session so
   they can be auto-provisioned in Cloudflare (typically: `clerk`,
   `clkmail`, `clk._domainkey`, `clk2._domainkey`, `accounts`).

## Canonical domain policy
- `whoopgo.app` is canonical for all production traffic, Stripe checkout
  URLs, magic links, and email `From:` addresses.
- `whoopgo.com` is retained (Sam owns it) and will serve as a 301 redirect.

## Render env
- `BASE_URL=https://whoopgo.app` set on service.
- NOTE: `ANTHROPIC_API_KEY` was inadvertently overwritten with a placeholder
  during the PUT env-vars call (Render API replaces entire list on PUT).
  Sam must paste the correct key back for AI features to work.
