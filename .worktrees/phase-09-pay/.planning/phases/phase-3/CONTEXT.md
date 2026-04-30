# Phase 3 Context — eSIM Provisioning

## Provider: Airalo
- REST API with OAuth2 client_credentials
- Sandbox: https://sandbox-partners-api.airalo.com/v2
- Production: https://www.airalo.com/api/v2
- Flow: POST /token → POST /orders → get SIM ICCID + QR code URL

## Email: Resend
- POST https://api.resend.com/emails
- HTML email with QR code image embed
- Triggered on successful provisioning

## Order lifecycle
pending → provisioning (on webhook) → ready (QR received) | failed (provision error)

## Already implemented in server.js
- callAiraloApi() — full OAuth2 + order creation
- provisionEsim() — async provisioner called from webhook
- sendEsimEmail() — Resend HTML email with QR code
- Error handling → failed status, logs
- Fallback placeholder QR when AIRALO_CLIENT_ID not set (dev mode)
