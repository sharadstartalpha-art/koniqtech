import { checkCredits } from "@/lib/checkCredits";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });

  // ✅ CHECK credits BEFORE action
  await checkCredits(user!.id, 1);

  // 🔥 YOUR AI LEAD GENERATION LOGIC HERE

  // ✅ DEDUCT credits AFTER success
  await prisma.userCredits.update({
    where: { userId: user!.id },
    data: {
      balance: { decrement: 1 },
    },
  });

  return NextResponse.json({ success: true });
}