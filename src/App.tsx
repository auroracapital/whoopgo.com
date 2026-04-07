import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi,
  Globe,
  Shield,
  Zap,
  Check,
  ChevronDown,
  Mail,
  Phone,
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
      className="relative w-10 h-10 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 border border-border/50 transition-all duration-300 hover:scale-105"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-4 h-4 text-[#5B7FC7]" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-4 h-4 text-[#E67E3C]" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── Logo ────────────────────────────────────────────────────────────────────
function WhoopGoLogo({ className = "", size = "default" }: { className?: string; size?: "default" | "small" }) {
  const h = size === "small" ? "h-8" : "h-10 md:h-12";
  return (
    <img
      src="/logo.svg"
      alt="WhoopGO!"
      className={cn("w-auto select-none", h, className)}
    />
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <a href="#"><WhoopGoLogo size="small" /></a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle isDark={isDark} toggle={toggleTheme} />
          <Button className="bg-[#E67E3C] hover:bg-[#D86E2C] text-white shadow-lg shadow-[#E67E3C]/25 hover:shadow-[#E67E3C]/40 transition-all duration-300">
            Get Started
          </Button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle isDark={isDark} toggle={toggleTheme} />
          <button
            className="p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-4 pb-6 space-y-4"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Button className="w-full bg-[#E67E3C] hover:bg-[#D86E2C] text-white shadow-lg shadow-[#E67E3C]/25">
            Get Started
          </Button>
        </motion.div>
      )}
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
            "backdrop-blur-[2px] border-2 border-gray-300/30 dark:border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03),transparent_70%)] dark:after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#030303] dark:to-[#030303]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5B7FC7]/[0.08] via-transparent to-[#E67E3C]/[0.08] blur-3xl dark:from-[#5B7FC7]/[0.05] dark:via-transparent dark:to-[#E67E3C]/[0.05]" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-[#5B7FC7]/[0.15]" className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]" />
        <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-[#E67E3C]/[0.15]" className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]" />
        <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="from-[#E67E3C]/[0.15]" className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="text-center lg:text-left">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glass-hover mb-8 md:mb-12 group"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-2 h-2 rounded-full bg-[#E67E3C] glow-orange"
              />
              <span className="text-sm text-gray-700 dark:text-white/70 tracking-wide font-medium">
                Data for Every Destination
              </span>
            </motion.div>

            <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
              <h1 className="text-5xl sm:text-7xl md:text-[7rem] font-bold mb-6 md:mb-8 tracking-tight leading-[0.95]">
                <span className="block">
                  <span className="bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-white/95 dark:to-white/80">
                    whoop
                  </span>
                  <span className="text-gradient-blue">GO</span>
                  <span className="text-gradient-orange">!</span>
                </span>
                <span className="block text-base sm:text-xl md:text-3xl font-medium mt-4 text-gray-600 dark:text-white/50">
                  Stay Connected, Anywhere
                </span>
              </h1>
            </motion.div>

            <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-white/50 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                Instant eSIM activation for travelers worldwide.
                <span className="block mt-2 text-base sm:text-lg text-gray-500 dark:text-white/40">
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
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-[#E67E3C] hover:bg-[#D86E2C] text-white px-10 py-7 text-lg rounded-2xl shadow-xl glow-orange group relative overflow-hidden">
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-[#F4A460] to-[#E67E3C] opacity-0 group-hover:opacity-100 transition-opacity" initial={false} />
                  <span className="relative z-10 flex items-center gap-2">
                    Get Your eSIM Now
                    <Wifi className="w-5 h-5" />
                  </span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="glass glass-hover border-gray-300 text-gray-900 dark:border-white/30 dark:text-white px-10 py-7 text-lg rounded-2xl group">
                  <span className="flex items-center gap-2">
                    Download App
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                      &rarr;
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

      <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-gray-100/80 dark:from-[#030303] dark:via-transparent dark:to-[#030303]/80 pointer-events-none" />
    </div>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: Wifi, title: "Instant Activation", description: "Get connected in minutes. Scan the QR code and go." },
    { icon: Globe, title: "Global Coverage", description: "Country, regional, and global plans across 100+ destinations." },
    { icon: Shield, title: "Secure & Reliable", description: "Bank-grade encryption and 99.9% network uptime guarantee." },
    { icon: Zap, title: "High-Speed Data", description: "4G/5G speeds with flexible data options for every trip." },
  ];

  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-[#E67E3C]" />
            <span className="text-sm font-medium text-muted-foreground">Why WhoopGO!</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="block">Your Perfect</span>
            <span className="block text-gradient-orange">Travel Companion</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Everything you need for seamless connectivity worldwide
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="p-8 rounded-3xl glass glass-hover group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E67E3C]/5 rounded-full blur-3xl group-hover:bg-[#E67E3C]/10 transition-colors duration-500" />
              <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-[#E67E3C]" />
              </div>
              <h3 className="text-2xl font-bold mb-3 relative z-10">{feature.title}</h3>
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
    { step: "1", title: "Choose Your Plan", description: "Select country, regional, or global coverage that fits your trip." },
    { step: "2", title: "Scan QR Code", description: "Receive your eSIM QR code instantly via email after purchase." },
    { step: "3", title: "Stay Connected", description: "Activate and enjoy high-speed data the moment you land." },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">Three simple steps to global connectivity</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#E67E3C] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────
function PricingSection() {
  const plans = [
    { name: "Tourist", price: 9.99, data: "5GB", days: 7, features: ["5GB High-Speed Data", "7 Days Validity", "30+ Countries", "24/7 Support"] },
    { name: "Traveler", price: 29.99, data: "15GB", days: 15, popular: true, features: ["15GB High-Speed Data", "15 Days Validity", "30+ Countries", "Priority Support", "Hotspot Enabled"] },
    { name: "Explorer", price: 49.99, data: "Unlimited", days: 30, features: ["Unlimited Data", "30 Days Validity", "30+ Countries", "VIP Support", "Hotspot Enabled", "Free Renewal Discount"] },
  ];

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Zap className="w-4 h-4 text-[#5B7FC7]" />
            <span className="text-sm font-medium text-muted-foreground">Pricing Plans</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="block">Simple,</span>
            <span className="block text-gradient-blue">Transparent Pricing</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-muted-foreground text-xl leading-relaxed">
            Choose the plan that fits your travel needs
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={cn("relative", plan.popular && "border-primary shadow-xl scale-105")}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
              )}
              <CardHeader>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground ml-2">/ {plan.days} days</span>
                </div>
                <p className="text-xl text-muted-foreground mt-2">{plan.data} Data</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>Get Started</Button>
              </CardContent>
            </Card>
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
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-primary-foreground/80">{stat.label}</div>
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
    { text: "WhoopGO! saved me so much hassle during my Europe trip. Instant activation and great speeds everywhere!", name: "Emma Thompson", role: "Travel Blogger", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150" },
    { text: "Best eSIM service I've used. The app makes it so easy to manage plans on the go. Highly recommend!", name: "Marco Silva", role: "Digital Nomad", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150" },
    { text: "Perfect for business travel. Reliable connection in every country I visited. The regional plans are unbeatable.", name: "Sophie Laurent", role: "Business Consultant", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Travelers Say</h2>
          <p className="text-muted-foreground text-lg">Join thousands of happy WhoopGO! customers</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[300px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentIndex ? 1 : 0, scale: index === currentIndex ? 1 : 0.95 }}
                transition={{ duration: 0.5 }}
                className={cn("absolute inset-0", index !== currentIndex && "pointer-events-none")}
              >
                <Card className="p-8">
                  <CardContent className="text-center">
                    <p className="text-xl md:text-2xl mb-8 italic">&ldquo;{testimonial.text}&rdquo;</p>
                    <div className="flex items-center justify-center gap-4">
                      <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover" />
                      <div className="text-left">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button key={index} onClick={() => setCurrentIndex(index)} className={cn("w-3 h-3 rounded-full transition-colors", index === currentIndex ? "bg-primary" : "bg-muted")} />
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
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">Everything you need to know</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden bg-card">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                <span className="font-semibold text-lg">{faq.question}</span>
                <ChevronDown className={cn("w-5 h-5 transition-transform", openIndex === index && "rotate-180")} />
              </button>
              {openIndex === index && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">Have questions? We're here to help. Reach out to our team anytime.</p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:support@whoopgo.com" className="text-muted-foreground hover:text-primary">support@whoopgo.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a href="tel:+441234567890" className="text-muted-foreground hover:text-primary">+44 123 456 7890</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Office</p>
                    <p className="text-muted-foreground">Amsterdam, Netherlands</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="How can we help?" rows={5} />
                    </div>
                    <Button className="w-full">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  const socialLinks = [
    { icon: Globe2, href: "#" },
    { icon: MessageCircle, href: "#" },
    { icon: Link2, href: "#" },
    { icon: Camera, href: "#" },
  ];

  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <WhoopGoLogo size="small" className="mb-4 inline-block" />
            <p className="text-muted-foreground text-sm mt-2">Data for every destination. Stay connected anywhere with our instant eSIM solutions.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary">Features</a></li>
              <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
              <li><a href="#finder" className="hover:text-primary">Plan Finder</a></li>
              <li><a href="#faq" className="hover:text-primary">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">About</a></li>
              <li><a href="#" className="hover:text-primary">Blog</a></li>
              <li><a href="#" className="hover:text-primary">Careers</a></li>
              <li><a href="#contact" className="hover:text-primary">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Privacy</a></li>
              <li><a href="#" className="hover:text-primary">Terms</a></li>
              <li><a href="#" className="hover:text-primary">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; 2024 WhoopGO! All rights reserved.</p>
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <a key={index} href={social.href} className="w-10 h-10 rounded-full bg-muted-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <social.icon className="w-5 h-5" />
              </a>
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

  return (
    <div className="min-h-screen w-full">
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
