import { prisma } from "@/lib/prisma";

export async function getUserBalance(userId: string) {
  const userBalance = await prisma.userBalance.findUnique({
    where: { userId },
  });

  return userBalance?.balance || 0;
}

export async function deductCredit(userId: string) {
  const userBalance = await prisma.userBalance.findUnique({
    where: { userId },
  });

  if (!userBalance || userBalance.balance <= 0) {
    throw new Error("NO_CREDITS");
  }

  await prisma.userBalance.update({
    where: { userId },
    data: {
      balance: {
        decrement: 1,
      },
    },
  });
}