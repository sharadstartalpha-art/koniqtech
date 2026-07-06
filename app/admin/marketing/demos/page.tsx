import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MonitorPlay,
  RefreshCcw,
  UserRound,
  Video,
  XCircle,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   HELPERS
========================================================= */

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date)
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
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

function getStatusClasses(status: string) {
  switch (status) {
    case "scheduled":
      return `
        bg-violet-50
        text-violet-700
        ring-violet-200
      `

    case "confirmed":
      return `
        bg-blue-50
        text-blue-700
        ring-blue-200
      `

    case "completed":
      return `
        bg-green-50
        text-green-700
        ring-green-200
      `

    case "rescheduled":
      return `
        bg-orange-50
        text-orange-700
        ring-orange-200
      `

    case "cancelled":
      return `
        bg-red-50
        text-red-700
        ring-red-200
      `

    case "no_show":
      return `
        bg-slate-100
        text-slate-700
        ring-slate-200
      `

    default:
      return `
        bg-slate-100
        text-slate-700
        ring-slate-200
      `
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function MarketingDemosPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  /* =======================================================
     FIND LOGGED-IN EMPLOYEE
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

  /* =======================================================
     NO EMPLOYEE PROFILE
  ======================================================= */

  if (!employee) {
    return (
      <div className="space-y-6">

        <div>
          <p className="text-sm font-medium text-blue-600">
            Marketing Operations
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            My Demos
          </h1>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-orange-200
            bg-orange-50
            p-6
          "
        >
          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-orange-100
                text-orange-600
              "
            >
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-orange-950">
                Employee profile not connected
              </h2>

              <p className="mt-1 text-sm text-orange-700">
                This user account is not currently linked
                to an active Employee record.
              </p>
            </div>

          </div>
        </div>

      </div>
    )
  }

  /* =======================================================
     DATE
  ======================================================= */

  const now = new Date()

  const todayStart = new Date(now)

  todayStart.setHours(
    0,
    0,
    0,
    0
  )

  const todayEnd = new Date(now)

  todayEnd.setHours(
    23,
    59,
    59,
    999
  )

  /* =======================================================
     FETCH DATA
  ======================================================= */

  const [
    demos,
    totalDemos,
    todayDemos,
    pendingDemos,
    completedDemos,
    rescheduledDemos,
  ] = await Promise.all([

    /* -----------------------------------------------------
       ALL ASSIGNED DEMOS
    ----------------------------------------------------- */

    prisma.demoSchedule.findMany({
      where: {
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
          },
        },
      },

      orderBy: {
        meetingDate: "asc",
      },
    }),

    /* -----------------------------------------------------
       TOTAL
    ----------------------------------------------------- */

    prisma.demoSchedule.count({
      where: {
        marketingEmployeeId: employee.id,
      },
    }),

    /* -----------------------------------------------------
       TODAY
    ----------------------------------------------------- */

    prisma.demoSchedule.count({
      where: {
        marketingEmployeeId: employee.id,

        meetingDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),

    /* -----------------------------------------------------
       PENDING
    ----------------------------------------------------- */

    prisma.demoSchedule.count({
      where: {
        marketingEmployeeId: employee.id,

        status: {
          in: [
            "scheduled",
            "confirmed",
            "rescheduled",
          ],
        },
      },
    }),

    /* -----------------------------------------------------
       COMPLETED
    ----------------------------------------------------- */

    prisma.demoSchedule.count({
      where: {
        marketingEmployeeId: employee.id,

        status: "completed",
      },
    }),

    /* -----------------------------------------------------
       RESCHEDULED
    ----------------------------------------------------- */

    prisma.demoSchedule.count({
      where: {
        marketingEmployeeId: employee.id,

        status: "rescheduled",
      },
    }),

  ])

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>

          <p className="text-sm font-medium text-blue-600">
            Demo Operations
          </p>

          <h1
            className="
              mt-1
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
            "
          >
            My Demos
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review assigned demos, meeting schedules,
            confirmation status, and demo outcomes.
          </p>

        </div>

        <Link
          href="/admin/marketing/calendar"
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
          <CalendarDays className="h-4 w-4" />

          Demo Calendar
        </Link>
      </div>

      {/* ===================================================
          STATS
      =================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-5
        "
      >
        <StatCard
          label="Total Demos"
          value={totalDemos}
          icon={MonitorPlay}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          label="Today"
          value={todayDemos}
          icon={CalendarDays}
          iconClass="bg-orange-50 text-orange-600"
        />

        <StatCard
          label="Pending"
          value={pendingDemos}
          icon={Clock3}
          iconClass="bg-violet-50 text-violet-600"
        />

        <StatCard
          label="Completed"
          value={completedDemos}
          icon={CheckCircle2}
          iconClass="bg-green-50 text-green-600"
        />

        <StatCard
          label="Rescheduled"
          value={rescheduledDemos}
          icon={RefreshCcw}
          iconClass="bg-orange-50 text-orange-600"
        />
      </div>

      {/* ===================================================
          DEMO TABLE
      =================================================== */}

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

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            px-5
            py-4
          "
        >
          <div>

            <h2 className="font-semibold text-slate-950">
              Assigned Demo Schedule
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {demos.length} demo
              {demos.length === 1 ? "" : "s"} assigned
              to {employee.firstName}.
            </p>

          </div>

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
            <Video className="h-5 w-5" />
          </div>
        </div>

        {/* EMPTY */}

        {demos.length === 0 ? (

          <div
            className="
              flex
              min-h-80
              flex-col
              items-center
              justify-center
              px-6
              text-center
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-600
              "
            >
              <MonitorPlay className="h-7 w-7" />
            </div>

            <h3
              className="
                mt-4
                text-lg
                font-semibold
                text-slate-950
              "
            >
              No demos assigned
            </h3>

            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
              "
            >
              When Platform Sales schedules a demo and
              assigns it to you, the demo will appear here.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead className="bg-slate-50">

                <tr>

                  <TableHead>
                    Demo
                  </TableHead>

                  <TableHead>
                    Date
                  </TableHead>

                  <TableHead>
                    Time
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead>
                    Meeting
                  </TableHead>

                  <TableHead>
                    Notes
                  </TableHead>

                  <TableHead align="right">
                    Action
                  </TableHead>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {demos.map((demo) => (

                  <tr
                    key={demo.id}
                    className="
                      transition
                      hover:bg-slate-50/70
                    "
                  >

                    {/* DEMO */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

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
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div>

                          <p
                            className="
                              text-sm
                              font-semibold
                              text-slate-900
                            "
                          >
                            Company Lead
                          </p>

                          <p
                            className="
                              mt-0.5
                              max-w-[180px]
                              truncate
                              text-xs
                              text-slate-400
                            "
                          >
                            ID: {demo.companyId}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* DATE */}

                    <td
                      className="
                        px-5
                        py-4
                        text-sm
                        text-slate-700
                      "
                    >
                      {formatDate(
                        demo.meetingDate
                      )}
                    </td>

                    {/* TIME */}

                    <td
                      className="
                        px-5
                        py-4
                        text-sm
                        font-medium
                        text-slate-700
                      "
                    >
                      {formatTime(
                        demo.meetingDate
                      )}
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">

                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          ring-1
                          ring-inset
                          ${getStatusClasses(
                            demo.status
                          )}
                        `}
                      >
                        {formatStatus(
                          demo.status
                        )}
                      </span>

                    </td>

                    {/* MEETING */}

                    <td className="px-5 py-4">

                      {demo.meetingLink ? (

                        <a
                          href={demo.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-sm
                            font-medium
                            text-blue-600
                            hover:text-blue-700
                          "
                        >
                          Join Meeting

                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>

                      ) : (

                        <span className="text-sm text-slate-400">
                          Not added
                        </span>

                      )}

                    </td>

                    {/* NOTES */}

                    <td className="px-5 py-4">

                      <p
                        className="
                          max-w-[220px]
                          truncate
                          text-sm
                          text-slate-500
                        "
                      >
                        {demo.notes ||
                          "No notes added"}
                      </p>

                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4 text-right">

                      <Link
                        href={`/admin/marketing/demos/${demo.id}`}
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-lg
                          bg-blue-50
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-blue-700
                          transition
                          hover:bg-blue-100
                        "
                      >
                        Open

                        <ArrowRight className="h-4 w-4" />
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* ===================================================
          WORKFLOW INFO
      =================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-blue-200
          bg-blue-50/60
          p-5
        "
      >
        <div className="flex items-start gap-4">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-blue-100
              text-blue-600
            "
          >
            <MonitorPlay className="h-5 w-5" />
          </div>

          <div>

            <h3 className="font-semibold text-blue-950">
              Marketing Demo Workflow
            </h3>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-blue-700
              "
            >
              Platform Sales schedules the demo and assigns
              a Marketing employee. Marketing then confirms
              the meeting, conducts the demo, records the
              result, and manages follow-up activity.
            </p>

          </div>

        </div>
      </div>

    </div>
  )
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}: {
  label: string
  value: number
  icon: React.ElementType
  iconClass: string
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
          items-center
          justify-between
          gap-4
        "
      >
        <div>

          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
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
            items-center
            justify-center
            rounded-xl
            ${iconClass}
          `}
        >
          <Icon className="h-5 w-5" />
        </div>

      </div>
    </div>
  )
}

/* =========================================================
   TABLE HEAD
========================================================= */

function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode
  align?: "left" | "right"
}) {
  return (
    <th
      className={`
        px-5
        py-3.5
        text-xs
        font-semibold
        uppercase
        tracking-wide
        text-slate-500

        ${
          align === "right"
            ? "text-right"
            : "text-left"
        }
      `}
    >
      {children}
    </th>
  )
}