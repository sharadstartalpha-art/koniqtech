import { z } from "zod";

export const createRoleSchema = z.object({
  orgId: z
    .string()
    .cuid("Invalid organization id."),

  name: z
    .string()
    .trim()
    .min(2, "Role name is required.")
    .max(100),

  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable(),

  active: z
    .boolean()
    .default(true),
});

export type CreateRoleInput =
  z.infer<typeof createRoleSchema>;