import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json([], { status: 200 }); // ✅ NEVER return HTML
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { projects: true },
  });

  return NextResponse.json(user?.projects || []);
}