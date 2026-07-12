"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import {
  Prisma,
  QueueStatus,
} from "@prisma/client"

/* =========================================================
   TYPES
========================================================= */

export type EmailQueueFilter = {
  q?: string
  status?: QueueStatus | ""
}

export type EmailQueueActionResult = {
  success: boolean
  message: string
}

/* =========================================================
   HELPERS
========================================================= */

async function getOrgId() {
  const session = await auth()

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const orgId = String(
    (session.user as { orgId?: string }).orgId ?? ""
  )

  if (!orgId) {
    throw new Error("Organization not found")
  }

  return orgId
}

/* =========================================================
   GET EMAIL QUEUE
========================================================= */

export async function getEmailQueueAction(
  filter: EmailQueueFilter = {}
) {
  const orgId = await getOrgId()

  const where: Prisma.EmailQueueWhereInput = {
    orgId,
  }

  if (filter.status) {
    where.status = filter.status
  }

  if (filter.q?.trim()) {
    const q = filter.q.trim()

    where.OR = [
      {
        to: {
          contains: q,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        subject: {
          contains: q,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        html: {
          contains: q,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        provider: {
          contains: q,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ]
  }

  return prisma.emailQueue.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  })
}

/* =========================================================
   GET EMAIL
========================================================= */

export async function getEmailQueueByIdAction(
  id: string
) {
  const orgId = await getOrgId()

  return prisma.emailQueue.findFirst({
    where: {
      id,
      orgId,
    },
  })
}

/* =========================================================
   RETRY EMAIL
========================================================= */

export async function retryEmailAction(
  id: string
): Promise<EmailQueueActionResult> {
  const orgId = await getOrgId()

  const email = await prisma.emailQueue.findFirst({
    where: {
      id,
      orgId,
    },
  })

  if (!email) {
    return {
      success: false,
      message: "Email not found.",
    }
  }

  await prisma.emailQueue.update({
    where: {
      id,
    },
    data: {
      status: QueueStatus.queued,
      attempts: {
        increment: 1,
      },
      errorMessage: null,
      scheduledAt: new Date(),
    },
  })

  revalidatePath("/admin/marketing/email-queue")
  revalidatePath(`/admin/marketing/email-queue/${id}`)

  return {
    success: true,
    message: "Email queued for retry.",
  }
}

/* =========================================================
   CANCEL EMAIL
========================================================= */

export async function cancelEmailAction(
  id: string
): Promise<EmailQueueActionResult> {
  const orgId = await getOrgId()

  const email = await prisma.emailQueue.findFirst({
    where: {
      id,
      orgId,
    },
  })

  if (!email) {
    return {
      success: false,
      message: "Email not found.",
    }
  }

  await prisma.emailQueue.update({
    where: {
      id,
    },
    data: {
      status: QueueStatus.cancelled,
    },
  })

  revalidatePath("/admin/marketing/email-queue")
  revalidatePath(`/admin/marketing/email-queue/${id}`)

  return {
    success: true,
    message: "Email cancelled.",
  }
}

/* =========================================================
   MARK SENT
========================================================= */

export async function markEmailSentAction(
  id: string
): Promise<EmailQueueActionResult> {
  const orgId = await getOrgId()

  const email = await prisma.emailQueue.findFirst({
    where: {
      id,
      orgId,
    },
  })

  if (!email) {
    return {
      success: false,
      message: "Email not found.",
    }
  }

  await prisma.emailQueue.update({
    where: {
      id,
    },
    data: {
      status: QueueStatus.sent,
      sentAt: new Date(),
    },
  })

  revalidatePath("/admin/marketing/email-queue")
  revalidatePath(`/admin/marketing/email-queue/${id}`)

  return {
    success: true,
    message: "Email marked as sent.",
  }
}

/* =========================================================
   DELETE EMAIL
========================================================= */

export async function deleteEmailAction(
  id: string
): Promise<EmailQueueActionResult> {
  const orgId = await getOrgId()

  const email = await prisma.emailQueue.findFirst({
    where: {
      id,
      orgId,
    },
  })

  if (!email) {
    return {
      success: false,
      message: "Email not found.",
    }
  }

  await prisma.emailQueue.delete({
    where: {
      id,
    },
  })

  revalidatePath("/admin/marketing/email-queue")

  return {
    success: true,
    message: "Email deleted successfully.",
  }
}