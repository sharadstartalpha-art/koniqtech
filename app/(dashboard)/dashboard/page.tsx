import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  // 👇 fetch user with relations
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      balance: true,
      projects: true,
    },
  });

  // 👇 count leads
  const leadsCount = await prisma.lead.count({
    where: { userId: session.user.id },
  });

  return (
    <DashboardClient
      user={user}
      leadsCount={leadsCount}
    />
  );
}