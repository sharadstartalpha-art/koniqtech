import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";
import { searchLeads } from "@/lib/search";

type LeadResult = {
  name?: string;
  profileUrl?: string;
  email?: string;
  company?: string;
  location?: string;
  website?: string;
};

const connection = getRedis();

if (!connection) {
  throw new Error("❌ Redis not available");
}

console.log("🚀 Scrape Worker Started");

new Worker(
  "scrape",
  async (job) => {
    const { queryId, text, userId } = job.data;

    console.log("🔥 SCRAPE JOB:", job.data);

    if (!userId) throw new Error("Missing userId");

    try {
      await prisma.query.update({
        where: { id: queryId },
        data: { scrapeStatus: "running" },
      });

      const results: LeadResult[] = await searchLeads(text);

      console.log("📊 Total results:", results.length);

      for (const item of results) {
        try {
          // ✅ SAFE DEDUP (ONLY IF WEBSITE EXISTS)
          if (item.website) {
            const exists = await prisma.lead.findFirst({
              where: { website: item.website },
            });

            if (exists) {
              console.log("⚠️ Duplicate:", item.website);
              continue;
            }
          }

          await prisma.lead.create({
            data: {
              name: item.name || "Unknown",
              profileUrl: item.profileUrl || null,
              email: item.email || null,
              company: item.company || null,
              location: item.location || null,
              website: item.website || null,

              queryId,
              userId,
              teamId: "default",
              projectId: "default",

              source: "search",
            },
          });
        } catch (err) {
          console.log("⚠️ Lead skipped:", err);
        }
      }

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