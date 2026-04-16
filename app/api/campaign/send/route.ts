import { prisma } from "@/lib/prisma";
import { sendColdEmail } from "@/lib/mail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const leads = await prisma.lead.findMany({
      where: {
        userId: session.user.id,
      },
      take: 20, // 🔥 batch send
    });

    for (const lead of leads) {
      if (!lead.email) continue;

      await sendColdEmail(
        lead.email,
        lead.name || "there" // ✅ FIXED
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("CAMPAIGN ERROR:", err);

    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}