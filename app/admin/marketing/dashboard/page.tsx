import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Megaphone,
  MonitorPlay,
  Target,
  TrendingUp,
  UserRound,
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

function getStatusClasses(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-blue-50 text-blue-700 ring-blue-200"

    case "completed":
      return "bg-green-50 text-green-700 ring-green-200"

    case "cancelled":
      return "bg-red-50 text-red-700 ring-red-200"

    case "rescheduled":
      return "bg-orange-50 text-orange-700 ring-orange-200"

    case "no_show":
      return "bg-slate-100 text-slate-700 ring-slate-200"

    default:
      return "bg-violet-50 text-violet-700 ring-violet-200"
  }
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

/* =========================================================
   PAGE
========================================================= */

export default async function MarketingDashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = session.user.id

  /* =======================================================
     FIND MARKETING EMPLOYEE
  ======================================================= */

  const employee =
    await prisma.employee.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    })

  /* =======================================================
     DATE RANGES
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

  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  )

  const monthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  )

  /* =======================================================
     DEMO FILTER
  ======================================================= */

  const demoWhere = employee
    ? {
        marketingEmployeeId:
          employee.id,
      }
    : {
        marketingEmployeeId:
          "__NO_EMPLOYEE__",
      }

  /* =======================================================
     DASHBOARD DATA
  ======================================================= */

  const [
    totalDemos,
    todayDemos,
    scheduledDemos,
    completedDemos,
    monthDemos,
    recentDemos,
    activeCampaigns,
    totalCampaigns,
  ] = await Promise.all([
    prisma.demoSchedule.count({
      where: demoWhere,
    }),

    prisma.demoSchedule.count({
      where: {
        ...demoWhere,

        meetingDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),

    prisma.demoSchedule.count({
      where: {
        ...demoWhere,

        status: {
          in: [
            "scheduled",
            "confirmed",
            "rescheduled",
          ],
        },
      },
    }),

    prisma.demoSchedule.count({
      where: {
        ...demoWhere,

        status: "completed",
      },
    }),

    prisma.demoSchedule.count({
      where: {
        ...demoWhere,

        meetingDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    }),

    prisma.demoSchedule.findMany({
      where: demoWhere,

      include: {
        company: true,
      },

      orderBy: {
        meetingDate: "asc",
      },

      take: 6,
    }),

    prisma.marketingCampaign.count({
      where: {
        status: "running",
      },
    }),

    prisma.marketingCampaign.count(),
  ])

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const completionRate =
    totalDemos > 0
      ? Math.round(
          (completedDemos /
            totalDemos) *
            100
        )
      : 0

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
          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >
        <div>
          <p
            className="
              mb-1
              text-sm
              font-medium
              text-blue-600
            "
          >
            Marketing Operations
          </p>

          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
            "
          >
            Marketing Dashboard
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Manage assigned demos, follow-ups,
            campaigns, and customer engagement.
          </p>
        </div>

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >
          <Link
            href="/admin/marketing/demos"
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

            My Demos
          </Link>

          <Link
            href="/admin/marketing/campaigns/new"
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
            <Megaphone className="h-4 w-4" />

            New Campaign
          </Link>
        </div>
      </div>

      {/* ===================================================
          PRIMARY STATS
      =================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <StatCard
          label="Assigned Demos"
          value={totalDemos}
          description="All demos assigned to you"
          icon={MonitorPlay}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          label="Today's Demos"
          value={todayDemos}
          description="Scheduled for today"
          icon={CalendarDays}
          iconClass="bg-orange-50 text-orange-600"
        />

        <StatCard
          label="Pending Demos"
          value={scheduledDemos}
          description="Awaiting completion"
          icon={Clock3}
          iconClass="bg-violet-50 text-violet-600"
        />

        <StatCard
          label="Completed"
          value={completedDemos}
          description="Successfully completed"
          icon={CheckCircle2}
          iconClass="bg-green-50 text-green-600"
        />
      </div>

      {/* ===================================================
          SECONDARY STATS
      =================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        <MiniStatCard
          label="This Month"
          value={monthDemos}
          icon={TrendingUp}
        />

        <MiniStatCard
          label="Completion Rate"
          value={`${completionRate}%`}
          icon={Target}
        />

        <MiniStatCard
          label="Active Campaigns"
          value={activeCampaigns}
          icon={Megaphone}
        />

        <MiniStatCard
          label="Total Campaigns"
          value={totalCampaigns}
          icon={BarChart3}
        />
      </div>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]
        "
      >

        {/* =================================================
            UPCOMING DEMOS
        ================================================= */}

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
              <h2
                className="
                  font-semibold
                  text-slate-950
                "
              >
                Upcoming Demos
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Your latest assigned demo meetings.
              </p>
            </div>

            <Link
              href="/admin/marketing/demos"
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
              View All

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentDemos.length === 0 ? (
            <div
              className="
                flex
                min-h-64
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
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                "
              >
                <MonitorPlay className="h-6 w-6" />
              </div>

              <h3
                className="
                  mt-4
                  font-semibold
                  text-slate-900
                "
              >
                No demos assigned
              </h3>

              <p
                className="
                  mt-1
                  max-w-sm
                  text-sm
                  text-slate-500
                "
              >
                Demo requests assigned by the sales
                team will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentDemos.map((demo) => (
                <Link
                  key={demo.id}
                  href={`/admin/marketing/demos/${demo.id}`}
                  className="
                    flex
                    flex-col
                    gap-4
                    px-5
                    py-4
                    transition
                    hover:bg-slate-50
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      items-center
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
                        bg-blue-50
                        text-blue-600
                      "
                    >
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          font-semibold
                          text-slate-900
                        "
                      >
                        {demo.company.companyName}
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-slate-500
                        "
                      >
                        {formatDate(
                          demo.meetingDate
                        )}
                        {" · "}
                        {formatTime(
                          demo.meetingDate
                        )}
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
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

                    <ArrowRight
                      className="
                        h-4
                        w-4
                        text-slate-400
                      "
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

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
          <h2
            className="
              font-semibold
              text-slate-950
            "
          >
            Quick Actions
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Access common marketing operations.
          </p>

          <div className="mt-5 space-y-3">

            <QuickAction
              href="/admin/marketing/demos"
              title="Manage Demos"
              description="View assigned demo requests"
              icon={MonitorPlay}
              iconClass="bg-blue-50 text-blue-600"
            />

            <QuickAction
              href="/admin/marketing/calendar"
              title="Demo Calendar"
              description="Review upcoming demo schedule"
              icon={CalendarDays}
              iconClass="bg-orange-50 text-orange-600"
            />

            <QuickAction
              href="/admin/marketing/follow-ups"
              title="Follow-ups"
              description="Manage pending customer actions"
              icon={Target}
              iconClass="bg-green-50 text-green-600"
            />

            <QuickAction
              href="/admin/marketing/email-center"
              title="Email Center"
              description="Send and manage marketing emails"
              icon={Mail}
              iconClass="bg-violet-50 text-violet-600"
            />

            <QuickAction
              href="/admin/marketing/campaigns"
              title="Campaigns"
              description="Manage marketing campaigns"
              icon={Megaphone}
              iconClass="bg-orange-50 text-orange-600"
            />

          </div>
        </section>
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
  description,
  icon: Icon,
  iconClass,
}: {
  label: string
  value: number | string
  description: string
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
          items-start
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

      <p
        className="
          mt-4
          text-xs
          text-slate-400
        "
      >
        {description}
      </p>
    </div>
  )
}

/* =========================================================
   MINI STAT CARD
========================================================= */

function MiniStatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number | string
  icon: React.ElementType
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
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
          rounded-lg
          bg-blue-50
          text-blue-600
        "
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p
          className="
            text-xs
            text-slate-500
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            text-xl
            font-bold
            text-slate-950
          "
        >
          {value}
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  href,
  title,
  description,
  icon: Icon,
  iconClass,
}: {
  href: string
  title: string
  description: string
  icon: React.ElementType
  iconClass: string
}) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-200
        p-3
        transition
        hover:border-blue-200
        hover:bg-blue-50/40
      "
    >
      <div
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-lg
          ${iconClass}
        `}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="
            text-sm
            font-semibold
            text-slate-900
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-xs
            text-slate-500
          "
        >
          {description}
        </p>
      </div>

      <ArrowRight
        className="
          h-4
          w-4
          text-slate-400
          transition
          group-hover:translate-x-0.5
          group-hover:text-blue-600
        "
      />
    </Link>
  )
}