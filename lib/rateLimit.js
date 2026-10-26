const buckets = new Map();
const MAX_KEYS = 8000;

export const LIMITS = {
  login: { limit: 5, windowMs: 15 * 60 * 1000 },
  register: { limit: 3, windowMs: 60 * 60 * 1000 },
  contact: { limit: 5, windowMs: 15 * 60 * 1000 },
  upload: { limit: 20, windowMs: 15 * 60 * 1000 },
  publicWrite: { limit: 40, windowMs: 10 * 60 * 1000 },
  forgot: { limit: 5, windowMs: 15 * 60 * 1000 }
};

export function clientIp(request) {
  const forwarded = request?.headers?.get?.("x-forwarded-for") || "";
  const first = forwarded.split(",")[0].trim();
  return first || request?.headers?.get?.("x-real-ip") || "unknown";
}

function prune(now) {
  if (buckets.size < MAX_KEYS) return;
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
    if (buckets.size < MAX_KEYS / 2) break;
  }
  if (buckets.size >= MAX_KEYS) {
    const oldest = buckets.keys().next().value;
    if (oldest) buckets.delete(oldest);
  }
}

export function rateLimit(key, { limit, windowMs } = LIMITS.publicWrite) {
  const now = Date.now();
  prune(now);
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSec: Math.ceil(windowMs / 1000) };
  }
  if (bucket.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
    };
  }
  bucket.count += 1;
  return {
    ok: true,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
  };
}

export function tooMany(retryAfterSec = 60) {
  return {
    status: 429,
    body: { error: "Too many attempts. Please try again shortly." },
    headers: { "Retry-After": String(retryAfterSec) }
  };
}
