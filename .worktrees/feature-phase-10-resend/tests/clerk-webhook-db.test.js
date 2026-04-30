// Phase 6: verify Clerk webhook handler routes events to the users repo.
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { createClerkWebhookHandler } from "../src/server/clerk-webhook.js";
import {
  upsertUser,
  updateUser,
  softDeleteUser,
} from "../src/server/users-repo.js";
import { __setPoolForTests } from "../src/server/db.js";

function mockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function makeReq(evt) {
  return {
    body: Buffer.from(JSON.stringify(evt)),
    headers: {
      "svix-id": "msg_1",
      "svix-timestamp": "0",
      "svix-signature": "v1,sig",
    },
  };
}

function stubVerifierFactory(evt) {
  return () => ({ verify: () => evt });
}

const silentLogger = { log: () => {}, error: () => {} };

describe("clerk webhook DB integration", () => {
  it("routes user.created to upsertUser with INSERT ON CONFLICT", async () => {
    const calls = [];
    const repo = {
      upsertUser: async (data) => calls.push(["upsert", data]),
      updateUser: async (data) => calls.push(["update", data]),
      softDeleteUser: async (data) => calls.push(["soft-delete", data]),
    };
    const evt = {
      type: "user.created",
      data: {
        id: "user_abc",
        email_addresses: [{ id: "em_1", email_address: "a@b.co" }],
        primary_email_address_id: "em_1",
        first_name: "Ada",
        last_name: "Lovelace",
      },
    };
    const handler = createClerkWebhookHandler({
      getSecret: () => "secret",
      verifierFactory: stubVerifierFactory(evt),
      logger: silentLogger,
      repo,
    });
    const res = mockRes();
    await handler(makeReq(evt), res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { received: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], "upsert");
    assert.equal(calls[0][1].id, "user_abc");
  });

  it("routes user.updated to updateUser", async () => {
    const calls = [];
    const repo = {
      upsertUser: async () => calls.push("upsert"),
      updateUser: async (data) => calls.push(["update", data.id]),
      softDeleteUser: async () => calls.push("soft-delete"),
    };
    const evt = { type: "user.updated", data: { id: "user_xyz" } };
    const handler = createClerkWebhookHandler({
      getSecret: () => "secret",
      verifierFactory: stubVerifierFactory(evt),
      logger: silentLogger,
      repo,
    });
    await handler(makeReq(evt), mockRes());
    assert.deepEqual(calls, [["update", "user_xyz"]]);
  });

  it("routes user.deleted to softDeleteUser", async () => {
    const calls = [];
    const repo = {
      upsertUser: async () => calls.push("upsert"),
      updateUser: async () => calls.push("update"),
      softDeleteUser: async (data) => calls.push(["soft-delete", data.id]),
    };
    const evt = { type: "user.deleted", data: { id: "user_gone" } };
    const handler = createClerkWebhookHandler({
      getSecret: () => "secret",
      verifierFactory: stubVerifierFactory(evt),
      logger: silentLogger,
      repo,
    });
    await handler(makeReq(evt), mockRes());
    assert.deepEqual(calls, [["soft-delete", "user_gone"]]);
  });

  it("swallows DB errors so Clerk does not retry-loop", async () => {
    const repo = {
      upsertUser: async () => { throw new Error("connection refused"); },
    };
    const evt = { type: "user.created", data: { id: "user_fail", email_addresses: [] } };
    const handler = createClerkWebhookHandler({
      getSecret: () => "secret",
      verifierFactory: stubVerifierFactory(evt),
      logger: silentLogger,
      repo,
    });
    const res = mockRes();
    await handler(makeReq(evt), res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { received: true });
  });
});

describe("users-repo SQL contract", () => {
  let origEnv;
  before(() => {
    origEnv = process.env.DATABASE_URL;
    process.env.DATABASE_URL = "postgres://fake"; // force isDbConfigured() true
  });
  after(() => {
    if (origEnv) process.env.DATABASE_URL = origEnv;
    else delete process.env.DATABASE_URL;
    __setPoolForTests(null);
  });

  it("upsertUser emits INSERT ... ON CONFLICT DO UPDATE", async () => {
    const captured = [];
    const queryFn = async (text, params) => {
      captured.push({ text, params });
      return { rows: [] };
    };
    await upsertUser(
      {
        id: "u1",
        email_addresses: [
          { id: "em_a", email_address: "x@y.co" },
          { id: "em_b", email_address: "other@y.co" },
        ],
        primary_email_address_id: "em_b",
        first_name: "First",
        last_name: "Last",
      },
      { queryFn }
    );
    assert.equal(captured.length, 1);
    assert.match(captured[0].text, /INSERT INTO users/);
    assert.match(captured[0].text, /ON CONFLICT \(clerk_id\) DO UPDATE/);
    assert.deepEqual(captured[0].params, ["u1", "other@y.co", "First Last"]);
  });

  it("updateUser emits UPDATE with updated_at = NOW()", async () => {
    const captured = [];
    const queryFn = async (text, params) => {
      captured.push({ text, params });
      return { rows: [] };
    };
    await updateUser(
      { id: "u2", email_addresses: [{ id: "em_1", email_address: "z@z.co" }], primary_email_address_id: "em_1" },
      { queryFn }
    );
    assert.match(captured[0].text, /UPDATE\s+users/);
    assert.match(captured[0].text, /updated_at = NOW\(\)/);
    assert.deepEqual(captured[0].params, ["u2", "z@z.co", null]);
  });

  it("softDeleteUser sets deleted_at, does not DELETE", async () => {
    const captured = [];
    const queryFn = async (text, params) => {
      captured.push({ text, params });
      return { rows: [] };
    };
    await softDeleteUser({ id: "u3" }, { queryFn });
    assert.match(captured[0].text, /UPDATE users SET deleted_at = NOW\(\)/);
    assert.doesNotMatch(captured[0].text, /DELETE FROM/);
    assert.deepEqual(captured[0].params, ["u3"]);
  });

  it("repo no-ops if DATABASE_URL unset", async () => {
    const saved = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    try {
      const captured = [];
      const queryFn = async (text, params) => {
        captured.push({ text, params });
        return { rows: [] };
      };
      const result = await upsertUser({ id: "u4" }, { queryFn });
      assert.equal(captured.length, 0);
      assert.equal(result.skipped, true);
    } finally {
      process.env.DATABASE_URL = saved;
    }
  });
});
