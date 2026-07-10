import Link from "next/link"

import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Eye,
  Mail,
  Megaphone,
  MousePointerClick,
  Target,
  TrendingUp,
  Users
} from "lucide-react"

import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import ReportFilters from "./components/ReportFilters"
import CampaignChart from "./components/CampaignChart"
import ChannelPerformanceChart from "./components/ChannelPerformanceChart"
/* =========================================================
   HELPERS
========================================================= */

function percentage(
  value: number,
  total: number
) {
  if (total <= 0) {
    return 0
  }

  return Math.round(
    (value / total) * 100
  )
}

function formatDate(
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
      year: "numeric"
    }
  ).format(value)
}

function formatChannel(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
}

function formatStatus(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
}

/* =========================================================
   PAGE
========================================================= */

export default async function MarketingReportsPage() {
  const session = await auth()

  const orgId = String(
    (session?.user as any)?.orgId ?? ""
  )

  if (!orgId) {
    return (
      <div className="p-8">
        <div
          className="
            rounded-3xl
            border
            border-red-200
            bg-red-50
            p-6
            text-red-700
          "
        >
          Organization context is missing.
        </div>
      </div>
    )
  }

  /* =======================================================
     DATE RANGE
  ======================================================= */

  const now = new Date()

  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  )

  /* =======================================================
     DATA
  ======================================================= */

  const [
    campaigns,
    totalCampaigns,
    activeCampaigns,
    campaignLeadCount,
    campaignConversionCount,

    totalNewsletters,
    sentNewsletters,
    newsletterStats,

    totalDemos,
    completedDemos,
    upcomingDemos,

    totalCompanyLeads,
    monthlyCompanyLeads,

    emailQueueCount,
    sentEmailCount,
    failedEmailCount
  ] = await Promise.all([
    prisma.marketingCampaign.findMany({
      where: {
        orgId
      },

      select: {
        id: true,
        title: true,
        channel: true,
        status: true,
        leads: true,
        conversions: true,
        createdAt: true,
        startDate: true,
        endDate: true
      },

      orderBy: {
        createdAt: "desc"
      },

      take: 8
    }),

    prisma.marketingCampaign.count({
      where: {
        orgId
      }
    }),

    prisma.marketingCampaign.count({
      where: {
        orgId,

        status: {
          in: [
            "running"
          ]
        }
      }
    }),

    prisma.marketingCampaignLead.count({
      where: {
        campaign: {
          orgId
        }
      }
    }),

    prisma.marketingCampaignLead.count({
      where: {
        campaign: {
          orgId
        },

        converted: true
      }
    }),

    prisma.marketingNewsletter.count({
      where: {
        orgId
      }
    }),

    prisma.marketingNewsletter.count({
      where: {
        orgId,

        status: "sent"
      }
    }),

    prisma.marketingNewsletter.aggregate({
      where: {
        orgId
      },

      _sum: {
        recipientCount: true,
        sentCount: true,
        failedCount: true,
        openedCount: true,
        clickedCount: true
      }
    }),

    prisma.demoSchedule.count({
      where: {
        company: {
          orgId
        }
      }
    }),

    prisma.demoSchedule.count({
      where: {
        company: {
          orgId
        },

        status: "completed"
      }
    }),

    prisma.demoSchedule.count({
      where: {
        company: {
          orgId
        },

        meetingDate: {
          gte: now
        }
      }
    }),

    prisma.companyLead.count({
      where: {
        orgId
      }
    }),

    prisma.companyLead.count({
      where: {
        orgId,

        createdAt: {
          gte: monthStart
        }
      }
    }),

    prisma.userEmailQueue.count({
      where: {
        orgId
      }
    }),

    prisma.userEmailQueue.count({
      where: {
        orgId,

        status: "sent"
      }
    }),

    prisma.userEmailQueue.count({
      where: {
        orgId,

        status: "failed"
      }
    })
  ])

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const newsletterRecipients =
    newsletterStats._sum.recipientCount ?? 0

  const newsletterSent =
    newsletterStats._sum.sentCount ?? 0

  const newsletterFailed =
    newsletterStats._sum.failedCount ?? 0

  const newsletterOpened =
    newsletterStats._sum.openedCount ?? 0

  const newsletterClicked =
    newsletterStats._sum.clickedCount ?? 0

  const campaignConversionRate =
    percentage(
      campaignConversionCount,
      campaignLeadCount
    )

  const demoCompletionRate =
    percentage(
      completedDemos,
      totalDemos
    )

  const newsletterOpenRate =
    percentage(
      newsletterOpened,
      newsletterSent
    )

  const newsletterClickRate =
    percentage(
      newsletterClicked,
      newsletterSent
    )

  const emailDeliveryRate =
    percentage(
      sentEmailCount,
      emailQueueCount
    )




    const campaignChartData =
  await prisma.marketingCampaign.findMany({
    where: {
      orgId
    },

    select: {
      id: true,
      title: true,
      channel: true,
      leads: true,
      conversions: true
    },

    orderBy: {
      createdAt: "desc"
    },

    take: 10
  })



  const channelMap = new Map<
  string,
  {
    channel: string
    campaigns: number
    leads: number
    conversions: number
  }
