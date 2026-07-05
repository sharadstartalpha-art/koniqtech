import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Link2,
  Mail,
  MessageSquareText,
  UserCheck,
  UserRound,
  XCircle
} from "lucide-react"

import {
  LeaveStatus,
  LeaveType,
  UserRole
} from "@prisma/client"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import LeaveActions from "../components/LeaveActions"


// ============================================================
// TYPES
// ============================================================

type LeaveDetailsPageProps = {
  params: Promise<{
    id: string
  }>
}


// ============================================================
// ACCESS ROLES
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
// STATUS LABELS
// ============================================================

const STATUS_LABELS: Record<
  LeaveStatus,
  string
> = {

  pending:
    "Pending",

  approved:
    "Approved",

  rejected:
    "Rejected",

  cancelled:
    "Cancelled"

}


// ============================================================
// STATUS STYLES
// ============================================================

const STATUS_STYLES: Record<
  LeaveStatus,
  string
> = {

  pending:
    "border-orange-200 bg-orange-50 text-orange-700",

  approved:
    "border-green-200 bg-green-50 text-green-700",

  rejected:
    "border-red-200 bg-red-50 text-red-700",

  cancelled:
    "border-slate-200 bg-slate-50 text-slate-700"

}


// ============================================================
// LEAVE TYPE LABELS
// ============================================================

const LEAVE_TYPE_LABELS: Record<
  LeaveType,
  string
> = {

  casual:
    "Casual Leave",

  sick:
    "Sick Leave",

  earned:
    "Earned Leave",

  unpaid:
    "Unpaid Leave",

  maternity:
    "Maternity Leave",

  paternity:
    "Paternity Leave",

  emergency:
    "Emergency Leave"

}


// ============================================================
// LEAVE TYPE STYLES
// ============================================================

const LEAVE_TYPE_STYLES: Record<
  LeaveType,
  string
> = {

  casual:
    "border-blue-200 bg-blue-50 text-blue-700",

  sick:
    "border-red-200 bg-red-50 text-red-700",

  earned:
    "border-green-200 bg-green-50 text-green-700",

  unpaid:
    "border-slate-200 bg-slate-50 text-slate-700",

  maternity:
    "border-purple-200 bg-purple-50 text-purple-700",

  paternity:
    "border-cyan-200 bg-cyan-50 text-cyan-700",

  emergency:
    "border-orange-200 bg-orange-50 text-orange-700"

}


// ============================================================
// HELPERS
// ============================================================

function formatDate(
  date: Date
) {

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      timeZone:
        "UTC"
    }
  ).format(date)
}


function formatDateTime(
  date: Date
) {

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",

      hour12:
        true
    }
  ).format(date)
}


function formatTotalDays(
  totalDays: number
) {

  if (totalDays === 1) {
    return "1 day"
  }


  return `${totalDays.toFixed(
    Number.isInteger(totalDays)
      ? 0
      : 1
  )} days`
}


function formatEmploymentType(
  value: string | null
) {

  if (!value) {
    return "Not specified"
  }


  return value
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    )
}


// ============================================================
// EMPLOYEE NAME HELPER
// ============================================================

function getEmployeeName(
  employee: {
    firstName: string
    lastName: string
    email: string
    employeeCode: string
  }
) {

  const fullName =
    [
      employee.firstName,
      employee.lastName
    ]
      .filter(Boolean)
      .join(" ")
      .trim()


  return (
    fullName ||
    employee.email ||
    employee.employeeCode
  )
}


// ============================================================
// PAGE
// ============================================================

