// Stripe client-side helpers + plan catalog

export interface Plan {
  id: string;
  name: string;
  data: string;
  duration: string;
  price: number; // in USD cents
  description: string;
  popular?: boolean;
  countries?: string;
}

export const PLANS: Plan[] = [
  // Country plans
  {
    id: "us-1gb-7d",
    name: "Tourist",
    data: "1GB",
    duration: "7 days",
    price: 499,
    description: "Perfect for short trips — maps, messaging, light browsing",
  },
  {
    id: "us-3gb-15d",
    name: "Traveler",
    data: "3GB",
    duration: "15 days",
    price: 999,
    description: "Great for 2-week vacations with regular social media use",
  },
  {
    id: "us-5gb-30d",
    name: "Explorer",
    data: "5GB",
    duration: "30 days",
    price: 1499,
    description: "Monthly coverage for extended stays or digital nomads",
    popular: true,
  },
  {
    id: "us-10gb-30d",
    name: "Power",
    data: "10GB",
    duration: "30 days",
    price: 2499,
    description: "Heavy usage — streaming, video calls, unlimited sharing",
  },
  // Regional plans
  {
    id: "eu-5gb-7d",
    name: "Europe Explorer",
    data: "5GB",
    duration: "7 days",
    price: 999,
    description: "30+ European countries covered",
    countries: "30+ countries",
  },
  {
    id: "eu-10gb-15d",
    name: "Europe Traveler",
    data: "10GB",
    duration: "15 days",
    price: 1999,
    description: "Two weeks across Europe with generous data",
    countries: "30+ countries",
  },
  {
    id: "eu-unlimited-30d",
    name: "Europe Unlimited",
    data: "Unlimited",
    duration: "30 days",
    price: 4999,
    description: "Stream, work, and share without limits across Europe",
    countries: "30+ countries",
  },
  {
    id: "apac-5gb-7d",
    name: "Asia Pacific",
    data: "5GB",
    duration: "7 days",
    price: 1099,
    description: "15+ Asia Pacific countries",
    countries: "15+ countries",
  },
  // Global plan
  {
    id: "global-10gb-30d",
    name: "Global",
    data: "10GB",
    duration: "30 days",
    price: 3499,
    description: "80+ countries — the ultimate travel companion",
    countries: "80+ countries",
  },
];

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
