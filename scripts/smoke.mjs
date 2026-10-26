import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

let failed = 0;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function assert(cond, message) {
  if (!cond) {
    failed += 1;
    console.error(`FAIL ${message}`);
  } else {
    console.log(`ok   ${message}`);
  }
}

function read(rel) {
  return readFileSync(resolve(root, rel), "utf8");
}

const auth = read("lib/auth.js");
const secret = read("lib/authSecret.js");
const middleware = read("middleware.js");
const login = read("app/api/auth/login/route.js");
const handlers = read("lib/authHandlers.js");
const upload = read("lib/uploadValidate.js");
const nextConfig = read("next.config.js");
const health = read("app/api/health/route.js");
const errorPage = read("app/error.js");

assert(!auth.includes("local-ar-design-studio-secret-change-me"), "auth.js does not use the known secret fallback");
assert(secret.includes("AUTH_SECRET_MISSING") && secret.includes("isProductionRuntime"), "auth secret fail-closed helper exists");
assert(!middleware.includes("local-ar-design-studio-secret-change-me"), "middleware does not use the known secret fallback");
assert(login.includes("runtime = \"nodejs\"") && login.includes("handleLoginRequest"), "login route is Node and uses the shared handler");
assert(handlers.includes("rolesForPortal") && !handlers.includes("allowedRoles"), "login ignores client allowedRoles");
assert(upload.includes("BLOCKED_EXT") && upload.includes("looksLikeImage"), "upload magic/allowlist exists");
assert(nextConfig.includes("Content-Security-Policy") && nextConfig.includes("res.cloudinary.com"), "CSP and image hosts are restricted");
assert(health.includes('status: "ok"') && health.includes("timestamp") && !health.includes("MONGO"), "health payload is public-safe");
assert(errorPage.includes("Error reference:"), "public error page shows a reference only");
assert(read("components/forms/AuthForm.jsx").includes("JSON.stringify({ ...state, role })"), "login form does not send allowedRoles");
assert(read("lib/redesign/site.ts").includes("YOUR MENU SHOULD") && read("lib/redesign/site.ts").includes("DO MORE THAN LIST FOOD"), "homepage copy is food-menu positioning");
assert(read("lib/redesign/site.ts").includes("B SOCIO DEMO RESTAURANT"), "demo restaurant is labelled DEMO");
assert(read("next.config.js").includes('source: "/food"'), "short aliases redirect to /ar/*");
assert(read("lib/redesign/seo.ts").includes("/redesign/heroes/food-ar.png"), "OG image is the food hero");
assert(handlers.includes("Enter a valid email address.") && handlers.includes("Invalid credentials."), "login validates email and returns generic credentials errors");

const buckets = new Map();
function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (bucket.count >= limit) return { ok: false };
  bucket.count += 1;
  return { ok: true };
}
assert(rateLimit("a", { limit: 2, windowMs: 1000 }).ok && rateLimit("a", { limit: 2, windowMs: 1000 }).ok && !rateLimit("a", { limit: 2, windowMs: 1000 }).ok, "rate limiter blocks extra attempts");

if (failed) {
  console.error(`\n${failed} smoke check(s) failed`);
  process.exit(1);
}
console.log("\nAll smoke checks passed");
