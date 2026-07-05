import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  AttendanceStatus,
  UserRole
} from "@prisma/client"

import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Clock3,
  Coffee,
  FileText,
  Globe2,
  Home,
  Laptop,
  Mail,
  MapPin,
  Timer,
  UserRound,
  Wifi
} from "lucide-react"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import AttendanceActions from "../components/AttendanceActions"


// ============================================================
// TYPES
// ============================================================

type AttendanceDetailPageProps = {
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


const EDIT_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


const DELETE_ROLES: UserRole[] = [
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
  AttendanceStatus,
  string
> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  half_day: "Half Day",
  leave: "Leave",
  holiday: "Holiday",
  weekend: "Weekend",
  work_from_home: "Work From Home"
}


// ============================================================
// STATUS STYLES
// ============================================================

const STATUS_STYLES: Record<
  AttendanceStatus,
  string
> = {
  present:
    "border-green-200 bg-green-50 text-green-700",

  absent:
    "border-red-200 bg-red-50 text-red-700",

  late:
    "border-orange-200 bg-orange-50 text-orange-700",

  half_day:
    "border-orange-200 bg-orange-50 text-orange-700",

  leave:
    "border-blue-200 bg-blue-50 text-blue-700",

  holiday:
    "border-purple-200 bg-purple-50 text-purple-700",

  weekend:
    "border-slate-200 bg-slate-50 text-slate-700",

  work_from_home:
    "border-cyan-200 bg-cyan-50 text-cyan-700"
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
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }
  ).format(date)
}


function formatDateTime(
  date: Date | null
) {

  if (!date) {
    return "—"
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC"
    }
  ).format(date)
}


function formatTime(
  date: Date | null
) {

  if (!date) {
    return "—"
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC"
    }
  ).format(date)
}


function formatHours(
  value: number | null
) {

  if (value === null) {
    return "—"
  }

  return `${value.toFixed(2)} hrs`
}


function getEmployeeName(
  employee: {
    employeeCode: string | null

    user: {
      name: string | null
      email: string
    } | null
  }
) {

  return (
    employee.user?.name?.trim() ||
    employee.user?.email ||
    employee.employeeCode ||
    "Employee"
  )
}


// ============================================================
// PAGE
// ============================================================

