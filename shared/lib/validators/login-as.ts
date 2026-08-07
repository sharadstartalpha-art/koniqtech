import { z } from "zod";

export const loginAsSchema = z.object({
  targetUserId: z
    .string()
    .uuid("Invalid target user id."),
});

export type LoginAsInput =
  z.infer<typeof loginAsSchema>;