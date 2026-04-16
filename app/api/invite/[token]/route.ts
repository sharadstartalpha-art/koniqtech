import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" });
    }

    const invite = await prisma.teamInvite.findUnique({
      where: { token },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" });
    }

    if (invite.accepted) {
      return NextResponse.json({ error: "Already accepted" });
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invite expired" });
    }

    // ✅ add user to team
    await prisma.teamMember.create({
      data: {
        teamId: invite.teamId,
        userId: session.user.id,
        role: "MEMBER",
      },
    });

    // ✅ mark invite accepted
    await prisma.teamInvite.update({
      where: { id: invite.id },
      data: { accepted: true },
    });

    return NextResponse.json({
      success: true,
      teamId: invite.teamId,
    });

  } catch (err) {
    console.error("INVITE ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}