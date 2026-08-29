import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppLayout from "@/app/components/AppLayout";
import { requireActiveSubscription } from "@/shared/lib/check-subscription";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Don't check subscription for super admins
  if (session.user.role !== "super_admin") {
    await requireActiveSubscription(session.user.orgId);
  }

  return <AppLayout>{children}</AppLayout>;
}