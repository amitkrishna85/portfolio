// In-memory rate limiter for login and contact form actions
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes default
): { success: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record || now > record.resetAt) {
    memoryStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: limit - 1, resetInSec: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= limit) {
    const resetInSec = Math.ceil((record.resetAt - now) / 1000);
    return { success: false, remaining: 0, resetInSec };
  }

  record.count += 1;
  const resetInSec = Math.ceil((record.resetAt - now) / 1000);
  return { success: true, remaining: limit - record.count, resetInSec };
}
