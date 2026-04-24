import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const queries = await prisma.query.findMany({
    orderBy: { createdAt: "desc" },
  });

  const data = await Promise.all(
    queries.map(async (q) => {
      const totalExpected = await prisma.lead.count({
        where: { queryId: q.id },
      });

      const processed = await prisma.lead.count({
        where: {
          queryId: q.id,
          email: { not: null }, // treated as "processed"
        },
      });

      const withCompany = await prisma.lead.count({
        where: {
          queryId: q.id,
          company: { not: null },
        },
      });

      // ✅ PROGRESS = processed / totalExpected
      const progress =
        totalExpected > 0
          ? Math.round((processed / totalExpected) * 100)
          : 0;

      return {
        ...q,
        total: totalExpected,
        withEmail: processed,
        withCompany,
        finished: processed,
        progress,
      };
    })
  );

  return NextResponse.json(data);
}