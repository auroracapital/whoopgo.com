import { motion } from "framer-motion";
import { User, Package, ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/AuthModal";
import { OrderDashboard } from "@/components/OrderDashboard";

const DELETION_MAILTO =
  "mailto:support@whoopgo.app?subject=Data%20Deletion%20Request%20%E2%80%94%20%3Cyour%20email%3E&body=Hi%20WhoopGO%21%20team%2C%0A%0AI%20would%20like%20to%20request%20full%20deletion%20of%20my%20account%20and%20associated%20personal%20data.%0A%0AAccount%20email%3A%20%3Cyour%20email%3E%0A%0AThanks.";

export function AccountPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <svg className="animate-spin h-8 w-8 text-[#E67E3C]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter mb-3">Sign in to your account</h1>
          <p className="text-muted-foreground mb-8">
            View your active eSIMs, download QR codes, and manage renewals.
          </p>
          <AuthModal trigger={
            <Button className="w-full bg-[#E67E3C] hover:bg-[#D86E2C] text-white">
              Sign In / Create Account
            </Button>
          } />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 mb-2 -ml-2"
              onClick={() => (window.location.href = "/")}
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Button>
            <h1 className="text-2xl font-black tracking-tighter">My Account</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <Package className="w-6 h-6 text-[#E67E3C] mb-2" />
              <p className="text-2xl font-black">—</p>
              <p className="text-sm text-muted-foreground">Active eSIMs</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <User className="w-6 h-6 text-[#5B7FC7] mb-2" />
              <p className="text-2xl font-black">—</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders */}
        <OrderDashboard userId={user.id} />

        {/* Danger zone */}
        <Card className="border-destructive/30 mt-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <Trash2 className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h2 className="text-lg font-bold mb-1">Delete my account</h2>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your WhoopGO! account and associated personal data.
                  Some records must be retained for tax/audit for up to 7 years (see the{" "}
                  <Link to="/data-deletion" className="text-[#E67E3C] hover:underline">
                    Data Deletion page
                  </Link>
                  ). We&rsquo;ll complete the deletion within 30 days of verifying your
                  request.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
              asChild
            >
              <a href={DELETION_MAILTO}>
                <Trash2 className="w-4 h-4 mr-2" />
                Email Deletion Request
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
