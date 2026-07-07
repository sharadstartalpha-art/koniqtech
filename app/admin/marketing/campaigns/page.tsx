import Link from "next/link"

import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  Eye,
  Megaphone,
  Plus,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"

import prisma from "@/shared/lib/prisma"

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }
  ).format(value)
}

function formatDate(
  value: Date | null
) {
  if (!value) {
    return "Not set"
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(value)
}

function formatLabel(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    )
}

function getConversionRate(
  leads: number,
  conversions: number
) {
  if (leads === 0) {
    return 0
  }

  return (
    (conversions / leads) *
    100
  )
}

function getStatusClasses(
  status: string
) {
  const normalized =
    status.toLowerCase()

  if (
    normalized === "active" ||
    normalized === "running"
  ) {
    return `
      border-green-200
      bg-green-50
      text-green-700
    `
  }

  if (
    normalized === "draft"
  ) {
    return `
      border-slate-200
      bg-slate-50
      text-slate-700
    `
  }

  if (
    normalized === "paused"
  ) {
    return `
      border-orange-200
      bg-orange-50
      text-orange-700
    `
  }

  if (
    normalized === "completed"
  ) {
    return `
      border-blue-200
      bg-blue-50
      text-blue-700
    `
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return `
      border-red-200
      bg-red-50
      text-red-700
    `
  }

  return `
    border-slate-200
    bg-slate-50
    text-slate-700
  `
}

function getChannelClasses(
  channel: string
) {
  const normalized =
    channel.toLowerCase()

  if (
    normalized.includes("email")
  ) {
    return `
      bg-blue-50
      text-blue-700
    `
  }

  if (
    normalized.includes("social")
  ) {
    return `
      bg-violet-50
      text-violet-700
    `
  }

  if (
    normalized.includes("sms")
  ) {
    return `
      bg-green-50
      text-green-700
    `
  }

  if (
    normalized.includes("paid") ||
    normalized.includes("ads")
  ) {
    return `
      bg-orange-50
      text-orange-700
    `
  }

  return `
    bg-slate-100
    text-slate-700
  `
}

/* =========================================================
   PAGE
========================================================= */

