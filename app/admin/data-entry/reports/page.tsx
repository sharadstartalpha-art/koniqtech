import Link from "next/link"

import {
  redirect
} from "next/navigation"

import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Database,
  FilePlus2,
  Filter,
  Globe2,
  PhoneCall,
  RotateCcw,
  Target,
  TrendingUp,
  UserRoundCheck,
  UsersRound
} from "lucide-react"

import {
  Industry,
  LeadStatus
} from "@prisma/client"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"


// ============================================================
// TYPES
// ============================================================

type PageProps = {

  searchParams: Promise<{

    range?: string

    source?: string

    status?: string

    industry?: string

  }>

}


type StatusCount = {

  status: LeadStatus

  count: number

}


type PriorityCount = {

  priority: string

  count: number

}


type SourceCount = {

  source: string

  count: number

}


type IndustryCount = {

  industry: string

  count: number

}


// ============================================================
// PAGE
// ============================================================

export default async function DataEntryReportsPage({

  searchParams

}: PageProps) {

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
  // SEARCH PARAMS
  // ----------------------------------------------------------

  const params =
    await searchParams


  const range =
    params.range ||
    "30"


  const selectedSource =
    params.source ||
    ""


  const selectedStatus =
    params.status ||
    ""


  const selectedIndustry =
    params.industry ||
    ""


  // ----------------------------------------------------------
  // DATE RANGE
  // ----------------------------------------------------------

  const now =
    new Date()


  let startDate:
    Date | undefined


  if (
    range !== "all"
  ) {

    const days =
      Number(range)


    if (
      Number.isFinite(days) &&
      days > 0
    ) {

      startDate =
        new Date()


      startDate.setDate(
        startDate.getDate() -
        days
      )


      startDate.setHours(
        0,
        0,
        0,
        0
      )

    }

  }


  // ----------------------------------------------------------
  // VALIDATE ENUM FILTERS
  // ----------------------------------------------------------

  const validStatuses =
    Object.values(
      LeadStatus
    )


  const validIndustries =
    Object.values(
      Industry
    )


  const statusFilter =
    validStatuses.includes(
      selectedStatus as LeadStatus
    )
      ? selectedStatus as LeadStatus
      : undefined


  const industryFilter =
    validIndustries.includes(
      selectedIndustry as Industry
    )
      ? selectedIndustry as Industry
      : undefined


  // ----------------------------------------------------------
  // BASE WHERE
  // ----------------------------------------------------------

  const where = {

    orgId,

    ...(startDate
      ? {

          createdAt: {

            gte:
              startDate

          }

        }
      : {}),

    ...(selectedSource
      ? {

          source:
            selectedSource

        }
      : {}),

    ...(statusFilter
      ? {

          status:
            statusFilter

        }
      : {}),

    ...(industryFilter
      ? {

          industry:
            industryFilter

        }
      : {})

  }


  // ----------------------------------------------------------
  // LOAD FILTER OPTIONS
  // ----------------------------------------------------------

  const sourceRows =
    await prisma.lead.findMany({

      where: {

        orgId,

        source: {

          not:
            null

        }

      },

      select: {

        source:
          true

      },

      distinct: [

        "source"

      ],

      orderBy: {

        source:
          "asc"

      }

    })


  const sources =
    sourceRows
      .map(
        (row) =>
          row.source
      )
      .filter(
        (
          source
        ): source is string =>
          Boolean(source)
      )


  // ----------------------------------------------------------
  // MAIN DATA
  // ----------------------------------------------------------

  const [

    totalLeads,

    newLeads,

    contactedLeads,

    estimateLeads,

    wonLeads,

    lostLeads,

    convertedLeads,

    unassignedLeads,

    leads,

    statusGroups,

    priorityGroups,

    sourceGroups,

    industryGroups

  ] =
    await Promise.all([

      // TOTAL

      prisma.lead.count({

        where

      }),


      // NEW

      prisma.lead.count({

        where: {

          ...where,

          status:
            LeadStatus.new

        }

      }),


      // CONTACTED

      prisma.lead.count({

        where: {

          ...where,

          status:
            LeadStatus.contacted

        }

      }),


      // ESTIMATE

      prisma.lead.count({

        where: {

          ...where,

          status:
            LeadStatus.estimate

        }

      }),


      // WON

      prisma.lead.count({

        where: {

          ...where,

          status:
            LeadStatus.won

        }

      }),


      // LOST

      prisma.lead.count({

        where: {

          ...where,

          status:
            LeadStatus.lost

        }

      }),


      // CONVERTED

      prisma.lead.count({

        where: {

          ...where,

          status:
            LeadStatus.converted

        }

      }),


      // UNASSIGNED

      prisma.lead.count({

        where: {

          ...where,

          assignedTo:
            null

        }

      }),


      // RECORDS FOR TREND

      prisma.lead.findMany({

        where,

        orderBy: {

          createdAt:
            "desc"

        },

        select: {

          id:
            true,

          firstName:
            true,

          lastName:
            true,

          companyName:
            true,

          source:
            true,

          priority:
            true,

          industry:
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

      }),


      // STATUS GROUP

      prisma.lead.groupBy({

        by: [

          "status"

        ],

        where,

        _count: {

          _all:
            true

        }

      }),


      // PRIORITY GROUP

      prisma.lead.groupBy({

        by: [

          "priority"

        ],

        where,

        _count: {

          _all:
            true

        }

      }),


      // SOURCE GROUP

      prisma.lead.groupBy({

        by: [

          "source"

        ],

        where,

        _count: {

          _all:
            true

        }

      }),


      // INDUSTRY GROUP

      prisma.lead.groupBy({

        by: [

          "industry"

        ],

        where,

        _count: {

          _all:
            true

        }

      })

    ])


  // ----------------------------------------------------------
  // NORMALIZE GROUP DATA
  // ----------------------------------------------------------

  const statusData:
    StatusCount[] =
    statusGroups
      .map(
        (item) => ({

          status:
            item.status,

          count:
            item._count._all

        })
      )
      .sort(
        (a, b) =>
          b.count -
          a.count
      )


  const priorityData:
    PriorityCount[] =
    priorityGroups
      .map(
        (item) => ({

          priority:
            item.priority ||
            "Not specified",

          count:
            item._count._all

        })
      )
      .sort(
        (a, b) =>
          b.count -
          a.count
      )


  const sourceData:
    SourceCount[] =
    sourceGroups
      .map(
        (item) => ({

          source:
            item.source ||
            "Not specified",

          count:
            item._count._all

        })
      )
      .sort(
        (a, b) =>
          b.count -
          a.count
      )
      .slice(
        0,
        8
      )


  const industryData:
    IndustryCount[] =
    industryGroups
      .map(
        (item) => ({

          industry:
            item.industry ||
            "Not specified",

          count:
            item._count._all

        })
      )
      .sort(
        (a, b) =>
          b.count -
          a.count
      )


  // ----------------------------------------------------------
  // CALCULATED METRICS
  // ----------------------------------------------------------

  const successfulLeads =
    wonLeads +
    convertedLeads


  const conversionRate =
    totalLeads > 0
      ? Math.round(
          (
            successfulLeads /
            totalLeads
          ) * 100
        )
      : 0


  const contactRate =
    totalLeads > 0
      ? Math.round(
          (
            (
              contactedLeads +
              estimateLeads +
              wonLeads +
              convertedLeads
            ) /
            totalLeads
          ) * 100
        )
      : 0


  const assignmentRate =
    totalLeads > 0
      ? Math.round(
          (
            (
              totalLeads -
              unassignedLeads
            ) /
            totalLeads
          ) * 100
        )
      : 0


  // ----------------------------------------------------------
  // MONTHLY TREND
  // ----------------------------------------------------------

  const monthlyTrend =
    buildMonthlyTrend(
      leads.map(
        (lead) =>
          lead.createdAt
      )
    )


  const maxMonthlyValue =
    Math.max(
      ...monthlyTrend.map(
        (item) =>
          item.count
      ),
      1
    )


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
            Data Entry Analytics
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
            Lead Reports
          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Analyze lead volume, status distribution,
            sources, industries, and data-entry performance.
          </p>

        </div>


        <div
          className="
            flex flex-wrap
            items-center gap-3
          "
        >

          <Link
            href="/admin/data-entry"
            className="
              inline-flex h-11
              items-center justify-center
              gap-2
              rounded-lg
              border border-blue-200
              bg-blue-50
              px-4
              text-sm font-medium
              text-blue-700
              transition
              hover:bg-blue-100
            "
          >
            <Database className="h-4 w-4" />

            View Leads
          </Link>


          <Link
            href="/admin/data-entry/new"
            className="
              inline-flex h-11
              items-center justify-center
              gap-2
              rounded-lg
              bg-green-600
              px-4
              text-sm font-medium
              text-white
              shadow-sm
              transition
              hover:bg-green-700
            "
          >
            <FilePlus2 className="h-4 w-4" />

            Add Lead
          </Link>

        </div>

      </div>


      {/* ==================================================== */}
      {/* FILTERS */}
      {/* ==================================================== */}

      <form
        method="GET"
        className="
          rounded-xl
          border border-slate-200
          bg-white
          p-4
          shadow-sm
        "
      >

        <div
          className="
            grid gap-3
            md:grid-cols-2
            xl:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]
          "
        >

          {/* RANGE */}

          <select
            name="range"
            defaultValue={
              range
            }
            className="
              h-11
              rounded-lg
              border border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="7">
              Last 7 days
            </option>

            <option value="30">
              Last 30 days
            </option>

            <option value="90">
              Last 90 days
            </option>

            <option value="180">
              Last 6 months
            </option>

            <option value="365">
              Last 12 months
            </option>

            <option value="all">
              All time
            </option>
          </select>


          {/* STATUS */}

          <select
            name="status"
            defaultValue={
              selectedStatus
            }
            className="
              h-11
              rounded-lg
              border border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="">
              All statuses
            </option>

            {Object.values(
              LeadStatus
            ).map(
              (status) => (

                <option
                  key={
                    status
                  }
                  value={
                    status
                  }
                >
                  {formatLabel(
                    status
                  )}
                </option>

              )
            )}
          </select>


          {/* SOURCE */}

          <select
            name="source"
            defaultValue={
              selectedSource
            }
            className="
              h-11
              rounded-lg
              border border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="">
              All sources
            </option>

            {sources.map(
              (source) => (

                <option
                  key={
                    source
                  }
                  value={
                    source
                  }
                >
                  {source}
                </option>

              )
            )}
          </select>


          {/* INDUSTRY */}

          <select
            name="industry"
            defaultValue={
              selectedIndustry
            }
            className="
              h-11
              rounded-lg
              border border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="">
              All industries
            </option>

            {Object.values(
              Industry
            ).map(
              (industry) => (

                <option
                  key={
                    industry
                  }
                  value={
                    industry
                  }
                >
                  {formatLabel(
                    industry
                  )}
                </option>

              )
            )}
          </select>


          {/* APPLY */}

          <button
            type="submit"
            className="
              inline-flex h-11
              items-center justify-center
              gap-2
              rounded-lg
              bg-blue-600
              px-5
              text-sm font-medium
              text-white
              transition
              hover:bg-blue-700
            "
          >
            <Filter className="h-4 w-4" />

            Apply
          </button>


          {/* RESET */}

          <Link
            href="/admin/data-entry/reports"
            className="
              inline-flex h-11
              items-center justify-center
              gap-2
              rounded-lg
              bg-orange-50
              px-5
              text-sm font-medium
              text-orange-700
              transition
              hover:bg-orange-100
            "
          >
            <RotateCcw className="h-4 w-4" />

            Reset
          </Link>

        </div>

      </form>


      {/* ==================================================== */}
      {/* PRIMARY KPI */}
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
          description="Records matching filters"
          icon={Database}
          tone="blue"
        />


        <MetricCard
          title="Conversion Rate"
          value={
            `${conversionRate}%`
          }
          description={`${successfulLeads} successful leads`}
          icon={TrendingUp}
          tone="green"
        />


        <MetricCard
          title="Contact Rate"
          value={
            `${contactRate}%`
          }
          description="Leads progressed beyond new"
          icon={PhoneCall}
          tone="orange"
        />


        <MetricCard
          title="Assignment Rate"
          value={
            `${assignmentRate}%`
          }
          description={`${unassignedLeads} currently unassigned`}
          icon={UsersRound}
          tone="violet"
        />

      </div>


      {/* ==================================================== */}
      {/* STATUS CARDS */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-6
        "
      >

        <StatusSummaryCard
          label="New"
          value={
            newLeads
          }
          icon={Target}
          tone="blue"
        />


        <StatusSummaryCard
          label="Contacted"
          value={
            contactedLeads
          }
          icon={PhoneCall}
          tone="orange"
        />


        <StatusSummaryCard
          label="Estimate"
          value={
            estimateLeads
          }
          icon={BarChart3}
          tone="violet"
        />


        <StatusSummaryCard
          label="Won"
          value={
            wonLeads
          }
          icon={CheckCircle2}
          tone="green"
        />


        <StatusSummaryCard
          label="Converted"
          value={
            convertedLeads
          }
          icon={UserRoundCheck}
          tone="emerald"
        />


        <StatusSummaryCard
          label="Lost"
          value={
            lostLeads
          }
          icon={CircleDot}
          tone="red"
        />

      </div>


      {/* ==================================================== */}
      {/* TREND + STATUS */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-6
          xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
        "
      >

        {/* MONTHLY TREND */}

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
              flex items-center
              justify-between
              gap-4
            "
          >

            <div>

              <h2
                className="
                  font-semibold
                  text-slate-950
                "
              >
                Lead Entry Trend
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Lead records created during the last six months.
              </p>

            </div>


            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-lg
                bg-blue-50
                text-blue-600
              "
            >
              <TrendingUp className="h-5 w-5" />
            </div>

          </div>


          <div
            className="
              mt-8
              flex h-64
              items-end gap-3
            "
          >

            {monthlyTrend.map(
              (item) => {

                const height =
                  Math.max(
                    (
                      item.count /
                      maxMonthlyValue
                    ) * 100,
                    item.count > 0
                      ? 8
                      : 2
                  )


                return (
                  <div
                    key={
                      item.key
                    }
                    className="
                      flex h-full
                      min-w-0 flex-1
                      flex-col
                      items-center
                      justify-end
                    "
                  >

                    <span
                      className="
                        mb-2
                        text-xs font-semibold
                        text-slate-700
                      "
                    >
                      {item.count}
                    </span>


                    <div
                      className="
                        flex h-48 w-full
                        items-end
                      "
                    >

                      <div
                        className="
                          w-full
                          rounded-t-lg
                          bg-blue-500
                          transition-all
                          hover:bg-blue-600
                        "
                        style={{
                          height:
                            `${height}%`
                        }}
                      />

                    </div>


                    <span
                      className="
                        mt-3
                        text-xs
                        text-slate-500
                      "
                    >
                      {item.label}
                    </span>

                  </div>
                )

              }
            )}

          </div>

        </section>


        {/* STATUS DISTRIBUTION */}

        <DistributionCard
          title="Status Distribution"
          description="Current lead pipeline breakdown"
          items={
            statusData.map(
              (item) => ({

                label:
                  formatLabel(
                    item.status
                  ),

                value:
                  item.count

              })
            )
          }
          total={
            totalLeads
          }
          icon={Target}
        />

      </div>


      {/* ==================================================== */}
      {/* SOURCE + PRIORITY + INDUSTRY */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-6
          lg:grid-cols-2
          xl:grid-cols-3
        "
      >

        <DistributionCard
          title="Lead Sources"
          description="Where lead records originated"
          items={
            sourceData.map(
              (item) => ({

                label:
                  item.source,

                value:
                  item.count

              })
            )
          }
          total={
            totalLeads
          }
          icon={Globe2}
        />


        <DistributionCard
          title="Priority Distribution"
          description="Lead urgency breakdown"
          items={
            priorityData.map(
              (item) => ({

                label:
                  item.priority,

                value:
                  item.count

              })
            )
          }
          total={
            totalLeads
          }
          icon={BarChart3}
        />


        <DistributionCard
          title="Industry Distribution"
          description="Lead records by CRM industry"
          items={
            industryData.map(
              (item) => ({

                label:
                  formatLabel(
                    item.industry
                  ),

                value:
                  item.count

              })
            )
          }
          total={
            totalLeads
          }
          icon={BriefcaseBusiness}
        />

      </div>


      {/* ==================================================== */}
      {/* RECENT RECORDS */}
      {/* ==================================================== */}

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
              Recent Report Records
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Latest leads matching the selected report filters.
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
            All Leads

            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>


        {leads.length === 0 ? (

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
              <BarChart3 className="h-6 w-6" />
            </div>


            <p
              className="
                mt-4
                font-medium
                text-slate-800
              "
            >
              No report data found
            </p>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Try changing the selected report filters.
            </p>


            <Link
              href="/admin/data-entry/reports"
              className="
                mt-5
                inline-flex
                items-center gap-2
                rounded-lg
                bg-orange-50
                px-4 py-2.5
                text-sm font-medium
                text-orange-700
                transition
                hover:bg-orange-100
              "
            >
              <RotateCcw className="h-4 w-4" />

              Clear Filters
            </Link>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

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
                    Industry
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

                  <TableHeading>
                    Action
                  </TableHeading>

                </tr>

              </thead>


              <tbody>

                {leads
                  .slice(
                    0,
                    10
                  )
                  .map(
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

                            <p
                              className="
                                font-medium
                                text-slate-900
                              "
                            >
                              {fullName}
                            </p>


                            <p
                              className="
                                mt-1
                                text-xs
                                text-slate-500
                              "
                            >
                              {lead.companyName ||
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


                          <td
                            className="
                              px-5 py-4
                              text-sm
                              text-slate-600
                            "
                          >
                            {lead.industry
                              ? formatLabel(
                                  lead.industry
                                )
                              : "Not specified"}
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


                          <td className="px-5 py-4">

                            <Link
                              href={
                                `/admin/data-entry/${lead.id}`
                              }
                              className="
                                inline-flex
                                items-center gap-1.5
                                rounded-lg
                                bg-blue-50
                                px-3 py-2
                                text-xs font-medium
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

                    }
                  )}

              </tbody>

            </table>

          </div>

        )}

      </section>

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

  const tones = {

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
            ${tones[tone]}
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
// STATUS SUMMARY CARD
// ============================================================

function StatusSummaryCard({

  label,

  value,

  icon: Icon,

  tone

}: {

  label: string

  value: number

  icon: React.ComponentType<{
    className?: string
  }>

  tone:
    | "blue"
    | "orange"
    | "violet"
    | "green"
    | "emerald"
    | "red"

}) {

  const tones = {

    blue:
      "bg-blue-50 text-blue-600",

    orange:
      "bg-orange-50 text-orange-600",

    violet:
      "bg-violet-50 text-violet-600",

    green:
      "bg-green-50 text-green-600",

    emerald:
      "bg-emerald-50 text-emerald-600",

    red:
      "bg-red-50 text-red-600"

  }


  return (
    <div
      className="
        flex items-center gap-3
        rounded-xl
        border border-slate-200
        bg-white
        p-4
        shadow-sm
      "
    >

      <div
        className={`
          flex h-10 w-10
          shrink-0
          items-center justify-center
          rounded-lg
          ${tones[tone]}
        `}
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
          {label}
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
// DISTRIBUTION CARD
// ============================================================

function DistributionCard({

  title,

  description,

  items,

  total,

  icon: Icon

}: {

  title: string

  description: string

  items: {

    label: string

    value: number

  }[]

  total: number

  icon: React.ComponentType<{
    className?: string
  }>

}) {

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

      <div
        className="
          flex items-center
          justify-between
          gap-4
        "
      >

        <div>

          <h2
            className="
              font-semibold
              text-slate-950
            "
          >
            {title}
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            {description}
          </p>

        </div>


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

      </div>


      {items.length === 0 ? (

        <div
          className="
            flex h-48
            items-center
            justify-center
            text-sm
            text-slate-400
          "
        >
          No data available
        </div>

      ) : (

        <div className="mt-6 space-y-4">

          {items.map(
            (item) => {

              const percentage =
                total > 0
                  ? Math.round(
                      (
                        item.value /
                        total
                      ) * 100
                    )
                  : 0


              return (
                <div
                  key={
                    item.label
                  }
                >

                  <div
                    className="
                      flex items-center
                      justify-between
                      gap-4
                      text-sm
                    "
                  >

                    <span
                      className="
                        truncate
                        text-slate-600
                      "
                    >
                      {item.label}
                    </span>


                    <span
                      className="
                        shrink-0
                        font-medium
                        text-slate-900
                      "
                    >
                      {item.value}

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
          )}

        </div>

      )}

    </section>
  )
}


// ============================================================
// TABLE HEADING
// ============================================================

function TableHeading({

  children

}: {

  children:
    React.ReactNode

}) {

  return (
    <th
      className="
        whitespace-nowrap
        px-5 py-3
        text-left
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

  status:
    LeadStatus

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

  priority:
    string

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
// MONTHLY TREND
// ============================================================

function buildMonthlyTrend(

  dates: Date[]

) {

  const now =
    new Date()


  const result: {

    key: string

    label: string

    count: number

  }[] = []


  for (
    let offset = 5;
    offset >= 0;
    offset--
  ) {

    const date =
      new Date(
        now.getFullYear(),
        now.getMonth() -
          offset,
        1
      )


    const year =
      date.getFullYear()


    const month =
      date.getMonth()


    const key =
      `${year}-${month}`


    const label =
      date.toLocaleDateString(
        "en-US",
        {
          month:
            "short"
        }
      )


    const count =
      dates.filter(
        (leadDate) =>
          leadDate.getFullYear() ===
            year &&
          leadDate.getMonth() ===
            month
      ).length


    result.push({

      key,

      label,

      count

    })

  }


  return result
}


// ============================================================
// FORMAT LABEL
// ============================================================

function formatLabel(

  value: string

) {

  return value
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    )

}


// ============================================================
// FORMAT DATE
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
  ).format(
    date
  )

}