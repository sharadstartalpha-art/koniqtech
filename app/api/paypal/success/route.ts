import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");
  const creditsToAdd = Number(searchParams.get("credits") || 0);

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // ✅ UPSERT credits
  await prisma.userCredits.upsert({
    where: { userId },
    update: {
      balance: {
        increment: creditsToAdd,
      },
    },
    create: {
      userId,
      balance: creditsToAdd,
    },
  });

  return NextResponse.redirect("http://localhost:3000/dashboard");
}