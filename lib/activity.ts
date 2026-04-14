import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function logActivity(
  userId: string,
  type: string,
  message: string,
  teamId?: string
) {
  const activity = await prisma.activity.create({
    data: {
      userId,
      type,
      message,
      teamId,
    },
    include: {
      user: true,
    },
  });

  // 🔥 REALTIME PUSH (PRODUCTION SAFE)
  if (teamId) {
    await pusher.trigger(`team-${teamId}`, "activity", activity);
  }

  return activity;
}