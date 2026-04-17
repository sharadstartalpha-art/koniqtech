import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json([]);
  }

  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId");

  const campaigns = await prisma.campaign.findMany({
    where: {
      userId: session.user.id,
      ...(teamId ? { teamId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(campaigns);
}