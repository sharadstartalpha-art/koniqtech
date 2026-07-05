// app/admin/sales/dashboard/page.tsx

import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  Send,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"


/* ==========================================================
   HELPERS
========================================================== */

function startOfToday() {
  const date = new Date()

  date.setHours(
    0,
    0,
    0,
    0
  )

  return date
}


function startOfWeek() {
  const date = new Date()

  const day =
    date.getDay()

  const difference =
    day === 0
      ? 6
      : day - 1

  date.setDate(
    date.getDate() -
      difference
  )

  date.setHours(
    0,
    0,
    0,
    0
  )

  return date
}


function formatDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  ).format(date)
}


function formatStatus(
  status: string
) {
  return status
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    )
}


function statusClass(
  status: string
) {
  switch (status) {

    case "new":
      return `
        border-blue-200
        bg-blue-50
        text-blue-700
      `

    case "contacted":
      return `
        border-orange-200
        bg-orange-50
        text-orange-700
      `

    case "estimate":
      return `
        border-purple-200
        bg-purple-50
        text-purple-700
      `

    case "won":
    case "converted":
      return `
        border-green-200
        bg-green-50
        text-green-700
      `

    case "lost":
      return `
        border-red-200
        bg-red-50
        text-red-700
      `

    default:
      return `
        border-slate-200
        bg-slate-50
        text-slate-700
      `
  }
}


/* ==========================================================
   PAGE
========================================================== */

