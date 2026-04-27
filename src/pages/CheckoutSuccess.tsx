import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, QrCode, Mail, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { events } from "@/lib/analytics";

interface OrderDetails {
  sessionId: string;
  planId?: string;
  planName: string;
  amountTotalCents?: number;
  data: string;
  duration: string;
  email: string;
  country: string;
  qrCode?: string;
  status: "pending" | "provisioning" | "ready" | "failed";
  createdAt: string;
}

export function CheckoutSuccess() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setError("No session ID found");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${sessionId}`);
        if (!res.ok) throw new Error("Order not found");
        const data = (await res.json()) as OrderDetails;
        setOrder(data);

        // Fire funnel events once per page load
        if (!firedRef.current) {
          firedRef.current = true;
          events.checkoutCompleted(
            sessionId,
            data.planId ?? "",
            data.amountTotalCents ?? 0,
          );
          if (data.qrCode || data.status === "ready") {
            events.qrDelivered(sessionId, sessionId);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    void fetchOrder();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-[#E67E3C]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-muted-foreground">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error ?? !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-red-500 mb-4">{error ?? "Order not found"}</p>
            <Button onClick={() => (window.location.href = "/")}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        {/* Success header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">
            You&apos;re all set!
          </h1>
          <p className="text-muted-foreground">
            Your eSIM is being provisioned. Check your email for the QR code.
          </p>
        </div>

        {/* Order card */}
        <Card className="mb-6 border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold text-lg">{order.planName} Plan</p>
                <p className="text-sm text-muted-foreground">
                  {order.data} · {order.duration} · {order.country}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                order.status === "ready"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : order.status === "failed"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
              }`}>
                {order.status === "ready" ? "Ready" : order.status === "failed" ? "Failed" : "Provisioning..."}
              </span>
            </div>

            {/* QR Code */}
            {order.qrCode ? (
              <div className="border border-border rounded-xl p-4 text-center">
                <img
                  src={order.qrCode}
                  alt="eSIM QR Code"
                  className="mx-auto max-w-48 mb-3"
                />
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download QR Code
                </Button>
              </div>
            ) : (
              <div className="border border-dashed border-border rounded-xl p-8 text-center">
                <QrCode className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  QR code is being generated — check your email shortly
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email notice */}
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl mb-6">
          <Mail className="w-5 h-5 text-[#E67E3C] flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Activation instructions sent to <span className="font-medium text-foreground">{order.email}</span>
          </p>
        </div>

        {/* How to activate */}
        <Card className="border-border/50 mb-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">How to activate your eSIM</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="font-semibold text-[#E67E3C]">1.</span> Go to Settings → Mobile → Add eSIM</li>
              <li className="flex gap-2"><span className="font-semibold text-[#E67E3C]">2.</span> Scan the QR code from your email</li>
              <li className="flex gap-2"><span className="font-semibold text-[#E67E3C]">3.</span> Select WhoopGO as your data plan when roaming</li>
              <li className="flex gap-2"><span className="font-semibold text-[#E67E3C]">4.</span> Activate when you land — data starts immediately</li>
            </ol>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            className="flex-1 bg-[#E67E3C] hover:bg-[#D86E2C] text-white"
            onClick={() => (window.location.href = "/")}
          >
            Back to Home
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => (window.location.href = "/#finder")}
          >
            Buy Another
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
