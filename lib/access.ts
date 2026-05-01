import { prisma } from "@/lib/prisma";

export async function hasAccess(userId: string, slug: string) {
  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      product: {
        slug,
      },
    },
  });

  return !!sub;
}