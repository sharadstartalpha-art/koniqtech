"use client"

import Link from "next/link"

import {
  useActionState,
  useEffect,
  useMemo,
  useState
} from "react"

import {
  useRouter
} from "next/navigation"

import {
  AttendanceStatus
} from "@prisma/client"

import {
  AlertCircle,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Laptop,
  Loader2,
  MapPin,
  Save,
  TimerReset,
  UserRound
} from "lucide-react"

import type {
  AttendanceActionState
} from "../actions"


// ============================================================
// TYPES
// ============================================================

export type AttendanceEmployeeOption = {
  id: string
  name: string
  email: string | null
  employeeCode?: string | null
}


export type AttendanceFormRecord = {
  id: string

  employeeId: string

  attendanceDate: string

  checkIn: string
  checkOut: string

  breakMinutes: number
  overtimeHours: number

  status: AttendanceStatus

  workLocation: string

  latitude: string
  longitude: string

  ipAddress: string
  device: string

  remarks: string
}


type AttendanceFormProps = {
  mode: "create" | "edit"

  employees: AttendanceEmployeeOption[]

  attendance?: AttendanceFormRecord

  action: (
    formData: FormData
  ) => Promise<AttendanceActionState>
}


// ============================================================
// CONSTANTS
// ============================================================

const INITIAL_STATE: AttendanceActionState = {
  success: false,
  message: ""
}


const ATTENDANCE_STATUSES: {
  value: AttendanceStatus
  label: string
}[] = [
  {
    value: AttendanceStatus.present,
    label: "Present"
  },
  {
    value: AttendanceStatus.absent,
    label: "Absent"
  },
  {
    value: AttendanceStatus.late,
    label: "Late"
  },
  {
    value: AttendanceStatus.half_day,
    label: "Half Day"
  },
  {
    value: AttendanceStatus.leave,
    label: "Leave"
  },
  {
    value: AttendanceStatus.holiday,
    label: "Holiday"
  },
  {
    value: AttendanceStatus.weekend,
    label: "Weekend"
  },
  {
    value: AttendanceStatus.work_from_home,
    label: "Work From Home"
  }
]


// ============================================================
// COMPONENT
// ============================================================

