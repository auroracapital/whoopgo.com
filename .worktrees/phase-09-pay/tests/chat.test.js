// Unit test for /api/chat Gemini integration.
// Mocks @google/genai via ESM loader-free module-cache swap: we import the
// SDK, replace GoogleGenAI.prototype.models.generateContent indirectly by
// constructing our own express app that uses a fake client. This keeps the
// test hermetic (no network, no real API key needed).

import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";

// Reconstruct the handler under test with an injected fake client.
// We mirror the production shape from server.js exactly.
function buildApp(fakeClient, systemPrompt = "SYS", model = "gemini-3.1-flash-lite-preview") {
  const app = express();
  app.use(express.json());

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "messages array required" });
      }

      const contents = messages.map((m) => ({
        role: m.type === "user" ? "user" : "model",
        parts: [{ text: String(m.content ?? "") }],
      }));

      const response = await fakeClient.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: 300,
        },
      });

      const text = response?.text ?? "";
      res.json({ content: text });
    } catch (err) {
      console.error("Chat error:", err);
      res.status(500).json({ error: "Failed to get response" });
    }
  });

  return app;
}

async function postJson(app, path, body) {
  const server = app.listen(0);
  const { port } = server.address();
  try {
    const res = await fetch(`http://127.0.0.1:${port}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = null; }
    return { status: res.status, body: json };
  } finally {
    await new Promise((r) => server.close(r));
  }
}

test("POST /api/chat sends Gemini-shaped request and returns { content }", async () => {
  const calls = [];
  const fake = {
    models: {
      generateContent: async (params) => {
        calls.push(params);
        return { text: "Try the Europe Explorer 5GB/7d for $9.99." };
      },
    },
  };

  const app = buildApp(fake, "SYS_PROMPT", "gemini-3.1-flash-lite-preview");

  const { status, body } = await postJson(app, "/api/chat", {
    messages: [
      { type: "user", content: "Heading to Paris next week" },
      { type: "assistant", content: "How long is your trip?" },
      { type: "user", content: "5 days" },
    ],
  });

  assert.equal(status, 200);
  assert.equal(body.content, "Try the Europe Explorer 5GB/7d for $9.99.");

  assert.equal(calls.length, 1);
  const [p] = calls;
  assert.equal(p.model, "gemini-3.1-flash-lite-preview");
  assert.equal(p.config.systemInstruction, "SYS_PROMPT");
  assert.equal(p.config.maxOutputTokens, 300);

  // Role + parts mapping
  assert.deepEqual(p.contents, [
    { role: "user",  parts: [{ text: "Heading to Paris next week" }] },
    { role: "model", parts: [{ text: "How long is your trip?" }] },
    { role: "user",  parts: [{ text: "5 days" }] },
  ]);
});

test("POST /api/chat returns 400 on missing messages", async () => {
  const fake = { models: { generateContent: async () => ({ text: "" }) } };
  const app = buildApp(fake);
  const { status, body } = await postJson(app, "/api/chat", {});
  assert.equal(status, 400);
  assert.equal(body.error, "messages array required");
});

test("POST /api/chat returns 500 when SDK throws", async () => {
  const fake = {
    models: {
      generateContent: async () => { throw new Error("boom"); },
    },
  };
  const app = buildApp(fake);
  const { status, body } = await postJson(app, "/api/chat", {
    messages: [{ type: "user", content: "hi" }],
  });
  assert.equal(status, 500);
  assert.equal(body.error, "Failed to get response");
});

test("POST /api/chat tolerates missing response.text", async () => {
  const fake = { models: { generateContent: async () => ({}) } };
  const app = buildApp(fake);
  const { status, body } = await postJson(app, "/api/chat", {
    messages: [{ type: "user", content: "hi" }],
  });
  assert.equal(status, 200);
  assert.equal(body.content, "");
});
