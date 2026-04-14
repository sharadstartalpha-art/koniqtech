import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ActivityFeed from "@/components/ActivityFeed";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  // 🔥 ADMIN goes to admin dashboard
  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">User Dashboard 👤</h1>
      <ActivityFeed />
    </div>
  );
}