import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teamId } = await req.json();

  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: session.user.id,
    },
  });

  if (!member || member.role !== "OWNER") {
    return NextResponse.json({ error: "Only owner can update billing" }, { status: 403 });
  }

  const memberCount = await prisma.teamMember.count({
    where: { teamId },
  });

  const pricePerSeat = 10;

  await prisma.teamSubscription.update({
    where: { teamId },
    data: {
      seats: memberCount,
      price: memberCount * pricePerSeat,
    },
  });

  return NextResponse.json({ success: true });
}