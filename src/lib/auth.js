import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "tutorium_session";
export const SESSION_MAX_AGE = 60 * 60 * 8;

// Keep the current prototype credentials as requested. This module is server-only.
export const ADMIN_EMAIL = "admin@tutorium.com";
export const ADMIN_PASSWORD = "admin@tutorium.com";

const SESSION_SECRET =
  process.env.AUTH_SESSION_SECRET ||
  "tutorium-local-admin-session-secret-change-before-production";

function sign(value) {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

export function createSessionToken() {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (!token) return false;

  const [payload, signature, ...extra] = token.split(".");
  if (!payload || !signature || extra.length > 0) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
