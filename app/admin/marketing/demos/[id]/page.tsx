import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe2,
  Mail,
  MonitorPlay,
  RefreshCcw,
  Save,
  UserRound,
  Video,
  XCircle,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import {
  rescheduleDemoAction,
  updateDemoNotesAction,
  updateDemoStatusAction,
  updateMeetingLinkAction,
} from "./actions"

/* =========================================================
   HELPERS
========================================================= */

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ")
}

function statusClasses(status: string) {
  switch (status) {
    case "scheduled":
      return "bg-violet-50 text-violet-700 ring-violet-200"

    case "confirmed":
      return "bg-blue-50 text-blue-700 ring-blue-200"

    case "completed":
      return "bg-green-50 text-green-700 ring-green-200"

    case "rescheduled":
      return "bg-orange-50 text-orange-700 ring-orange-200"

    case "cancelled":
      return "bg-red-50 text-red-700 ring-red-200"

    case "no_show":
      return "bg-slate-100 text-slate-700 ring-slate-200"

    default:
      return "bg-slate-100 text-slate-700 ring-slate-200"
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function MarketingDemoDetailPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const { id } = await params

  /* =======================================================
     CURRENT EMPLOYEE
  ======================================================= */

  const employee = await prisma.employee.findFirst({
    where: {
      userId: session.user.id,
      active: true,
    },

    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  })

  if (!employee) {
    redirect("/admin/marketing/demos")
  }

  /* =======================================================
     DEMO
  ======================================================= */

  const demo = await prisma.demoSchedule.findFirst({
    where: {
      id,
      marketingEmployeeId: employee.id,
    },

    select: {
      id: true,

      companyId: true,

      meetingDate: true,

      meetingLink: true,

      status: true,

      notes: true,

      createdAt: true,

      updatedAt: true,

      company: {
        select: {
          id: true,
          companyName: true,
          ownerName: true,
          industry: true,
          website: true,
          primaryEmail: true,
        },
      },

      marketer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },

      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!demo) {
    notFound()
  }

  const company = demo.company

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">

      {/* ===================================================
          BACK
      =================================================== */}

      <Link
        href="/admin/marketing/demos"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-blue-600
          hover:text-blue-700
        "
      >
        <ArrowLeft className="h-4 w-4" />

        Back to My Demos
      </Link>

      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          xl:flex-row
          xl:items-start
          xl:justify-between
        "
      >
        <div className="flex items-start gap-4">

          <div
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              text-blue-600
            "
          >
            <MonitorPlay className="h-7 w-7" />
          </div>

          <div>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-slate-950
                "
              >
                {company.companyName}
              </h1>

              <span
                className={`
                  inline-flex
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  ring-1
                  ring-inset
                  ${statusClasses(demo.status)}
                `}
              >
                {formatStatus(demo.status)}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Demo meeting details, company information,
              meeting controls, and outcome management.
            </p>

          </div>
        </div>

        {demo.meetingLink && (
          <a
            href={demo.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-green-600
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-green-700
            "
          >
            <Video className="h-4 w-4" />

            Join Demo

            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* ===================================================
          MAIN GRID
      =================================================== */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-[minmax(0,1.6fr)_minmax(340px,0.8fr)]
        "
      >

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="space-y-6">

          {/* ===============================================
              DEMO DETAILS
          =============================================== */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <SectionHeader
              icon={CalendarDays}
              title="Demo Details"
              description="Current schedule and meeting information."
            />

            <div
              className="
                grid
                gap-4
                p-5
                md:grid-cols-2
              "
            >
              <InfoCard
                icon={CalendarClock}
                label="Meeting Date"
                value={formatDateTime(
                  demo.meetingDate
                )}
              />

              <InfoCard
                icon={UserRound}
                label="Assigned Marketer"
                value={`${demo.marketer.firstName} ${demo.marketer.lastName}`}
              />

              <InfoCard
                icon={Mail}
                label="Marketer Email"
                value={demo.marketer.email}
              />

              <InfoCard
                icon={Clock3}
                label="Created"
                value={formatDateTime(
                  demo.createdAt
                )}
              />
            </div>
          </section>

          {/* ===============================================
              COMPANY DETAILS
          =============================================== */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <SectionHeader
              icon={Building2}
              title="Company Information"
              description="Lead company details for demo preparation."
            />

            <div
              className="
                grid
                gap-4
                p-5
                md:grid-cols-2
              "
            >
              <InfoCard
                icon={Building2}
                label="Company"
                value={company.companyName}
              />

              <InfoCard
                icon={UserRound}
                label="Owner / Contact"
                value={
                  company.ownerName ||
                  "Not provided"
                }
              />

              <InfoCard
                icon={MonitorPlay}
                label="Industry"
                value={
                  company.industry ||
                  "Not provided"
                }
              />

              <InfoCard
                icon={Mail}
                label="Primary Email"
                value={
                  company.primaryEmail ||
                  "Not provided"
                }
              />
            </div>

            {company.website && (
              <div
                className="
                  border-t
                  border-slate-100
                  px-5
                  py-4
                "
              >
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-blue-600
                    hover:text-blue-700
                  "
                >
                  <Globe2 className="h-4 w-4" />

                  Visit Company Website

                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </section>

          {/* ===============================================
              NOTES
          =============================================== */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <SectionHeader
              icon={Save}
              title="Demo Notes"
              description="Preparation notes and demo outcome details."
            />

            <form
              action={updateDemoNotesAction}
              className="p-5"
            >
              <input
                type="hidden"
                name="demoId"
                value={demo.id}
              />

              <textarea
                name="notes"
                defaultValue={demo.notes ?? ""}
                rows={7}
                placeholder="Add demo preparation notes, customer requirements, objections, questions, or outcome details..."
                className="
                  w-full
                  resize-y
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

              <div className="mt-4 flex justify-end">

                <button
                  type="submit"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-blue-600
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  <Save className="h-4 w-4" />

                  Save Notes
                </button>

              </div>
            </form>
          </section>

        </div>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <div className="space-y-6">

          {/* ===============================================
              STATUS ACTIONS
          =============================================== */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <SectionHeader
              icon={CheckCircle2}
              title="Demo Status"
              description="Update the current demo stage."
            />

            <div className="space-y-3 p-5">

              <StatusButton
                demoId={demo.id}
                status="confirmed"
                label="Confirm Demo"
                icon={CheckCircle2}
                className="
                  bg-blue-600
                  text-white
                  hover:bg-blue-700
                "
              />

              <StatusButton
                demoId={demo.id}
                status="completed"
                label="Mark Completed"
                icon={CheckCircle2}
                className="
                  bg-green-600
                  text-white
                  hover:bg-green-700
                "
              />

              <StatusButton
                demoId={demo.id}
                status="no_show"
                label="Mark No Show"
                icon={Clock3}
                className="
                  bg-orange-500
                  text-white
                  hover:bg-orange-600
                "
              />

              <StatusButton
                demoId={demo.id}
                status="cancelled"
                label="Cancel Demo"
                icon={XCircle}
                className="
                  bg-red-600
                  text-white
                  hover:bg-red-700
                "
              />

            </div>
          </section>

          {/* ===============================================
              RESCHEDULE
          =============================================== */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <SectionHeader
              icon={RefreshCcw}
              title="Reschedule"
              description="Move the demo to another date and time."
            />

            <form
              action={rescheduleDemoAction}
              className="space-y-4 p-5"
            >
              <input
                type="hidden"
                name="demoId"
                value={demo.id}
              />

              <div>

                <label
                  htmlFor="meetingDate"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  New Meeting Date
                </label>

                <input
                  id="meetingDate"
                  name="meetingDate"
                  type="datetime-local"
                  required
                  className="
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    focus:border-orange-500
                    focus:ring-2
                    focus:ring-orange-100
                  "
                />

              </div>

              <button
                type="submit"
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-orange-500
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-orange-600
                "
              >
                <RefreshCcw className="h-4 w-4" />

                Reschedule Demo
              </button>

            </form>
          </section>

          {/* ===============================================
              MEETING LINK
          =============================================== */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <SectionHeader
              icon={Video}
              title="Meeting Link"
              description="Add or update the online meeting URL."
            />

            <form
              action={updateMeetingLinkAction}
              className="space-y-4 p-5"
            >
              <input
                type="hidden"
                name="demoId"
                value={demo.id}
              />

              <input
                name="meetingLink"
                type="url"
                defaultValue={
                  demo.meetingLink ?? ""
                }
                placeholder="https://..."
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  px-3
                  py-2.5
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

              <button
                type="submit"
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                <Save className="h-4 w-4" />

                Save Meeting Link
              </button>

            </form>
          </section>

          {/* ===============================================
              CREATED BY
          =============================================== */}

          {demo.createdBy && (
            <section
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Scheduled By
              </p>

              <p
                className="
                  mt-2
                  font-semibold
                  text-slate-900
                "
              >
                {demo.createdBy.name}
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                {demo.createdBy.email}
              </p>
            </section>
          )}

        </div>

      </div>
    </div>
  )
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        border-b
        border-slate-200
        bg-slate-50/70
        px-5
        py-4
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-blue-50
          text-blue-600
        "
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>

        <h2 className="font-semibold text-slate-950">
          {title}
        </h2>

        <p className="mt-0.5 text-sm text-slate-500">
          {description}
        </p>

      </div>
    </div>
  )
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-slate-50/60
        p-4
      "
    >
      <div className="flex items-start gap-3">

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-white
            text-blue-600
            ring-1
            ring-slate-200
          "
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">

          <p className="text-xs text-slate-500">
            {label}
          </p>

          <p
            className="
              mt-1
              break-words
              text-sm
              font-semibold
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

/* =========================================================
   STATUS BUTTON
========================================================= */

function StatusButton({
  demoId,
  status,
  label,
  icon: Icon,
  className,
}: {
  demoId: string

  status:
    | "confirmed"
    | "completed"
    | "cancelled"
    | "no_show"

  label: string

  icon: React.ElementType

  className: string
}) {
  return (
    <form action={updateDemoStatusAction}>

      <input
        type="hidden"
        name="demoId"
        value={demoId}
      />

      <input
        type="hidden"
        name="status"
        value={status}
      />

      <button
        type="submit"
        className={`
          inline-flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          px-4
          py-2.5
          text-sm
          font-semibold
          transition
          ${className}
        `}
      >
        <Icon className="h-4 w-4" />

        {label}
      </button>

    </form>
  )
}