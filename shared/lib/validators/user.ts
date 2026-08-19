// shared/lib/validators/user.ts

import { z } from "zod";
import { SubscriptionPlan } from "@prisma/client";

export const createUserSchema = z.object({
  orgId: z
    .string()
    .uuid("Invalid organization."),

  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(100, "Name is too long."),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(255, "Email is too long.")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .max(100, "Password is too long."),

  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long.")
    .optional()
    .or(z.literal("")),

 role: z.string().min(1, "Role is required"),

  plan: z.nativeEnum(SubscriptionPlan),
});

export type CreateUserInput = z.infer<
  typeof createUserSchema
>;