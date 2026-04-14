import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      teamMembers: {
        include: {
          team: true,
        },
      },
    },
  });

  const team = user?.teamMembers[0]?.team;

  if (!team) {
    return <div className="p-6">No team found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Billing 💳</h1>

      <div className="border p-6 rounded-xl">
        <p><strong>Team:</strong> {team.name}</p>
        <p><strong>Credits:</strong> {team.credits}</p>
      </div>
    </div>
  );
}