"use server"

import {
  AttendanceStatus,
  UserRole
} from "@prisma/client"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"


// ============================================================
// TYPES
// ============================================================

export type AttendanceActionErrors = {
  employeeId?: string
  attendanceDate?: string
  checkIn?: string
  checkOut?: string
  breakMinutes?: string
  overtimeHours?: string
  status?: string
  workLocation?: string
  latitude?: string
  longitude?: string
  ipAddress?: string
  device?: string
  remarks?: string
  approvedBy?: string
  form?: string
}


export type AttendanceActionState = {
  success: boolean
  message: string
  attendanceId?: string
  errors?: AttendanceActionErrors
}


// ============================================================
// INTERNAL TYPES
// ============================================================

type ParsedAttendanceData = {
  employeeId: string
  attendanceDate: Date

  checkIn: Date | null
  checkOut: Date | null

  breakMinutes: number
  totalHours: number | null
  overtimeHours: number

  status: AttendanceStatus

  workLocation: string | null

  latitude: number | null
  longitude: number | null

  ipAddress: string | null
  device: string | null

  remarks: string | null
}


// ============================================================
// ROLE ACCESS
// ============================================================

const VIEW_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


const MANAGE_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


const APPROVE_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


// ============================================================
// VALID ATTENDANCE STATUSES
// ============================================================

const VALID_ATTENDANCE_STATUSES: AttendanceStatus[] = [
  AttendanceStatus.present,
  AttendanceStatus.absent,
  AttendanceStatus.late,
  AttendanceStatus.half_day,
  AttendanceStatus.leave,
  AttendanceStatus.holiday,
  AttendanceStatus.weekend,
  AttendanceStatus.work_from_home
]


// ============================================================
// AUTH HELPERS
// ============================================================

async function getAuthenticatedUser() {

  const session = await auth()

  if (
    !session?.user?.id ||
    !session.user.role
  ) {
    return null
  }

  return {
    id: session.user.id,
    role: session.user.role as UserRole
  }
}


async function requireViewAccess() {

  const user = await getAuthenticatedUser()

  if (
    !user ||
    !VIEW_ROLES.includes(user.role)
  ) {
    return null
  }

  return user
}


async function requireManageAccess() {

  const user = await getAuthenticatedUser()

  if (
    !user ||
    !MANAGE_ROLES.includes(user.role)
  ) {
    return null
  }

  return user
}


async function requireApprovalAccess() {

  const user = await getAuthenticatedUser()

  if (
    !user ||
    !APPROVE_ROLES.includes(user.role)
  ) {
    return null
  }

  return user
}


// ============================================================
// VALUE HELPERS
// ============================================================

function getStringValue(
  formData: FormData,
  key: string
) {

  const value = formData.get(key)

  if (typeof value !== "string") {
    return ""
  }

  return value.trim()
}


function getNullableString(
  formData: FormData,
  key: string
) {

  const value = getStringValue(
    formData,
    key
  )

  return value || null
}


function parseOptionalNumber(
  value: string
): number | null {

  if (!value) {
    return null
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return null
  }

  return parsed
}


// ============================================================
// DATE HELPERS
// ============================================================

function parseAttendanceDate(
  value: string
): Date | null {

  if (!value) {
    return null
  }

  const date = new Date(
    `${value}T00:00:00.000Z`
  )

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}


function combineDateAndTime(
  attendanceDate: Date,
  timeValue: string
): Date | null {

  if (!timeValue) {
    return null
  }

  const [
    hoursString,
    minutesString
  ] = timeValue.split(":")

  const hours = Number(hoursString)
  const minutes = Number(minutesString)

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null
  }

  const combined = new Date(
    attendanceDate
  )

  combined.setUTCHours(
    hours,
    minutes,
    0,
    0
  )

  return combined
}


// ============================================================
// HOURS CALCULATION
// ============================================================

