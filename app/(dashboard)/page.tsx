import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      balance: true,
    },
  });

  const leads = await prisma.lead.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <DashboardClient user={user} leadsCount={leads.length} />
  );
}