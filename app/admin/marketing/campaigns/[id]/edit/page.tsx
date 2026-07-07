import Link from "next/link"

import {
  notFound,
  redirect,
} from "next/navigation"

import {
  ArrowLeft,
  CalendarDays,
  Megaphone,
  Pencil,
  ShieldCheck,
  Target,
} from "lucide-react"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import CampaignEditForm from "./components/CampaignEditForm"

/* =========================================================
   TYPES
========================================================= */

type CampaignEditPageProps = {
  params: Promise<{
    id: string
  }>
}

/* =========================================================
   DATE HELPER
========================================================= */

function formatDateInput(
  value: Date | null
) {
  if (!value) {
    return ""
  }

  return value
    .toISOString()
    .slice(0, 10)
}

/* =========================================================
   PAGE
========================================================= */

export default async function CampaignEditPage({
  params,
}: CampaignEditPageProps) {
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
     CAMPAIGN
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

        _count: {
          select: {
            campaignLeads: true,
          },
        },
      },
    })

  if (!campaign) {
    notFound()
  }

  /* =======================================================
     CLIENT-SAFE CAMPAIGN DATA
  ======================================================= */

  const campaignData = {
    id:
      campaign.id,

    title:
      campaign.title,

    channel:
      campaign.channel,

    budget:
      campaign.budget
        ? campaign.budget.toString()
        : "",

    startDate:
      formatDateInput(
        campaign.startDate
      ),

    endDate:
      formatDateInput(
        campaign.endDate
      ),

    status:
      campaign.status,
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">

        {/* ===============================================
            BACK
        =============================================== */}

        <Link
          href={`/admin/marketing/campaigns/${campaign.id}`}
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

          Back to Campaign
        </Link>

        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-orange-50
                  text-orange-600
                "
              >
                <Pencil className="h-5 w-5" />
              </div>

              <span
                className="
                  rounded-full
                  bg-blue-50
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-blue-700
                "
              >
                Campaign Settings
              </span>

            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Edit Campaign
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Update the campaign settings,
              marketing channel, budget,
              schedule, and current campaign
              status.
            </p>

            <p className="mt-3 text-sm font-semibold text-slate-700">
              {campaign.title}
            </p>
          </div>

          {/* ===========================================
              CAMPAIGN STATS
          =========================================== */}

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[620px]">

            {/* LEADS */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
              "
            >
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
                  <Target className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Leads
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-950">
                    {campaign._count.campaignLeads}
                  </p>
                </div>

              </div>
            </div>

            {/* CONVERSIONS */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
              "
            >
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
                    bg-green-50
                    text-green-600
                  "
                >
                  <Megaphone className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Conversions
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-950">
                    {campaign.conversions}
                  </p>
                </div>

              </div>
            </div>

            {/* SCHEDULE */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
              "
            >
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
                    bg-orange-50
                    text-orange-600
                  "
                >
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-bold capitalize text-slate-950">
                    {campaign.status.replaceAll(
                      "_",
                      " "
                    )}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ===============================================
            SECURITY INFO
        =============================================== */}

        <div
          className="
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-green-200
            bg-green-50
            px-5
            py-4
          "
        >
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

          <div>
            <p className="text-sm font-semibold text-green-900">
              Organization-scoped campaign
            </p>

            <p className="mt-1 text-sm leading-6 text-green-700">
              This campaign was loaded using
              both the campaign ID and the
              authenticated organization ID.
              Updates are validated again by
              the server action.
            </p>
          </div>
        </div>

        {/* ===============================================
            EDIT FORM
        =============================================== */}

        <CampaignEditForm
          campaign={campaignData}
        />

        {/* ===============================================
            INFO
        =============================================== */}

        <section
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >
          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
              "
            >
              <Megaphone className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-950">
                Campaign performance data
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Editing campaign settings does
                not remove attributed leads or
                conversion history. Lead
                attribution remains connected
                through the campaign lead
                relation records.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}