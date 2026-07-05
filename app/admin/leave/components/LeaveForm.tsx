"use client"

import {
  useState,
  useTransition
} from "react"

import {
  useRouter
} from "next/navigation"

import {
  CalendarDays,
  FileText,
  Link2,
  Loader2,
  MessageSquareText,
  Save,
  UserRound,
  X
} from "lucide-react"

import {
  LeaveType
} from "@prisma/client"

import type {
  LeaveActionState
} from "../actions"


// ============================================================
// TYPES
// ============================================================

export type LeaveEmployeeOption = {
  id: string

  name: string

  email: string | null

  employeeCode: string | null
}


export type LeaveFormRecord = {
  id: string

  employeeId: string

  leaveType: LeaveType

  startDate: string

  endDate: string

  totalDays: number

  reason: string

  attachment: string

  managerRemarks: string
}


type LeaveFormProps = {
  mode: "create" | "edit"

  employees: LeaveEmployeeOption[]

  leave?: LeaveFormRecord

  action: (
    formData: FormData
  ) => Promise<LeaveActionState>
}


// ============================================================
// LEAVE TYPES
// ============================================================

const LEAVE_TYPES: {
  value: LeaveType
  label: string
  description: string
}[] = [

  {
    value:
      LeaveType.casual,

    label:
      "Casual Leave",

    description:
      "Personal or short-term planned leave"
  },

  {
    value:
      LeaveType.sick,

    label:
      "Sick Leave",

    description:
      "Medical or health-related absence"
  },

  {
    value:
      LeaveType.earned,

    label:
      "Earned Leave",

    description:
      "Accrued or earned paid leave"
  },

  {
    value:
      LeaveType.unpaid,

    label:
      "Unpaid Leave",

    description:
      "Approved leave without salary"
  },

  {
    value:
      LeaveType.maternity,

    label:
      "Maternity Leave",

    description:
      "Maternity-related leave"
  },

  {
    value:
      LeaveType.paternity,

    label:
      "Paternity Leave",

    description:
      "Paternity-related leave"
  },

  {
    value:
      LeaveType.emergency,

    label:
      "Emergency Leave",

    description:
      "Urgent or unforeseen circumstances"
  }

]


// ============================================================
// HELPERS
// ============================================================

function calculateDays(
  startDate: string,
  endDate: string
) {

  if (
    !startDate ||
    !endDate
  ) {
    return 0
  }


  const start =
    new Date(
      `${startDate}T00:00:00.000Z`
    )


  const end =
    new Date(
      `${endDate}T00:00:00.000Z`
    )


  if (
    Number.isNaN(
      start.getTime()
    ) ||
    Number.isNaN(
      end.getTime()
    ) ||
    end < start
  ) {
    return 0
  }


  const millisecondsPerDay =
    1000 * 60 * 60 * 24


  return (
    Math.floor(
      (
        end.getTime() -
        start.getTime()
      ) /
      millisecondsPerDay
    ) + 1
  )
}


// ============================================================
// COMPONENT
// ============================================================

