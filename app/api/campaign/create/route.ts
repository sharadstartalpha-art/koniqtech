import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // ✅ FIX: get session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, subject, content, teamId } = await req.json();

    if (!name || !subject || !content) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        subject,
        content,
        userId: session.user.id, // ✅ NOW WORKS
        teamId: teamId || null,  // ✅ optional
      },
    });

    return NextResponse.json(campaign);

  } catch (err) {
    console.error("CREATE CAMPAIGN ERROR:", err);

    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}