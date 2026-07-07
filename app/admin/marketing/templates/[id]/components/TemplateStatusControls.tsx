"use client"

import {
  useState,
  useTransition,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  Archive,
  CheckCircle2,
  CirclePause,
  Loader2,
  X,
} from "lucide-react"

import {
  MarketingTemplateStatus,
} from "@prisma/client"

import {
  changeMarketingTemplateStatusAction,
} from "../../actions"

/* =========================================================
   TYPES
========================================================= */

type TemplateStatusControlsProps = {
  templateId: string

  currentStatus:
    MarketingTemplateStatus
}

/* =========================================================
   STATUS CONFIG
========================================================= */

const STATUS_CONFIG: Record<
  MarketingTemplateStatus,
  {
    label: string
    description: string
  }
> = {
  active: {
    label:
      "Active",

    description:
      "Available for use in marketing workflows.",
  },

  inactive: {
    label:
      "Inactive",

    description:
      "Saved but unavailable for normal template selection.",
  },

  archived: {
    label:
      "Archived",

    description:
      "Stored for historical reference.",
  },
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TemplateStatusControls({
  templateId,
  currentStatus,
}: TemplateStatusControlsProps) {
  const router =
    useRouter()

  const [
    isPending,
    startTransition,
  ] = useTransition()

  const [
    selectedStatus,
    setSelectedStatus,
  ] =
    useState<MarketingTemplateStatus>(
      currentStatus
    )

  const [
    processingStatus,
    setProcessingStatus,
  ] =
    useState<MarketingTemplateStatus | null>(
      null
    )

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    )

  /* =======================================================
     CHANGE STATUS
  ======================================================= */

  function changeStatus(
    nextStatus:
      MarketingTemplateStatus
  ) {
    if (
      nextStatus ===
        selectedStatus ||
      isPending
    ) {
      return
    }

    setError(null)

    setProcessingStatus(
      nextStatus
    )

    startTransition(
      async () => {
        try {
          const result =
            await changeMarketingTemplateStatusAction(
              templateId,
              nextStatus
            )

          if (!result.success) {
            setError(
              result.message
            )

            setProcessingStatus(
              null
            )

            return
          }

          setSelectedStatus(
            nextStatus
          )

          setProcessingStatus(
            null
          )

          router.refresh()
        } catch (
          actionError
        ) {
          console.error(
            "Change template status error:",
            actionError
          )

          setError(
            "Unable to update template status."
          )

          setProcessingStatus(
            null
          )
        }
      }
    )
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h2
          className="
            font-bold
            text-slate-950
          "
        >
          Template Status
        </h2>

        <p
          className="
            mt-1
            text-sm
            leading-6
            text-slate-500
          "
        >
          Control whether this template
          is available for marketing
          workflows.
        </p>
      </div>

      {/* =================================================
          CURRENT STATUS
      ================================================= */}

      <div
        className="
          mt-5
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          p-4
        "
      >
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-wide
            text-slate-400
          "
        >
          Current Status
        </p>

        <div
          className="
            mt-2
            flex
            items-center
            gap-2
          "
        >
          <CurrentStatusIcon
            status={
              selectedStatus
            }
          />

          <span
            className="
              font-bold
              text-slate-900
            "
          >
            {
              STATUS_CONFIG[
                selectedStatus
              ].label
            }
          </span>
        </div>

        <p
          className="
            mt-2
            text-xs
            leading-5
            text-slate-500
          "
        >
          {
            STATUS_CONFIG[
              selectedStatus
            ].description
          }
        </p>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          className="
            mt-4
            flex
            items-start
            gap-2
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-3
            py-3
            text-sm
            text-red-700
          "
        >
          <X
            className="
              mt-0.5
              h-4
              w-4
              shrink-0
            "
          />

          <span>
            {error}
          </span>
        </div>
      )}

      {/* =================================================
          CONTROLS
      ================================================= */}

      <div
        className="
          mt-5
          space-y-3
        "
      >
        {/* ===============================================
            ACTIVE
        =============================================== */}

        <StatusButton
          label="Set Active"
          description="Make available for marketing use."
          icon={
            <CheckCircle2 className="h-4 w-4" />
          }
          active={
            selectedStatus ===
            MarketingTemplateStatus.active
          }
          loading={
            processingStatus ===
            MarketingTemplateStatus.active
          }
          disabled={
            isPending
          }
          variant="green"
          onClick={() =>
            changeStatus(
              MarketingTemplateStatus.active
            )
          }
        />

        {/* ===============================================
            INACTIVE
        =============================================== */}

        <StatusButton
          label="Set Inactive"
          description="Temporarily remove from normal use."
          icon={
            <CirclePause className="h-4 w-4" />
          }
          active={
            selectedStatus ===
            MarketingTemplateStatus.inactive
          }
          loading={
            processingStatus ===
            MarketingTemplateStatus.inactive
          }
          disabled={
            isPending
          }
          variant="orange"
          onClick={() =>
            changeStatus(
              MarketingTemplateStatus.inactive
            )
          }
        />

        {/* ===============================================
            ARCHIVED
        =============================================== */}

        <StatusButton
          label="Archive Template"
          description="Keep for historical reference."
          icon={
            <Archive className="h-4 w-4" />
          }
          active={
            selectedStatus ===
            MarketingTemplateStatus.archived
          }
          loading={
            processingStatus ===
            MarketingTemplateStatus.archived
          }
          disabled={
            isPending
          }
          variant="blue"
          onClick={() =>
            changeStatus(
              MarketingTemplateStatus.archived
            )
          }
        />
      </div>
    </section>
  )
}

