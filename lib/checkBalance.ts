import { prisma } from "@/lib/prisma";

export async function checkBalance(userId: string, required: number) {
  const userBalance = await prisma.userBalance.findUnique({
    where: { userId },
  });

  if (!userBalance || userBalance.balance < required) {
    throw new Error("NO_BALANCE");
  }

  return true;
}