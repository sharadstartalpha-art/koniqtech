import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { teamId, amount } = await req.json();

  await prisma.team.update({
    where: { id: teamId },
    data: {
      credits: { increment: amount },
    },
  });

  return NextResponse.json({ success: true });
}