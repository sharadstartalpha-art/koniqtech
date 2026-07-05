"use server"

import {
  LeaveStatus,
  LeaveType,
  UserRole
} from "@prisma/client"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"


// ============================================================
// TYPES
// ============================================================

export type LeaveActionErrors = {
  employeeId?: string
  leaveType?: string
  startDate?: string
  endDate?: string
  totalDays?: string
  reason?: string
  attachment?: string
  managerRemarks?: string
  form?: string
}


export type LeaveActionState = {
  success: boolean
  message: string
  leaveId?: string
  errors?: LeaveActionErrors
}


type ParsedLeaveData = {
  employeeId: string

  leaveType: LeaveType

  startDate: Date
  endDate: Date

  totalDays: number

  reason: string

  attachment: string | null

  managerRemarks: string | null
}


// ============================================================
// ACCESS ROLES
// ============================================================

const MANAGE_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


const APPROVE_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


// ============================================================
// VALID LEAVE TYPES
// ============================================================

const VALID_LEAVE_TYPES: LeaveType[] = [
  LeaveType.casual,
  LeaveType.sick,
  LeaveType.earned,
  LeaveType.unpaid,
  LeaveType.maternity,
  LeaveType.paternity,
  LeaveType.emergency
]


// ============================================================
// AUTH HELPERS
// ============================================================

async function getAuthenticatedUser() {

  const session =
    await auth()


  if (
    !session?.user?.id ||
    !session.user.role
  ) {
    return null
  }


  return {
    id:
      session.user.id,

    role:
      session.user.role as UserRole
  }
}


async function requireManageAccess() {

  const user =
    await getAuthenticatedUser()


  if (
    !user ||
    !MANAGE_ROLES.includes(
      user.role
    )
  ) {
    return null
  }


  return user
}


async function requireApprovalAccess() {

  const user =
    await getAuthenticatedUser()


  if (
    !user ||
    !APPROVE_ROLES.includes(
      user.role
    )
  ) {
    return null
  }


  return user
}


// ============================================================
// FORM HELPERS
// ============================================================

function getStringValue(
  formData: FormData,
  key: string
) {

  const value =
    formData.get(key)


  if (
    typeof value !== "string"
  ) {
    return ""
  }


  return value.trim()
}


function getNullableString(
  formData: FormData,
  key: string
) {

  const value =
    getStringValue(
      formData,
      key
    )


  return value || null
}


// ============================================================
// DATE HELPERS
// ============================================================

function parseDateValue(
  value: string
): Date | null {

  if (!value) {
    return null
  }


  const date =
    new Date(
      `${value}T00:00:00.000Z`
    )


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null
  }


  return date
}


// ============================================================
// TOTAL DAYS
// ============================================================

function calculateTotalDays(
  startDate: Date,
  endDate: Date
) {

  const millisecondsPerDay =
    1000 * 60 * 60 * 24


  const difference =
    endDate.getTime() -
    startDate.getTime()


  return (
    Math.floor(
      difference /
      millisecondsPerDay
    ) + 1
  )
}


// ============================================================
// VALIDATE FORM
// ============================================================

