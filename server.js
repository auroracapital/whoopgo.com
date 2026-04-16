import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import Stripe from "stripe";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createTransport } from "nodemailer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());

// Raw body needed for Stripe webhook signature verification
app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));

app.use(express.json());

// Serve static Vite build
app.use(express.static(join(__dirname, "dist")));

// ─── Clients ─────────────────────────────────────────────────────────────────
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.warn("WARNING: ANTHROPIC_API_KEY not set — chat will fail");
} else {
  console.log("Anthropic API key loaded (" + apiKey.slice(0, 8) + "...)");
}
const anthropicClient = new Anthropic({ apiKey: apiKey || "" });

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;
if (!stripe) console.warn("WARNING: STRIPE_SECRET_KEY not set — checkout will fail");

const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// ─── Plan Catalog ─────────────────────────────────────────────────────────────
const PLANS = {
  "us-1gb-7d":        { name: "Tourist",         data: "1GB",       duration: "7 days",  price: 499  },
  "us-3gb-15d":       { name: "Traveler",         data: "3GB",       duration: "15 days", price: 999  },
  "us-5gb-30d":       { name: "Explorer",         data: "5GB",       duration: "30 days", price: 1499 },
  "us-10gb-30d":      { name: "Power",            data: "10GB",      duration: "30 days", price: 2499 },
  "eu-5gb-7d":        { name: "Europe Explorer",  data: "5GB",       duration: "7 days",  price: 999  },
  "eu-10gb-15d":      { name: "Europe Traveler",  data: "10GB",      duration: "15 days", price: 1999 },
  "eu-unlimited-30d": { name: "Europe Unlimited", data: "Unlimited", duration: "30 days", price: 4999 },
  "apac-5gb-7d":      { name: "Asia Pacific",     data: "5GB",       duration: "7 days",  price: 1099 },
  "global-10gb-30d":  { name: "Global",           data: "10GB",      duration: "30 days", price: 3499 },
};

// ─── In-memory order store (Phase 4 replaces with DB) ─────────────────────────
/** @type {Map<string, object>} */
const orders = new Map();

// ─── AI Chat ─────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the WhoopGO! eSIM assistant — a friendly, knowledgeable travel connectivity advisor.

Your job is to help travelers find the perfect eSIM plan based on their needs. You have access to these plans:

COUNTRY PLANS:
- United States: 1GB/7d $4.99 | 3GB/15d $9.99 | 5GB/30d $14.99 | 10GB/30d $24.99
- United Kingdom: 1GB/7d $4.99 | 3GB/15d $9.99 | 5GB/30d $14.99 | 10GB/30d $24.99
- France: 1GB/7d $4.99 | 3GB/15d $8.99 | 5GB/30d $13.99 | 10GB/30d $22.99
- Germany: 1GB/7d $4.99 | 3GB/15d $8.99 | 5GB/30d $13.99 | 10GB/30d $22.99
- Italy: 1GB/7d $4.99 | 3GB/15d $8.99 | 5GB/30d $13.99 | 10GB/30d $22.99
- Spain: 1GB/7d $4.99 | 3GB/15d $8.99 | 5GB/30d $13.99 | 10GB/30d $22.99
- Japan: 1GB/7d $5.99 | 3GB/15d $11.99 | 5GB/30d $17.99 | 10GB/30d $29.99
- Thailand: 1GB/7d $3.99 | 3GB/15d $7.99 | 5GB/30d $11.99 | 10GB/30d $19.99
- Turkey: 1GB/7d $4.99 | 3GB/15d $9.99 | 5GB/30d $14.99

REGIONAL PLANS:
- Europe (30+ countries): 5GB/7d $9.99 | 10GB/15d $19.99 | 15GB/30d $29.99 | Unlimited/30d $49.99
- North America (US, CA, MX): 5GB/7d $11.99 | 10GB/15d $22.99 | 15GB/30d $34.99
- Asia Pacific (15+ countries): 5GB/7d $10.99 | 10GB/15d $21.99 | 15GB/30d $32.99
- Middle East (8 countries): 5GB/7d $12.99 | 10GB/15d $24.99

