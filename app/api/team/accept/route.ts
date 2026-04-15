import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await req.json();

  const invite = await prisma.teamInvite.findUnique({
    where: { token },
  });

  if (!invite || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired invite" }, { status: 400 });
  }

  // 🔥 IMPORTANT FIX: email must match
  if (invite.email !== session.user.email) {
    return NextResponse.json({ error: "This invite is not for your account" }, { status: 403 });
  }

  // ✅ prevent duplicate join
  const existing = await prisma.teamMember.findFirst({
    where: {
      userId: session.user.id,
      teamId: invite.teamId,
    },
  });

  if (!existing) {
    await prisma.teamMember.create({
      data: {
        userId: session.user.id,
        teamId: invite.teamId,
        role: invite.role || "MEMBER",
      },
    });
  }

  await prisma.teamInvite.delete({
    where: { id: invite.id },
  });

  return NextResponse.json({ success: true });
}