function validateLeaveForm(
  formData: FormData
):
  | {
      success: true
      data: ParsedLeaveData
    }
  | {
      success: false
      errors: LeaveActionErrors
    } {

  const errors:
    LeaveActionErrors = {}


  // ----------------------------------------------------------
  // EMPLOYEE
  // ----------------------------------------------------------

  const employeeId =
    getStringValue(
      formData,
      "employeeId"
    )


  if (!employeeId) {
    errors.employeeId =
      "Please select an employee."
  }


  // ----------------------------------------------------------
  // LEAVE TYPE
  // ----------------------------------------------------------

  const leaveTypeValue =
    getStringValue(
      formData,
      "leaveType"
    )


  if (
    !VALID_LEAVE_TYPES.includes(
      leaveTypeValue as LeaveType
    )
  ) {
    errors.leaveType =
      "Please select a valid leave type."
  }


  // ----------------------------------------------------------
  // START DATE
  // ----------------------------------------------------------

  const startDateValue =
    getStringValue(
      formData,
      "startDate"
    )


  const startDate =
    parseDateValue(
      startDateValue
    )


  if (!startDate) {
    errors.startDate =
      "Please enter a valid start date."
  }


  // ----------------------------------------------------------
  // END DATE
  // ----------------------------------------------------------

  const endDateValue =
    getStringValue(
      formData,
      "endDate"
    )


  const endDate =
    parseDateValue(
      endDateValue
    )


  if (!endDate) {
    errors.endDate =
      "Please enter a valid end date."
  }


  if (
    startDate &&
    endDate &&
    endDate < startDate
  ) {
    errors.endDate =
      "End date cannot be before the start date."
  }


  // ----------------------------------------------------------
  // REASON
  // ----------------------------------------------------------

  const reason =
    getStringValue(
      formData,
      "reason"
    )


  if (!reason) {

    errors.reason =
      "Please enter the reason for leave."

  } else if (
    reason.length < 3
  ) {

    errors.reason =
      "Leave reason must contain at least 3 characters."

  } else if (
    reason.length > 2000
  ) {

    errors.reason =
      "Leave reason cannot exceed 2000 characters."
  }


  // ----------------------------------------------------------
  // ATTACHMENT
  // ----------------------------------------------------------

  const attachment =
    getNullableString(
      formData,
      "attachment"
    )


  if (
    attachment &&
    attachment.length > 2000
  ) {
    errors.attachment =
      "Attachment URL is too long."
  }


  // ----------------------------------------------------------
  // MANAGER REMARKS
  // ----------------------------------------------------------

  const managerRemarks =
    getNullableString(
      formData,
      "managerRemarks"
    )


  if (
    managerRemarks &&
    managerRemarks.length > 2000
  ) {
    errors.managerRemarks =
      "Manager remarks cannot exceed 2000 characters."
  }


  // ----------------------------------------------------------
  // VALIDATION RESULT
  // ----------------------------------------------------------

  if (
    Object.keys(errors).length > 0 ||
    !startDate ||
    !endDate
  ) {
    return {
      success: false,
      errors
    }
  }


  const totalDays =
    calculateTotalDays(
      startDate,
      endDate
    )


  if (
    totalDays <= 0 ||
    !Number.isFinite(totalDays)
  ) {
    return {
      success: false,

      errors: {
        totalDays:
          "Unable to calculate leave duration."
      }
    }
  }


  return {
    success: true,

    data: {
      employeeId,

      leaveType:
        leaveTypeValue as LeaveType,

      startDate,

      endDate,

      totalDays,

      reason,

      attachment,

      managerRemarks
    }
  }
}


// ============================================================
// REVALIDATE LEAVE PATHS
// ============================================================

function revalidateLeavePaths(
  leaveId?: string,
  employeeId?: string
) {

  revalidatePath(
    "/admin/leave"
  )


  if (leaveId) {

    revalidatePath(
      `/admin/leave/${leaveId}`
    )

    revalidatePath(
      `/admin/leave/${leaveId}/edit`
    )
  }


  if (employeeId) {

    revalidatePath(
      `/admin/employees/${employeeId}`
    )
  }
}


// ============================================================
// CREATE LEAVE
// ============================================================

export async function createLeaveAction(
  formData: FormData
): Promise<LeaveActionState> {

  const user =
    await requireManageAccess()


  if (!user) {
    return {
      success: false,

      message:
        "You do not have permission to create leave requests."
    }
  }


  const validation =
    validateLeaveForm(
      formData
    )


  if (!validation.success) {
    return {
      success: false,

      message:
        "Please correct the highlighted fields.",

      errors:
        validation.errors
    }
  }


  const data =
    validation.data


  try {

    // --------------------------------------------------------
    // VERIFY EMPLOYEE
    // --------------------------------------------------------

    const employee =
      await prisma.employee.findUnique({

        where: {
          id:
            data.employeeId
        },

        select: {
          id: true
        }

      })


    if (!employee) {
      return {
        success: false,

        message:
          "The selected employee could not be found.",

        errors: {
          employeeId:
            "Selected employee does not exist."
        }
      }
    }


    // --------------------------------------------------------
    // OVERLAPPING LEAVE CHECK
    // --------------------------------------------------------

    const overlappingLeave =
      await prisma.employeeLeave.findFirst({

        where: {

          employeeId:
            data.employeeId,

          status: {
            in: [
              LeaveStatus.pending,
              LeaveStatus.approved
            ]
          },

          startDate: {
            lte:
              data.endDate
          },

          endDate: {
            gte:
              data.startDate
          }

        },

        select: {
          id: true
        }

      })


    if (overlappingLeave) {
      return {
        success: false,

        message:
          "This employee already has an overlapping pending or approved leave request.",

        errors: {
          startDate:
            "The selected dates overlap an existing active leave request.",

          endDate:
            "The selected dates overlap an existing active leave request."
        }
      }
    }


    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    const leave =
      await prisma.employeeLeave.create({

        data: {

          employeeId:
            data.employeeId,

          leaveType:
            data.leaveType,

          startDate:
            data.startDate,

          endDate:
            data.endDate,

          totalDays:
            data.totalDays,

          reason:
            data.reason,

          attachment:
            data.attachment,

          status:
            LeaveStatus.pending,

          managerRemarks:
            data.managerRemarks,

          approvedBy:
            null,

          approvedAt:
            null,

          cancelledAt:
            null

        },

        select: {
          id: true
        }

      })


    revalidateLeavePaths(
      leave.id,
      data.employeeId
    )


    return {
      success: true,

      message:
        "Leave request created successfully.",

      leaveId:
        leave.id
    }

  } catch (error) {

    console.error(
      "CREATE_EMPLOYEE_LEAVE_ERROR",
      error
    )


    return {
      success: false,

      message:
        "Unable to create the leave request. Please try again.",

      errors: {
        form:
          "An unexpected database error occurred."
      }
    }
  }
}


