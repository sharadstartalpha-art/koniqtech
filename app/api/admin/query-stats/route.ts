import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const queries = await prisma.query.findMany({
    orderBy: { createdAt: "desc" },
  });

  const data = await Promise.all(
    queries.map(async (q) => {
      const total = await prisma.lead.count({
        where: { queryId: q.id },
      });

      const withEmail = await prisma.lead.count({
        where: {
          queryId: q.id,
          email: { not: null },
        },
      });

      const withCompany = await prisma.lead.count({
        where: {
          queryId: q.id,
          company: { not: null },
        },
      });

      // ✅ Define finished clearly
      const finished = withEmail;

      // ✅ FIXED progress logic (correct variables)
      const progress =
        total > 0
          ? Math.round((finished / total) * 100)
          : 0;

      return {
        ...q,
        total,
        withEmail,
        withCompany,
        finished,
        progress,
      };
    })
  );

  return NextResponse.json(data);
}