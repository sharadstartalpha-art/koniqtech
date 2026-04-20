import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function parseQuery(query: string) {
  const q = query.toLowerCase();

  return {
    category: q.includes("saas")
      ? "saas"
      : q.includes("restaurant")
      ? "restaurant"
      : undefined,

    title: q.includes("founder")
      ? "founder"
      : q.includes("owner")
      ? "owner"
      : undefined,

    isHiring: q.includes("hiring"),

    country: q.includes("germany")
      ? "Germany"
      : q.includes("texas")
      ? "USA"
      : undefined,

    tech: q.includes("stripe") ? "stripe" : undefined,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) return NextResponse.json([]);

    const parsed = parseQuery(query);

    const leads = await prisma.lead.findMany({
      where: {
        category: parsed.category,
        title: parsed.title
          ? { contains: parsed.title, mode: "insensitive" }
          : undefined,
        country: parsed.country,
        isHiring: parsed.isHiring || undefined,
        techStack: parsed.tech
          ? { has: parsed.tech }
          : undefined,
      },
      take: 50,
    });

    return NextResponse.json({
      query,
      parsed,
      results: leads,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Search failed" });
  }
}