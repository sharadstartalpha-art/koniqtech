"use server"

import {
  DemoFollowUpStatus,
  DemoFollowUpType,
} from "@prisma/client"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"



/* =========================================================
   TYPES
========================================================= */

export type FollowUpActionState = {
  success: boolean
  message: string
  followUpId?: string
}

/* =========================================================
   CONSTANTS
========================================================= */

const ALLOWED_TYPES = new Set<string>(
  Object.values(DemoFollowUpType)
)

const ALLOWED_STATUSES = new Set<string>(
  Object.values(DemoFollowUpStatus)
)

/* =========================================================
   HELPERS
========================================================= */

function getString(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(key) ?? ""
  ).trim()
}

function getOptionalString(
  formData: FormData,
  key: string
) {
  const value = String(
    formData.get(key) ?? ""
  ).trim()

  return value || null
}

function parseDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

/* =========================================================
   GET CURRENT MARKETING EMPLOYEE
========================================================= */

async function getCurrentMarketingEmployee() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const employee =
    await prisma.employee.findFirst({
      where: {
        userId: session.user.id,
        active: true,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,

        role: {
          select: {
            name: true,
          },
        },

        department: {
          select: {
            name: true,
          },
        },
      },
    })

  if (!employee) {
    throw new Error(
      "Marketing employee profile not found"
    )
  }

  return {
    session,
    employee,
  }
}

/* =========================================================
   REVALIDATE FOLLOW-UP PAGES
========================================================= */

function revalidateFollowUpPages(
  followUpId?: string,
  demoScheduleId?: string
) {
  revalidatePath(
    "/admin/marketing/dashboard"
  )

  revalidatePath(
    "/admin/marketing/follow-ups"
  )

  revalidatePath(
    "/admin/marketing/calendar"
  )

  revalidatePath(
    "/admin/marketing/demos"
  )

  if (followUpId) {
    revalidatePath(
      `/admin/marketing/follow-ups/${followUpId}`
    )
  }

  if (demoScheduleId) {
    revalidatePath(
      `/admin/marketing/demos/${demoScheduleId}`
    )
  }
}

/* =========================================================
   CREATE FOLLOW-UP
========================================================= */

export async function createFollowUpAction(
  _previousState: FollowUpActionState,
  formData: FormData
): Promise<FollowUpActionState> {
  try {
    const { employee } =
      await getCurrentMarketingEmployee()

    const demoScheduleId = getString(
      formData,
      "demoScheduleId"
    )

    const followUpDateValue = getString(
      formData,
      "followUpDate"
    )

    const typeValue = getString(
      formData,
      "type"
    )

    const statusValue =
      getString(formData, "status") ||
      DemoFollowUpStatus.pending

    const outcome = getOptionalString(
      formData,
      "outcome"
    )

    const notes = getOptionalString(
      formData,
      "notes"
    )

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (!demoScheduleId) {
      return {
        success: false,
        message: "Demo schedule is required.",
      }
    }

    if (!followUpDateValue) {
      return {
        success: false,
        message: "Follow-up date is required.",
      }
    }

    const followUpDate =
      parseDateTime(followUpDateValue)

    if (!followUpDate) {
      return {
        success: false,
        message: "Invalid follow-up date.",
      }
    }

    if (!ALLOWED_TYPES.has(typeValue)) {
      return {
        success: false,
        message: "Invalid follow-up type.",
      }
    }

    if (
      !ALLOWED_STATUSES.has(statusValue)
    ) {
      return {
        success: false,
        message: "Invalid follow-up status.",
      }
    }

    /* -----------------------------------------------------
       VERIFY DEMO OWNERSHIP
    ----------------------------------------------------- */

    const demo =
      await prisma.demoSchedule.findFirst({
        where: {
          id: demoScheduleId,
          marketingEmployeeId: employee.id,
        },

        select: {
          id: true,
          companyId: true,
          marketingEmployeeId: true,
        },
      })

    if (!demo) {
      return {
        success: false,
        message:
          "Demo schedule not found or access denied.",
      }
    }

    /* -----------------------------------------------------
       CREATE
    ----------------------------------------------------- */

    const followUp =
      await prisma.demoFollowUp.create({
        data: {
          demoScheduleId: demo.id,

          marketingEmployeeId:
            employee.id,

          followUpDate,

          type:
            typeValue as DemoFollowUpType,

          status:
            statusValue as DemoFollowUpStatus,

          outcome,

          notes,
        },

        select: {
          id: true,
          demoScheduleId: true,
        },
      })

    revalidateFollowUpPages(
      followUp.id,
      followUp.demoScheduleId
    )

    return {
      success: true,
      message:
        "Follow-up created successfully.",
      followUpId: followUp.id,
    }
  } catch (error) {
    console.error(
      "CREATE FOLLOW-UP ERROR:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create follow-up.",
    }
  }
}

