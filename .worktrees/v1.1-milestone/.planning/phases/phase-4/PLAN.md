# Phase 4 Plan — User Accounts

## Steps
1. Replace auth-provider.tsx with Clerk ClerkProvider + useUser wrapper
2. Update auth.ts useAuth to use Clerk's useUser
3. Wrap main.tsx root with ClerkProvider
4. Add sign in/account button to nav in App.tsx
5. AuthModal: replace stub with Clerk SignIn component
6. Wire OrderDashboard to fetch by Clerk user email
7. Quality gate
