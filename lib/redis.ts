import IORedis from "ioredis";

let redis: IORedis | null = null;

export function getRedis(): IORedis | null {
  // ❌ NEVER connect during build
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return null;
  }

  if (redis) return redis;

  const url = process.env.REDIS_URL;

  if (!url) {
    console.warn("⚠️ REDIS_URL not found");
    return null;
  }

  redis = new IORedis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    tls: url.startsWith("rediss://") ? {} : undefined,
  });

  return redis;
}