export default async function MarketingCampaignsPage() {
  /* =======================================================
     DATABASE
  ======================================================= */

  const campaigns =
    await prisma.marketingCampaign.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const totalCampaigns =
    campaigns.length

  const totalBudget =
    campaigns.reduce(
      (sum, campaign) =>
        sum +
        Number(
          campaign.budget ?? 0
        ),
      0
    )

  const totalLeads =
    campaigns.reduce(
      (sum, campaign) =>
        sum + campaign.leads,
      0
    )

  const totalConversions =
    campaigns.reduce(
      (sum, campaign) =>
        sum +
        campaign.conversions,
      0
    )

  const overallConversionRate =
    getConversionRate(
      totalLeads,
      totalConversions
    )

  const statusCounts =
    campaigns.reduce<
      Record<string, number>
    >(
      (result, campaign) => {
        const status = String(
          campaign.status
        )

        result[status] =
          (result[status] ?? 0) +
          1

        return result
      },
      {}
    )

  const activeCampaigns =
    campaigns.filter(
      (campaign) => {
        const status = String(
          campaign.status
        ).toLowerCase()

        return (
          status === "active" ||
          status === "running"
        )
      }
    ).length

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-8">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>
              Marketing
            </span>

            <ArrowRight className="h-3.5 w-3.5" />

            <span className="font-medium text-slate-700">
              Campaigns
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Marketing Campaigns
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Create, monitor, and analyze campaigns that generate qualified leads and customer conversions.
          </p>
        </div>

        <Link
          href="/admin/marketing/campaigns/new"
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-green-600
            px-5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-green-700
          "
        >
          <Plus className="h-4 w-4" />

          New Campaign
        </Link>
      </div>

      {/* ===================================================
          KPI CARDS
      =================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Campaigns"
          value={String(
            totalCampaigns
          )}
          subtitle={`${activeCampaigns} currently active`}
          icon={
            <Megaphone className="h-5 w-5" />
          }
          iconClassName="bg-blue-50 text-blue-600"
        />

        <MetricCard
          title="Campaign Budget"
          value={formatCurrency(
            totalBudget
          )}
          subtitle="Total planned spend"
          icon={
            <CircleDollarSign className="h-5 w-5" />
          }
          iconClassName="bg-green-50 text-green-600"
        />

        <MetricCard
          title="Leads Generated"
          value={totalLeads.toLocaleString()}
          subtitle="Across all campaigns"
          icon={
            <Users className="h-5 w-5" />
          }
          iconClassName="bg-orange-50 text-orange-600"
        />

        <MetricCard
          title="Conversion Rate"
          value={`${overallConversionRate.toFixed(
            1
          )}%`}
          subtitle={`${totalConversions} total conversions`}
          icon={
            <TrendingUp className="h-5 w-5" />
          }
          iconClassName="bg-violet-50 text-violet-600"
        />
      </div>

      {/* ===================================================
          STATUS SUMMARY
      =================================================== */}

      {Object.keys(
        statusCounts
      ).length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-bold text-slate-950">
                Campaign Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current distribution of marketing campaigns.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.entries(
                statusCounts
              ).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className={`
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      ${getStatusClasses(
                        status
                      )}
                    `}
                  >
                    <span>
                      {formatLabel(
                        status
                      )}
                    </span>

                    <span className="rounded-full bg-white/80 px-1.5 py-0.5">
                      {count}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================
          CAMPAIGN LIST
      =================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-950">
              All Campaigns
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review campaign performance, lead generation, and conversion results.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
            <BarChart3 className="h-4 w-4" />

            {totalCampaigns} campaigns
          </div>
        </div>

        {campaigns.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-slate-100">
            {campaigns.map(
              (campaign) => {
                const conversionRate =
                  getConversionRate(
                    campaign.leads,
                    campaign.conversions
                  )

                return (
                  <div
                    key={campaign.id}
                    className="
                      group
                      px-6
                      py-5
                      transition
                      hover:bg-slate-50/80
                    "
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      {/* CAMPAIGN */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-bold text-slate-950">
                            {campaign.title}
                          </h3>

                          <span
                            className={`
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${getStatusClasses(
                                String(
                                  campaign.status
                                )
                              )}
                            `}
                          >
                            {formatLabel(
                              String(
                                campaign.status
                              )
                            )}
                          </span>

                          <span
                            className={`
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${getChannelClasses(
                                String(
                                  campaign.channel
                                )
                              )}
                            `}
                          >
                            {formatLabel(
                              String(
                                campaign.channel
                              )
                            )}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-slate-400" />

                            <span>
                              {formatDate(
                                campaign.startDate
                              )}
                            </span>

                            <span>
                              →
                            </span>

                            <span>
                              {formatDate(
                                campaign.endDate
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <CircleDollarSign className="h-4 w-4 text-slate-400" />

                            <span>
                              {campaign.budget
                                ? formatCurrency(
                                    Number(
                                      campaign.budget
                                    )
                                  )
                                : "No budget"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* METRICS */}

                      <div className="grid grid-cols-3 gap-3 sm:min-w-[390px]">
                        <CampaignMetric
                          label="Leads"
                          value={campaign.leads.toLocaleString()}
                        />

                        <CampaignMetric
                          label="Conversions"
                          value={campaign.conversions.toLocaleString()}
                        />

                        <CampaignMetric
                          label="Rate"
                          value={`${conversionRate.toFixed(
                            1
                          )}%`}
                        />
                      </div>

                      {/* ACTION */}

                      <div className="flex items-center">
                        <Link
                          href={`/admin/marketing/campaigns/${campaign.id}`}
                          className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-blue-200
                            bg-blue-50
                            px-4
                            text-sm
                            font-semibold
                            text-blue-700
                            transition
                            hover:border-blue-300
                            hover:bg-blue-100
                          "
                        >
                          <Eye className="h-4 w-4" />

                          View
                        </Link>
                      </div>
                    </div>

                    {/* CONVERSION PROGRESS */}

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-500">
                          Conversion performance
                        </span>

                        <span className="font-semibold text-slate-700">
                          {conversionRate.toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-green-500 transition-all"
                          style={{
                            width: `${Math.min(
                              conversionRate,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              }
            )}
          </div>
        )}
      </section>
    </div>
  )
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconClassName,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  iconClassName: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {subtitle}
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
          {icon}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   CAMPAIGN METRIC
========================================================= */

function CampaignMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-950">
        {value}
      </p>
    </div>
  )
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
        <Target className="h-7 w-7" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-950">
        No campaigns yet
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Create your first marketing campaign to start tracking budget, leads, conversions, and overall performance.
      </p>

      <Link
        href="/admin/marketing/campaigns/new"
        className="
          mt-5
          inline-flex
          h-10
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-green-600
          px-4
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-green-700
        "
      >
        <Plus className="h-4 w-4" />

        Create Campaign
      </Link>
    </div>
  )
}