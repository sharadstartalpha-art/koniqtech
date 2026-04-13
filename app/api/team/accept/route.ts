import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await req.json();

  const invite = await prisma.teamInvite.findUnique({
    where: { token },
  });

  if (!invite || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired invite" }, { status: 400 });
  }

  await prisma.teamMember.create({
    data: {
      userId: session.user.id,
      teamId: invite.teamId,
      role: invite.role,
    },
  });

  // delete invite
  await prisma.teamInvite.delete({
    where: { id: invite.id },
  });

  return NextResponse.json({ success: true });
}