import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Filter,
  Mail,
  Megaphone,
  MessageSquare,
  MousePointerClick,
  Plus,
  Radio,
  Search,
  Target,
  TrendingUp,
  Users,
  Video,
} from "lucide-react"

import {
  CampaignChannel,
  CampaignStatus,
} from "@prisma/client"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   TYPES
========================================================= */

type CampaignsPageProps = {
  searchParams?: Promise<{
    search?: string
    status?: string
    channel?: string
  }>
}

/* =========================================================
   HELPERS
========================================================= */

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

function formatCurrency(
  value: {
    toString(): string
  } | null
) {
  if (!value) {
    return "—"
  }

  const amount =
    Number(value.toString())

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }
  ).format(amount)
}

function formatLabel(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    )
}

function calculateRate(
  conversions: number,
  leads: number
) {
  if (leads === 0) {
    return 0
  }

  return Math.round(
    (conversions / leads) * 100
  )
}

/* =========================================================
   STATUS STYLES
========================================================= */

function getStatusStyles(
  status: CampaignStatus
) {
  switch (status) {
    case CampaignStatus.running:
      return {
        badge:
          "border-green-200 bg-green-50 text-green-700",
        dot:
          "bg-green-500",
      }

    case CampaignStatus.paused:
      return {
        badge:
          "border-orange-200 bg-orange-50 text-orange-700",
        dot:
          "bg-orange-500",
      }

    case CampaignStatus.completed:
      return {
        badge:
          "border-blue-200 bg-blue-50 text-blue-700",
        dot:
          "bg-blue-500",
      }

    case CampaignStatus.cancelled:
      return {
        badge:
          "border-red-200 bg-red-50 text-red-700",
        dot:
          "bg-red-500",
      }

    default:
      return {
        badge:
          "border-slate-200 bg-slate-50 text-slate-700",
        dot:
          "bg-slate-400",
      }
  }
}

/* =========================================================
   CHANNEL ICON
========================================================= */