export default function LeaveForm({
  mode,
  employees,
  leave,
  action
}: LeaveFormProps) {

  const router =
    useRouter()


  const [
    isPending,
    startTransition
  ] = useTransition()


  // ----------------------------------------------------------
  // FORM VALUES
  // ----------------------------------------------------------

  const [
    employeeId,
    setEmployeeId
  ] = useState(
    leave?.employeeId ??
    ""
  )


  const [
    leaveType,
    setLeaveType
  ] = useState<LeaveType>(
    leave?.leaveType ??
    LeaveType.casual
  )


  const [
    startDate,
    setStartDate
  ] = useState(
    leave?.startDate ??
    ""
  )


  const [
    endDate,
    setEndDate
  ] = useState(
    leave?.endDate ??
    ""
  )


  const [
    reason,
    setReason
  ] = useState(
    leave?.reason ??
    ""
  )


  const [
    attachment,
    setAttachment
  ] = useState(
    leave?.attachment ??
    ""
  )


  const [
    managerRemarks,
    setManagerRemarks
  ] = useState(
    leave?.managerRemarks ??
    ""
  )


  // ----------------------------------------------------------
  // ACTION STATE
  // ----------------------------------------------------------

  const [
    result,
    setResult
  ] = useState<LeaveActionState | null>(
    null
  )


  // ----------------------------------------------------------
  // CALCULATED DAYS
  // ----------------------------------------------------------

  const calculatedDays =
    calculateDays(
      startDate,
      endDate
    )


  // ----------------------------------------------------------
  // SELECTED EMPLOYEE
  // ----------------------------------------------------------

  const selectedEmployee =
    employees.find(
      (employee) =>
        employee.id ===
        employeeId
    )


  // ----------------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------------

  function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault()


    const formData =
      new FormData(
        event.currentTarget
      )


    setResult(null)


    startTransition(
      async () => {

        const response =
          await action(
            formData
          )


        setResult(
          response
        )


        if (
          response.success &&
          response.leaveId
        ) {

          router.push(
            `/admin/leave/${response.leaveId}`
          )

          router.refresh()
        }

      }
    )
  }


  // ----------------------------------------------------------
  // CANCEL URL
  // ----------------------------------------------------------

  const cancelUrl =
    mode === "edit" &&
    leave
      ? `/admin/leave/${leave.id}`
      : "/admin/leave"


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* ==================================================== */}
      {/* ACTION MESSAGE */}
      {/* ==================================================== */}

      {result && !result.success && (

        <div
          className="
            rounded-xl
            border border-red-200
            bg-red-50
            px-4 py-3
          "
        >

          <p
            className="
              text-sm font-medium
              text-red-800
            "
          >
            {result.message}
          </p>


          {result.errors?.form && (

            <p
              className="
                mt-1
                text-sm
                text-red-700
              "
            >
              {result.errors.form}
            </p>

          )}

        </div>

      )}


      {/* ==================================================== */}
      {/* EMPLOYEE + LEAVE TYPE */}
      {/* ==================================================== */}

      <FormSection
        title="Leave Request"
        description="Select the employee and type of leave being requested."
        icon={UserRound}
      >

        <div
          className="
            grid gap-5
            lg:grid-cols-2
          "
        >

          {/* EMPLOYEE */}

          <FormField
            label="Employee"
            required
            error={
              result?.errors
                ?.employeeId
            }
          >

            <select
              name="employeeId"
              value={employeeId}
              onChange={
                (event) =>
                  setEmployeeId(
                    event.target.value
                  )
              }
              disabled={isPending}
              className={getInputClass(
                Boolean(
                  result?.errors
                    ?.employeeId
                )
              )}
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
                  </option>

                )
              )}

            </select>

          </FormField>


          {/* LEAVE TYPE */}

          <FormField
            label="Leave Type"
            required
            error={
              result?.errors
                ?.leaveType
            }
          >

            <select
              name="leaveType"
              value={leaveType}
              onChange={
                (event) =>
                  setLeaveType(
                    event.target
                      .value as LeaveType
                  )
              }
              disabled={isPending}
              className={getInputClass(
                Boolean(
                  result?.errors
                    ?.leaveType
                )
              )}
            >

              {LEAVE_TYPES.map(
                (type) => (

                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>

                )
              )}

            </select>

          </FormField>

        </div>


        {/* SELECTED EMPLOYEE INFO */}

        {selectedEmployee && (

          <div
            className="
              mt-5
              rounded-lg
              border border-blue-200
              bg-blue-50
              px-4 py-3
            "
          >

            <div
              className="
                flex items-start gap-3
              "
            >

              <div
                className="
                  flex h-9 w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-100
                  text-sm font-semibold
                  text-blue-700
                "
              >
                {selectedEmployee.name
                  .charAt(0)
                  .toUpperCase()}
              </div>


              <div className="min-w-0">

                <p
                  className="
                    text-sm font-medium
                    text-blue-900
                  "
                >
                  {selectedEmployee.name}
                </p>


                <p
                  className="
                    mt-0.5
                    text-xs
                    text-blue-700
                  "
                >
                  {
                    selectedEmployee.email ||
                    selectedEmployee.employeeCode ||
                    "Internal Employee"
                  }
                </p>

              </div>

            </div>

          </div>

        )}

      </FormSection>


      {/* ==================================================== */}
      {/* LEAVE PERIOD */}
      {/* ==================================================== */}

      <FormSection
        title="Leave Period"
        description="Choose the start and end dates for the leave request."
        icon={CalendarDays}
      >

        <div
          className="
            grid gap-5
            md:grid-cols-2
          "
        >

          {/* START DATE */}

          <FormField
            label="Start Date"
            required
            error={
              result?.errors
                ?.startDate
            }
          >

            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={
                (event) =>
                  setStartDate(
                    event.target.value
                  )
              }
              disabled={isPending}
              className={getInputClass(
                Boolean(
                  result?.errors
                    ?.startDate
                )
              )}
            />

          </FormField>


          {/* END DATE */}

          <FormField
            label="End Date"
            required
            error={
              result?.errors
                ?.endDate
            }
          >

            <input
              type="date"
              name="endDate"
              value={endDate}
              min={
                startDate ||
                undefined
              }
              onChange={
                (event) =>
                  setEndDate(
                    event.target.value
                  )
              }
              disabled={isPending}
              className={getInputClass(
                Boolean(
                  result?.errors
                    ?.endDate
                )
              )}
            />

          </FormField>

        </div>


        {/* DAYS PREVIEW */}

        <div
          className="
            mt-5
            rounded-xl
            border border-green-200
            bg-green-50
            p-4
          "
        >

          <div
            className="
              flex items-center
              justify-between
              gap-4
            "
          >

            <div>

              <p
                className="
                  text-sm font-medium
                  text-green-900
                "
              >
                Calculated Leave Duration
              </p>


              <p
                className="
                  mt-1
                  text-xs
                  text-green-700
                "
              >
                The final duration is calculated
                again securely on the server.
              </p>

            </div>


            <div
              className="
                shrink-0
                rounded-lg
                bg-green-100
                px-4 py-2
                text-center
              "
            >

              <p
                className="
                  text-xl font-semibold
                  text-green-800
                "
              >
                {calculatedDays}
              </p>


              <p
                className="
                  text-xs font-medium
                  text-green-700
                "
              >
                {calculatedDays === 1
                  ? "day"
                  : "days"}
              </p>

            </div>

          </div>

        </div>


        {result?.errors
          ?.totalDays && (

          <p
            className="
              mt-2
              text-sm
              text-red-600
            "
          >
            {
              result.errors
                .totalDays
            }
          </p>

        )}

      </FormSection>


      {/* ==================================================== */}
      {/* REASON */}
      {/* ==================================================== */}

      <FormSection
        title="Leave Details"
        description="Provide the reason and supporting information for this request."
        icon={FileText}
      >

        <div className="space-y-5">

          {/* REASON */}

          <FormField
            label="Reason"
            required
            error={
              result?.errors
                ?.reason
            }
          >

            <textarea
              name="reason"
              value={reason}
              onChange={
                (event) =>
                  setReason(
                    event.target.value
                  )
              }
              rows={5}
              maxLength={2000}
              disabled={isPending}
              placeholder="Enter the reason for this leave request..."
              className={`
                ${getInputClass(
                  Boolean(
                    result?.errors
                      ?.reason
                  )
                )}
                min-h-[130px]
                resize-y py-3
              `}
            />

            <div
              className="
                mt-1.5
                flex justify-end
              "
            >
              <span
                className="
                  text-xs
                  text-slate-400
                "
              >
                {reason.length}/2000
              </span>
            </div>

          </FormField>


          {/* ATTACHMENT */}

          <FormField
            label="Attachment URL"
            hint="Optional supporting document or file URL"
            error={
              result?.errors
                ?.attachment
            }
          >

            <div className="relative">

              <Link2
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />


              <input
                type="url"
                name="attachment"
                value={attachment}
                onChange={
                  (event) =>
                    setAttachment(
                      event.target.value
                    )
                }
                disabled={isPending}
                placeholder="https://..."
                className={`
                  ${getInputClass(
                    Boolean(
                      result?.errors
                        ?.attachment
                    )
                  )}
                  pl-9
                `}
              />

            </div>

          </FormField>

        </div>

      </FormSection>


      {/* ==================================================== */}
      {/* MANAGER REMARKS */}
      {/* ==================================================== */}

      <FormSection
        title="Internal Remarks"
        description="Optional internal remarks associated with this leave request."
        icon={MessageSquareText}
      >

        <FormField
          label="Manager Remarks"
          hint="Optional internal note. Approval and rejection actions may replace this value later."
          error={
            result?.errors
              ?.managerRemarks
          }
        >

          <textarea
            name="managerRemarks"
            value={managerRemarks}
            onChange={
              (event) =>
                setManagerRemarks(
                  event.target.value
                )
            }
            rows={4}
            maxLength={2000}
            disabled={isPending}
            placeholder="Add an optional internal remark..."
            className={`
              ${getInputClass(
                Boolean(
                  result?.errors
                    ?.managerRemarks
                )
              )}
              min-h-[110px]
              resize-y py-3
            `}
          />

        </FormField>

      </FormSection>


      {/* ==================================================== */}
      {/* FORM ACTIONS */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-col-reverse
          gap-3
          border-t border-slate-200
          pt-6
          sm:flex-row
          sm:items-center
          sm:justify-end
        "
      >

        <button
          type="button"
          onClick={
            () =>
              router.push(
                cancelUrl
              )
          }
          disabled={isPending}
          className="
            inline-flex h-11
            items-center justify-center
            gap-2
            rounded-lg
            border border-orange-200
            bg-orange-50
            px-5
            text-sm font-medium
            text-orange-700
            transition
            hover:bg-orange-100
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <X className="h-4 w-4" />

          Cancel
        </button>


        <button
          type="submit"
          disabled={
            isPending ||
            !employeeId ||
            !startDate ||
            !endDate ||
            !reason.trim()
          }
          className="
            inline-flex h-11
            items-center justify-center
            gap-2
            rounded-lg
            bg-green-600
            px-5
            text-sm font-medium
            text-white
            shadow-sm
            transition
            hover:bg-green-700
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
            focus:ring-offset-2
            disabled:cursor-not-allowed
            disabled:bg-green-300
          "
        >

          {isPending ? (

            <>
              <Loader2
                className="
                  h-4 w-4
                  animate-spin
                "
              />

              {mode === "create"
                ? "Creating..."
                : "Saving..."}
            </>

          ) : (

            <>
              <Save className="h-4 w-4" />

              {mode === "create"
                ? "Create Leave Request"
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

          <h2
            className="
              font-semibold
              text-slate-900
            "
          >
            {title}
          </h2>


          <p
            className="
              mt-0.5
              text-sm
              text-slate-500
            "
          >
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

  hint?: string

  error?: string

  children: React.ReactNode
}


function FormField({
  label,
  required = false,
  hint,
  error,
  children
}: FormFieldProps) {

  return (
    <div>

      <label
        className="
          mb-2
          block
          text-sm font-medium
          text-slate-700
        "
      >
        {label}

        {required && (
          <span
            className="
              ml-1
              text-red-500
            "
          >
            *
          </span>
        )}
      </label>


      {hint && (

        <p
          className="
            -mt-1 mb-2
            text-xs
            text-slate-500
          "
        >
          {hint}
        </p>

      )}


      {children}


      {error && (

        <p
          className="
            mt-1.5
            text-sm
            text-red-600
          "
        >
          {error}
        </p>

      )}

    </div>
  )
}


// ============================================================
// INPUT CLASS
// ============================================================

function getInputClass(
  hasError: boolean
) {

  return `
    h-11 w-full
    rounded-lg
    border
    bg-white
    px-3
    text-sm
    text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    disabled:cursor-not-allowed
    disabled:bg-slate-50
    disabled:text-slate-500
    ${
      hasError
        ? `
          border-red-300
          focus:border-red-500
          focus:ring-2
          focus:ring-red-100
        `
        : `
          border-slate-300
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
        `
    }
  `
}