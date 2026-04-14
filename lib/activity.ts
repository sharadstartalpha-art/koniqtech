import { prisma } from "@/lib/prisma";

export async function logActivity(
  userId: string,
  type: string,
  message: string,
  teamId?: string
) {
  await prisma.activity.create({
    data: {
      userId,
      type,
      message,
      teamId,
    },
  });
}