export default function AttendanceForm({
  mode,
  employees,
  attendance,
  action
}: AttendanceFormProps) {

  const router = useRouter()


  // ----------------------------------------------------------
  // ACTION STATE
  // ----------------------------------------------------------

  const [
    state,
    formAction,
    isPending
  ] = useActionState(
    async (
      _previousState:
        AttendanceActionState,
      formData: FormData
    ) => {
      return action(formData)
    },
    INITIAL_STATE
  )


  // ----------------------------------------------------------
  // LOCAL VALUES FOR HOURS PREVIEW
  // ----------------------------------------------------------

  const [
    checkIn,
    setCheckIn
  ] = useState(
    attendance?.checkIn ?? ""
  )


  const [
    checkOut,
    setCheckOut
  ] = useState(
    attendance?.checkOut ?? ""
  )


  const [
    breakMinutes,
    setBreakMinutes
  ] = useState(
    String(
      attendance?.breakMinutes ?? 0
    )
  )


  // ----------------------------------------------------------
  // SUCCESS REDIRECT
  // ----------------------------------------------------------

  useEffect(() => {

    if (
      state.success &&
      state.attendanceId
    ) {
      router.push(
        `/admin/attendance/${state.attendanceId}`
      )

      router.refresh()
    }

  }, [
    state.success,
    state.attendanceId,
    router
  ])


  // ----------------------------------------------------------
  // TOTAL HOURS PREVIEW
  // ----------------------------------------------------------

  const totalHoursPreview =
    useMemo(() => {

      if (
        !checkIn ||
        !checkOut
      ) {
        return null
      }


      const [
        inHour,
        inMinute
      ] = checkIn
        .split(":")
        .map(Number)


      const [
        outHour,
        outMinute
      ] = checkOut
        .split(":")
        .map(Number)


      if (
        !Number.isFinite(inHour) ||
        !Number.isFinite(inMinute) ||
        !Number.isFinite(outHour) ||
        !Number.isFinite(outMinute)
      ) {
        return null
      }


      const startMinutes =
        inHour * 60 +
        inMinute


      const endMinutes =
        outHour * 60 +
        outMinute


      const parsedBreak =
        Number(breakMinutes || "0")


      if (
        endMinutes <= startMinutes ||
        !Number.isFinite(parsedBreak) ||
        parsedBreak < 0
      ) {
        return null
      }


      const workedMinutes =
        endMinutes -
        startMinutes -
        parsedBreak


      if (workedMinutes < 0) {
        return null
      }


      return (
        workedMinutes / 60
      ).toFixed(2)

    }, [
      checkIn,
      checkOut,
      breakMinutes
    ])


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <form
      action={formAction}
      className="space-y-6"
    >

      {/* ==================================================== */}
      {/* ACTION MESSAGE */}
      {/* ==================================================== */}

      {state.message && !state.success && (

        <div
          className="
            flex items-start gap-3
            rounded-xl
            border border-red-200
            bg-red-50
            px-4 py-3
            text-sm text-red-700
          "
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <div>
            <p className="font-medium">
              Unable to save attendance
            </p>

            <p className="mt-0.5">
              {state.message}
            </p>
          </div>
        </div>

      )}


      {/* ==================================================== */}
      {/* BASIC ATTENDANCE DETAILS */}
      {/* ==================================================== */}

      <FormSection
        title="Attendance Details"
        description="Select the employee, attendance date, and attendance status."
        icon={CalendarDays}
      >

        <div className="grid gap-5 md:grid-cols-2">

          {/* EMPLOYEE */}

          <FormField
            label="Employee"
            required
            error={
              state.errors?.employeeId
            }
          >
            <div className="relative">

              <UserRound
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <select
                name="employeeId"
                required
                defaultValue={
                  attendance?.employeeId ??
                  ""
                }
                className={`
                  h-11 w-full
                  appearance-none
                  rounded-lg
                  border
                  bg-white
                  pl-10 pr-10
                  text-sm text-slate-900
                  outline-none
                  transition
                  focus:ring-2
                  ${
                    state.errors?.employeeId
                      ? `
                        border-red-300
                        focus:border-red-500
                        focus:ring-red-100
                      `
                      : `
                        border-slate-300
                        focus:border-blue-500
                        focus:ring-blue-100
                      `
                  }
                `}
              >
                <option value="">
                  Select employee
                </option>

                {employees.map(
                  (employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.name}
                      {employee.employeeCode
                        ? ` (${employee.employeeCode})`
                        : ""}
                      {employee.email
                        ? ` — ${employee.email}`
                        : ""}
                    </option>
                  )
                )}
              </select>

            </div>
          </FormField>


          {/* ATTENDANCE DATE */}

          <FormField
            label="Attendance Date"
            required
            error={
              state.errors?.attendanceDate
            }
          >
            <input
              type="date"
              name="attendanceDate"
              required
              defaultValue={
                attendance?.attendanceDate ??
                ""
              }
              className={getInputClassName(
                Boolean(
                  state.errors?.attendanceDate
                )
              )}
            />
          </FormField>


          {/* STATUS */}

          <FormField
            label="Attendance Status"
            required
            error={
              state.errors?.status
            }
          >
            <select
              name="status"
              required
              defaultValue={
                attendance?.status ??
                AttendanceStatus.present
              }
              className={getInputClassName(
                Boolean(
                  state.errors?.status
                )
              )}
            >
              {ATTENDANCE_STATUSES.map(
                (status) => (
                  <option
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </option>
                )
              )}
            </select>
          </FormField>


          {/* WORK LOCATION */}

          <FormField
            label="Work Location"
            error={
              state.errors?.workLocation
            }
          >
            <div className="relative">

              <BriefcaseBusiness
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                name="workLocation"
                defaultValue={
                  attendance?.workLocation ??
                  ""
                }
                placeholder="Office, Client Site, Remote..."
                className={`
                  ${getInputClassName(
                    Boolean(
                      state.errors?.workLocation
                    )
                  )}
                  pl-10
                `}
              />

            </div>
          </FormField>

        </div>

      </FormSection>


      {/* ==================================================== */}
      {/* WORKING HOURS */}
      {/* ==================================================== */}

      <FormSection
        title="Working Hours"
        description="Enter check-in, check-out, break duration, and overtime hours."
        icon={Clock3}
      >

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* CHECK IN */}

          <FormField
            label="Check In"
            error={
              state.errors?.checkIn
            }
          >
            <input
              type="time"
              name="checkIn"
              value={checkIn}
              onChange={(event) => {
                setCheckIn(
                  event.target.value
                )
              }}
              className={getInputClassName(
                Boolean(
                  state.errors?.checkIn
                )
              )}
            />
          </FormField>


          {/* CHECK OUT */}

          <FormField
            label="Check Out"
            error={
              state.errors?.checkOut
            }
          >
            <input
              type="time"
              name="checkOut"
              value={checkOut}
              onChange={(event) => {
                setCheckOut(
                  event.target.value
                )
              }}
              className={getInputClassName(
                Boolean(
                  state.errors?.checkOut
                )
              )}
            />
          </FormField>


          {/* BREAK MINUTES */}

          <FormField
            label="Break Minutes"
            error={
              state.errors?.breakMinutes
            }
          >
            <input
              type="number"
              name="breakMinutes"
              min="0"
              max="1440"
              step="1"
              value={breakMinutes}
              onChange={(event) => {
                setBreakMinutes(
                  event.target.value
                )
              }}
              className={getInputClassName(
                Boolean(
                  state.errors?.breakMinutes
                )
              )}
            />
          </FormField>


          {/* OVERTIME HOURS */}

          <FormField
            label="Overtime Hours"
            error={
              state.errors?.overtimeHours
            }
          >
            <input
              type="number"
              name="overtimeHours"
              min="0"
              step="0.25"
              defaultValue={
                attendance?.overtimeHours ??
                0
              }
              className={getInputClassName(
                Boolean(
                  state.errors?.overtimeHours
                )
              )}
            />
          </FormField>

        </div>


        {/* HOURS PREVIEW */}

        <div
          className="
            mt-5
            flex flex-col gap-3
            rounded-xl
            border border-blue-200
            bg-blue-50
            p-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="flex items-start gap-3">

            <div
              className="
                flex h-9 w-9
                shrink-0
                items-center justify-center
                rounded-lg
                bg-blue-100
                text-blue-700
              "
            >
              <TimerReset className="h-4 w-4" />
            </div>


            <div>

              <p className="text-sm font-medium text-blue-900">
                Calculated Working Hours
              </p>

              <p className="mt-0.5 text-xs text-blue-700">
                Preview based on check-in,
                check-out, and break duration.
                Final value is calculated again
                securely on the server.
              </p>

            </div>

          </div>


          <div
            className="
              rounded-lg
              bg-white
              px-4 py-2
              text-lg font-semibold
              text-blue-700
              shadow-sm
            "
          >
            {totalHoursPreview !== null
              ? `${totalHoursPreview} hrs`
              : "—"}
          </div>

        </div>

      </FormSection>


      {/* ==================================================== */}
      {/* LOCATION DETAILS */}
      {/* ==================================================== */}

      <FormSection
        title="Location Details"
        description="Optional location coordinates for office, field, or remote attendance."
        icon={MapPin}
      >

        <div className="grid gap-5 md:grid-cols-2">

          {/* LATITUDE */}

          <FormField
            label="Latitude"
            error={
              state.errors?.latitude
            }
          >
            <input
              type="number"
              name="latitude"
              min="-90"
              max="90"
              step="any"
              defaultValue={
                attendance?.latitude ??
                ""
              }
              placeholder="12.9716"
              className={getInputClassName(
                Boolean(
                  state.errors?.latitude
                )
              )}
            />
          </FormField>


          {/* LONGITUDE */}

          <FormField
            label="Longitude"
            error={
              state.errors?.longitude
            }
          >
            <input
              type="number"
              name="longitude"
              min="-180"
              max="180"
              step="any"
              defaultValue={
                attendance?.longitude ??
                ""
              }
              placeholder="77.5946"
              className={getInputClassName(
                Boolean(
                  state.errors?.longitude
                )
              )}
            />
          </FormField>

        </div>

      </FormSection>


      {/* ==================================================== */}
      {/* DEVICE DETAILS */}
      {/* ==================================================== */}

      <FormSection
        title="Device Information"
        description="Optional technical information associated with the attendance entry."
        icon={Laptop}
      >

        <div className="grid gap-5 md:grid-cols-2">

          {/* IP ADDRESS */}

          <FormField
            label="IP Address"
            error={
              state.errors?.ipAddress
            }
          >
            <input
              type="text"
              name="ipAddress"
              defaultValue={
                attendance?.ipAddress ??
                ""
              }
              placeholder="192.168.1.10"
              className={getInputClassName(
                Boolean(
                  state.errors?.ipAddress
                )
              )}
            />
          </FormField>


          {/* DEVICE */}

          <FormField
            label="Device"
            error={
              state.errors?.device
            }
          >
            <input
              type="text"
              name="device"
              defaultValue={
                attendance?.device ??
                ""
              }
              placeholder="Windows Desktop, iPhone..."
              className={getInputClassName(
                Boolean(
                  state.errors?.device
                )
              )}
            />
          </FormField>

        </div>

      </FormSection>


      {/* ==================================================== */}
      {/* REMARKS */}
      {/* ==================================================== */}

      <FormSection
        title="Remarks"
        description="Add any internal note or explanation related to this attendance record."
        icon={CalendarDays}
      >

        <FormField
          label="Attendance Remarks"
          error={
            state.errors?.remarks
          }
        >
          <textarea
            name="remarks"
            rows={5}
            defaultValue={
              attendance?.remarks ??
              ""
            }
            placeholder="Add attendance notes, late arrival reason, field visit details, or other remarks..."
            className={`
              w-full
              resize-y
              rounded-lg
              border
              bg-white
              px-3 py-2.5
              text-sm text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:ring-2
              ${
                state.errors?.remarks
                  ? `
                    border-red-300
                    focus:border-red-500
                    focus:ring-red-100
                  `
                  : `
                    border-slate-300
                    focus:border-blue-500
                    focus:ring-blue-100
                  `
              }
            `}
          />
        </FormField>

      </FormSection>


      {/* ==================================================== */}
      {/* FORM ACTIONS */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-col-reverse gap-3
          rounded-xl
          border border-slate-200
          bg-white
          p-4
          shadow-sm
          sm:flex-row
          sm:items-center
          sm:justify-end
        "
      >

        <Link
          href={
            mode === "edit" &&
            attendance?.id
              ? `/admin/attendance/${attendance.id}`
              : "/admin/attendance"
          }
          className="
            inline-flex h-11
            items-center justify-center
            rounded-lg
            border border-orange-200
            bg-orange-50
            px-5
            text-sm font-medium
            text-orange-700
            transition
            hover:bg-orange-100
          "
        >
          Cancel
        </Link>


        <button
          type="submit"
          disabled={isPending}
          className="
            inline-flex h-11
            items-center justify-center
            gap-2
            rounded-lg
            bg-blue-600
            px-5
            text-sm font-medium
            text-white
            shadow-sm
            transition
            hover:bg-blue-700
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:ring-offset-2
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >

          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />

              {mode === "create"
                ? "Creating..."
                : "Saving..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />

              {mode === "create"
                ? "Create Attendance"
                : "Save Changes"}
            </>
          )}

        </button>

      </div>

    </form>
  )
}


