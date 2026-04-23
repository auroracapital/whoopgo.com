import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, QrCode, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Order {
  sessionId: string;
  planName: string;
  data: string;
  duration: string;
  country: string;
  email: string;
  qrCode?: string;
  status: "pending" | "provisioning" | "ready" | "failed";
  createdAt: string;
}

interface OrderDashboardProps {
  userId: string;
}

export function OrderDashboard({ userId }: OrderDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/by-user?userId=${encodeURIComponent(userId)}`);
        if (res.ok) {
          const data = (await res.json()) as Order[];
          setOrders(data);
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-6 w-6 text-[#E67E3C]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="pt-6 text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No orders yet</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Purchase an eSIM plan to get started.
          </p>
          <Button
            className="bg-[#E67E3C] hover:bg-[#D86E2C] text-white"
            onClick={() => (window.location.href = "/#pricing")}
          >
            Browse Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">Your eSIMs</h2>
      {orders.map((order, i) => (
        <motion.div
          key={order.sessionId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold">{order.planName} Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {order.data} · {order.duration} · {order.country}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  order.status === "ready"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : order.status === "failed"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                }`}>
                  {order.status === "ready" ? "Active" : order.status === "failed" ? "Failed" : "Provisioning"}
                </span>
              </div>

              <div className="flex gap-2">
                {order.qrCode ? (
                  <Button size="sm" variant="outline" className="gap-2" asChild>
                    <a href={order.qrCode} download={`whoopgo-${order.planName.toLowerCase()}-esim.png`}>
                      <Download className="w-3 h-3" />
                      QR Code
                    </a>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="gap-2" disabled>
                    <QrCode className="w-3 h-3" />
                    QR Pending
                  </Button>
                )}
                <Button
                  size="sm"
                  className="gap-2 bg-[#E67E3C] hover:bg-[#D86E2C] text-white"
                  onClick={() => (window.location.href = "/#pricing")}
                >
                  <RefreshCw className="w-3 h-3" />
                  Renew
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
