import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";
import { searchLeads } from "@/lib/search";
import { enrichQueue } from "@/lib/queue";

type LeadResult = {
  name?: string;
  title?: string;
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

    if (!userId) throw new Error("Missing userId");

    try {
      // 🔄 STATUS → RUNNING
      await prisma.query.update({
        where: { id: queryId },
        data: { scrapeStatus: "running" }, // ✅ FIXED
      });

      // 🔥 LINKEDIN QUERY
      const smartQuery = `site:linkedin.com/in ${text}`;

      const results: LeadResult[] = await searchLeads(smartQuery);

      console.log("📊 Clean results:", results.length);

      for (const item of results) {
        try {
          const conditions: any[] = [];

          if (item.email) conditions.push({ email: item.email });
          if (item.profileUrl) conditions.push({ profileUrl: item.profileUrl });
          if (item.website) conditions.push({ website: item.website });

          const exists =
            conditions.length > 0
              ? await prisma.lead.findFirst({
                  where: { OR: conditions },
                })
              : null;

          if (exists) continue;

          const score =
            (item.email ? 40 : 0) +
            (item.company ? 20 : 0) +
            (item.profileUrl ? 20 : 0) +
            (item.website ? 20 : 0);

          await prisma.lead.create({
            data: {
              name: item.name || item.title || "N/A",
              profileUrl: item.profileUrl || null,
              email: item.email || null,
              company: item.company || null,
              location: item.location || null,
              website: item.website || null,

              queryId,
              userId,
              source: "search",

              score,
              isContactable: !!item.email,
            },
          });
        } catch (err) {
          console.log("⚠️ Lead skipped:", err);
        }
      }

      // ✅ DONE
      await prisma.query.update({
        where: { id: queryId },
        data: { scrapeStatus: "done" }, // ✅ FIXED
      });

      // 🚀 ENRICH
      if (results.length > 0 && enrichQueue) {
        await enrichQueue.add("enrich-job", { queryId });
      }

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