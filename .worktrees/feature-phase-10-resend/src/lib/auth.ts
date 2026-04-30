// Auth hook — wraps Clerk's useUser for WhoopGO!
import { useUser, useClerk } from "@clerk/clerk-react";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  imageUrl?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  let clerkUser: ReturnType<typeof useUser> | null = null;
  let clerk: ReturnType<typeof useClerk> | null = null;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    clerkUser = useUser();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    clerk = useClerk();
  } catch {
    // Clerk not available (publishableKey not set)
    return {
      user: null,
      loading: false,
      signIn: async () => { /* no-op */ },
      signOut: async () => { /* no-op */ },
    };
  }

  const { user, isLoaded } = clerkUser;

  return {
    user: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          name: user.fullName ?? undefined,
          imageUrl: user.imageUrl,
        }
      : null,
    loading: !isLoaded,
    signIn: (/* email */) => {
      // Clerk handles sign in via its UI components
      void clerk?.openSignIn({ afterSignInUrl: "/account" });
      return Promise.resolve();
    },
    signOut: async () => {
      await clerk?.signOut?.();
    },
  };
}
