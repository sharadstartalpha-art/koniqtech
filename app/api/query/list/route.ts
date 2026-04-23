import { prisma } from "@/lib/prisma";
import { searchLeads } from "@/lib/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const q = searchParams.get("q") || "";

  console.log("🚀 API /query/list hit");
  console.log("🔎 Query:", q);

  let freshResults: any[] = [];

  // 👉 Call SERPER only if query exists
  if (q) {
    try {
      freshResults = await searchLeads(q);
      console.log("✅ Fresh results:", freshResults.length);
    } catch (err) {
      console.error("❌ searchLeads failed:", err);
    }
  }

  // 👉 Existing DB results
  const [queries, total] = await Promise.all([
    prisma.query.findMany({
      where: {
        text: { contains: q, mode: "insensitive" },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.query.count({
      where: {
        text: { contains: q, mode: "insensitive" },
      },
    }),
  ]);

  return Response.json({
    queries,
    total,
    freshResults, // 🔥 new SERPER data
  });
}