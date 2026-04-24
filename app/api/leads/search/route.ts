import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 25);

  const hasEmail = searchParams.get("hasEmail");
  const minScore = Number(searchParams.get("minScore") || 0);
  const country = searchParams.get("country");

  const where: any = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { company: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},

      hasEmail === "true" ? { email: { not: null } } : {},

      country ? { country } : {},

      { score: { gte: minScore } },
    ],
  };

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { score: "desc" }, // 🔥 MOST IMPORTANT
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.lead.count({ where });

  return NextResponse.json({
    data: leads,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}