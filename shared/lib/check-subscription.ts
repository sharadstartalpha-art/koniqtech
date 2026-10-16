
import { redirect } from "next/navigation";
import { SubscriptionStatus } from "@prisma/client";
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
    redirect("/billing/plans");
  }

  const now = new Date();

  // Allow a trial only while its recorded end date is in the future.
  if (subscription.status === SubscriptionStatus.trial) {
    const trialEnd =
      subscription.trialEnd ?? organization.trialEndsAt;

    if (trialEnd && trialEnd > now) {
      return subscription;
    }

    // Mark an expired trial as expired so it cannot keep passing
    // the access check on subsequent requests.
    await prisma.subscription.update({
      where: {
        orgId,
      },
      data: {
        status: SubscriptionStatus.expired,
      },
    });

    redirect("/billing/plans");
  }

  // Allow active paid subscriptions only while their renewal date
  // has not passed.
  if (subscription.status === SubscriptionStatus.active) {
    if (subscription.renewAt && subscription.renewAt <= now) {
      await prisma.subscription.update({
        where: {
          orgId,
        },
        data: {
          status: SubscriptionStatus.expired,
        },
      });

      redirect("/billing/plans");
    }

    return subscription;
  }

  // Cancelled and expired subscriptions cannot access the CRM.
  redirect("/billing/plans");
}
