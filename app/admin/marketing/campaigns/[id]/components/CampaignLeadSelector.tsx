"use client"

import {
  useMemo,
  useState,
  useTransition,
} from "react"

import { useRouter } from "next/navigation"

import {
  Building2,
  Check,
  CheckSquare,
  Loader2,
  Mail,
  MapPin,
  Search,
  Square,
  UserPlus,
  Users,
  X,
} from "lucide-react"

import {
  addCampaignLeadsAction,
} from "../../actions"

/* =========================================================
   TYPES
========================================================= */

export type AvailableCampaignLead = {
  id: string
  companyName: string
  ownerName: string | null
  primaryEmail: string | null
  city: string | null
  state: string | null
  country: string | null
  industry: string | null
}

type CampaignLeadSelectorProps = {
  campaignId: string
  leads: AvailableCampaignLead[]
}

/* =========================================================
   COMPONENT
========================================================= */

export default function CampaignLeadSelector({
  campaignId,
  leads,
}: CampaignLeadSelectorProps) {
  const router = useRouter()

  const [
    isPending,
    startTransition,
  ] = useTransition()

  const [
    isOpen,
    setIsOpen,
  ] = useState(false)

  const [
    search,
    setSearch,
  ] = useState("")

  const [
    selectedIds,
    setSelectedIds,
  ] = useState<string[]>([])

  const [
    error,
    setError,
  ] = useState<string | null>(null)

  const [
    success,
    setSuccess,
  ] = useState<string | null>(null)

  /* =======================================================
     FILTERED LEADS
  ======================================================= */

  const filteredLeads = useMemo(() => {
    const query =
      search.trim().toLowerCase()

    if (!query) {
      return leads
    }

    return leads.filter((lead) => {
      const searchableText = [
        lead.companyName,
        lead.ownerName,
        lead.primaryEmail,
        lead.city,
        lead.state,
        lead.country,
        lead.industry,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return searchableText.includes(query)
    })
  }, [leads, search])

  /* =======================================================
     SELECTION
  ======================================================= */

  function toggleLead(
    leadId: string
  ) {
    setSelectedIds((current) => {
      if (current.includes(leadId)) {
        return current.filter(
          (id) => id !== leadId
        )
      }

      return [
        ...current,
        leadId,
      ]
    })
  }

  function selectAllVisible() {
    const visibleIds =
      filteredLeads.map(
        (lead) => lead.id
      )

    setSelectedIds((current) =>
      Array.from(
        new Set([
          ...current,
          ...visibleIds,
        ])
      )
    )
  }

  function clearSelection() {
    setSelectedIds([])
  }

  /* =======================================================
     ADD LEADS
  ======================================================= */

  function handleAddLeads() {
    setError(null)
    setSuccess(null)

    if (selectedIds.length === 0) {
      setError(
        "Select at least one lead."
      )

      return
    }

    startTransition(async () => {
      try {
        const result =
          await addCampaignLeadsAction(
            campaignId,
            selectedIds
          )

        if (!result.success) {
          setError(result.message)
          return
        }

        setSuccess(result.message)
        setSelectedIds([])
        setSearch("")

        router.refresh()

        window.setTimeout(() => {
          setIsOpen(false)
          setSuccess(null)
        }, 700)
      } catch (actionError) {
        console.error(
          "Add campaign leads error:",
          actionError
        )

        setError(
          "Unable to add selected leads."
        )
      }
    })
  }

  /* =======================================================
     CLOSED STATE
  ======================================================= */

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setError(null)
          setSuccess(null)
          setIsOpen(true)
        }}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-green-600
          px-4
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-green-700
        "
      >
        <UserPlus className="h-4 w-4" />

        Add Leads
      </button>
    )
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-blue-200
        bg-white
        shadow-sm
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-slate-200
          bg-blue-50/50
          px-6
          py-5
          sm:flex-row
          sm:items-center
          sm:justify-between
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
              bg-blue-600
              text-white
            "
          >
            <UserPlus className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-bold text-slate-950">
              Add Campaign Leads
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Select companies to attribute
              to this campaign.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setIsOpen(false)
            setSelectedIds([])
            setSearch("")
            setError(null)
            setSuccess(null)
          }}
          className="
            inline-flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            bg-red-50
            text-red-600
            transition
            hover:bg-red-100
            disabled:opacity-50
          "
          aria-label="Close lead selector"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* FEEDBACK */}

      {(error || success) && (
        <div className="px-6 pt-5">
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
        </div>
      )}

      {/* SEARCH */}

      <div className="p-6 pb-4">
        <div className="relative">
          <Search
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search company, owner, email, industry or location..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              pl-11
              pr-4
              text-sm
              outline-none
              transition
              focus:border-blue-400
              focus:ring-4
              focus:ring-blue-50
            "
          />
        </div>
      </div>

      {/* SELECTION BAR */}

      <div
        className="
          flex
          flex-col
          gap-3
          border-y
          border-slate-100
          bg-slate-50
          px-6
          py-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />

          <span className="text-sm font-semibold text-slate-700">
            {selectedIds.length} selected
          </span>

          <span className="text-sm text-slate-400">
            · {filteredLeads.length} visible
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAllVisible}
            disabled={
              filteredLeads.length === 0 ||
              isPending
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-blue-50
              px-3
              py-2
              text-xs
              font-semibold
              text-blue-700
              transition
              hover:bg-blue-100
              disabled:opacity-50
            "
          >
            <CheckSquare className="h-4 w-4" />

            Select Visible
          </button>

          <button
            type="button"
            onClick={clearSelection}
            disabled={
              selectedIds.length === 0 ||
              isPending
            }
            className="
              rounded-lg
              bg-orange-50
              px-3
              py-2
              text-xs
              font-semibold
              text-orange-700
              transition
              hover:bg-orange-100
              disabled:opacity-50
            "
          >
            Clear
          </button>
        </div>
      </div>

      {/* LEADS */}

      {filteredLeads.length === 0 ? (
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            px-6
            py-14
            text-center
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <Building2 className="h-5 w-5" />
          </div>

          <p className="mt-4 font-semibold text-slate-900">
            No available leads
          </p>

          <p className="mt-1 text-sm text-slate-500">
            All eligible leads may already
            be attached to this campaign.
          </p>
        </div>
      ) : (
        <div className="max-h-[500px] overflow-y-auto">
          <div className="divide-y divide-slate-100">
            {filteredLeads.map((lead) => {
              const selected =
                selectedIds.includes(
                  lead.id
                )

              const location = [
                lead.city,
                lead.state,
                lead.country,
              ]
                .filter(Boolean)
                .join(", ")

              return (
                <button
                  key={lead.id}
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    toggleLead(lead.id)
                  }
                  className={`
                    flex
                    w-full
                    items-start
                    gap-4
                    px-6
                    py-4
                    text-left
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    ${
                      selected
                        ? "bg-blue-50/70"
                        : "bg-white hover:bg-slate-50"
                    }
                  `}
                >
                  <div className="mt-1">
                    {selected ? (
                      <div
                        className="
                          flex
                          h-5
                          w-5
                          items-center
                          justify-center
                          rounded
                          bg-blue-600
                          text-white
                        "
                      >
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    ) : (
                      <Square className="h-5 w-5 text-slate-300" />
                    )}
                  </div>

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
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
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
                      <div>
                        <p className="font-semibold text-slate-950">
                          {lead.companyName}
                        </p>

                        {lead.ownerName && (
                          <p className="mt-1 text-xs text-slate-500">
                            {lead.ownerName}
                          </p>
                        )}
                      </div>

                      {lead.industry && (
                        <span
                          className="
                            w-fit
                            rounded-full
                            bg-blue-50
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-blue-700
                          "
                        >
                          {lead.industry}
                        </span>
                      )}
                    </div>

                    <div
                      className="
                        mt-3
                        flex
                        flex-wrap
                        gap-x-5
                        gap-y-2
                        text-xs
                        text-slate-500
                      "
                    >
                      {lead.primaryEmail && (
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />

                          {lead.primaryEmail}
                        </span>
                      )}

                      {location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />

                          {location}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* FOOTER */}

      <div
        className="
          flex
          flex-col-reverse
          gap-3
          border-t
          border-slate-200
          bg-slate-50/70
          px-6
          py-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <p className="text-xs text-slate-500">
          Duplicate campaign attribution
          records are automatically skipped.
        </p>

        <button
          type="button"
          onClick={handleAddLeads}
          disabled={
            isPending ||
            selectedIds.length === 0
          }
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
            disabled:opacity-50
          "
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />

              Adding Leads...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />

              Add {selectedIds.length} Lead
              {selectedIds.length === 1
                ? ""
                : "s"}
            </>
          )}
        </button>
      </div>
    </div>
  )
}