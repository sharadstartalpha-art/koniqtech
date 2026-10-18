
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppLayout from "@/app/components/AppLayout";
import prisma from "@/shared/lib/prisma";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id || !session.user.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;
  const role = String(
    (session.user as { role?: string }).role ?? ""
  ).toLowerCase();

  // Billing must remain accessible so cancelled or expired
  // customers can manage or renew their subscriptions.
  const subscription = await prisma.subscription.findUnique({
    where: { orgId },
    select: {
      status: true,
      renewAt: true,
      trialEnd: true,
    },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
    select: {
      active: true,
      trialEndsAt: true,
    },
  });

  const now = new Date();

  const trialEnd =
    subscription?.trialEnd ?? organization?.trialEndsAt ?? null;

  const validTrial =
    subscription?.status === "trial" &&
    trialEnd !== null &&
    trialEnd > now;

  const validPaidSubscription =
    subscription?.status === "active" &&
    (!subscription.renewAt || subscription.renewAt > now);

  const subscriptionValid = validTrial || validPaidSubscription;

  // Super admins should not be blocked by customer subscription status.
  if (role !== "super_admin") {
    if (!organization?.active) {
      redirect("/billing/plans");
    }

    // Allow billing pages even if the subscription is cancelled/expired.
    // Other CRM pages require a valid trial or active subscription.
    // The current URL is not available directly to this server layout;
    // billing routes should therefore be kept outside this protected
    // layout or handled through a route-specific layout.
    if (!subscriptionValid) {
      redirect("/billing/plans");
    }
  }

  const userLocations = await prisma.userLocation.findMany({
    where: {
      userId: session.user.id,
      location: {
        orgId,
        active: true,
      },
    },
    select: {
      location: {
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          country: true,
          isDefault: true,
        },
      },
    },
    orderBy: [
      { location: { isDefault: "desc" } },
      { location: { name: "asc" } },
    ],
  });

  const locations = userLocations.map((item) => item.location);

  return <AppLayout locations={locations}>{children}</AppLayout>;
}
