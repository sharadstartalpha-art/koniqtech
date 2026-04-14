import {prisma} from "@/lib/prisma";

export async function logAction(
  userId: string,
  action: string,
  teamId?: string,
  meta?: any
) {
  await prisma.auditLog.create({
    data: {
      userId,
      teamId,
      action,
      meta,
    },
  });
}