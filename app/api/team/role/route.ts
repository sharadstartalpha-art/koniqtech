import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { memberId, role } = await req.json();

  await prisma.teamMember.update({
    where: { id: memberId },
    data: { role },
  });

  return NextResponse.json({ success: true });
}