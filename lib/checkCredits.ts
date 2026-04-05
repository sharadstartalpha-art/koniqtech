import { prisma } from "./prisma";

export async function checkBalance(userId: string, required = 1) {
  const balance = await prisma.userBalance.findUnique({
    where: { userId },
  });

  if (!balance || balance.balance < required) {
    throw new Error("NO_CREDITS");
  }
}