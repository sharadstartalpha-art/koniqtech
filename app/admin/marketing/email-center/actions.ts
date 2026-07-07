"use server"

import {
  revalidatePath,
} from "next/cache"

import {
  auth,
} from "@/auth"

import prisma from "@/shared/lib/prisma"

/* =========================================================
   TYPES
========================================================= */

export type MarketingEmailActionState = {
  success: boolean
  message: string
  queuedCount?: number
  fieldErrors?: Record<string, string>
}

export type QueueMarketingEmailInput = {
  campaignId?: string | null

  recipientIds: string[]

  subject: string

  message: string

  template?: string | null

  deliveryMode?:
    | "send_now"
    | "schedule"

  scheduledAt?: string | null
}

/* =========================================================
   CONSTANTS
========================================================= */

const EMAIL_CENTER_PATH =
  "/admin/marketing/email-center"

/* =========================================================
   AUTH CONTEXT
========================================================= */

async function requireMarketingEmailContext() {
  const session =
    await auth()

  if (!session?.user?.id) {
    throw new Error(
      "Unauthorized"
    )
  }

  const orgId =
    session.user.orgId

  if (!orgId) {
    throw new Error(
      "Organization context is missing"
    )
  }

  return {
    userId:
      session.user.id,

    orgId,
  }
}

/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(
  email: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  )
}

/* =========================================================
   DATE PARSER
========================================================= */

function parseScheduledDate(
  value?: string | null
) {
  if (!value) {
    return null
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null
  }

  return date
}

/* =========================================================
   PERSONALIZATION TYPES
========================================================= */

type PersonalizationRecipient = {
  companyName: string

  ownerName:
    | string
    | null

  primaryEmail: string

  industry:
    | string
    | null

  city:
    | string
    | null

  state:
    | string
    | null

  country:
    | string
    | null
}

/* =========================================================
   PERSONALIZE TEXT
========================================================= */

function personalizeText(
  value: string,

  recipient:
    PersonalizationRecipient
) {
  return value

    .replaceAll(
      "{{companyName}}",
      recipient.companyName
    )

    .replaceAll(
      "{{company}}",
      recipient.companyName
    )

    .replaceAll(
      "{{ownerName}}",
      recipient.ownerName ||
        "there"
    )

    .replaceAll(
      "{{name}}",
      recipient.ownerName ||
        "there"
    )

    .replaceAll(
      "{{email}}",
      recipient.primaryEmail
    )

    .replaceAll(
      "{{industry}}",
      recipient.industry ||
        ""
    )

    .replaceAll(
      "{{city}}",
      recipient.city ||
        ""
    )

    .replaceAll(
      "{{state}}",
      recipient.state ||
        ""
    )

    .replaceAll(
      "{{country}}",
      recipient.country ||
        ""
    )
}

/* =========================================================
   QUEUE MARKETING EMAIL
========================================================= */

