import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
    return NextResponse.json({ error: "Member not found" });
  }

  // ❌ prevent removing owner
  if (member.role === "OWNER") {
    return NextResponse.json({ error: "Cannot remove owner" });
  }

  // 🔐 only OWNER or ADMIN can remove
  const currentUser = await prisma.teamMember.findFirst({
    where: {
      teamId: member.teamId,
      userId: session.user.id,
    },
  });

  if (!currentUser || !["OWNER", "ADMIN"].includes(currentUser.role)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await prisma.teamMember.delete({
    where: { id: memberId },
  });

  return NextResponse.json({ success: true });
}