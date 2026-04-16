import { Queue } from "bullmq";
import { redis } from "./redis";

export const campaignQueue = new Queue("campaign-queue", {
  connection: redis,
});