GLOBAL PLANS:
- Global Zone 1 (80+ countries): 5GB/15d $19.99 | 10GB/30d $34.99 | 20GB/30d $54.99

FEATURES (all plans): Instant QR activation, hotspot, 4G/5G where available, 24/7 support.

GUIDELINES:
- Be concise and helpful (2-3 sentences max per response)
- Ask about: destination(s), trip duration, data needs (maps/social/streaming)
- Recommend the best value plan — regional plans are usually better for multi-country trips
- If the user mentions a country not listed, suggest the regional or global plan that covers it
- Always mention the price and key features
- After recommending, ask if they'd like to proceed or need something different
- Keep it conversational and warm — you're a travel buddy, not a salesperson`;

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required" });
    }

    const anthropicMessages = messages.map((m) => ({
      role: m.type === "user" ? "user" : "assistant",
      content: m.content,
    }));

    const response = await anthropicClient.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    res.json({ content: text });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Failed to get response" });
  }
});

// ─── Stripe Checkout ──────────────────────────────────────────────────────────
app.post("/api/checkout", async (req, res) => {
  if (!stripe) return res.status(503).json({ error: "Payments not configured" });

  const { planId, country, email, coupon } = req.body;

  const plan = PLANS[planId];
  if (!plan) return res.status(400).json({ error: "Invalid plan ID" });

  try {
    const sessionParams = {
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: plan.price,
            product_data: {
              name: `WhoopGO! ${plan.name} eSIM`,
              description: `${plan.data} · ${plan.duration} · ${country ?? "US"}`,
              images: [`${BASE_URL}/logo.png`],
            },
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        planId,
        planName: plan.name,
        data: plan.data,
        duration: plan.duration,
        country: country ?? "US",
      },
      success_url: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/checkout/cancel`,
    };

    // Apply Stripe coupon if provided
    if (coupon) {
      sessionParams.discounts = [{ coupon }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// ─── Stripe Webhooks ──────────────────────────────────────────────────────────
app.post("/api/webhooks/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return res.status(503).json({ error: "Webhooks not configured" });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { planId, planName, data, duration, country } = session.metadata ?? {};

    // Persist order
    const order = {
      sessionId: session.id,
      planId,
      planName,
      data,
      duration,
      country,
      email: session.customer_email ?? session.customer_details?.email ?? "",
      status: "provisioning",
      createdAt: new Date().toISOString(),
      qrCode: null,
    };
    orders.set(session.id, order);

    console.log(`Order created: ${session.id} — ${planName} for ${order.email}`);

    // Trigger eSIM provisioning (async — don't block webhook response)
    void provisionEsim(session.id, order);
  }

  res.json({ received: true });
});

// ─── eSIM Provisioning ────────────────────────────────────────────────────────
async function provisionEsim(sessionId, order) {
  try {
    // Phase 3: replaced with real Airalo API call
    const qrData = await callAiraloApi(order);

    orders.set(sessionId, {
      ...order,
      status: "ready",
      qrCode: qrData?.qrCode ?? null,
      iccid: qrData?.iccid ?? null,
    });

    // Send email with QR code
    if (order.email) {
      await sendEsimEmail(order.email, {
        planName: order.planName,
        data: order.data,
        duration: order.duration,
        country: order.country,
        qrCode: qrData?.qrCode,
        iccid: qrData?.iccid,
      });
    }

    console.log(`eSIM provisioned: ${sessionId}`);
  } catch (err) {
    console.error(`eSIM provisioning failed for ${sessionId}:`, err);
    orders.set(sessionId, {
      ...orders.get(sessionId),
      status: "failed",
    });
  }
}

// ─── Orders API ───────────────────────────────────────────────────────────────
app.get("/api/orders/:sessionId", (req, res) => {
  const order = orders.get(req.params.sessionId);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

app.get("/api/orders", (req, res) => {
  const { userId, email } = req.query;
  const all = Array.from(orders.values());

  // Filter by email if provided (Phase 4: filter by userId once auth is wired)
  const filtered = email
    ? all.filter((o) => o.email === email)
    : userId
    ? all.filter((o) => o.userId === userId)
    : all;

  res.json(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// ─── Auth Stubs (Phase 4) ─────────────────────────────────────────────────────
app.post("/api/auth/magic-link", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "email required" });

  try {
    // Phase 4: replace with Clerk magic link
    // For now: send a simple magic link email using Resend
    await sendMagicLinkEmail(email);
    res.json({ sent: true });
  } catch (err) {
    console.error("Magic link error:", err);
    res.status(500).json({ error: "Failed to send magic link" });
  }
});

app.post("/api/auth/signout", (_req, res) => {
  // Phase 4: clear Clerk session
  res.json({ ok: true });
});

// ─── Airalo API Integration ───────────────────────────────────────────────────
async function getAiraloToken() {
  const clientId = process.env.AIRALO_CLIENT_ID;
  const clientSecret = process.env.AIRALO_CLIENT_SECRET;
  const env = process.env.AIRALO_API_ENV ?? "sandbox";
  const baseUrl = env === "production"
    ? "https://www.airalo.com/api/v2"
    : "https://sandbox-partners-api.airalo.com/v2";

  if (!clientId || !clientSecret) throw new Error("Airalo credentials not configured");

  const res = await fetch(`${baseUrl}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) throw new Error(`Airalo auth failed: ${res.status}`);
  const data = await res.json();
  return { token: data.data?.access_token, baseUrl };
}

// Map internal plan IDs to Airalo package slugs
const AIRALO_PACKAGE_MAP = {
  "us-1gb-7d":        "united-states-1gb-7days",
  "us-3gb-15d":       "united-states-3gb-15days",
  "us-5gb-30d":       "united-states-5gb-30days",
  "us-10gb-30d":      "united-states-10gb-30days",
  "eu-5gb-7d":        "europe-5gb-7days",
  "eu-10gb-15d":      "europe-10gb-15days",
  "eu-unlimited-30d": "europe-unlimited-30days",
  "apac-5gb-7d":      "asia-5gb-7days",
  "global-10gb-30d":  "global-10gb-30days",
};

async function callAiraloApi(order) {
  if (!process.env.AIRALO_CLIENT_ID) {
    // No Airalo credentials — return a placeholder QR for dev/test
    console.warn("Airalo not configured — using placeholder QR");
    return {
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=WHOOPGO_TEST_ESIM",
      iccid: "TEST_ICCID_" + Math.random().toString(36).slice(2, 10).toUpperCase(),
    };
  }

  const { token, baseUrl } = await getAiraloToken();
  const packageSlug = AIRALO_PACKAGE_MAP[order.planId];

  if (!packageSlug) throw new Error(`No Airalo package mapping for plan: ${order.planId}`);

  // Create order
  const orderRes = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      package_id: packageSlug,
      quantity: 1,
      type: "sim",
    }),
  });

  if (!orderRes.ok) {
    const body = await orderRes.text();
    throw new Error(`Airalo order failed (${orderRes.status}): ${body}`);
  }

  const orderData = await orderRes.json();
  const sim = orderData.data?.sims?.[0];

  if (!sim) throw new Error("No SIM data in Airalo response");

  return {
    qrCode: sim.qrcode_url ?? sim.qrcode,
    iccid: sim.iccid,
    activationCode: sim.activation_code,
  };
}

