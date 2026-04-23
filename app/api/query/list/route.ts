import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  console.log("🚀 API /query/list hit");

  const [queries, total] = await Promise.all([
    prisma.query.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.query.count(),
  ]);

  return Response.json({
    queries,
    total,
  });
}