export default async function AttendanceDetailPage({
  params
}: AttendanceDetailPageProps) {

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
    redirect("/admin/dashboard")
  }


  const {
    id
  } = await params


  // ----------------------------------------------------------
  // ATTENDANCE RECORD
  // ----------------------------------------------------------

  const attendance =
    await prisma.employeeAttendance.findUnique({

      where: {
        id
      },

      include: {

        employee: {
          select: {
            id: true,
            employeeCode: true,

            user: {
              select: {
                name: true,
                email: true
              }
            },

            department: {
              select: {
                id: true,
                name: true
              }
            },

            role: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },


        approver: {
          select: {
            id: true,
            employeeCode: true,

            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }

      }
    })


  if (!attendance) {
    notFound()
  }


  // ----------------------------------------------------------
  // PERMISSIONS
  // ----------------------------------------------------------

  const canEdit =
    EDIT_ROLES.includes(
      currentRole
    )


  const canDelete =
    DELETE_ROLES.includes(
      currentRole
    )


  const canApprove =
    APPROVE_ROLES.includes(
      currentRole
    )


  // ----------------------------------------------------------
  // DISPLAY VALUES
  // ----------------------------------------------------------

  const employeeName =
    getEmployeeName(
      attendance.employee
    )


  const approverName =
    attendance.approver
      ? getEmployeeName(
          attendance.approver
        )
      : null


  const formattedAttendanceDate =
    formatDate(
      attendance.attendanceDate
    )


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================== */}
      {/* BACK */}
      {/* ==================================================== */}

      <div>

        <Link
          href="/admin/attendance"
          className="
            inline-flex items-center gap-2
            text-sm font-medium
            text-blue-600
            transition
            hover:text-blue-700
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Attendance
        </Link>

      </div>


      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-col gap-5
          xl:flex-row
          xl:items-start
          xl:justify-between
        "
      >

        <div className="flex items-start gap-4">

          <div
            className="
              flex h-12 w-12
              shrink-0
              items-center justify-center
              rounded-xl
              bg-blue-50
              text-blue-700
            "
          >
            <CalendarDays className="h-6 w-6" />
          </div>


          <div>

            <div className="flex flex-wrap items-center gap-3">

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
                  ${STATUS_STYLES[attendance.status]}
                `}
              >
                {
                  STATUS_LABELS[
                    attendance.status
                  ]
                }
              </span>

            </div>


            <p className="mt-1 text-sm text-slate-500">
              Attendance record for{" "}
              {formattedAttendanceDate}
            </p>

          </div>

        </div>


        <AttendanceActions
          attendanceId={attendance.id}
          employeeName={employeeName}
          attendanceDate={
            formattedAttendanceDate
          }
          isApproved={
            Boolean(
              attendance.approvedAt
            )
          }
          canEdit={canEdit}
          canDelete={canDelete}
          canApprove={canApprove}
        />

      </div>


      {/* ==================================================== */}
      {/* SUMMARY CARDS */}
      {/* ==================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          label="Check In"
          value={
            formatTime(
              attendance.checkIn
            )
          }
          icon={Clock3}
          iconClassName="bg-green-50 text-green-600"
        />


        <SummaryCard
          label="Check Out"
          value={
            formatTime(
              attendance.checkOut
            )
          }
          icon={Clock3}
          iconClassName="bg-blue-50 text-blue-600"
        />


        <SummaryCard
          label="Working Hours"
          value={
            formatHours(
              attendance.totalHours
            )
          }
          icon={Timer}
          iconClassName="bg-blue-50 text-blue-600"
        />


        <SummaryCard
          label="Overtime"
          value={`${attendance.overtimeHours.toFixed(2)} hrs`}
          icon={Timer}
          iconClassName="bg-orange-50 text-orange-600"
        />

      </div>


      {/* ==================================================== */}
      {/* MAIN GRID */}
      {/* ==================================================== */}

      <div className="grid gap-6 xl:grid-cols-3">

        {/* ================================================== */}
        {/* LEFT COLUMN */}
        {/* ================================================== */}

        <div className="space-y-6 xl:col-span-2">

          {/* ================================================ */}
          {/* ATTENDANCE DETAILS */}
          {/* ================================================ */}

          <DetailSection
            title="Attendance Details"
            description="Primary attendance and working-hour information."
            icon={CalendarDays}
          >

            <div className="grid gap-5 sm:grid-cols-2">

              <DetailItem
                label="Attendance Date"
                value={
                  formattedAttendanceDate
                }
              />


              <DetailItem
                label="Status"
                value={
                  STATUS_LABELS[
                    attendance.status
                  ]
                }
              />


              <DetailItem
                label="Check In"
                value={
                  formatTime(
                    attendance.checkIn
                  )
                }
              />


              <DetailItem
                label="Check Out"
                value={
                  formatTime(
                    attendance.checkOut
                  )
                }
              />


              <DetailItem
                label="Break Duration"
                value={`${attendance.breakMinutes} minutes`}
              />


              <DetailItem
                label="Total Working Hours"
                value={
                  formatHours(
                    attendance.totalHours
                  )
                }
              />


              <DetailItem
                label="Overtime Hours"
                value={`${attendance.overtimeHours.toFixed(2)} hrs`}
              />


              <DetailItem
                label="Work Location"
                value={
                  attendance.workLocation ||
                  "—"
                }
              />

            </div>

          </DetailSection>


          {/* ================================================ */}
          {/* LOCATION */}
          {/* ================================================ */}

          <DetailSection
            title="Location Information"
            description="Location data recorded with this attendance entry."
            icon={MapPin}
          >

            <div className="grid gap-5 sm:grid-cols-2">

              <DetailItem
                label="Work Location"
                value={
                  attendance.workLocation ||
                  "—"
                }
                icon={Home}
              />


              <DetailItem
                label="Coordinates"
                value={
                  attendance.latitude !== null &&
                  attendance.longitude !== null
                    ? `${attendance.latitude}, ${attendance.longitude}`
                    : "—"
                }
                icon={Globe2}
              />


              <DetailItem
                label="Latitude"
                value={
                  attendance.latitude !== null
                    ? String(
                        attendance.latitude
                      )
                    : "—"
                }
              />


              <DetailItem
                label="Longitude"
                value={
                  attendance.longitude !== null
                    ? String(
                        attendance.longitude
                      )
                    : "—"
                }
              />

            </div>

          </DetailSection>


          {/* ================================================ */}
          {/* TECHNICAL INFORMATION */}
          {/* ================================================ */}

          <DetailSection
            title="Device Information"
            description="Technical information associated with the attendance entry."
            icon={Laptop}
          >

            <div className="grid gap-5 sm:grid-cols-2">

              <DetailItem
                label="IP Address"
                value={
                  attendance.ipAddress ||
                  "—"
                }
                icon={Wifi}
              />


              <DetailItem
                label="Device"
                value={
                  attendance.device ||
                  "—"
                }
                icon={Laptop}
              />

            </div>

          </DetailSection>


          {/* ================================================ */}
          {/* REMARKS */}
          {/* ================================================ */}

          <DetailSection
            title="Remarks"
            description="Internal notes attached to this attendance record."
            icon={FileText}
          >

            {attendance.remarks ? (

              <p
                className="
                  whitespace-pre-wrap
                  text-sm leading-7
                  text-slate-700
                "
              >
                {attendance.remarks}
              </p>

            ) : (

              <p className="text-sm text-slate-500">
                No remarks were added to this
                attendance record.
              </p>

            )}

          </DetailSection>

        </div>


        {/* ================================================== */}
        {/* RIGHT COLUMN */}
        {/* ================================================== */}

        <div className="space-y-6">

          {/* ================================================ */}
          {/* EMPLOYEE */}
          {/* ================================================ */}

          <SideCard
            title="Employee"
            icon={UserRound}
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex h-11 w-11
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-blue-50
                  text-base font-semibold
                  text-blue-700
                "
              >
                {employeeName
                  .charAt(0)
                  .toUpperCase()}
              </div>


              <div className="min-w-0">

                <Link
                  href={`/admin/employees/${attendance.employee.id}`}
                  className="
                    block truncate
                    text-sm font-semibold
                    text-blue-700
                    hover:text-blue-800
                    hover:underline
                  "
                >
                  {employeeName}
                </Link>


                {attendance.employee.user?.email && (

                  <div
                    className="
                      mt-1
                      flex items-center gap-1.5
                      text-xs text-slate-500
                    "
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />

                    <span className="truncate">
                      {
                        attendance.employee
                          .user.email
                      }
                    </span>
                  </div>

                )}

              </div>

            </div>


            <div className="mt-5 space-y-3">

              <SideDetailRow
                label="Employee Code"
                value={
                  attendance.employee
                    .employeeCode ||
                  "—"
                }
              />


              <SideDetailRow
                label="Department"
                value={
                  attendance.employee
                    .department?.name ||
                  "—"
                }
              />


              <SideDetailRow
                label="Internal Role"
                value={
                  attendance.employee
                    .role?.name ||
                  "—"
                }
              />

            </div>

          </SideCard>


          {/* ================================================ */}
          {/* APPROVAL */}
          {/* ================================================ */}

          <SideCard
            title="Approval"
            icon={BadgeCheck}
          >

            {attendance.approvedAt ? (

              <div>

                <div
                  className="
                    rounded-lg
                    border border-green-200
                    bg-green-50
                    p-4
                  "
                >

                  <div className="flex items-center gap-2">

                    <BadgeCheck
                      className="
                        h-5 w-5
                        text-green-600
                      "
                    />

                    <span
                      className="
                        text-sm font-semibold
                        text-green-800
                      "
                    >
                      Approved
                    </span>

                  </div>


                  <p
                    className="
                      mt-2
                      text-xs leading-5
                      text-green-700
                    "
                  >
                    This attendance record has
                    been reviewed and approved.
                  </p>

                </div>


                <div className="mt-4 space-y-3">

                  <SideDetailRow
                    label="Approved By"
                    value={
                      approverName ||
                      "Unknown Employee"
                    }
                  />


                  <SideDetailRow
                    label="Approved At"
                    value={
                      formatDateTime(
                        attendance.approvedAt
                      )
                    }
                  />

                </div>

              </div>

            ) : (

              <div
                className="
                  rounded-lg
                  border border-orange-200
                  bg-orange-50
                  p-4
                "
              >

                <div className="flex items-center gap-2">

                  <Clock3
                    className="
                      h-5 w-5
                      text-orange-600
                    "
                  />

                  <span
                    className="
                      text-sm font-semibold
                      text-orange-800
                    "
                  >
                    Pending Approval
                  </span>

                </div>


                <p
                  className="
                    mt-2
                    text-xs leading-5
                    text-orange-700
                  "
                >
                  This attendance record has not
                  yet been approved.
                </p>

              </div>

            )}

          </SideCard>


          {/* ================================================ */}
          {/* AUDIT INFORMATION */}
          {/* ================================================ */}

          <SideCard
            title="Record Information"
            icon={FileText}
          >

            <div className="space-y-3">

              <SideDetailRow
                label="Created"
                value={
                  formatDateTime(
                    attendance.createdAt
                  )
                }
              />


              <SideDetailRow
                label="Last Updated"
                value={
                  formatDateTime(
                    attendance.updatedAt
                  )
                }
              />

            </div>

          </SideCard>

        </div>

      </div>

    </div>
  )
}


// ============================================================
// SUMMARY CARD
// ============================================================

type SummaryCardProps = {
  label: string
  value: string

  icon: React.ComponentType<{
    className?: string
  }>

  iconClassName: string
}


function SummaryCard({
  label,
  value,
  icon: Icon,
  iconClassName
}: SummaryCardProps) {

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

      <div className="flex items-center justify-between gap-4">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p
            className="
              mt-2
              text-xl font-semibold
              text-slate-900
            "
          >
            {value}
          </p>

        </div>


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
// DETAIL ITEM
// ============================================================

type DetailItemProps = {
  label: string
  value: string

  icon?: React.ComponentType<{
    className?: string
  }>
}


function DetailItem({
  label,
  value,
  icon: Icon
}: DetailItemProps) {

  return (
    <div>

      <p
        className="
          flex items-center gap-1.5
          text-xs font-medium
          uppercase tracking-wide
          text-slate-500
        "
      >
        {Icon && (
          <Icon className="h-3.5 w-3.5" />
        )}

        {label}
      </p>


      <p
        className="
          mt-1.5
          break-words
          text-sm font-medium
          text-slate-900
        "
      >
        {value}
      </p>

    </div>
  )
}


// ============================================================
// SIDE CARD
// ============================================================

type SideCardProps = {
  title: string

  icon: React.ComponentType<{
    className?: string
  }>

  children: React.ReactNode
}


function SideCard({
  title,
  icon: Icon,
  children
}: SideCardProps) {

  return (
    <section
      className="
        rounded-xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >

      <div className="mb-4 flex items-center gap-2">

        <Icon className="h-4 w-4 text-blue-600" />

        <h2 className="font-semibold text-slate-900">
          {title}
        </h2>

      </div>


      {children}

    </section>
  )
}


// ============================================================
// SIDE DETAIL ROW
// ============================================================

type SideDetailRowProps = {
  label: string
  value: string
}


function SideDetailRow({
  label,
  value
}: SideDetailRowProps) {

  return (
    <div
      className="
        flex items-start
        justify-between
        gap-4
      "
    >

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span
        className="
          max-w-[60%]
          break-words
          text-right
          text-sm font-medium
          text-slate-900
        "
      >
        {value}
      </span>

    </div>
  )
}