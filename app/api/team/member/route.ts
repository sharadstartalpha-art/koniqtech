import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { memberId } = await req.json();

  const member = await prisma.teamMember.findUnique({
    where: { id: memberId },
    include: { team: true },
  });

  if (!member) {
    return NextResponse.json({ error: "Not found" });
  }

  // 🔥 Only OWNER can remove
  if (member.team.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await prisma.teamMember.delete({
    where: { id: memberId },
  });

  return NextResponse.json({ success: true });
}