// Auth provider — wraps Clerk for WhoopGO! auth
import { ClerkProvider } from "@clerk/clerk-react";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

if (!publishableKey) {
  console.warn("VITE_CLERK_PUBLISHABLE_KEY not set — auth will be unavailable");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!publishableKey) {
    // Auth unavailable — render without Clerk so the rest of the app works
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  );
}
