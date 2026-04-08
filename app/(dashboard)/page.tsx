import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await prisma.user.findFirst({
  where: {
    email: session?.user?.email,
  },
  include: { balance: true },
});

console.log("DASHBOARD USER ID:", user?.id);

  if (!user) {
    redirect("/login");
  }

  // ✅ COUNT LEADS USING REAL USER ID
  const leadsCount = await prisma.lead.count({
  where: {
    userId: user?.id,
  },
});

  console.log("DASHBOARD USER:", user.id);
  console.log("LEADS COUNT:", leadsCount);

  return <DashboardClient user={user} leadsCount={leadsCount} />;
}