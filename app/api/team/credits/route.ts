import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { teamId, amount } = await req.json();

  if (!teamId || !amount) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  await prisma.team.update({
    where: { id: teamId },
    data: {
      credits: { increment: amount },
    },
  });

  return NextResponse.json({ success: true });
}