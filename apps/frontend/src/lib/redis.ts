// lib/redis.ts
//
// ioredis is the most production-hardened Redis client for Node.js.
// Same singleton pattern as Prisma — avoids creating new connections
// on every hot-reload in dev.

import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const client = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    // Retry strategy: wait 500ms before retrying, max 3 retries
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 500, 2000),
  });

  client.on("error", (err) => {
    console.error("[Redis] Connection error:", err);
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

// ─── Cache helpers ───────────────────────────────────────────────

/** Fetch from Redis cache or compute and store the result. */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached) as T;

  const fresh = await fetcher();
  await redis.setex(key, ttlSeconds, JSON.stringify(fresh));
  return fresh;
}

/** Delete a cache key — call this after write operations. */
export async function invalidate(key: string): Promise<void> {
  await redis.del(key);
}