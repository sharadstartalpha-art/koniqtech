import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team || team.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await prisma.team.update({
    where: { id: teamId },
    data: { name },
  });

  return NextResponse.json({ success: true });
}

// ✅ DELETE TEAM
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await context.params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ get DB user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team || team.ownerId !== user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    // 🔥 IMPORTANT: delete relations first
    await prisma.teamMember.deleteMany({
      where: { teamId },
    });

    await prisma.teamInvite.deleteMany({
      where: { teamId },
    });

    // ✅ now delete team
    await prisma.team.delete({
      where: { id: teamId },
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("DELETE TEAM ERROR:", err);

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}