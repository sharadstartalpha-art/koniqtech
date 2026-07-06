"use client"

import {
  useActionState,
  useEffect,
  useState,
} from "react"

import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  MessageCircle,
  Phone,
  Save,
  Send,
  Target,
  Trophy,
} from "lucide-react"

import {
  DemoFollowUpStatus,
  DemoFollowUpType,
} from "@prisma/client"

import {
  updateFollowUpAction,
} from "../actions"

/* =========================================================
   TYPES
========================================================= */

type ActionState = {
  success: boolean
  message: string
}

type FollowUpData = {
  id: string

  followUpDate: string

  type: DemoFollowUpType

  status: DemoFollowUpStatus

  notes: string | null

  outcome: string | null
}

type FollowUpFormProps = {
  followUp: FollowUpData
}

/* =========================================================
   INITIAL ACTION STATE
========================================================= */

const initialState: ActionState = {
  success: false,
  message: "",
}

/* =========================================================
   HELPERS
========================================================= */

function toDateTimeLocal(
  value: string
) {
  const date = new Date(value)

  const offset =
    date.getTimezoneOffset()

  const localDate = new Date(
    date.getTime() -
      offset * 60 * 1000
  )

  return localDate
    .toISOString()
    .slice(0, 16)
}

/* =========================================================
   COMPONENT
========================================================= */

