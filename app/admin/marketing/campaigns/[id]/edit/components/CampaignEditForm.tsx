"use client"

import Link from "next/link"

import {
  FormEvent,
  useState,
  useTransition,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  CampaignChannel,
  CampaignStatus,
} from "@prisma/client"

import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Loader2,
  Mail,
  Megaphone,
  MessageSquare,
  MousePointerClick,
  Radio,
  Save,
  Video,
} from "lucide-react"

import {
  updateCampaignAction,
  type UpdateCampaignInput,
} from "../../../actions"

/* =========================================================
   TYPES
========================================================= */

type CampaignEditData = {
  id: string

  title: string

  channel: CampaignChannel

  budget: string

  startDate: string

  endDate: string

  status: CampaignStatus
}

type CampaignEditFormProps = {
  campaign: CampaignEditData
}

/* =========================================================
   HELPERS
========================================================= */

function formatLabel(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    )
}

/* =========================================================
   CHANNEL OPTIONS
========================================================= */

const CHANNEL_OPTIONS = [
  {
    value:
      CampaignChannel.email,

    label:
      "Email",

    description:
      "Email outreach and nurture campaigns",

    icon:
      Mail,
  },

  {
    value:
      CampaignChannel.social,

    label:
      "Social",

    description:
      "Organic social media campaigns",

    icon:
      Radio,
  },

  {
    value:
      CampaignChannel.ads,

    label:
      "Paid Ads",

    description:
      "Paid advertising and acquisition campaigns",

    icon:
      MousePointerClick,
  },

  {
    value:
      CampaignChannel.sms,

    label:
      "SMS",

    description:
      "Text message outreach campaigns",

    icon:
      MessageSquare,
  },

  {
    value:
      CampaignChannel.webinar,

    label:
      "Webinar",

    description:
      "Webinar and online event campaigns",

    icon:
      Video,
  },
] satisfies Array<{
  value: CampaignChannel
  label: string
  description: string
  icon: typeof Mail
}>

/* =========================================================
   STATUS OPTIONS
========================================================= */

const STATUS_OPTIONS: CampaignStatus[] = [
  CampaignStatus.draft,
  CampaignStatus.running,
  CampaignStatus.paused,
  CampaignStatus.completed,
  CampaignStatus.cancelled,
]

/* =========================================================
   COMPONENT
========================================================= */

