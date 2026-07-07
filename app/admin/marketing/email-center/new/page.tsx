import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import EmailComposer from "../components/EmailComposer"

/* =========================================================
   TYPES
========================================================= */

type NewMarketingEmailPageProps = {
  searchParams?: Promise<{
    campaignId?: string
  }>
}

/* =========================================================
   PAGE
========================================================= */

export default async function NewMarketingEmailPage({
  searchParams,
}: NewMarketingEmailPageProps) {
  /* =======================================================
     AUTH
  ======================================================= */

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userId =
    session.user.id

  const orgId =
    session.user.orgId

  if (!userId || !orgId) {
    redirect("/login")
  }

  /* =======================================================
     SEARCH PARAMS
  ======================================================= */

  const params =
    searchParams
      ? await searchParams
      : {}

  const selectedCampaignId =
    params.campaignId || null

  /* =======================================================
     DATA
  ======================================================= */

  const [
    recipientsRaw,
    campaignsRaw,
  ] = await Promise.all([
    prisma.companyLead.findMany({
      where: {
        orgId,

        primaryEmail: {
          not: null,
        },
      },

      select: {
        id: true,

        companyName: true,

        ownerName: true,

        primaryEmail: true,

        industry: true,

        city: true,

        state: true,

        country: true,
      },

      orderBy: {
        companyName: "asc",
      },

      take: 500,
    }),

    prisma.marketingCampaign.findMany({
      where: {
        orgId,
      },

      select: {
        id: true,

        title: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    }),
  ])

  /* =======================================================
     NORMALIZE RECIPIENTS
  ======================================================= */

  const recipients =
    recipientsRaw.flatMap(
      (recipient) => {
        if (
          !recipient.primaryEmail
        ) {
          return []
        }

        return [
          {
            id:
              recipient.id,

            companyName:
              recipient.companyName,

            ownerName:
              recipient.ownerName,

            primaryEmail:
              recipient.primaryEmail,

            industry:
              recipient.industry,

            city:
              recipient.city,

            state:
              recipient.state,

            country:
              recipient.country,
          },
        ]
      }
    )

  /* =======================================================
     NORMALIZE CAMPAIGNS
  ======================================================= */

  const campaigns =
    campaignsRaw.map(
      (campaign) => ({
        id:
          campaign.id,

        title:
          campaign.title,
      })
    )

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="mx-auto max-w-[1500px] space-y-7 p-6 lg:p-8">
        {/* ===============================================
            BACK LINK
        =============================================== */}

        <Link
          href="/admin/marketing/email-center"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Email Center
        </Link>

        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Marketing Email
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Compose Marketing Email
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Create a personalized
              email campaign, select
              company leads, and queue
              emails for immediate or
              scheduled delivery.
            </p>
          </div>

          {/* ===========================================
              INFO CARDS
          =========================================== */}

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Users className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Available Leads
                </p>

                <p className="font-bold text-slate-950">
                  {recipients.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <Sparkles className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Campaigns
                </p>

                <p className="font-bold text-slate-950">
                  {campaigns.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===============================================
            TENANT SAFETY NOTICE
        =============================================== */}

        <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

          <div>
            <p className="text-sm font-semibold text-green-900">
              Organization-scoped email delivery
            </p>

            <p className="mt-1 text-sm leading-6 text-green-700">
              Only recipients and
              campaigns belonging to
              your organization are
              available in this
              composer.
            </p>
          </div>
        </div>

        {/* ===============================================
            CAMPAIGN CONTEXT
        =============================================== */}

        {selectedCampaignId && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
            <p className="text-sm font-semibold text-blue-900">
              Campaign context detected
            </p>

            <p className="mt-1 text-sm text-blue-700">
              This email was opened
              from a marketing campaign.
              Select the corresponding
              campaign inside the
              composer before queueing
              the email.
            </p>
          </div>
        )}

        {/* ===============================================
            COMPOSER
        =============================================== */}

        <EmailComposer
          recipients={recipients}
          campaigns={campaigns}
        />
      </div>
    </div>
  )
}