export default function FollowUpForm({
  followUp,
}: FollowUpFormProps) {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    updateFollowUpAction,
    initialState
  )

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState<DemoFollowUpStatus>(
    followUp.status
  )

  const [
    selectedType,
    setSelectedType,
  ] = useState<DemoFollowUpType>(
    followUp.type
  )

  const [
    showMessage,
    setShowMessage,
  ] = useState(false)

  /* =======================================================
     SHOW ACTION MESSAGE
  ======================================================= */

  useEffect(() => {
    if (state.message) {
      setShowMessage(true)

      const timeout =
        window.setTimeout(() => {
          setShowMessage(false)
        }, 5000)

      return () => {
        window.clearTimeout(timeout)
      }
    }
  }, [state])

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="followUpId"
        value={followUp.id}
      />

      {/* ===================================================
          ACTION MESSAGE
      =================================================== */}

      {showMessage &&
        state.message && (
          <div
            className={`
              rounded-xl
              border
              px-4
              py-3
              text-sm
              font-medium
              ${
                state.success
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }
            `}
          >
            <div className="flex items-center gap-2">
              {state.success ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <MessageCircle className="h-4 w-4 shrink-0" />
              )}

              <span>
                {state.message}
              </span>
            </div>
          </div>
        )}

      {/* ===================================================
          FOLLOW-UP SCHEDULE
      =================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarClock className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-950">
                Follow-up Schedule
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Set the next contact date and communication method.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="followUpDate"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Follow-up Date
            </label>

            <div className="relative">
              <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="followUpDate"
                name="followUpDate"
                type="datetime-local"
                required
                defaultValue={toDateTimeLocal(
                  followUp.followUpDate
                )}
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  pl-10
                  pr-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="type"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Follow-up Type
            </label>

            <select
              id="type"
              name="type"
              value={selectedType}
              onChange={(event) =>
                setSelectedType(
                  event.target
                    .value as DemoFollowUpType
                )
              }
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-3
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            >
              <option value="call">
                Phone Call
              </option>

              <option value="email">
                Email
              </option>

              <option value="sms">
                SMS
              </option>

              <option value="whatsapp">
                WhatsApp
              </option>

              <option value="meeting">
                Meeting
              </option>

              <option value="trial">
                Trial Follow-up
              </option>

              <option value="pricing">
                Pricing Discussion
              </option>

              <option value="negotiation">
                Negotiation
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* ===================================================
          SALES PROGRESS
      =================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Target className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-950">
                Prospect Progress
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Update the current stage after contacting the prospect.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <input
            type="hidden"
            name="status"
            value={selectedStatus}
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatusButton
              label="Pending"
              value={
                DemoFollowUpStatus.pending
              }
              selected={selectedStatus}
              onSelect={
                setSelectedStatus
              }
            />

            <StatusButton
              label="Contacted"
              value={
                DemoFollowUpStatus.contacted
              }
              selected={selectedStatus}
              onSelect={
                setSelectedStatus
              }
            />

            <StatusButton
              label="Interested"
              value={
                DemoFollowUpStatus.interested
              }
              selected={selectedStatus}
              onSelect={
                setSelectedStatus
              }
            />

            <StatusButton
              label="Trial"
              value={
                DemoFollowUpStatus.trial
              }
              selected={selectedStatus}
              onSelect={
                setSelectedStatus
              }
            />

            <StatusButton
              label="Negotiation"
              value={
                DemoFollowUpStatus.negotiation
              }
              selected={selectedStatus}
              onSelect={
                setSelectedStatus
              }
            />

            <StatusButton
              label="Won"
              value={
                DemoFollowUpStatus.won
              }
              selected={selectedStatus}
              onSelect={
                setSelectedStatus
              }
            />

            <StatusButton
              label="Lost"
              value={
                DemoFollowUpStatus.lost
              }
              selected={selectedStatus}
              onSelect={
                setSelectedStatus
              }
            />

            <StatusButton
              label="Completed"
              value={
                DemoFollowUpStatus.completed
              }
              selected={selectedStatus}
              onSelect={
                setSelectedStatus
              }
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          NOTES
      =================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-950">
                Follow-up Notes
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Record communication details and the latest prospect response.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              rows={5}
              defaultValue={
                followUp.notes ?? ""
              }
              placeholder="Example: Customer liked the CRM demo and asked for pricing details..."
              className="
                w-full
                resize-y
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                py-3
                text-sm
                leading-6
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

          <div>
            <label
              htmlFor="outcome"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Outcome
            </label>

            <textarea
              id="outcome"
              name="outcome"
              rows={4}
              defaultValue={
                followUp.outcome ?? ""
              }
              placeholder="Example: Agreed to start a 7-day trial next Monday."
              className="
                w-full
                resize-y
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                py-3
                text-sm
                leading-6
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
        </div>
      </section>

      {/* ===================================================
          STATUS WARNING
      =================================================== */}

      {selectedStatus ===
        DemoFollowUpStatus.won && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <div className="flex items-start gap-3">
            <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

            <div>
              <p className="font-bold text-green-900">
                Prospect marked as Won
              </p>

              <p className="mt-1 text-sm leading-6 text-green-700">
                Save this follow-up after confirming that the customer has agreed to proceed.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedStatus ===
        DemoFollowUpStatus.lost && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-bold text-red-900">
            Prospect marked as Lost
          </p>

          <p className="mt-1 text-sm leading-6 text-red-700">
            Add the reason in the Outcome field so the team can analyze lost opportunities.
          </p>
        </div>
      )}

      {/* ===================================================
          SUBMIT
      =================================================== */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="submit"
          disabled={pending}
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
            disabled:opacity-60
          "
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Follow-up
            </>
          )}
        </button>
      </div>
    </form>
  )
}

/* =========================================================
   STATUS BUTTON
========================================================= */

function StatusButton({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string

  value: DemoFollowUpStatus

  selected: DemoFollowUpStatus

  onSelect: (
    value: DemoFollowUpStatus
  ) => void
}) {
  const active =
    selected === value

  return (
    <button
      type="button"
      onClick={() =>
        onSelect(value)
      }
      className={`
        flex
        min-h-12
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        px-4
        py-3
        text-sm
        font-semibold
        transition
        ${
          active
            ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
        }
      `}
    >
      {value ===
        DemoFollowUpStatus.won ? (
        <Trophy className="h-4 w-4" />
      ) : value ===
        DemoFollowUpStatus.contacted ? (
        <Phone className="h-4 w-4" />
      ) : value ===
        DemoFollowUpStatus.completed ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <Send className="h-4 w-4" />
      )}

      {label}
    </button>
  )
}