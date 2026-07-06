import Link from "next/link"

import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Mail,
  MessageCircle,
  MonitorPlay,
  Phone,
  Send,
  Target,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"


/* ==========================================================
   HELPERS
========================================================== */

function percentage(
  value: number,
  total: number
) {

  if (total === 0) {
    return 0
  }

  return Math.round(
    (value / total) * 100
  )
}


function formatDate(
  value: Date
) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
    }
  ).format(value)
}


function formatDateTime(
  value: Date
) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(value)
}


/* ==========================================================
   STATUS BADGE
========================================================== */

function StatusBadge({
  status,
}: {
  status: string
}) {

  const styles: Record<
    string,
    string
  > = {

    scheduled:
      "border-blue-200 bg-blue-50 text-blue-700",

    confirmed:
      "border-green-200 bg-green-50 text-green-700",

    completed:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    cancelled:
      "border-red-200 bg-red-50 text-red-700",

    rescheduled:
      "border-orange-200 bg-orange-50 text-orange-700",

    no_show:
      "border-slate-300 bg-slate-100 text-slate-700",

  }


  return (

    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-2.5
        py-1
        text-xs
        font-semibold
        capitalize

        ${
          styles[status] ??
          "border-slate-200 bg-slate-50 text-slate-700"
        }
      `}
    >
      {status.replaceAll("_", " ")}
    </span>

  )
}


/* ==========================================================
   PAGE
========================================================== */

export default async function SalesReportsPage() {

  const session = await auth()


  /* ========================================================
     DATE RANGES
  ======================================================== */

  const now = new Date()


  const monthStart =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )


  const weekStart =
    new Date(now)

  const day =
    weekStart.getDay()

  const difference =
    day === 0
      ? -6
      : 1 - day

  weekStart.setDate(
    weekStart.getDate() +
    difference
  )

  weekStart.setHours(
    0,
    0,
    0,
    0
  )


  /* ========================================================
     FETCH SALES DATA
  ======================================================== */

  const [

    totalLeads,

    newLeads,

    contactedLeads,

    convertedLeads,

    leadsThisWeek,

    leadsThisMonth,

    demos,

    recentDemos,

    salesUsers,

  ] = await Promise.all([


    /* TOTAL LEADS */

    prisma.lead.count(),


    /* NEW LEADS */

    prisma.lead.count({

      where: {
        status: "new",
      },

    }),


    /* CONTACTED LEADS */

    prisma.lead.count({

      where: {
        status: "contacted",
      },

    }),


    /* CONVERTED LEADS */

    prisma.lead.count({

      where: {
        status: "converted",
      },

    }),


    /* LEADS THIS WEEK */

    prisma.lead.count({

      where: {

        createdAt: {
          gte: weekStart,
        },

      },

    }),


    /* LEADS THIS MONTH */

    prisma.lead.count({

      where: {

        createdAt: {
          gte: monthStart,
        },

      },

    }),


    /* ALL DEMOS */

    prisma.demoSchedule.findMany({

      select: {

        id: true,

        status: true,

        meetingDate: true,

        createdAt: true,

      },

    }),


    /* RECENT DEMOS */

    prisma.demoSchedule.findMany({

      orderBy: {
        createdAt: "desc",
      },

      take: 8,

      include: {

        company: true,

        marketer: {

          select: {
            firstName: true,
            lastName: true,
            email: true,
          },

        },

        createdBy: {

          select: {
            name: true,
            email: true,
          },

        },

      },

    }),


    /* PLATFORM SALES USERS */

    prisma.user.findMany({

      where: {
        role: "platform_sales",
        status: "active",
      },

      select: {

        id: true,

        name: true,

        email: true,

        assignedLeads: {

          select: {
            id: true,
            status: true,
          },

        },

        createdDemoSchedules: {

          select: {
            id: true,
            status: true,
          },

        },

      },

      orderBy: {
        name: "asc",
      },

    }),

  ])


  /* ========================================================
     DEMO METRICS
  ======================================================== */

  const totalDemos =
    demos.length


  const scheduledDemos =
    demos.filter(
      (demo) =>
        demo.status === "scheduled"
    ).length


  const confirmedDemos =
    demos.filter(
      (demo) =>
        demo.status === "confirmed"
    ).length


  const completedDemos =
    demos.filter(
      (demo) =>
        demo.status === "completed"
    ).length


  const cancelledDemos =
    demos.filter(
      (demo) =>
        demo.status === "cancelled"
    ).length


  const noShowDemos =
    demos.filter(
      (demo) =>
        demo.status === "no_show"
    ).length


  const rescheduledDemos =
    demos.filter(
      (demo) =>
        demo.status === "rescheduled"
    ).length


  /* ========================================================
     RATES
  ======================================================== */

  const contactRate =
    percentage(
      contactedLeads +
      convertedLeads,
      totalLeads
    )


  const demoBookingRate =
    percentage(
      totalDemos,
      totalLeads
    )


  const demoCompletionRate =
    percentage(
      completedDemos,
      totalDemos
    )


  const leadConversionRate =
    percentage(
      convertedLeads,
      totalLeads
    )


  /* ========================================================
     COMPANY NAME NORMALIZER
  ======================================================== */

  function getCompanyName(
    company: unknown
  ) {

    const item =
      company as Record<
        string,
        unknown
      >


    return String(

      item.companyName ??
      item.name ??
      item.businessName ??
      "Prospect Company"

    )
  }


  /* ========================================================
     RENDER
  ======================================================== */

  return (

    <div
      className="
        mx-auto
        max-w-7xl
        space-y-7
      "
    >

      {/* ====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-end
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
            Platform Sales Analytics
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
            Sales Reports
          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Track lead activity, outreach progress,
            demo scheduling, and sales performance.
          </p>

        </div>


        <div
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            text-slate-600
            shadow-sm
          "
        >
          <CalendarCheck className="h-4 w-4 text-blue-600" />

          Updated {formatDateTime(now)}
        </div>

      </div>


      {/* ====================================================
          PRIMARY KPI CARDS
      ===================================================== */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <MetricCard

          title="Total Leads"

          value={totalLeads}

          description="All platform sales leads"

          icon={
            <Users className="h-5 w-5" />
          }

          iconClass="
            bg-blue-50
            text-blue-600
          "

        />


        <MetricCard

          title="Contact Rate"

          value={`${contactRate}%`}

          description="Leads contacted by Sales"

          icon={
            <Phone className="h-5 w-5" />
          }

          iconClass="
            bg-orange-50
            text-orange-600
          "

        />


        <MetricCard

          title="Demo Requests"

          value={totalDemos}

          description="Demos handed to Marketing"

          icon={
            <MonitorPlay className="h-5 w-5" />
          }

          iconClass="
            bg-violet-50
            text-violet-600
          "

        />


        <MetricCard

          title="Lead Conversion"

          value={`${leadConversionRate}%`}

          description="Converted lead records"

          icon={
            <TrendingUp className="h-5 w-5" />
          }

          iconClass="
            bg-green-50
            text-green-600
          "

        />

      </div>


      {/* ====================================================
          SECONDARY KPI ROW
      ===================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-6
        "
      >

        <SmallMetric
          label="New"
          value={newLeads}
          icon={
            <Target className="h-4 w-4" />
          }
        />


        <SmallMetric
          label="Contacted"
          value={contactedLeads}
          icon={
            <Phone className="h-4 w-4" />
          }
        />


        <SmallMetric
          label="Converted"
          value={convertedLeads}
          icon={
            <CheckCircle2 className="h-4 w-4" />
          }
        />


        <SmallMetric
          label="This Week"
          value={leadsThisWeek}
          icon={
            <BarChart3 className="h-4 w-4" />
          }
        />


        <SmallMetric
          label="This Month"
          value={leadsThisMonth}
          icon={
            <TrendingUp className="h-4 w-4" />
          }
        />


        <SmallMetric
          label="Demo Rate"
          value={`${demoBookingRate}%`}
          icon={
            <MonitorPlay className="h-4 w-4" />
          }
        />

      </div>


      {/* ====================================================
          REPORT GRID
      ===================================================== */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-2
        "
      >

        {/* ==================================================
            LEAD FUNNEL
        =================================================== */}

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
              Sales Funnel
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Lead movement through the sales process.
            </p>

          </div>


          <div
            className="
              space-y-6
              p-6
            "
          >

            <ProgressRow

              label="Total Leads"

              value={totalLeads}

              total={totalLeads}

            />


            <ProgressRow

              label="Contacted"

              value={contactedLeads}

              total={totalLeads}

            />


            <ProgressRow

              label="Demo Booked"

              value={totalDemos}

              total={totalLeads}

            />


            <ProgressRow

              label="Converted"

              value={convertedLeads}

              total={totalLeads}

            />

          </div>

        </section>


        {/* ==================================================
            DEMO PIPELINE
        =================================================== */}

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

            <div>

              <h2
                className="
                  font-semibold
                  text-slate-950
                "
              >
                Demo Pipeline
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Current demo request distribution.
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
                bg-violet-50
                text-violet-600
              "
            >
              <MonitorPlay className="h-5 w-5" />
            </div>

          </div>


          <div
            className="
              grid
              gap-4
              p-6
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            <DemoMetric
              label="Scheduled"
              value={scheduledDemos}
            />


            <DemoMetric
              label="Confirmed"
              value={confirmedDemos}
            />


            <DemoMetric
              label="Completed"
              value={completedDemos}
            />


            <DemoMetric
              label="Rescheduled"
              value={rescheduledDemos}
            />


            <DemoMetric
              label="No Show"
              value={noShowDemos}
            />


            <DemoMetric
              label="Cancelled"
              value={cancelledDemos}
            />

          </div>


          <div
            className="
              mx-6
              mb-6
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-4
              py-4
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-green-800
                  "
                >
                  Demo Completion Rate
                </p>


                <p
                  className="
                    mt-1
                    text-xs
                    text-green-700
                  "
                >
                  Completed demos against all demo requests
                </p>

              </div>


              <span
                className="
                  text-2xl
                  font-bold
                  text-green-700
                "
              >
                {demoCompletionRate}%
              </span>

            </div>

          </div>

        </section>

      </div>


      {/* ====================================================
          SALES PERFORMANCE
      ===================================================== */}

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
            px-6
            py-5
          "
        >

          <div>

            <h2
              className="
                font-semibold
                text-slate-950
              "
            >
              Sales Team Performance
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Lead assignments and demo handoff activity.
            </p>

          </div>


          <UserRound
            className="
              h-5
              w-5
              text-blue-600
            "
          />

        </div>


        {salesUsers.length === 0 ? (

          <div
            className="
              px-6
              py-12
              text-center
            "
          >

            <Users
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
              No active Platform Sales users found.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table
              className="
                min-w-full
                divide-y
                divide-slate-200
              "
            >

              <thead className="bg-slate-50">

                <tr>

                  <TableHeading>
                    Salesperson
                  </TableHeading>

                  <TableHeading>
                    Assigned Leads
                  </TableHeading>

                  <TableHeading>
                    Contacted
                  </TableHeading>

                  <TableHeading>
                    Converted
                  </TableHeading>

                  <TableHeading>
                    Demo Requests
                  </TableHeading>

                  <TableHeading>
                    Demo Rate
                  </TableHeading>

                </tr>

              </thead>


              <tbody
                className="
                  divide-y
                  divide-slate-100
                "
              >

                {salesUsers.map(
                  (user) => {

                    const assigned =
                      user.assignedLeads.length


                    const contacted =
                      user.assignedLeads.filter(
                        (lead) =>
                          lead.status ===
                          "contacted"
                      ).length


                    const converted =
                      user.assignedLeads.filter(
                        (lead) =>
                          lead.status ===
                          "converted"
                      ).length


                    const demoCount =
                      user.createdDemoSchedules.length


                    return (

                      <tr
                        key={user.id}
                        className="
                          transition
                          hover:bg-slate-50
                        "
                      >

                        <td
                          className="
                            px-6
                            py-4
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
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-50
                                text-sm
                                font-bold
                                text-blue-700
                              "
                            >
                              {user.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>


                            <div>

                              <p
                                className="
                                  text-sm
                                  font-semibold
                                  text-slate-950
                                "
                              >
                                {user.name}
                              </p>


                              <p
                                className="
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {user.email}
                              </p>

                            </div>

                          </div>

                        </td>


                        <TableValue>
                          {assigned}
                        </TableValue>


                        <TableValue>
                          {contacted}
                        </TableValue>


                        <TableValue>
                          {converted}
                        </TableValue>


                        <TableValue>
                          {demoCount}
                        </TableValue>


                        <TableValue>

                          <span
                            className="
                              font-semibold
                              text-blue-600
                            "
                          >
                            {percentage(
                              demoCount,
                              assigned
                            )}%
                          </span>

                        </TableValue>

                      </tr>

                    )
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* ====================================================
          RECENT DEMO REQUESTS
      ===================================================== */}

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
            px-6
            py-5
          "
        >

          <div>

            <h2
              className="
                font-semibold
                text-slate-950
              "
            >
              Recent Demo Requests
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Latest Sales to Marketing handoffs.
            </p>

          </div>


          <Link
            href="/admin/sales/demo-requests"
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
            View All

            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>


        {recentDemos.length === 0 ? (

          <div
            className="
              px-6
              py-12
              text-center
            "
          >

            <MonitorPlay
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
              No demo requests have been created yet.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr>

                  <TableHeading>
                    Prospect
                  </TableHeading>

                  <TableHeading>
                    Created By
                  </TableHeading>

                  <TableHeading>
                    Marketing Owner
                  </TableHeading>

                  <TableHeading>
                    Meeting Date
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <TableHeading>
                    Action
                  </TableHeading>

                </tr>

              </thead>


              <tbody
                className="
                  divide-y
                  divide-slate-100
                "
              >

                {recentDemos.map(
                  (demo) => (

                    <tr
                      key={demo.id}
                      className="
                        transition
                        hover:bg-slate-50
                      "
                    >

                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          font-semibold
                          text-slate-950
                        "
                      >
                        {getCompanyName(
                          demo.company
                        )}
                      </td>


                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          text-slate-600
                        "
                      >
                        {demo.createdBy?.name ??
                          "Unknown"}
                      </td>


                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          text-slate-600
                        "
                      >
                        {demo.marketer.firstName}{" "}
                        {demo.marketer.lastName}
                      </td>


                      <td
                        className="
                          whitespace-nowrap
                          px-6
                          py-4
                          text-sm
                          text-slate-600
                        "
                      >
                        {formatDate(
                          demo.meetingDate
                        )}
                      </td>


                      <td
                        className="
                          px-6
                          py-4
                        "
                      >
                        <StatusBadge
                          status={demo.status}
                        />
                      </td>


                      <td
                        className="
                          px-6
                          py-4
                        "
                      >

                        <Link
                          href={
                            `/admin/sales/demo-requests/${demo.id}`
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-blue-50
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-blue-700
                            transition
                            hover:bg-blue-100
                          "
                        >
                          View

                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  )
}


/* ==========================================================
   METRIC CARD
========================================================== */

function MetricCard({
  title,
  value,
  description,
  icon,
  iconClass,
}: {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
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
        "
      >

        <div>

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            {title}
          </p>


          <p
            className="
              mt-3
              text-3xl
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
            items-center
            justify-center
            rounded-xl
            ${iconClass}
          `}
        >
          {icon}
        </div>

      </div>


      <p
        className="
          mt-3
          text-xs
          text-slate-400
        "
      >
        {description}
      </p>

    </div>
  )
}


