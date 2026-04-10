import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 🔒 NOT LOGGED IN → BLOCK
  if (!session?.user?.email) {
    redirect("/login");
  }

  return <>{children}</>;
}