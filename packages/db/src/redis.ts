import { Redis } from '@upstash/redis';

/**
 * Create an Upstash Redis client.
 * Uses UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN from environment by default.
 */
export function createRedisClient(url?: string, token?: string) {
  const redisUrl = url ?? process.env.UPSTASH_REDIS_URL;
  const redisToken = token ?? process.env.UPSTASH_REDIS_TOKEN;
  if (!redisUrl || !redisToken) {
    throw new Error('UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN are required.');
  }
  return new Redis({ url: redisUrl, token: redisToken });
}

// ─── Helper Functions ─────────────────────────────────────

export async function cacheGet<T>(redis: Redis, key: string): Promise<T | null> {
  return redis.get<T>(key);
}

export async function cacheSet(redis: Redis, key: string, value: unknown, ttlSeconds: number = 3600): Promise<void> {
  await redis.set(key, value, { ex: ttlSeconds });
}

/**
 * Increment daily usage counter for a user.
 * Key format: usage:{userId}:{YYYY-MM-DD}:{metric}
 */
export async function incrementUsage(
  redis: Redis,
  userId: string,
  metric: 'ai_requests' | 'tokens_used',
  amount: number = 1,
): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const key = `usage:${userId}:${today}:${metric}`;
  const result = await redis.incrby(key, amount);
  // Auto-expire at midnight + 1 hour buffer
  await redis.expire(key, 90_000);
  return result;
}

/**
 * Check if a user is within their rate limit.
 */
export async function checkRateLimit(
  redis: Redis,
  userId: string,
  metric: 'ai_requests' | 'tokens_used',
  limit: number,
): Promise<{ allowed: boolean; current: number; remaining: number }> {
  const today = new Date().toISOString().slice(0, 10);
  const key = `usage:${userId}:${today}:${metric}`;
  const current = (await redis.get<number>(key)) ?? 0;
  return {
    allowed: current < limit,
    current,
    remaining: Math.max(0, limit - current),
  };
}