/* ==========================================================
   SMALL METRIC
========================================================== */

function SmallMetric({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-3
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
          rounded-xl
          bg-blue-50
          text-blue-600
        "
      >
        {icon}
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
            text-lg
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


/* ==========================================================
   PROGRESS ROW
========================================================== */

function ProgressRow({
  label,
  value,
  total,
}: {
  label: string
  value: number
  total: number
}) {

  const progress =
    percentage(
      value,
      total
    )


  return (

    <div>

      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          text-sm
        "
      >

        <span
          className="
            font-medium
            text-slate-700
          "
        >
          {label}
        </span>


        <span
          className="
            text-slate-500
          "
        >
          {value}

          <span className="ml-1 text-slate-400">
            ({progress}%)
          </span>
        </span>

      </div>


      <div
        className="
          h-2
          overflow-hidden
          rounded-full
          bg-slate-100
        "
      >

        <div
          className="
            h-full
            rounded-full
            bg-blue-600
          "
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  )
}


/* ==========================================================
   DEMO METRIC
========================================================== */

function DemoMetric({
  label,
  value,
}: {
  label: string
  value: number
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        p-4
      "
    >

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
          mt-2
          text-2xl
          font-bold
          text-slate-950
        "
      >
        {value}
      </p>

    </div>
  )
}


/* ==========================================================
   TABLE COMPONENTS
========================================================== */

function TableHeading({
  children,
}: {
  children: React.ReactNode
}) {

  return (

    <th
      className="
        whitespace-nowrap
        px-6
        py-3
        text-left
        text-xs
        font-semibold
        uppercase
        tracking-wide
        text-slate-500
      "
    >
      {children}
    </th>

  )
}


function TableValue({
  children,
}: {
  children: React.ReactNode
}) {

  return (

    <td
      className="
        whitespace-nowrap
        px-6
        py-4
        text-sm
        text-slate-700
      "
    >
      {children}
    </td>

  )
}