// ============================================================
// UPDATE LEAVE
// ============================================================

export async function updateLeaveAction(
  leaveId: string,
  formData: FormData
): Promise<LeaveActionState> {

  const user =
    await requireManageAccess()


  if (!user) {
    return {
      success: false,

      message:
        "You do not have permission to update leave requests."
    }
  }


  if (!leaveId) {
    return {
      success: false,

      message:
        "Leave request ID is missing."
    }
  }


  const validation =
    validateLeaveForm(
      formData
    )


  if (!validation.success) {
    return {
      success: false,

      message:
        "Please correct the highlighted fields.",

      errors:
        validation.errors
    }
  }


  const data =
    validation.data


  try {

    // --------------------------------------------------------
    // EXISTING LEAVE
    // --------------------------------------------------------

    const existingLeave =
      await prisma.employeeLeave.findUnique({

        where: {
          id:
            leaveId
        },

        select: {
          id: true,

          employeeId: true,

          status: true
        }

      })


    if (!existingLeave) {
      return {
        success: false,

        message:
          "Leave request could not be found."
      }
    }


    // --------------------------------------------------------
    // PREVENT EDITING CANCELLED LEAVE
    // --------------------------------------------------------

    if (
      existingLeave.status ===
      LeaveStatus.cancelled
    ) {
      return {
        success: false,

        message:
          "Cancelled leave requests cannot be edited."
      }
    }


    // --------------------------------------------------------
    // VERIFY EMPLOYEE
    // --------------------------------------------------------

    const employee =
      await prisma.employee.findUnique({

        where: {
          id:
            data.employeeId
        },

        select: {
          id: true
        }

      })


    if (!employee) {
      return {
        success: false,

        message:
          "The selected employee could not be found.",

        errors: {
          employeeId:
            "Selected employee does not exist."
        }
      }
    }


    // --------------------------------------------------------
    // OVERLAP CHECK
    // --------------------------------------------------------

    const overlappingLeave =
      await prisma.employeeLeave.findFirst({

        where: {

          employeeId:
            data.employeeId,

          id: {
            not:
              leaveId
          },

          status: {
            in: [
              LeaveStatus.pending,
              LeaveStatus.approved
            ]
          },

          startDate: {
            lte:
              data.endDate
          },

          endDate: {
            gte:
              data.startDate
          }

        },

        select: {
          id: true
        }

      })


    if (overlappingLeave) {
      return {
        success: false,

        message:
          "This employee already has another overlapping pending or approved leave request.",

        errors: {
          startDate:
            "The selected dates overlap another active leave request.",

          endDate:
            "The selected dates overlap another active leave request."
        }
      }
    }


    // --------------------------------------------------------
    // UPDATE
    //
    // IMPORTANT:
    // Editing working leave data resets approval to pending.
    // --------------------------------------------------------

    await prisma.employeeLeave.update({

      where: {
        id:
          leaveId
      },

      data: {

        employeeId:
          data.employeeId,

        leaveType:
          data.leaveType,

        startDate:
          data.startDate,

        endDate:
          data.endDate,

        totalDays:
          data.totalDays,

        reason:
          data.reason,

        attachment:
          data.attachment,

        status:
          LeaveStatus.pending,

        managerRemarks:
          null,

        approvedBy:
          null,

        approvedAt:
          null,

        cancelledAt:
          null

      }

    })


    revalidateLeavePaths(
      leaveId,
      existingLeave.employeeId
    )


    if (
      existingLeave.employeeId !==
      data.employeeId
    ) {
      revalidateLeavePaths(
        leaveId,
        data.employeeId
      )
    }


    return {
      success: true,

      message:
        "Leave request updated and returned to pending approval.",

      leaveId
    }

  } catch (error) {

    console.error(
      "UPDATE_EMPLOYEE_LEAVE_ERROR",
      error
    )


    return {
      success: false,

      message:
        "Unable to update the leave request. Please try again.",

      errors: {
        form:
          "An unexpected database error occurred."
      }
    }
  }
}


