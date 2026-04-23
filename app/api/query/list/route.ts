import { prisma } from "@/lib/prisma";
import { searchLeads } from "@/lib/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const q = searchParams.get("q") || "";

  // ✅ REQUIRED fields
  const userId = "demo-user";
  const teamId = "demo-team";
  const projectId = "demo-project";

  console.log("🚀 API /query/list hit");
  console.log("🔎 Query:", q);

  let freshResults: any[] = [];
  let queryRecord: any = null;

  if (q) {
    try {
      // 🔍 Fetch SERPER
      freshResults = await searchLeads(q);
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
      }

      // 🔥 SAVE LEADS (FINAL FIX)
      for (const item of freshResults) {
        try {
          await prisma.lead.create({
            data: {
              name: item.name || "",
              company: item.name || "",
              website: item.website || "",

              // ✅ REQUIRED fields
              userId,
              teamId,
              projectId,

              // ✅ FK instead of relation
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

  // ✅ Fetch leads
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
    leads,
    total,
  });
}