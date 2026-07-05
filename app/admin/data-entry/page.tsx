import Link from "next/link"

import {
  redirect
} from "next/navigation"

import {
  ArrowRight,
  Building2,
  CircleDollarSign,
  Clock3,
  Database,
  Mail,
  Phone,
  Plus,
  Search,
  UserCheck,
  Users
} from "lucide-react"

import {
  LeadStatus
} from "@prisma/client"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"


// ============================================================
// TYPES
// ============================================================

type DataEntryPageProps = {

  searchParams: Promise<{

    search?: string

    status?: string

    priority?: string

    source?: string

    page?: string

  }>

}


// ============================================================
// CONSTANTS
// ============================================================

const PAGE_SIZE =
  20


const LEAD_STATUS_VALUES =
  Object.values(
    LeadStatus
  )


// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_CONFIG: Record<
  LeadStatus,
  {
    label: string
    className: string
  }
> = {

  new: {

    label:
      "New",

    className:
      "border-blue-200 bg-blue-50 text-blue-700"

  },


  contacted: {

    label:
      "Contacted",

    className:
      "border-orange-200 bg-orange-50 text-orange-700"

  },


  estimate: {

    label:
      "Estimate",

    className:
      "border-violet-200 bg-violet-50 text-violet-700"

  },


  won: {

    label:
      "Won",

    className:
      "border-green-200 bg-green-50 text-green-700"

  },


  lost: {

    label:
      "Lost",

    className:
      "border-red-200 bg-red-50 text-red-700"

  },


  converted: {

    label:
      "Converted",

    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700"

  }

}


// ============================================================
// PRIORITY STYLES
// ============================================================

const PRIORITY_STYLES:
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


// ============================================================
// CURRENCY FORMATTER
// ============================================================

function formatCurrency(
  value: number | null
) {

  if (
    value === null ||
    value === undefined
  ) {
    return "Not set"
  }


  return new Intl.NumberFormat(
    "en-US",
    {
      style:
        "currency",

      currency:
        "USD",

      maximumFractionDigits:
        0
    }
  ).format(value)
}


// ============================================================
// DATE FORMATTER
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


// ============================================================
// PAGE
// ============================================================

