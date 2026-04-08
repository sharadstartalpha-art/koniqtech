import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // ❌ Not logged in
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // ✅ Get user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { balance: true },
  });

  // ❗ CRITICAL FIX: use user.id (NOT session.user.id)
  const leadsCount = await prisma.lead.count({
    where: {
      userId: user?.id,
    },
  });

  console.log("SERVER LEADS COUNT:", leadsCount); // 🔥 DEBUG

  return <DashboardClient user={user} leadsCount={leadsCount} />;
}