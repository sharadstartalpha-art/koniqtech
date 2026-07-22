import { CRMType, Industry } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name is too long."),

    companyName: z
      .string()
      .trim()
      .min(2, "Company name is required.")
      .max(150, "Company name is too long."),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain an uppercase letter.")
      .regex(/[a-z]/, "Password must contain a lowercase letter.")
      .regex(/[0-9]/, "Password must contain a number.")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain a special character."
      ),

    confirmPassword: z.string(),

   otp: z.string().optional().default(""),

    industry: z.nativeEnum(Industry),

    crmType: z.nativeEnum(CRMType),

   phone: z.string().default(""),

website: z.string().default(""),

timezone: z.string().default("UTC"),

currency: z.string().default("USD"),

language: z.string().default("en"),

    plan: z.string().default("starter"),

    acceptTerms: z
  .boolean()
  .refine((value) => value === true, {
    message: "You must accept the Terms & Privacy Policy.",
  }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type RegisterSchema = z.input<typeof registerSchema>;

export type RegisterSchemaOutput = z.output<typeof registerSchema>;