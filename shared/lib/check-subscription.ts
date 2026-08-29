import { redirect } from "next/navigation";
import prisma from "./prisma";

export async function requireActiveSubscription(orgId: string) {
  const organization = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    include: {
      subscriptions: true,
    },
  });

  if (!organization) {
    redirect("/login");
  }

  const subscription = organization.subscriptions;

  if (!subscription) {
    redirect("/subscription-expired");
  }

  if (
    subscription.status !== "active" ||
    (subscription.renewAt &&
      subscription.renewAt <= new Date())
  ) {
    redirect("/subscription-expired");
  }

  return subscription;
}