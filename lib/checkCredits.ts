import { prisma } from "./prisma";

export async function checkCredits(userId: string, required = 1) {
  const credits = await prisma.userCredits.findUnique({
    where: { userId },
  });

  if (!credits || credits.balance < required) {
    throw new Error("NO_CREDITS");
  }
}