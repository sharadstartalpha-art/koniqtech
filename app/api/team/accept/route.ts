import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Please login first" },
      { status: 401 }
    );
  }

  const { token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 400 }
    );
  }

  const invite = await prisma.teamInvite.findUnique({
    where: { token },
  });

  // ❌ invalid / expired
  if (!invite || invite.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Invite expired or invalid" },
      { status: 400 }
    );
  }

  // ✅ already member check (VERY IMPORTANT)
  const existing = await prisma.teamMember.findFirst({
    where: {
      teamId: invite.teamId,
      userId: session.user.id,
    },
  });

  if (existing) {
    return NextResponse.json({ success: true });
  }

  // ✅ create member
  await prisma.teamMember.create({
    data: {
      userId: session.user.id,
      teamId: invite.teamId,
      role: invite.role || "MEMBER",
    },
  });

  // ❌ delete invite
  await prisma.teamInvite.delete({
    where: { id: invite.id },
  });

  return NextResponse.json({ success: true });
}