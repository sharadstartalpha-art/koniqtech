import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageUsers } from "@/lib/permissions";


export async function GET() {
  const users = await prisma.user.findMany();

  return Response.json(users);
}
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !canManageUsers(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, action, value } = await req.json();

  if (action === "ban") {
    await prisma.user.update({
      where: { id: userId },
      data: { isBanned: true },
    });
  }

  if (action === "unban") {
    await prisma.user.update({
      where: { id: userId },
      data: { isBanned: false },
    });
  }

  if (action === "role") {
    await prisma.user.update({
      where: { id: userId },
      data: { role: value },
    });
  }

  if (action === "plan") {
    await prisma.user.update({
      where: { id: userId },
      data: { plan: value },
    });
  }

  return NextResponse.json({ success: true });
}