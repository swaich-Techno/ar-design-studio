const KNOWN_INSECURE_SECRETS = new Set([
  "local-ar-design-studio-secret-change-me",
  "dev-only-session-secret",
  "changeme",
  "secret"
]);

export function isProductionRuntime() {
  const vercelEnv = String(process.env.VERCEL_ENV || "");
  return process.env.NODE_ENV === "production" || vercelEnv === "production" || vercelEnv === "preview";
}

export function readAuthSecret() {
  return String(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "").trim();
}

export function getAuthSecret() {
  const secret = readAuthSecret();
  const prod = isProductionRuntime();
  if (prod) {
    if (!secret || KNOWN_INSECURE_SECRETS.has(secret.toLowerCase()) || KNOWN_INSECURE_SECRETS.has(secret)) {
      const error = new Error("AUTH_SECRET is not configured");
      error.code = "AUTH_SECRET_MISSING";
      throw error;
    }
    return secret;
  }
  if (secret && !KNOWN_INSECURE_SECRETS.has(secret)) return secret;
  return "dev-only-session-secret";
}
