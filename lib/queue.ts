import { Queue } from "bullmq";
import { getRedis } from "./redis";

const connection = getRedis();

/**
 * Safe queue creator (prevents build crash if Redis missing)
 */
function createQueue(name: string) {
  if (!connection) return null;

  return new Queue(name, { connection });
}

/* ✅ EXPORT ALL QUEUES */
export const scrapeQueue = createQueue("scrape");
export const enrichQueue = createQueue("enrich");
export const dedupQueue = createQueue("dedup");
export const emailQueue = createQueue("email-queue");
export const campaignQueue = createQueue("campaign-queue");