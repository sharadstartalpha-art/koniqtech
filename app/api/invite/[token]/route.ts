import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Please login first" },
        { status: 401 }
      );
    }

    // ✅ find invite
    const invite = await prisma.teamInvite.findUnique({
      where: { token },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Invalid invite" },
        { status: 404 }
      );
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invite expired" },
        { status: 400 }
      );
    }

    // ✅ find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please register." },
        { status: 400 }
      );
    }

    // ✅ already member check
    const existing = await prisma.teamMember.findFirst({
      where: {
        teamId: invite.teamId,
        userId: user.id,
      },
    });

    if (!existing) {
      await prisma.teamMember.create({
        data: {
          teamId: invite.teamId,
          userId: user.id,
          role: "MEMBER",
        },
      });
    }

    // ✅ delete invite after use
    await prisma.teamInvite.delete({
      where: { id: invite.id },
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("INVITE ACCEPT ERROR:", err);

    return NextResponse.json(
      { error: "Failed to join team" },
      { status: 500 }
    );
  }
}