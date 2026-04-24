// Transactional email delivery via Resend.
//
// All outbound transactional email from whoopgo.app flows through this module.
// Templates are inline HTML + plain-text, brand-consistent with whoopgo.app
// (orange #E67E3C, blue #5B7FC7). We use the official `resend` SDK so tests
// can inject a stub client via `createEmailSender({ client })`.

import { Resend } from "resend";

const BRAND = {
  orange: "#E67E3C",
  orangeDark: "#D86E2C",
  blue: "#5B7FC7",
  text: "#1a1a1a",
  muted: "#666",
  subtle: "#999",
  bgSoft: "#f9f9f9",
};

const DEFAULT_FROM = "WhoopGO! <support@whoopgo.app>";
const DEFAULT_REPLY_TO = "support@whoopgo.app";
const SITE_URL = "https://whoopgo.app";

/**
 * Build a mailer. In production, pass nothing — a real Resend client is built
 * from RESEND_API_KEY. In tests, pass `{ client }` where `client.emails.send`
 * is a stub.
 *
 * @param {object} [opts]
 * @param {() => string | undefined} [opts.getApiKey]
 * @param {{ emails: { send: (payload: object) => Promise<{ data?: object, error?: object }> } }} [opts.client]
 * @param {{ from?: string, replyTo?: string }} [opts.defaults]
 * @param {{ log: Function, warn: Function, error: Function }} [opts.logger]
 */
export function createEmailSender(opts = {}) {
  const {
    getApiKey = () => process.env.RESEND_API_KEY,
    client: injectedClient,
    defaults = {},
    logger = console,
  } = opts;

  const from = defaults.from ?? process.env.EMAIL_FROM ?? DEFAULT_FROM;
  const replyTo = defaults.replyTo ?? DEFAULT_REPLY_TO;

  function getClient() {
    if (injectedClient) return injectedClient;
    const key = getApiKey();
    if (!key) return null;
    return new Resend(key);
  }

  async function send({ to, subject, html, text, attachments }) {
    const client = getClient();
    if (!client) {
      logger.warn("RESEND_API_KEY not set — skipping email", { to, subject });
      return { skipped: true };
    }
    const payload = {
      from,
      to,
      subject,
      html,
      text,
      reply_to: replyTo,
    };
    if (Array.isArray(attachments) && attachments.length > 0) {
      payload.attachments = attachments;
    }
    const { data, error } = await client.emails.send(payload);
    if (error) {
      logger.error("Resend email failed:", error);
      throw new Error(`Email delivery failed: ${error.message ?? "unknown"}`);
    }
    return { id: data?.id, skipped: false };
  }

  return {
    send,
    sendWelcomeEmail: (user) => sendWelcomeEmail(send, user),
    sendOrderReceipt: (params) => sendOrderReceipt(send, params),
  };
}

// Default singleton for production paths.
let _defaultSender = null;
function defaultSender() {
  if (!_defaultSender) _defaultSender = createEmailSender();
  return _defaultSender;
}

