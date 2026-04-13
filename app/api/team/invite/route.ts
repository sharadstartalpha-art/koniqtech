import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/prisma";
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

  // check if user is owner
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (team?.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const token = randomBytes(32).toString("hex");

  const invite = await prisma.teamInvite.create({
    data: {
      email,
      teamId,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    },
  });

  // 🔥 TEMP: log instead of email
  console.log(`Invite link: https://koniqtech.com/invite/${token}`);

  return NextResponse.json(invite);
}