import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Mail,
  MonitorPlay,
  Phone,
  RefreshCw,
  StickyNote,
  Target,
  UserRound,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   TYPES
========================================================= */

type PageProps = {
  params: Promise<{
    id: string
  }>
}

/* =========================================================
   HELPERS
========================================================= */

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function formatLabel(value: string | null | undefined) {
  if (!value) return "Not provided"

  return value
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ")
}

function followUpStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-50 text-green-700 ring-green-200"

    case "contacted":
      return "bg-blue-50 text-blue-700 ring-blue-200"

    case "interested":
      return "bg-violet-50 text-violet-700 ring-violet-200"

    case "pending":
      return "bg-orange-50 text-orange-700 ring-orange-200"

    case "cancelled":
      return "bg-red-50 text-red-700 ring-red-200"

    default:
      return "bg-slate-100 text-slate-700 ring-slate-200"
  }
}

function demoStatusClasses(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700 ring-green-200"

    case "confirmed":
      return "bg-blue-50 text-blue-700 ring-blue-200"

    case "scheduled":
      return "bg-violet-50 text-violet-700 ring-violet-200"

    case "rescheduled":
      return "bg-orange-50 text-orange-700 ring-orange-200"

    case "no_show":
      return "bg-red-50 text-red-700 ring-red-200"

    case "cancelled":
      return "bg-slate-100 text-slate-700 ring-slate-200"

    default:
      return "bg-slate-100 text-slate-700 ring-slate-200"
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function MarketingFollowUpDetailPage({
  params,
}: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const { id } = await params

  /* =======================================================
     CURRENT MARKETING EMPLOYEE
  ======================================================= */

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
      },
    })

  if (!employee) {
    redirect("/admin/dashboard")
  }

  /* =======================================================
     FOLLOW-UP RECORD

     No Prisma relation assumptions here.
  ======================================================= */

  const followUp =
    await prisma.demoFollowUp.findFirst({
      where: {
        id,
        marketingEmployeeId: employee.id,
      },

      select: {
        id: true,
        demoScheduleId: true,
        marketingEmployeeId: true,
        followUpDate: true,
        type: true,
        status: true,
        outcome: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    })

  if (!followUp) {
    notFound()
  }

  /* =======================================================
     DEMO RECORD
  ======================================================= */

  const demo =
    await prisma.demoSchedule.findFirst({
      where: {
        id: followUp.demoScheduleId,
        marketingEmployeeId: employee.id,
      },

      select: {
        id: true,
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
            phone: true,
            designation: true,
          },
        },
      },
    })

  if (!demo) {
    notFound()
  }

  /* =======================================================
     OTHER FOLLOW-UPS FOR SAME DEMO
  ======================================================= */

  const followUpHistory =
    await prisma.demoFollowUp.findMany({
      where: {
        demoScheduleId: demo.id,
        marketingEmployeeId: employee.id,
      },

      select: {
        id: true,
        followUpDate: true,
        type: true,
        status: true,
        outcome: true,
        notes: true,
        createdAt: true,
      },

      orderBy: {
        followUpDate: "desc",
      },
    })

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">

      {/* ===================================================
          BACK
      =================================================== */}

      <Link
        href="/admin/marketing/follow-ups"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-slate-500
          transition
          hover:text-slate-900
        "
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Follow-ups
      </Link>

      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          xl:flex-row
          xl:items-start
          xl:justify-between
        "
      >
        <div>
          <p
            className="
              text-sm
              font-medium
              text-blue-600
            "
          >
            Marketing Follow-up
          </p>

          <div
            className="
              mt-1
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
              {demo.company.companyName}
            </h1>

            <span
              className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-xs
                font-semibold
                ring-1
                ring-inset
                ${followUpStatusClasses(
                  followUp.status
                )}
              `}
            >
              {formatLabel(followUp.status)}
            </span>
          </div>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Manage customer communication,
            follow-up outcome, and post-demo
            conversion activity.
          </p>
        </div>

        <div
          className="
            flex
            flex-wrap
            gap-3
          "
        >
          {demo.company.primaryEmail && (
            <a
              href={`mailto:${demo.company.primaryEmail}`}
              className="
                inline-flex
                items-center
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
              <Mail className="h-4 w-4" />

              Send Email
            </a>
          )}

          <Link
            href={`/admin/marketing/demos/${demo.id}`}
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
            <MonitorPlay className="h-4 w-4" />

            View Demo
          </Link>
        </div>
      </div>

      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        <SummaryCard
          icon={CalendarClock}
          label="Follow-up Date"
          value={formatDateTime(
            followUp.followUpDate
          )}
          iconClassName="
            bg-blue-50
            text-blue-600
          "
        />

        <SummaryCard
          icon={Target}
          label="Follow-up Type"
          value={formatLabel(followUp.type)}
          iconClassName="
            bg-violet-50
            text-violet-600
          "
        />

        <SummaryCard
          icon={MonitorPlay}
          label="Demo Status"
          value={formatLabel(demo.status)}
          iconClassName="
            bg-green-50
            text-green-600
          "
        />

        <SummaryCard
          icon={Clock3}
          label="Follow-up Records"
          value={String(followUpHistory.length)}
          iconClassName="
            bg-orange-50
            text-orange-600
          "
        />
      </div>

      {/* ===================================================
          MAIN GRID
      =================================================== */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-[1.5fr_1fr]
        "
      >

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="space-y-6">

          {/* FOLLOW-UP DETAILS */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <div
              className="
                border-b
                border-slate-200
                px-6
                py-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                  "
                >
                  <RefreshCw className="h-5 w-5" />
                </div>

                <div>
                  <h2
                    className="
                      font-semibold
                      text-slate-950
                    "
                  >
                    Follow-up Details
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      text-slate-500
                    "
                  >
                    Current customer follow-up
                    information.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="
                grid
                gap-5
                p-6
                md:grid-cols-2
              "
            >
              <InfoItem
                label="Follow-up Date"
                value={formatDateTime(
                  followUp.followUpDate
                )}
              />

              <InfoItem
                label="Type"
                value={formatLabel(
                  followUp.type
                )}
              />

              <InfoItem
                label="Status"
                value={formatLabel(
                  followUp.status
                )}
              />

              <InfoItem
                label="Outcome"
                value={
                  followUp.outcome ||
                  "No outcome recorded yet"
                }
              />
            </div>

            <div
              className="
                border-t
                border-slate-100
                px-6
                py-5
              "
            >
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                Follow-up Notes
              </p>

              <div
                className="
                  mt-3
                  rounded-xl
                  bg-slate-50
                  p-4
                "
              >
                <p
                  className="
                    whitespace-pre-wrap
                    text-sm
                    leading-6
                    text-slate-700
                  "
                >
                  {followUp.notes ||
                    "No follow-up notes have been added."}
                </p>
              </div>
            </div>
          </section>

          {/* DEMO DETAILS */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                px-6
                py-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-violet-50
                    text-violet-600
                  "
                >
                  <MonitorPlay className="h-5 w-5" />
                </div>

                <div>
                  <h2
                    className="
                      font-semibold
                      text-slate-950
                    "
                  >
                    Demo Information
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      text-slate-500
                    "
                  >
                    Original demo and meeting
                    details.
                  </p>
                </div>
              </div>

              <span
                className={`
                  inline-flex
                  rounded-full
                  px-2.5
                  py-1
                  text-xs
                  font-semibold
                  ring-1
                  ring-inset
                  ${demoStatusClasses(
                    demo.status
                  )}
                `}
              >
                {formatLabel(demo.status)}
              </span>
            </div>

            <div
              className="
                grid
                gap-5
                p-6
                md:grid-cols-2
              "
            >
              <InfoItem
                label="Meeting Date"
                value={formatDateTime(
                  demo.meetingDate
                )}
              />

              <InfoItem
                label="Marketing Executive"
                value={`${demo.marketer.firstName} ${demo.marketer.lastName}`}
              />

              <InfoItem
                label="Marketing Email"
                value={demo.marketer.email}
              />

              <InfoItem
                label="Designation"
                value={
                  demo.marketer.designation ||
                  "Marketing"
                }
              />
            </div>

            {demo.meetingLink && (
              <div
                className="
                  border-t
                  border-slate-100
                  px-6
                  py-5
                "
              >
                <a
                  href={demo.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-blue-50
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-blue-700
                    transition
                    hover:bg-blue-100
                  "
                >
                  <ExternalLink className="h-4 w-4" />

                  Open Meeting Link
                </a>
              </div>
            )}

            {demo.notes && (
              <div
                className="
                  border-t
                  border-slate-100
                  px-6
                  py-5
                "
              >
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Demo Notes
                </p>

                <p
                  className="
                    mt-3
                    whitespace-pre-wrap
                    text-sm
                    leading-6
                    text-slate-700
                  "
                >
                  {demo.notes}
                </p>
              </div>
            )}
          </section>

          {/* FOLLOW-UP HISTORY */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <div
              className="
                border-b
                border-slate-200
                px-6
                py-5
              "
            >
              <h2
                className="
                  font-semibold
                  text-slate-950
                "
              >
                Follow-up History
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Previous and scheduled customer
                follow-up activities.
              </p>
            </div>

            <div
              className="
                divide-y
                divide-slate-100
              "
            >
              {followUpHistory.map((item) => (
                <div
                  key={item.id}
                  className="
                    flex
                    flex-col
                    gap-4
                    px-6
                    py-5
                    md:flex-row
                    md:items-start
                    md:justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <div
                      className="
                        mt-0.5
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-blue-50
                        text-blue-600
                      "
                    >
                      <Phone className="h-4 w-4" />
                    </div>

                    <div>
                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >
                        <p
                          className="
                            font-semibold
                            text-slate-900
                          "
                        >
                          {formatLabel(item.type)}
                        </p>

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-2
                            py-0.5
                            text-xs
                            font-semibold
                            ring-1
                            ring-inset
                            ${followUpStatusClasses(
                              item.status
                            )}
                          `}
                        >
                          {formatLabel(
                            item.status
                          )}
                        </span>
                      </div>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-slate-500
                        "
                      >
                        {formatDateTime(
                          item.followUpDate
                        )}
                      </p>

                      {item.notes && (
                        <p
                          className="
                            mt-2
                            max-w-2xl
                            text-sm
                            leading-6
                            text-slate-600
                          "
                        >
                          {item.notes}
                        </p>
                      )}

                      {item.outcome && (
                        <p
                          className="
                            mt-2
                            text-sm
                            font-medium
                            text-green-700
                          "
                        >
                          Outcome: {item.outcome}
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/admin/marketing/follow-ups/${item.id}`}
                    className="
                      text-sm
                      font-semibold
                      text-blue-600
                      hover:text-blue-700
                    "
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <div className="space-y-6">

          {/* COMPANY */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                "
              >
                <Building2 className="h-5 w-5" />
              </div>

              <div>
                <h2
                  className="
                    font-semibold
                    text-slate-950
                  "
                >
                  Company
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Customer information
                </p>
              </div>
            </div>

            <div
              className="
                mt-6
                space-y-5
              "
            >
              <InfoItem
                label="Company Name"
                value={demo.company.companyName}
              />

              <InfoItem
                label="Contact Person"
                value={
                  demo.company.ownerName ||
                  "Not provided"
                }
              />

              <InfoItem
                label="Industry"
                value={
                  demo.company.industry ||
                  "Not provided"
                }
              />

              <InfoItem
                label="Email"
                value={
                  demo.company.primaryEmail ||
                  "Not provided"
                }
              />

              <InfoItem
                label="Website"
                value={
                  demo.company.website ||
                  "Not provided"
                }
              />
            </div>

            <div
              className="
                mt-6
                grid
                gap-3
              "
            >
              {demo.company.primaryEmail && (
                <a
                  href={`mailto:${demo.company.primaryEmail}`}
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
                  <Mail className="h-4 w-4" />

                  Email Customer
                </a>
              )}

              {demo.company.website && (
                <a
                  href={demo.company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex
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
                  <ExternalLink className="h-4 w-4" />

                  Visit Website
                </a>
              )}
            </div>
          </section>

          {/* CONVERSION WORKFLOW */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-50
                  text-green-600
                "
              >
                <Target className="h-5 w-5" />
              </div>

              <div>
                <h2
                  className="
                    font-semibold
                    text-slate-950
                  "
                >
                  Closing Workflow
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Recommended conversion path
                </p>
              </div>
            </div>

            <div
              className="
                mt-6
                space-y-3
              "
            >
              <WorkflowStep
                number="1"
                label="Demo Completed"
                complete={
                  demo.status === "completed"
                }
              />

              <WorkflowStep
                number="2"
                label="Customer Contacted"
                complete={[
                  "contacted",
                  "interested",
                  "completed",
                ].includes(followUp.status)}
              />

              <WorkflowStep
                number="3"
                label="Interest Confirmed"
                complete={[
                  "interested",
                  "completed",
                ].includes(followUp.status)}
              />

              <WorkflowStep
                number="4"
                label="Trial / Negotiation"
                complete={false}
              />

              <WorkflowStep
                number="5"
                label="Deal Closed"
                complete={
                  followUp.status === "completed"
                }
              />
            </div>
          </section>

          {/* CURRENT NOTES */}

          <section
            className="
              rounded-2xl
              border
              border-orange-200
              bg-orange-50
              p-5
            "
          >
            <div
              className="
                flex
                items-start
                gap-3
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
                  bg-white
                  text-orange-600
                "
              >
                <StickyNote className="h-5 w-5" />
              </div>

              <div>
                <h3
                  className="
                    font-semibold
                    text-orange-950
                  "
                >
                  Next Action
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-6
                    text-orange-800
                  "
                >
                  Follow up on{" "}
                  {formatDateTime(
                    followUp.followUpDate
                  )}
                  . Record the customer response,
                  objections, next meeting, trial,
                  or closing outcome.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  iconClassName,
}: {
  icon: React.ElementType
  label: string
  value: string
  iconClassName: string
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            {label}
          </p>

          <p
            className="
              mt-2
              truncate
              text-lg
              font-bold
              text-slate-950
            "
          >
            {value}
          </p>
        </div>

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${iconClassName}
          `}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p
        className="
          text-xs
          font-semibold
          uppercase
          tracking-wide
          text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1.5
          break-words
          text-sm
          font-medium
          text-slate-800
        "
      >
        {value}
      </p>
    </div>
  )
}

/* =========================================================
   WORKFLOW STEP
========================================================= */

function WorkflowStep({
  number,
  label,
  complete,
}: {
  number: string
  label: string
  complete: boolean
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-100
        bg-slate-50
        p-3
      "
    >
      <div
        className={`
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          text-xs
          font-bold
          ${
            complete
              ? "bg-green-100 text-green-700"
              : "bg-white text-slate-500 ring-1 ring-slate-200"
          }
        `}
      >
        {complete ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          number
        )}
      </div>

      <p
        className={`
          text-sm
          font-medium
          ${
            complete
              ? "text-green-800"
              : "text-slate-700"
          }
        `}
      >
        {label}
      </p>
    </div>
  )
}