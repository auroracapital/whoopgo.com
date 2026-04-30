// Phase 10: transactional email via Resend.
// All tests mock the Resend client — no real API calls.

import { test } from "node:test";
import assert from "node:assert/strict";
import { createEmailSender } from "../src/server/email.js";
import { createClerkWebhookHandler } from "../src/server/clerk-webhook.js";

function mockClient() {
  const sent = [];
  return {
    sent,
    emails: {
      async send(payload) {
        sent.push(payload);
        return { data: { id: "msg_test_" + sent.length }, error: null };
      },
    },
  };
}

function mockFailingClient(errorMsg = "rate_limited") {
  return {
    emails: {
      async send() {
        return { data: null, error: { message: errorMsg } };
      },
    },
  };
}

function mockLogger() {
  return {
    logs: [],
    warns: [],
    errors: [],
    log(...a) { this.logs.push(a.join(" ")); },
    warn(...a) { this.warns.push(a.join(" ")); },
    error(...a) { this.errors.push(a.join(" ")); },
  };
}

function mockRes() {
  return {
    statusCode: 200,
    body: null,
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; },
  };
}

// ─── sendWelcomeEmail ────────────────────────────────────────────────────────

test("sendWelcomeEmail sends branded welcome to Clerk user", async () => {
  const client = mockClient();
  const sender = createEmailSender({ client, getApiKey: () => "re_test" });
  const user = {
    id: "user_1",
    first_name: "Ada",
    email_addresses: [{ email_address: "ada@example.com" }],
  };
  const res = await sender.sendWelcomeEmail(user);
  assert.equal(res.skipped, false);
  assert.equal(client.sent.length, 1);
  const payload = client.sent[0];
  assert.equal(payload.to, "ada@example.com");
  assert.ok(payload.subject.includes("Welcome"));
  assert.ok(payload.html.includes("Ada"));
  assert.ok(payload.html.includes("#E67E3C"), "brand orange present");
  assert.ok(payload.html.includes("#5B7FC7"), "brand blue present");
  assert.ok(payload.text.length > 0, "plain-text alt present");
  assert.ok(payload.from.includes("whoopgo.app"));
  assert.equal(payload.reply_to, "support@whoopgo.app");
});

test("sendWelcomeEmail escapes HTML in first name", async () => {
  const client = mockClient();
  const sender = createEmailSender({ client, getApiKey: () => "re_test" });
  await sender.sendWelcomeEmail({
    first_name: "<script>",
    email_addresses: [{ email_address: "x@y.com" }],
  });
  const html = client.sent[0].html;
  assert.ok(!html.includes("<script>"), "raw tag must not leak");
  assert.ok(html.includes("&lt;script&gt;"));
});

test("sendWelcomeEmail skips when no API key", async () => {
  const logger = mockLogger();
  const sender = createEmailSender({ getApiKey: () => undefined, logger });
  const res = await sender.sendWelcomeEmail({ email: "foo@bar.com" });
  assert.equal(res.skipped, true);
  assert.ok(logger.warns.some((w) => w.includes("RESEND_API_KEY not set")));
});

test("sendWelcomeEmail skips when user has no email", async () => {
  const client = mockClient();
  const sender = createEmailSender({ client, getApiKey: () => "re_test" });
  const res = await sender.sendWelcomeEmail({ id: "no_email" });
  assert.equal(res.skipped, true);
  assert.equal(client.sent.length, 0);
});

test("sendWelcomeEmail throws on Resend API error", async () => {
  const client = mockFailingClient("invalid_from");
  const sender = createEmailSender({ client, getApiKey: () => "re_test", logger: mockLogger() });
  await assert.rejects(
    () => sender.sendWelcomeEmail({ email: "a@b.com" }),
    /Email delivery failed/
  );
});

// ─── sendOrderReceipt ────────────────────────────────────────────────────────

test("sendOrderReceipt sends receipt with QR and price", async () => {
  const client = mockClient();
  const sender = createEmailSender({ client, getApiKey: () => "re_test" });
  const res = await sender.sendOrderReceipt({
    user: { email: "traveler@example.com", first_name: "Max" },
    plan: { name: "Europe Traveler", data: "10GB", duration: "15 days" },
    country: "FR",
    qrCode: "data:image/png;base64,AAAA",
    iccid: "8901260000000001234",
    amountCents: 1999,
    currency: "usd",
    sessionId: "cs_test_abc",
  });
  assert.equal(res.skipped, false);
  assert.equal(client.sent.length, 1);
  const p = client.sent[0];
  assert.equal(p.to, "traveler@example.com");
  assert.ok(p.subject.includes("Europe Traveler"));
  assert.ok(p.html.includes("data:image/png;base64,AAAA"));
  assert.ok(p.html.includes("8901260000000001234"));
  assert.ok(p.html.includes("USD 19.99"));
  assert.ok(p.html.includes("cs_test_abc"));
  assert.ok(p.text.includes("USD 19.99"));
  assert.ok(p.text.includes("10GB"));
});

