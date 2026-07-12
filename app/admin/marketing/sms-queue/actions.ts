"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   TYPES
========================================================= */

type ActionResult = {
  success: boolean
  message: string
}

/* =========================================================
   CONSTANTS
========================================================= */

const SMS_QUEUE_PATH =
  "/admin/marketing/sms-queue"

/* =========================================================
   AUTH HELPER
========================================================= */

async function getOrgId(): Promise<string | null> {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  const orgId = String(
    (session.user as {
      orgId?: string
    }).orgId ?? ""
  ).trim()

  return orgId || null
}

/* =========================================================
   REVALIDATE
========================================================= */

function revalidateSmsQueue(id?: string) {
  revalidatePath(SMS_QUEUE_PATH)

  if (id) {
    revalidatePath(
      `${SMS_QUEUE_PATH}/${id}`
    )
  }
}

/* =========================================================
   RETRY SMS
========================================================= */

export async function retrySmsAction(
  smsId: string
): Promise<ActionResult> {
  try {
    const orgId = await getOrgId()

    if (!orgId) {
      return {
        success: false,
        message: "Unauthorized request."
      }
    }

    const sms =
      await prisma.smsQueue.findFirst({
        where: {
          id: smsId,
          orgId
        },

        select: {
          id: true,
          status: true
        }
      })

    if (!sms) {
      return {
        success: false,
        message: "SMS queue record not found."
      }
    }

    const status =
      String(sms.status).toLowerCase()

    if (
      status !== "failed" &&
      status !== "cancelled"
    ) {
      return {
        success: false,
        message:
          "Only failed or cancelled SMS records can be retried."
      }
    }

    await prisma.smsQueue.update({
      where: {
        id: sms.id
      },

      data: {
        status: "pending",
        scheduledAt: new Date(),
        sentAt: null,
        errorMessage: null
      }
    })

    revalidateSmsQueue(sms.id)

    return {
      success: true,
      message:
        "SMS returned to the delivery queue."
    }
  } catch (error) {
    console.error(
      "retrySmsAction error:",
      error
    )

    return {
      success: false,
      message:
        "Unable to retry the SMS."
    }
  }
}

/* =========================================================
   CANCEL SMS
========================================================= */

export async function cancelSmsAction(
  smsId: string
): Promise<ActionResult> {
  try {
    const orgId = await getOrgId()

    if (!orgId) {
      return {
        success: false,
        message: "Unauthorized request."
      }
    }

    const sms =
      await prisma.smsQueue.findFirst({
        where: {
          id: smsId,
          orgId
        },

        select: {
          id: true,
          status: true
        }
      })

    if (!sms) {
      return {
        success: false,
        message: "SMS queue record not found."
      }
    }

    const status =
      String(sms.status).toLowerCase()

    const cancellableStatuses = [
      "pending",
      "queued",
      "scheduled",
      "processing",
      "sending"
    ]

    if (
      !cancellableStatuses.includes(status)
    ) {
      return {
        success: false,
        message:
          "This SMS can no longer be cancelled."
      }
    }

    await prisma.smsQueue.update({
      where: {
        id: sms.id
      },

      data: {
        status: "cancelled"
      }
    })

    revalidateSmsQueue(sms.id)

    return {
      success: true,
      message:
        "SMS has been cancelled."
    }
  } catch (error) {
    console.error(
      "cancelSmsAction error:",
      error
    )

    return {
      success: false,
      message:
        "Unable to cancel the SMS."
    }
  }
}

/* =========================================================
   DELETE SMS
========================================================= */

export async function deleteSmsAction(
  smsId: string
): Promise<ActionResult> {
  try {
    const orgId = await getOrgId()

    if (!orgId) {
      return {
        success: false,
        message: "Unauthorized request."
      }
    }

    const sms =
      await prisma.smsQueue.findFirst({
        where: {
          id: smsId,
          orgId
        },

        select: {
          id: true
        }
      })

    if (!sms) {
      return {
        success: false,
        message: "SMS queue record not found."
      }
    }

    await prisma.smsQueue.delete({
      where: {
        id: sms.id
      }
    })

    revalidateSmsQueue()

    return {
      success: true,
      message:
        "SMS queue record deleted."
    }
  } catch (error) {
    console.error(
      "deleteSmsAction error:",
      error
    )

    return {
      success: false,
      message:
        "Unable to delete the SMS record."
    }
  }
}