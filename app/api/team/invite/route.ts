import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, workspaceId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" });
  }

  await prisma.user.update({
    where: { email },
    data: { workspaceId },
  });

  return NextResponse.json({ success: true });
}