import {
  BillingCycle,
  SubscriptionPlan,
} from "@prisma/client";

import { z } from "zod";

export const createSubscriptionSchema =
  z.object({
    orgId: z
      .string()
      .cuid("Invalid organization id."),

    provider: z
      .string()
      .trim()
      .min(2)
      .max(50),

    externalId: z
      .string()
      .trim()
      .optional()
      .nullable(),

    customerId: z
      .string()
      .trim()
      .optional()
      .nullable(),

    plan: z.nativeEnum(
      SubscriptionPlan
    ),

    billingCycle:
      z.nativeEnum(
        BillingCycle
      ),

    amount: z.coerce
  .number()
  .finite()
  .positive()
  .multipleOf(0.01),

    currency: z
      .string()
      .trim()
      .length(3)
      .transform((value) =>
        value.toUpperCase()
      )
      .default("USD"),

    renewAt: z
      .coerce
      .date()
      .optional()
      .nullable(),

    nextInvoiceDate: z
      .coerce
      .date()
      .optional()
      .nullable(),

    trialStart: z
      .coerce
      .date()
      .optional()
      .nullable(),

    trialEnd: z
      .coerce
      .date()
      .optional()
      .nullable(),

    interval: z
      .string()
      .trim()
      .default("month"),

    cancelAtPeriodEnd:
      z.boolean().default(false),

    userLimit: z.coerce
      .number()
      .int()
      .min(1)
      .max(10000)
      .default(5),

    storageLimit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100000)
      .default(20),

    aiCredits: z.coerce
      .number()
      .int()
      .min(0)
      .max(100000000)
      .default(1000),
  });

export type CreateSubscriptionInput =
  z.infer<
    typeof createSubscriptionSchema
  >;