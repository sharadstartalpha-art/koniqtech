import Link from "next/link"

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Mail,
  Megaphone,
  MessageSquare,
  MousePointerClick,
  PauseCircle,
  PlayCircle,
  Radio,
  Target,
  Trash2,
  TrendingUp,
  UserRound,
  UsersRound,
} from "lucide-react"

import {
  CampaignChannel,
  CampaignStatus,
} from "@prisma/client"

import { notFound } from "next/navigation"

import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"

import {
  deleteCampaignAction,
  updateCampaignStatusAction,
} from "../actions"

/* =========================================================
   TYPES
========================================================= */

type PageProps = {
  params: Promise<{
    id: string
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

function formatDateTime(
  value: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(value)
}

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

/* =========================================================
   STATUS CONFIG
========================================================= */

const STATUS_CONFIG: Record<
  CampaignStatus,
  {
    label: string
    className: string
  }
> = {
  draft: {
    label: "Draft",
    className:
      "bg-slate-100 text-slate-700",
  },

  running: {
    label: "Running",
    className:
      "bg-green-100 text-green-700",
  },

  paused: {
    label: "Paused",
    className:
      "bg-orange-100 text-orange-700",
  },

  completed: {
    label: "Completed",
    className:
      "bg-blue-100 text-blue-700",
  },

  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-100 text-red-700",
  },
}

/* =========================================================
   CHANNEL CONFIG
========================================================= */

const CHANNEL_CONFIG: Record<
  CampaignChannel,
  {
    label: string
  }
> = {
  email: {
    label: "Email",
  },

  social: {
    label: "Social Media",
  },

  ads: {
    label: "Paid Ads",
  },

  sms: {
    label: "SMS",
  },

  webinar: {
    label: "Webinar",
  },
}

/* =========================================================
   PAGE
========================================================= */

export default async function CampaignDetailsPage({
  params,
}: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          You are not authorized to view this page.
        </div>
      </div>
    )
  }

  const { id } = await params

  /* =======================================================
     CAMPAIGN
  ======================================================= */

  const campaign =
    await prisma.marketingCampaign.findUnique({
      where: {
        id,
      },

      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

  if (!campaign) {
    notFound()
  }

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const budget =
    campaign.budget
      ? Number(campaign.budget)
      : 0

  const conversionRate =
    campaign.leads > 0
      ? Math.round(
          (campaign.conversions /
            campaign.leads) *
            100
        )
      : 0

  const costPerLead =
    campaign.leads > 0
      ? budget / campaign.leads
      : 0

  const costPerConversion =
    campaign.conversions > 0
      ? budget /
        campaign.conversions
      : 0

  const status =
    STATUS_CONFIG[campaign.status]

  const channel =
    CHANNEL_CONFIG[campaign.channel]

  /* =======================================================
     SERVER ACTION BINDINGS
  ======================================================= */

  const startCampaignAction =
    updateCampaignStatusAction.bind(
      null,
      campaign.id,
      CampaignStatus.running
    )

  const pauseCampaignAction =
    updateCampaignStatusAction.bind(
      null,
      campaign.id,
      CampaignStatus.paused
    )

  const completeCampaignAction =
    updateCampaignStatusAction.bind(
      null,
      campaign.id,
      CampaignStatus.completed
    )

  const deleteAction =
    deleteCampaignAction.bind(
      null,
      campaign.id
    )

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] space-y-6 p-6 lg:p-8">
        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link
            href="/admin/marketing/dashboard"
            className="transition hover:text-blue-600"
          >
            Marketing
          </Link>

          <span>/</span>

          <Link
            href="/admin/marketing/campaigns"
            className="transition hover:text-blue-600"
          >
            Campaigns
          </Link>

          <span>/</span>

          <span className="font-medium text-slate-900">
            {campaign.title}
          </span>
        </div>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
          <div>
            <Link
              href="/admin/marketing/campaigns"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />

              Back to Campaigns
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                {campaign.title}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
              >
                {status.label}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Megaphone className="h-4 w-4" />

                {channel.label}
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />

                Created{" "}
                {formatDate(
                  campaign.createdAt
                )}
              </span>
            </div>
          </div>

          {/* ===============================================
              ACTIONS
          =============================================== */}

          <div className="flex flex-wrap gap-2">
            {campaign.status !==
              CampaignStatus.running && (
              <form action={startCampaignAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <PlayCircle className="h-4 w-4" />

                  Start Campaign
                </button>
              </form>
            )}

            {campaign.status ===
              CampaignStatus.running && (
              <form action={pauseCampaignAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  <PauseCircle className="h-4 w-4" />

                  Pause
                </button>
              </form>
            )}

            {campaign.status !==
              CampaignStatus.completed && (
              <form action={completeCampaignAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <CheckCircle2 className="h-4 w-4" />

                  Complete
                </button>
              </form>
            )}

            <form action={deleteAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />

                Delete
              </button>
            </form>
          </div>
        </div>

        {/* =================================================
            METRICS
        ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Campaign Budget"
            value={formatCurrency(budget)}
            subtitle="Total allocated budget"
            icon={
              <CircleDollarSign className="h-5 w-5 text-green-600" />
            }
          />

          <MetricCard
            title="Leads Generated"
            value={campaign.leads.toLocaleString()}
            subtitle="Campaign attributed leads"
            icon={
              <UsersRound className="h-5 w-5 text-blue-600" />
            }
          />

          <MetricCard
            title="Conversions"
            value={campaign.conversions.toLocaleString()}
            subtitle="Successful conversions"
            icon={
              <Target className="h-5 w-5 text-violet-600" />
            }
          />

          <MetricCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            subtitle="Leads converted"
            icon={
              <TrendingUp className="h-5 w-5 text-orange-600" />
            }
          />
        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          {/* ===============================================
              PERFORMANCE
          =============================================== */}

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-950">
                  Campaign Performance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current campaign acquisition and conversion metrics.
                </p>
              </div>

              <div className="grid gap-4 p-6 md:grid-cols-2">
                <PerformanceItem
                  icon={
                    <MousePointerClick className="h-5 w-5 text-blue-600" />
                  }
                  label="Total Leads"
                  value={campaign.leads.toLocaleString()}
                />

                <PerformanceItem
                  icon={
                    <Target className="h-5 w-5 text-green-600" />
                  }
                  label="Conversions"
                  value={campaign.conversions.toLocaleString()}
                />

                <PerformanceItem
                  icon={
                    <CircleDollarSign className="h-5 w-5 text-orange-600" />
                  }
                  label="Cost Per Lead"
                  value={
                    campaign.leads > 0
                      ? formatCurrency(
                          costPerLead
                        )
                      : "$0"
                  }
                />

                <PerformanceItem
                  icon={
                    <TrendingUp className="h-5 w-5 text-violet-600" />
                  }
                  label="Cost Per Conversion"
                  value={
                    campaign.conversions > 0
                      ? formatCurrency(
                          costPerConversion
                        )
                      : "$0"
                  }
                />
              </div>
            </section>

            {/* =============================================
                CONVERSION PROGRESS
            ============================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Conversion Progress
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Campaign lead-to-conversion performance.
                  </p>
                </div>

                <div className="text-2xl font-bold text-slate-950">
                  {conversionRate}%
                </div>
              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${Math.min(
                      conversionRate,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-4 flex justify-between text-sm">
                <span className="text-slate-500">
                  {campaign.conversions} converted
                </span>

                <span className="text-slate-500">
                  {campaign.leads} total leads
                </span>
              </div>
            </section>
          </div>

          {/* ===============================================
              SIDEBAR DETAILS
          =============================================== */}

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-950">
                  Campaign Details
                </h2>
              </div>

              <div className="divide-y divide-slate-100 px-6">
                <DetailRow
                  icon={
                    <Radio className="h-4 w-4" />
                  }
                  label="Channel"
                  value={channel.label}
                />

                <DetailRow
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  label="Start Date"
                  value={formatDate(
                    campaign.startDate
                  )}
                />

                <DetailRow
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  label="End Date"
                  value={formatDate(
                    campaign.endDate
                  )}
                />

                <DetailRow
                  icon={
                    <Clock3 className="h-4 w-4" />
                  }
                  label="Last Updated"
                  value={formatDateTime(
                    campaign.updatedAt
                  )}
                />
              </div>
            </section>

            {/* =============================================
                CREATED BY
            ============================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-950">
                Created By
              </h2>

              <div className="mt-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <UserRound className="h-5 w-5 text-blue-600" />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-950">
                    {campaign.createdBy?.name ||
                      "Unknown user"}
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {campaign.createdBy?.email ||
                      "Creator account unavailable"}
                  </p>
                </div>
              </div>
            </section>

            {/* =============================================
                CHANNEL SUMMARY
            ============================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">
                  {campaign.channel ===
                    CampaignChannel.email && (
                    <Mail className="h-5 w-5 text-violet-600" />
                  )}

                  {campaign.channel ===
                    CampaignChannel.sms && (
                    <MessageSquare className="h-5 w-5 text-violet-600" />
                  )}

                  {campaign.channel !==
                    CampaignChannel.email &&
                    campaign.channel !==
                      CampaignChannel.sms && (
                      <Megaphone className="h-5 w-5 text-violet-600" />
                    )}
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Campaign Channel
                  </p>

                  <p className="mt-1 font-semibold text-slate-950">
                    {channel.label}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
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
  subtitle,
  icon,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
          {icon}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   PERFORMANCE ITEM
========================================================= */

function PerformanceItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-xl font-bold text-slate-950">
          {value}
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {icon}

        <span>{label}</span>
      </div>

      <span className="text-right text-sm font-semibold text-slate-900">
        {value}
      </span>
    </div>
  )
}