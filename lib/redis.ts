import { Redis } from "ioredis";

const isBuild = process.env.NEXT_PHASE === "phase-production-build";

export const redis = isBuild
  ? ({} as any) // 🚫 disable during build
  : new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");