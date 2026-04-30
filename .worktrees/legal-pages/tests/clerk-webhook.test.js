import { test } from "node:test";
import assert from "node:assert/strict";
import { createClerkWebhookHandler } from "../src/server/clerk-webhook.js";

// Minimal Express-style res mock
function mockRes() {
  const res = {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  return res;
}

function mockLogger() {
  return {
    logs: [],
    errors: [],
    log(...args) {
      this.logs.push(args.join(" "));
    },
    error(...args) {
      this.errors.push(args.join(" "));
    },
  };
}

test("returns 503 when CLERK_WEBHOOK_SECRET is not configured", async () => {
  const handler = createClerkWebhookHandler({
    getSecret: () => undefined,
    logger: mockLogger(),
  });
  const req = { headers: {}, body: Buffer.from("{}") };
  const res = mockRes();
  await handler(req, res);
  assert.equal(res.statusCode, 503);
  assert.deepEqual(res.body, { error: "Clerk webhook not configured" });
});

test("returns 400 when svix signature verification fails", async () => {
  const logger = mockLogger();
  const handler = createClerkWebhookHandler({
    getSecret: () => "whsec_test",
    verifierFactory: () => ({
      verify() {
        throw new Error("no matching signature");
      },
    }),
    logger,
  });
  const req = {
    headers: {
      "svix-id": "msg_1",
      "svix-timestamp": "1700000000",
      "svix-signature": "v1,invalid",
    },
    body: Buffer.from(JSON.stringify({ type: "user.created", data: { id: "u_1" } })),
  };
  const res = mockRes();
  await handler(req, res);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: "Invalid signature" });
  assert.ok(logger.errors.some((e) => e.includes("signature verification failed")));
});

test("returns 400 when required svix headers are missing", async () => {
  const handler = createClerkWebhookHandler({
    getSecret: () => "whsec_test",
    verifierFactory: () => ({
      verify(_body, headers) {
        if (!headers["svix-id"] || !headers["svix-signature"]) {
          throw new Error("missing required headers");
        }
        return { type: "user.created", data: { id: "u_1" } };
      },
    }),
    logger: mockLogger(),
  });
  const req = { headers: {}, body: Buffer.from("{}") };
  const res = mockRes();
  await handler(req, res);
  assert.equal(res.statusCode, 400);
});

test("handles user.created and logs id + email", async () => {
  const logger = mockLogger();
  const payload = {
    type: "user.created",
    data: {
      id: "user_abc123",
      email_addresses: [{ email_address: "new@whoopgo.com" }],
    },
  };
  const handler = createClerkWebhookHandler({
    getSecret: () => "whsec_test",
    verifierFactory: () => ({ verify: () => payload }),
    logger,
  });
  const req = {
    headers: {
      "svix-id": "msg_1",
      "svix-timestamp": "1700000000",
      "svix-signature": "v1,valid",
    },
    body: Buffer.from(JSON.stringify(payload)),
  };
  const res = mockRes();
  await handler(req, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { received: true });
  assert.ok(
    logger.logs.some(
      (l) => l.includes("user.created") && l.includes("user_abc123") && l.includes("new@whoopgo.com")
    ),
    `expected user.created log line, got: ${JSON.stringify(logger.logs)}`
  );
});

test("handles user.updated", async () => {
  const logger = mockLogger();
  const handler = createClerkWebhookHandler({
    getSecret: () => "whsec_test",
    verifierFactory: () => ({
      verify: () => ({ type: "user.updated", data: { id: "user_xyz" } }),
    }),
    logger,
  });
  const res = mockRes();
  await handler({ headers: {}, body: Buffer.from("{}") }, res);
  assert.equal(res.statusCode, 200);
  assert.ok(logger.logs.some((l) => l.includes("user.updated") && l.includes("user_xyz")));
});

test("handles user.deleted", async () => {
  const logger = mockLogger();
  const handler = createClerkWebhookHandler({
    getSecret: () => "whsec_test",
    verifierFactory: () => ({
      verify: () => ({ type: "user.deleted", data: { id: "user_del" } }),
    }),
    logger,
  });
  const res = mockRes();
  await handler({ headers: {}, body: Buffer.from("{}") }, res);
  assert.equal(res.statusCode, 200);
  assert.ok(logger.logs.some((l) => l.includes("user.deleted") && l.includes("user_del")));
});

test("logs unhandled event types but still returns 200", async () => {
  const logger = mockLogger();
  const handler = createClerkWebhookHandler({
    getSecret: () => "whsec_test",
    verifierFactory: () => ({
      verify: () => ({ type: "session.created", data: { id: "sess_1" } }),
    }),
    logger,
  });
  const res = mockRes();
  await handler({ headers: {}, body: Buffer.from("{}") }, res);
  assert.equal(res.statusCode, 200);
  assert.ok(logger.logs.some((l) => l.includes("unhandled type=session.created")));
});
