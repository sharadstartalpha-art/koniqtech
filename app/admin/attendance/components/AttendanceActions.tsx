"use client"

import Link from "next/link"

import {
  useState,
  useTransition
} from "react"

import {
  useRouter
} from "next/navigation"

import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  Loader2,
  Pencil,
  RotateCcw,
  Trash2,
  X
} from "lucide-react"

import {
  approveAttendanceAction,
  deleteAttendanceAction,
  revokeAttendanceApprovalAction
} from "../actions"


// ============================================================
// TYPES
// ============================================================

type AttendanceActionsProps = {
  attendanceId: string
  employeeName: string
  attendanceDate: string

  isApproved: boolean

  canEdit: boolean
  canDelete: boolean
  canApprove: boolean
}


type ActionMessage = {
  type: "success" | "error"
  text: string
} | null


type ConfirmMode =
  | "delete"
  | "approve"
  | "revoke"
  | null


// ============================================================
// COMPONENT
// ============================================================

export default function AttendanceActions({
  attendanceId,
  employeeName,
  attendanceDate,
  isApproved,
  canEdit,
  canDelete,
  canApprove
}: AttendanceActionsProps) {

  const router = useRouter()

  const [
    isPending,
    startTransition
  ] = useTransition()


  const [
    message,
    setMessage
  ] = useState<ActionMessage>(null)


  const [
    confirmMode,
    setConfirmMode
  ] = useState<ConfirmMode>(null)


  // ==========================================================
  // CLOSE CONFIRMATION
  // ==========================================================

  function closeConfirmation() {

    if (isPending) {
      return
    }

    setConfirmMode(null)
  }


  // ==========================================================
  // APPROVE
  // ==========================================================

  function handleApprove() {

    setMessage(null)

    startTransition(async () => {

      const result =
        await approveAttendanceAction(
          attendanceId
        )


      if (!result.success) {

        setMessage({
          type: "error",
          text: result.message
        })

        setConfirmMode(null)

        return
      }


      setMessage({
        type: "success",
        text: result.message
      })

      setConfirmMode(null)

      router.refresh()
    })
  }


  // ==========================================================
  // REVOKE APPROVAL
  // ==========================================================

  function handleRevokeApproval() {

    setMessage(null)

    startTransition(async () => {

      const result =
        await revokeAttendanceApprovalAction(
          attendanceId
        )


      if (!result.success) {

        setMessage({
          type: "error",
          text: result.message
        })

        setConfirmMode(null)

        return
      }


      setMessage({
        type: "success",
        text: result.message
      })

      setConfirmMode(null)

      router.refresh()
    })
  }


  // ==========================================================
  // DELETE
  // ==========================================================

  function handleDelete() {

    setMessage(null)

    startTransition(async () => {

      const result =
        await deleteAttendanceAction(
          attendanceId
        )


      if (!result.success) {

        setMessage({
          type: "error",
          text: result.message
        })

        setConfirmMode(null)

        return
      }


      setConfirmMode(null)

      router.push(
        "/admin/attendance"
      )

      router.refresh()
    })
  }


  // ==========================================================
  // CONFIRM ACTION
  // ==========================================================

  function handleConfirm() {

    if (
      !confirmMode ||
      isPending
    ) {
      return
    }


    if (confirmMode === "delete") {
      handleDelete()
      return
    }


    if (confirmMode === "approve") {
      handleApprove()
      return
    }


    handleRevokeApproval()
  }


  // ==========================================================
  // CONFIRMATION CONTENT
  // ==========================================================

  const confirmationContent =
    getConfirmationContent(
      confirmMode,
      employeeName,
      attendanceDate
    )


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <div className="space-y-3">

        {/* ================================================== */}
        {/* MESSAGE */}
        {/* ================================================== */}

        {message && (

          <div
            className={`
              flex items-start gap-3
              rounded-lg
              border
              px-4 py-3
              text-sm
              ${
                message.type === "success"
                  ? `
                    border-green-200
                    bg-green-50
                    text-green-700
                  `
                  : `
                    border-red-200
                    bg-red-50
                    text-red-700
                  `
              }
            `}
          >

            {message.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}


            <p className="flex-1">
              {message.text}
            </p>


            <button
              type="button"
              onClick={() => {
                setMessage(null)
              }}
              className="
                rounded
                p-0.5
                transition
                hover:bg-white/60
              "
              aria-label="Dismiss message"
            >
              <X className="h-4 w-4" />
            </button>

          </div>

        )}


        {/* ================================================== */}
        {/* ACTION BUTTONS */}
        {/* ================================================== */}

        <div className="flex flex-wrap items-center gap-2">

          {/* EDIT */}

          {canEdit && (

            <Link
              href={`/admin/attendance/${attendanceId}/edit`}
              className="
                inline-flex h-10
                items-center justify-center
                gap-2
                rounded-lg
                border border-orange-200
                bg-orange-50
                px-4
                text-sm font-medium
                text-orange-700
                transition
                hover:bg-orange-100
                focus:outline-none
                focus:ring-2
                focus:ring-orange-500
                focus:ring-offset-2
              "
            >
              <Pencil className="h-4 w-4" />

              Edit
            </Link>

          )}


          {/* APPROVE */}

          {canApprove && !isApproved && (

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setMessage(null)
                setConfirmMode("approve")
              }}
              className="
                inline-flex h-10
                items-center justify-center
                gap-2
                rounded-lg
                bg-green-600
                px-4
                text-sm font-medium
                text-white
                shadow-sm
                transition
                hover:bg-green-700
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <BadgeCheck className="h-4 w-4" />

              Approve
            </button>

          )}


          {/* REVOKE APPROVAL */}

          {canApprove && isApproved && (

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setMessage(null)
                setConfirmMode("revoke")
              }}
              className="
                inline-flex h-10
                items-center justify-center
                gap-2
                rounded-lg
                border border-orange-200
                bg-orange-50
                px-4
                text-sm font-medium
                text-orange-700
                transition
                hover:bg-orange-100
                focus:outline-none
                focus:ring-2
                focus:ring-orange-500
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <RotateCcw className="h-4 w-4" />

              Revoke Approval
            </button>

          )}


          {/* DELETE */}

          {canDelete && (

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setMessage(null)
                setConfirmMode("delete")
              }}
              className="
                inline-flex h-10
                items-center justify-center
                gap-2
                rounded-lg
                bg-red-600
                px-4
                text-sm font-medium
                text-white
                shadow-sm
                transition
                hover:bg-red-700
                focus:outline-none
                focus:ring-2
                focus:ring-red-500
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <Trash2 className="h-4 w-4" />

              Delete
            </button>

          )}

        </div>

      </div>


      {/* ==================================================== */}
      {/* CONFIRMATION MODAL */}
      {/* ==================================================== */}

      {confirmMode && confirmationContent && (

        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-slate-950/40
            p-4
            backdrop-blur-[1px]
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="attendance-confirm-title"
        >

          <button
            type="button"
            aria-label="Close confirmation dialog"
            onClick={closeConfirmation}
            className="absolute inset-0 cursor-default"
          />


          <div
            className="
              relative z-10
              w-full max-w-md
              overflow-hidden
              rounded-xl
              border border-slate-200
              bg-white
              shadow-xl
            "
          >

            {/* HEADER */}

            <div
              className="
                flex items-start justify-between
                gap-4
                border-b border-slate-200
                px-5 py-4
              "
            >

              <div className="flex items-start gap-3">

                <div
                  className={`
                    flex h-10 w-10
                    shrink-0
                    items-center justify-center
                    rounded-lg
                    ${confirmationContent.iconClassName}
                  `}
                >
                  <confirmationContent.Icon
                    className="h-5 w-5"
                  />
                </div>


                <div>

                  <h2
                    id="attendance-confirm-title"
                    className="font-semibold text-slate-900"
                  >
                    {confirmationContent.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {confirmationContent.subtitle}
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={closeConfirmation}
                disabled={isPending}
                className="
                  rounded-lg
                  p-1.5
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

            </div>


            {/* BODY */}

            <div className="px-5 py-5">

              <p className="text-sm leading-6 text-slate-600">
                {confirmationContent.description}
              </p>


              <div
                className="
                  mt-4
                  rounded-lg
                  border border-slate-200
                  bg-slate-50
                  p-4
                "
              >

                <dl className="space-y-3">

                  <div className="flex items-center justify-between gap-4">

                    <dt className="text-sm text-slate-500">
                      Employee
                    </dt>

                    <dd className="text-right text-sm font-medium text-slate-900">
                      {employeeName}
                    </dd>

                  </div>


                  <div className="flex items-center justify-between gap-4">

                    <dt className="text-sm text-slate-500">
                      Attendance Date
                    </dt>

                    <dd className="text-right text-sm font-medium text-slate-900">
                      {attendanceDate}
                    </dd>

                  </div>

                </dl>

              </div>

            </div>


            {/* FOOTER */}

            <div
              className="
                flex flex-col-reverse gap-2
                border-t border-slate-200
                bg-slate-50
                px-5 py-4
                sm:flex-row
                sm:justify-end
              "
            >

              <button
                type="button"
                onClick={closeConfirmation}
                disabled={isPending}
                className="
                  inline-flex h-10
                  items-center justify-center
                  rounded-lg
                  border border-orange-200
                  bg-orange-50
                  px-4
                  text-sm font-medium
                  text-orange-700
                  transition
                  hover:bg-orange-100
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className={`
                  inline-flex h-10
                  items-center justify-center
                  gap-2
                  rounded-lg
                  px-4
                  text-sm font-medium
                  text-white
                  shadow-sm
                  transition
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  ${confirmationContent.confirmClassName}
                `}
              >

                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    Processing...
                  </>
                ) : (
                  <>
                    <confirmationContent.Icon
                      className="h-4 w-4"
                    />

                    {confirmationContent.confirmLabel}
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </>
  )
}


// ============================================================
// CONFIRMATION CONTENT
// ============================================================

function getConfirmationContent(
  mode: ConfirmMode,
  employeeName: string,
  attendanceDate: string
) {

  if (mode === "approve") {

    return {
      title: "Approve Attendance",
      subtitle:
        "Confirm this attendance record.",

      description:
        `Approve the attendance record for ${employeeName} on ${attendanceDate}? The approving employee and approval time will be recorded.`,

      confirmLabel:
        "Approve Attendance",

      Icon:
        BadgeCheck,

      iconClassName:
        "bg-green-50 text-green-600",

      confirmClassName:
        `
          bg-green-600
          hover:bg-green-700
          focus:ring-green-500
        `
    }
  }


  if (mode === "revoke") {

    return {
      title: "Revoke Approval",
      subtitle:
        "Remove the current approval.",

      description:
        `Revoke approval for ${employeeName}'s attendance record on ${attendanceDate}? The approver and approval timestamp will be cleared.`,

      confirmLabel:
        "Revoke Approval",

      Icon:
        RotateCcw,

      iconClassName:
        "bg-orange-50 text-orange-600",

      confirmClassName:
        `
          bg-orange-600
          hover:bg-orange-700
          focus:ring-orange-500
        `
    }
  }


  if (mode === "delete") {

    return {
      title: "Delete Attendance",
      subtitle:
        "This action cannot be undone.",

      description:
        `Delete the attendance record for ${employeeName} on ${attendanceDate}? This permanently removes the record from internal attendance history.`,

      confirmLabel:
        "Delete Attendance",

      Icon:
        Trash2,

      iconClassName:
        "bg-red-50 text-red-600",

      confirmClassName:
        `
          bg-red-600
          hover:bg-red-700
          focus:ring-red-500
        `
    }
  }


  return null
}