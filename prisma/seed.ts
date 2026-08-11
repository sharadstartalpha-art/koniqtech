import {
  PrismaClient,
  SubscriptionPlan,
} from "@prisma/client";

const prisma =
  new PrismaClient();

async function main() {
  const plans = [
    {
      code: SubscriptionPlan.starter,
      name: "Starter",
      description:
        "For small teams getting started with KoniqTech CRM.",
      price: 99,
      currency: "USD",
      billingCycle: "monthly",
      userLimit: 5,
      storageLimit: 20,
      aiCredits: 1000,
      active: true,
      sortOrder: 1,
    },

    {
      code: SubscriptionPlan.professional,
      name: "Professional",
      description:
        "For growing businesses that need more users and automation.",
      price: 199,
      currency: "USD",
      billingCycle: "monthly",
      userLimit: 15,
      storageLimit: 100,
      aiCredits: 5000,
      active: true,
      sortOrder: 2,
    },

    {
      code: SubscriptionPlan.enterprise,
      name: "Enterprise",
      description:
        "For larger organizations with advanced capacity requirements.",
      price: 499,
      currency: "USD",
      billingCycle: "monthly",
      userLimit: 50,
      storageLimit: 500,
      aiCredits: 20000,
      active: true,
      sortOrder: 3,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: {
        code: plan.code,
      },

      update: {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        billingCycle:
          plan.billingCycle,
        userLimit: plan.userLimit,
        storageLimit:
          plan.storageLimit,
        aiCredits: plan.aiCredits,
        active: plan.active,
        sortOrder: plan.sortOrder,
      },

      create: plan,
    });
  }

  console.log(
    "Plans seeded successfully."
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });