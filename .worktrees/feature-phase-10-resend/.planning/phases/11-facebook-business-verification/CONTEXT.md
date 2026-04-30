# Phase 11 Context — Facebook Business Verification & Live Mode

## Goal
Move the Facebook SSO app from Development mode to Live mode so Facebook login works for all users, not just app admins/testers.

## Current state
- Facebook login wired in Clerk (2026-04-24) but the underlying FB app is still in Development mode.
- In Development mode, only users with a role on the app (admin/developer/tester) can log in; end users hit a generic error.
- Google + Apple SSO are unaffected and work for all users.

## Scope
- Complete Meta Business Verification:
  - Business portfolio linked to Lifecycle Innovations Limited (HK).
  - Upload HK Certificate of Incorporation (BRN 76545088).
  - Business utility bill or bank statement matching HK registered address.
  - Domain verification for `whoopgo.app` (DNS TXT record via Cloudflare).
- App Review submission for `public_profile` and `email` permissions (both are default/low-friction; usually approved without video walkthrough but may require one).
- Privacy Policy URL + Data Deletion URL pointed at whoopgo.app live pages (Phase 8 legal output).
- Flip app from Development → Live.

## Success criteria
- Meta Business Manager shows "Verified" badge on Lifecycle Innovations Limited.
- Facebook app mode = Live.
- Anonymous browser test: FB login works for a brand-new personal FB account with no app role.
- Phase 7 E2E suite passes on the Facebook spec.

## Rough approach
- This is heavy coordination, not much code.
- Sam must supply: HK Cert of Incorporation PDF, HK address proof, access to Business Manager.
- Document every rejection + resubmission in `.planning/phases/11-facebook-business-verification/submission-log.md`.
- Expect 1–3 week calendar time due to Meta review queues.

## Out of scope
- Instagram Graph API / Facebook Pixel (marketing, separate).
- WhatsApp Business API (separate app).
