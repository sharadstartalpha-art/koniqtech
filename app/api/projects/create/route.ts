import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { checkUsage, deductCredits } from "@/lib/usage";
import { requireTeamMember } from "@/lib/teamGuard";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, activeTeamId } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" });
  }

  const product = await prisma.product.findFirst();

  if (!product) {
    return NextResponse.json({ error: "No product found" });
  }

  try {
    // 🔐 TEAM ACCESS CHECK (only if team used)
    if (activeTeamId) {
      await requireTeamMember(user.id, activeTeamId);
    }

    // 🔥 CHECK CREDITS
    await checkUsage(user.id, 1, activeTeamId);

    // 🚀 CREATE PROJECT
    const project = await prisma.project.create({
      data: {
        name,
        userId: user.id,
        productId: product.id,
        teamId: activeTeamId || null, // 🔥 multi-tenant support
      },
    });

    // 💳 DEDUCT CREDITS
    await deductCredits(user.id, 1, "PROJECT_CREATE", activeTeamId);

    // 📊 ACTIVITY LOG
    await logActivity(
      user.id,
      "PROJECT_CREATED",
      `Created project ${name}`,
      activeTeamId
    );

    return NextResponse.json(project);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 400 }
    );
  }
}