function calculateTotalHours(
  checkIn: Date | null,
  checkOut: Date | null,
  breakMinutes: number
): number | null {

  if (
    !checkIn ||
    !checkOut
  ) {
    return null
  }

  const differenceMs =
    checkOut.getTime() -
    checkIn.getTime()

  if (differenceMs <= 0) {
    return null
  }

  const workedMinutes =
    differenceMs / 60000 -
    breakMinutes

  if (workedMinutes < 0) {
    return null
  }

  return Number(
    (workedMinutes / 60).toFixed(2)
  )
}


// ============================================================
// VALIDATION
// ============================================================

function validateAttendanceForm(
  formData: FormData
):
  | {
      success: true
      data: ParsedAttendanceData
    }
  | {
      success: false
      errors: AttendanceActionErrors
    } {

  const errors: AttendanceActionErrors = {}

  const employeeId =
    getStringValue(
      formData,
      "employeeId"
    )

  const attendanceDateValue =
    getStringValue(
      formData,
      "attendanceDate"
    )

  const checkInValue =
    getStringValue(
      formData,
      "checkIn"
    )

  const checkOutValue =
    getStringValue(
      formData,
      "checkOut"
    )

  const breakMinutesValue =
    getStringValue(
      formData,
      "breakMinutes"
    )

  const overtimeHoursValue =
    getStringValue(
      formData,
      "overtimeHours"
    )

  const statusValue =
    getStringValue(
      formData,
      "status"
    )


  // ----------------------------------------------------------
  // EMPLOYEE
  // ----------------------------------------------------------

  if (!employeeId) {
    errors.employeeId =
      "Please select an employee."
  }


  // ----------------------------------------------------------
  // ATTENDANCE DATE
  // ----------------------------------------------------------

  const attendanceDate =
    parseAttendanceDate(
      attendanceDateValue
    )

  if (!attendanceDate) {
    errors.attendanceDate =
      "Please enter a valid attendance date."
  }


  // ----------------------------------------------------------
  // STATUS
  // ----------------------------------------------------------

  if (
    !VALID_ATTENDANCE_STATUSES.includes(
      statusValue as AttendanceStatus
    )
  ) {
    errors.status =
      "Please select a valid attendance status."
  }


  // ----------------------------------------------------------
  // BREAK MINUTES
  // ----------------------------------------------------------

  const breakMinutes =
    breakMinutesValue
      ? Number(breakMinutesValue)
      : 0

  if (
    !Number.isInteger(breakMinutes) ||
    breakMinutes < 0 ||
    breakMinutes > 1440
  ) {
    errors.breakMinutes =
      "Break minutes must be between 0 and 1440."
  }


  // ----------------------------------------------------------
  // OVERTIME HOURS
  // ----------------------------------------------------------

  const overtimeHours =
    overtimeHoursValue
      ? Number(overtimeHoursValue)
      : 0

  if (
    !Number.isFinite(overtimeHours) ||
    overtimeHours < 0
  ) {
    errors.overtimeHours =
      "Overtime hours cannot be negative."
  }


  // ----------------------------------------------------------
  // DATE-TIME VALUES
  // ----------------------------------------------------------

  let checkIn: Date | null = null
  let checkOut: Date | null = null


  if (attendanceDate) {

    if (checkInValue) {

      checkIn = combineDateAndTime(
        attendanceDate,
        checkInValue
      )

      if (!checkIn) {
        errors.checkIn =
          "Please enter a valid check-in time."
      }
    }


    if (checkOutValue) {

      checkOut = combineDateAndTime(
        attendanceDate,
        checkOutValue
      )

      if (!checkOut) {
        errors.checkOut =
          "Please enter a valid check-out time."
      }
    }
  }


  if (
    checkIn &&
    checkOut &&
    checkOut <= checkIn
  ) {
    errors.checkOut =
      "Check-out time must be after check-in time."
  }


  // ----------------------------------------------------------
  // LOCATION
  // ----------------------------------------------------------

  const latitudeValue =
    getStringValue(
      formData,
      "latitude"
    )

  const longitudeValue =
    getStringValue(
      formData,
      "longitude"
    )


  const latitude =
    parseOptionalNumber(
      latitudeValue
    )

  const longitude =
    parseOptionalNumber(
      longitudeValue
    )


  if (
    latitudeValue &&
    (
      latitude === null ||
      latitude < -90 ||
      latitude > 90
    )
  ) {
    errors.latitude =
      "Latitude must be between -90 and 90."
  }


  if (
    longitudeValue &&
    (
      longitude === null ||
      longitude < -180 ||
      longitude > 180
    )
  ) {
    errors.longitude =
      "Longitude must be between -180 and 180."
  }


  // ----------------------------------------------------------
  // RETURN ERRORS
  // ----------------------------------------------------------

  if (
    Object.keys(errors).length > 0 ||
    !attendanceDate
  ) {
    return {
      success: false,
      errors
    }
  }


  const totalHours =
    calculateTotalHours(
      checkIn,
      checkOut,
      breakMinutes
    )


  return {
    success: true,

    data: {
      employeeId,

      attendanceDate,

      checkIn,
      checkOut,

      breakMinutes,
      totalHours,

      overtimeHours,

      status:
        statusValue as AttendanceStatus,

      workLocation:
        getNullableString(
          formData,
          "workLocation"
        ),

      latitude,
      longitude,

      ipAddress:
        getNullableString(
          formData,
          "ipAddress"
        ),

      device:
        getNullableString(
          formData,
          "device"
        ),

      remarks:
        getNullableString(
          formData,
          "remarks"
        )
    }
  }
}


