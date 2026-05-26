import { NextResponse } from "next/server";

const SESSION_COOKIE = "ar_design_studio_session";

const PUBLIC_PREFIXES = [
  "/b/",
  "/api/public/",
  "/api/analytics/track",
  "/_next/",
  "/favicon.ico"
];

const PUBLIC_PATHS = new Set([
  "/",
  "/pricing",
  "/contact",
  "/unauthorized",
  "/forgot-password",
  "/super-admin/login",
  "/team/login",
  "/business/login",
  "/business/register",
  "/staff/login"
]);

const INTERNAL_ROLES = ["SUPER_ADMIN", "TEAM_ADMIN", "FINANCE_MANAGER", "AR_MANAGER", "SUPPORT_STAFF"];
const TEAM_ROLES = ["TEAM_ADMIN", "FINANCE_MANAGER", "AR_MANAGER", "SUPPORT_STAFF"];
const BUSINESS_ROLES = ["BUSINESS_OWNER", "BUSINESS_MANAGER"];
const STAFF_ROLES = ["BUSINESS_MANAGER", "BUSINESS_STAFF", "STAFF"];

function getAuthSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "local-ar-design-studio-secret-change-me";
}

function base64UrlToBytes(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function decodeBase64UrlJson(value) {
  const bytes = base64UrlToBytes(value);
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function verifySession(token) {
  try {
    if (!token) return null;
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return null;

    const decodedHeader = decodeBase64UrlJson(header);
    if (decodedHeader.alg !== "HS256") return null;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(getAuthSecret()),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(signature),
      new TextEncoder().encode(`${header}.${payload}`)
    );
    if (!valid) return null;

    const session = decodeBase64UrlJson(payload);
    if (session.exp && session.exp * 1000 < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

function isPublic(path) {
  if (PUBLIC_PATHS.has(path)) return true;
  return PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function redirectTo(path, request) {
  return NextResponse.redirect(new URL(path, request.url));
}

function loginFor(path) {
  if (path.startsWith("/super-admin")) return "/super-admin/login";
  if (path.startsWith("/team")) return "/team/login";
  if (path.startsWith("/staff")) return "/staff/login";
  return "/business/login";
}

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  if (isPublic(path)) {
    return NextResponse.next();
  }

  const isProtected =
    path.startsWith("/super-admin") ||
    path.startsWith("/team") ||
    path.startsWith("/business/dashboard") ||
    path.startsWith("/business/profile") ||
    path.startsWith("/business/products") ||
    path.startsWith("/business/qrs") ||
    path.startsWith("/business/tables") ||
    path.startsWith("/business/campaigns") ||
    path.startsWith("/business/staff") ||
    path.startsWith("/business/analytics") ||
    path.startsWith("/business/leads") ||
    path.startsWith("/business/reports") ||
    path.startsWith("/business/billing") ||
    path.startsWith("/business/settings") ||
    path.startsWith("/staff");

  if (!isProtected) return NextResponse.next();

  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return redirectTo(loginFor(path), request);

  if (path.startsWith("/super-admin") && !INTERNAL_ROLES.includes(session.role)) {
    return redirectTo("/unauthorized", request);
  }

  if (path.startsWith("/team") && !TEAM_ROLES.includes(session.role)) {
    return redirectTo("/unauthorized", request);
  }

  if (path.startsWith("/business") && !BUSINESS_ROLES.includes(session.role)) {
    return redirectTo("/unauthorized", request);
  }

  if (path.startsWith("/staff") && !STAFF_ROLES.includes(session.role)) {
    return redirectTo("/unauthorized", request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"]
};
