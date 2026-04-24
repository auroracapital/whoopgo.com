import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Wifi,
  Globe,
  Shield,
  Zap,
  Check,
  ChevronDown,
  Mail,
  MapPin,
  Globe2,
  MessageCircle,
  Link2,
  Camera,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  Smartphone,
  QrCode,
  ArrowRight,
  Star,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EsimFinder } from "@/components/EsimFinder";
import { GlobeSatellites } from "@/components/ui/globe-satellites";
import { CheckoutButton } from "@/components/CheckoutButton";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/lib/auth";
import { EmailCapture } from "@/components/EmailCapture";

// ─── Theme Hook ──────────────────────────────────────────────────────────────
function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("whoopgo-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("whoopgo-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((d) => !d), []);
  return { isDark, toggle };
}

// ─── Theme Toggle ────────────────────────────────────────────────────────────
function ThemeToggle({ isDark, toggle }: { isDark: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="relative w-10 h-10 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 border border-border/50 transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
          >
            <Moon className="w-4 h-4 text-[#5B7FC7]" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
          >
            <Sun className="w-4 h-4 text-[#E67E3C]" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── Scroll Progress Bar ─────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#E67E3C] via-[#F4A460] to-[#5B7FC7] origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}

// ─── Shimmer Button ──────────────────────────────────────────────────────────
function ShimmerButton({ children, className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <Button
        className={cn(
          "relative overflow-hidden bg-[#E67E3C] hover:bg-[#D86E2C] text-white shadow-lg shadow-[#E67E3C]/25 hover:shadow-[#E67E3C]/50 transition-all duration-500",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}

// ─── Logo ────────────────────────────────────────────────────────────────────
function WhoopGoLogo({ className = "", size = "default" }: { className?: string; size?: "default" | "small" }) {
  const h = size === "small" ? "h-8 md:h-10" : "h-12 md:h-16";
  const src = size === "small" ? "/logo-nav.webp" : "/logo-trimmed.webp";
  return (
    <img
      src={src}
      alt="WhoopGO! — Data for every destination"
      className={cn("w-auto select-none", h, className)}
    />
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "Plans", href: "#pricing" },
    { label: "Find Your eSIM", href: "#finder" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/70 backdrop-blur-2xl border-b border-border/30 shadow-lg shadow-black/5"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <motion.a
          href="#"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <WhoopGoLogo size="small" />
        </motion.a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#E67E3C] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle isDark={isDark} toggle={toggleTheme} />
          {user ? (
            <div className="flex items-center gap-3">
              <a
                href="/account"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                My eSIMs
              </a>
              <button
                onClick={() => void signOut()}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <AuthModal trigger={
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </button>
              } />
              <ShimmerButton className="rounded-full px-6" onClick={() => { window.location.href = "#pricing"; }}>
                Get Started
              </ShimmerButton>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle isDark={isDark} toggle={toggleTheme} />
          <button className="p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-border overflow-hidden"
          >
            <div className="px-4 pb-6 pt-2 space-y-1">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:pl-2 transition-all duration-200"
                >
                  {link.label}
                </motion.a>
              ))}
              {user ? (
                <a href="/account" className="block w-full mt-4">
                  <ShimmerButton className="w-full rounded-full">My eSIMs</ShimmerButton>
                </a>
              ) : (
                <ShimmerButton className="w-full mt-4 rounded-full" onClick={() => { window.location.href = "#pricing"; }}>
                  Get Started
                </ShimmerButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero Decorative Shape ───────────────────────────────────────────────────
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-gray-300/20 dark:border-white/[0.08]",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent_70%)] dark:after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────
function HeroSection() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 + i * 0.2, ease: "easeOut" as const },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0A0A0A] dark:to-[#0A0A0A]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5B7FC7]/[0.06] via-transparent to-[#E67E3C]/[0.06] blur-3xl dark:from-[#5B7FC7]/[0.04] dark:via-transparent dark:to-[#E67E3C]/[0.04]" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-[#5B7FC7]/[0.12]" className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]" />
        <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-[#E67E3C]/[0.12]" className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]" />
        <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="from-[#E67E3C]/[0.12]" className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="text-center lg:text-left">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 dark:bg-white/[0.06] backdrop-blur-xl border border-border/50 dark:border-white/[0.08] mb-8 md:mb-12 group hover:bg-background/80 dark:hover:bg-white/[0.1] transition-all duration-300 cursor-default"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-2 h-2 rounded-full bg-[#E67E3C]"
              />
              <span className="text-sm text-gray-700 dark:text-white/80 tracking-wide font-medium">
                Data for Every Destination
              </span>
            </motion.div>

            <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
              <div className="mb-6 md:mb-8">
                <img
                  src="/logo-trimmed.webp"
                  alt="WhoopGO! — Data for every destination"
                  className="h-20 sm:h-28 md:h-36 w-auto mx-auto lg:mx-0"
                />
                <p className="text-base sm:text-xl md:text-2xl font-medium mt-4 text-gray-600 dark:text-white/70 tracking-normal text-center lg:text-left">
                  Stay Connected, Anywhere
                </p>
              </div>
            </motion.div>

            <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-white/70 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                Instant eSIM activation for travelers worldwide.
                <span className="block mt-2 text-base sm:text-lg text-gray-500 dark:text-white/50">
                  No roaming fees &bull; No physical SIM &bull; Just seamless connectivity
                </span>
              </p>
            </motion.div>

            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <ShimmerButton className="px-10 py-7 text-lg rounded-2xl shadow-xl shadow-[#E67E3C]/30">
                <span className="flex items-center gap-2">
                  Get Your eSIM Now
                  <Wifi className="w-5 h-5" />
                </span>
              </ShimmerButton>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" className="bg-background/50 dark:bg-white/[0.06] backdrop-blur-xl border-gray-300/50 text-gray-900 dark:border-white/[0.1] dark:text-white px-10 py-7 text-lg rounded-2xl group hover:bg-background/80 dark:hover:bg-white/[0.1] transition-all duration-300">
                  <span className="flex items-center gap-2">
                    Download App
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="hidden lg:block"
          >
            <GlobeSatellites className="w-full max-w-[500px] mx-auto" />
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-gray-100/80 dark:from-[#0A0A0A] dark:via-transparent dark:to-[#0A0A0A]/80 pointer-events-none" />
    </div>
  );
}

// ─── Features — Bento Grid ──────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: Wifi, title: "Instant Activation", description: "Get connected in minutes. Scan the QR code and go — no store visits, no waiting.", span: "md:col-span-2" },
    { icon: Globe, title: "Global Coverage", description: "Country, regional, and global plans across 100+ destinations worldwide.", span: "" },
    { icon: Shield, title: "Secure & Reliable", description: "Bank-grade encryption and 99.9% network uptime guarantee.", span: "" },
    { icon: Zap, title: "High-Speed 5G", description: "Blazing fast 4G/5G speeds with flexible data options for every kind of trip.", span: "md:col-span-2" },
  ];

  return (
    <section id="features" className="py-28 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E67E3C]/[0.04] rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 dark:bg-white/[0.06] backdrop-blur-xl border border-border/50 dark:border-white/[0.08] mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#E67E3C]" />
            <span className="text-sm font-medium text-muted-foreground">Why WhoopGO!</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter"
          >
            <span className="block">Your Perfect</span>
            <span className="block text-gradient-orange">Travel Companion</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need for seamless connectivity worldwide
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -6, transition: { duration: 0.3, type: "spring", stiffness: 300 } }}
              className={cn(
                "p-8 rounded-3xl relative overflow-hidden group cursor-default",
                "bg-background/60 dark:bg-white/[0.04] backdrop-blur-xl",
                "border border-border/50 dark:border-white/[0.06]",
                "hover:border-[#E67E3C]/30 dark:hover:border-[#E67E3C]/20",
                "hover:shadow-xl hover:shadow-[#E67E3C]/5",
                "transition-all duration-500",
                feature.span,
              )}
            >
              {/* Hover glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#E67E3C]/0 rounded-full blur-3xl group-hover:bg-[#E67E3C]/[0.08] transition-all duration-700" />

              <div className="w-14 h-14 rounded-2xl bg-[#E67E3C]/10 dark:bg-[#E67E3C]/[0.08] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#E67E3C]/15 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-[#E67E3C]" />
              </div>
              <h3 className="text-xl font-bold mb-2 relative z-10">{feature.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed relative z-10">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { icon: Smartphone, step: "01", title: "Choose Your Plan", description: "Select country, regional, or global coverage that fits your trip." },
    { icon: QrCode, step: "02", title: "Scan QR Code", description: "Receive your eSIM QR code instantly via email after purchase." },
    { icon: Wifi, step: "03", title: "Stay Connected", description: "Activate and enjoy high-speed data the moment you land." },
  ];

  return (
    <section className="py-28 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-4 tracking-tighter"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Three simple steps to global connectivity
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#E67E3C] to-[#D86E2C] text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#E67E3C]/25 group-hover:shadow-[#E67E3C]/40 transition-shadow duration-300"
              >
                <item.icon className="w-8 h-8" />
              </motion.div>
              <div className="text-xs font-bold text-[#E67E3C]/60 tracking-widest mb-2">STEP {item.step}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────
function PricingSection() {
  const { user } = useAuth();
  const plans = [
    { id: "eu-5gb-7d", name: "Tourist", price: 9.99, data: "5GB", days: 7, features: ["5GB High-Speed Data", "7 Days Validity", "30+ Countries", "24/7 Support"] },
    { id: "eu-10gb-15d", name: "Traveler", price: 19.99, data: "10GB", days: 15, popular: true, features: ["10GB High-Speed Data", "15 Days Validity", "30+ Countries", "Priority Support", "Hotspot Enabled"] },
    { id: "eu-unlimited-30d", name: "Explorer", price: 49.99, data: "Unlimited", days: 30, features: ["Unlimited Data", "30 Days Validity", "30+ Countries", "VIP Support", "Hotspot Enabled", "Free Renewal Discount"] },
  ];

  return (
    <section id="pricing" className="py-28 bg-muted/30 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#5B7FC7]/[0.04] rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 dark:bg-white/[0.06] backdrop-blur-xl border border-border/50 dark:border-white/[0.08] mb-6"
          >
            <Zap className="w-4 h-4 text-[#5B7FC7]" />
            <span className="text-sm font-medium text-muted-foreground">Pricing Plans</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter"
          >
            <span className="block">Simple,</span>
            <span className="block text-gradient-blue">Transparent Pricing</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
            >
              <Card className={cn(
                "relative h-full",
                "bg-background/60 dark:bg-white/[0.04] backdrop-blur-xl",
                "border-border/50 dark:border-white/[0.06]",
                "hover:border-[#E67E3C]/20 transition-all duration-500",
                plan.popular && "border-[#E67E3C]/40 dark:border-[#E67E3C]/30 shadow-xl shadow-[#E67E3C]/10 scale-[1.02]"
              )}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#E67E3C] to-[#D86E2C] text-white px-5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg shadow-[#E67E3C]/30">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-5xl font-black tracking-tight">${plan.price}</span>
                    <span className="text-muted-foreground ml-2">/ {plan.days} days</span>
                  </div>
                  <p className="text-xl text-muted-foreground mt-2">{plan.data} Data</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#E67E3C]/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-[#E67E3C]" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.popular ? (
                    <CheckoutButton
                      plan={{ id: plan.id, name: plan.name, data: plan.data, duration: `${plan.days} days`, price: Math.round(plan.price * 100), description: plan.features[0] }}
                      userId={user?.id}
                      className="w-full rounded-xl bg-[#E67E3C] hover:bg-[#D86E2C] text-white"
                    >
                      Get Started — ${plan.price}
                    </CheckoutButton>
                  ) : (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <CheckoutButton
                        plan={{ id: plan.id, name: plan.name, data: plan.data, duration: `${plan.days} days`, price: Math.round(plan.price * 100), description: plan.features[0] }}
                        userId={user?.id}
                        variant="outline"
                        className="w-full rounded-xl bg-background/50 dark:bg-white/[0.04] hover:bg-background/80 dark:hover:bg-white/[0.08] transition-all duration-300"
                      >
                        Get Started — ${plan.price}
                      </CheckoutButton>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof Stats ──────────────────────────────────────────────────────
function ProofSection() {
  const stats = [
    { value: "50K+", label: "Happy Travelers" },
    { value: "100+", label: "Countries Covered" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-[#E67E3C] via-[#D86E2C] to-[#E67E3C] text-white relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="text-center"
            >
              <div className="text-4xl md:text-6xl font-black mb-2 tracking-tight">{stat.value}</div>
              <div className="text-white/70 text-sm font-medium tracking-wider uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    { text: "WhoopGO! saved me so much hassle during my Europe trip. Instant activation and great speeds everywhere!", name: "Emma Thompson", role: "Travel Blogger", stars: 5, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150" },
    { text: "Best eSIM service I've used. The app makes it so easy to manage plans on the go. Highly recommend!", name: "Marco Silva", role: "Digital Nomad", stars: 5, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150" },
    { text: "Perfect for business travel. Reliable connection in every country I visited. The regional plans are unbeatable.", name: "Sophie Laurent", role: "Business Consultant", stars: 5, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-4 tracking-tighter"
          >
            What Travelers Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Join thousands of happy WhoopGO! customers
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="absolute inset-0"
              >
                <Card className="p-10 bg-background/60 dark:bg-white/[0.04] backdrop-blur-xl border-border/50 dark:border-white/[0.06]">
                  <CardContent className="text-center">
                    <div className="flex justify-center gap-1 mb-6">
                      {Array.from({ length: testimonials[currentIndex].stars }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#E67E3C] text-[#E67E3C]" />
                      ))}
                    </div>
                    <p className="text-xl md:text-2xl mb-8 italic leading-relaxed text-foreground/90">
                      &ldquo;{testimonials[currentIndex].text}&rdquo;
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-[#E67E3C]/20"
                        loading="lazy"
                      />
                      <div className="text-left">
                        <p className="font-bold">{testimonials[currentIndex].name}</p>
                        <p className="text-muted-foreground text-sm">{testimonials[currentIndex].role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((t, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`View testimonial from ${t.name}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentIndex ? "bg-[#E67E3C] w-8" : "bg-muted hover:bg-muted-foreground/30 w-2"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { question: "What is an eSIM?", answer: "An eSIM is a digital SIM card built into your device. It lets you activate a cellular plan without a physical SIM card — just scan a QR code and you're connected." },
    { question: "How do I activate my eSIM?", answer: "After purchase, you'll receive a QR code via email. Scan it with your phone's camera, and your eSIM will be activated within minutes. You can also use the WhoopGO! app for guided setup." },
    { question: "Which countries are covered?", answer: "WhoopGO! offers country, regional, and global plans covering 100+ destinations worldwide. Use our plan finder to see coverage for your specific destination." },
    { question: "Can I use my eSIM for hotspot?", answer: "Yes! All our plans support mobile hotspot functionality, so you can share your connection with other devices." },
    { question: "What if I need help during my trip?", answer: "Our 24/7 customer support team is always available via chat, email, or phone. You can also reach us through the WhoopGO! app." },
    { question: "Do you have a mobile app?", answer: "Yes! The WhoopGO! app is available for iOS and Android. Manage your eSIMs, purchase plans, track usage, and get support — all in one place." },
  ];

  return (
    <section id="faq" className="py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-4 tracking-tighter"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Everything you need to know
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl overflow-hidden bg-background/60 dark:bg-white/[0.04] backdrop-blur-xl border border-border/50 dark:border-white/[0.06] hover:border-[#E67E3C]/20 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors duration-200"
              >
                <span className="font-semibold text-lg pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────
function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setContactError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
      setName(""); setEmail(""); setMessage("");
    } catch {
      setContactError("Failed to send — please email us directly at support@whoopgo.app");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-28 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5B7FC7]/[0.04] rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Get in Touch</h2>
              <p className="text-muted-foreground mb-10 text-lg">Have questions? We're here to help.</p>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "support@whoopgo.app", href: "mailto:support@whoopgo.app" },
                  { icon: MapPin, label: "Office", value: "Hong Kong SAR" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#E67E3C]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E67E3C]/15 group-hover:scale-105 transition-all duration-300">
                      <item.icon className="w-5 h-5 text-[#E67E3C]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-foreground hover:text-[#E67E3C] transition-colors font-medium">{item.value}</a>
                      ) : (
                        <p className="font-medium">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-background/60 dark:bg-white/[0.04] backdrop-blur-xl border-border/50 dark:border-white/[0.06]">
                <CardContent className="p-8">
                  {sent ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-6 h-6 text-green-500" />
                      </div>
                      <p className="font-semibold mb-1">Message sent!</p>
                      <p className="text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
                    </div>
                  ) : (
                  <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
                    <div>
                      <Label htmlFor="name" className="mb-2">Name</Label>
                      <Input id="name" placeholder="Your name" className="rounded-xl h-12" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="contact-email" className="mb-2">Email</Label>
                      <Input id="contact-email" type="email" placeholder="your@email.com" className="rounded-xl h-12" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="message" className="mb-2">Message</Label>
                      <Textarea id="message" placeholder="How can we help?" rows={5} className="rounded-xl" value={message} onChange={(e) => setMessage(e.target.value)} required />
                    </div>
                    {contactError && <p className="text-xs text-red-500">{contactError}</p>}
                    <ShimmerButton type="submit" className="w-full rounded-xl h-12 text-base" disabled={sending}>
                      {sending ? "Sending..." : "Send Message"}
                    </ShimmerButton>
                  </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  const socialLinks = [
    { icon: Globe2, href: "#", label: "Website" },
    { icon: MessageCircle, href: "#", label: "Chat" },
    { icon: Link2, href: "#", label: "Links" },
    { icon: Camera, href: "#", label: "Photos" },
  ];

  return (
    <footer className="bg-muted/50 py-16 border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Newsletter */}
        <div className="bg-background/60 dark:bg-white/[0.04] border border-border/50 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold">Get travel deals &amp; eSIM tips</p>
            <p className="text-sm text-muted-foreground">No spam — just exclusive discounts and coverage updates.</p>
          </div>
          <EmailCapture source="footer" className="w-full md:w-auto md:min-w-[360px]" placeholder="your@email.com" buttonText="Subscribe" />
        </div>

        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <WhoopGoLogo size="small" className="mb-4 inline-block" />
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              Data for every destination. Stay connected anywhere with instant eSIM solutions.
            </p>
          </div>
          {[
            { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }, { label: "Plan Finder", href: "#finder" }, { label: "FAQ", href: "#faq" }] },
            { title: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }, { label: "Careers", href: "#" }, { label: "Contact", href: "#contact" }] },
            { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }, { label: "Refund Policy", href: "#" }] },
          ].map((group) => (
            <div key={group.title}>
              <h3 className="font-bold mb-4 text-sm tracking-wider uppercase text-foreground/80">{group.title}</h3>
              <ul className="space-y-3 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-muted-foreground hover:text-[#E67E3C] transition-colors duration-200">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} WhoopGO! All rights reserved.</p>
          <div className="flex gap-3">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-[#E67E3C] hover:text-white transition-colors duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full scroll-smooth">
      <ScrollProgress />
      <Navbar isDark={isDark} toggleTheme={toggle} />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <EsimFinder />
      <PricingSection />
      <ProofSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
