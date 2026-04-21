// workers/scrapeWorker.ts

import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";
import { searchLeads } from "@/lib/search";

// ==============================
// 🔧 TYPE (fix for TS error)
// ==============================
type LeadResult = {
  name?: string;
  profileUrl?: string;
  email?: string;
  company?: string;
  location?: string;
};

// ==============================
// 🔌 REDIS CONNECTION
// ==============================
const connection = getRedis();

if (!connection) {
  throw new Error("❌ Redis not available");
}

// ==============================
// 🚀 WORKER
// ==============================
new Worker(
  "scrape",
  async (job) => {
    const { queryId, text, userId } = job.data;

    console.log("🔥 SCRAPE JOB:", job.data);

    if (!userId) throw new Error("Missing userId");

    try {
      // 🚀 mark running
      await prisma.query.update({
        where: { id: queryId },
        data: { scrapeStatus: "running" },
      });

      // 🔍 search
      const results: LeadResult[] = await searchLeads(text);

      console.log("📊 Total results:", results.length);

      // 🔥 filter LinkedIn only (FIXED TYPE)
      const filtered = results.filter((r: LeadResult) =>
        r.profileUrl?.includes("linkedin.com")
      );

      console.log("🎯 Filtered:", filtered.length);

      // 💾 save leads
      for (const item of filtered) {
        try {
          await prisma.lead.create({
            data: {
              name: item.name || "Unknown",
              profileUrl: item.profileUrl || null,
              email: item.email || null,
              company: item.company || null,
              location: item.location || null,

              queryId,
              userId,
              teamId: "default",
              projectId: "default",

              source: "search",
            },
          });
        } catch (err) {
          console.log("⚠️ Duplicate skipped");
        }
      }

      // ✅ done
      await prisma.query.update({
        where: { id: queryId },
        data: { scrapeStatus: "done" },
      });

      console.log("✅ SCRAPE DONE:", queryId);

      return true;

    } catch (err) {
      console.error("❌ Worker error:", err);

      await prisma.query.update({
        where: { id: queryId },
        data: { scrapeStatus: "failed" },
      });

      throw err;
    }
  },
  {
    connection,
    concurrency: 2,
  }
);