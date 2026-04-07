import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface PlanRecommendation {
  name: string;
  data: string;
  days: number;
  price: number;
  countries: string[];
  features: string[];
}

const SAMPLE_PLANS: PlanRecommendation[] = [
  {
    name: "Tourist",
    data: "5GB",
    days: 7,
    price: 9.99,
    countries: ["France", "Germany", "Italy", "Spain", "UK"],
    features: [
      "5GB High-Speed Data",
      "7 Days Validity",
      "30+ Countries",
      "24/7 Support",
    ],
  },
  {
    name: "Traveler",
    data: "15GB",
    days: 15,
    price: 29.99,
    countries: ["All Europe", "Turkey", "Switzerland"],
    features: [
      "15GB High-Speed Data",
      "15 Days Validity",
      "30+ Countries",
      "Priority Support",
      "Hotspot Enabled",
    ],
  },
  {
    name: "Explorer",
    data: "Unlimited",
    days: 30,
    price: 49.99,
    countries: ["All Europe", "Extended Coverage"],
    features: [
      "Unlimited Data",
      "30 Days Validity",
      "30+ Countries",
      "VIP Support",
      "Hotspot Enabled",
      "Free Renewal Discount",
    ],
  },
];

const AI_QUESTIONS = [
  "Hi! I'm your WhoopGO! assistant. Which countries will you be visiting?",
  "Great choice! How long will you be traveling?",
  "Perfect! How much data do you think you'll need? (Light browsing, moderate use, or heavy streaming?)",
];

function PlanCard({
  plan,
  onSelect,
}: {
  plan: PlanRecommendation;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Card className="relative overflow-hidden border-[#E67E3C]/20 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm hover:border-[#E67E3C]/40 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E67E3C]/10 rounded-full blur-3xl" />
        <div className="relative p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.data} Data</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">${plan.price}</div>
              <div className="text-xs text-muted-foreground">
                {plan.days} days
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-[#5B7FC7]" />
              <span>{plan.countries.join(", ")}</span>
            </div>
          </div>

          <ul className="space-y-2">
            {plan.features.slice(0, 3).map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-[#E67E3C]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={onSelect}
            className="w-full bg-[#E67E3C] hover:bg-[#D86E2C] text-white"
          >
            Select Plan
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export function EsimFinder() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: AI_QUESTIONS[0],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [showPlans, setShowPlans] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (step < AI_QUESTIONS.length - 1) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: AI_QUESTIONS[step + 1],
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setStep(step + 1);
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content:
            "Based on your travel plans, here are the perfect eSIM packages for you:",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setShowPlans(true);
      }
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section id="finder" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5B7FC7]/[0.03] via-transparent to-[#E67E3C]/[0.03]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E67E3C]/10 border border-[#E67E3C]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#E67E3C]" />
            <span className="text-sm font-medium text-[#E67E3C]">
              AI-Powered
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect eSIM
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Answer a few questions and let our AI recommend the best plan for
            your trip
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="h-[500px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.type === "user"
                            ? "bg-[#E67E3C] text-white"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {message.type === "ai" && (
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-[#5B7FC7]" />
                            <span className="text-xs font-semibold text-muted-foreground">
                              WhoopGO! Assistant
                            </span>
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {showPlans && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid md:grid-cols-3 gap-4 pt-4"
                  >
                    {SAMPLE_PLANS.map((plan, index) => (
                      <PlanCard
                        key={index}
                        plan={plan}
                        onSelect={() => {
                          const successMessage: Message = {
                            id: Date.now().toString(),
                            type: "ai",
                            content: `Great choice! The ${plan.name} plan is perfect for your trip. Ready to get started?`,
                            timestamp: new Date(),
                          };
                          setMessages((prev) => [...prev, successMessage]);
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {!showPlans && (
                <div className="border-t border-border/50 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your answer..."
                      className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E3C]/50"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="bg-[#E67E3C] hover:bg-[#D86E2C] text-white px-6"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