export default async function DataEntryPage({
  searchParams
}: DataEntryPageProps) {

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


  const search =
    params.search
      ?.trim() ??
    ""


  const statusParam =
    params.status ??
    ""


  const priority =
    params.priority ??
    ""


  const source =
    params.source ??
    ""


  const parsedPage =
    Number(
      params.page
    )


  const currentPage =
    Number.isInteger(parsedPage) &&
    parsedPage > 0
      ? parsedPage
      : 1


  // ----------------------------------------------------------
  // VALID STATUS
  // ----------------------------------------------------------

  const selectedStatus =
    LEAD_STATUS_VALUES.includes(
      statusParam as LeadStatus
    )
      ? statusParam as LeadStatus
      : undefined


  // ----------------------------------------------------------
  // WHERE
  // ----------------------------------------------------------

  const where = {

    orgId,


    ...(selectedStatus
      ? {

          status:
            selectedStatus

        }
      : {}),


    ...(priority
      ? {

          priority

        }
      : {}),


    ...(source
      ? {

          source

        }
      : {}),


    ...(search
      ? {

          OR: [

            {

              firstName: {

                contains:
                  search,

                mode:
                  "insensitive" as const

              }

            },


            {

              lastName: {

                contains:
                  search,

                mode:
                  "insensitive" as const

              }

            },


            {

              email: {

                contains:
                  search,

                mode:
                  "insensitive" as const

              }

            },


            {

              phone: {

                contains:
                  search,

                mode:
                  "insensitive" as const

              }

            },


            {

              companyName: {

                contains:
                  search,

                mode:
                  "insensitive" as const

              }

            }

          ]

        }
      : {})

  }


  // ----------------------------------------------------------
  // LOAD DATA
  // ----------------------------------------------------------

  const [
    leads,
    totalLeads,
    newCount,
    contactedCount,
    convertedCount,
    sources
  ] =
    await Promise.all([

      prisma.lead.findMany({

        where,

        orderBy: {

          createdAt:
            "desc"

        },

        skip:
          (currentPage - 1) *
          PAGE_SIZE,

        take:
          PAGE_SIZE,

        select: {

          id: true,

          firstName: true,

          lastName: true,

          email: true,

          phone: true,

          companyName: true,

          budget: true,

          priority: true,

          source: true,

          industry: true,

          status: true,

          createdAt: true,


          assignee: {

            select: {

              id: true,

              name: true,

              email: true

            }

          },


          _count: {

            select: {

              notes:
                true,

              activities:
                true

            }

          }

        }

      }),


      prisma.lead.count({

        where

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


      prisma.lead.findMany({

        where: {

          orgId,

          source: {

            not:
              null

          }

        },

        distinct: [
          "source"
        ],

        orderBy: {

          source:
            "asc"

        },

        select: {

          source:
            true

        }

      })

    ])


  // ----------------------------------------------------------
  // PAGINATION
  // ----------------------------------------------------------

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalLeads /
        PAGE_SIZE
      )
    )


  const hasPrevious =
    currentPage > 1


  const hasNext =
    currentPage <
    totalPages


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
          lg:items-start
          lg:justify-between
        "
      >

        <div
          className="
            flex items-start gap-4
          "
        >

          <div
            className="
              flex h-12 w-12
              shrink-0
              items-center justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <Database className="h-6 w-6" />
          </div>


          <div>

            <h1
              className="
                text-2xl
                font-semibold
                tracking-tight
                text-slate-900
              "
            >
              Data Entry
            </h1>


            <p
              className="
                mt-1
                max-w-2xl
                text-sm leading-6
                text-slate-500
              "
            >
              Create, review, and maintain lead
              records before they move through the
              sales workflow.
            </p>

          </div>

        </div>


        <Link
          href="/admin/data-entry/new"
          className="
            inline-flex h-11
            items-center justify-center
            gap-2
            self-start
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
          <Plus className="h-4 w-4" />

          Add Lead
        </Link>

      </div>


      {/* ==================================================== */}
      {/* SUMMARY */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <SummaryCard
          title="Filtered Leads"
          value={
            totalLeads
          }
          description="Matching current filters"
          icon={Users}
          iconClassName="
            bg-blue-50
            text-blue-600
          "
        />


        <SummaryCard
          title="New Leads"
          value={
            newCount
          }
          description="Awaiting first action"
          icon={Clock3}
          iconClassName="
            bg-orange-50
            text-orange-600
          "
        />


        <SummaryCard
          title="Contacted"
          value={
            contactedCount
          }
          description="Initial contact completed"
          icon={Phone}
          iconClassName="
            bg-blue-50
            text-blue-600
          "
        />


        <SummaryCard
          title="Converted"
          value={
            convertedCount
          }
          description="Converted lead records"
          icon={UserCheck}
          iconClassName="
            bg-green-50
            text-green-600
          "
        />

      </div>


      {/* ==================================================== */}
      {/* FILTERS */}
      {/* ==================================================== */}

      <section
        className="
          rounded-xl
          border border-slate-200
          bg-white
          p-4
          shadow-sm
        "
      >

        <form
          method="GET"
          className="
            grid gap-3
            lg:grid-cols-[minmax(260px,1fr)_180px_180px_180px_auto]
          "
        >

          {/* SEARCH */}

          <div className="relative">

            <Search
              className="
                pointer-events-none
                absolute left-3 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-slate-400
              "
            />


            <input
              type="search"
              name="search"
              defaultValue={
                search
              }
              placeholder="Search name, email, phone or company..."
              className={`
                ${INPUT_CLASS}
                pl-10
              `}
            />

          </div>


          {/* STATUS */}

          <select
            name="status"
            defaultValue={
              statusParam
            }
            className={
              INPUT_CLASS
            }
          >

            <option value="">
              All statuses
            </option>


            {LEAD_STATUS_VALUES.map(
              (status) => (

                <option
                  key={status}
                  value={status}
                >
                  {
                    STATUS_CONFIG[
                      status
                    ].label
                  }
                </option>

              )
            )}

          </select>


          {/* PRIORITY */}

          <select
            name="priority"
            defaultValue={
              priority
            }
            className={
              INPUT_CLASS
            }
          >

            <option value="">
              All priorities
            </option>

            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>

            <option value="Urgent">
              Urgent
            </option>

          </select>


          {/* SOURCE */}

          <select
            name="source"
            defaultValue={
              source
            }
            className={
              INPUT_CLASS
            }
          >

            <option value="">
              All sources
            </option>


            {sources.map(
              (item) => (

                item.source && (

                  <option
                    key={
                      item.source
                    }
                    value={
                      item.source
                    }
                  >
                    {item.source}
                  </option>

                )

              )
            )}

          </select>


          {/* SUBMIT */}

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
            <Search className="h-4 w-4" />

            Filter
          </button>

        </form>


        {(search ||
          statusParam ||
          priority ||
          source) && (

          <div
            className="
              mt-3
              flex justify-end
            "
          >

            <Link
              href="/admin/data-entry"
              className="
                text-sm font-medium
                text-orange-600
                transition
                hover:text-orange-700
              "
            >
              Clear all filters
            </Link>

          </div>

        )}

      </section>


      {/* ==================================================== */}
      {/* TABLE */}
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

        {/* TABLE HEADER */}

        <div
          className="
            flex flex-col gap-2
            border-b border-slate-200
            px-5 py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <h2
              className="
                font-semibold
                text-slate-900
              "
            >
              Lead Records
            </h2>


            <p
              className="
                mt-0.5
                text-sm
                text-slate-500
              "
            >
              {totalLeads}{" "}
              {totalLeads === 1
                ? "record"
                : "records"}{" "}
              found
            </p>

          </div>


          <p
            className="
              text-xs
              text-slate-400
            "
          >
            Page {currentPage} of{" "}
            {totalPages}
          </p>

        </div>


        {leads.length === 0 ? (

          <EmptyState />

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

                  <TableHeader>
                    Lead
                  </TableHeader>

                  <TableHeader>
                    Contact
                  </TableHeader>

                  <TableHeader>
                    Source
                  </TableHeader>

                  <TableHeader>
                    Priority
                  </TableHeader>

                  <TableHeader>
                    Status
                  </TableHeader>

                  <TableHeader>
                    Assignee
                  </TableHeader>

                  <TableHeader>
                    Created
                  </TableHeader>

                  <TableHeader align="right">
                    Action
                  </TableHeader>

                </tr>

              </thead>


              <tbody
                className="
                  divide-y
                  divide-slate-100
                  bg-white
                "
              >

                {leads.map(
                  (lead) => {

                    const fullName =
                      [
                        lead.firstName,
                        lead.lastName
                      ]
                        .filter(Boolean)
                        .join(" ")
                        .trim()


                    const priorityLabel =
                      lead.priority ??
                      "Medium"


                    return (

                      <tr
                        key={
                          lead.id
                        }
                        className="
                          transition
                          hover:bg-slate-50/70
                        "
                      >

                        {/* LEAD */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                          "
                        >

                          <div
                            className="
                              flex items-center
                              gap-3
                            "
                          >

                            <div
                              className="
                                flex h-10 w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-50
                                text-sm font-semibold
                                text-blue-700
                              "
                            >
                              {
                                lead.firstName
                                  .charAt(0)
                                  .toUpperCase()
                              }

                              {
                                lead.lastName
                                  ?.charAt(0)
                                  .toUpperCase() ??
                                ""
                              }
                            </div>


                            <div>

                              <Link
                                href={
                                  `/admin/data-entry/${lead.id}`
                                }
                                className="
                                  text-sm font-semibold
                                  text-slate-900
                                  transition
                                  hover:text-blue-600
                                "
                              >
                                {fullName}
                              </Link>


                              <p
                                className="
                                  mt-0.5
                                  max-w-52
                                  truncate
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {
                                  lead.companyName ||
                                  "Individual lead"
                                }
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* CONTACT */}

                        <td
                          className="
                            px-5 py-4
                          "
                        >

                          <div className="space-y-1">

                            {lead.email ? (

                              <div
                                className="
                                  flex items-center gap-1.5
                                  text-xs text-slate-600
                                "
                              >
                                <Mail className="h-3.5 w-3.5" />

                                <span
                                  className="
                                    max-w-44 truncate
                                  "
                                >
                                  {lead.email}
                                </span>
                              </div>

                            ) : null}


                            {lead.phone ? (

                              <div
                                className="
                                  flex items-center gap-1.5
                                  text-xs text-slate-600
                                "
                              >
                                <Phone className="h-3.5 w-3.5" />

                                {lead.phone}
                              </div>

                            ) : null}


                            {!lead.email &&
                              !lead.phone && (

                              <span
                                className="
                                  text-xs
                                  text-slate-400
                                "
                              >
                                No contact details
                              </span>

                            )}

                          </div>

                        </td>


                        {/* SOURCE */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                          "
                        >

                          <div>

                            <p
                              className="
                                text-sm
                                text-slate-700
                              "
                            >
                              {
                                lead.source ||
                                "Not set"
                              }
                            </p>


                            {lead.industry && (

                              <p
                                className="
                                  mt-0.5
                                  text-xs
                                  text-slate-400
                                "
                              >
                                {
                                  formatLabel(
                                    lead.industry
                                  )
                                }
                              </p>

                            )}

                          </div>

                        </td>


                        {/* PRIORITY */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                          "
                        >

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              border
                              px-2.5 py-1
                              text-xs font-medium
                              ${
                                PRIORITY_STYLES[
                                  priorityLabel
                                ] ??
                                PRIORITY_STYLES.Medium
                              }
                            `}
                          >
                            {priorityLabel}
                          </span>

                        </td>


                        {/* STATUS */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                          "
                        >

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              border
                              px-2.5 py-1
                              text-xs font-medium
                              ${
                                STATUS_CONFIG[
                                  lead.status
                                ].className
                              }
                            `}
                          >
                            {
                              STATUS_CONFIG[
                                lead.status
                              ].label
                            }
                          </span>

                        </td>


                        {/* ASSIGNEE */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                          "
                        >

                          {lead.assignee ? (

                            <div>

                              <p
                                className="
                                  text-sm font-medium
                                  text-slate-700
                                "
                              >
                                {
                                  lead.assignee.name ||
                                  "Unnamed user"
                                }
                              </p>


                              <p
                                className="
                                  mt-0.5
                                  max-w-40 truncate
                                  text-xs
                                  text-slate-400
                                "
                              >
                                {lead.assignee.email}
                              </p>

                            </div>

                          ) : (

                            <span
                              className="
                                text-sm
                                text-orange-600
                              "
                            >
                              Unassigned
                            </span>

                          )}

                        </td>


                        {/* CREATED */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                            text-sm
                            text-slate-500
                          "
                        >
                          {
                            formatDate(
                              lead.createdAt
                            )
                          }
                        </td>


                        {/* ACTION */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                            text-right
                          "
                        >

                          <Link
                            href={
                              `/admin/data-entry/${lead.id}`
                            }
                            className="
                              inline-flex h-9
                              items-center justify-center
                              gap-1.5
                              rounded-lg
                              bg-blue-50
                              px-3
                              text-sm font-medium
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


        {/* ================================================== */}
        {/* PAGINATION */}
        {/* ================================================== */}

        {leads.length > 0 && (

          <div
            className="
              flex flex-col gap-3
              border-t border-slate-200
              bg-slate-50/50
              px-5 py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Showing{" "}
              {
                (currentPage - 1) *
                PAGE_SIZE +
                1
              }{" "}
              to{" "}
              {
                Math.min(
                  currentPage *
                    PAGE_SIZE,
                  totalLeads
                )
              }{" "}
              of {totalLeads}
            </p>


            <div
              className="
                flex items-center gap-2
              "
            >

              {hasPrevious ? (

                <Link
                  href={
                    createPageHref(
                      params,
                      currentPage - 1
                    )
                  }
                  className="
                    inline-flex h-9
                    items-center justify-center
                    rounded-lg
                    bg-orange-100
                    px-4
                    text-sm font-medium
                    text-orange-700
                    transition
                    hover:bg-orange-200
                  "
                >
                  Previous
                </Link>

              ) : (

                <span
                  className="
                    inline-flex h-9
                    items-center justify-center
                    rounded-lg
                    bg-slate-100
                    px-4
                    text-sm font-medium
                    text-slate-400
                  "
                >
                  Previous
                </span>

              )}


              {hasNext ? (

                <Link
                  href={
                    createPageHref(
                      params,
                      currentPage + 1
                    )
                  }
                  className="
                    inline-flex h-9
                    items-center justify-center
                    rounded-lg
                    bg-blue-600
                    px-4
                    text-sm font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  Next
                </Link>

              ) : (

                <span
                  className="
                    inline-flex h-9
                    items-center justify-center
                    rounded-lg
                    bg-slate-100
                    px-4
                    text-sm font-medium
                    text-slate-400
                  "
                >
                  Next
                </span>

              )}

            </div>

          </div>

        )}

      </section>

    </div>
  )
}


// ============================================================
// SUMMARY CARD
// ============================================================

type SummaryCardProps = {

  title: string

  value: number

  description: string

  icon: React.ComponentType<{
    className?: string
  }>

  iconClassName: string

}


function SummaryCard({
  title,
  value,
  description,
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
              text-2xl font-semibold
              tracking-tight
              text-slate-900
            "
          >
            {value}
          </p>


          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            {description}
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
// TABLE HEADER
// ============================================================

function TableHeader({
  children,
  align = "left"
}: {
  children: React.ReactNode

  align?: "left" | "right"
}) {

  return (
    <th
      scope="col"
      className={`
        whitespace-nowrap
        px-5 py-3
        text-xs font-semibold
        uppercase tracking-wide
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


// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState() {

  return (
    <div
      className="
        flex flex-col
        items-center
        px-6 py-16
        text-center
      "
    >

      <div
        className="
          flex h-14 w-14
          items-center justify-center
          rounded-xl
          bg-blue-50
          text-blue-600
        "
      >
        <Database className="h-7 w-7" />
      </div>


      <h3
        className="
          mt-4
          text-lg font-semibold
          text-slate-900
        "
      >
        No lead records found
      </h3>


      <p
        className="
          mt-2
          max-w-md
          text-sm leading-6
          text-slate-500
        "
      >
        No leads match the current filters.
        Clear the filters or create a new lead
        record.
      </p>


      <Link
        href="/admin/data-entry/new"
        className="
          mt-5
          inline-flex h-10
          items-center justify-center
          gap-2
          rounded-lg
          bg-green-600
          px-4
          text-sm font-medium
          text-white
          transition
          hover:bg-green-700
        "
      >
        <Plus className="h-4 w-4" />

        Add Lead
      </Link>

    </div>
  )
}


// ============================================================
// PAGE URL
// ============================================================

function createPageHref(
  params: {
    search?: string
    status?: string
    priority?: string
    source?: string
    page?: string
  },
  page: number
) {

  const query =
    new URLSearchParams()


  if (params.search) {

    query.set(
      "search",
      params.search
    )

  }


  if (params.status) {

    query.set(
      "status",
      params.status
    )

  }


  if (params.priority) {

    query.set(
      "priority",
      params.priority
    )

  }


  if (params.source) {

    query.set(
      "source",
      params.source
    )

  }


  query.set(
    "page",
    String(page)
  )


  return (
    `/admin/data-entry?${query.toString()}`
  )
}


// ============================================================
// LABEL FORMATTER
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
// INPUT CLASS
// ============================================================

const INPUT_CLASS = `
  h-11 w-full
  rounded-lg
  border border-slate-300
  bg-white
  px-3
  text-sm
  text-slate-900
  outline-none
  transition
  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-100
`