// ─── Email Delivery ───────────────────────────────────────────────────────────
async function sendEsimEmail(to, { planName, data, duration, country, qrCode, iccid }) {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "orders@whoopgo.com";

  if (!resendKey) {
    console.warn("RESEND_API_KEY not set — skipping email delivery");
    return;
  }

  const qrCodeImg = qrCode
    ? `<img src="${qrCode}" alt="eSIM QR Code" width="200" style="margin: 16px auto; display: block;" />`
    : "<p>Your QR code will arrive shortly.</p>";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
      <img src="${BASE_URL}/logo.png" alt="WhoopGO!" width="120" style="margin-bottom: 24px;" />
      <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 8px;">Your eSIM is ready! 🎉</h1>
      <p style="color: #666; margin-bottom: 24px;">
        Your <strong>${planName}</strong> plan (${data} · ${duration} · ${country}) has been provisioned.
      </p>

      <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <h2 style="font-size: 16px; margin-bottom: 12px;">Scan to activate your eSIM</h2>
        ${qrCodeImg}
        ${iccid ? `<p style="font-size: 12px; color: #999; margin-top: 8px;">ICCID: ${iccid}</p>` : ""}
      </div>

      <h3 style="font-size: 16px; margin-bottom: 12px;">How to activate:</h3>
      <ol style="color: #444; line-height: 1.8; padding-left: 20px;">
        <li>Go to Settings → Mobile → Add eSIM</li>
        <li>Scan the QR code above</li>
        <li>Select WhoopGO! as your data plan when roaming</li>
        <li>Activate when you land — data starts immediately</li>
      </ol>

      <p style="color: #999; font-size: 12px; margin-top: 32px; text-align: center;">
        Questions? Reply to this email or visit whoopgo.com<br />
        WhoopGO! · Instant eSIM for global travelers
      </p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Your WhoopGO! eSIM — ${planName} Plan`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Resend email failed:", body);
    throw new Error(`Email delivery failed: ${res.status}`);
  }
}

async function sendMagicLinkEmail(to) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("RESEND_API_KEY not set — magic link email skipped");
    return;
  }

  // Phase 4: generate a real signed token
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const magicLink = `${BASE_URL}/auth/verify?token=${token}&email=${encodeURIComponent(to)}`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "auth@whoopgo.com",
      to,
      subject: "Sign in to WhoopGO!",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 32px; text-align: center;">
          <h1 style="font-size: 24px; font-weight: 900;">Sign in to WhoopGO!</h1>
          <p style="color: #666; margin-bottom: 24px;">Click the button below to sign in. This link expires in 15 minutes.</p>
          <a href="${magicLink}" style="background: #E67E3C; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Sign In
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    }),
  });
}

// ─── Analytics Event (Phase 5) ────────────────────────────────────────────────
app.post("/api/analytics/event", (req, res) => {
  const { event, properties } = req.body;
  console.log(`[Analytics] ${event}`, properties);
  res.json({ ok: true });
});

// ─── Newsletter Subscribe ─────────────────────────────────────────────────────
const newsletterSubscribers = new Set();

app.post("/api/newsletter/subscribe", async (req, res) => {
  const { email, source } = req.body;
  if (!email) return res.status(400).json({ error: "email required" });

  newsletterSubscribers.add(email);
  console.log(`Newsletter signup: ${email} (source: ${source ?? "unknown"})`);

  // Optional: sync to Resend contact list
  const resendKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (resendKey && audienceId) {
    try {
      await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
    } catch (err) {
      console.error("Resend audience sync failed:", err);
      // Non-fatal — subscriber already logged locally
    }
  }

  res.json({ ok: true });
});

// ─── Contact Form ─────────────────────────────────────────────────────────────
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are required" });
  }

  try {
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM ?? "contact@whoopgo.com",
          to: "hello@whoopgo.com",
          reply_to: email,
          subject: `Contact form: ${name}`,
          html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(/\n/g, "<br/>")}</p>`,
        }),
      });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.get("/{*path}", (_req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`WhoopGO server running on port ${PORT}`);
});
