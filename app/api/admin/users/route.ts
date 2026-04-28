import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      subscriptions: true,
    },
  });

  const result = users.map((u) => ({
    id: u.id,
    email: u.email,
    hasAccess: u.subscriptions.some(
      (s) => s.status === "active"
    ),
  }));

  return NextResponse.json(result);
}