export async function queueMarketingEmailAction(
  input: QueueMarketingEmailInput
): Promise<MarketingEmailActionState> {
  try {

    /* =====================================================
       AUTH
    ===================================================== */

    const {
      userId,
      orgId,
    } =
      await requireMarketingEmailContext()

    /* =====================================================
       NORMALIZE INPUT
    ===================================================== */

    const campaignId =
      input.campaignId?.trim() ||
      null

    const subject =
      input.subject?.trim() ||
      ""

    const body =
  input.message?.trim() ||
  ""

    const template =
      input.template?.trim() ||
      "marketing_email"

    const deliveryMode =
      input.deliveryMode ||
      (
        input.scheduledAt
          ? "schedule"
          : "send_now"
      )

    const recipientIds =
      Array.from(
        new Set(
          input.recipientIds
            .map(
              (recipientId) =>
                recipientId.trim()
            )
            .filter(Boolean)
        )
      )

    /* =====================================================
       VALIDATION
    ===================================================== */

    const fieldErrors:
      Record<string, string> =
        {}

    if (!subject) {
      fieldErrors.subject =
        "Email subject is required"
    }

    if (!body) {
      fieldErrors.body =
        "Email body is required"
    }

    if (
      recipientIds.length === 0
    ) {
      fieldErrors.recipients =
        "Select at least one recipient"
    }

    let scheduledAt:
      Date | null =
        null

    if (
      deliveryMode ===
      "schedule"
    ) {
      scheduledAt =
        parseScheduledDate(
          input.scheduledAt
        )

      if (!scheduledAt) {
        fieldErrors.scheduledAt =
          "Select a valid schedule date"
      } else if (
        scheduledAt.getTime() <=
        Date.now()
      ) {
        fieldErrors.scheduledAt =
          "Scheduled time must be in the future"
      }
    }

    if (
      Object.keys(
        fieldErrors
      ).length > 0
    ) {
      return {
        success: false,

        message:
          "Please correct the highlighted fields",

        fieldErrors,
      }
    }

    /* =====================================================
       OPTIONAL CAMPAIGN VALIDATION
    ===================================================== */

    if (campaignId) {
      const campaign =
        await prisma.marketingCampaign.findFirst({
          where: {
            id:
              campaignId,

            createdBy: {
              orgId,
            },
          },

          select: {
            id: true,
          },
        })

      if (!campaign) {
        return {
          success: false,

          message:
            "Marketing campaign not found",
        }
      }
    }

    /* =====================================================
       LOAD RECIPIENTS

       CompanyLead belongs to Organization through orgId.
       This enforces tenant isolation.
    ===================================================== */

    const recipients =
      await prisma.companyLead.findMany({
        where: {
          orgId,

          id: {
            in:
              recipientIds,
          },

          primaryEmail: {
            not: null,
          },
        },

        select: {
          id: true,

          companyName:
            true,

          ownerName:
            true,

          primaryEmail:
            true,

          industry:
            true,

          city:
            true,

          state:
            true,

          country:
            true,
        },
      })

    /* =====================================================
       VALID RECIPIENTS
    ===================================================== */

    const validRecipients:
      PersonalizationRecipient[] =
        recipients.flatMap(
          (recipient) => {

            const email =
              recipient
                .primaryEmail
                ?.trim()

            if (
              !email ||
              !isValidEmail(
                email
              )
            ) {
              return []
            }

            return [
              {
                companyName:
                  recipient
                    .companyName,

                ownerName:
                  recipient
                    .ownerName,

                primaryEmail:
                  email,

                industry:
                  recipient
                    .industry,

                city:
                  recipient
                    .city,

                state:
                  recipient
                    .state,

                country:
                  recipient
                    .country,
              },
            ]
          }
        )

    if (
      validRecipients.length ===
      0
    ) {
      return {
        success: false,

        message:
          "No selected recipients have valid email addresses",
      }
    }

    /* =====================================================
       QUEUE CONFIGURATION
    ===================================================== */

    const queueScheduledAt =
      deliveryMode ===
      "schedule"
        ? scheduledAt
        : new Date()

    const queueStatus =
      deliveryMode ===
      "schedule"
        ? "scheduled"
        : "queued"

    /* =====================================================
       BUILD QUEUE RECORDS
    ===================================================== */

    const queueRecords =
      validRecipients.map(
        (recipient) => {

          const personalizedSubject =
            personalizeText(
              subject,
              recipient
            )

          const personalizedBody =
            personalizeText(
              body,
              recipient
            )

          return {
            orgId,

            userId,

            toEmail:
              recipient
                .primaryEmail,

            subject:
              personalizedSubject,

            body:
              personalizedBody,

            template,

            provider:
              "resend",

            status:
              queueStatus,

            retries:
              0,

            scheduledAt:
              queueScheduledAt,
          }
        }
      )

    /* =====================================================
       CREATE QUEUE RECORDS
    ===================================================== */

    const result =
      await prisma.userEmailQueue.createMany({
        data:
          queueRecords,
      })

    /* =====================================================
       UPDATE CAMPAIGN LEAD COUNT

       Campaign leads/conversions remain relation-driven.
       We do not write integer counters here.
    ===================================================== */

    if (campaignId) {
      const campaignLeadRecords =
        recipientIds.map(
          (companyLeadId) => ({
            campaignId,

            companyLeadId,
          })
        )

      await prisma.marketingCampaignLead.createMany({
        data:
          campaignLeadRecords,

        skipDuplicates:
          true,
      })
    }

    /* =====================================================
       REVALIDATE
    ===================================================== */

    revalidatePath(
      EMAIL_CENTER_PATH
    )

    revalidatePath(
      "/admin/marketing/campaigns"
    )

    if (campaignId) {
      revalidatePath(
        `/admin/marketing/campaigns/${campaignId}`
      )
    }

    return {
      success:
        true,

      message:
        deliveryMode ===
        "schedule"
          ? `${result.count} emails scheduled successfully`
          : `${result.count} emails added to the delivery queue`,

      queuedCount:
        result.count,
    }

  } catch (error) {

    console.error(
      "QUEUE_MARKETING_EMAIL_ERROR",
      error
    )

    return {
      success:
        false,

      message:
        error instanceof Error
          ? error.message
          : "Unable to queue marketing emails",
    }
  }
}