>()

for (const campaign of campaigns) {
  const key = campaign.channel

  const existing =
    channelMap.get(key)

  if (existing) {
    existing.campaigns += 1
    existing.leads += campaign.leads
    existing.conversions +=
      campaign.conversions
  } else {
    channelMap.set(key, {
      channel: key,
      campaigns: 1,
      leads: campaign.leads,
      conversions:
        campaign.conversions
    })
  }
}

const channelPerformance =
  Array.from(
    channelMap.values()
  ).sort(
    (a, b) =>
      b.leads - a.leads
  )
  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
      "
    >
      <div
        className="
          mx-auto
          max-w-[1600px]
          space-y-8
          p-6
          lg:p-8
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            <p
              className="
                text-sm
                font-medium
                text-blue-600
              "
            >
              Marketing Analytics
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
              Marketing Reports
            </h1>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Track campaigns, lead conversions,
              demos, newsletters, and email
              performance.
            </p>
          </div>

          <div
            className="
              flex
              flex-wrap
              gap-3
            "
          >
            <Link
              href="/admin/marketing/campaigns"
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
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
              <Megaphone size={17} />

              Campaigns
            </Link>

            <Link
              href="/admin/marketing/newsletter"
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
                transition
                hover:bg-green-700
              "
            >
              <Mail size={17} />

              Newsletters
            </Link>
          </div>
        </div>


        <ReportFilters />

        <CampaignChart 
        campaigns={campaignChartData}/>


        <div
  className="
    grid
    gap-6
    xl:grid-cols-2
  "
>
  <CampaignChart
    campaigns={campaignChartData}
  />

  <ChannelPerformanceChart
    channels={channelPerformance}
  />