// ============================================================
// GET APPROVER EMPLOYEE
// ============================================================

async function getApproverEmployee(
  userId: string
) {

  return prisma.employee.findUnique({

    where: {
      userId
    },

    select: {
      id: true
    }

  })
}


// ============================================================
// APPROVE LEAVE
// ============================================================

export async function approveLeaveAction(
  leaveId: string,
  managerRemarks?: string
): Promise<LeaveActionState> {

  const user =
    await requireApprovalAccess()


  if (!user) {
    return {
      success: false,

      message:
        "You do not have permission to approve leave requests."
    }
  }


  if (!leaveId) {
    return {
      success: false,

      message:
        "Leave request ID is missing."
    }
  }


  try {

    const approver =
      await getApproverEmployee(
        user.id
      )


    if (!approver) {
      return {
        success: false,

        message:
          "Your account is not linked to an internal employee record."
      }
    }


    const leave =
      await prisma.employeeLeave.findUnique({

        where: {
          id:
            leaveId
        },

        select: {
          id: true,

          employeeId: true,

          status: true
        }

      })


    if (!leave) {
      return {
        success: false,

        message:
          "Leave request could not be found."
      }
    }


    if (
      leave.status !==
      LeaveStatus.pending
    ) {
      return {
        success: false,

        message:
          "Only pending leave requests can be approved."
      }
    }


    await prisma.employeeLeave.update({

      where: {
        id:
          leaveId
      },

      data: {

        status:
          LeaveStatus.approved,

        approvedBy:
          approver.id,

        approvedAt:
          new Date(),

        cancelledAt:
          null,

        managerRemarks:
          managerRemarks?.trim() ||
          null

      }

    })


    revalidateLeavePaths(
      leaveId,
      leave.employeeId
    )


    return {
      success: true,

      message:
        "Leave request approved successfully.",

      leaveId
    }

  } catch (error) {

    console.error(
      "APPROVE_EMPLOYEE_LEAVE_ERROR",
      error
    )


    return {
      success: false,

      message:
        "Unable to approve the leave request. Please try again."
    }
  }
}


// ============================================================
// REJECT LEAVE
// ============================================================

export async function rejectLeaveAction(
  leaveId: string,
  managerRemarks: string
): Promise<LeaveActionState> {

  const user =
    await requireApprovalAccess()


  if (!user) {
    return {
      success: false,

      message:
        "You do not have permission to reject leave requests."
    }
  }


  if (!leaveId) {
    return {
      success: false,

      message:
        "Leave request ID is missing."
    }
  }


  const remarks =
    managerRemarks.trim()


  if (!remarks) {
    return {
      success: false,

      message:
        "Manager remarks are required when rejecting leave.",

      errors: {
        managerRemarks:
          "Please enter the rejection reason."
      }
    }
  }


  if (
    remarks.length > 2000
  ) {
    return {
      success: false,

      message:
        "Manager remarks are too long.",

      errors: {
        managerRemarks:
          "Manager remarks cannot exceed 2000 characters."
      }
    }
  }


  try {

    const approver =
      await getApproverEmployee(
        user.id
      )


    if (!approver) {
      return {
        success: false,

        message:
          "Your account is not linked to an internal employee record."
      }
    }


    const leave =
      await prisma.employeeLeave.findUnique({

        where: {
          id:
            leaveId
        },

        select: {
          id: true,

          employeeId: true,

          status: true
        }

      })


    if (!leave) {
      return {
        success: false,

        message:
          "Leave request could not be found."
      }
    }


    if (
      leave.status !==
      LeaveStatus.pending
    ) {
      return {
        success: false,

        message:
          "Only pending leave requests can be rejected."
      }
    }


    await prisma.employeeLeave.update({

      where: {
        id:
          leaveId
      },

      data: {

        status:
          LeaveStatus.rejected,

        approvedBy:
          approver.id,

        approvedAt:
          new Date(),

        cancelledAt:
          null,

        managerRemarks:
          remarks

      }

    })


    revalidateLeavePaths(
      leaveId,
      leave.employeeId
    )


    return {
      success: true,

      message:
        "Leave request rejected successfully.",

      leaveId
    }

  } catch (error) {

    console.error(
      "REJECT_EMPLOYEE_LEAVE_ERROR",
      error
    )


    return {
      success: false,

      message:
        "Unable to reject the leave request. Please try again."
    }
  }
}


