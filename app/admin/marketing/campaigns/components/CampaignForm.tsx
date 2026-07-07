"use client"

import {
  useActionState,
  useEffect,
  useState,
} from "react"

import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Loader2,
  Megaphone,
  Save,
  Target,
} from "lucide-react"

import {
  createCampaignAction,
} from "../actions"

/* =========================================================
   TYPES
========================================================= */

type ActionState = {
  success: boolean
  message: string
  errors?: Record<
    string,
    string[]
  >
}

const initialState: ActionState = {
  success: false,
  message: "",
}

/* =========================================================
   CHANNEL OPTIONS

   IMPORTANT:
   Values must match your Prisma CampaignChannel enum.

   If your enum names are different, only change the
   "value" properties below.
========================================================= */

const CHANNEL_OPTIONS = [
  {
    value: "email",
    label: "Email",
    description:
      "Email campaigns and automated sequences",
  },
  {
    value: "social",
    label: "Social Media",
    description:
      "LinkedIn and social outreach campaigns",
  },
  {
    value: "ads",
    label: "Paid Ads",
    description:
      "Search and social advertising campaigns",
  },
  {
    value: "sms",
    label: "SMS",
    description:
      "Text message marketing campaigns",
  },
  {
    value: "webinar",
    label: "Webinar",
    description:
      "Online demos, webinars and educational events",
  },
]

/* =========================================================
   STATUS OPTIONS

   IMPORTANT:
   Values must match your Prisma CampaignStatus enum.

   Change these values if your schema uses different names.
========================================================= */

const STATUS_OPTIONS = [
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "running",
    label: "Running",
  },
  {
    value: "paused",
    label: "Paused",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
]
/* =========================================================
   COMPONENT
========================================================= */

