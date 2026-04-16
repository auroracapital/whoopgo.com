import { motion } from "framer-motion";
import { XCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6"
        >
          <XCircle className="w-10 h-10 text-red-500" />
        </motion.div>

        <h1 className="text-3xl font-black tracking-tighter mb-3">
          Payment cancelled
        </h1>
        <p className="text-muted-foreground mb-8">
          No worries — your card wasn&apos;t charged. You can pick up where you left off or chat with our assistant to find the perfect plan.
        </p>

        <Card className="border-border/50 mb-6 text-left">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 text-sm">Need help choosing a plan?</h3>
            <p className="text-sm text-muted-foreground">
              Our AI assistant can recommend the best eSIM based on your destination, trip length, and data needs.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Button
            className="w-full bg-[#E67E3C] hover:bg-[#D86E2C] text-white gap-2"
            onClick={() => (window.location.href = "/#pricing")}
          >
            <ArrowLeft className="w-4 h-4" />
            View Plans
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => (window.location.href = "/#finder")}
          >
            <MessageCircle className="w-4 h-4" />
            Chat with AI Assistant
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
