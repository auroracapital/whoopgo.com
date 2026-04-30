# Phase 4 Context — User Accounts

## Auth: Clerk
- @clerk/clerk-react installed
- ClerkProvider wraps app in main.tsx
- useUser/useAuth hooks from Clerk
- Replace stub auth-provider.tsx with Clerk implementation
- Magic link + Google OAuth

## Order history
- GET /api/orders?email=... queries by email (Phase 3 stub)
- OrderDashboard already built in Phase 2/3
- AccountPage already built with auth gate

## Nav: add Sign In + Account links
- When logged out: "Sign In" button
- When logged in: Avatar + "My eSIMs" link
