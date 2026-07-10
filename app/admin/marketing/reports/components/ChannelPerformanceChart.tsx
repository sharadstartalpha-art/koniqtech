"use client"

import {
  BarChart3,
  Mail,
  MessageSquare,
  Megaphone,
  Share2,
  Target,
  TrendingUp,
  Users
} from "lucide-react"

/* =========================================================
   TYPES
========================================================= */

export type ChannelPerformanceItem = {
  channel: string
  campaigns: number
  leads: number
  conversions: number
}

type ChannelPerformanceChartProps = {
  channels: ChannelPerformanceItem[]
}

/* =========================================================
   HELPERS
========================================================= */

function calculateRate(
  conversions: number,
  leads: number
) {
  if (leads <= 0) {
    return 0
  }

  return Math.round(
    (conversions / leads) * 100
  )
}

function formatChannel(
  channel: string
) {
  return channel
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    )
}

function getChannelIcon(
  channel: string
) {
  switch (
    channel.toLowerCase()
  ) {
    case "email":
      return <Mail size={18} />

    case "sms":
      return (
        <MessageSquare size={18} />
      )

    case "social":
      return <Share2 size={18} />

    case "ads":
    case "paid_ads":
      return (
        <Megaphone size={18} />
      )

    case "webinar":
      return <Users size={18} />

    default:
      return <Target size={18} />
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ChannelPerformanceChart({
  channels
}: ChannelPerformanceChartProps) {
  const totalCampaigns =
    channels.reduce(
      (total, channel) =>
        total + channel.campaigns,
      0
    )

  const totalLeads =
    channels.reduce(
      (total, channel) =>
        total + channel.leads,
      0
    )

  const totalConversions =
    channels.reduce(
      (total, channel) =>
        total +
        channel.conversions,
      0
    )

  const overallRate =
    calculateRate(
      totalConversions,
      totalLeads
    )

  const highestLeadCount =
    Math.max(
      1,
      ...channels.map(
        (channel) =>
          channel.leads
      )
    )

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (channels.length === 0) {
    return (
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
        <Header />

        <div
          className="
            flex
            min-h-[320px]
            flex-col
            items-center
            justify-center
            px-6
            py-12
            text-center
          "
        >
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-3xl
              bg-green-50
              text-green-600
            "
          >
            <TrendingUp size={28} />
          </div>

          <h3
            className="
              mt-5
              text-lg
              font-bold
              text-slate-950
            "
          >
            No channel data
          </h3>

          <p
            className="
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-slate-500
            "
          >
            Channel performance will appear
            after campaigns receive leads and
            conversions.
          </p>
        </div>
      </section>
    )
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
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
      <Header />

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div
        className="
          grid
          border-b
          border-slate-100
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <SummaryItem
          label="Campaigns"
          value={totalCampaigns}
        />

        <SummaryItem
          label="Leads"
          value={totalLeads}
        />

        <SummaryItem
          label="Conversions"
          value={totalConversions}
        />

        <SummaryItem
          label="Overall Rate"
          value={`${overallRate}%`}
        />
      </div>

      {/* =================================================
          CHANNEL LIST
      ================================================= */}

      <div
        className="
          space-y-4
          p-6
        "
      >
        {channels.map(
          (channel) => {
            const rate =
              calculateRate(
                channel.conversions,
                channel.leads
              )

            const leadWidth =
              channel.leads > 0
                ? Math.max(
                    4,
                    (
                      channel.leads /
                      highestLeadCount
                    ) * 100
                  )
                : 0

            return (
              <article
                key={channel.channel}
                className="
                  rounded-2xl
                  border
                  border-slate-100
                  bg-slate-50/60
                  p-4
                  transition
                  hover:border-slate-200
                  hover:bg-slate-50
                "
              >
                {/* CHANNEL HEADER */}

                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
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
                      {getChannelIcon(
                        channel.channel
                      )}
                    </div>

                    <div>
                      <h3
                        className="
                          text-sm
                          font-bold
                          text-slate-950
                        "
                      >
                        {formatChannel(
                          channel.channel
                        )}
                      </h3>

                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-slate-500
                        "
                      >
                        {channel.campaigns.toLocaleString()}{" "}
                        {channel.campaigns === 1
                          ? "campaign"
                          : "campaigns"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className="
                        rounded-full
                        bg-green-50
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-green-700
                      "
                    >
                      {rate}% conversion
                    </span>
                  </div>
                </div>

                {/* PERFORMANCE BAR */}

                <div className="mt-5">
                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >
                    <span
                      className="
                        text-xs
                        font-medium
                        text-slate-500
                      "
                    >
                      Lead Performance
                    </span>

                    <span
                      className="
                        text-sm
                        font-bold
                        text-slate-900
                      "
                    >
                      {channel.leads.toLocaleString()}
                    </span>
                  </div>

                  <div
                    className="
                      h-3
                      overflow-hidden
                      rounded-full
                      bg-slate-200
                    "
                  >
                    <div
                      className="
                        h-full
                        rounded-full
                        bg-blue-500
                        transition-all
                        duration-500
                      "
                      style={{
                        width: `${leadWidth}%`
                      }}
                    />
                  </div>
                </div>

                {/* METRICS */}

                <div
                  className="
                    mt-4
                    grid
                    grid-cols-3
                    gap-3
                  "
                >
                  <Metric
                    label="Leads"
                    value={
                      channel.leads
                    }
                  />

                  <Metric
                    label="Converted"
                    value={
                      channel.conversions
                    }
                  />

                  <Metric
                    label="Rate"
                    value={`${rate}%`}
                  />
                </div>
              </article>
            )
          }
        )}
      </div>
    </section>
  )
}

/* =========================================================
   HEADER
========================================================= */

function Header() {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        border-b
        border-slate-100
        px-6
        py-5
        sm:flex-row
        sm:items-center
        sm:justify-between
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
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            bg-green-50
            text-green-600
          "
        >
          <TrendingUp size={20} />
        </div>

        <div>
          <h2
            className="
              font-bold
              text-slate-950
            "
          >
            Channel Performance
          </h2>

          <p
            className="
              mt-0.5
              text-sm
              text-slate-500
            "
          >
            Compare campaign leads and
            conversions across channels.
          </p>
        </div>
      </div>

      <div
        className="
          flex
          items-center
          gap-2
          rounded-xl
          bg-slate-50
          px-3
          py-2
          text-xs
          font-medium
          text-slate-500
        "
      >
        <BarChart3 size={15} />

        {channelsLabel()}
      </div>
    </div>
  )
}

/* =========================================================
   CHANNEL LABEL
========================================================= */

function channelsLabel() {
  return "Channel comparison"
}

/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  label,
  value
}: {
  label: string
  value: number | string
}) {
  return (
    <div
      className="
        border-b
        border-slate-100
        px-5
        py-4
        last:border-b-0
        sm:border-r
        xl:border-b-0
        xl:last:border-r-0
      "
    >
      <p
        className="
          text-xs
          text-slate-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-xl
          font-bold
          text-slate-950
        "
      >
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
      </p>
    </div>
  )
}

/* =========================================================
   METRIC
========================================================= */

function Metric({
  label,
  value
}: {
  label: string
  value: number | string
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-100
        bg-white
        px-3
        py-3
      "
    >
      <p
        className="
          text-[11px]
          font-medium
          uppercase
          tracking-wide
          text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-sm
          font-bold
          text-slate-900
        "
      >
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
      </p>
    </div>
  )
}