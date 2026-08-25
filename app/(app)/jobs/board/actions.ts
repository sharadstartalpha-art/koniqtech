"use server"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"

const VALID_STATUSES = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
] as const

type JobStatus = (typeof VALID_STATUSES)[number]

interface UpdateJobStatusInput {
  jobId: string
  status: JobStatus
}

interface ActionResult {
  success: boolean
  message?: string
}

export async function updateJobStatus({
  jobId,
  status,
}: UpdateJobStatusInput): Promise<ActionResult> {

  try {

    const session = await auth()

    if (!session?.user) {

      return {
        success: false,
        message: "Unauthorized",
      }

    }

    const orgId = (session.user as any).orgId

    if (!orgId) {

      return {
        success: false,
        message: "Organization not found",
      }

    }

    if (!VALID_STATUSES.includes(status)) {

      return {
        success: false,
        message: "Invalid status",
      }

    }

    const job = await prisma.job.findFirst({

      where: {
        id: jobId,
        orgId,
      },

      select: {
        id: true,
        status: true,
      },

    })

    if (!job) {

      return {
        success: false,
        message: "Job not found",
      }

    }

    if (job.status === status) {

      return {
        success: true,
      }

    }

    const updateData: {
      status: JobStatus
      completedDate?: Date | null
    } = {
      status,
    }

    if (status === "completed") {

      updateData.completedDate = new Date()

    }

    if (
      status === "scheduled" ||
      status === "in_progress" ||
      status === "cancelled"
    ) {

      updateData.completedDate = null

    }

    await prisma.job.update({

      where: {
        id: job.id,
      },

      data: updateData,

    })

    revalidatePath("/jobs")

    revalidatePath("/jobs/board")

    revalidatePath(`/jobs/${job.id}`)

    return {
      success: true,
    }

  } catch (error) {

    console.error("Failed to update job status:", error)

    return {

      success: false,

      message:
        "An unexpected error occurred.",

    }

  }

}

export async function moveJob(
  jobId: string,
  status: JobStatus
): Promise<ActionResult> {

  return updateJobStatus({
    jobId,
    status,
  })

}