/* =========================================================
   STATUS BUTTON
========================================================= */

function StatusButton({
  label,
  description,
  icon,
  active,
  loading,
  disabled,
  variant,
  onClick,
}: {
  label: string

  description: string

  icon: React.ReactNode

  active: boolean

  loading: boolean

  disabled: boolean

  variant:
    | "green"
    | "orange"
    | "blue"

  onClick: () => void
}) {
  const variantStyles = {
    green: {
      active:
        "border-green-300 bg-green-50 text-green-800",

      inactive:
        "border-green-200 bg-white text-green-700 hover:bg-green-50",

      icon:
        "bg-green-100 text-green-700",
    },

    orange: {
      active:
        "border-orange-300 bg-orange-50 text-orange-800",

      inactive:
        "border-orange-200 bg-white text-orange-700 hover:bg-orange-50",

      icon:
        "bg-orange-100 text-orange-700",
    },

    blue: {
      active:
        "border-blue-300 bg-blue-50 text-blue-800",

      inactive:
        "border-blue-200 bg-white text-blue-700 hover:bg-blue-50",

      icon:
        "bg-blue-100 text-blue-700",
    },
  }

  const styles =
    variantStyles[variant]

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={
        disabled ||
        active
      }
      className={`
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        border
        p-3
        text-left
        transition

        ${
          active
            ? styles.active
            : styles.inactive
        }

        disabled:cursor-not-allowed
        disabled:opacity-70
      `}
    >
      {/* ICON */}

      <div
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          ${styles.icon}
        `}
      >
        {loading ? (
          <Loader2
            className="
              h-4
              w-4
              animate-spin
            "
          />
        ) : (
          icon
        )}
      </div>

      {/* TEXT */}

      <div className="min-w-0 flex-1">
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <p
            className="
              text-sm
              font-bold
            "
          >
            {label}
          </p>

          {active && (
            <span
              className="
                rounded-full
                bg-white
                px-2
                py-0.5
                text-[10px]
                font-bold
                uppercase
                tracking-wide
              "
            >
              Current
            </span>
          )}
        </div>

        <p
          className="
            mt-1
            text-xs
            leading-5
            opacity-80
          "
        >
          {description}
        </p>
      </div>
    </button>
  )
}

/* =========================================================
   CURRENT STATUS ICON
========================================================= */

function CurrentStatusIcon({
  status,
}: {
  status:
    MarketingTemplateStatus
}) {
  if (
    status ===
    MarketingTemplateStatus.active
  ) {
    return (
      <CheckCircle2
        className="
          h-5
          w-5
          text-green-600
        "
      />
    )
  }

  if (
    status ===
    MarketingTemplateStatus.inactive
  ) {
    return (
      <CirclePause
        className="
          h-5
          w-5
          text-orange-600
        "
      />
    )
  }

  return (
    <Archive
      className="
        h-5
        w-5
        text-blue-600
      "
    />
  )
}