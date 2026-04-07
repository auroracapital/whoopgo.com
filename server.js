import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static Vite build
app.use(express.static(join(__dirname, "dist")));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

    // Convert to Anthropic format
    const anthropicMessages = messages.map((m) => ({
      role: m.type === "user" ? "user" : "assistant",
      content: m.content,
    }));

    const response = await client.messages.create({
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

// SPA fallback
app.get("/{*path}", (_req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`WhoopGO server running on port ${PORT}`);
});
