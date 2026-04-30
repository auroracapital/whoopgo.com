# Phase 5 Context — Growth & Retention

## Analytics: PostHog
- VITE_POSTHOG_KEY env var
- posthog-js via CDN snippet in index.html (no npm install needed)
- Track: page_view, plan_selected, checkout_started, checkout_completed, contact_submitted

## SEO
- Meta tags: title, description, OG image, Twitter card
- sitemap.xml + robots.txt in /public
- Canonical URLs

## Email capture
- Newsletter signup in footer (Resend contact list / klaviyo)
- Post-purchase upsell email already handled by eSIM provisioning flow

## Referral / discount codes
- Stripe coupon support via ?coupon=X query param at checkout
- Simple: read coupon from URL, pass to checkout session

## Contact form
- Already wired in P3

## Core Web Vitals
- Check current Lighthouse score
- Defer non-critical JS
- Add loading="lazy" to images
