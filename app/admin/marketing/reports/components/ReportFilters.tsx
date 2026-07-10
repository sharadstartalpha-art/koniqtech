"use client"

import {
  usePathname,
  useRouter,
  useSearchParams
} from "next/navigation"

import {
  useMemo,
  useState,
  useTransition
} from "react"

import {
  CalendarDays,
  Filter,
  RefreshCcw,
  Search
} from "lucide-react"

/* =========================================================
   TYPES
========================================================= */

type ReportScope =
  | "all"
  | "campaigns"
  | "newsletters"
  | "demos"
  | "email"

type CampaignChannel =
  | "all"
  | "email"
  | "sms"
  | "social"
  | "paid_ads"
  | "organic"
  | "referral"
  | "other"

type ReportFiltersProps = {
  initialFrom?: string
  initialTo?: string
  initialChannel?: string
  initialScope?: string
}

/* =========================================================
   DATE HELPERS
========================================================= */

function toDateInputValue(
  date: Date
) {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0")

  const day = String(
    date.getDate()
  ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getDefaultFromDate() {
  const date = new Date()

  date.setDate(
    date.getDate() - 30
  )

  return toDateInputValue(date)
}

function getDefaultToDate() {
  return toDateInputValue(
    new Date()
  )
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ReportFilters({
  initialFrom,
  initialTo,
  initialChannel,
  initialScope
}: ReportFiltersProps) {
  const router = useRouter()

  const pathname = usePathname()

  const searchParams =
    useSearchParams()

  const [
    isPending,
    startTransition
  ] = useTransition()

  /* =======================================================
     STATE
  ======================================================= */

  const [from, setFrom] =
    useState(
      initialFrom ||
        searchParams.get("from") ||
        getDefaultFromDate()
    )

  const [to, setTo] =
    useState(
      initialTo ||
        searchParams.get("to") ||
        getDefaultToDate()
    )

  const [channel, setChannel] =
    useState<CampaignChannel>(
      (
        initialChannel ||
        searchParams.get("channel") ||
        "all"
      ) as CampaignChannel
    )

  const [scope, setScope] =
    useState<ReportScope>(
      (
        initialScope ||
        searchParams.get("scope") ||
        "all"
      ) as ReportScope
    )

  /* =======================================================
     ACTIVE FILTER COUNT
  ======================================================= */

  const activeFilterCount =
    useMemo(() => {
      let count = 0

      if (
        channel !== "all"
      ) {
        count++
      }

      if (
        scope !== "all"
      ) {
        count++
      }

      if (
        from !== getDefaultFromDate() ||
        to !== getDefaultToDate()
      ) {
        count++
      }

      return count
    }, [
      channel,
      scope,
      from,
      to
    ])

  /* =======================================================
     APPLY FILTERS
  ======================================================= */

  function applyFilters() {
    const params =
      new URLSearchParams(
        searchParams.toString()
      )

    if (from) {
      params.set(
        "from",
        from
      )
    } else {
      params.delete("from")
    }

    if (to) {
      params.set(
        "to",
        to
      )
    } else {
      params.delete("to")
    }

    if (
      channel !== "all"
    ) {
      params.set(
        "channel",
        channel
      )
    } else {
      params.delete(
        "channel"
      )
    }

    if (
      scope !== "all"
    ) {
      params.set(
        "scope",
        scope
      )
    } else {
      params.delete(
        "scope"
      )
    }

    startTransition(() => {
      router.push(
        `${pathname}?${params.toString()}`
      )
    })
  }

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  function resetFilters() {
    const defaultFrom =
      getDefaultFromDate()

    const defaultTo =
      getDefaultToDate()

    setFrom(defaultFrom)

    setTo(defaultTo)

    setChannel("all")

    setScope("all")

    startTransition(() => {
      router.push(pathname)
    })
  }

  /* =======================================================
     QUICK RANGE
  ======================================================= */

  function setQuickRange(
    days: number
  ) {
    const end = new Date()

    const start = new Date()

    start.setDate(
      start.getDate() - days
    )

    setFrom(
      toDateInputValue(start)
    )

    setTo(
      toDateInputValue(end)
    )
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <section
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >
      {/* =================================================
          TOP ROW
      ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          xl:flex-row
          xl:items-center
          xl:justify-between
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
            <Filter size={20} />
          </div>

          <div>
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <h2
                className="
                  font-bold
                  text-slate-950
                "
              >
                Report Filters
              </h2>

              {activeFilterCount > 0 && (
                <span
                  className="
                    rounded-full
                    bg-blue-100
                    px-2
                    py-0.5
                    text-xs
                    font-semibold
                    text-blue-700
                  "
                >
                  {activeFilterCount} active
                </span>
              )}
            </div>

            <p
              className="
                mt-0.5
                text-sm
                text-slate-500
              "
            >
              Filter marketing performance
              by period, channel, and activity.
            </p>
          </div>
        </div>

        {/* QUICK DATE RANGES */}

        <div
          className="
            flex
            flex-wrap
            gap-2
          "
        >
          <QuickRangeButton
            label="7 Days"
            onClick={() =>
              setQuickRange(7)
            }
          />

          <QuickRangeButton
            label="30 Days"
            onClick={() =>
              setQuickRange(30)
            }
          />

          <QuickRangeButton
            label="90 Days"
            onClick={() =>
              setQuickRange(90)
            }
          />

          <QuickRangeButton
            label="1 Year"
            onClick={() =>
              setQuickRange(365)
            }
          />
        </div>
      </div>

      {/* =================================================
          FILTER FIELDS
      ================================================= */}

      <div
        className="
          mt-5
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {/* FROM */}

        <FilterField
          label="From Date"
        >
          <div className="relative">
            <CalendarDays
              size={17}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(event) =>
                setFrom(
                  event.target.value
                )
              }
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                pl-10
                pr-3
                text-sm
                text-slate-700
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-50
              "
            />
          </div>
        </FilterField>

        {/* TO */}

        <FilterField
          label="To Date"
        >
          <div className="relative">
            <CalendarDays
              size={17}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(event) =>
                setTo(
                  event.target.value
                )
              }
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                pl-10
                pr-3
                text-sm
                text-slate-700
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-50
              "
            />
          </div>
        </FilterField>

        {/* CHANNEL */}

        <FilterField
          label="Campaign Channel"
        >
          <select
            value={channel}
            onChange={(event) =>
              setChannel(
                event.target
                  .value as CampaignChannel
              )
            }
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-50
            "
          >
            <option value="all">
              All Channels
            </option>

            <option value="email">
              Email
            </option>

            <option value="sms">
              SMS
            </option>

            <option value="social">
              Social Media
            </option>

            <option value="paid_ads">
              Paid Ads
            </option>

            <option value="organic">
              Organic
            </option>

            <option value="referral">
              Referral
            </option>

            <option value="other">
              Other
            </option>
          </select>
        </FilterField>

        {/* SCOPE */}

        <FilterField
          label="Report Scope"
        >
          <select
            value={scope}
            onChange={(event) =>
              setScope(
                event.target
                  .value as ReportScope
              )
            }
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-50
            "
          >
            <option value="all">
              All Marketing
            </option>

            <option value="campaigns">
              Campaigns
            </option>

            <option value="newsletters">
              Newsletters
            </option>

            <option value="demos">
              Demos
            </option>

            <option value="email">
              Email Delivery
            </option>
          </select>
        </FilterField>
      </div>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <div
        className="
          mt-5
          flex
          flex-col
          gap-3
          border-t
          border-slate-100
          pt-5
          sm:flex-row
          sm:items-center
          sm:justify-end
        "
      >
        <button
          type="button"
          onClick={resetFilters}
          disabled={isPending}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-orange-200
            bg-orange-50
            px-5
            text-sm
            font-semibold
            text-orange-700
            transition
            hover:bg-orange-100
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <RefreshCcw
            size={16}
            className={
              isPending
                ? "animate-spin"
                : ""
            }
          />

          Reset
        </button>

        <button
          type="button"
          onClick={applyFilters}
          disabled={isPending}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-6
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Search size={16} />

          {isPending
            ? "Applying..."
            : "Apply Filters"}
        </button>
      </div>
    </section>
  )
}

/* =========================================================
   FILTER FIELD
========================================================= */

function FilterField({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="
          mb-2
          block
          text-xs
          font-semibold
          uppercase
          tracking-wide
          text-slate-500
        "
      >
        {label}
      </label>

      {children}
    </div>
  )
}

/* =========================================================
   QUICK RANGE BUTTON
========================================================= */

function QuickRangeButton({
  label,
  onClick
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        px-3
        py-2
        text-xs
        font-semibold
        text-slate-600
        transition
        hover:border-blue-200
        hover:bg-blue-50
        hover:text-blue-700
      "
    >
      {label}
    </button>
  )
}