/* =========================================================
   UPDATE FOLLOW-UP
========================================================= */

export async function updateFollowUpAction(
 previousState: {
    success: boolean
    message: string
  },
  formData: FormData
): Promise<FollowUpActionState> {
  try {
    const { employee } =
      await getCurrentMarketingEmployee()

    const followUpId = getString(
      formData,
      "followUpId"
    )

    const followUpDateValue = getString(
      formData,
      "followUpDate"
    )

    const typeValue = getString(
      formData,
      "type"
    )

    const statusValue = getString(
      formData,
      "status"
    )

    const outcome = getOptionalString(
      formData,
      "outcome"
    )

    const notes = getOptionalString(
      formData,
      "notes"
    )

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (!followUpId) {
      return {
        success: false,
        message: "Follow-up ID is required.",
      }
    }

    const followUpDate =
      parseDateTime(followUpDateValue)

    if (!followUpDate) {
      return {
        success: false,
        message: "Invalid follow-up date.",
      }
    }

    if (!ALLOWED_TYPES.has(typeValue)) {
      return {
        success: false,
        message: "Invalid follow-up type.",
      }
    }

    if (
      !ALLOWED_STATUSES.has(statusValue)
    ) {
      return {
        success: false,
        message: "Invalid follow-up status.",
      }
    }

    /* -----------------------------------------------------
       VERIFY OWNERSHIP
    ----------------------------------------------------- */

    const existing =
      await prisma.demoFollowUp.findFirst({
        where: {
          id: followUpId,

          marketingEmployeeId:
            employee.id,
        },

        select: {
          id: true,
          demoScheduleId: true,
        },
      })

    if (!existing) {
      return {
        success: false,
        message:
          "Follow-up not found or access denied.",
      }
    }

    /* -----------------------------------------------------
       UPDATE
    ----------------------------------------------------- */

    await prisma.demoFollowUp.update({
      where: {
        id: existing.id,
      },

      data: {
        followUpDate,

        type:
          typeValue as DemoFollowUpType,

        status:
          statusValue as DemoFollowUpStatus,

        outcome,

        notes,
      },
    })

    revalidateFollowUpPages(
      existing.id,
      existing.demoScheduleId
    )

    return {
      success: true,
      message:
        "Follow-up updated successfully.",
      followUpId: existing.id,
    }
  } catch (error) {
    console.error(
      "UPDATE FOLLOW-UP ERROR:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update follow-up.",
    }
  }
}

/* =========================================================
   UPDATE STATUS ONLY
========================================================= */

