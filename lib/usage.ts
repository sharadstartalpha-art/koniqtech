import { prisma } from "@/lib/prisma";

export async function deductCredits(
  userId: string,
  amount: number,
  action: string,
  teamId?: string
) {
  if (teamId) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team || team.credits < amount) {
      throw new Error("NO_TEAM_CREDITS");
    }

    await prisma.team.update({
      where: { id: teamId },
      data: {
        credits: { decrement: amount },
      },
    });

    await prisma.usage.create({
      data: {
        userId,
        teamId, // ✅ now valid
        action,
        credits: amount,
      },
    });

  } else {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.credits < amount) {
      throw new Error("NO_CREDITS");
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: amount },
      },
    });

    await prisma.usage.create({
      data: {
        userId,
        action,
        credits: amount,
      },
    });
  }
}

export async function checkUsage(
  userId: string,
  cost: number,
  teamId?: string
) {
  if (teamId) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team || team.credits < cost) {
      throw new Error("NO_TEAM_CREDITS");
    }

  } else {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.credits < cost) {
      throw new Error("NO_CREDITS");
    }
  }
}