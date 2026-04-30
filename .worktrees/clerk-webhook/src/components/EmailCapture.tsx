import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { events } from "@/lib/analytics";

interface EmailCaptureProps {
  source?: string;
  className?: string;
  placeholder?: string;
  buttonText?: string;
}

export function EmailCapture({
  source = "footer",
  className = "",
  placeholder = "Enter your email",
  buttonText = "Get Deals",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (!res.ok) throw new Error("Failed to subscribe");

      events.emailCaptured(source);
      setSubmitted(true);
    } catch {
      setError("Couldn't subscribe — please try again");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
      >
        <Check className="w-4 h-4 text-green-500" />
        <span>You&apos;re on the list — exclusive deals incoming!</span>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className={`flex gap-2 ${className}`}
    >
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="pl-9 rounded-xl h-11"
          required
          aria-label="Email address for deals"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="gap-2 bg-[#E67E3C] hover:bg-[#D86E2C] text-white rounded-xl h-11 px-5 flex-shrink-0"
      >
        {loading ? "..." : (
          <>
            {buttonText}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
      {error && (
        <p className="absolute bottom-[-20px] left-0 text-xs text-red-500">{error}</p>
      )}
    </form>
  );
}
