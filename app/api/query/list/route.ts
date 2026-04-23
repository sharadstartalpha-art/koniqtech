import { prisma } from "@/lib/prisma";
import { searchLeads } from "@/lib/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const q = (searchParams.get("q") || "").trim();

  // ✅ REQUIRED fields
  const userId = "demo-user";
  const teamId = "demo-team";
  const projectId = "demo-project";

  console.log("🚀 API /query/list hit");
  console.log("🔎 Query:", q);

  let queryRecord: any = null;

  // 🔥 ONLY run when query exists
  if (q.length > 0) {
    try {
      // 🔍 Fetch SERPER
      const freshResults = await searchLeads(q);
      console.log("✅ Fresh results:", freshResults.length);

      // ✅ Find or create query
      queryRecord = await prisma.query.findFirst({
        where: { text: q },
      });

      if (!queryRecord) {
        queryRecord = await prisma.query.create({
          data: {
            text: q,
            userId,
            teamId,
            projectId,
          },
        });
        console.log("💾 Query saved");
      }

      // 🔥 SAVE LEADS
      for (const item of freshResults) {
        try {
          // ✅ Dedup by website (IMPORTANT)
          if (!item.website) continue;

          const exists = await prisma.lead.findFirst({
            where: { website: item.website },
          });

          if (exists) continue;

          await prisma.lead.create({
            data: {
              name: item.name || "",
              company: item.name || "",
              website: item.website,

              userId,
              teamId,
              projectId,

              queryId: queryRecord.id,
            },
          });
        } catch {
          console.log("⚠️ Lead skipped");
        }
      }

      console.log("💾 Leads saved");

    } catch (err) {
      console.error("❌ searchLeads failed:", err);
    }
  }

  // ✅ FETCH QUERIES (for /admin/collect)
  const queries = await prisma.query.findMany({
    orderBy: { createdAt: "desc" },
  });

  // ✅ FETCH LEADS (for /admin/leads)
  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where: q
        ? {
            query: {
              text: { contains: q, mode: "insensitive" },
            },
          }
        : {},
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.lead.count({
      where: q
        ? {
            query: {
              text: { contains: q, mode: "insensitive" },
            },
          }
        : {},
    }),
  ]);

  return Response.json({
    queries, // 🔥 for collect page
    leads,   // 🔥 for leads page
    total,
  });
}