import IORedis from "ioredis";

// 🔥 Single shared Redis connection (BullMQ compatible)
export const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null, // ✅ required for BullMQ
  enableReadyCheck: false,    // ✅ recommended for Upstash
  tls: process.env.REDIS_URL?.startsWith("rediss://")
    ? {}
    : undefined,              // ✅ only enable TLS when needed
});