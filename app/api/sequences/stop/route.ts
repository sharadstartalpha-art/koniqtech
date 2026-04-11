import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  // ❌ cancel all pending emails
  await prisma.emailQueue.updateMany({
    where: {
      email,
      status: "PENDING",
    },
    data: {
      status: "CANCELLED",
      stopped: true,
    },
  });

  return NextResponse.json({ stopped: true });
}