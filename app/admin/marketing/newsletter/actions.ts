"use server"

import {
  NewsletterAudience,
} from "@prisma/client"
import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   ACTION STATE
========================================================= */

export type NewsletterActionState = {
  success: boolean
  message: string
}

/* =========================================================
   TYPES
========================================================= */

type DeliveryMode =
  | "draft"
  | "schedule"
  | "send_now"

/* =========================================================
   CREATE NEWSLETTER
========================================================= */

export async function createNewsletterAction(
  previousState: NewsletterActionState,
  formData: FormData
): Promise<NewsletterActionState> {
  void previousState

  try {
    /* =====================================================
       AUTH
    ===================================================== */

    const session = await auth()

    if (!session?.user) {
      return {
        success: false,
        message: "Unauthorized request.",
      }
    }

    const userId = session.user.id

    const orgId = session.user.orgId

    if (!userId || !orgId) {
      return {
        success: false,
        message:
          "User or organization context is missing.",
      }
    }

    /* =====================================================
       FORM VALUES
    ===================================================== */

    const title = String(
      formData.get("title") ?? ""
    ).trim()

    const subject = String(
      formData.get("subject") ?? ""
    ).trim()

    const previewText = String(
      formData.get("previewText") ?? ""
    ).trim()

    const audience = String(
      formData.get("audience") ?? "all"
    ).trim()

    const content = String(
      formData.get("content") ?? ""
    ).trim()

    const deliveryMode = String(
      formData.get("deliveryMode") ?? "draft"
    ) as DeliveryMode

    const scheduledAtValue = String(
      formData.get("scheduledAt") ?? ""
    ).trim()

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!title) {
      return {
        success: false,
        message: "Newsletter title is required.",
      }
    }

    if (!subject) {
      return {
        success: false,
        message: "Email subject is required.",
      }
    }

    if (!content) {
      return {
        success: false,
        message: "Newsletter content is required.",
      }
    }

    if (
      ![
        "draft",
        "schedule",
        "send_now",
      ].includes(deliveryMode)
    ) {
      return {
        success: false,
        message: "Invalid delivery mode.",
      }
    }

    /* =====================================================
       SCHEDULE DATE
    ===================================================== */

    let scheduledAt: Date | null = null

    if (deliveryMode === "schedule") {
      if (!scheduledAtValue) {
        return {
          success: false,
          message:
            "Schedule date and time are required.",
        }
      }

      scheduledAt = new Date(
        scheduledAtValue
      )

      if (
        Number.isNaN(
          scheduledAt.getTime()
        )
      ) {
        return {
          success: false,
          message:
            "Invalid schedule date and time.",
        }
      }

      if (
        scheduledAt.getTime() <=
        Date.now()
      ) {
        return {
          success: false,
          message:
            "Scheduled delivery must be in the future.",
        }
      }
    }

    /* =====================================================
       RECIPIENT QUERY

       Current safe implementation:
       CompanyLead.primaryEmail is the marketing email source.

       More audience filters can be added after mapping your
       exact CompanyStatus enum values.
    ===================================================== */

    const recipients =
      await prisma.companyLead.findMany({
        where: {
          primaryEmail: {
            not: null,
          },
        },

        select: {
          id: true,
          companyName: true,
          ownerName: true,
          primaryEmail: true,
        },

        orderBy: {
          companyName: "asc",
        },
      })

    /* =====================================================
       CLEAN RECIPIENTS
    ===================================================== */

    const validRecipients =
      recipients.filter(
        (
          recipient
        ): recipient is typeof recipient & {
          primaryEmail: string
        } =>
          Boolean(
            recipient.primaryEmail?.trim()
          )
      )

    if (
      deliveryMode !== "draft" &&
      validRecipients.length === 0
    ) {
      return {
        success: false,
        message:
          "No valid recipients were found.",
      }
    }

    /* =====================================================
       BUILD EMAIL BODY
    ===================================================== */

    const emailBody = previewText
      ? `
<!-- Preview Text -->
<div
  style="
    display:none;
    max-height:0;
    overflow:hidden;
    opacity:0;
  "
>
  ${escapeHtml(previewText)}
</div>

${content}
      `.trim()
      : content

    /* =====================================================
       DRAFT MODE

       UserEmailQueue is recipient-level storage.

       Since there is currently no Newsletter model supplied,
       store one draft queue record for the current admin user.

       This avoids generating a draft row for every recipient.
    ===================================================== */

    if (deliveryMode === "draft") {
      await prisma.userEmailQueue.create({
        data: {
          orgId,

          userId,

          toEmail: session.user.email,

          subject,

          body: emailBody,

          template: title,

          provider: "newsletter",

          status: "draft",

          scheduledAt: null,
        },
      })

      revalidatePath(
        "/admin/marketing/newsletter"
      )

      return {
        success: true,
        message:
          "Newsletter draft saved successfully.",
      }
    }

    /* =====================================================
       QUEUE STATUS
    ===================================================== */

    const queueStatus =
      deliveryMode === "schedule"
        ? "scheduled"
        : "pending"

    /* =====================================================
       CREATE QUEUE RECORDS
    ===================================================== */

    await prisma.$transaction(
      validRecipients.map((recipient) =>
        prisma.userEmailQueue.create({
          data: {
            orgId,

            userId,

            toEmail:
              recipient.primaryEmail,

            subject,

            body: emailBody,

            template: title,

            provider: "newsletter",

            status: queueStatus,

            scheduledAt:
              deliveryMode === "schedule"
                ? scheduledAt
                : null,
          },
        })
      )
    )

    /* =====================================================
       REVALIDATE
    ===================================================== */

    revalidatePath(
      "/admin/marketing/newsletter"
    )

    revalidatePath(
      "/admin/marketing/email-center"
    )

    revalidatePath(
      "/admin/marketing/email-queue"
    )

    /* =====================================================
       RESPONSE
    ===================================================== */

    if (
      deliveryMode === "schedule"
    ) {
      return {
        success: true,
        message:
          `Newsletter scheduled for ${validRecipients.length} recipients.`,
      }
    }

    return {
      success: true,
      message:
        `Newsletter queued for ${validRecipients.length} recipients.`,
    }
  } catch (error) {
    console.error(
      "CREATE_NEWSLETTER_ERROR",
      error
    )

    return {
      success: false,
      message:
        "Unable to create newsletter. Please try again.",
    }
  }
}

