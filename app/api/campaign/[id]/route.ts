import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

/**
 * 🗑 DELETE /api/campaign/:id
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ IMPORTANT FIX
    const { id } = await context.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign || campaign.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not allowed" },
        { status: 403 }
      );
    }

    await prisma.campaign.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("DELETE CAMPAIGN ERROR:", err);

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}