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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { balance: true },
  });

  // ✅ COUNT ONLY USER LEADS
  const leadsCount = await prisma.lead.count({
    where: {
      userId: session.user.id,
    },
  });

  return <DashboardClient user={user} leadsCount={leadsCount} />;
}