export async function updateFollowUpStatusAction(
  followUpId: string,
  status: DemoFollowUpStatus
): Promise<FollowUpActionState> {
  try {
    const { employee } =
      await getCurrentMarketingEmployee()

    if (
      !ALLOWED_STATUSES.has(status)
    ) {
      return {
        success: false,
        message: "Invalid follow-up status.",
      }
    }

    const existing =
      await prisma.demoFollowUp.findFirst({
        where: {
          id: followUpId,

          marketingEmployeeId:
            employee.id,
        },

        select: {
          id: true,
          demoScheduleId: true,
        },
      })

    if (!existing) {
      return {
        success: false,
        message:
          "Follow-up not found or access denied.",
      }
    }

    await prisma.demoFollowUp.update({
      where: {
        id: existing.id,
      },

      data: {
        status,
      },
    })

    revalidateFollowUpPages(
      existing.id,
      existing.demoScheduleId
    )

    return {
      success: true,
      message:
        "Follow-up status updated.",
      followUpId: existing.id,
    }
  } catch (error) {
    console.error(
      "UPDATE FOLLOW-UP STATUS ERROR:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update follow-up status.",
    }
  }
}

/* =========================================================
   COMPLETE FOLLOW-UP
========================================================= */

export async function completeFollowUpAction(
  followUpId: string,
  outcome?: string
): Promise<FollowUpActionState> {
  try {
    const { employee } =
      await getCurrentMarketingEmployee()

    const existing =
      await prisma.demoFollowUp.findFirst({
        where: {
          id: followUpId,

          marketingEmployeeId:
            employee.id,
        },

        select: {
          id: true,
          demoScheduleId: true,
        },
      })

    if (!existing) {
      return {
        success: false,
        message:
          "Follow-up not found or access denied.",
      }
    }

    await prisma.demoFollowUp.update({
      where: {
        id: existing.id,
      },

      data: {
        status:
          DemoFollowUpStatus.completed,

        outcome:
          outcome?.trim() || null,
      },
    })

    revalidateFollowUpPages(
      existing.id,
      existing.demoScheduleId
    )

    return {
      success: true,
      message:
        "Follow-up marked as completed.",
      followUpId: existing.id,
    }
  } catch (error) {
    console.error(
      "COMPLETE FOLLOW-UP ERROR:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to complete follow-up.",
    }
  }
}

/* =========================================================
   MARK DEAL WON
========================================================= */

export async function markFollowUpWonAction(
  followUpId: string,
  outcome?: string
): Promise<FollowUpActionState> {
  try {
    const { employee } =
      await getCurrentMarketingEmployee()

    const existing =
      await prisma.demoFollowUp.findFirst({
        where: {
          id: followUpId,

          marketingEmployeeId:
            employee.id,
        },

        select: {
          id: true,
          demoScheduleId: true,
        },
      })

    if (!existing) {
      return {
        success: false,
        message:
          "Follow-up not found or access denied.",
      }
    }

    await prisma.demoFollowUp.update({
      where: {
        id: existing.id,
      },

      data: {
        status:
          DemoFollowUpStatus.won,

        outcome:
          outcome?.trim() ||
          "Deal marked as won",
      },
    })

    revalidateFollowUpPages(
      existing.id,
      existing.demoScheduleId
    )

    return {
      success: true,
      message: "Deal marked as won.",
      followUpId: existing.id,
    }
  } catch (error) {
    console.error(
      "MARK FOLLOW-UP WON ERROR:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to mark deal as won.",
    }
  }
}

/* =========================================================
   MARK DEAL LOST
========================================================= */

export async function markFollowUpLostAction(
  followUpId: string,
  outcome?: string
): Promise<FollowUpActionState> {
  try {
    const { employee } =
      await getCurrentMarketingEmployee()

    const existing =
      await prisma.demoFollowUp.findFirst({
        where: {
          id: followUpId,

          marketingEmployeeId:
            employee.id,
        },

        select: {
          id: true,
          demoScheduleId: true,
        },
      })

    if (!existing) {
      return {
        success: false,
        message:
          "Follow-up not found or access denied.",
      }
    }

    await prisma.demoFollowUp.update({
      where: {
        id: existing.id,
      },

      data: {
        status:
          DemoFollowUpStatus.lost,

        outcome:
          outcome?.trim() ||
          "Deal marked as lost",
      },
    })

    revalidateFollowUpPages(
      existing.id,
      existing.demoScheduleId
    )

    return {
      success: true,
      message: "Deal marked as lost.",
      followUpId: existing.id,
    }
  } catch (error) {
    console.error(
      "MARK FOLLOW-UP LOST ERROR:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to mark deal as lost.",
    }
  }
}

