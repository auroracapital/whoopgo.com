// PostHog analytics wrapper
declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
      identify: (id: string, properties?: Record<string, unknown>) => void;
      init: (key: string, options: Record<string, unknown>) => void;
      reset: () => void;
    };
  }
}

function getPosthog() {
  return typeof window !== "undefined" ? window.posthog : undefined;
}

export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const host = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? "https://eu.posthog.com";

  if (!key || !getPosthog()) return;

  getPosthog()?.init(key, {
    api_host: host,
    person_profiles: "identified_only",
    capture_pageview: true,
    ip: false,
  });
}

export function track(event: string, properties?: Record<string, unknown>) {
  getPosthog()?.capture(event, properties);
}

export function identify(userId: string, properties?: Record<string, unknown>) {
  getPosthog()?.identify(userId, properties);
}

// Pre-defined events for type safety
export const events = {
  planSelected: (planId: string, planName: string, price: number) =>
    track("plan_selected", { plan_id: planId, plan_name: planName, price }),

  checkoutStarted: (planId: string, planName: string, price: number) =>
    track("checkout_started", { plan_id: planId, plan_name: planName, price }),

  checkoutCompleted: (sessionId: string, planId: string, price: number) =>
    track("checkout_completed", { session_id: sessionId, plan_id: planId, price }),

  qrDelivered: (sessionId: string, orderId: string) =>
    track("qr_delivered", { session_id: sessionId, order_id: orderId }),

  contactSubmitted: () =>
    track("contact_submitted"),

  emailCaptured: (source: string) =>
    track("email_captured", { source }),

  signedIn: (method: string) =>
    track("signed_in", { method }),

  signedUp: (method: string) =>
    track("signed_up", { method }),

  finderOpened: () =>
    track("finder_opened"),

  finderMessageSent: (messageIndex: number, hasDestination: boolean) =>
    track("finder_message_sent", { message_index: messageIndex, has_destination: hasDestination }),

  planRecommended: (planId: string, planName: string, country: string, price: number) =>
    track("plan_recommended", { plan_id: planId, plan_name: planName, country, price }),
} as const;
