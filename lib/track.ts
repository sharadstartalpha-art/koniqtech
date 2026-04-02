import { prisma } from "./prisma";

export async function track(userId: string, event: string) {
  await prisma.transaction.create({
    data: {
      userId,
      amount: 0,
      credits: 0,
      type: "CREDIT_USAGE",
      status: event,
    },
  });
}