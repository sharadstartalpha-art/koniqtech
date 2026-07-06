import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MonitorPlay,
  UserRound,
  Video,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   TYPES
========================================================= */

type PageProps = {
  searchParams: Promise<{
    year?: string
    month?: string
    day?: string
  }>
}

/* =========================================================
   DATE HELPERS
========================================================= */

function startOfMonth(
  year: number,
  month: number
) {
  return new Date(year, month, 1)
}

function endOfMonth(
  year: number,
  month: number
) {
  return new Date(
    year,
    month + 1,
    1
  )
}

function startOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
}

function endOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  )
}

function formatMonthTitle(
  year: number,
  month: number
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  ).format(
    new Date(year, month, 1)
  )
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(date)
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
    }
  ).format(date)
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "2-digit",
    }
  ).format(date)
}

function normalizeYear(
  value: string | undefined,
  fallback: number
) {
  const parsed = Number(value)

  if (
    !Number.isInteger(parsed) ||
    parsed < 2000 ||
    parsed > 2100
  ) {
    return fallback
  }

  return parsed
}

function normalizeMonth(
  value: string | undefined,
  fallback: number
) {
  const parsed = Number(value)

  if (
    !Number.isInteger(parsed) ||
    parsed < 1 ||
    parsed > 12
  ) {
    return fallback
  }

  return parsed - 1
}

function normalizeDay(
  value: string | undefined,
  year: number,
  month: number
) {
  const parsed = Number(value)

  const maxDay = new Date(
    year,
    month + 1,
    0
  ).getDate()

  if (
    !Number.isInteger(parsed) ||
    parsed < 1 ||
    parsed > maxDay
  ) {
    return Math.min(
  new Date().getDate(),
  maxDay
)
  }

  return parsed
}

/* =========================================================
   STATUS HELPERS
========================================================= */

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

