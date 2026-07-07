import Link from "next/link"

import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  FileEdit,
  Mail,
  MailCheck,
  MousePointerClick,
  Plus,
  Search,
  Send,
  Users,
  XCircle,
} from "lucide-react"

import prisma from "@/shared/lib/prisma"

import type {
  NewsletterAudience,
  NewsletterStatus,
} from "@prisma/client"

/* =========================================================
   TYPES
========================================================= */

type NewsletterPageProps = {
  searchParams: Promise<{
    search?: string
    status?: string
    page?: string
  }>
}

/* =========================================================
   CONSTANTS
========================================================= */

const PAGE_SIZE = 10

const STATUS_OPTIONS: Array<{
  value: NewsletterStatus | "all"
  label: string
}> = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "scheduled",
    label: "Scheduled",
  },
  {
    value: "queued",
    label: "Queued",
  },
  {
    value: "sending",
    label: "Sending",
  },
  {
    value: "sent",
    label: "Sent",
  },
  {
    value: "partially_failed",
    label: "Partially Failed",
  },
  {
    value: "failed",
    label: "Failed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
]

/* =========================================================
   HELPERS
========================================================= */

function formatDate(
  date: Date | null
) {
  if (!date) {
    return "—"
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(date)
}

function formatNumber(
  value: number
) {
  return new Intl.NumberFormat(
    "en-US"
  ).format(value)
}

function calculateRate(
  numerator: number,
  denominator: number
) {
  if (denominator <= 0) {
    return 0
  }

  return Math.round(
    (numerator / denominator) *
      100
  )
}

function getStatusClasses(
  status: NewsletterStatus
) {
  switch (status) {
    case "draft":
      return "border-slate-200 bg-slate-50 text-slate-700"

    case "scheduled":
      return "border-blue-200 bg-blue-50 text-blue-700"

    case "queued":
      return "border-blue-200 bg-blue-50 text-blue-700"

    case "sending":
      return "border-orange-200 bg-orange-50 text-orange-700"

    case "sent":
      return "border-green-200 bg-green-50 text-green-700"

    case "partially_failed":
      return "border-orange-200 bg-orange-50 text-orange-700"

    case "failed":
      return "border-red-200 bg-red-50 text-red-700"

    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700"

    default:
      return "border-slate-200 bg-slate-50 text-slate-700"
  }
}

function getStatusIcon(
  status: NewsletterStatus
) {
  switch (status) {
    case "draft":
      return FileEdit

    case "scheduled":
      return CalendarClock

    case "queued":
      return Clock3

    case "sending":
      return Send

    case "sent":
      return CheckCircle2

    case "partially_failed":
      return XCircle

    case "failed":
      return XCircle

    case "cancelled":
      return XCircle

    default:
      return Mail
  }
}

function formatAudience(
  audience: NewsletterAudience
) {
  const labels: Record<NewsletterAudience, string> = {
    all: "All Contacts",
    prospects: "Prospects",
    customers: "Customers",
    trial: "Trial Customers",
    inactive: "Inactive Customers",
  }

  return labels[audience]
}

/* =========================================================
   PAGE
========================================================= */

export default async function MarketingNewsletterPage({
  searchParams,
}: NewsletterPageProps) {
  const params =
    await searchParams

  const search =
    params.search?.trim() ?? ""

  const requestedStatus =
    params.status?.trim() ?? "all"

  const validStatus =
    STATUS_OPTIONS.some(
      (option) =>
        option.value ===
        requestedStatus
    )
      ? requestedStatus
      : "all"

  const requestedPage =
    Number(params.page ?? "1")

  const currentPage =
    Number.isFinite(requestedPage) &&
    requestedPage > 0
      ? Math.floor(requestedPage)
      : 1

  /* =======================================================
     FILTER
  ======================================================= */

  const where = {
    ...(search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              subject: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),

    ...(validStatus !== "all"
      ? {
          status:
            validStatus as NewsletterStatus,
        }
      : {}),
  }

  /* =======================================================
     DATABASE QUERIES
  ======================================================= */

  const [
    newsletters,
    totalFiltered,
    totalNewsletters,
    draftCount,
    scheduledCount,
    sentCount,
    aggregate,
  ] = await Promise.all([
    prisma.marketingNewsletter.findMany({
      where,

      orderBy: {
        createdAt: "desc",
      },

      skip:
        (currentPage - 1) *
        PAGE_SIZE,

      take: PAGE_SIZE,

      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),

    prisma.marketingNewsletter.count({
      where,
    }),

    prisma.marketingNewsletter.count(),

    prisma.marketingNewsletter.count({
      where: {
        status: "draft",
      },
    }),

    prisma.marketingNewsletter.count({
      where: {
        status: "scheduled",
      },
    }),

    prisma.marketingNewsletter.count({
      where: {
        status: "sent",
      },
    }),

    prisma.marketingNewsletter.aggregate({
      _sum: {
        recipientCount: true,
        sentCount: true,
        openedCount: true,
        clickedCount: true,
      },
    }),
  ])

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalFiltered / PAGE_SIZE
    )
  )

  const totalRecipients =
    aggregate._sum
      .recipientCount ?? 0

  const totalSent =
    aggregate._sum
      .sentCount ?? 0

  const totalOpened =
    aggregate._sum
      .openedCount ?? 0

  const totalClicked =
    aggregate._sum
      .clickedCount ?? 0

  const openRate =
    calculateRate(
      totalOpened,
      totalSent
    )

  const clickRate =
    calculateRate(
      totalClicked,
      totalSent
    )

  /* =======================================================
     QUERY STRING BUILDER
  ======================================================= */

  function buildPageUrl(
    page: number
  ) {
    const query =
      new URLSearchParams()

    if (search) {
      query.set(
        "search",
        search
      )
    }

    if (
      validStatus !== "all"
    ) {
      query.set(
        "status",
        validStatus
      )
    }

    query.set(
      "page",
      String(page)
    )

    return `/admin/marketing/newsletter?${query.toString()}`
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="
        flex
        flex-col
        gap-4
        lg:flex-row
        lg:items-center
        lg:justify-between
      ">
        <div>
          <p className="
            text-sm
            font-medium
            text-slate-500
          ">
            Marketing
          </p>

          <h1 className="
            mt-1
            text-3xl
            font-bold
            tracking-tight
            text-slate-950
          ">
            Newsletter
          </h1>

          <p className="
            mt-2
            max-w-2xl
            text-sm
            text-slate-500
          ">
            Create, schedule, and track
            newsletters for prospects,
            demo leads, and customers.
          </p>
        </div>

        <Link
          href="/admin/marketing/newsletter/new"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
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
          <Plus className="h-4 w-4" />

          Create Newsletter
        </Link>
      </div>

      {/* =================================================
          KPI CARDS
      ================================================= */}

      <div className="
        grid
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      ">
        <MetricCard
          title="Total Newsletters"
          value={formatNumber(
            totalNewsletters
          )}
          description={`${draftCount} drafts`}
          icon={Mail}
        />

        <MetricCard
          title="Scheduled"
          value={formatNumber(
            scheduledCount
          )}
          description="Waiting to send"
          icon={Clock3}
        />

        <MetricCard
          title="Sent"
          value={formatNumber(
            sentCount
          )}
          description={`${formatNumber(
            totalRecipients
          )} recipients`}
          icon={MailCheck}
        />

        <MetricCard
          title="Average Open Rate"
          value={`${openRate}%`}
          description={`${clickRate}% click rate`}
          icon={Eye}
        />
      </div>

      {/* =================================================
          PERFORMANCE SUMMARY
      ================================================= */}

      <div className="
        grid
        gap-4
        md:grid-cols-2
        xl:grid-cols-4
      ">
        <PerformanceCard
          title="Recipients"
          value={totalRecipients}
          icon={Users}
        />

        <PerformanceCard
          title="Sent"
          value={totalSent}
          icon={MailCheck}
        />

        <PerformanceCard
          title="Opened"
          value={totalOpened}
          icon={Eye}
        />

        <PerformanceCard
          title="Clicked"
          value={totalClicked}
          icon={MousePointerClick}
        />
      </div>

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
      ">
        {/* FILTER HEADER */}

        <div className="
          border-b
          border-slate-200
          p-5
        ">
          <div className="
            flex
            flex-col
            gap-4
            xl:flex-row
            xl:items-center
            xl:justify-between
          ">
            <div>
              <h2 className="
                text-lg
                font-bold
                text-slate-950
              ">
                Newsletter Campaigns
              </h2>

              <p className="
                mt-1
                text-sm
                text-slate-500
              ">
                {formatNumber(
                  totalFiltered
                )} newsletter
                {totalFiltered === 1
                  ? ""
                  : "s"}{" "}
                found
              </p>
            </div>

            <form
              className="
                flex
                w-full
                max-w-xl
                items-center
                gap-2
              "
            >
              {validStatus !== "all" && (
                <input
                  type="hidden"
                  name="status"
                  value={validStatus}
                />
              )}

              <div className="
                relative
                flex-1
              ">
                <Search className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                " />

                <input
                  type="search"
                  name="search"
                  defaultValue={search}
                  placeholder="Search newsletters..."
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    pl-10
                    pr-4
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-50
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  h-11
                  rounded-xl
                  bg-blue-600
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                Search
              </button>
            </form>
          </div>

          {/* STATUS FILTERS */}

          <div className="
            mt-5
            flex
            flex-wrap
            gap-2
          ">
            {STATUS_OPTIONS.map(
              (option) => {
                const active =
                  validStatus ===
                  option.value

                const query =
                  new URLSearchParams()

                if (search) {
                  query.set(
                    "search",
                    search
                  )
                }

                if (
                  option.value !==
                  "all"
                ) {
                  query.set(
                    "status",
                    option.value
                  )
                }

                return (
                  <Link
                    key={option.value}
                    href={`/admin/marketing/newsletter?${query.toString()}`}
                    className={`
                      rounded-lg
                      border
                      px-3
                      py-1.5
                      text-sm
                      font-medium
                      transition
                      ${
                        active
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }
                    `}
                  >
                    {option.label}
                  </Link>
                )
              }
            )}
          </div>
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {newsletters.length === 0 ? (
          <div className="
            flex
            min-h-[360px]
            flex-col
            items-center
            justify-center
            px-6
            text-center
          ">
            <div className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
            ">
              <Mail className="
                h-7
                w-7
                text-blue-600
              " />
            </div>

            <h3 className="
              mt-4
              text-lg
              font-bold
              text-slate-950
            ">
              No newsletters found
            </h3>

            <p className="
              mt-2
              max-w-md
              text-sm
              leading-6
              text-slate-500
            ">
              Create your first newsletter
              to communicate with leads,
              prospects, and customers.
            </p>

            <Link
              href="/admin/marketing/newsletter/new"
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-xl
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
              <Plus className="h-4 w-4" />

              Create First Newsletter
            </Link>
          </div>
        ) : (
          <>
            {/* =================================================
                NEWSLETTER LIST
            ================================================= */}

            <div className="
              divide-y
              divide-slate-100
            ">
              {newsletters.map(
                (newsletter) => {
                  const StatusIcon =
                    getStatusIcon(
                      newsletter.status
                    )

                  const newsletterOpenRate =
                    calculateRate(
                      newsletter.openedCount,
                      newsletter.sentCount
                    )

                  const newsletterClickRate =
                    calculateRate(
                      newsletter.clickedCount,
                      newsletter.sentCount
                    )

                  return (
                    <div
                      key={newsletter.id}
                      className="
                        p-5
                        transition
                        hover:bg-slate-50/70
                      "
                    >
                      <div className="
                        flex
                        flex-col
                        gap-5
                        xl:flex-row
                        xl:items-center
                        xl:justify-between
                      ">
                        {/* LEFT */}

                        <div className="
                          flex
                          min-w-0
                          items-start
                          gap-4
                        ">
                          <div className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-50
                          ">
                            <Mail className="
                              h-5
                              w-5
                              text-blue-600
                            " />
                          </div>

                          <div className="min-w-0">
                            <div className="
                              flex
                              flex-wrap
                              items-center
                              gap-2
                            ">
                              <Link
                                href={`/admin/marketing/newsletter/${newsletter.id}`}
                                className="
                                  truncate
                                  font-bold
                                  text-slate-950
                                  transition
                                  hover:text-blue-600
                                "
                              >
                                {
                                  newsletter.title
                                }
                              </Link>

                              <span
                                className={`
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  rounded-full
                                  border
                                  px-2.5
                                  py-1
                                  text-xs
                                  font-semibold
                                  ${getStatusClasses(
                                    newsletter.status
                                  )}
                                `}
                              >
                                <StatusIcon className="h-3.5 w-3.5" />

                                {newsletter.status
                                  .charAt(0)
                                  .toUpperCase() +
                                  newsletter.status.slice(
                                    1
                                  )}
                              </span>
                            </div>

                            <p className="
                              mt-1
                              truncate
                              text-sm
                              text-slate-600
                            ">
                              {
                                newsletter.subject
                              }
                            </p>

                            <div className="
                              mt-2
                              flex
                              flex-wrap
                              items-center
                              gap-x-4
                              gap-y-1
                              text-xs
                              text-slate-500
                            ">
                              <span className="
                                inline-flex
                                items-center
                                gap-1.5
                              ">
                                <Users className="h-3.5 w-3.5" />

                                {formatAudience(newsletter.audience)}
                              </span>

                              <span>
                                Created{" "}
                                {formatDate(
                                  newsletter.createdAt
                                )}
                              </span>

                              {newsletter.createdBy && (
                                <span>
                                  by{" "}
                                  {
                                    newsletter
                                      .createdBy
                                      .name
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* METRICS */}

                        <div className="
                          grid
                          grid-cols-2
                          gap-3
                          sm:grid-cols-4
                          xl:min-w-[470px]
                        ">
                          <SmallMetric
                            label="Recipients"
                            value={formatNumber(
                              newsletter.recipientCount
                            )}
                          />

                          <SmallMetric
                            label="Delivered"
                            value={formatNumber(
                              newsletter.sentCount
                            )}
                          />

                          <SmallMetric
                            label="Open Rate"
                            value={`${newsletterOpenRate}%`}
                          />

                          <SmallMetric
                            label="Click Rate"
                            value={`${newsletterClickRate}%`}
                          />
                        </div>

                        {/* ACTION */}

                        <Link
                          href={`/admin/marketing/newsletter/${newsletter.id}`}
                          className="
                            inline-flex
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-blue-200
                            bg-blue-50
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-blue-700
                            transition
                            hover:bg-blue-100
                          "
                        >
                          View

                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>

                      {/* SCHEDULE / SENT INFO */}

                      {(newsletter.scheduledAt ||
                        newsletter.sentAt) && (
                        <div className="
                          mt-4
                          flex
                          flex-wrap
                          gap-3
                          border-t
                          border-slate-100
                          pt-4
                          text-xs
                          text-slate-500
                        ">
                          {newsletter.scheduledAt && (
                            <span className="
                              inline-flex
                              items-center
                              gap-1.5
                            ">
                              <CalendarClock className="h-3.5 w-3.5" />

                              Scheduled:{" "}
                              {formatDate(
                                newsletter.scheduledAt
                              )}
                            </span>
                          )}

                          {newsletter.sentAt && (
                            <span className="
                              inline-flex
                              items-center
                              gap-1.5
                            ">
                              <CheckCircle2 className="h-3.5 w-3.5" />

                              Sent:{" "}
                              {formatDate(
                                newsletter.sentAt
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                }
              )}
            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            <div className="
              flex
              flex-col
              gap-3
              border-t
              border-slate-200
              px-5
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            ">
              <p className="
                text-sm
                text-slate-500
              ">
                Page {currentPage} of{" "}
                {totalPages}
              </p>

              <div className="
                flex
                items-center
                gap-2
              ">
                {currentPage > 1 ? (
                  <Link
                    href={buildPageUrl(
                      currentPage - 1
                    )}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-slate-700
                      transition
                      hover:bg-slate-50
                    "
                  >
                    <ChevronLeft className="h-4 w-4" />

                    Previous
                  </Link>
                ) : (
                  <span className="
                    inline-flex
                    cursor-not-allowed
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-slate-400
                  ">
                    <ChevronLeft className="h-4 w-4" />

                    Previous
                  </span>
                )}

                {currentPage <
                totalPages ? (
                  <Link
                    href={buildPageUrl(
                      currentPage + 1
                    )}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border
                      border-blue-200
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
                    Next

                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="
                    inline-flex
                    cursor-not-allowed
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-slate-400
                  ">
                    Next

                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ComponentType<{
    className?: string
  }>
}) {
  return (
    <div className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-5
    ">
      <div className="
        flex
        items-start
        justify-between
        gap-4
      ">
        <div>
          <p className="
            text-sm
            font-medium
            text-slate-500
          ">
            {title}
          </p>

          <p className="
            mt-2
            text-3xl
            font-bold
            tracking-tight
            text-slate-950
          ">
            {value}
          </p>

          <p className="
            mt-1
            text-xs
            text-slate-500
          ">
            {description}
          </p>
        </div>

        <div className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-blue-50
        ">
          <Icon className="
            h-5
            w-5
            text-blue-600
          " />
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   PERFORMANCE CARD
========================================================= */

function PerformanceCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: number
  icon: React.ComponentType<{
    className?: string
  }>
}) {
  return (
    <div className="
      flex
      items-center
      gap-4
      rounded-xl
      border
      border-slate-200
      bg-white
      p-4
    ">
      <div className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        bg-green-50
      ">
        <Icon className="
          h-5
          w-5
          text-green-600
        " />
      </div>

      <div>
        <p className="
          text-xs
          font-medium
          text-slate-500
        ">
          {title}
        </p>

        <p className="
          mt-0.5
          text-xl
          font-bold
          text-slate-950
        ">
          {formatNumber(value)}
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   SMALL METRIC
========================================================= */

function SmallMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="
      rounded-xl
      bg-slate-50
      px-3
      py-2.5
    ">
      <p className="
        text-xs
        text-slate-500
      ">
        {label}
      </p>

      <p className="
        mt-1
        text-sm
        font-bold
        text-slate-950
      ">
        {value}
      </p>
    </div>
  )
}