import { prisma } from "@/lib/prisma";
import { searchLeads } from "@/lib/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const q = searchParams.get("q") || "";

  // ⚠️ TEMP: replace these with real values (from auth/session)
  const userId = searchParams.get("userId") || null;
  const teamId = searchParams.get("teamId") || null;
  const projectId = searchParams.get("projectId") || null;

  console.log("🚀 API /query/list hit");
  console.log("🔎 Query:", q);

  let freshResults: any[] = [];

  if (q) {
    try {
      // ✅ Call SERPER
      freshResults = await searchLeads(q);
      console.log("✅ Fresh results:", freshResults.length);

      // ✅ Save ONLY if required fields exist
      if (userId && teamId && projectId) {
        const exists = await prisma.query.findFirst({
          where: {
            text: q,
            userId,
            teamId,
            projectId,
          },
        });

        if (!exists) {
          await prisma.query.create({
            data: {
              text: q,
              userId,
              teamId,
              projectId,
            },
          });
          console.log("💾 Query saved to DB");
        } else {
          console.log("⚠️ Query already exists");
        }
      } else {
        console.log("⚠️ Missing IDs → skipping DB save");
      }

    } catch (err) {
      console.error("❌ searchLeads failed:", err);
    }
  }

  // ✅ Fetch DB results
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
    freshResults,
  });
}