export default function CampaignEditForm({
  campaign,
}: CampaignEditFormProps) {
  const router =
    useRouter()

  const [
    isPending,
    startTransition,
  ] = useTransition()

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [
    title,
    setTitle,
  ] =
    useState(
      campaign.title
    )

  const [
    channel,
    setChannel,
  ] =
    useState<CampaignChannel>(
      campaign.channel
    )

  const [
    budget,
    setBudget,
  ] =
    useState(
      campaign.budget
    )

  const [
    startDate,
    setStartDate,
  ] =
    useState(
      campaign.startDate
    )

  const [
    endDate,
    setEndDate,
  ] =
    useState(
      campaign.endDate
    )

  const [
    status,
    setStatus,
  ] =
    useState<CampaignStatus>(
      campaign.status
    )

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    )

  const [
    success,
    setSuccess,
  ] =
    useState<string | null>(
      null
    )

  /* =======================================================
     DIRTY STATE
  ======================================================= */

  const hasChanges =
    title.trim() !==
      campaign.title ||
    channel !==
      campaign.channel ||
    budget !==
      campaign.budget ||
    startDate !==
      campaign.startDate ||
    endDate !==
      campaign.endDate ||
    status !==
      campaign.status

  /* =======================================================
     SUBMIT
  ======================================================= */

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError(null)
    setSuccess(null)

    /* -----------------------------------------------------
       TITLE VALIDATION
    ----------------------------------------------------- */

    if (!title.trim()) {
      setError(
        "Campaign title is required."
      )

      return
    }

    /* -----------------------------------------------------
       BUDGET VALIDATION
    ----------------------------------------------------- */

    if (
      budget.trim() &&
      (
        Number.isNaN(
          Number(budget)
        ) ||
        Number(budget) < 0
      )
    ) {
      setError(
        "Campaign budget must be zero or greater."
      )

      return
    }

    /* -----------------------------------------------------
       DATE VALIDATION
    ----------------------------------------------------- */

    if (
      startDate &&
      endDate &&
      new Date(endDate) <
        new Date(startDate)
    ) {
      setError(
        "End date cannot be before start date."
      )

      return
    }

    /* -----------------------------------------------------
       ACTION INPUT
    ----------------------------------------------------- */

    const input:
      UpdateCampaignInput = {
        title:
          title.trim(),

        channel,

        budget:
          budget.trim()
            ? Number(budget)
            : null,

        startDate:
          startDate || null,

        endDate:
          endDate || null,

        status,
      }

    /* -----------------------------------------------------
       UPDATE
    ----------------------------------------------------- */

    startTransition(
      async () => {
        try {
          const result =
            await updateCampaignAction(
              campaign.id,
              input
            )

          if (!result.success) {
            setError(
              result.message
            )

            return
          }

          setSuccess(
            result.message
          )

          router.push(
            `/admin/marketing/campaigns/${campaign.id}`
          )

          router.refresh()
        } catch (actionError) {
          console.error(
            "Campaign update error:",
            actionError
          )

          setError(
            "Unable to update campaign."
          )
        }
      }
    )
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* =================================================
          FEEDBACK
      ================================================= */}

      {error && (
        <div
          role="alert"
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            font-medium
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="
            rounded-xl
            border
            border-green-200
            bg-green-50
            px-4
            py-3
            text-sm
            font-medium
            text-green-700
          "
        >
          {success}
        </div>
      )}

      {/* =================================================
          CAMPAIGN INFORMATION
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
        <div
          className="
            border-b
            border-slate-200
            px-6
            py-5
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
              <Megaphone className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-950">
                Campaign Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the campaign name
                and current operational
                status.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
          {/* TITLE */}

          <div>
            <label
              htmlFor="campaign-title"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Campaign Title

              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              id="campaign-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              disabled={isPending}
              placeholder="Campaign title"
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-400
                focus:ring-4
                focus:ring-blue-50
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            />

            <p className="mt-2 text-xs text-slate-400">
              Use a descriptive campaign
              name that identifies the
              target audience or objective.
            </p>
          </div>

          {/* STATUS */}

          <div>
            <label
              htmlFor="campaign-status"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Campaign Status
            </label>

            <select
              id="campaign-status"
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target
                    .value as CampaignStatus
                )
              }
              disabled={isPending}
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-sm
                text-slate-700
                outline-none
                transition
                focus:border-blue-400
                focus:ring-4
                focus:ring-blue-50
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            >
              {STATUS_OPTIONS.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {formatLabel(
                      option
                    )}
                  </option>
                )
              )}
            </select>

            <p className="mt-2 text-xs text-slate-400">
              Current campaign lifecycle
              status.
            </p>
          </div>
        </div>

        {/* STATUS INFORMATION */}

        {status ===
          CampaignStatus.running && (
          <div
            className="
              mx-6
              mb-6
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-4
              py-3
              text-sm
              text-green-700
            "
          >
            This campaign is currently
            marked as running.
          </div>
        )}

        {status ===
          CampaignStatus.paused && (
          <div
            className="
              mx-6
              mb-6
              rounded-xl
              border
              border-orange-200
              bg-orange-50
              px-4
              py-3
              text-sm
              text-orange-700
            "
          >
            This campaign is paused.
            Existing lead attribution
            remains unchanged.
          </div>
        )}

        {status ===
          CampaignStatus.cancelled && (
          <div
            className="
              mx-6
              mb-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-700
            "
          >
            This campaign is marked as
            cancelled. Historical
            campaign records will remain
            available.
          </div>
        )}
      </section>

      {/* =================================================
          CAMPAIGN CHANNEL
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
        <div
          className="
            border-b
            border-slate-200
            px-6
            py-5
          "
        >
          <h2 className="font-bold text-slate-950">
            Campaign Channel
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Change the primary marketing
            channel used by this campaign.
          </p>
        </div>

        <div
          className="
            grid
            gap-3
            p-6
            sm:grid-cols-2
            xl:grid-cols-5
          "
        >
          {CHANNEL_OPTIONS.map(
            (option) => {
              const Icon =
                option.icon

              const selected =
                channel ===
                option.value

              return (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  disabled={
                    isPending
                  }
                  onClick={() =>
                    setChannel(
                      option.value
                    )
                  }
                  className={`
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    ${
                      selected
                        ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                    }
                  `}
                >
                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <p
                    className="
                      mt-4
                      text-sm
                      font-bold
                      text-slate-950
                    "
                  >
                    {option.label}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-slate-500
                    "
                  >
                    {
                      option.description
                    }
                  </p>
                </button>
              )
            }
          )}
        </div>
      </section>

      {/* =================================================
          BUDGET AND SCHEDULE
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
        <div
          className="
            border-b
            border-slate-200
            px-6
            py-5
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
                bg-orange-50
                text-orange-600
              "
            >
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-950">
                Budget & Schedule
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update campaign budget
                and active dates.
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            grid
            gap-6
            p-6
            md:grid-cols-3
          "
        >
          {/* BUDGET */}

          <div>
            <label
              htmlFor="campaign-budget"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Budget
            </label>

            <div className="relative">
              <CircleDollarSign
                className="
                  pointer-events-none
                  absolute
                  left-3.5
                  top-1/2
                  h-5
                  w-5
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="campaign-budget"
                type="number"
                min="0"
                step="0.01"
                value={budget}
                onChange={(event) =>
                  setBudget(
                    event.target.value
                  )
                }
                disabled={isPending}
                placeholder="5000"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  pl-11
                  pr-4
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-400
                  focus:ring-4
                  focus:ring-blue-50
                  disabled:cursor-not-allowed
                  disabled:bg-slate-50
                "
              />
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Campaign budget in USD.
            </p>
          </div>

          {/* START DATE */}

          <div>
            <label
              htmlFor="campaign-start-date"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Start Date
            </label>

            <input
              id="campaign-start-date"
              type="date"
              value={startDate}
              onChange={(event) =>
                setStartDate(
                  event.target.value
                )
              }
              disabled={isPending}
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-sm
                text-slate-700
                outline-none
                transition
                focus:border-blue-400
                focus:ring-4
                focus:ring-blue-50
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            />
          </div>

          {/* END DATE */}

          <div>
            <label
              htmlFor="campaign-end-date"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              End Date
            </label>

            <input
              id="campaign-end-date"
              type="date"
              value={endDate}
              min={
                startDate ||
                undefined
              }
              onChange={(event) =>
                setEndDate(
                  event.target.value
                )
              }
              disabled={isPending}
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-sm
                text-slate-700
                outline-none
                transition
                focus:border-blue-400
                focus:ring-4
                focus:ring-blue-50
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            />
          </div>
        </div>
      </section>

      {/* =================================================
          ACTION BAR
      ================================================= */}

      <div
        className="
          flex
          flex-col-reverse
          gap-3
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <Link
          href={`/admin/marketing/campaigns/${campaign.id}`}
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
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Cancel
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {!hasChanges && (
            <span className="text-xs text-slate-400">
              No unsaved changes
            </span>
          )}

          <button
            type="submit"
            disabled={
              isPending ||
              !hasChanges
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-green-600
              px-6
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-green-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />

                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}