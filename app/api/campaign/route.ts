import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // If user is not authenticated, return empty array
    if (!session?.user?.id) {
      return NextResponse.json([]);
    }

    // Fetch campaigns with recipient count
  const campaigns = await prisma.campaign.findMany({
  where: {
    userId: session.user.id,
  },
  orderBy: {
    createdAt: "desc",
  },
  include: {
    _count: {
      select: {
        recipients: true,
      },
    },
  },
});

    return NextResponse.json(campaigns);

  } catch (error) {
    console.error("GET CAMPAIGNS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}