import { Queue } from "bullmq";
import { redis } from "./redis";

export const campaignQueue = new Queue("campaign-queue", {
  connection: redis,

  // 🔥 RATE LIMIT
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});