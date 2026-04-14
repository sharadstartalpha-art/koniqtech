import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function sendNotification(
  userId: string,
  message: string,
  teamId?: string
) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      message,
      teamId,
    },
  });

  // 🔥 realtime push
  await pusher.trigger(`user-${userId}`, "notification", notification);

  return notification;
}