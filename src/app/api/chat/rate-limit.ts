import "server-only";

/**
 * In-memory token buckets. Good enough for a single standalone container; if
 * the site ever runs several replicas, each gets its own budget.
 */
type Bucket = { tokens: number; updated: number };

function createLimiter(capacity: number, refillPerSecond: number, maxKeys = 5000) {
  const buckets = new Map<string, Bucket>();
  return (key: string): boolean => {
    const now = Date.now();
    let b = buckets.get(key);
    if (!b) {
      if (buckets.size >= maxKeys) {
        // Drop the oldest entries (Map keeps insertion order).
        for (const k of buckets.keys()) {
          buckets.delete(k);
          if (buckets.size < maxKeys * 0.9) break;
        }
      }
      b = { tokens: capacity, updated: now };
      buckets.set(key, b);
    }
    b.tokens = Math.min(capacity, b.tokens + ((now - b.updated) / 1000) * refillPerSecond);
    b.updated = now;
    if (b.tokens < 1) return false;
    b.tokens -= 1;
    return true;
  };
}

/** Per visitor: burst of 8 messages, then one every 15 s (~4/min). */
export const allowIp = createLimiter(8, 1 / 15);
/** Whole site: burst of 60, then ~1 message per second — a cost ceiling if someone floods from many IPs. */
export const allowGlobal = createLimiter(60, 1, 1);

export function clientIp(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
