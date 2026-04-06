import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // ✅ get user
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    include: { balance: true },
  });

  // ✅ get leads count
  const leadsCount = await prisma.lead.count({
    where: {
      userId: user?.id,
    },
  });

  return (
    <DashboardClient
      user={user}
      leadsCount={leadsCount}
    />
  );
}