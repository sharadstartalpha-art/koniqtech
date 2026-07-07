import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Info,
  Megaphone,
  Target,
  TrendingUp,
} from "lucide-react"

import { auth } from "@/auth"

import CampaignForm from "../components/CampaignForm"

/* =========================================================
   PAGE
========================================================= */

export default async function NewMarketingCampaignPage() {
  /* =======================================================
     AUTH
  ======================================================= */

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div>
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

        <div className="mt-5">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>
              Marketing
            </span>

            <span>/</span>

            <span>
              Campaigns
            </span>

            <span>/</span>

            <span className="font-medium text-slate-700">
              New Campaign
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Create Marketing Campaign
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Set up a new marketing campaign, choose the outreach
            channel, define the budget, and configure the campaign
            timeline.
          </p>
        </div>
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* =================================================
            FORM
        ================================================= */}

        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-50
                  text-orange-600
                "
              >
                <Megaphone className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-950">
                  Campaign Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the basic details for this marketing campaign.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <CampaignForm />
          </div>
        </section>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <aside className="space-y-5">
          {/* CAMPAIGN GUIDE */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
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
                <h3 className="font-bold text-slate-950">
                  Campaign Setup
                </h3>

                <p className="text-xs text-slate-500">
                  Quick planning guide
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <GuideItem
                icon={
                  <Megaphone className="h-4 w-4" />
                }
                title="Choose the right channel"
                description="Select the main channel used to reach your target audience."
              />

              <GuideItem
                icon={
                  <CircleDollarSign className="h-4 w-4" />
                }
                title="Set a realistic budget"
                description="Enter the total planned spend for the campaign."
              />

              <GuideItem
                icon={
                  <CalendarDays className="h-4 w-4" />
                }
                title="Define the timeline"
                description="Choose start and end dates for accurate reporting."
              />

              <GuideItem
                icon={
                  <TrendingUp className="h-4 w-4" />
                }
                title="Track performance"
                description="Lead and conversion metrics can be monitored after launch."
              />
            </div>
          </div>

          {/* INFORMATION */}

          <div
            className="
              rounded-2xl
              border
              border-blue-200
              bg-blue-50
              p-5
            "
          >
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <div>
                <h3 className="text-sm font-bold text-blue-950">
                  Campaign Tracking
                </h3>

                <p className="mt-2 text-sm leading-6 text-blue-800">
                  New campaigns start with zero leads and conversions.
                  These metrics will increase as campaign performance is
                  recorded.
                </p>
              </div>
            </div>
          </div>

          {/* WORKFLOW */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <h3 className="font-bold text-slate-950">
              Marketing Workflow
            </h3>

            <div className="mt-5 space-y-0">
              <WorkflowStep
                number="1"
                title="Create Campaign"
                description="Configure campaign details."
              />

              <WorkflowStep
                number="2"
                title="Launch Outreach"
                description="Run campaign activities."
              />

              <WorkflowStep
                number="3"
                title="Generate Leads"
                description="Track incoming prospects."
              />

              <WorkflowStep
                number="4"
                title="Measure Conversion"
                description="Analyze campaign results."
                last
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

/* =========================================================
   GUIDE ITEM
========================================================= */

function GuideItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3">
      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-slate-100
          text-slate-600
        "
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   WORKFLOW STEP
========================================================= */

function WorkflowStep({
  number,
  title,
  description,
  last = false,
}: {
  number: string
  title: string
  description: string
  last?: boolean
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-orange-50
            text-xs
            font-bold
            text-orange-600
          "
        >
          {number}
        </div>

        {!last && (
          <div className="h-10 w-px bg-slate-200" />
        )}
      </div>

      <div className="pb-4">
        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  )
}