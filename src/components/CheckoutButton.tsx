import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/lib/stripe";
import { events } from "@/lib/analytics";

interface CheckoutButtonProps {
  plan: Plan;
  country?: string;
  email?: string;
  /** Clerk user id — passed into Stripe metadata so webhook can attach orders to the account */
  userId?: string;
  coupon?: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
}

export function CheckoutButton({
  plan,
  country,
  email,
  userId,
  coupon,
  className,
  children,
  variant = "default",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pick up coupon from URL if not passed as prop
  const resolvedCoupon = coupon ?? new URLSearchParams(window.location.search).get("coupon") ?? undefined;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    events.checkoutStarted(plan.id, plan.name, plan.price);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          country: country ?? "US",
          email,
          ...(userId ? { userId } : {}),
          coupon: resolvedCoupon,
        }),
      });

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Checkout failed");
      }

      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant={variant}
        className={className}
        onClick={() => void handleCheckout()}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Redirecting...
          </span>
        ) : (
          children ?? `Get Started — $${(plan.price / 100).toFixed(2)}`
        )}
      </Button>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
