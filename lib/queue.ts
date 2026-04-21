import { Queue } from "bullmq";
import { getRedis } from "@/lib/redis";

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
// 🔌 SAFE CONNECTION
// ==============================
const connection = getRedis();

// 👉 IMPORTANT: allow null during build
function createQueue(name: string) {
  if (!connection) {
    console.warn(`⚠️ Queue "${name}" disabled (no Redis)`);
    return null;
  }

  return new Queue(name, {
    connection,
    defaultJobOptions,
  });
}

// ==============================
// 🚀 QUEUES
// ==============================
export const leadQueue = createQueue("lead-queue");
export const emailQueue = createQueue("email-queue");
export const scrapeQueue = createQueue("scrape");
export const enrichQueue = createQueue("enrich");
export const dedupQueue = createQueue("dedup");