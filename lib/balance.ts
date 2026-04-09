import { prisma } from "@/lib/prisma";

// ✅ get balance
export async function getBalance(userId: string) {
  const balance = await prisma.balance.findUnique({
    where: { userId },
  });

  return balance?.amount ?? 0; // ✅ FIXED (amount, not balance)
}

// ✅ deduct credit
export async function deductCredit(userId: string) {
  const balance = await prisma.balance.findUnique({
    where: { userId },
  });

  if (!balance || balance.amount <= 0) {
    throw new Error("NO_CREDITS");
  }

  await prisma.balance.update({
    where: { userId },
    data: {
      amount: {
        decrement: 1, // ✅ FIXED
      },
    },
  });
}