import {
  CRMType,
  Industry,
  SubscriptionPlan,
} from "@prisma/client";

import { z } from "zod";

export const createOrganizationSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(150),

    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(2)
      .max(100)
      .regex(
        /^[a-z0-9-]+$/,
        "Slug may contain only lowercase letters, numbers and hyphens."
      ),

    crmType: z.nativeEnum(
      CRMType
    ),

    industry:
      z.nativeEnum(
        Industry
      ).optional(),

    plan: z
      .nativeEnum(
        SubscriptionPlan
      )
      .default("starter"),

    logo: z
      .string()
      .url()
      .optional()
      .nullable(),

    website: z
      .string()
      .url()
      .optional()
      .nullable(),

    phone: z
      .string()
      .trim()
      .optional()
      .nullable(),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email()
      .optional()
      .nullable(),

    address: z
      .string()
      .trim()
      .optional()
      .nullable(),

    city: z
      .string()
      .trim()
      .optional()
      .nullable(),

    state: z
      .string()
      .trim()
      .optional()
      .nullable(),

    country: z
      .string()
      .trim()
      .optional()
      .nullable(),

    postalCode: z
      .string()
      .trim()
      .optional()
      .nullable(),

    timezone: z
      .string()
      .trim()
      .default("UTC"),

    currency: z
      .string()
      .trim()
      .default("USD"),

    language: z
      .string()
      .trim()
      .default("en"),

    taxNumber: z
      .string()
      .trim()
      .optional()
      .nullable(),

    businessNumber:
      z
        .string()
        .trim()
        .optional()
        .nullable(),

    usersLimit:
      z.number().int().min(1).max(1000).default(5),
  });

export type CreateOrganizationInput =
  z.infer<
    typeof createOrganizationSchema
  >;