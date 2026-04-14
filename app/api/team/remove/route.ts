import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { memberId } = await req.json();

  const member = await prisma.teamMember.findUnique({
    where: { id: memberId },
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" });
  }

  const currentUser = await prisma.teamMember.findFirst({
    where: {
      teamId: member.teamId,
      userId: session.user.id,
    },
  });

  if (!currentUser || !["OWNER", "ADMIN"].includes(currentUser.role)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  if (member.role === "OWNER") {
    return NextResponse.json({ error: "Cannot remove owner" });
  }

  await prisma.teamMember.delete({
    where: { id: memberId },
  });

  return NextResponse.json({ success: true });
}