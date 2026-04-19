import { Queue } from "bullmq";
import { redis } from "./redis";

/* ============================= */
/* LEAD GENERATION QUEUE         */
/* ============================= */
export const leadQueue = new Queue("lead-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 2,
    removeOnComplete: true,
    removeOnFail: false,
  },
});

/* ============================= */
/* EMAIL QUEUE                   */
/* ============================= */
export const emailQueue = new Queue("email-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    removeOnComplete: true,
  },
});