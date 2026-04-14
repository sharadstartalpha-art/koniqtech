import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UsagePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // 🔥 Get user with team
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      teamMembers: {
        include: {
          team: true,
        },
      },
    },
  });

  const activeTeam = user?.teamMembers?.[0]?.team;

  if (!activeTeam) {
    return <div className="p-6">No team found</div>;
  }

  // ✅ TEAM-BASED USAGE
  const usage = await prisma.usage.findMany({
    where: { teamId: activeTeam.id },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Usage 📊</h1>

      {usage.map((u) => (
        <div key={u.id} className="flex justify-between border p-3 rounded">
          <span>{u.user.email}</span>
          <span>{u.action}</span>
          <span>-{u.credits}</span>
        </div>
      ))}
    </div>
  );
}