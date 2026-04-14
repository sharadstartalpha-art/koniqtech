import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, teamId } = await req.json();

  if (!email || !teamId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // ✅ TEAM CHECK
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team || team.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  // ✅ DUPLICATE MEMBER CHECK
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

  // ✅ DUPLICATE INVITE CHECK
  const existingInvite = await prisma.teamInvite.findFirst({
    where: { email, teamId },
  });

  if (existingInvite) {
    return NextResponse.json(
      { error: "Invite already sent" },
      { status: 400 }
    );
  }

  // 🔐 TOKEN
  const token = randomBytes(32).toString("hex");

  const invite = await prisma.teamInvite.create({
    data: {
      email,
      teamId,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  // 🚀 TODO: SEND EMAIL (Resend)
  console.log(`Invite link: https://koniqtech.com/invite/${token}`);

  return NextResponse.json(invite);
}