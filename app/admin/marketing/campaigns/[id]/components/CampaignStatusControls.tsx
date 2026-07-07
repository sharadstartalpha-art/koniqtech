"use client"

import {
  useState,
  useTransition,
} from "react"

import { useRouter } from "next/navigation"

import {
  AlertCircle,
  CheckCircle2,
  CirclePause,
  CirclePlay,
  Clock3,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react"

import {
  CampaignStatus,
} from "@prisma/client"

import {
  changeCampaignStatusAction,
} from "../../actions"

/* =========================================================
   TYPES
========================================================= */

type CampaignStatusControlsProps = {
  campaignId: string
  currentStatus: CampaignStatus
}

/* =========================================================
   STATUS CONFIG
========================================================= */

const STATUS_CONFIG: Record<
  CampaignStatus,
  {
    label: string
    description: string
    icon: typeof Clock3
    badgeClass: string
    buttonClass: string
  }
> = {
  [CampaignStatus.draft]: {
    label: "Draft",

    description:
      "Campaign is still being prepared.",

    icon: Clock3,

    badgeClass:
      "border-slate-200 bg-slate-50 text-slate-700",

    buttonClass:
      "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
  },

  [CampaignStatus.running]: {
    label: "Running",

    description:
      "Campaign is currently active.",

    icon: CirclePlay,

    badgeClass:
      "border-green-200 bg-green-50 text-green-700",

    buttonClass:
      "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
  },

  [CampaignStatus.paused]: {
    label: "Paused",

    description:
      "Campaign activity is temporarily paused.",

    icon: CirclePause,

    badgeClass:
      "border-orange-200 bg-orange-50 text-orange-700",

    buttonClass:
      "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100",
  },

  [CampaignStatus.completed]: {
    label: "Completed",

    description:
      "Campaign has completed its lifecycle.",

    icon: CheckCircle2,

    badgeClass:
      "border-blue-200 bg-blue-50 text-blue-700",

    buttonClass:
      "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
  },

  [CampaignStatus.cancelled]: {
    label: "Cancelled",

    description:
      "Campaign has been cancelled.",

    icon: XCircle,

    badgeClass:
      "border-red-200 bg-red-50 text-red-700",

    buttonClass:
      "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  },
}

/* =========================================================
   STATUS ORDER
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

export default function CampaignStatusControls({
  campaignId,
  currentStatus,
}: CampaignStatusControlsProps) {
  const router = useRouter()

  const [
    isPending,
    startTransition,
  ] = useTransition()

  const [
    selectedStatus,
    setSelectedStatus,
  ] =
    useState<CampaignStatus>(
      currentStatus
    )

  const [
    confirmStatus,
    setConfirmStatus,
  ] =
    useState<CampaignStatus | null>(
      null
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

  const currentConfig =
    STATUS_CONFIG[currentStatus]

  const CurrentIcon =
    currentConfig.icon

  /* =======================================================
     REQUEST STATUS CHANGE
  ======================================================= */

  function requestStatusChange(
    status: CampaignStatus
  ) {
    setError(null)
    setSuccess(null)

    setSelectedStatus(status)

    if (status === currentStatus) {
      setConfirmStatus(null)
      return
    }

    setConfirmStatus(status)
  }

  /* =======================================================
     CANCEL STATUS CHANGE
  ======================================================= */

  function cancelStatusChange() {
    setSelectedStatus(
      currentStatus
    )

    setConfirmStatus(null)
    setError(null)
  }

  /* =======================================================
     CHANGE STATUS
  ======================================================= */

  function handleStatusChange() {
    if (!confirmStatus) {
      return
    }

    setError(null)
    setSuccess(null)

    startTransition(async () => {
      try {
        const result =
          await changeCampaignStatusAction(
            campaignId,
            confirmStatus
          )

        if (!result.success) {
          setError(result.message)

          setSelectedStatus(
            currentStatus
          )

          return
        }

        setSuccess(result.message)
        setConfirmStatus(null)

        router.refresh()
      } catch (actionError) {
        console.error(
          "Campaign status update error:",
          actionError
        )

        setError(
          "Unable to update campaign status."
        )

        setSelectedStatus(
          currentStatus
        )
      }
    })
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
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
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-slate-200
          px-6
          py-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h2 className="font-bold text-slate-950">
            Campaign Status
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Control the current lifecycle
            state of this campaign.
          </p>
        </div>

        <div
          className={`
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-full
            border
            px-3
            py-1.5
            text-xs
            font-semibold
            ${currentConfig.badgeClass}
          `}
        >
          <CurrentIcon className="h-4 w-4" />

          {currentConfig.label}
        </div>
      </div>

      {/* =================================================
          FEEDBACK
      ================================================= */}

      {(error || success) && (
        <div className="space-y-3 px-6 pt-5">
          {error && (
            <div
              role="alert"
              className="
                flex
                items-start
                gap-3
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
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="
                flex
                items-start
                gap-3
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
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

              <span>{success}</span>
            </div>
          )}
        </div>
      )}

      {/* =================================================
          CURRENT STATUS INFO
      ================================================= */}

      <div className="px-6 pt-6">
        <div
          className={`
            flex
            items-start
            gap-3
            rounded-xl
            border
            p-4
            ${currentConfig.badgeClass}
          `}
        >
          <CurrentIcon className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="text-sm font-semibold">
              Current status:{" "}
              {currentConfig.label}
            </p>

            <p className="mt-1 text-sm opacity-80">
              {currentConfig.description}
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          STATUS OPTIONS
      ================================================= */}

      <div className="p-6">
        <p className="mb-3 text-sm font-semibold text-slate-700">
          Change campaign status
        </p>

        <div
          className="
            grid
            gap-3
            sm:grid-cols-2
            xl:grid-cols-5
          "
        >
          {STATUS_OPTIONS.map(
            (status) => {
              const config =
                STATUS_CONFIG[status]

              const Icon =
                config.icon

              const isCurrent =
                status === currentStatus

              const isSelected =
                status === selectedStatus

              return (
                <button
                  key={status}
                  type="button"
                  disabled={
                    isPending ||
                    isCurrent
                  }
                  onClick={() =>
                    requestStatusChange(
                      status
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
                    disabled:cursor-not-allowed
                    ${
                      isCurrent
                        ? `${config.buttonClass} opacity-60`
                        : isSelected
                          ? `${config.buttonClass} ring-2 ring-blue-100`
                          : config.buttonClass
                    }
                  `}
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>
                    <p className="text-sm font-bold">
                      {config.label}
                    </p>

                    {isCurrent && (
                      <p className="mt-1 text-xs">
                        Current
                      </p>
                    )}
                  </div>
                </button>
              )
            }
          )}
        </div>
      </div>

      {/* =================================================
          CONFIRMATION
      ================================================= */}

      {confirmStatus && (
        <div
          className="
            border-t
            border-orange-200
            bg-orange-50
            px-6
            py-5
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p className="text-sm font-semibold text-orange-900">
                Confirm status change
              </p>

              <p className="mt-1 text-sm text-orange-700">
                Change campaign from{" "}
                <strong>
                  {currentConfig.label}
                </strong>{" "}
                to{" "}
                <strong>
                  {
                    STATUS_CONFIG[
                      confirmStatus
                    ].label
                  }
                </strong>
                ?
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={
                  cancelStatusChange
                }
                className="
                  rounded-lg
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-orange-700
                  ring-1
                  ring-orange-200
                  transition
                  hover:bg-orange-100
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={
                  handleStatusChange
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />

                    Confirm Change
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}