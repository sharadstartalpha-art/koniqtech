import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowLeft,
  Mail,
  Megaphone,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import EmailComposer from "../components/EmailComposer"

/* =========================================================
   PAGE
========================================================= */

export default async function NewMarketingEmailPage() {
  /* =======================================================
     AUTH
  ======================================================= */

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  /* =======================================================
     DATA
  ======================================================= */

  const [
    campaigns,
    companies,
    campaignLeadCount,
  ] = await Promise.all([
    prisma.marketingCampaign.findMany({
      where: {
        status: {
          in: [
            "draft",
            "running",
          ],
        },
      },

      select: {
        id: true,
        title: true,
        channel: true,
        status: true,
        leads: true,
        conversions: true,

        _count: {
          select: {
            campaignLeads: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 100,
    }),

    prisma.companyLead.findMany({
      where: {
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
        country: true,
        status: true,

        marketingCampaignLeads: {
          select: {
            campaignId: true,
            converted: true,
          },
        },
      },

      orderBy: {
        companyName: "asc",
      },

      take: 500,
    }),

    prisma.marketingCampaignLead.count(),
  ])

  /* =======================================================
     SERIALIZE CAMPAIGNS
  ======================================================= */

  const campaignOptions = campaigns.map(
    (campaign) => ({
      id: campaign.id,

      title: campaign.title,

      channel: campaign.channel,

      status: campaign.status,

      storedLeads: campaign.leads,

      conversions: campaign.conversions,

      attributedLeads:
        campaign._count.campaignLeads,
    })
  )

  /* =======================================================
     SERIALIZE RECIPIENTS
  ======================================================= */

  const recipientOptions = companies
    .filter(
      (
        company
      ): company is typeof company & {
        primaryEmail: string
      } =>
        typeof company.primaryEmail ===
          "string" &&
        company.primaryEmail.trim().length > 0
    )
    .map((company) => ({
      id: company.id,

      companyName: company.companyName,

      ownerName:
        company.ownerName ?? null,

      email: company.primaryEmail,

      industry:
        company.industry ?? null,

      country:
        company.country ?? null,

      status: company.status,

      campaignIds:
        company.marketingCampaignLeads.map(
          (item) => item.campaignId
        ),

      converted:
        company.marketingCampaignLeads.some(
          (item) => item.converted
        ),
    }))

  /* =======================================================
     STATS
  ======================================================= */

  const emailCampaignCount =
    campaignOptions.filter(
      (campaign) =>
        campaign.channel === "email"
    ).length

  const runningCampaignCount =
    campaignOptions.filter(
      (campaign) =>
        campaign.status === "running"
    ).length

  return (
    <div className="min-h-screen bg-slate-50">
      <div
        className="
          mx-auto
          max-w-[1500px]
          space-y-6
          p-6
          lg:p-8
        "
      >
        {/* ===============================================
            BREADCRUMB
        =============================================== */}

        <div>
          <Link
            href="/admin/marketing/email-center"
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

            Back to Email Center
          </Link>
        </div>

        {/* ===============================================
            HEADER
        =============================================== */}

        <div
          className="
            flex
            flex-col
            justify-between
            gap-5
            lg:flex-row
            lg:items-center
          "
        >
          <div>
            <p
              className="
                text-sm
                font-semibold
                text-blue-600
              "
            >
              Marketing Communication
            </p>

            <h1
              className="
                mt-1
                text-3xl
                font-bold
                tracking-tight
                text-slate-950
              "
            >
              Compose Marketing Email
            </h1>

            <p
              className="
                mt-2
                max-w-3xl
                text-sm
                leading-6
                text-slate-500
              "
            >
              Create targeted marketing emails,
              select campaign audiences, and queue
              messages for controlled delivery.
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-4
              py-3
              text-sm
              font-semibold
              text-green-700
            "
          >
            <ShieldCheck className="h-5 w-5" />

            Authenticated Sender
          </div>
        </div>

        {/* ===============================================
            STATS
        =============================================== */}

        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <StatCard
            label="Available Recipients"
            value={recipientOptions.length}
            description="Leads with valid email"
            icon={
              <Users className="h-5 w-5 text-blue-600" />
            }
          />

          <StatCard
            label="Available Campaigns"
            value={campaignOptions.length}
            description="Draft and running"
            icon={
              <Megaphone className="h-5 w-5 text-orange-600" />
            }
          />

          <StatCard
            label="Email Campaigns"
            value={emailCampaignCount}
            description="Email channel campaigns"
            icon={
              <Mail className="h-5 w-5 text-violet-600" />
            }
          />

          <StatCard
            label="Attributed Leads"
            value={campaignLeadCount}
            description="Campaign-linked leads"
            icon={
              <Send className="h-5 w-5 text-green-600" />
            }
          />
        </div>

        {/* ===============================================
            COMPOSER
        =============================================== */}

        <EmailComposer
          campaigns={campaignOptions}
          recipients={recipientOptions}
          sender={{
            id: session.user.id,
            name:
              session.user.name ??
              "Marketing Team",
            email:
              session.user.email ?? "",
          }}
        />

        {/* ===============================================
            DELIVERY INFORMATION
        =============================================== */}

        <section
          className="
            rounded-2xl
            border
            border-blue-200
            bg-blue-50
            p-5
          "
        >
          <div
            className="
              flex
              items-start
              gap-3
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-100
              "
            >
              <Send
                className="
                  h-5
                  w-5
                  text-blue-700
                "
              />
            </div>

            <div>
              <h2
                className="
                  font-bold
                  text-blue-950
                "
              >
                Controlled Email Delivery
              </h2>

              <p
                className="
                  mt-1
                  max-w-4xl
                  text-sm
                  leading-6
                  text-blue-800
                "
              >
                Marketing emails should be queued
                instead of sending hundreds of
                messages directly inside a server
                action. The queue worker can process
                emails in controlled batches and
                record delivery failures separately.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string
  value: number
  description: string
  icon: React.ReactNode
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            {label}
          </p>

          <p
            className="
              mt-3
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
            "
          >
            {value}
          </p>

          <p
            className="
              mt-2
              text-xs
              text-slate-400
            "
          >
            {description}
          </p>
        </div>

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-slate-50
          "
        >
          {icon}
        </div>
      </div>
    </div>
  )
}