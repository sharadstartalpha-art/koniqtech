import { prisma } from "@/lib/prisma";

/* ======================
   MRR
====================== */
export async function getMRR() {
  const subs = await prisma.subscription.findMany({
    where: { status: "ACTIVE" },
    include: { plan: true },
  });

  return subs.reduce((sum, s) => sum + (s.plan?.price || 0), 0);
}

/* ======================
   CHURN RATE
====================== */
export async function getChurnRate() {
  const total = await prisma.subscription.count();

  const cancelled = await prisma.subscription.count({
    where: { status: "CANCELLED" },
  });

  if (total === 0) return 0;

  return Number(((cancelled / total) * 100).toFixed(2));
}

/* ======================
   REVENUE SERIES
====================== */
export async function getRevenueSeries() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "asc" },
  });

  return payments.map((p) => ({
    date: p.createdAt.toISOString().slice(0, 10),
    amount: p.amount,
  }));
}

/* ======================
   COHORTS
====================== */
export async function getCohorts() {
  const users = await prisma.user.findMany({
    include: {
      subscriptions: true,
    },
  });

  const cohorts: Record<string, number> = {};

  users.forEach((u) => {
    const month = u.createdAt.toISOString().slice(0, 7);

    if (!cohorts[month]) cohorts[month] = 0;

    if (u.subscriptions.length > 0) {
      cohorts[month]++;
    }
  });

  return cohorts;
}