</div>
        {/* =================================================
            PRIMARY METRICS
        ================================================= */}

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          <MetricCard
            label="Total Leads"
            value={totalCompanyLeads}
            description={`${monthlyCompanyLeads} added this month`}
            icon={<Users size={21} />}
          />

          <MetricCard
            label="Campaign Leads"
            value={campaignLeadCount}
            description={`${campaignConversionCount} converted`}
            icon={<Target size={21} />}
          />

          <MetricCard
            label="Conversion Rate"
            value={`${campaignConversionRate}%`}
            description="Campaign lead conversion"
            icon={<TrendingUp size={21} />}
          />

          <MetricCard
            label="Completed Demos"
            value={completedDemos}
            description={`${demoCompletionRate}% completion rate`}
            icon={
              <CalendarCheck size={21} />
            }
          />
        </div>

        {/* =================================================
            SECONDARY METRICS
        ================================================= */}

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          <SmallMetric
            label="Campaigns"
            value={totalCampaigns}
            subtext={`${activeCampaigns} active`}
            icon={<Megaphone size={20} />}
          />

          <SmallMetric
            label="Newsletters"
            value={totalNewsletters}
            subtext={`${sentNewsletters} sent`}
            icon={<Mail size={20} />}
          />

          <SmallMetric
            label="Upcoming Demos"
            value={upcomingDemos}
            subtext={`${totalDemos} total demos`}
            icon={<Clock3 size={20} />}
          />

          <SmallMetric
            label="Email Delivery"
            value={`${emailDeliveryRate}%`}
            subtext={`${sentEmailCount} sent`}
            icon={<CheckCircle2 size={20} />}
          />
        </div>

        {/* =================================================
            PERFORMANCE PANELS
        ================================================= */}

        <div
          className="
            grid
            gap-6
            xl:grid-cols-2
          "
        >
          {/* NEWSLETTER */}

          <section
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div>
                <h2
                  className="
                    text-lg
                    font-bold
                    text-slate-950
                  "
                >
                  Newsletter Performance
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Overall engagement across all
                  newsletters.
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  bg-blue-50
                  p-3
                  text-blue-600
                "
              >
                <BarChart3 size={22} />
              </div>
            </div>

            <div
              className="
                mt-6
                grid
                grid-cols-2
                gap-4
                lg:grid-cols-4
              "
            >
              <PerformanceStat
                label="Recipients"
                value={newsletterRecipients}
              />

              <PerformanceStat
                label="Sent"
                value={newsletterSent}
              />

              <PerformanceStat
                label="Opened"
                value={newsletterOpened}
              />

              <PerformanceStat
                label="Clicked"
                value={newsletterClicked}
              />
            </div>

            <div
              className="
                mt-6
                grid
                gap-4
                md:grid-cols-2
              "
            >
              <RateCard
                label="Open Rate"
                value={newsletterOpenRate}
                icon={<Eye size={18} />}
              />

              <RateCard
                label="Click Rate"
                value={newsletterClickRate}
                icon={
                  <MousePointerClick
                    size={18}
                  />
                }
              />
            </div>

            {newsletterFailed > 0 && (
              <div
                className="
                  mt-5
                  rounded-2xl
                  border
                  border-orange-200
                  bg-orange-50
                  px-4
                  py-3
                  text-sm
                  text-orange-700
                "
              >
                {newsletterFailed} newsletter
                deliveries have failed.
              </div>
            )}
          </section>

          {/* EMAIL QUEUE */}

          <section
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div>
                <h2
                  className="
                    text-lg
                    font-bold
                    text-slate-950
                  "
                >
                  Email Delivery
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Marketing email queue delivery
                  health.
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  bg-green-50
                  p-3
                  text-green-600
                "
              >
                <Mail size={22} />
              </div>
            </div>

            <div
              className="
                mt-7
                space-y-5
              "
            >
              <ProgressRow
                label="Sent"
                value={sentEmailCount}
                total={emailQueueCount}
              />

              <ProgressRow
                label="Failed"
                value={failedEmailCount}
                total={emailQueueCount}
              />

              <ProgressRow
                label="Pending / Queued"
                value={Math.max(
                  emailQueueCount -
                    sentEmailCount -
                    failedEmailCount,
                  0
                )}
                total={emailQueueCount}
              />
            </div>

            <div
              className="
                mt-7
                rounded-2xl
                bg-slate-50
                p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    text-sm
                    font-medium
                    text-slate-600
                  "
                >
                  Total Email Queue
                </span>

                <span
                  className="
                    text-2xl
                    font-bold
                    text-slate-950
                  "
                >
                  {emailQueueCount}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* =================================================
            CAMPAIGN TABLE
        ================================================= */}

        <section
          className="
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              border-b
              border-slate-200
              p-6
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div>
              <h2
                className="
                  text-lg
                  font-bold
                  text-slate-950
                "
              >
                Campaign Performance
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Recent campaign lead and
                conversion performance.
              </p>
            </div>

            <Link
              href="/admin/marketing/campaigns"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-blue-600
                hover:text-blue-700
              "
            >
              View Campaigns

              <ArrowRight size={16} />
            </Link>
          </div>

          {campaigns.length === 0 ? (
            <div
              className="
                p-12
                text-center
              "
            >
              <Megaphone
                className="
                  mx-auto
                  text-slate-300
                "
                size={36}
              />

              <h3
                className="
                  mt-4
                  font-semibold
                  text-slate-900
                "
              >
                No campaigns found
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Campaign performance will appear
                here after campaigns are created.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="
                  w-full
                  min-w-[900px]
                "
              >
                <thead>
                  <tr
                    className="
                      border-b
                      border-slate-200
                      bg-slate-50
                    "
                  >
                    <TableHeading>
                      Campaign
                    </TableHeading>

                    <TableHeading>
                      Channel
                    </TableHeading>

                    <TableHeading>
                      Status
                    </TableHeading>

                    <TableHeading>
                      Leads
                    </TableHeading>

                    <TableHeading>
                      Conversions
                    </TableHeading>

                    <TableHeading>
                      Conversion Rate
                    </TableHeading>

                    <TableHeading>
                      Created
                    </TableHeading>

                    <TableHeading>
                      Action
                    </TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {campaigns.map(
                    (campaign) => {
                      const conversionRate =
                        percentage(
                          campaign.conversions,
                          campaign.leads
                        )

                      return (
                        <tr
                          key={campaign.id}
                          className="
                            border-b
                            border-slate-100
                            last:border-b-0
                            hover:bg-slate-50/70
                          "
                        >
                          <TableCell>
                            <div
                              className="
                                font-semibold
                                text-slate-900
                              "
                            >
                              {campaign.title}
                            </div>
                          </TableCell>

                          <TableCell>
                            {formatChannel(
                              campaign.channel
                            )}
                          </TableCell>

                          <TableCell>
                            <StatusBadge
                              status={
                                campaign.status
                              }
                            />
                          </TableCell>

                          <TableCell>
                            {campaign.leads}
                          </TableCell>

                          <TableCell>
                            {
                              campaign.conversions
                            }
                          </TableCell>

                          <TableCell>
                            <span
                              className="
                                font-semibold
                                text-green-600
                              "
                            >
                              {conversionRate}%
                            </span>
                          </TableCell>

                          <TableCell>
                            {formatDate(
                              campaign.createdAt
                            )}
                          </TableCell>

                          <TableCell>
                            <Link
                              href={`/admin/marketing/campaigns/${campaign.id}`}
                              className="
                                inline-flex
                                items-center
                                gap-1
                                font-semibold
                                text-blue-600
                                hover:text-blue-700
                              "
                            >
                              View

                              <ArrowRight
                                size={14}
                              />
                            </Link>
                          </TableCell>
                        </tr>
                      )
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  label,
  value,
  description,
  icon
}: {
  label: string
  value: string | number
  description: string
  icon: React.ReactNode
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
        "
      >
        <div>
          <p
            className="
              text-sm
              text-slate-500
            "
          >
            {label}
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-slate-950
            "
          >
            {value}
          </p>
        </div>

        <div
          className="
            rounded-2xl
            bg-blue-50
            p-3
            text-blue-600
          "
        >
          {icon}
        </div>
      </div>

      <p
        className="
          mt-4
          text-sm
          text-slate-500
        "
      >
        {description}
      </p>
    </div>
  )
}

/* =========================================================
   SMALL METRIC
========================================================= */

function SmallMetric({
  label,
  value,
  subtext,
  icon
}: {
  label: string
  value: string | number
  subtext: string
  icon: React.ReactNode
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
      "
    >
      <div
        className="
          rounded-xl
          bg-green-50
          p-3
          text-green-600
        "
      >
        {icon}
      </div>

      <div>
        <p
          className="
            text-sm
            text-slate-500
          "
        >
          {label}
        </p>

        <p
          className="
            text-xl
            font-bold
            text-slate-950
          "
        >
          {value}
        </p>

        <p
          className="
            text-xs
            text-slate-400
          "
        >
          {subtext}
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   PERFORMANCE STAT
========================================================= */

function PerformanceStat({
  label,
  value
}: {
  label: string
  value: number
}) {
  return (
    <div
      className="
        rounded-2xl
        bg-slate-50
        p-4
      "
    >
      <p
        className="
          text-xs
          font-medium
          text-slate-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-2xl
          font-bold
          text-slate-950
        "
      >
        {value}
      </p>
    </div>
  )
}

/* =========================================================
   RATE CARD
========================================================= */

function RateCard({
  label,
  value,
  icon
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-slate-200
        p-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            rounded-xl
            bg-blue-50
            p-2
            text-blue-600
          "
        >
          {icon}
        </div>

        <span
          className="
            text-sm
            font-medium
            text-slate-600
          "
        >
          {label}
        </span>
      </div>

      <span
        className="
          text-xl
          font-bold
          text-slate-950
        "
      >
        {value}%
      </span>
    </div>
  )
}

/* =========================================================
   PROGRESS ROW
========================================================= */

function ProgressRow({
  label,
  value,
  total
}: {
  label: string
  value: number
  total: number
}) {
  const rate = percentage(
    value,
    total
  )

  return (
    <div>
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          text-sm
        "
      >
        <span
          className="
            font-medium
            text-slate-600
          "
        >
          {label}
        </span>

        <span
          className="
            font-semibold
            text-slate-900
          "
        >
          {value} ({rate}%)
        </span>
      </div>

      <div
        className="
          h-2
          overflow-hidden
          rounded-full
          bg-slate-100
        "
      >
        <div
          className="
            h-full
            rounded-full
            bg-blue-600
          "
          style={{
            width: `${Math.min(
              rate,
              100
            )}%`
          }}
        />
      </div>
    </div>
  )
}

/* =========================================================
   TABLE
========================================================= */

function TableHeading({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <th
      className="
        px-5
        py-4
        text-left
        text-xs
        font-semibold
        uppercase
        tracking-wide
        text-slate-500
      "
    >
      {children}
    </th>
  )
}

function TableCell({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <td
      className="
        px-5
        py-4
        text-sm
        text-slate-600
      "
    >
      {children}
    </td>
  )
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
  status
}: {
  status: string
}) {
  const className =
    status === "running"
      ? "bg-green-50 text-green-700"
      : status === "completed"
        ? "bg-blue-50 text-blue-700"
        : status === "paused"
          ? "bg-orange-50 text-orange-700"
          : status === "cancelled"
            ? "bg-red-50 text-red-700"
            : "bg-slate-100 text-slate-700"

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${className}
      `}
    >
      {formatStatus(status)}
    </span>
  )
}