function ChannelIcon({
  channel,
}: {
  channel: CampaignChannel
}) {
  const className =
    "h-5 w-5"

  switch (channel) {
    case CampaignChannel.email:
      return (
        <Mail
          className={className}
        />
      )

    case CampaignChannel.social:
      return (
        <Radio
          className={className}
        />
      )

    case CampaignChannel.ads:
      return (
        <MousePointerClick
          className={className}
        />
      )

    case CampaignChannel.sms:
      return (
        <MessageSquare
          className={className}
        />
      )

    case CampaignChannel.webinar:
      return (
        <Video
          className={className}
        />
      )

    default:
      return (
        <Megaphone
          className={className}
        />
      )
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function MarketingCampaignsPage({
  searchParams,
}: CampaignsPageProps) {
  /* =======================================================
     AUTH
  ======================================================= */

  const session =
    await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const orgId =
    session.user.orgId

  if (!orgId) {
    redirect("/login")
  }

  /* =======================================================
     SEARCH PARAMS
  ======================================================= */

  const params =
    searchParams
      ? await searchParams
      : {}

  const search =
    params.search?.trim() || ""

  const statusFilter =
    params.status || "all"

  const channelFilter =
    params.channel || "all"

  /* =======================================================
     VALIDATE ENUM FILTERS
  ======================================================= */

  const validStatus =
    Object.values(
      CampaignStatus
    ).includes(
      statusFilter as CampaignStatus
    )
      ? (statusFilter as CampaignStatus)
      : null

  const validChannel =
    Object.values(
      CampaignChannel
    ).includes(
      channelFilter as CampaignChannel
    )
      ? (channelFilter as CampaignChannel)
      : null

  /* =======================================================
     QUERY
  ======================================================= */

  const campaigns =
    await prisma.marketingCampaign.findMany({
      where: {
        orgId,

        ...(search
          ? {
              title: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {}),

        ...(validStatus
          ? {
              status:
                validStatus,
            }
          : {}),

        ...(validChannel
          ? {
              channel:
                validChannel,
            }
          : {}),
      },

      select: {
        id: true,

        title: true,

        channel: true,

        budget: true,

        startDate: true,

        endDate: true,

        status: true,

        leads: true,

        conversions: true,

        createdAt: true,

        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        campaignLeads: {
          select: {
            id: true,
            converted: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    })

  /* =======================================================
     NORMALIZED DATA

     Relation table is the source of truth.
     Integer fields remain useful as cached counters.
  ======================================================= */

  const normalizedCampaigns =
    campaigns.map(
      (campaign) => {
        const actualLeads =
          campaign.campaignLeads.length

        const actualConversions =
          campaign.campaignLeads.filter(
            (lead) =>
              lead.converted
          ).length

        return {
          ...campaign,

          actualLeads,

          actualConversions,

          conversionRate:
            calculateRate(
              actualConversions,
              actualLeads
            ),
        }
      }
    )

  /* =======================================================
     SUMMARY
  ======================================================= */

  const totalCampaigns =
    normalizedCampaigns.length

  const activeCampaigns =
    normalizedCampaigns.filter(
      (campaign) =>
        campaign.status ===
        CampaignStatus.running
    ).length

  const totalLeads =
    normalizedCampaigns.reduce(
      (total, campaign) =>
        total +
        campaign.actualLeads,
      0
    )

  const totalConversions =
    normalizedCampaigns.reduce(
      (total, campaign) =>
        total +
        campaign.actualConversions,
      0
    )

  const overallConversionRate =
    calculateRate(
      totalConversions,
      totalLeads
    )

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="mx-auto max-w-[1600px] space-y-7 p-6 lg:p-8">
        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <Megaphone className="h-4 w-4" />

              Marketing
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Campaigns
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Create and monitor
              marketing campaigns,
              attribute company leads,
              and track campaign
              conversions.
            </p>
          </div>

          <Link
            href="/admin/marketing/campaigns/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />

            New Campaign
          </Link>
        </div>

        {/* ===============================================
            SUMMARY CARDS
        =============================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Megaphone className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Total
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-950">
              {totalCampaigns}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Campaigns
            </p>
          </div>

          {/* ACTIVE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-green-600">
                Live
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-950">
              {activeCampaigns}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Running campaigns
            </p>
          </div>

          {/* LEADS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Users className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Attributed
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-950">
              {totalLeads}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Campaign leads
            </p>
          </div>

          {/* CONVERSIONS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Target className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Converted
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-950">
              {totalConversions}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Conversions
            </p>
          </div>

          {/* RATE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Target className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Overall
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-950">
              {overallConversionRate}%
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Conversion rate
            </p>
          </div>
        </div>

        {/* ===============================================
            FILTERS
        =============================================== */}

        <form
          method="GET"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* SEARCH */}

            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search campaigns..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* STATUS */}

            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                name="status"
                defaultValue={
                  statusFilter
                }
                className="h-11 min-w-[180px] appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              >
                <option value="all">
                  All statuses
                </option>

                {Object.values(
                  CampaignStatus
                ).map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {formatLabel(
                      status
                    )}
                  </option>
                ))}
              </select>
            </div>

            {/* CHANNEL */}

            <select
              name="channel"
              defaultValue={
                channelFilter
              }
              className="h-11 min-w-[180px] rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            >
              <option value="all">
                All channels
              </option>

              {Object.values(
                CampaignChannel
              ).map((channel) => (
                <option
                  key={channel}
                  value={channel}
                >
                  {formatLabel(
                    channel
                  )}
                </option>
              ))}
            </select>

            {/* APPLY */}

            <button
              type="submit"
              className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Apply Filters
            </button>

            {/* CLEAR */}

            {(search ||
              validStatus ||
              validChannel) && (
              <Link
                href="/admin/marketing/campaigns"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 px-5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
              >
                Clear
              </Link>
            )}
          </div>
        </form>

        {/* ===============================================
            CAMPAIGN LIST
        =============================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* TABLE HEADER */}

          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-950">
                  Marketing Campaigns
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {normalizedCampaigns.length}{" "}
                  campaign
                  {normalizedCampaigns.length ===
                  1
                    ? ""
                    : "s"}{" "}
                  found
                </p>
              </div>

              <Link
                href="/admin/marketing/campaigns/new"
                className="hidden items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100 sm:inline-flex"
              >
                <Plus className="h-4 w-4" />

                Create
              </Link>
            </div>
          </div>

          {/* EMPTY STATE */}

          {normalizedCampaigns.length ===
          0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Megaphone className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-950">
                No campaigns found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first
                marketing campaign or
                change the current
                search filters.
              </p>

              <Link
                href="/admin/marketing/campaigns/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />

                New Campaign
              </Link>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-left">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Campaign
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Schedule
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Budget
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Leads
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Conversion
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {normalizedCampaigns.map(
                      (campaign) => {
                        const styles =
                          getStatusStyles(
                            campaign.status
                          )

                        return (
                          <tr
                            key={
                              campaign.id
                            }
                            className="transition hover:bg-slate-50/70"
                          >
                            {/* CAMPAIGN */}

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                  <ChannelIcon
                                    channel={
                                      campaign.channel
                                    }
                                  />
                                </div>

                                <div>
                                  <Link
                                    href={`/admin/marketing/campaigns/${campaign.id}`}
                                    className="font-semibold text-slate-950 transition hover:text-blue-600"
                                  >
                                    {
                                      campaign.title
                                    }
                                  </Link>

                                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                    <span>
                                      {formatLabel(
                                        campaign.channel
                                      )}
                                    </span>

                                    <span>
                                      •
                                    </span>

                                    <span>
                                      Created{" "}
                                      {formatDate(
                                        campaign.createdAt
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* STATUS */}

                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${styles.badge}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                                />

                                {formatLabel(
                                  campaign.status
                                )}
                              </span>
                            </td>

                            {/* SCHEDULE */}

                            <td className="px-6 py-5">
                              <div className="flex items-start gap-2 text-sm text-slate-600">
                                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                                <div>
                                  <p>
                                    {formatDate(
                                      campaign.startDate
                                    )}
                                  </p>

                                  {campaign.endDate && (
                                    <p className="mt-1 text-xs text-slate-400">
                                      to{" "}
                                      {formatDate(
                                        campaign.endDate
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* BUDGET */}

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <CircleDollarSign className="h-4 w-4 text-slate-400" />

                                {formatCurrency(
                                  campaign.budget
                                )}
                              </div>
                            </td>

                            {/* LEADS */}

                            <td className="px-6 py-5">
                              <div>
                                <p className="font-bold text-slate-950">
                                  {
                                    campaign.actualLeads
                                  }
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  attributed
                                </p>
                              </div>
                            </td>

                            {/* CONVERSION */}

                            <td className="px-6 py-5">
                              <div>
                                <p className="font-bold text-green-700">
                                  {
                                    campaign.conversionRate
                                  }
                                  %
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  {
                                    campaign.actualConversions
                                  }{" "}
                                  converted
                                </p>
                              </div>
                            </td>

                            {/* ACTION */}

                            <td className="px-6 py-5 text-right">
                              <Link
                                href={`/admin/marketing/campaigns/${campaign.id}`}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                              >
                                View

                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </td>
                          </tr>
                        )
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}

              <div className="divide-y divide-slate-100 lg:hidden">
                {normalizedCampaigns.map(
                  (campaign) => {
                    const styles =
                      getStatusStyles(
                        campaign.status
                      )

                    return (
                      <div
                        key={campaign.id}
                        className="p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <ChannelIcon
                                channel={
                                  campaign.channel
                                }
                              />
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate font-bold text-slate-950">
                                {
                                  campaign.title
                                }
                              </h3>

                              <p className="mt-1 text-xs text-slate-500">
                                {formatLabel(
                                  campaign.channel
                                )}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
                          >
                            {formatLabel(
                              campaign.status
                            )}
                          </span>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-3">
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">
                              Leads
                            </p>

                            <p className="mt-1 font-bold text-slate-950">
                              {
                                campaign.actualLeads
                              }
                            </p>
                          </div>

                          <div className="rounded-xl bg-green-50 p-3">
                            <p className="text-xs text-green-700">
                              Converted
                            </p>

                            <p className="mt-1 font-bold text-green-800">
                              {
                                campaign.actualConversions
                              }
                            </p>
                          </div>

                          <div className="rounded-xl bg-blue-50 p-3">
                            <p className="text-xs text-blue-700">
                              Rate
                            </p>

                            <p className="mt-1 font-bold text-blue-800">
                              {
                                campaign.conversionRate
                              }
                              %
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                          <div className="text-xs text-slate-500">
                            {formatDate(
                              campaign.startDate
                            )}
                          </div>

                          <Link
                            href={`/admin/marketing/campaigns/${campaign.id}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            View

                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}