export default async function LeaveDetailsPage({
  params
}: LeaveDetailsPageProps) {

  // ----------------------------------------------------------
  // AUTHORIZATION
  // ----------------------------------------------------------

  const session =
    await auth()


  if (
    !session?.user?.id ||
    !session.user.role
  ) {
    redirect("/login")
  }


  const currentRole =
    session.user.role as UserRole


  if (
    !VIEW_ROLES.includes(
      currentRole
    )
  ) {
    redirect(
      "/admin/dashboard"
    )
  }


  const canManage =
    MANAGE_ROLES.includes(
      currentRole
    )


  const canApprove =
    APPROVE_ROLES.includes(
      currentRole
    )


  // ----------------------------------------------------------
  // PARAMS
  // ----------------------------------------------------------

  const {
    id
  } = await params


  if (!id) {
    notFound()
  }


  // ----------------------------------------------------------
  // LOAD LEAVE RECORD
  // ----------------------------------------------------------

  const leave =
    await prisma.employeeLeave.findUnique({

      where: {
        id
      },

      select: {

        id: true,

        employeeId: true,

        leaveType: true,

        startDate: true,

        endDate: true,

        totalDays: true,

        reason: true,

        attachment: true,

        status: true,

        managerRemarks: true,

        approvedAt: true,

        cancelledAt: true,

        createdAt: true,

        updatedAt: true,


        // ====================================================
        // REQUESTING EMPLOYEE
        // ====================================================

        employee: {

          select: {

            id: true,

            employeeCode: true,

            firstName: true,

            lastName: true,

            email: true,

            phone: true,

            designation: true,

            employmentType: true,

            joiningDate: true,

            active: true,

            department: {

              select: {
                name: true
              }

            },


            role: {

              select: {
                name: true
              }

            },


            manager: {

              select: {

                id: true,

                employeeCode: true,

                firstName: true,

                lastName: true,

                email: true

              }

            }

          }

        },


        // ====================================================
        // APPROVER
        // ====================================================

        approver: {

          select: {

            id: true,

            employeeCode: true,

            firstName: true,

            lastName: true,

            email: true,

            designation: true

          }

        }

      }

    })


  // ----------------------------------------------------------
  // NOT FOUND
  // ----------------------------------------------------------

  if (!leave) {
    notFound()
  }


  // ----------------------------------------------------------
  // DISPLAY VALUES
  // ----------------------------------------------------------

  const employeeName =
    getEmployeeName(
      leave.employee
    )


  const approverName =
    leave.approver
      ? getEmployeeName(
          leave.approver
        )
      : null


  const managerName =
    leave.employee.manager
      ? getEmployeeName(
          leave.employee.manager
        )
      : null


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================== */}
      {/* BACK NAVIGATION */}
      {/* ==================================================== */}

      <div>

        <Link
          href="/admin/leave"
          className="
            inline-flex
            items-center gap-2
            text-sm font-medium
            text-blue-600
            transition
            hover:text-blue-700
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Leave Management
        </Link>

      </div>


      {/* ==================================================== */}
      {/* PAGE HEADER */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-col gap-5
          xl:flex-row
          xl:items-start
          xl:justify-between
        "
      >

        <div
          className="
            flex items-start gap-4
          "
        >

          <div
            className="
              flex h-12 w-12
              shrink-0
              items-center justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <CalendarDays className="h-6 w-6" />
          </div>


          <div>

            <div
              className="
                flex flex-wrap
                items-center gap-2
              "
            >

              <h1
                className="
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-slate-900
                "
              >
                {employeeName}
              </h1>


              <span
                className={`
                  inline-flex
                  rounded-full
                  border
                  px-2.5 py-1
                  text-xs font-medium
                  ${
                    STATUS_STYLES[
                      leave.status
                    ]
                  }
                `}
              >
                {
                  STATUS_LABELS[
                    leave.status
                  ]
                }
              </span>

            </div>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Leave request details, employee
              information, and approval history.
            </p>

          </div>

        </div>


        {/* ================================================== */}
        {/* ACTIONS */}
        {/* ================================================== */}

        <LeaveActions
          leaveId={leave.id}
          employeeName={employeeName}
          status={leave.status}
          canEdit={canManage}
          canDelete={canManage}
          canApprove={canApprove}
          canCancel={canManage}
        />

      </div>


      {/* ==================================================== */}
      {/* OVERVIEW CARDS */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <OverviewCard
          label="Leave Type"
          value={
            LEAVE_TYPE_LABELS[
              leave.leaveType
            ]
          }
          icon={FileText}
          iconClassName="
            bg-blue-50
            text-blue-600
          "
        />


        <OverviewCard
          label="Duration"
          value={
            formatTotalDays(
              leave.totalDays
            )
          }
          icon={CalendarDays}
          iconClassName="
            bg-green-50
            text-green-600
          "
        />


        <OverviewCard
          label="Start Date"
          value={
            formatDate(
              leave.startDate
            )
          }
          icon={Clock3}
          iconClassName="
            bg-orange-50
            text-orange-600
          "
        />


        <OverviewCard
          label="End Date"
          value={
            formatDate(
              leave.endDate
            )
          }
          icon={CheckCircle2}
          iconClassName="
            bg-purple-50
            text-purple-600
          "
        />

      </div>


      {/* ==================================================== */}
      {/* MAIN GRID */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-6
          xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
        "
      >

        {/* ================================================== */}
        {/* LEFT COLUMN */}
        {/* ================================================== */}

        <div className="space-y-6">

          {/* ================================================= */}
          {/* LEAVE DETAILS */}
          {/* ================================================= */}

          <DetailSection
            title="Leave Details"
            description="Leave category, requested period, duration, and reason."
            icon={CalendarDays}
          >

            <div
              className="
                grid gap-5
                sm:grid-cols-2
              "
            >

              <DetailItem
                label="Leave Type"
              >

                <span
                  className={`
                    inline-flex
                    rounded-full
                    border
                    px-2.5 py-1
                    text-xs font-medium
                    ${
                      LEAVE_TYPE_STYLES[
                        leave.leaveType
                      ]
                    }
                  `}
                >
                  {
                    LEAVE_TYPE_LABELS[
                      leave.leaveType
                    ]
                  }
                </span>

              </DetailItem>


              <DetailItem
                label="Total Duration"
                value={
                  formatTotalDays(
                    leave.totalDays
                  )
                }
              />


              <DetailItem
                label="Start Date"
                value={
                  formatDate(
                    leave.startDate
                  )
                }
              />


              <DetailItem
                label="End Date"
                value={
                  formatDate(
                    leave.endDate
                  )
                }
              />

            </div>


            {/* =============================================== */}
            {/* REASON */}
            {/* =============================================== */}

            <div
              className="
                mt-6
                border-t border-slate-100
                pt-5
              "
            >

              <p
                className="
                  text-xs font-semibold
                  uppercase tracking-wide
                  text-slate-500
                "
              >
                Reason
              </p>


              <p
                className="
                  mt-2
                  whitespace-pre-wrap
                  text-sm leading-7
                  text-slate-700
                "
              >
                {leave.reason}
              </p>

            </div>


            {/* =============================================== */}
            {/* ATTACHMENT */}
            {/* =============================================== */}

            {leave.attachment && (

              <div
                className="
                  mt-6
                  border-t border-slate-100
                  pt-5
                "
              >

                <p
                  className="
                    text-xs font-semibold
                    uppercase tracking-wide
                    text-slate-500
                  "
                >
                  Supporting Attachment
                </p>


                <a
                  href={leave.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-3
                    inline-flex h-10
                    items-center justify-center
                    gap-2
                    rounded-lg
                    bg-blue-50
                    px-4
                    text-sm font-medium
                    text-blue-700
                    transition
                    hover:bg-blue-100
                  "
                >
                  <Link2 className="h-4 w-4" />

                  Open Attachment
                </a>

              </div>

            )}

          </DetailSection>


          {/* ================================================= */}
          {/* DECISION INFORMATION */}
          {/* ================================================= */}

          <DetailSection
            title="Decision Information"
            description="Current leave status, reviewer, and decision information."
            icon={UserCheck}
          >

            <div
              className="
                grid gap-5
                sm:grid-cols-2
              "
            >

              <DetailItem
                label="Current Status"
              >

                <span
                  className={`
                    inline-flex
                    rounded-full
                    border
                    px-2.5 py-1
                    text-xs font-medium
                    ${
                      STATUS_STYLES[
                        leave.status
                      ]
                    }
                  `}
                >
                  {
                    STATUS_LABELS[
                      leave.status
                    ]
                  }
                </span>

              </DetailItem>


              <DetailItem
                label="Decision Date"
                value={
                  leave.approvedAt
                    ? formatDateTime(
                        leave.approvedAt
                      )
                    : "Not decided"
                }
              />


              <DetailItem
                label="Reviewed By"
                value={
                  approverName ||
                  "Not assigned"
                }
              />


              <DetailItem
                label="Cancelled At"
                value={
                  leave.cancelledAt
                    ? formatDateTime(
                        leave.cancelledAt
                      )
                    : "Not cancelled"
                }
              />

            </div>


            {/* =============================================== */}
            {/* MANAGER REMARKS */}
            {/* =============================================== */}

            {leave.managerRemarks && (

              <div
                className="
                  mt-6
                  rounded-xl
                  border border-blue-200
                  bg-blue-50
                  p-4
                "
              >

                <div
                  className="
                    flex items-start gap-3
                  "
                >

                  <MessageSquareText
                    className="
                      mt-0.5
                      h-5 w-5
                      shrink-0
                      text-blue-600
                    "
                  />


                  <div>

                    <p
                      className="
                        text-sm font-semibold
                        text-blue-900
                      "
                    >
                      Manager Remarks
                    </p>


                    <p
                      className="
                        mt-1
                        whitespace-pre-wrap
                        text-sm leading-6
                        text-blue-800
                      "
                    >
                      {leave.managerRemarks}
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* =============================================== */}
            {/* PENDING NOTICE */}
            {/* =============================================== */}

            {!leave.managerRemarks &&
              leave.status ===
                LeaveStatus.pending && (

              <div
                className="
                  mt-6
                  rounded-xl
                  border border-orange-200
                  bg-orange-50
                  p-4
                "
              >

                <div
                  className="
                    flex items-start gap-3
                  "
                >

                  <Clock3
                    className="
                      mt-0.5
                      h-5 w-5
                      shrink-0
                      text-orange-600
                    "
                  />


                  <div>

                    <p
                      className="
                        text-sm font-semibold
                        text-orange-900
                      "
                    >
                      Awaiting Review
                    </p>


                    <p
                      className="
                        mt-1
                        text-sm leading-6
                        text-orange-800
                      "
                    >
                      This leave request is waiting
                      for an authorized administrator
                      to approve or reject it.
                    </p>

                  </div>

                </div>

              </div>

            )}

          </DetailSection>


          {/* ================================================= */}
          {/* RECORD INFORMATION */}
          {/* ================================================= */}

          <DetailSection
            title="Record Information"
            description="System timestamps associated with this leave request."
            icon={Clock3}
          >

            <div
              className="
                grid gap-5
                sm:grid-cols-2
              "
            >

              <DetailItem
                label="Created At"
                value={
                  formatDateTime(
                    leave.createdAt
                  )
                }
              />


              <DetailItem
                label="Last Updated"
                value={
                  formatDateTime(
                    leave.updatedAt
                  )
                }
              />

            </div>

          </DetailSection>

        </div>


        {/* ================================================== */}
        {/* RIGHT COLUMN */}
        {/* ================================================== */}

        <div className="space-y-6">

          {/* ================================================= */}
          {/* EMPLOYEE CARD */}
          {/* ================================================= */}

          <aside
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
                border-b border-slate-200
                bg-slate-50/70
                px-5 py-4
              "
            >

              <h2
                className="
                  font-semibold
                  text-slate-900
                "
              >
                Employee
              </h2>


              <p
                className="
                  mt-0.5
                  text-sm
                  text-slate-500
                "
              >
                Requesting employee information
              </p>

            </div>


            <div className="p-5">

              {/* ============================================= */}
              {/* EMPLOYEE IDENTITY */}
              {/* ============================================= */}

              <div
                className="
                  flex items-center gap-3
                "
              >

                <div
                  className="
                    flex h-12 w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-50
                    text-lg font-semibold
                    text-blue-700
                  "
                >
                  {employeeName
                    .charAt(0)
                    .toUpperCase()}
                </div>


                <div className="min-w-0">

                  <p
                    className="
                      truncate
                      font-semibold
                      text-slate-900
                    "
                  >
                    {employeeName}
                  </p>


                  <p
                    className="
                      mt-0.5
                      truncate
                      text-sm
                      text-slate-500
                    "
                  >
                    {
                      leave.employee
                        .employeeCode
                    }
                  </p>

                </div>

              </div>


              {/* ============================================= */}
              {/* ACTIVE STATUS */}
              {/* ============================================= */}

              <div className="mt-4">

                <span
                  className={`
                    inline-flex
                    rounded-full
                    border
                    px-2.5 py-1
                    text-xs font-medium
                    ${
                      leave.employee.active
                        ? `
                          border-green-200
                          bg-green-50
                          text-green-700
                        `
                        : `
                          border-red-200
                          bg-red-50
                          text-red-700
                        `
                    }
                  `}
                >
                  {leave.employee.active
                    ? "Active Employee"
                    : "Inactive Employee"}
                </span>

              </div>


              {/* ============================================= */}
              {/* EMPLOYEE INFORMATION */}
              {/* ============================================= */}

              <div
                className="
                  mt-5 space-y-4
                  border-t border-slate-100
                  pt-5
                "
              >

                <EmployeeInfoRow
                  icon={Mail}
                  label="Email"
                  value={
                    leave.employee.email
                  }
                />


                <EmployeeInfoRow
                  icon={Building2}
                  label="Department"
                  value={
                    leave.employee
                      .department.name
                  }
                />


                <EmployeeInfoRow
                  icon={BriefcaseBusiness}
                  label="Designation"
                  value={
                    leave.employee
                      .designation ||
                    "Not assigned"
                  }
                />


                <EmployeeInfoRow
                  icon={UserRound}
                  label="Role"
                  value={
                    leave.employee
                      .role.name
                  }
                />


                <EmployeeInfoRow
                  icon={UserCheck}
                  label="Manager"
                  value={
                    managerName ||
                    "Not assigned"
                  }
                />


                <EmployeeInfoRow
                  icon={BriefcaseBusiness}
                  label="Employment Type"
                  value={
                    formatEmploymentType(
                      leave.employee
                        .employmentType
                    )
                  }
                />


                <EmployeeInfoRow
                  icon={CalendarDays}
                  label="Joining Date"
                  value={
                    leave.employee
                      .joiningDate
                      ? formatDate(
                          leave.employee
                            .joiningDate
                        )
                      : "Not available"
                  }
                />

              </div>


              {/* ============================================= */}
              {/* EMPLOYEE PROFILE LINK */}
              {/* ============================================= */}

              <Link
                href={
                  `/admin/employees/${leave.employee.id}`
                }
                className="
                  mt-5
                  inline-flex h-10
                  w-full
                  items-center justify-center
                  rounded-lg
                  bg-blue-50
                  px-4
                  text-sm font-medium
                  text-blue-700
                  transition
                  hover:bg-blue-100
                "
              >
                View Employee Profile
              </Link>

            </div>

          </aside>


          {/* ================================================= */}
          {/* APPROVER CARD */}
          {/* ================================================= */}

          {leave.approver && (

            <aside
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
                  border-b border-slate-200
                  bg-slate-50/70
                  px-5 py-4
                "
              >

                <h2
                  className="
                    font-semibold
                    text-slate-900
                  "
                >
                  Reviewed By
                </h2>


                <p
                  className="
                    mt-0.5
                    text-sm
                    text-slate-500
                  "
                >
                  Leave decision reviewer
                </p>

              </div>


              <div className="p-5">

                <div
                  className="
                    flex items-center gap-3
                  "
                >

                  <div
                    className="
                      flex h-11 w-11
                      shrink-0
                      items-center justify-center
                      rounded-full
                      bg-green-50
                      text-sm font-semibold
                      text-green-700
                    "
                  >
                    {approverName
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>


                  <div className="min-w-0">

                    <p
                      className="
                        truncate
                        font-semibold
                        text-slate-900
                      "
                    >
                      {approverName}
                    </p>


                    <p
                      className="
                        mt-0.5
                        truncate
                        text-sm
                        text-slate-500
                      "
                    >
                      {
                        leave.approver
                          .designation ||
                        leave.approver
                          .employeeCode
                      }
                    </p>

                  </div>

                </div>


                <div
                  className="
                    mt-4
                    border-t border-slate-100
                    pt-4
                  "
                >

                  <EmployeeInfoRow
                    icon={Mail}
                    label="Email"
                    value={
                      leave.approver.email
                    }
                  />

                </div>

              </div>

            </aside>

          )}


          {/* ================================================= */}
          {/* REQUEST STATUS CARD */}
          {/* ================================================= */}

          <aside
            className={`
              rounded-xl
              border
              p-5
              ${
                getStatusPanelClass(
                  leave.status
                )
              }
            `}
          >

            <StatusIcon
              status={leave.status}
            />


            <h2
              className="
                mt-4
                font-semibold
              "
            >
              {
                getStatusTitle(
                  leave.status
                )
              }
            </h2>


            <p
              className="
                mt-1
                text-sm leading-6
                opacity-90
              "
            >
              {
                getStatusDescription(
                  leave.status
                )
              }
            </p>

          </aside>

        </div>

      </div>

    </div>
  )
}


// ============================================================
// OVERVIEW CARD
// ============================================================

type OverviewCardProps = {
  label: string

  value: string

  icon: React.ComponentType<{
    className?: string
  }>

  iconClassName: string
}


function OverviewCard({
  label,
  value,
  icon: Icon,
  iconClassName
}: OverviewCardProps) {

  return (
    <div
      className="
        rounded-xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >

      <div
        className="
          flex items-center gap-4
        "
      >

        <div
          className={`
            flex h-11 w-11
            shrink-0
            items-center justify-center
            rounded-lg
            ${iconClassName}
          `}
        >
          <Icon className="h-5 w-5" />
        </div>


        <div className="min-w-0">

          <p
            className="
              text-xs font-medium
              uppercase tracking-wide
              text-slate-500
            "
          >
            {label}
          </p>


          <p
            className="
              mt-1 truncate
              text-sm font-semibold
              text-slate-900
            "
          >
            {value}
          </p>

        </div>

      </div>

    </div>
  )
}


// ============================================================
// DETAIL SECTION
// ============================================================

type DetailSectionProps = {
  title: string

  description: string

  icon: React.ComponentType<{
    className?: string
  }>

  children: React.ReactNode
}


function DetailSection({
  title,
  description,
  icon: Icon,
  children
}: DetailSectionProps) {

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
// DETAIL ITEM
// ============================================================

type DetailItemProps = {
  label: string

  value?: string

  children?: React.ReactNode
}


function DetailItem({
  label,
  value,
  children
}: DetailItemProps) {

  return (
    <div>

      <p
        className="
          text-xs font-semibold
          uppercase tracking-wide
          text-slate-500
        "
      >
        {label}
      </p>


      <div
        className="
          mt-2
          text-sm font-medium
          text-slate-900
        "
      >
        {children ?? value ?? "—"}
      </div>

    </div>
  )
}


// ============================================================
// EMPLOYEE INFO ROW
// ============================================================

type EmployeeInfoRowProps = {
  icon: React.ComponentType<{
    className?: string
  }>

  label: string

  value: string
}


function EmployeeInfoRow({
  icon: Icon,
  label,
  value
}: EmployeeInfoRowProps) {

  return (
    <div
      className="
        flex items-start gap-3
      "
    >

      <div
        className="
          flex h-8 w-8
          shrink-0
          items-center justify-center
          rounded-lg
          bg-slate-50
          text-slate-500
        "
      >
        <Icon className="h-4 w-4" />
      </div>


      <div className="min-w-0">

        <p
          className="
            text-xs font-medium
            text-slate-500
          "
        >
          {label}
        </p>


        <p
          className="
            mt-0.5
            break-words
            text-sm font-medium
            text-slate-800
          "
        >
          {value}
        </p>

      </div>

    </div>
  )
}


// ============================================================
// STATUS ICON
// ============================================================

function StatusIcon({
  status
}: {
  status: LeaveStatus
}) {

  if (
    status ===
    LeaveStatus.approved
  ) {

    return (
      <CheckCircle2 className="h-8 w-8" />
    )
  }


  if (
    status ===
    LeaveStatus.rejected
  ) {

    return (
      <XCircle className="h-8 w-8" />
    )
  }


  if (
    status ===
    LeaveStatus.cancelled
  ) {

    return (
      <XCircle className="h-8 w-8" />
    )
  }


  return (
    <Clock3 className="h-8 w-8" />
  )
}


// ============================================================
// STATUS PANEL CLASS
// ============================================================

function getStatusPanelClass(
  status: LeaveStatus
) {

  switch (status) {

    case LeaveStatus.pending:

      return `
        border-orange-200
        bg-orange-50
        text-orange-900
      `


    case LeaveStatus.approved:

      return `
        border-green-200
        bg-green-50
        text-green-900
      `


    case LeaveStatus.rejected:

      return `
        border-red-200
        bg-red-50
        text-red-900
      `


    case LeaveStatus.cancelled:

      return `
        border-slate-200
        bg-slate-50
        text-slate-800
      `
  }
}


// ============================================================
// STATUS TITLE
// ============================================================

function getStatusTitle(
  status: LeaveStatus
) {

  switch (status) {

    case LeaveStatus.pending:
      return "Awaiting Decision"

    case LeaveStatus.approved:
      return "Leave Approved"

    case LeaveStatus.rejected:
      return "Leave Rejected"

    case LeaveStatus.cancelled:
      return "Leave Cancelled"
  }
}


// ============================================================
// STATUS DESCRIPTION
// ============================================================

function getStatusDescription(
  status: LeaveStatus
) {

  switch (status) {

    case LeaveStatus.pending:

      return (
        "This leave request is waiting for approval or rejection."
      )


    case LeaveStatus.approved:

      return (
        "This leave request has been approved by an authorized internal employee."
      )


    case LeaveStatus.rejected:

      return (
        "This leave request has been reviewed and rejected."
      )


    case LeaveStatus.cancelled:

      return (
        "This leave request has been cancelled and retained for historical records."
      )
  }
}