// ============================================================
// FORM SECTION
// ============================================================

type FormSectionProps = {
  title: string
  description: string

  icon: React.ComponentType<{
    className?: string
  }>

  children: React.ReactNode
}


function FormSection({
  title,
  description,
  icon: Icon,
  children
}: FormSectionProps) {

  return (
    <section
      className="
        overflow-hidden
        rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
      "
    >

      <div
        className="
          flex items-start gap-3
          border-b border-slate-200
          bg-slate-50/70
          px-5 py-4
        "
      >

        <div
          className="
            flex h-9 w-9
            shrink-0
            items-center justify-center
            rounded-lg
            bg-blue-50
            text-blue-600
          "
        >
          <Icon className="h-4 w-4" />
        </div>


        <div>

          <h2 className="font-semibold text-slate-900">
            {title}
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            {description}
          </p>

        </div>

      </div>


      <div className="p-5">
        {children}
      </div>

    </section>
  )
}


// ============================================================
// FORM FIELD
// ============================================================

type FormFieldProps = {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}


function FormField({
  label,
  required = false,
  error,
  children
}: FormFieldProps) {

  return (
    <div>

      <label className="mb-1.5 block text-sm font-medium text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>


      {children}


      {error && (
        <p
          className="
            mt-1.5
            flex items-center gap-1
            text-xs text-red-600
          "
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />

          {error}
        </p>
      )}

    </div>
  )
}


// ============================================================
// INPUT CLASS HELPER
// ============================================================

function getInputClassName(
  hasError: boolean
) {

  return `
    h-11 w-full
    rounded-lg
    border
    bg-white
    px-3
    text-sm text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    focus:ring-2
    ${
      hasError
        ? `
          border-red-300
          focus:border-red-500
          focus:ring-red-100
        `
        : `
          border-slate-300
          focus:border-blue-500
          focus:ring-blue-100
        `
    }
  `
}