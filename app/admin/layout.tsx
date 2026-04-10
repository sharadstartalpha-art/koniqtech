import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: any) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // 🔥 ONLY ADMIN
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}