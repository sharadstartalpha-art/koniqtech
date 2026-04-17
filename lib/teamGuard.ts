import { prisma } from "./prisma";

export async function requireTeamMember(
  userEmail: string,
  teamId: string
) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: user.id,
    },
  });

  if (!member) {
    throw new Error("Not a team member");
  }

  return member;
}