// ============================================================
// CREATE ATTENDANCE
// ============================================================

export async function createAttendanceAction(
  formData: FormData
): Promise<AttendanceActionState> {

  const user =
    await requireManageAccess()

  if (!user) {
    return {
      success: false,
      message:
        "You do not have permission to create attendance records."
    }
  }


  const validation =
    validateAttendanceForm(
      formData
    )


  if (!validation.success) {
    return {
      success: false,
      message:
        "Please correct the highlighted fields.",
      errors: validation.errors
    }
  }


  const data = validation.data


  try {

    const employee =
      await prisma.employee.findUnique({
        where: {
          id: data.employeeId
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


    const existingAttendance =
      await prisma.employeeAttendance.findUnique({
        where: {
          employeeId_attendanceDate: {
            employeeId:
              data.employeeId,

            attendanceDate:
              data.attendanceDate
          }
        },

        select: {
          id: true
        }
      })


    if (existingAttendance) {
      return {
        success: false,
        message:
          "Attendance already exists for this employee on the selected date.",

        errors: {
          attendanceDate:
            "An attendance record already exists for this employee and date."
        }
      }
    }


    const attendance =
      await prisma.employeeAttendance.create({
        data: {
          employeeId:
            data.employeeId,

          attendanceDate:
            data.attendanceDate,

          checkIn:
            data.checkIn,

          checkOut:
            data.checkOut,

          breakMinutes:
            data.breakMinutes,

          totalHours:
            data.totalHours,

          overtimeHours:
            data.overtimeHours,

          status:
            data.status,

          workLocation:
            data.workLocation,

          latitude:
            data.latitude,

          longitude:
            data.longitude,

          ipAddress:
            data.ipAddress,

          device:
            data.device,

          remarks:
            data.remarks
        },

        select: {
          id: true
        }
      })


    revalidatePath(
      "/admin/attendance"
    )

    revalidatePath(
      `/admin/employees/${data.employeeId}/attendance`
    )


    return {
      success: true,

      message:
        "Attendance record created successfully.",

      attendanceId:
        attendance.id
    }

  } catch (error) {

    console.error(
      "CREATE_ATTENDANCE_ERROR",
      error
    )

    return {
      success: false,

      message:
        "Unable to create the attendance record. Please try again.",

      errors: {
        form:
          "An unexpected database error occurred."
      }
    }
  }
}


// ============================================================
// UPDATE ATTENDANCE
// ============================================================

export async function updateAttendanceAction(
  attendanceId: string,
  formData: FormData
): Promise<AttendanceActionState> {

  const user =
    await requireManageAccess()

  if (!user) {
    return {
      success: false,
      message:
        "You do not have permission to update attendance records."
    }
  }


  if (!attendanceId) {
    return {
      success: false,
      message:
        "Attendance record ID is missing."
    }
  }


  const validation =
    validateAttendanceForm(
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

    const existingRecord =
      await prisma.employeeAttendance.findUnique({
        where: {
          id: attendanceId
        },

        select: {
          id: true,
          employeeId: true
        }
      })


    if (!existingRecord) {
      return {
        success: false,
        message:
          "Attendance record could not be found."
      }
    }


    const employee =
      await prisma.employee.findUnique({
        where: {
          id: data.employeeId
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


    const duplicateAttendance =
      await prisma.employeeAttendance.findFirst({
        where: {
          employeeId:
            data.employeeId,

          attendanceDate:
            data.attendanceDate,

          NOT: {
            id: attendanceId
          }
        },

        select: {
          id: true
        }
      })


    if (duplicateAttendance) {
      return {
        success: false,

        message:
          "Attendance already exists for this employee on the selected date.",

        errors: {
          attendanceDate:
            "Another attendance record already exists for this employee and date."
        }
      }
    }


    await prisma.employeeAttendance.update({
      where: {
        id: attendanceId
      },

      data: {
        employeeId:
          data.employeeId,

        attendanceDate:
          data.attendanceDate,

        checkIn:
          data.checkIn,

        checkOut:
          data.checkOut,

        breakMinutes:
          data.breakMinutes,

        totalHours:
          data.totalHours,

        overtimeHours:
          data.overtimeHours,

        status:
          data.status,

        workLocation:
          data.workLocation,

        latitude:
          data.latitude,

        longitude:
          data.longitude,

        ipAddress:
          data.ipAddress,

        device:
          data.device,

        remarks:
          data.remarks
      }
    })


    revalidatePath(
      "/admin/attendance"
    )

    revalidatePath(
      `/admin/attendance/${attendanceId}`
    )

    revalidatePath(
      `/admin/attendance/${attendanceId}/edit`
    )

    revalidatePath(
      `/admin/employees/${existingRecord.employeeId}/attendance`
    )


    if (
      existingRecord.employeeId !==
      data.employeeId
    ) {
      revalidatePath(
        `/admin/employees/${data.employeeId}/attendance`
      )
    }


    return {
      success: true,

      message:
        "Attendance record updated successfully.",

      attendanceId
    }

  } catch (error) {

    console.error(
      "UPDATE_ATTENDANCE_ERROR",
      error
    )

    return {
      success: false,

      message:
        "Unable to update the attendance record. Please try again.",

      errors: {
        form:
          "An unexpected database error occurred."
      }
    }
  }
}


// ============================================================
// DELETE ATTENDANCE
// ============================================================

export async function deleteAttendanceAction(
  attendanceId: string
): Promise<AttendanceActionState> {

  const user =
    await requireManageAccess()

  if (!user) {
    return {
      success: false,
      message:
        "You do not have permission to delete attendance records."
    }
  }


  if (!attendanceId) {
    return {
      success: false,
      message:
        "Attendance record ID is missing."
    }
  }


  try {

    const attendance =
      await prisma.employeeAttendance.findUnique({
        where: {
          id: attendanceId
        },

        select: {
          id: true,
          employeeId: true
        }
      })


    if (!attendance) {
      return {
        success: false,
        message:
          "Attendance record could not be found."
      }
    }


    await prisma.employeeAttendance.delete({
      where: {
        id: attendanceId
      }
    })


    revalidatePath(
      "/admin/attendance"
    )

    revalidatePath(
      `/admin/employees/${attendance.employeeId}/attendance`
    )


    return {
      success: true,
      message:
        "Attendance record deleted successfully."
    }

  } catch (error) {

    console.error(
      "DELETE_ATTENDANCE_ERROR",
      error
    )

    return {
      success: false,
      message:
        "Unable to delete the attendance record. Please try again."
    }
  }
}


// ============================================================
// APPROVE ATTENDANCE
// ============================================================

export async function approveAttendanceAction(
  attendanceId: string
): Promise<AttendanceActionState> {

  const user =
    await requireApprovalAccess()

  if (!user) {
    return {
      success: false,
      message:
        "You do not have permission to approve attendance records."
    }
  }


  if (!attendanceId) {
    return {
      success: false,
      message:
        "Attendance record ID is missing."
    }
  }


  try {

    const approver =
      await prisma.employee.findUnique({
        where: {
          userId: user.id
        },

        select: {
          id: true
        }
      })


    if (!approver) {
      return {
        success: false,

        message:
          "Your user account is not linked to an internal employee record."
      }
    }


    const attendance =
      await prisma.employeeAttendance.findUnique({
        where: {
          id: attendanceId
        },

        select: {
          id: true,
          employeeId: true,
          approvedAt: true
        }
      })


    if (!attendance) {
      return {
        success: false,
        message:
          "Attendance record could not be found."
      }
    }


    if (attendance.approvedAt) {
      return {
        success: false,
        message:
          "This attendance record has already been approved."
      }
    }


    await prisma.employeeAttendance.update({
      where: {
        id: attendanceId
      },

      data: {
        approvedBy:
          approver.id,

        approvedAt:
          new Date()
      }
    })


    revalidatePath(
      "/admin/attendance"
    )

    revalidatePath(
      `/admin/attendance/${attendanceId}`
    )

    revalidatePath(
      `/admin/employees/${attendance.employeeId}/attendance`
    )


    return {
      success: true,

      message:
        "Attendance record approved successfully.",

      attendanceId
    }

  } catch (error) {

    console.error(
      "APPROVE_ATTENDANCE_ERROR",
      error
    )

    return {
      success: false,

      message:
        "Unable to approve the attendance record. Please try again."
    }
  }
}


// ============================================================
// REVOKE APPROVAL
// ============================================================

export async function revokeAttendanceApprovalAction(
  attendanceId: string
): Promise<AttendanceActionState> {

  const user =
    await requireApprovalAccess()

  if (!user) {
    return {
      success: false,

      message:
        "You do not have permission to revoke attendance approval."
    }
  }


  if (!attendanceId) {
    return {
      success: false,
      message:
        "Attendance record ID is missing."
    }
  }


  try {

    const attendance =
      await prisma.employeeAttendance.findUnique({
        where: {
          id: attendanceId
        },

        select: {
          id: true,
          employeeId: true,
          approvedAt: true
        }
      })


    if (!attendance) {
      return {
        success: false,
        message:
          "Attendance record could not be found."
      }
    }


    if (!attendance.approvedAt) {
      return {
        success: false,
        message:
          "This attendance record is not currently approved."
      }
    }


    await prisma.employeeAttendance.update({
      where: {
        id: attendanceId
      },

      data: {
        approvedBy: null,
        approvedAt: null
      }
    })


    revalidatePath(
      "/admin/attendance"
    )

    revalidatePath(
      `/admin/attendance/${attendanceId}`
    )

    revalidatePath(
      `/admin/employees/${attendance.employeeId}/attendance`
    )


    return {
      success: true,

      message:
        "Attendance approval revoked successfully.",

      attendanceId
    }

  } catch (error) {

    console.error(
      "REVOKE_ATTENDANCE_APPROVAL_ERROR",
      error
    )

    return {
      success: false,

      message:
        "Unable to revoke attendance approval. Please try again."
    }
  }
}


// ============================================================
// ACCESS CHECK
// ============================================================

export async function canViewAttendanceAction() {

  const user =
    await requireViewAccess()

  return Boolean(user)
}