import { Queue } from "bullmq";
import IORedis from "ioredis";

// ==============================
// 🔌 REDIS CONNECTION
// ==============================
export const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
});

// ==============================
// ⚙️ DEFAULT OPTIONS
// ==============================
const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential" as const,
    delay: 3000,
  },
  removeOnComplete: true,
  removeOnFail: false,
};

// ==============================
// 🚀 LEAD GENERATION QUEUE
// ==============================
export const leadQueue = new Queue("lead-queue", {
  connection,
  defaultJobOptions,
});

// ==============================
// 📧 EMAIL QUEUE
// ==============================
export const emailQueue = new Queue("email-queue", {
  connection,
  defaultJobOptions,
});

// ==============================
// 🕷 SCRAPE QUEUE
// ==============================
export const scrapeQueue = new Queue("scrape", {
  connection,
  defaultJobOptions,
});

// ==============================
// ✨ ENRICH QUEUE
// ==============================
export const enrichQueue = new Queue("enrich", {
  connection,
  defaultJobOptions,
});

// ==============================
// 🧹 DEDUP QUEUE
// ==============================
export const dedupQueue = new Queue("dedup", {
  connection,
  defaultJobOptions,
});