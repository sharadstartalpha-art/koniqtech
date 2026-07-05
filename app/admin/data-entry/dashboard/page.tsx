import Link from "next/link"

import {
  redirect
} from "next/navigation"

import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Database,
  FilePlus2,
  PhoneCall,
  Target,
  TrendingUp,
  UserRoundCheck,
  UsersRound
} from "lucide-react"

import {
  LeadStatus
} from "@prisma/client"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"


// ============================================================
// PAGE
// ============================================================

export default async function DataEntryDashboardPage() {

  // ----------------------------------------------------------
  // AUTH
  // ----------------------------------------------------------

  const session =
    await auth()


  if (
    !session?.user?.id ||
    !session.user.orgId
  ) {

    redirect(
      "/login"
    )

  }


  const orgId =
    session.user.orgId


  // ----------------------------------------------------------
  // DATE RANGES
  // ----------------------------------------------------------

  const now =
    new Date()


  const startOfToday =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )


  const startOfWeek =
    new Date(
      startOfToday
    )


  const currentDay =
    startOfWeek.getDay()


  const daysFromMonday =
    currentDay === 0
      ? 6
      : currentDay - 1


  startOfWeek.setDate(
    startOfWeek.getDate() -
    daysFromMonday
  )


  const startOfMonth =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )


  // ----------------------------------------------------------
  // DASHBOARD DATA
  // ----------------------------------------------------------

  const [
    totalLeads,
    leadsToday,
    leadsThisWeek,
    leadsThisMonth,
    newLeads,
    contactedLeads,
    convertedLeads,
    wonLeads,
    unassignedLeads,
    recentLeads
  ] =
    await Promise.all([

      prisma.lead.count({

        where: {
          orgId
        }

      }),


      prisma.lead.count({

        where: {

          orgId,

          createdAt: {

            gte:
              startOfToday

          }

        }

      }),


      prisma.lead.count({

        where: {

          orgId,

          createdAt: {

            gte:
              startOfWeek

          }

        }

      }),


      prisma.lead.count({

        where: {

          orgId,

          createdAt: {

            gte:
              startOfMonth

          }

        }

      }),


      prisma.lead.count({

        where: {

          orgId,

          status:
            LeadStatus.new

        }

      }),


      prisma.lead.count({

        where: {

          orgId,

          status:
            LeadStatus.contacted

        }

      }),


      prisma.lead.count({

        where: {

          orgId,

          status:
            LeadStatus.converted

        }

      }),


      prisma.lead.count({

        where: {

          orgId,

          status:
            LeadStatus.won

        }

      }),


      prisma.lead.count({

        where: {

          orgId,

          assignedTo:
            null

        }

      }),


      prisma.lead.findMany({

        where: {

          orgId

        },

        orderBy: {

          createdAt:
            "desc"

        },

        take:
          6,

        select: {

          id:
            true,

          firstName:
            true,

          lastName:
            true,

          companyName:
            true,

          email:
            true,

          source:
            true,

          priority:
            true,

          status:
            true,

          createdAt:
            true,

          assignee: {

            select: {

              id:
                true,

              name:
                true

            }

          }

        }

      })

    ])


  // ----------------------------------------------------------
  // CONVERSION RATE
  // ----------------------------------------------------------

  const successfulLeads =
    convertedLeads +
    wonLeads


  const conversionRate =
    totalLeads > 0
      ? Math.round(
          (
            successfulLeads /
            totalLeads
          ) * 100
        )
      : 0


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-col gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div>

          <p
            className="
              text-sm font-medium
              text-blue-600
            "
          >
            Data Entry Operations
          </p>


          <h1
            className="
              mt-1
              text-3xl
              font-semibold
              tracking-tight
              text-slate-950
            "
          >
            Data Entry Dashboard
          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Monitor lead records, recent entries,
            assignments, and conversion progress.
          </p>

        </div>


        <Link
          href="/admin/data-entry/new"
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
          "
        >
          <FilePlus2 className="h-4 w-4" />

          Add New Lead
        </Link>

      </div>


      {/* ==================================================== */}
      {/* PRIMARY METRICS */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <MetricCard
          title="Total Leads"
          value={
            totalLeads
          }
          description="All lead records"
          icon={Database}
          tone="blue"
        />


        <MetricCard
          title="Entered Today"
          value={
            leadsToday
          }
          description="Records created today"
          icon={FilePlus2}
          tone="green"
        />


        <MetricCard
          title="This Week"
          value={
            leadsThisWeek
          }
          description="Records since Monday"
          icon={CalendarDays}
          tone="orange"
        />


        <MetricCard
          title="This Month"
          value={
            leadsThisMonth
          }
          description="Records this month"
          icon={TrendingUp}
          tone="violet"
        />

      </div>


      {/* ==================================================== */}
      {/* SECONDARY METRICS */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-5
        "
      >

        <SmallMetricCard
          title="New"
          value={
            newLeads
          }
          icon={Target}
        />


        <SmallMetricCard
          title="Contacted"
          value={
            contactedLeads
          }
          icon={PhoneCall}
        />


        <SmallMetricCard
          title="Converted"
          value={
            convertedLeads
          }
          icon={UserRoundCheck}
        />


        <SmallMetricCard
          title="Unassigned"
          value={
            unassignedLeads
          }
          icon={UsersRound}
        />


        <SmallMetricCard
          title="Success Rate"
          value={
            `${conversionRate}%`
          }
          icon={CheckCircle2}
        />

      </div>


      {/* ==================================================== */}
      {/* MAIN CONTENT */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-6
          xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]
        "
      >

        {/* ================================================== */}
        {/* RECENT LEADS */}
        {/* ================================================== */}

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
              flex items-center
              justify-between
              gap-4
              border-b
              border-slate-200
              px-5 py-4
            "
          >

            <div>

              <h2
                className="
                  font-semibold
                  text-slate-950
                "
              >
                Recent Lead Entries
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Latest records added to the system.
              </p>

            </div>


            <Link
              href="/admin/data-entry"
              className="
                inline-flex
                items-center gap-1.5
                text-sm font-medium
                text-blue-600
                transition
                hover:text-blue-700
              "
            >
              View All

              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>


          {recentLeads.length === 0 ? (

            <div
              className="
                flex flex-col
                items-center
                justify-center
                px-6 py-16
                text-center
              "
            >

              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                "
              >
                <Database className="h-6 w-6" />
              </div>


              <p
                className="
                  mt-4
                  font-medium
                  text-slate-800
                "
              >
                No lead records yet
              </p>


              <p
                className="
                  mt-1
                  max-w-sm
                  text-sm
                  text-slate-500
                "
              >
                Create the first lead record to start
                building the data-entry pipeline.
              </p>


              <Link
                href="/admin/data-entry/new"
                className="
                  mt-5
                  inline-flex
                  items-center gap-2
                  rounded-lg
                  bg-green-600
                  px-4 py-2.5
                  text-sm font-medium
                  text-white
                  transition
                  hover:bg-green-700
                "
              >
                <FilePlus2 className="h-4 w-4" />

                Add Lead
              </Link>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead
                  className="
                    bg-slate-50
                    text-left
                  "
                >

                  <tr
                    className="
                      border-b
                      border-slate-200
                    "
                  >

                    <TableHeading>
                      Lead
                    </TableHeading>

                    <TableHeading>
                      Source
                    </TableHeading>

                    <TableHeading>
                      Priority
                    </TableHeading>

                    <TableHeading>
                      Status
                    </TableHeading>

                    <TableHeading>
                      Assignee
                    </TableHeading>

                    <TableHeading>
                      Created
                    </TableHeading>

                  </tr>

                </thead>


                <tbody>

                  {recentLeads.map(
                    (lead) => {

                      const fullName =
                        [
                          lead.firstName,
                          lead.lastName
                        ]
                          .filter(Boolean)
                          .join(" ")


                      return (
                        <tr
                          key={
                            lead.id
                          }
                          className="
                            border-b
                            border-slate-100
                            last:border-b-0
                            hover:bg-slate-50/70
                          "
                        >

                          <td className="px-5 py-4">

                            <Link
                              href={
                                `/admin/data-entry/${lead.id}`
                              }
                              className="
                                font-medium
                                text-slate-900
                                transition
                                hover:text-blue-600
                              "
                            >
                              {fullName}
                            </Link>


                            <p
                              className="
                                mt-1
                                text-xs
                                text-slate-500
                              "
                            >
                              {lead.companyName ||
                                lead.email ||
                                "No company"}
                            </p>

                          </td>


                          <td
                            className="
                              px-5 py-4
                              text-sm
                              text-slate-600
                            "
                          >
                            {lead.source ||
                              "Not specified"}
                          </td>


                          <td className="px-5 py-4">

                            <PriorityBadge
                              priority={
                                lead.priority ||
                                "Medium"
                              }
                            />

                          </td>


                          <td className="px-5 py-4">

                            <StatusBadge
                              status={
                                lead.status
                              }
                            />

                          </td>


                          <td
                            className="
                              px-5 py-4
                              text-sm
                            "
                          >
                            {lead.assignee ? (

                              <span className="text-slate-700">
                                {lead.assignee.name}
                              </span>

                            ) : (

                              <span
                                className="
                                  font-medium
                                  text-orange-600
                                "
                              >
                                Unassigned
                              </span>

                            )}
                          </td>


                          <td
                            className="
                              whitespace-nowrap
                              px-5 py-4
                              text-sm
                              text-slate-500
                            "
                          >
                            {formatDate(
                              lead.createdAt
                            )}
                          </td>

                        </tr>
                      )

                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* ================================================== */}
        {/* QUICK OVERVIEW */}
        {/* ================================================== */}

        <div className="space-y-6">

          <section
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
                flex items-center gap-3
              "
            >

              <div
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-lg
                  bg-blue-50
                  text-blue-600
                "
              >
                <BarChart3 className="h-5 w-5" />
              </div>


              <div>

                <h2
                  className="
                    font-semibold
                    text-slate-900
                  "
                >
                  Lead Overview
                </h2>


                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Current lead distribution
                </p>

              </div>

            </div>


            <div className="mt-5 space-y-4">

              <ProgressRow
                label="New Leads"
                value={
                  newLeads
                }
                total={
                  totalLeads
                }
              />


              <ProgressRow
                label="Contacted"
                value={
                  contactedLeads
                }
                total={
                  totalLeads
                }
              />


              <ProgressRow
                label="Converted"
                value={
                  convertedLeads
                }
                total={
                  totalLeads
                }
              />


              <ProgressRow
                label="Won"
                value={
                  wonLeads
                }
                total={
                  totalLeads
                }
              />

            </div>


            <Link
              href="/admin/data-entry/reports"
              className="
                mt-6
                inline-flex w-full
                items-center justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4 py-2.5
                text-sm font-medium
                text-white
                transition
                hover:bg-blue-700
              "
            >
              View Reports

              <ArrowRight className="h-4 w-4" />
            </Link>

          </section>


          {/* QUICK ACTIONS */}

          <section
            className="
              rounded-xl
              border border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >

            <h2
              className="
                font-semibold
                text-slate-900
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
              Common data-entry tasks.
            </p>


            <div className="mt-4 space-y-3">

              <QuickAction
                href="/admin/data-entry/new"
                label="Add New Lead"
                description="Create a lead record"
                icon={FilePlus2}
                tone="green"
              />


              <QuickAction
                href="/admin/data-entry"
                label="Manage Leads"
                description="Search and update records"
                icon={Database}
                tone="blue"
              />


              <QuickAction
                href="/admin/data-entry/reports"
                label="View Reports"
                description="Review lead performance"
                icon={BarChart3}
                tone="orange"
              />

            </div>

          </section>

        </div>

      </div>

    </div>
  )
}


// ============================================================
// METRIC CARD
// ============================================================

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone
}: {

  title: string

  value: number | string

  description: string

  icon: React.ComponentType<{
    className?: string
  }>

  tone:
    | "blue"
    | "green"
    | "orange"
    | "violet"

}) {

  const toneClasses = {

    blue:
      "bg-blue-50 text-blue-600",

    green:
      "bg-green-50 text-green-600",

    orange:
      "bg-orange-50 text-orange-600",

    violet:
      "bg-violet-50 text-violet-600"

  }


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
          flex items-start
          justify-between gap-4
        "
      >

        <div>

          <p
            className="
              text-sm font-medium
              text-slate-500
            "
          >
            {title}
          </p>


          <p
            className="
              mt-2
              text-3xl font-semibold
              tracking-tight
              text-slate-950
            "
          >
            {value}
          </p>

        </div>


        <div
          className={`
            flex h-11 w-11
            items-center justify-center
            rounded-xl
            ${toneClasses[tone]}
          `}
        >
          <Icon className="h-5 w-5" />
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


// ============================================================
// SMALL METRIC
// ============================================================

function SmallMetricCard({
  title,
  value,
  icon: Icon
}: {

  title: string

  value: number | string

  icon: React.ComponentType<{
    className?: string
  }>

}) {

  return (
    <div
      className="
        flex items-center gap-4
        rounded-xl
        border border-slate-200
        bg-white
        px-4 py-4
        shadow-sm
      "
    >

      <div
        className="
          flex h-10 w-10
          shrink-0
          items-center justify-center
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
            text-xs font-medium
            text-slate-500
          "
        >
          {title}
        </p>


        <p
          className="
            mt-0.5
            text-xl font-semibold
            text-slate-950
          "
        >
          {value}
        </p>

      </div>

    </div>
  )
}


// ============================================================
// TABLE HEADING
// ============================================================

function TableHeading({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <th
      className="
        whitespace-nowrap
        px-5 py-3
        text-xs font-semibold
        uppercase tracking-wide
        text-slate-500
      "
    >
      {children}
    </th>
  )
}


// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
  status
}: {
  status: LeadStatus
}) {

  const styles:
    Record<LeadStatus, string> = {

    new:
      "border-blue-200 bg-blue-50 text-blue-700",

    contacted:
      "border-orange-200 bg-orange-50 text-orange-700",

    estimate:
      "border-violet-200 bg-violet-50 text-violet-700",

    won:
      "border-green-200 bg-green-50 text-green-700",

    lost:
      "border-red-200 bg-red-50 text-red-700",

    converted:
      "border-emerald-200 bg-emerald-50 text-emerald-700"

  }


  return (
    <span
      className={`
        inline-flex
        rounded-full
        border
        px-2.5 py-1
        text-xs font-medium
        capitalize
        ${styles[status]}
      `}
    >
      {status}
    </span>
  )
}


// ============================================================
// PRIORITY BADGE
// ============================================================

function PriorityBadge({
  priority
}: {
  priority: string
}) {

  const styles:
    Record<string, string> = {

    Low:
      "border-slate-200 bg-slate-50 text-slate-600",

    Medium:
      "border-blue-200 bg-blue-50 text-blue-700",

    High:
      "border-orange-200 bg-orange-50 text-orange-700",

    Urgent:
      "border-red-200 bg-red-50 text-red-700"

  }


  return (
    <span
      className={`
        inline-flex
        rounded-full
        border
        px-2.5 py-1
        text-xs font-medium
        ${
          styles[priority] ??
          styles.Medium
        }
      `}
    >
      {priority}
    </span>
  )
}


// ============================================================
// PROGRESS ROW
// ============================================================

function ProgressRow({
  label,
  value,
  total
}: {

  label: string

  value: number

  total: number

}) {

  const percentage =
    total > 0
      ? Math.round(
          (
            value /
            total
          ) * 100
        )
      : 0


  return (
    <div>

      <div
        className="
          flex items-center
          justify-between
          text-sm
        "
      >

        <span className="text-slate-600">
          {label}
        </span>


        <span
          className="
            font-medium
            text-slate-900
          "
        >
          {value}

          <span
            className="
              ml-1
              text-xs
              text-slate-400
            "
          >
            ({percentage}%)
          </span>

        </span>

      </div>


      <div
        className="
          mt-2 h-2
          overflow-hidden
          rounded-full
          bg-slate-100
        "
      >

        <div
          className="
            h-full
            rounded-full
            bg-blue-500
            transition-all
          "
          style={{
            width:
              `${percentage}%`
          }}
        />

      </div>

    </div>
  )
}


// ============================================================
// QUICK ACTION
// ============================================================

function QuickAction({
  href,
  label,
  description,
  icon: Icon,
  tone
}: {

  href: string

  label: string

  description: string

  icon: React.ComponentType<{
    className?: string
  }>

  tone:
    | "green"
    | "blue"
    | "orange"

}) {

  const toneClasses = {

    green:
      "bg-green-50 text-green-600",

    blue:
      "bg-blue-50 text-blue-600",

    orange:
      "bg-orange-50 text-orange-600"

  }


  return (
    <Link
      href={
        href
      }
      className="
        group
        flex items-center gap-3
        rounded-lg
        border border-slate-200
        p-3
        transition
        hover:border-blue-200
        hover:bg-slate-50
      "
    >

      <div
        className={`
          flex h-10 w-10
          shrink-0
          items-center justify-center
          rounded-lg
          ${toneClasses[tone]}
        `}
      >
        <Icon className="h-5 w-5" />
      </div>


      <div className="min-w-0 flex-1">

        <p
          className="
            text-sm font-medium
            text-slate-800
          "
        >
          {label}
        </p>


        <p
          className="
            mt-0.5
            text-xs
            text-slate-500
          "
        >
          {description}
        </p>

      </div>


      <ArrowRight
        className="
          h-4 w-4
          text-slate-400
          transition
          group-hover:translate-x-0.5
          group-hover:text-blue-600
        "
      />

    </Link>
  )
}


// ============================================================
// DATE FORMAT
// ============================================================

function formatDate(
  date: Date
) {

  return new Intl.DateTimeFormat(
    "en-US",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric"
    }
  ).format(date)
}