export default async function SalesDashboardPage() {

  /* --------------------------------------------------------
     AUTH
  --------------------------------------------------------- */

  const session =
    await auth()


  if (!session?.user) {
    redirect("/login")
  }


  const userId =
    String(
      (session.user as any).id ??
        ""
    )


  const role =
    String(
      (session.user as any).role ??
        ""
    )
      .trim()
      .toLowerCase()


  if (
    !userId ||
    role !== "platform_sales"
  ) {
    redirect("/admin/dashboard")
  }


  /* --------------------------------------------------------
     DATE RANGES
  --------------------------------------------------------- */

  const today =
    startOfToday()


  const weekStart =
    startOfWeek()


  /* --------------------------------------------------------
     SALES DATA
  --------------------------------------------------------- */

  const [

    totalAssigned,

    newLeads,

    contactedLeads,

    estimateLeads,

    convertedLeads,

    wonLeads,

    leadsAssignedToday,

    leadsThisWeek,

    emailActivities,

    callActivities,

    recentLeads,

    recentActivities,

  ] = await Promise.all([

    /* Total Assigned */

    prisma.lead.count({
      where: {
        assignedTo: userId,
      },
    }),


    /* New */

    prisma.lead.count({
      where: {
        assignedTo: userId,

        status: "new",
      },
    }),


    /* Contacted */

    prisma.lead.count({
      where: {
        assignedTo: userId,

        status: "contacted",
      },
    }),


    /* Estimate / Interested */

    prisma.lead.count({
      where: {
        assignedTo: userId,

        status: "estimate",
      },
    }),


    /* Converted */

    prisma.lead.count({
      where: {
        assignedTo: userId,

        status: "converted",
      },
    }),


    /* Won */

    prisma.lead.count({
      where: {
        assignedTo: userId,

        status: "won",
      },
    }),


    /* Assigned / Created Today */

    prisma.lead.count({
      where: {
        assignedTo: userId,

        createdAt: {
          gte: today,
        },
      },
    }),


    /* This Week */

    prisma.lead.count({
      where: {
        assignedTo: userId,

        createdAt: {
          gte: weekStart,
        },
      },
    }),


    /* Email Activities */

    prisma.leadActivity.count({
      where: {
        lead: {
          assignedTo: userId,
        },

        type: {
          contains: "email",
          mode: "insensitive",
        },
      },
    }),


    /* Call Activities */

    prisma.leadActivity.count({
      where: {
        lead: {
          assignedTo: userId,
        },

        type: {
          contains: "call",
          mode: "insensitive",
        },
      },
    }),


    /* Recent Assigned Leads */

    prisma.lead.findMany({
      where: {
        assignedTo: userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 6,

      select: {
        id: true,

        firstName: true,

        lastName: true,

        companyName: true,

        email: true,

        phone: true,

        source: true,

        priority: true,

        status: true,

        createdAt: true,
      },
    }),


    /* Recent Sales Activities */

    prisma.leadActivity.findMany({
      where: {
        lead: {
          assignedTo: userId,
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 6,

      select: {
        id: true,

        type: true,

        title: true,

        createdAt: true,

        lead: {
          select: {
            id: true,

            firstName: true,

            lastName: true,

            companyName: true,
          },
        },
      },
    }),

  ])


  /* --------------------------------------------------------
     CALCULATED METRICS
  --------------------------------------------------------- */

  const successfulLeads =
    convertedLeads +
    wonLeads


  const contactedOrBeyond =
    contactedLeads +
    estimateLeads +
    successfulLeads


  const contactRate =
    totalAssigned > 0
      ? Math.round(
          (
            contactedOrBeyond /
            totalAssigned
          ) * 100
        )
      : 0


  const conversionRate =
    totalAssigned > 0
      ? Math.round(
          (
            successfulLeads /
            totalAssigned
          ) * 100
        )
      : 0


  const stats = [

    {
      label:
        "Assigned Leads",

      value:
        totalAssigned,

      description:
        "Total leads assigned to you",

      icon:
        Users,

      iconClass:
        "bg-blue-50 text-blue-600",
    },

    {
      label:
        "New Leads",

      value:
        newLeads,

      description:
        "Waiting for first contact",

      icon:
        Target,

      iconClass:
        "bg-orange-50 text-orange-600",
    },

    {
      label:
        "Contacted",

      value:
        contactedLeads,

      description:
        "Initial contact completed",

      icon:
        Phone,

      iconClass:
        "bg-green-50 text-green-600",
    },

    {
      label:
        "Interested",

      value:
        estimateLeads,

      description:
        "Qualified opportunities",

      icon:
        UserCheck,

      iconClass:
        "bg-purple-50 text-purple-600",
    },

  ]


  /* ========================================================
     UI
  ======================================================== */

  return (

    <div className="space-y-6">

      {/* ====================================================
          HEADER
      ==================================================== */}

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
              mb-1
              text-sm
              font-medium
              text-blue-600
            "
          >
            Sales Operations
          </p>


          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
            "
          >
            Sales Dashboard
          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Manage assigned leads,
            track outreach activity,
            and move qualified prospects
            toward product demos.
          </p>

        </div>


        <div
          className="
            flex
            flex-wrap
            gap-3
          "
        >

          <Link
            href="/admin/sales/outreach"
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-lg
              bg-blue-600
              px-4
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
            "
          >
            <Send size={17} />

            Start Outreach
          </Link>


          <Link
            href="/admin/sales/demo-requests"
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-lg
              bg-green-600
              px-4
              text-sm
              font-medium
              text-white
              transition
              hover:bg-green-700
            "
          >
            <CalendarCheck
              size={17}
            />

            Demo Requests
          </Link>

        </div>

      </div>


      {/* ====================================================
          PRIMARY KPI CARDS
      ==================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {stats.map((stat) => {

          const Icon =
            stat.icon


          return (

            <div
              key={stat.label}
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
                      text-slate-500
                    "
                  >
                    {stat.label}
                  </p>


                  <p
                    className="
                      mt-2
                      text-3xl
                      font-bold
                      text-slate-950
                    "
                  >
                    {stat.value}
                  </p>


                  <p
                    className="
                      mt-3
                      text-xs
                      text-slate-400
                    "
                  >
                    {stat.description}
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
                    ${stat.iconClass}
                  `}
                >
                  <Icon size={21} />
                </div>

              </div>

            </div>

          )

        })}

      </div>


      {/* ====================================================
          SECONDARY KPI CARDS
      ==================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-6
        "
      >

        <MiniStat
          icon={Clock3}
          label="Today"
          value={leadsAssignedToday}
        />


        <MiniStat
          icon={CalendarCheck}
          label="This Week"
          value={leadsThisWeek}
        />


        <MiniStat
          icon={Mail}
          label="Emails"
          value={emailActivities}
        />


        <MiniStat
          icon={Phone}
          label="Calls"
          value={callActivities}
        />


        <MiniStat
          icon={TrendingUp}
          label="Contact Rate"
          value={`${contactRate}%`}
        />


        <MiniStat
          icon={CheckCircle2}
          label="Success Rate"
          value={`${conversionRate}%`}
        />

      </div>


      {/* ====================================================
          MAIN GRID
      ==================================================== */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]
        "
      >

        {/* ==================================================
            RECENT LEADS
        ================================================== */}

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
                Assigned Leads
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Your most recently assigned
                lead records.
              </p>

            </div>


            <Link
              href="/admin/sales/leads"
              className="
                inline-flex
                items-center
                gap-1
                text-sm
                font-medium
                text-blue-600
                hover:text-blue-700
              "
            >
              View All

              <ArrowRight
                size={16}
              />
            </Link>

          </div>


          {recentLeads.length === 0 ? (

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
                <Target size={22} />
              </div>


              <h3
                className="
                  mt-4
                  font-semibold
                  text-slate-900
                "
              >
                No leads assigned
              </h3>


              <p
                className="
                  mt-1
                  max-w-sm
                  text-sm
                  text-slate-500
                "
              >
                Leads assigned to your sales
                account will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table
                className="
                  w-full
                  min-w-[760px]
                  text-left
                "
              >

                <thead
                  className="
                    bg-slate-50
                    text-xs
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >

                  <tr>

                    <th className="px-5 py-3">
                      Lead
                    </th>

                    <th className="px-5 py-3">
                      Source
                    </th>

                    <th className="px-5 py-3">
                      Priority
                    </th>

                    <th className="px-5 py-3">
                      Status
                    </th>

                    <th className="px-5 py-3">
                      Created
                    </th>

                    <th className="px-5 py-3 text-right">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody
                  className="
                    divide-y
                    divide-slate-100
                  "
                >

                  {recentLeads.map(
                    (lead) => (

                      <tr
                        key={lead.id}
                        className="
                          transition
                          hover:bg-slate-50/70
                        "
                      >

                        <td className="px-5 py-4">

                          <p
                            className="
                              font-medium
                              text-slate-900
                            "
                          >
                            {lead.firstName}

                            {lead.lastName
                              ? ` ${lead.lastName}`
                              : ""}
                          </p>


                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-500
                            "
                          >
                            {lead.companyName ||
                              lead.email ||
                              lead.phone ||
                              "No additional contact details"}
                          </p>

                        </td>


                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-slate-600
                          "
                        >
                          {lead.source || "—"}
                        </td>


                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-slate-600
                          "
                        >
                          {lead.priority ||
                            "Medium"}
                        </td>


                        <td className="px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-xs
                              font-medium
                              ${statusClass(
                                lead.status
                              )}
                            `}
                          >
                            {formatStatus(
                              lead.status
                            )}
                          </span>

                        </td>


                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-slate-500
                          "
                        >
                          {formatDate(
                            lead.createdAt
                          )}
                        </td>


                        <td
                          className="
                            px-5
                            py-4
                            text-right
                          "
                        >

                          <Link
                            href={
                              `/admin/sales/leads/${lead.id}`
                            }
                            className="
                              inline-flex
                              items-center
                              gap-1
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

                            <ArrowRight
                              size={15}
                            />
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


        {/* ==================================================
            ACTIVITY FEED
        ================================================== */}

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
              px-5
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
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                "
              >
                <BarChart3
                  size={19}
                />
              </div>


              <div>

                <h2
                  className="
                    font-semibold
                    text-slate-950
                  "
                >
                  Recent Activity
                </h2>


                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Latest sales interactions
                </p>

              </div>

            </div>

          </div>


          <div className="p-5">

            {recentActivities.length === 0 ? (

              <div
                className="
                  py-12
                  text-center
                "
              >

                <Clock3
                  size={28}
                  className="
                    mx-auto
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
                  No activity recorded yet.
                </p>

              </div>

            ) : (

              <div className="space-y-5">

                {recentActivities.map(
                  (activity) => {

                    const leadName =
                      [
                        activity.lead
                          .firstName,

                        activity.lead
                          .lastName,
                      ]
                        .filter(Boolean)
                        .join(" ")


                    return (

                      <div
                        key={activity.id}
                        className="
                          flex
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
                            bg-slate-100
                            text-slate-600
                          "
                        >
                          <ActivityIcon
                            type={
                              activity.type
                            }
                          />
                        </div>


                        <div className="min-w-0">

                          <p
                            className="
                              text-sm
                              font-medium
                              text-slate-900
                            "
                          >
                            {activity.title}
                          </p>


                          <p
                            className="
                              mt-1
                              truncate
                              text-xs
                              text-slate-500
                            "
                          >
                            {leadName ||
                              activity.lead
                                .companyName ||
                              "Lead"}
                          </p>


                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-400
                            "
                          >
                            {formatDate(
                              activity.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                    )

                  }
                )}

              </div>

            )}

          </div>

        </section>

      </div>

    </div>

  )
}


/* ==========================================================
   MINI STAT
========================================================== */

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: number | string
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
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
        <Icon size={19} />
      </div>


      <div className="min-w-0">

        <p
          className="
            truncate
            text-xs
            text-slate-500
          "
        >
          {label}
        </p>


        <p
          className="
            mt-1
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
   ACTIVITY ICON
========================================================== */

function ActivityIcon({
  type,
}: {
  type: string
}) {

  const normalized =
    type.toLowerCase()


  if (
    normalized.includes("email")
  ) {
    return <Mail size={17} />
  }


  if (
    normalized.includes("call")
  ) {
    return <Phone size={17} />
  }


  if (
    normalized.includes("demo")
  ) {
    return (
      <CalendarCheck
        size={17}
      />
    )
  }


  return <Clock3 size={17} />
}