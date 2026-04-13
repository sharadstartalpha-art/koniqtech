import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  await requireAdmin();

  const { userId, amount } = await req.json();

  // ✅ ADD credits (admin action)
  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: {
        increment: amount,
      },
    },
  });

  // ✅ TRANSACTION LOG
  await prisma.transaction.create({
    data: {
      userId,
      type: "CREDIT_ADD",
      amount,
    },
  });

  return Response.json({ success: true });
}