test("sendOrderReceipt works without QR (pending provisioning)", async () => {
  const client = mockClient();
  const sender = createEmailSender({ client, getApiKey: () => "re_test" });
  await sender.sendOrderReceipt({
    user: { email: "x@y.com" },
    plan: { name: "Tourist" },
  });
  const html = client.sent[0].html;
  assert.ok(html.includes("QR code will arrive"));
});

test("sendOrderReceipt shows LPA manual code when present", async () => {
  const client = mockClient();
  const sender = createEmailSender({ client, getApiKey: () => "re_test" });
  await sender.sendOrderReceipt({
    user: { email: "x@y.com" },
    plan: { name: "Explorer" },
    qrCode: "data:image/png;base64,AAAA",
    activationCode: "LPA:1$rsp.esimvault.cloud$ABCD-EFGH",
  });
  const html = client.sent[0].html;
  assert.ok(html.includes("LPA:1$rsp.esimvault.cloud$ABCD-EFGH") ||
           html.includes("LPA:1$rsp.esimvault.cloud$ABCD-EFGH".replace(/\$/g, "$")));
});

test("sendOrderReceipt skips when no email", async () => {
  const client = mockClient();
  const sender = createEmailSender({ client, getApiKey: () => "re_test" });
  const res = await sender.sendOrderReceipt({ plan: { name: "x" } });
  assert.equal(res.skipped, true);
  assert.equal(client.sent.length, 0);
});

// ─── Clerk webhook integration ────────────────────────────────────────────────

test("clerk user.created fires welcome email (mocked) and returns 200", async () => {
  const calls = [];
  const sendWelcomeEmail = async (user) => {
    calls.push(user);
    return { id: "msg_1", skipped: false };
  };
  const logger = mockLogger();
  const handler = createClerkWebhookHandler({
    getSecret: () => "whsec_test",
    verifierFactory: () => ({
      verify: () => ({
        type: "user.created",
        data: {
          id: "user_new",
          first_name: "Ada",
          email_addresses: [{ email_address: "ada@whoopgo.app" }],
        },
      }),
    }),
    repo: { upsertUser: async () => {}, updateUser: async () => {}, softDeleteUser: async () => {} },
    email: { sendWelcomeEmail },
    logger,
  });
  const res = mockRes();
  await handler(
    { headers: { "svix-id": "m", "svix-timestamp": "0", "svix-signature": "v" }, body: Buffer.from("{}") },
    res
  );
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { received: true });
  // Welcome is async (Promise.resolve().then(...)) — let microtasks drain.
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  assert.equal(calls.length, 1, "welcome email must fire once");
  assert.equal(calls[0].id, "user_new");
});

test("clerk user.created welcome failure must NOT fail the webhook", async () => {
  const logger = mockLogger();
  const sendWelcomeEmail = async () => { throw new Error("resend down"); };
  const handler = createClerkWebhookHandler({
    getSecret: () => "whsec_test",
    verifierFactory: () => ({
      verify: () => ({ type: "user.created", data: { id: "u1", email_addresses: [{ email_address: "a@b.co" }] } }),
    }),
    repo: { upsertUser: async () => {}, updateUser: async () => {}, softDeleteUser: async () => {} },
    email: { sendWelcomeEmail },
    logger,
  });
  const res = mockRes();
  await handler(
    { headers: { "svix-id": "m", "svix-timestamp": "0", "svix-signature": "v" }, body: Buffer.from("{}") },
    res
  );
  assert.equal(res.statusCode, 200);
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  assert.ok(logger.errors.some((e) => e.includes("Welcome email failed")), "error must be logged");
});

test("clerk user.updated does NOT fire welcome email", async () => {
  const calls = [];
  const handler = createClerkWebhookHandler({
    getSecret: () => "whsec_test",
    verifierFactory: () => ({ verify: () => ({ type: "user.updated", data: { id: "u1" } }) }),
    repo: { upsertUser: async () => {}, updateUser: async () => {}, softDeleteUser: async () => {} },
    email: { sendWelcomeEmail: async (u) => { calls.push(u); return { skipped: false }; } },
    logger: mockLogger(),
  });
  const res = mockRes();
  await handler({ headers: {}, body: Buffer.from("{}") }, res);
  await new Promise((r) => setImmediate(r));
  assert.equal(calls.length, 0);
});