// ============================================================
// CANCEL LEAVE
// ============================================================

export async function cancelLeaveAction(
  leaveId: string
): Promise<LeaveActionState> {

  const user =
    await requireManageAccess()


  if (!user) {
    return {
      success: false,

      message:
        "You do not have permission to cancel leave requests."
    }
  }


  if (!leaveId) {
    return {
      success: false,

      message:
        "Leave request ID is missing."
    }
  }


  try {

    const leave =
      await prisma.employeeLeave.findUnique({

        where: {
          id:
            leaveId
        },

        select: {
          id: true,

          employeeId: true,

          status: true
        }

      })


    if (!leave) {
      return {
        success: false,

        message:
          "Leave request could not be found."
      }
    }


    if (
      leave.status ===
      LeaveStatus.cancelled
    ) {
      return {
        success: false,

        message:
          "This leave request is already cancelled."
      }
    }


    await prisma.employeeLeave.update({

      where: {
        id:
          leaveId
      },

      data: {

        status:
          LeaveStatus.cancelled,

        cancelledAt:
          new Date()

      }

    })


    revalidateLeavePaths(
      leaveId,
      leave.employeeId
    )


    return {
      success: true,

      message:
        "Leave request cancelled successfully.",

      leaveId
    }

  } catch (error) {

    console.error(
      "CANCEL_EMPLOYEE_LEAVE_ERROR",
      error
    )


    return {
      success: false,

      message:
        "Unable to cancel the leave request. Please try again."
    }
  }
}


// ============================================================
// RESET TO PENDING
// ============================================================

export async function resetLeaveToPendingAction(
  leaveId: string
): Promise<LeaveActionState> {

  const user =
    await requireApprovalAccess()


  if (!user) {
    return {
      success: false,

      message:
        "You do not have permission to reset leave decisions."
    }
  }


  if (!leaveId) {
    return {
      success: false,

      message:
        "Leave request ID is missing."
    }
  }


  try {

    const leave =
      await prisma.employeeLeave.findUnique({

        where: {
          id:
            leaveId
        },

        select: {
          id: true,

          employeeId: true,

          status: true
        }

      })


    if (!leave) {
      return {
        success: false,

        message:
          "Leave request could not be found."
      }
    }


    if (
      leave.status ===
      LeaveStatus.pending
    ) {
      return {
        success: false,

        message:
          "This leave request is already pending."
      }
    }


    await prisma.employeeLeave.update({

      where: {
        id:
          leaveId
      },

      data: {

        status:
          LeaveStatus.pending,

        approvedBy:
          null,

        approvedAt:
          null,

        cancelledAt:
          null,

        managerRemarks:
          null

      }

    })


    revalidateLeavePaths(
      leaveId,
      leave.employeeId
    )


    return {
      success: true,

      message:
        "Leave request reset to pending successfully.",

      leaveId
    }

  } catch (error) {

    console.error(
      "RESET_EMPLOYEE_LEAVE_ERROR",
      error
    )


    return {
      success: false,

      message:
        "Unable to reset the leave request. Please try again."
    }
  }
}


// ============================================================
// DELETE LEAVE
// ============================================================

export async function deleteLeaveAction(
  leaveId: string
): Promise<LeaveActionState> {

  const user =
    await requireManageAccess()


  if (!user) {
    return {
      success: false,

      message:
        "You do not have permission to delete leave requests."
    }
  }


  if (!leaveId) {
    return {
      success: false,

      message:
        "Leave request ID is missing."
    }
  }


  try {

    const leave =
      await prisma.employeeLeave.findUnique({

        where: {
          id:
            leaveId
        },

        select: {
          id: true,

          employeeId: true
        }

      })


    if (!leave) {
      return {
        success: false,

        message:
          "Leave request could not be found."
      }
    }


    await prisma.employeeLeave.delete({

      where: {
        id:
          leaveId
      }

    })


    revalidateLeavePaths(
      undefined,
      leave.employeeId
    )


    return {
      success: true,

      message:
        "Leave request deleted successfully."
    }

  } catch (error) {

    console.error(
      "DELETE_EMPLOYEE_LEAVE_ERROR",
      error
    )


    return {
      success: false,

      message:
        "Unable to delete the leave request. Please try again."
    }
  }
}