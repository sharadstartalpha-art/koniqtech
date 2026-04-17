import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { sendInviteEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, teamId } = await req.json();

    if (!email || !teamId) {
      return NextResponse.json(
        { error: "Email and teamId required" },
        { status: 400 }
      );
    }

    // ✅ Check team ownership
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team || team.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Not allowed" },
        { status: 403 }
      );
    }

    // ✅ Already member?
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        user: { email },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "User already in team" },
        { status: 400 }
      );
    }

    // ✅ Already invited?
    const existingInvite = await prisma.teamInvite.findFirst({
      where: { email, teamId },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: "Invite already sent" },
        { status: 400 }
      );
    }

    // 🔐 Create token
    const token = randomBytes(32).toString("hex");

    await prisma.teamInvite.create({
      data: {
        email,
        teamId,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      },
    });

    // 📩 Send email
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${token}`;

    await sendInviteEmail(email, link);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("INVITE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to send invite" },
      { status: 500 }
    );
  }
}