import {prisma} from "@/lib/prisma";

export async function handleFailedPayments() {
  const users = await prisma.subscription.findMany({
    where: {
      status: "PAST_DUE",
    },
  });

  for (const sub of users) {
    const daysPassed =
      (Date.now() - new Date(sub.updatedAt).getTime()) / (1000 * 60 * 60 * 24);

    // ⏳ 7 day grace period
    if (daysPassed > 7) {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          status: "CANCELLED",
        },
      });

      // 🔻 downgrade user
      await prisma.user.update({
        where: { id: sub.userId },
        data: {
          plan: "FREE",
        },
      });
    }
  }
}