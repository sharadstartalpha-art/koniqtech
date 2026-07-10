"use client"

import {
  BarChart3,
  Megaphone,
  Target,
  TrendingUp
} from "lucide-react"

/* =========================================================
   TYPES
========================================================= */

export type CampaignChartItem = {
  id: string
  title: string
  channel: string
  leads: number
  conversions: number
}

type CampaignChartProps = {
  campaigns: CampaignChartItem[]
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

function getBarWidth(
  value: number,
  maximum: number
) {
  if (maximum <= 0) {
    return 0
  }

  return Math.min(
    100,
    Math.max(
      0,
      (value / maximum) * 100
    )
  )
}

/* =========================================================
   COMPONENT
========================================================= */

export default function CampaignChart({
  campaigns
}: CampaignChartProps) {
  const maximumValue = Math.max(
    1,
    ...campaigns.flatMap(
      (campaign) => [
        campaign.leads,
        campaign.conversions
      ]
    )
  )

  const totalLeads =
    campaigns.reduce(
      (total, campaign) =>
        total + campaign.leads,
      0
    )

  const totalConversions =
    campaigns.reduce(
      (total, campaign) =>
        total + campaign.conversions,
      0
    )

  const overallConversionRate =
    calculateRate(
      totalConversions,
      totalLeads
    )

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (campaigns.length === 0) {
    return (
      <section
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div
          className="
            border-b
            border-slate-100
            px-6
            py-5
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
                bg-blue-50
                text-blue-600
              "
            >
              <BarChart3 size={20} />
            </div>

            <div>
              <h2
                className="
                  font-bold
                  text-slate-950
                "
              >
                Campaign Performance
              </h2>

              <p
                className="
                  mt-0.5
                  text-sm
                  text-slate-500
                "
              >
                Leads and conversions by campaign.
              </p>
            </div>
          </div>
        </div>

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
              bg-blue-50
              text-blue-600
            "
          >
            <Megaphone size={28} />
          </div>

          <h3
            className="
              mt-5
              text-lg
              font-bold
              text-slate-950
            "
          >
            No campaign data
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
            Campaign performance will appear here
            when campaigns start receiving attributed
            leads and conversions.
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
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-slate-100
          px-6
          py-5
          lg:flex-row
          lg:items-center
          lg:justify-between
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
              bg-blue-50
              text-blue-600
            "
          >
            <BarChart3 size={20} />
          </div>

          <div>
            <h2
              className="
                font-bold
                text-slate-950
              "
            >
              Campaign Performance
            </h2>

            <p
              className="
                mt-0.5
                text-sm
                text-slate-500
              "
            >
              Leads and conversions by campaign.
            </p>
          </div>
        </div>

        {/* LEGEND */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-4
            text-xs
            font-medium
            text-slate-500
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                h-3
                w-3
                rounded-full
                bg-blue-500
              "
            />

            Leads
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
                h-3
                w-3
                rounded-full
                bg-green-500
              "
            />

            Conversions
          </div>
        </div>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div
        className="
          grid
          border-b
          border-slate-100
          sm:grid-cols-3
        "
      >
        <SummaryItem
          icon={
            <Target size={18} />
          }
          label="Campaign Leads"
          value={totalLeads}
          iconClassName="
            bg-blue-50
            text-blue-600
          "
        />

        <SummaryItem
          icon={
            <TrendingUp size={18} />
          }
          label="Conversions"
          value={totalConversions}
          iconClassName="
            bg-green-50
            text-green-600
          "
        />

        <SummaryItem
          icon={
            <BarChart3 size={18} />
          }
          label="Conversion Rate"
          value={`${overallConversionRate}%`}
          iconClassName="
            bg-orange-50
            text-orange-600
          "
        />
      </div>

      {/* =================================================
          CAMPAIGN BARS
      ================================================= */}

      <div
        className="
          max-h-[520px]
          space-y-6
          overflow-y-auto
          p-6
        "
      >
        {campaigns.map(
          (campaign) => {
            const conversionRate =
              calculateRate(
                campaign.conversions,
                campaign.leads
              )

            const leadWidth =
              getBarWidth(
                campaign.leads,
                maximumValue
              )

            const conversionWidth =
              getBarWidth(
                campaign.conversions,
                maximumValue
              )

            return (
              <article
                key={campaign.id}
                className="
                  rounded-2xl
                  border
                  border-slate-100
                  bg-slate-50/60
                  p-4
                "
              >
                {/* CAMPAIGN HEADER */}

                <div
                  className="
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div
                    className="
                      min-w-0
                    "
                  >
                    <h3
                      className="
                        truncate
                        text-sm
                        font-bold
                        text-slate-900
                      "
                    >
                      {campaign.title}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                      "
                    >
                      {formatChannel(
                        campaign.channel
                      )}
                    </p>
                  </div>

                  <div
                    className="
                      shrink-0
                      rounded-full
                      bg-green-50
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-green-700
                    "
                  >
                    {conversionRate}% conversion
                  </div>
                </div>

                {/* BAR AREA */}

                <div
                  className="
                    mt-5
                    space-y-4
                  "
                >
                  {/* LEADS */}

                  <ChartBar
                    label="Leads"
                    value={campaign.leads}
                    width={leadWidth}
                    barClassName="bg-blue-500"
                  />

                  {/* CONVERSIONS */}

                  <ChartBar
                    label="Conversions"
                    value={
                      campaign.conversions
                    }
                    width={conversionWidth}
                    barClassName="bg-green-500"
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
   CHART BAR
========================================================= */

function ChartBar({
  label,
  value,
  width,
  barClassName
}: {
  label: string
  value: number
  width: number
  barClassName: string
}) {
  return (
    <div>
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
          {label}
        </span>

        <span
          className="
            text-sm
            font-bold
            text-slate-900
          "
        >
          {value.toLocaleString()}
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
          className={`
            h-full
            rounded-full
            transition-all
            duration-500
            ${barClassName}
          `}
          style={{
            width: `${width}%`
          }}
        />
      </div>
    </div>
  )
}

/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  icon,
  label,
  value,
  iconClassName
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  iconClassName: string
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        border-b
        border-slate-100
        px-5
        py-4
        last:border-b-0
        sm:border-b-0
        sm:border-r
        sm:last:border-r-0
      "
    >
      <div
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${iconClassName}
        `}
      >
        {icon}
      </div>

      <div>
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
            mt-0.5
            text-lg
            font-bold
            text-slate-950
          "
        >
          {typeof value === "number"
            ? value.toLocaleString()
            : value}
        </p>
      </div>
    </div>
  )
}