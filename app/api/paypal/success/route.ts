import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST() {
  const session = await getServerSession(authOptions)

  const userId = (session?.user as any)?.id

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  // ✅ UPDATE CREDITS (FIXED)
  await prisma.userCredits.update({
    where: { userId },
    data: {
      balance: {
        increment: 2000, // add credits
      },
    },
  })

  return NextResponse.json({ success: true })
}