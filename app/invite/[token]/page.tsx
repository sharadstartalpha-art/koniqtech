import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const invite = await prisma.teamInvite.findUnique({
    where: { token: params.token },
  });

  if (!invite || invite.expiresAt < new Date()) {
    return <p className="p-10">Invalid or expired invite</p>;
  }

  // ✅ GET USER BY EMAIL (IMPORTANT FIX)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return <p className="p-10">User not found</p>;
  }

  // ✅ prevent duplicate join
  const alreadyMember = await prisma.teamMember.findFirst({
    where: {
      teamId: invite.teamId,
      userId: user.id,
    },
  });

  if (!alreadyMember) {
    await prisma.teamMember.create({
      data: {
        teamId: invite.teamId,
        userId: user.id,
        role: "MEMBER",
      },
    });
  }

  await prisma.teamInvite.delete({
    where: { id: invite.id },
  });

  redirect(`/teams/${invite.teamId}`);
}