/* =========================================================
   CANCEL QUEUED EMAIL
========================================================= */

export async function cancelMarketingEmailAction(
  queueId: string
): Promise<MarketingEmailActionState> {
  try {

    const {
      orgId,
    } =
      await requireMarketingEmailContext()

    const email =
      await prisma.userEmailQueue.findFirst({
        where: {
          id:
            queueId,

          orgId,
        },

        select: {
          id:
            true,

          status:
            true,
        },
      })

    if (!email) {
      return {
        success:
          false,

        message:
          "Queued email not found",
      }
    }

    if (
      ![
        "pending",
        "queued",
        "scheduled",
      ].includes(
        email.status
      )
    ) {
      return {
        success:
          false,

        message:
          "This email can no longer be cancelled",
      }
    }

    await prisma.userEmailQueue.update({
      where: {
        id:
          email.id,
      },

      data: {
        status:
          "cancelled",
      },
    })

    revalidatePath(
      EMAIL_CENTER_PATH
    )

    return {
      success:
        true,

      message:
        "Queued email cancelled successfully",
    }

  } catch (error) {

    console.error(
      "CANCEL_MARKETING_EMAIL_ERROR",
      error
    )

    return {
      success:
        false,

      message:
        error instanceof Error
          ? error.message
          : "Unable to cancel email",
    }
  }
}

/* =========================================================
   RETRY FAILED EMAIL
========================================================= */

export async function retryMarketingEmailAction(
  queueId: string
): Promise<MarketingEmailActionState> {
  try {

    const {
      orgId,
    } =
      await requireMarketingEmailContext()

    const email =
      await prisma.userEmailQueue.findFirst({
        where: {
          id:
            queueId,

          orgId,
        },

        select: {
          id:
            true,

          status:
            true,
        },
      })

    if (!email) {
      return {
        success:
          false,

        message:
          "Email queue record not found",
      }
    }

    if (
      email.status !==
      "failed"
    ) {
      return {
        success:
          false,

        message:
          "Only failed emails can be retried",
      }
    }

    await prisma.userEmailQueue.update({
      where: {
        id:
          email.id,
      },

      data: {
        status:
          "queued",

        scheduledAt:
          new Date(),

        errorMessage:
          null,
      },
    })

    revalidatePath(
      EMAIL_CENTER_PATH
    )

    return {
      success:
        true,

      message:
        "Email added back to the delivery queue",
    }

  } catch (error) {

    console.error(
      "RETRY_MARKETING_EMAIL_ERROR",
      error
    )

    return {
      success:
        false,

      message:
        error instanceof Error
          ? error.message
          : "Unable to retry email",
    }
  }
}

/* =========================================================
   DELETE QUEUE RECORD
========================================================= */

export async function deleteMarketingEmailAction(
  queueId: string
): Promise<MarketingEmailActionState> {
  try {

    const {
      orgId,
    } =
      await requireMarketingEmailContext()

    const email =
      await prisma.userEmailQueue.findFirst({
        where: {
          id:
            queueId,

          orgId,
        },

        select: {
          id:
            true,

          status:
            true,
        },
      })

    if (!email) {
      return {
        success:
          false,

        message:
          "Email queue record not found",
      }
    }

    if (
      email.status ===
      "sending"
    ) {
      return {
        success:
          false,

        message:
          "An email currently being sent cannot be deleted",
      }
    }

    await prisma.userEmailQueue.delete({
      where: {
        id:
          email.id,
      },
    })

    revalidatePath(
      EMAIL_CENTER_PATH
    )

    return {
      success:
        true,

      message:
        "Email queue record deleted successfully",
    }

  } catch (error) {

    console.error(
      "DELETE_MARKETING_EMAIL_ERROR",
      error
    )

    return {
      success:
        false,

      message:
        error instanceof Error
          ? error.message
          : "Unable to delete email",
    }
  }
}