export async function sendWelcomeEmail(sendOrSender, maybeUser) {
  const sendFn = typeof sendOrSender === "function"
    ? sendOrSender
    : (payload) => defaultSender().send(payload);
  const user = typeof sendOrSender === "function" ? maybeUser : sendOrSender;

  const email = resolveEmail(user);
  if (!email) {
    console.warn("sendWelcomeEmail: no email address on user");
    return { skipped: true };
  }
  const firstName = resolveFirstName(user);

  const subject = "Welcome to WhoopGO! 🌍";
  const text = [
    `Hey${firstName ? " " + firstName : ""},`,
    "",
    "Thanks for joining WhoopGO! — instant eSIMs for global travelers.",
    "",
    "What you can do next:",
    "• Browse eSIM plans by country or region",
    "• Chat with our AI travel advisor for a personal recommendation",
    "• Activate your eSIM in seconds the moment you land",
    "",
    `Start here: ${SITE_URL}`,
    "",
    "Questions? Just reply to this email.",
    "",
    "— The WhoopGO! team",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:${BRAND.bgSoft};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${BRAND.text};">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
      <div style="height:4px;background:linear-gradient(90deg,${BRAND.orange} 0%,${BRAND.blue} 100%);border-radius:2px;margin-bottom:32px;"></div>
      <h1 style="font-size:28px;font-weight:900;margin:0 0 8px;color:${BRAND.text};">Welcome to WhoopGO!</h1>
      <p style="font-size:16px;color:${BRAND.muted};margin:0 0 28px;line-height:1.5;">
        Hey${firstName ? " " + escapeHtml(firstName) : ""} — glad you're here. Instant eSIMs for every country you land in.
      </p>
      <div style="background:white;border-radius:12px;padding:24px;margin-bottom:24px;border:1px solid #eee;">
        <h2 style="font-size:16px;margin:0 0 16px;color:${BRAND.text};">What you can do next</h2>
        <ul style="margin:0;padding:0 0 0 18px;color:${BRAND.muted};line-height:1.8;font-size:14px;">
          <li>Browse plans by country or region</li>
          <li>Chat with our AI advisor for a personal recommendation</li>
          <li>Activate in seconds the moment you land</li>
        </ul>
      </div>
      <div style="text-align:center;margin:32px 0;">
        <a href="${SITE_URL}" style="display:inline-block;background:${BRAND.orange};color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
          Browse eSIM plans
        </a>
      </div>
      <p style="font-size:12px;color:${BRAND.subtle};text-align:center;margin-top:40px;line-height:1.6;">
        Questions? Just reply to this email.<br />
        WhoopGO! · Instant eSIM for global travelers · ${SITE_URL}
      </p>
    </div>
  </body>
</html>`;

  return sendFn({ to: email, subject, html, text });
}

export async function sendOrderReceipt(sendOrSender, maybeParams) {
  const sendFn = typeof sendOrSender === "function"
    ? sendOrSender
    : (payload) => defaultSender().send(payload);
  const params = typeof sendOrSender === "function" ? maybeParams : sendOrSender;

  const { user, plan, country, qrCode, iccid, activationCode, amountCents, currency = "usd", sessionId } = params ?? {};

  const email = resolveEmail(user) ?? params?.email;
  if (!email) {
    console.warn("sendOrderReceipt: no recipient email");
    return { skipped: true };
  }
  const firstName = resolveFirstName(user);
  const planName = plan?.name ?? plan?.planName ?? "eSIM";
  const planData = plan?.data ?? "";
  const planDuration = plan?.duration ?? "";
  const priceStr = typeof amountCents === "number"
    ? `${currency.toUpperCase()} ${(amountCents / 100).toFixed(2)}`
    : null;

  const subject = `Your WhoopGO! eSIM is ready — ${planName}`;
  const lpaLine = activationCode && activationCode.startsWith("LPA:")
    ? `Manual activation code: ${activationCode}\n`
    : null;

  const text = [
    `Hey${firstName ? " " + firstName : ""},`,
    "",
    `Your ${planName} eSIM is provisioned and ready.`,
    "",
    `Plan:     ${planName}${planData ? " · " + planData : ""}${planDuration ? " · " + planDuration : ""}`,
    country ? `Country:  ${country}` : null,
    iccid ? `ICCID:    ${iccid}` : null,
    priceStr ? `Paid:     ${priceStr}` : null,
    sessionId ? `Order:    ${sessionId}` : null,
    "",
    "Activate in 3 steps:",
    "1. Settings → Mobile/Cellular → Add eSIM",
    "2. Scan the QR code in the attached image",
    "3. Select WhoopGO! as your data plan when roaming",
    "",
    lpaLine,
    `View your order: ${SITE_URL}/account/orders`,
    "",
    "— The WhoopGO! team",
  ].filter(Boolean).join("\n");

  const qrBlock = qrCode
    ? `<div style="background:${BRAND.bgSoft};border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
         <p style="margin:0 0 12px;font-size:14px;color:${BRAND.muted};font-weight:600;">Scan to activate</p>
         <img src="${qrCode}" alt="eSIM QR code" width="220" style="display:block;margin:0 auto;border-radius:8px;" />
         ${iccid ? `<p style="font-size:11px;color:${BRAND.subtle};margin:12px 0 0;">ICCID: ${escapeHtml(iccid)}</p>` : ""}
         ${activationCode && activationCode.startsWith("LPA:") ? `<p style="font-size:11px;color:${BRAND.subtle};margin:6px 0 0;word-break:break-all;">Manual: ${escapeHtml(activationCode)}</p>` : ""}
       </div>`
    : `<p style="color:${BRAND.muted};font-size:14px;">Your QR code will arrive in a follow-up email shortly.</p>`;

  const receiptRows = [
    ["Plan", `${escapeHtml(planName)}${planData ? " · " + escapeHtml(planData) : ""}${planDuration ? " · " + escapeHtml(planDuration) : ""}`],
    country ? ["Country", escapeHtml(country)] : null,
    priceStr ? ["Paid", escapeHtml(priceStr)] : null,
    sessionId ? ["Order", escapeHtml(sessionId)] : null,
  ].filter(Boolean);

  const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:${BRAND.bgSoft};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${BRAND.text};">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
      <div style="height:4px;background:linear-gradient(90deg,${BRAND.orange} 0%,${BRAND.blue} 100%);border-radius:2px;margin-bottom:32px;"></div>
      <h1 style="font-size:26px;font-weight:900;margin:0 0 8px;color:${BRAND.text};">Your eSIM is ready 🎉</h1>
      <p style="font-size:15px;color:${BRAND.muted};margin:0 0 24px;line-height:1.5;">
        Hey${firstName ? " " + escapeHtml(firstName) : ""} — your ${escapeHtml(planName)} plan is provisioned. Scan the QR below to activate.
      </p>
      ${qrBlock}
      <div style="background:white;border-radius:12px;padding:20px 24px;margin:24px 0;border:1px solid #eee;">
        <h2 style="font-size:13px;margin:0 0 12px;color:${BRAND.subtle};text-transform:uppercase;letter-spacing:0.5px;">Receipt</h2>
        <table style="width:100%;font-size:14px;color:${BRAND.text};border-collapse:collapse;">
          ${receiptRows.map(([k, v]) => `<tr><td style="padding:6px 0;color:${BRAND.muted};width:90px;">${k}</td><td style="padding:6px 0;font-weight:600;">${v}</td></tr>`).join("")}
        </table>
      </div>
      <h3 style="font-size:15px;margin:28px 0 12px;">How to activate</h3>
      <ol style="color:${BRAND.muted};line-height:1.8;padding-left:20px;font-size:14px;margin:0 0 24px;">
        <li>Settings → Mobile/Cellular → Add eSIM</li>
        <li>Scan the QR code above</li>
        <li>Select WhoopGO! as your data plan when roaming</li>
      </ol>
      <div style="text-align:center;margin:32px 0;">
        <a href="${SITE_URL}/account/orders" style="display:inline-block;background:${BRAND.orange};color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
          View order
        </a>
      </div>
      <p style="font-size:12px;color:${BRAND.subtle};text-align:center;margin-top:40px;line-height:1.6;">
        Questions? Reply to this email.<br />
        WhoopGO! · ${SITE_URL}
      </p>
    </div>
  </body>
</html>`;

  return sendFn({ to: email, subject, html, text });
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function resolveEmail(user) {
  if (!user) return null;
  if (typeof user === "string") return user;
  if (user.email) return user.email;
  const primary = user.email_addresses?.[0]?.email_address;
  if (primary) return primary;
  return null;
}

function resolveFirstName(user) {
  if (!user || typeof user === "string") return null;
  return user.first_name ?? user.firstName ?? null;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
