import { NextResponse } from "next/server";
import { enrichQueue } from "@/lib/queue";

export async function POST(req: Request) {
  const { queryId } = await req.json();

  if (!enrichQueue) {
    return NextResponse.json(
      { error: "Queue not available (Redis missing)" },
      { status: 500 }
    );
  }

  await enrichQueue.add("enrich-job", { queryId });

  return NextResponse.json({ success: true });
}