/* =========================================================
   SCHEDULE NEXT FOLLOW-UP
========================================================= */

export async function scheduleNextFollowUpAction(
  _previousState: FollowUpActionState,
  formData: FormData
): Promise<FollowUpActionState> {
  try {
    const { employee } =
      await getCurrentMarketingEmployee()

    const currentFollowUpId = getString(
      formData,
      "currentFollowUpId"
    )

    const followUpDateValue = getString(
      formData,
      "followUpDate"
    )

    const typeValue = getString(
      formData,
      "type"
    )

    const notes = getOptionalString(
      formData,
      "notes"
    )

    if (!currentFollowUpId) {
      return {
        success: false,
        message:
          "Current follow-up ID is required.",
      }
    }

    const followUpDate =
      parseDateTime(followUpDateValue)

    if (!followUpDate) {
      return {
        success: false,
        message: "Invalid follow-up date.",
      }
    }

    if (!ALLOWED_TYPES.has(typeValue)) {
      return {
        success: false,
        message: "Invalid follow-up type.",
      }
    }

    /* -----------------------------------------------------
       CURRENT FOLLOW-UP
    ----------------------------------------------------- */

    const current =
      await prisma.demoFollowUp.findFirst({
        where: {
          id: currentFollowUpId,

          marketingEmployeeId:
            employee.id,
        },

        select: {
          id: true,
          demoScheduleId: true,
        },
      })

    if (!current) {
      return {
        success: false,
        message:
          "Current follow-up not found or access denied.",
      }
    }

    /* -----------------------------------------------------
       CREATE NEXT FOLLOW-UP
    ----------------------------------------------------- */

    const nextFollowUp =
      await prisma.demoFollowUp.create({
        data: {
          demoScheduleId:
            current.demoScheduleId,

          marketingEmployeeId:
            employee.id,

          followUpDate,

          type:
            typeValue as DemoFollowUpType,

          status:
            DemoFollowUpStatus.pending,

          notes,
        },

        select: {
          id: true,
          demoScheduleId: true,
        },
      })

    revalidateFollowUpPages(
      nextFollowUp.id,
      nextFollowUp.demoScheduleId
    )

    return {
      success: true,
      message:
        "Next follow-up scheduled successfully.",
      followUpId: nextFollowUp.id,
    }
  } catch (error) {
    console.error(
      "SCHEDULE NEXT FOLLOW-UP ERROR:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to schedule next follow-up.",
    }
  }
}

/* =========================================================
   DELETE FOLLOW-UP
========================================================= */

export async function deleteFollowUpAction(
  followUpId: string
): Promise<FollowUpActionState> {
  try {
    const { employee } =
      await getCurrentMarketingEmployee()

    const existing =
      await prisma.demoFollowUp.findFirst({
        where: {
          id: followUpId,

          marketingEmployeeId:
            employee.id,
        },

        select: {
          id: true,
          demoScheduleId: true,
        },
      })

    if (!existing) {
      return {
        success: false,
        message:
          "Follow-up not found or access denied.",
      }
    }

    await prisma.demoFollowUp.delete({
      where: {
        id: existing.id,
      },
    })

    revalidateFollowUpPages(
      undefined,
      existing.demoScheduleId
    )

    return {
      success: true,
      message:
        "Follow-up deleted successfully.",
    }
  } catch (error) {
    console.error(
      "DELETE FOLLOW-UP ERROR:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete follow-up.",
    }
  }
}