/* =========================================================
   UPDATE NEWSLETTER
========================================================= */

export async function updateNewsletterAction(
  newsletterId: string,
  formData: FormData
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized.",
      }
    }

    const userId = session.user.id

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          orgId: true,
        },
      })

    if (!user?.orgId) {
      return {
        success: false,
        message:
          "Organization not found.",
      }
    }

    const existingNewsletter =
      await prisma.marketingNewsletter.findFirst({
        where: {
          id: newsletterId,
          orgId: user.orgId,
        },
        select: {
          id: true,
          status: true,
        },
      })

    if (!existingNewsletter) {
      return {
        success: false,
        message:
          "Newsletter not found.",
      }
    }

    if (
      existingNewsletter.status ===
        "sending" ||
      existingNewsletter.status ===
        "sent"
    ) {
      return {
        success: false,
        message:
          "Sending or sent newsletters cannot be edited.",
      }
    }

    const title =
      formData
        .get("title")
        ?.toString()
        .trim() ?? ""

    const subject =
      formData
        .get("subject")
        ?.toString()
        .trim() ?? ""

    const previewText =
      formData
        .get("previewText")
        ?.toString()
        .trim() ?? ""

    const content =
      formData
        .get("content")
        ?.toString()
        .trim() ?? ""

    const audience =
      formData
        .get("audience")
        ?.toString()

    const scheduledAtValue =
      formData
        .get("scheduledAt")
        ?.toString()

    if (!title) {
      return {
        success: false,
        message:
          "Newsletter title is required.",
      }
    }

    if (!subject) {
      return {
        success: false,
        message:
          "Email subject is required.",
      }
    }

    if (!content) {
      return {
        success: false,
        message:
          "Newsletter content is required.",
      }
    }

    const validAudiences = [
      "all",
      "prospects",
      "customers",
      "trial",
      "inactive",
    ] as const

    if (
      !audience ||
      !validAudiences.includes(
        audience as
          (typeof validAudiences)[number]
      )
    ) {
      return {
        success: false,
        message:
          "Invalid newsletter audience.",
      }
    }

    const scheduledAt =
      scheduledAtValue
        ? new Date(
            scheduledAtValue
          )
        : null

    if (
      scheduledAt &&
      Number.isNaN(
        scheduledAt.getTime()
      )
    ) {
      return {
        success: false,
        message:
          "Invalid scheduled date.",
      }
    }

    await prisma.marketingNewsletter.update({
      where: {
        id: newsletterId,
      },

      data: {
        title,
        subject,

        previewText:
          previewText || null,

        content,

        audience:
          audience as NewsletterAudience,

        scheduledAt,
      },
    })

    revalidatePath(
      "/admin/marketing/newsletter"
    )

    revalidatePath(
      `/admin/marketing/newsletter/${newsletterId}`
    )

    revalidatePath(
      `/admin/marketing/newsletter/${newsletterId}/edit`
    )

    return {
      success: true,
      message:
        "Newsletter updated successfully.",
    }
  } catch (error) {
    console.error(
      "UPDATE_NEWSLETTER_ERROR",
      error
    )

    return {
      success: false,
      message:
        "Unable to update newsletter.",
    }
  }
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}