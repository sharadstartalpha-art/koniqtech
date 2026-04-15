import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireTeamMember } from "@/lib/teamGuard";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ teamId: string }> } // ✅ IMPORTANT
) {
  const { teamId } = await context.params; // ✅ MUST await

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔐 SECURITY
  await requireTeamMember(session.user.id, teamId);

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        include: { user: true },
      },
      invites: true,
    },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" });
  }

  return NextResponse.json(team);
}