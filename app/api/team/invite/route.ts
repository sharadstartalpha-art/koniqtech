import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, workspaceId } = await req.json();

  await prisma.invite.create({
    data: {
      email,
      workspaceId,
      role: "TEAM",
    },
  });

  return NextResponse.json({ success: true });
}