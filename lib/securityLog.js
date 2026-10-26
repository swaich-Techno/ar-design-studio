const REDACT = ["password", "passwordHash", "token", "secret", "authorization", "cookie", "auth_secret", "nextauth_secret"];

function redact(value, key = "") {
  if (REDACT.includes(String(key).toLowerCase())) return "[redacted]";
  if (Array.isArray(value)) return value.map((item) => redact(item));
  if (value && typeof value === "object") {
    const out = {};
    for (const [nextKey, nextValue] of Object.entries(value)) out[nextKey] = redact(nextValue, nextKey);
    return out;
  }
  return value;
}

export function logSecurity(event, details = {}) {
  console.info(
    JSON.stringify({
      level: "security",
      ts: new Date().toISOString(),
      event,
      ...redact(details)
    })
  );
}
