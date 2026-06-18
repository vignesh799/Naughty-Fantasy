import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseAuthClient } from "@/lib/supabase/server";

export const ADMIN_COOKIE = "nf_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be configured in production.");
  }
  return "naughty-fantasy-development-session-secret";
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL ?? "admin@naughtyfantasy.local",
    password: process.env.ADMIN_PASSWORD ?? "Admin123!",
  };
}

export async function verifyAdminCredentials(email: string, password: string) {
  if (isSupabaseConfigured()) {
    const supabase = createSupabaseAuthClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;
    const configuredAdminEmail = process.env.ADMIN_EMAIL;
    const hasAdminRole = data.user.app_metadata?.role === "admin";
    const matchesAdminEmail =
      configuredAdminEmail && data.user.email?.toLowerCase() === configuredAdminEmail.toLowerCase();
    await supabase.auth.signOut();
    return hasAdminRole || Boolean(matchesAdminEmail);
  }

  const credentials = getAdminCredentials();
  return safeEqual(email.toLowerCase(), credentials.email.toLowerCase()) && safeEqual(password, credentials.password);
}

export function createAdminSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = `admin:${expiresAt}`;
  return `${payload}:${sign(payload)}`;
}

export function verifyAdminSessionToken(token?: string) {
  if (!token) return false;
  const [role, expiry, signature] = token.split(":");
  if (role !== "admin" || !expiry || !signature) return false;
  const expiresAt = Number(expiry);
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return false;
  return safeEqual(signature, sign(`${role}:${expiry}`));
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