export default function CampaignForm() {
  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    createCampaignAction,
    initialState
  )

  const [
    selectedChannel,
    setSelectedChannel,
  ] = useState("email")

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("draft")

  const [
    startDate,
    setStartDate,
  ] = useState("")

  const [
    endDate,
    setEndDate,
  ] = useState("")

  /* =======================================================
     SUCCESS MESSAGE
  ======================================================= */

  useEffect(() => {
    if (!state.success) {
      return
    }

    const timer = setTimeout(
      () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      },
      100
    )

    return () =>
      clearTimeout(timer)
  }, [state.success])

  /* =======================================================
     UI
  ======================================================= */

  return (
    <form
      action={formAction}
      className="space-y-8"
    >
      {/* ===================================================
          RESPONSE MESSAGE
      =================================================== */}

      {state.message && (
        <div
          className={`
            flex
            items-start
            gap-3
            rounded-xl
            border
            px-4
            py-3
            text-sm
            ${
              state.success
                ? `
                  border-green-200
                  bg-green-50
                  text-green-800
                `
                : `
                  border-red-200
                  bg-red-50
                  text-red-800
                `
            }
          `}
        >
          {state.success ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <Target className="mt-0.5 h-5 w-5 shrink-0" />
          )}

          <span>
            {state.message}
          </span>
        </div>
      )}

      {/* ===================================================
          BASIC INFORMATION
      =================================================== */}

      <section className="space-y-5">
        <SectionHeader
          icon={
            <Megaphone className="h-5 w-5" />
          }
          title="Basic Information"
          description="Define the campaign name and current status."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {/* TITLE */}

          <div className="md:col-span-2">
            <label
              htmlFor="title"
              className="text-sm font-semibold text-slate-800"
            >
              Campaign Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Example: Roofing Companies Q3 Outreach"
              className="
                mt-2
                h-11
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />

            <FieldError
              errors={
                state.errors?.title
              }
            />
          </div>

          {/* STATUS */}

          <div>
            <label
              htmlFor="status"
              className="text-sm font-semibold text-slate-800"
            >
              Campaign Status
            </label>

            <select
              id="status"
              name="status"
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value
                )
              }
              className="
                mt-2
                h-11
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            >
              {STATUS_OPTIONS.map(
                (status) => (
                  <option
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </option>
                )
              )}
            </select>

            <FieldError
              errors={
                state.errors?.status
              }
            />
          </div>

          {/* BUDGET */}

          <div>
            <label
              htmlFor="budget"
              className="text-sm font-semibold text-slate-800"
            >
              Campaign Budget
            </label>

            <div className="relative mt-2">
              <CircleDollarSign
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="budget"
                name="budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="5000"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  pl-10
                  pr-4
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              />
            </div>

            <FieldError
              errors={
                state.errors?.budget
              }
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ===================================================
          CHANNEL
      =================================================== */}

      <section className="space-y-5">
        <SectionHeader
          icon={
            <Target className="h-5 w-5" />
          }
          title="Campaign Channel"
          description="Choose the primary channel for this campaign."
        />

        <input
          type="hidden"
          name="channel"
          value={selectedChannel}
        />

        <div className="grid gap-3 md:grid-cols-2">
          {CHANNEL_OPTIONS.map(
            (channel) => {
              const selected =
                selectedChannel ===
                channel.value

              return (
                <button
                  key={channel.value}
                  type="button"
                  onClick={() =>
                    setSelectedChannel(
                      channel.value
                    )
                  }
                  className={`
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    ${
                      selected
                        ? `
                          border-blue-500
                          bg-blue-50
                          ring-2
                          ring-blue-100
                        `
                        : `
                          border-slate-200
                          bg-white
                          hover:border-slate-300
                          hover:bg-slate-50
                        `
                    }
                  `}
                >
                  <div
                    className={`
                      mt-0.5
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      ${
                        selected
                          ? `
                            bg-blue-100
                            text-blue-600
                          `
                          : `
                            bg-slate-100
                            text-slate-500
                          `
                      }
                    `}
                  >
                    <Megaphone className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`
                        text-sm
                        font-semibold
                        ${
                          selected
                            ? "text-blue-950"
                            : "text-slate-900"
                        }
                      `}
                    >
                      {channel.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {
                        channel.description
                      }
                    </p>
                  </div>

                  <div
                    className={`
                      ml-auto
                      mt-1
                      h-4
                      w-4
                      shrink-0
                      rounded-full
                      border-2
                      ${
                        selected
                          ? `
                            border-blue-600
                            bg-blue-600
                            ring-2
                            ring-blue-100
                          `
                          : `
                            border-slate-300
                            bg-white
                          `
                      }
                    `}
                  />
                </button>
              )
            }
          )}
        </div>

        <FieldError
          errors={
            state.errors?.channel
          }
        />
      </section>

      <Divider />

      {/* ===================================================
          CAMPAIGN TIMELINE
      =================================================== */}

      <section className="space-y-5">
        <SectionHeader
          icon={
            <CalendarDays className="h-5 w-5" />
          }
          title="Campaign Timeline"
          description="Set the planned campaign start and end dates."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {/* START DATE */}

          <div>
            <label
              htmlFor="startDate"
              className="text-sm font-semibold text-slate-800"
            >
              Start Date
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              value={startDate}
              onChange={(event) =>
                setStartDate(
                  event.target.value
                )
              }
              className="
                mt-2
                h-11
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />

            <FieldError
              errors={
                state.errors?.startDate
              }
            />
          </div>

          {/* END DATE */}

          <div>
            <label
              htmlFor="endDate"
              className="text-sm font-semibold text-slate-800"
            >
              End Date
            </label>

            <input
              id="endDate"
              name="endDate"
              type="date"
              min={
                startDate || undefined
              }
              value={endDate}
              onChange={(event) =>
                setEndDate(
                  event.target.value
                )
              }
              className="
                mt-2
                h-11
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />

            <FieldError
              errors={
                state.errors?.endDate
              }
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          FOOTER ACTIONS
      =================================================== */}

      <div
        className="
          flex
          flex-col-reverse
          gap-3
          border-t
          border-slate-200
          pt-6
          sm:flex-row
          sm:items-center
          sm:justify-end
        "
      >
        <a
          href="/admin/marketing/campaigns"
          className="
            inline-flex
            h-11
            items-center
            justify-center
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
          Cancel
        </a>

        <button
          type="submit"
          disabled={isPending}
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
            shadow-sm
            transition
            hover:bg-green-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />

              Creating Campaign...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />

              Create Campaign
            </>
          )}
        </button>
      </div>
    </form>
  )
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
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
          bg-slate-100
          text-slate-600
        "
      >
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-slate-950">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   FIELD ERROR
========================================================= */

function FieldError({
  errors,
}: {
  errors?: string[]
}) {
  if (!errors?.length) {
    return null
  }

  return (
    <p className="mt-2 text-xs font-medium text-red-600">
      {errors[0]}
    </p>
  )
}

/* =========================================================
   DIVIDER
========================================================= */

function Divider() {
  return (
    <div className="h-px bg-slate-200" />
  )
}