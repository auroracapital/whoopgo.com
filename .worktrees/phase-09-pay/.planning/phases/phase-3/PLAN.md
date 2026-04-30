# Phase 3 Plan — eSIM Provisioning

## Already done (integrated into server.js in P2)
- Airalo API client (getAiraloToken, callAiraloApi)
- AIRALO_PACKAGE_MAP plan ID → Airalo package slug mapping
- provisionEsim() async flow triggered from Stripe webhook
- sendEsimEmail() with QR code via Resend
- Order status lifecycle: pending → provisioning → ready | failed
- Dev fallback: placeholder QR when credentials absent

## Additional: src/lib/airalo.ts — typed client module
- Separates Airalo API concerns from server.js
- Exported for potential future edge function use

## Additional: Refund endpoint
- POST /api/refund/:sessionId — triggers Stripe refund on provisioning failure
- Called from failed order webhook or manually
