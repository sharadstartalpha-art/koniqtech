
import { redirect } from "next/navigation";
import prisma from "./prisma"
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

 if (!subscription || subscription.status !== "active") {
    redirect("/subscription-expired");
}

  const expired =
  subscription.status !== "active" ||
  (
    subscription.renewAt &&
    new Date(subscription.renewAt) <= new Date()
  );

  if (expired) {
    redirect("/subscription-expired");
  }

  return subscription;
}