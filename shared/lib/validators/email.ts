import { z } from "zod";

export const sendTestEmailSchema =
  z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address."),

    subject: z
      .string()
      .trim()
      .min(
        3,
        "Subject must be at least 3 characters."
      )
      .max(
        200,
        "Subject cannot exceed 200 characters."
      ),

    message: z
      .string()
      .trim()
      .min(
        5,
        "Message must be at least 5 characters."
      )
      .max(
        10000,
        "Message cannot exceed 10000 characters."
      ),
  });

export type SendTestEmailInput =
  z.infer<
    typeof sendTestEmailSchema
  >;

export const emailConfigurationSchema =
  z.object({
    from: z
      .string()
      .trim()
      .email("Invalid sender email."),

    replyTo: z
      .string()
      .trim()
      .email("Invalid reply-to email.")
      .optional(),

    provider: z.enum([
      "resend",
    ]),
  });

export type EmailConfigurationInput =
  z.infer<
    typeof emailConfigurationSchema
  >;