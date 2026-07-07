import Link from "next/link"

import {
  notFound,
  redirect,
} from "next/navigation"

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  MousePointerClick,
  Pencil,
  Radio,
  Send,
  Target,
  TrendingUp,
  UserRound,
  Users,
  Video,
} from "lucide-react"

import {
  CampaignChannel,
  CampaignStatus,
} from "@prisma/client"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import CampaignDeleteButton from "./components/CampaignDeleteButton"
import CampaignLeadActions from "./components/CampaignLeadActions"
import CampaignLeadSelector from "./components/CampaignLeadSelector"
import CampaignStatusControls from "./components/CampaignStatusControls"

/* =========================================================
   TYPES
========================================================= */

type CampaignDetailPageProps = {
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
  value: Date | null
) {
  if (!value) {
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

function formatMetricCurrency(
  value: number | null
) {
  if (value === null) {
    return "—"
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
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
      (character) =>
        character.toUpperCase()
    )
}

function calculateRate(
  numerator: number,
  denominator: number
) {
  if (denominator === 0) {
    return 0
  }

  return Math.round(
    (numerator / denominator) *
      100
  )
}

/* =========================================================
   STATUS STYLE
========================================================= */

function getStatusStyle(
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

export default async function CampaignDetailPage({
  params,
}: CampaignDetailPageProps) {
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
     PARAMS
  ======================================================= */

  const { id } =
    await params

  /* =======================================================
     CAMPAIGN QUERY
  ======================================================= */

  const campaign =
    await prisma.marketingCampaign.findFirst({
      where: {
        id,
        orgId,
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

        updatedAt: true,

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

            convertedAt: true,

            attributedAt: true,

            companyLead: {
              select: {
                id: true,

                companyName: true,

                ownerName: true,

                industry: true,

                website: true,

                primaryEmail: true,

                primaryPhone: true,

                country: true,

                state: true,

                city: true,

                source: true,

                status: true,
              },
            },
          },

          orderBy: {
            attributedAt:
              "desc",
          },
        },
      },
    })

  if (!campaign) {
    notFound()
  }

  /* =======================================================
     AVAILABLE LEADS
  ======================================================= */

  const existingCompanyLeadIds =
    campaign.campaignLeads.map(
      (campaignLead) =>
        campaignLead.companyLead.id
    )

  const availableLeads =
    await prisma.companyLead.findMany({
      where: {
        orgId,

        ...(existingCompanyLeadIds.length >
        0
          ? {
              id: {
                notIn:
                  existingCompanyLeadIds,
              },
            }
          : {}),
      },

      select: {
        id: true,

        companyName: true,

        ownerName: true,

        primaryEmail: true,

        city: true,

        state: true,

        country: true,

        industry: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 200,
    })

  /* =======================================================
     METRICS
  ======================================================= */

  const actualLeadCount =
    campaign.campaignLeads.length

  const convertedLeadCount =
    campaign.campaignLeads.filter(
      (lead) =>
        lead.converted
    ).length

  const pendingLeadCount =
    actualLeadCount -
    convertedLeadCount

  const conversionRate =
    calculateRate(
      convertedLeadCount,
      actualLeadCount
    )

  const budgetAmount =
    campaign.budget
      ? Number(
          campaign.budget.toString()
        )
      : null

  const costPerLead =
    budgetAmount !== null &&
    actualLeadCount > 0
      ? budgetAmount /
        actualLeadCount
      : null

  const costPerConversion =
    budgetAmount !== null &&
    convertedLeadCount > 0
      ? budgetAmount /
        convertedLeadCount
      : null

  const statusStyle =
    getStatusStyle(
      campaign.status
    )

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="mx-auto max-w-[1600px] space-y-7 p-6 lg:p-8">

        {/* ===============================================
            BACK
        =============================================== */}

        <Link
          href="/admin/marketing/campaigns"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-500
            transition
            hover:text-blue-600
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Campaigns
        </Link>

        {/* ===============================================
            HEADER
        =============================================== */}

        <div
          className="
            flex
            flex-col
            gap-5
            xl:flex-row
            xl:items-start
            xl:justify-between
          "
        >
          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-600
              "
            >
              <ChannelIcon
                channel={
                  campaign.channel
                }
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">

                <h1
                  className="
                    text-3xl
                    font-bold
                    tracking-tight
                    text-slate-950
                  "
                >
                  {campaign.title}
                </h1>

                <span
                  className={`
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    ${statusStyle.badge}
                  `}
                >
                  <span
                    className={`
                      h-1.5
                      w-1.5
                      rounded-full
                      ${statusStyle.dot}
                    `}
                  />

                  {formatLabel(
                    campaign.status
                  )}
                </span>

              </div>

              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  items-center
                  gap-x-5
                  gap-y-2
                  text-sm
                  text-slate-500
                "
              >
                <span className="inline-flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />

                  {formatLabel(
                    campaign.channel
                  )}
                </span>

                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />

                  Created{" "}
                  {formatDate(
                    campaign.createdAt
                  )}
                </span>

                {campaign.createdBy && (
                  <span className="inline-flex items-center gap-2">
                    <UserRound className="h-4 w-4" />

                    {campaign.createdBy.name ||
                      campaign.createdBy.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ===========================================
              HEADER ACTIONS
          =========================================== */}

          <div className="flex flex-wrap gap-3">

            <Link
              href={`/admin/marketing/campaigns/${campaign.id}/edit`}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-orange-500
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-orange-600
              "
            >
              <Pencil className="h-4 w-4" />

              Edit Campaign
            </Link>

            <Link
              href={`/admin/marketing/email-center/new?campaignId=${campaign.id}`}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-green-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-green-700
              "
            >
              <Send className="h-4 w-4" />

              Send Campaign Email
            </Link>

            <Link
              href="/admin/marketing/email-center"
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
              "
            >
              <Mail className="h-4 w-4" />

              Email Center
            </Link>
          </div>
        </div>

        {/* ===============================================
            PERFORMANCE CARDS
        =============================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          {/* LEADS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-950">
              {actualLeadCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Attributed Leads
            </p>
          </div>

          {/* CONVERTED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-950">
              {convertedLeadCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Conversions
            </p>
          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Clock3 className="h-5 w-5" />
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-950">
              {pendingLeadCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Open Opportunities
            </p>
          </div>

          {/* RATE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <TrendingUp className="h-5 w-5" />
            </div>

            <p className="mt-5 text-3xl font-bold text-slate-950">
              {conversionRate}%
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Conversion Rate
            </p>
          </div>

          {/* BUDGET */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <CircleDollarSign className="h-5 w-5" />
            </div>

            <p className="mt-5 text-2xl font-bold text-slate-950">
              {formatCurrency(
                campaign.budget
              )}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Campaign Budget
            </p>
          </div>
        </div>

        {/* ===============================================
            STATUS CONTROLS
        =============================================== */}

        <CampaignStatusControls
          campaignId={
            campaign.id
          }
          currentStatus={
            campaign.status
          }
        />

        {/* ===============================================
            CAMPAIGN INFORMATION
        =============================================== */}

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">

          {/* OVERVIEW */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-bold text-slate-950">
                Campaign Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Campaign schedule and
                performance information.
              </p>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">

              {/* CHANNEL */}

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Channel
                </p>

                <div className="mt-3 flex items-center gap-2 font-semibold text-slate-900">
                  <ChannelIcon
                    channel={
                      campaign.channel
                    }
                  />

                  {formatLabel(
                    campaign.channel
                  )}
                </div>
              </div>

              {/* START DATE */}

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Start Date
                </p>

                <p className="mt-3 font-semibold text-slate-900">
                  {formatDate(
                    campaign.startDate
                  )}
                </p>
              </div>

              {/* END DATE */}

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  End Date
                </p>

                <p className="mt-3 font-semibold text-slate-900">
                  {formatDate(
                    campaign.endDate
                  )}
                </p>
              </div>

              {/* CPL */}

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Cost per Lead
                </p>

                <p className="mt-3 font-bold text-blue-900">
                  {formatMetricCurrency(
                    costPerLead
                  )}
                </p>
              </div>

              {/* CPC */}

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                  Cost per Conversion
                </p>

                <p className="mt-3 font-bold text-green-900">
                  {formatMetricCurrency(
                    costPerConversion
                  )}
                </p>
              </div>

              {/* UPDATED */}

              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                  Last Updated
                </p>

                <p className="mt-3 text-sm font-semibold text-orange-900">
                  {formatDateTime(
                    campaign.updatedAt
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* PERFORMANCE */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-bold text-slate-950">
                Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Campaign funnel progress.
              </p>
            </div>

            <div className="space-y-6 p-6">

              {/* ATTRIBUTED */}

              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">
                    Attributed Leads
                  </span>

                  <span className="font-bold text-slate-950">
                    {actualLeadCount}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width:
                        actualLeadCount > 0
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* CONVERTED */}

              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">
                    Converted
                  </span>

                  <span className="font-bold text-green-700">
                    {convertedLeadCount}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width:
                        `${conversionRate}%`,
                    }}
                  />
                </div>
              </div>

              {/* RATE */}

              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-green-600" />

                  <div>
                    <p className="text-sm font-semibold text-green-900">
                      Conversion Rate
                    </p>

                    <p className="mt-1 text-2xl font-bold text-green-800">
                      {conversionRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===============================================
            LEAD SELECTOR
        =============================================== */}

        <CampaignLeadSelector
          campaignId={
            campaign.id
          }
          leads={
            availableLeads
          }
        />

        {/* ===============================================
            ATTRIBUTED LEADS
        =============================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* HEADER */}

          <div
            className="
              flex
              flex-col
              gap-4
              border-b
              border-slate-200
              px-6
              py-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h2 className="font-bold text-slate-950">
                Campaign Leads
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Companies attributed to
                this marketing campaign.
              </p>
            </div>

            <Link
              href={`/admin/marketing/email-center/new?campaignId=${campaign.id}`}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-green-50
                px-4
                py-2
                text-sm
                font-semibold
                text-green-700
                transition
                hover:bg-green-100
              "
            >
              <Mail className="h-4 w-4" />

              Email Leads
            </Link>
          </div>

          {/* EMPTY */}

          {campaign.campaignLeads.length ===
          0 ? (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                px-6
                py-16
                text-center
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-50
                  text-blue-600
                "
              >
                <Users className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-bold text-slate-950">
                No attributed leads
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Use the Add Leads control
                above to associate company
                leads with this campaign.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1350px]">

                {/* TABLE HEAD */}

                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-left">

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Company
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Location
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Industry
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Attribution
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Conversion
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>

                  </tr>
                </thead>

                {/* TABLE BODY */}

                <tbody className="divide-y divide-slate-100">
                  {campaign.campaignLeads.map(
                    (campaignLead) => {
                      const company =
                        campaignLead.companyLead

                      const location =
                        [
                          company.city,
                          company.state,
                          company.country,
                        ]
                          .filter(Boolean)
                          .join(", ")

                      return (
                        <tr
                          key={
                            campaignLead.id
                          }
                          className="
                            transition
                            hover:bg-slate-50/70
                          "
                        >

                          {/* COMPANY */}

                          <td className="px-6 py-5">
                            <div className="flex items-start gap-3">

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
                                <Building2 className="h-5 w-5" />
                              </div>

                              <div>
                                <p className="font-semibold text-slate-950">
                                  {company.companyName}
                                </p>

                                {company.website && (
                                  <a
                                    href={
                                      company.website
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                      mt-1
                                      inline-flex
                                      items-center
                                      gap-1
                                      text-xs
                                      text-blue-600
                                      hover:underline
                                    "
                                  >
                                    <Globe2 className="h-3 w-3" />

                                    Website

                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* CONTACT */}

                          <td className="px-6 py-5">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-slate-700">
                                {company.ownerName ||
                                  "Contact not provided"}
                              </p>

                              <p className="text-xs text-slate-500">
                                {company.primaryEmail ||
                                  "No email"}
                              </p>

                              {company.primaryPhone && (
                                <p className="text-xs text-slate-400">
                                  {company.primaryPhone}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* LOCATION */}

                          <td className="px-6 py-5">
                            <div className="flex items-start gap-2 text-sm text-slate-600">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                              <span>
                                {location ||
                                  "Not provided"}
                              </span>
                            </div>
                          </td>

                          {/* INDUSTRY */}

                          <td className="px-6 py-5">
                            <span
                              className="
                                inline-flex
                                rounded-full
                                bg-blue-50
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-blue-700
                              "
                            >
                              {company.industry ||
                                "General"}
                            </span>
                          </td>

                          {/* ATTRIBUTION */}

                          <td className="px-6 py-5">
                            <p className="text-sm font-medium text-slate-700">
                              {formatDate(
                                campaignLead.attributedAt
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatLabel(
                                company.source
                              )}
                            </p>
                          </td>

                          {/* CONVERSION */}

                          <td className="px-6 py-5">
                            {campaignLead.converted ? (
                              <div>
                                <span
                                  className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-green-200
                                    bg-green-50
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-green-700
                                  "
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />

                                  Converted
                                </span>

                                {campaignLead.convertedAt && (
                                  <p className="mt-2 text-xs text-slate-400">
                                    {formatDate(
                                      campaignLead.convertedAt
                                    )}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  border
                                  border-orange-200
                                  bg-orange-50
                                  px-3
                                  py-1
                                  text-xs
                                  font-semibold
                                  text-orange-700
                                "
                              >
                                <Clock3 className="h-3.5 w-3.5" />

                                Open
                              </span>
                            )}
                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-5">
                            <CampaignLeadActions
                              campaignId={
                                campaign.id
                              }
                              companyLeadId={
                                company.id
                              }
                              companyName={
                                company.companyName
                              }
                              converted={
                                campaignLead.converted
                              }
                            />
                          </td>
                        </tr>
                      )
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===============================================
            DANGER ZONE
        =============================================== */}

        <section
          className="
            rounded-2xl
            border
            border-red-200
            bg-white
            p-6
            shadow-sm
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              xl:flex-row
              xl:items-start
              xl:justify-between
            "
          >
            <div>
              <h2 className="font-bold text-red-900">
                Danger Zone
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Permanently delete this
                campaign and its campaign
                attribution records. The
                underlying company leads
                remain available in the
                lead database.
              </p>
            </div>

            <CampaignDeleteButton
              campaignId={
                campaign.id
              }
              campaignTitle={
                campaign.title
              }
            />
          </div>
        </section>
      </div>
    </div>
  )
}