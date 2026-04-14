import {prisma} from "@/lib/prisma";

export async function requireTeamMember(
  userId: string,
  teamId: string
) {
  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
    },
  });

  if (!member) {
    throw new Error("NOT_IN_TEAM");
  }

  return member;
}