import { prisma } from "./prisma";

export async function getUserPlan(userId: string) {
  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    include: { plan: true },
  });

  return sub?.plan || null;
}