import { prisma } from "@/lib/prisma";

export async function getUserBalance(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user?.balance || 0;
}

export async function deductCredit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.balance <= 0) {
    throw new Error("NO_CREDITS");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      balance: {
        decrement: 1,
      },
    },
  });
}