export default async function MarketingCalendarPage({
  searchParams,
}: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const params = await searchParams

  const today = new Date()

  const year = normalizeYear(
    params.year,
    today.getFullYear()
  )

  const month = normalizeMonth(
    params.month,
    today.getMonth()
  )

  const selectedDay = normalizeDay(
    params.day,
    year,
    month
  )

  const selectedDate = new Date(
    year,
    month,
    selectedDay
  )

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
      },
    })

  if (!employee) {
    redirect("/admin/dashboard")
  }

  /* =======================================================
     DATE RANGES
  ======================================================= */

  const monthStart = startOfMonth(
    year,
    month
  )

  const monthEnd = endOfMonth(
    year,
    month
  )

  const selectedStart =
    startOfDay(selectedDate)

  const selectedEnd =
    endOfDay(selectedDate)

  const now = new Date()

  /* =======================================================
     DATA
  ======================================================= */

  const [
    monthDemos,
    selectedDayDemos,
    upcomingDemos,
    completedCount,
  ] = await Promise.all([

    /* MONTH DEMOS */

    prisma.demoSchedule.findMany({
      where: {
        marketingEmployeeId:
          employee.id,

        meetingDate: {
          gte: monthStart,
          lt: monthEnd,
        },
      },

      select: {
        id: true,
        meetingDate: true,
        status: true,

        company: {
          select: {
            companyName: true,
          },
        },
      },

      orderBy: {
        meetingDate: "asc",
      },
    }),

    /* SELECTED DAY */

    prisma.demoSchedule.findMany({
      where: {
        marketingEmployeeId:
          employee.id,

        meetingDate: {
          gte: selectedStart,
          lt: selectedEnd,
        },
      },

      select: {
        id: true,
        meetingDate: true,
        meetingLink: true,
        status: true,

        company: {
          select: {
            companyName: true,
            ownerName: true,
            industry: true,
          },
        },
      },

      orderBy: {
        meetingDate: "asc",
      },
    }),

    /* UPCOMING DEMOS */

    prisma.demoSchedule.findMany({
      where: {
        marketingEmployeeId:
          employee.id,

        meetingDate: {
          gte: now,
        },

        status: {
          in: [
            "scheduled",
            "confirmed",
            "rescheduled",
          ],
        },
      },

      select: {
        id: true,
        meetingDate: true,
        status: true,

        company: {
          select: {
            companyName: true,
            industry: true,
          },
        },
      },

      orderBy: {
        meetingDate: "asc",
      },

      take: 5,
    }),

    /* COMPLETED THIS MONTH */

    prisma.demoSchedule.count({
      where: {
        marketingEmployeeId:
          employee.id,

        meetingDate: {
          gte: monthStart,
          lt: monthEnd,
        },

        status: "completed",
      },
    }),
  ])

  /* =======================================================
     CALENDAR DATA
  ======================================================= */

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate()

  const firstDayIndex = new Date(
    year,
    month,
    1
  ).getDay()

  const demoCountByDay =
    new Map<number, number>()

  for (const demo of monthDemos) {
    const day =
      demo.meetingDate.getDate()

    demoCountByDay.set(
      day,
      (demoCountByDay.get(day) ?? 0) + 1
    )
  }

  /* =======================================================
     MONTH NAVIGATION
  ======================================================= */

  const previousMonthDate = new Date(
    year,
    month - 1,
    1
  )

  const nextMonthDate = new Date(
    year,
    month + 1,
    1
  )

  const previousMonthHref =
    `/admin/marketing/calendar?year=${
      previousMonthDate.getFullYear()
    }&month=${
      previousMonthDate.getMonth() + 1
    }&day=1`

  const nextMonthHref =
    `/admin/marketing/calendar?year=${
      nextMonthDate.getFullYear()
    }&month=${
      nextMonthDate.getMonth() + 1
    }&day=1`

  const todayHref =
    `/admin/marketing/calendar?year=${
      today.getFullYear()
    }&month=${
      today.getMonth() + 1
    }&day=${
      today.getDate()
    }`

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

          <p
            className="
              text-sm
              font-medium
              text-blue-600
            "
          >
            Demo Management
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
            Demo Calendar
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            View your assigned demos,
            meeting schedule, and upcoming
            customer presentations.
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
            href={todayHref}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-slate-300
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:bg-slate-50
            "
          >
            <CalendarDays className="h-4 w-4" />

            Today
          </Link>

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
        </div>
      </div>

      {/* ===================================================
          STATS
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
          icon={CalendarDays}
          label="This Month"
          value={monthDemos.length}
          description="Scheduled demo records"
          iconClassName="
            bg-blue-50
            text-blue-600
          "
        />

        <StatCard
          icon={Clock3}
          label="Selected Day"
          value={selectedDayDemos.length}
          description="Demos on selected date"
          iconClassName="
            bg-violet-50
            text-violet-600
          "
        />

        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={completedCount}
          description="Completed this month"
          iconClassName="
            bg-green-50
            text-green-600
          "
        />

        <StatCard
          icon={MonitorPlay}
          label="Upcoming"
          value={upcomingDemos.length}
          description="Next scheduled demos"
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
          xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,0.8fr)]
        "
      >

        {/* =================================================
            CALENDAR
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

          {/* CALENDAR HEADER */}

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
                  text-lg
                  font-semibold
                  text-slate-950
                "
              >
                {formatMonthTitle(
                  year,
                  month
                )}
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Select a date to view
                scheduled demos.
              </p>

            </div>

            <div className="flex gap-2">

              <Link
                href={previousMonthHref}
                aria-label="Previous month"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-300
                  text-slate-600
                  transition
                  hover:bg-slate-50
                "
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <Link
                href={nextMonthHref}
                aria-label="Next month"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-300
                  text-slate-600
                  transition
                  hover:bg-slate-50
                "
              >
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>
          </div>

          {/* WEEK DAYS */}

          <div
            className="
              grid
              grid-cols-7
              border-b
              border-slate-200
              bg-slate-50
            "
          >
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <div
                key={day}
                className="
                  px-2
                  py-3
                  text-center
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                {day}
              </div>
            ))}
          </div>

          {/* DAYS */}

          <div
            className="
              grid
              grid-cols-7
            "
          >

            {Array.from({
              length: firstDayIndex,
            }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="
                  min-h-24
                  border-b
                  border-r
                  border-slate-100
                  bg-slate-50/50
                  sm:min-h-28
                "
              />
            ))}

            {Array.from({
              length: daysInMonth,
            }).map((_, index) => {
              const day = index + 1

              const demoCount =
                demoCountByDay.get(day) ?? 0

              const isSelected =
                day === selectedDay

              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()

              const href =
                `/admin/marketing/calendar?year=${year}&month=${
                  month + 1
                }&day=${day}`

              return (
                <Link
                  key={day}
                  href={href}
                  className={`
                    relative
                    min-h-24
                    border-b
                    border-r
                    border-slate-100
                    p-2
                    transition
                    sm:min-h-28
                    sm:p-3

                    ${
                      isSelected
                        ? "bg-blue-50/70"
                        : "hover:bg-slate-50"
                    }
                  `}
                >

                  <div
                    className={`
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      text-sm
                      font-semibold

                      ${
                        isToday
                          ? "bg-blue-600 text-white"
                          : isSelected
                            ? "bg-blue-100 text-blue-700"
                            : "text-slate-700"
                      }
                    `}
                  >
                    {day}
                  </div>

                  {demoCount > 0 && (
                    <div
                      className="
                        mt-2
                        rounded-md
                        bg-violet-100
                        px-2
                        py-1
                        text-[11px]
                        font-semibold
                        text-violet-700
                      "
                    >
                      {demoCount}{" "}
                      {demoCount === 1
                        ? "demo"
                        : "demos"}
                    </div>
                  )}

                </Link>
              )
            })}

          </div>
        </section>

        {/* =================================================
            SELECTED DAY
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
              border-b
              border-slate-200
              px-5
              py-4
            "
          >
            <h2
              className="
                font-semibold
                text-slate-950
              "
            >
              Selected Day
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {formatFullDate(
                selectedDate
              )}
            </p>
          </div>

          <div className="p-4">

            {selectedDayDemos.length === 0 ? (
              <div
                className="
                  flex
                  min-h-64
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-dashed
                  border-slate-300
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
                    bg-slate-100
                    text-slate-500
                  "
                >
                  <CalendarDays className="h-6 w-6" />
                </div>

                <p
                  className="
                    mt-4
                    font-semibold
                    text-slate-900
                  "
                >
                  No demos scheduled
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  There are no assigned
                  demos for this date.
                </p>
              </div>
            ) : (
              <div className="space-y-3">

                {selectedDayDemos.map(
                  (demo) => (
                    <div
                      key={demo.id}
                      className="
                        rounded-xl
                        border
                        border-slate-200
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        <div className="min-w-0">

                          <p
                            className="
                              truncate
                              font-semibold
                              text-slate-950
                            "
                          >
                            {
                              demo.company
                                .companyName
                            }
                          </p>

                          <div
                            className="
                              mt-2
                              flex
                              items-center
                              gap-2
                              text-sm
                              text-slate-500
                            "
                          >
                            <Clock3 className="h-4 w-4" />

                            {formatTime(
                              demo.meetingDate
                            )}
                          </div>

                        </div>

                        <span
                          className={`
                            inline-flex
                            shrink-0
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            ring-1
                            ring-inset
                            ${statusClasses(
                              demo.status
                            )}
                          `}
                        >
                          {formatStatus(
                            demo.status
                          )}
                        </span>
                      </div>

                      <div
                        className="
                          mt-4
                          space-y-2
                          border-t
                          border-slate-100
                          pt-3
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-slate-600
                          "
                        >
                          <UserRound className="h-4 w-4" />

                          {demo.company.ownerName ||
                            "Contact not provided"}
                        </div>

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-slate-600
                          "
                        >
                          <Building2 className="h-4 w-4" />

                          {demo.company.industry ||
                            "Industry not provided"}
                        </div>
                      </div>

                      <div
                        className="
                          mt-4
                          flex
                          gap-2
                        "
                      >
                        <Link
                          href={`/admin/marketing/demos/${demo.id}`}
                          className="
                            inline-flex
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-blue-600
                            px-3
                            py-2
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

                        {demo.meetingLink && (
                          <a
                            href={
                              demo.meetingLink
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="
                              inline-flex
                              items-center
                              justify-center
                              gap-2
                              rounded-lg
                              bg-green-600
                              px-3
                              py-2
                              text-sm
                              font-semibold
                              text-white
                              transition
                              hover:bg-green-700
                            "
                          >
                            <Video className="h-4 w-4" />

                            Join

                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>
        </section>
      </div>

      {/* ===================================================
          UPCOMING DEMOS
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
              Your next assigned customer
              demo meetings.
            </p>

          </div>

          <Link
            href="/admin/marketing/demos"
            className="
              text-sm
              font-semibold
              text-blue-600
              hover:text-blue-700
            "
          >
            View All
          </Link>
        </div>

        {upcomingDemos.length === 0 ? (
          <div
            className="
              px-5
              py-12
              text-center
            "
          >
            <CalendarDays
              className="
                mx-auto
                h-8
                w-8
                text-slate-300
              "
            />

            <p
              className="
                mt-3
                text-sm
                text-slate-500
              "
            >
              No upcoming demos.
            </p>
          </div>
        ) : (
          <div
            className="
              divide-y
              divide-slate-100
            "
          >
            {upcomingDemos.map(
              (demo) => (
                <div
                  key={demo.id}
                  className="
                    flex
                    flex-col
                    gap-4
                    px-5
                    py-4
                    md:flex-row
                    md:items-center
                    md:justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-4
                    "
                  >
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        flex-col
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-700
                      "
                    >
                      <span
                        className="
                          text-[10px]
                          font-semibold
                          uppercase
                        "
                      >
                        {formatShortDate(
                          demo.meetingDate
                        ).split(" ")[0]}
                      </span>

                      <span
                        className="
                          text-lg
                          font-bold
                          leading-none
                        "
                      >
                        {demo.meetingDate.getDate()}
                      </span>
                    </div>

                    <div>

                      <p
                        className="
                          font-semibold
                          text-slate-950
                        "
                      >
                        {
                          demo.company
                            .companyName
                        }
                      </p>

                      <div
                        className="
                          mt-1
                          flex
                          flex-wrap
                          items-center
                          gap-x-3
                          gap-y-1
                          text-sm
                          text-slate-500
                        "
                      >
                        <span>
                          {formatTime(
                            demo.meetingDate
                          )}
                        </span>

                        {demo.company.industry && (
                          <>
                            <span>•</span>

                            <span>
                              {
                                demo.company
                                  .industry
                              }
                            </span>
                          </>
                        )}
                      </div>

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
                        font-semibold
                        ring-1
                        ring-inset
                        ${statusClasses(
                          demo.status
                        )}
                      `}
                    >
                      {formatStatus(
                        demo.status
                      )}
                    </span>

                    <Link
                      href={`/admin/marketing/demos/${demo.id}`}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-blue-600
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-700
                      "
                    >
                      Open

                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>

    </div>
  )
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  iconClassName,
}: {
  icon: React.ElementType
  label: string
  value: number
  description: string
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
        <div>

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
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
            "
          >
            {value}
          </p>

          <p
            className="
              mt-2
              text-xs
              text-slate-400
            "
          >
            {description}
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