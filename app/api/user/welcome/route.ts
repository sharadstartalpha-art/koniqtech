import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

export async function POST() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      welcomeSeen: true,
    },
  });

  return NextResponse.json({ success: true });
}