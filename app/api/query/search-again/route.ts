import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeQueue } from "@/lib/queue";

export async function POST(req: Request) {
  const { queryId } = await req.json();

  const query = await prisma.query.findUnique({
    where: { id: queryId },
  });

  if (!query) {
    return NextResponse.json({ error: "Query not found" }, { status: 404 });
  }

  if (!scrapeQueue) {
    return NextResponse.json(
      { error: "Queue not available (Redis missing)" },
      { status: 500 }
    );
  }

  await scrapeQueue.add("scrape-job", {
    queryId,
    text: query.text,
    userId: query.userId,
  });

  return NextResponse.json({ success: true });
}