import { Queue } from "bullmq";
import { redis } from "./redis";

// 🚀 Campaign Queue
export const campaignQueue = new Queue("campaign-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// 📧 Email Queue (optional future scaling)
export const emailQueue = new Queue("email-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    removeOnComplete: true,
  },
});