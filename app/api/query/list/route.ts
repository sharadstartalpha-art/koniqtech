import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const q = searchParams.get("q") || "";

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

  return Response.json({ queries, total });
}