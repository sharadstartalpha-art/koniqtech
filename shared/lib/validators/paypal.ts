import { z } from "zod";

export const createPayPalSubscriptionSchema =
  z.object({
    orgId: z
      .string()
      .cuid("Invalid organization id."),

    returnUrl: z
      .string()
      .url("Invalid return URL."),

    cancelUrl: z
      .string()
      .url("Invalid cancel URL."),
  });

export type CreatePayPalSubscriptionInput =
  z.infer<
    typeof createPayPalSubscriptionSchema
  >;

export const cancelPayPalSubscriptionSchema =
  z.object({
    subscriptionId: z
      .string()
      .min(
        1,
        "Subscription ID is required."
      ),

    reason: z
      .string()
      .trim()
      .max(255)
      .optional()
      .default(
        "Cancelled by administrator."
      ),
  });

export type CancelPayPalSubscriptionInput =
  z.infer<
    typeof cancelPayPalSubscriptionSchema
  >;

export const activatePayPalSubscriptionSchema =
  z.object({
    subscriptionId: z
      .string()
      .min(
        1,
        "Subscription ID is required."
      ),

    reason: z
      .string()
      .trim()
      .max(255)
      .optional()
      .default(
        "Activated by administrator."
      ),
  });

export type ActivatePayPalSubscriptionInput =
  z.infer<
    typeof activatePayPalSubscriptionSchema
  >;

export const syncPayPalSubscriptionSchema =
  z.object({
    subscriptionId: z
      .string()
      .min(
        1,
        "Subscription ID is required."
      ),
  });

export type SyncPayPalSubscriptionInput =
  z.infer<
    typeof syncPayPalSubscriptionSchema
  >;

export const webhookVerificationSchema =
  z.object({
    transmissionId: z.string(),

    transmissionTime: z.string(),

    certUrl: z.string().url(),

    authAlgo: z.string(),

    transmissionSig: z.string(),

    webhookId: z.string(),

    webhookEvent: z.unknown(),
  });

export type WebhookVerificationInput =
  z.infer<
    typeof webhookVerificationSchema
  >;