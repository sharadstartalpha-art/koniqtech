import { UserRole } from "@prisma/client";
import { z } from "zod";

export const createUserSchema = z.object({
  orgId: z
    .string()
    .uuid("Invalid organization."),

  name: z
    .string()
    .trim()
    .min(2, "Name is required.")
    .max(100),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address."),

  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters."
    )
    .max(100),

  phone: z
    .string()
    .trim()
    .optional()
    .nullable(),

  role: z.nativeEnum(UserRole),
});

export type CreateUserInput =
  z.infer<
    typeof createUserSchema
  >;