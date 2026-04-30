import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BarChart2, ShoppingBag, DollarSign, ArrowLeft, TrendingUp } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderRow {
  sessionId: string;
  planName: string;
  country: string;
  status: string;
  amount: number;
  email: string;
  createdAt: string;
}

interface AdminOrdersResponse {
  orders: OrderRow[];
  total: number;
  totalRevenueCents: number;
}

const POSTHOG_DASHBOARD_ID = import.meta.env.VITE_POSTHOG_DASHBOARD_ID as string | undefined;
const POSTHOG_HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? "https://eu.posthog.com";

export function AdminMetrics() {
  const { userId, getToken, isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AdminOrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate("/account");
      return;
    }

    void (async () => {
      try {
        const token = await getToken();
        if (!token) {
          setError("Could not get auth token. Please sign in again.");
          setLoading(false);
          return;
        }
        const res = await fetch("/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 403) {
          setError("Admin access required.");
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as AdminOrdersResponse;
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load metrics");
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoaded, isSignedIn, userId, getToken, navigate]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <svg className="animate-spin h-8 w-8 text-[#E67E3C]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm">
          <p className="text-destructive font-semibold mb-2">{error}</p>
          <a href="/" className="text-sm text-muted-foreground hover:underline">Go home</a>
        </div>
      </div>
    );
  }

  const totalOrders = data?.total ?? 0;
  const totalRevenue = ((data?.totalRevenueCents ?? 0) / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tighter">Admin Metrics</h1>
            <p className="text-sm text-muted-foreground">WhoopGO! funnel dashboard</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#E67E3C]" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black">{totalOrders}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#5B7FC7]" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black">${totalRevenue}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black">—</p>
                <p className="text-xs text-muted-foreground mt-1">See PostHog funnel below</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* PostHog Dashboard Embed */}
        {POSTHOG_DASHBOARD_ID && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-10"
          >
            <Card className="border-border/50 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#E67E3C]" />
                  Funnel Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <iframe
                  src={`${POSTHOG_HOST}/embedded/${POSTHOG_DASHBOARD_ID}`}
                  title="PostHog funnel dashboard"
                  className="w-full border-0"
                  style={{ height: 600 }}
                  loading="lazy"
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Orders Table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recent Orders (last 20)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!data?.orders.length ? (
                <p className="text-sm text-muted-foreground p-6">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 text-left">
                        <th className="px-4 py-3 font-semibold text-muted-foreground">Plan</th>
                        <th className="px-4 py-3 font-semibold text-muted-foreground">Country</th>
                        <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
                        <th className="px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                        <th className="px-4 py-3 font-semibold text-muted-foreground">Email</th>
                        <th className="px-4 py-3 font-semibold text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.orders.map((order) => (
                        <tr key={order.sessionId} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium">{order.planName}</td>
                          <td className="px-4 py-3 text-muted-foreground">{order.country || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "ready"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : order.status === "provisioning"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">${(order.amount / 100).toFixed(2)}</td>
                          <td className="px-4 py-3 text-muted-foreground truncate max-w-[180px]">{order.email}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit", month: "short", year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
