import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { generateSeedQueries } from "@/lib/queryGenerator";

console.log("🌱 Seeding queries...");

export async function seedQueries() {
  const queries = generateSeedQueries();

  for (const text of queries) {
    try {
      await prisma.query.create({
        data: {
          text,
          userId: "system", // important
          teamId: "system",
          projectId: "system",
        },
      });
    } catch {
      // ignore duplicates
    }
  }

  console.log("✅ Seed complete:", queries.length);
}