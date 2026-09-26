"use client"

import { useState } from "react"
import { Loader2, Trash2, X } from "lucide-react"

type DeleteUserButtonProps = {
  id: string
  action: (formData: FormData) => void | Promise<void>
}

export default function DeleteUserButton({
  id,
  action,
}: DeleteUserButtonProps) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete(formData: FormData) {
    try {
      setDeleting(true)
      await action(formData)
    } catch (error) {
      console.error("Failed to delete team member:", error)
      setDeleting(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          inline-flex
          items-center
          gap-1.5
          px-3
          py-1
          text-sm
          rounded-lg
          bg-red-100
          text-red-700
          hover:bg-red-200
          transition
        "
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>
    )
  }

  return (
    <>
      {/* Delete button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          inline-flex
          items-center
          gap-1.5
          px-3
          py-1
          text-sm
          rounded-lg
          bg-red-100
          text-red-700
          hover:bg-red-200
        "
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>

      {/* Modal */}
      <div
        className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/40
          px-4
        "
        onClick={() => {
          if (!deleting) {
            setOpen(false)
          }
        }}
      >
        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            bg-white
            p-7
            shadow-2xl
          "
          onClick={(event) => event.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Delete Team Member?
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                This action will permanently remove this team
                member from the organization.
              </p>
            </div>

            <button
              type="button"
              disabled={deleting}
              onClick={() => setOpen(false)}
              className="
                rounded-lg
                p-2
                text-slate-400
                hover:bg-slate-100
                hover:text-slate-700
                disabled:opacity-50
              "
            >
              <X className="h-5 w-5" />
            </button>

          </div>

          {/* Warning */}
          <div
            className="
              mt-5
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-4
            "
          >
            <p className="text-sm text-red-700">
              The user's account, location assignments and
              organization access will be removed.
            </p>

            <p className="mt-2 text-sm font-medium text-red-800">
              This cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-7 flex justify-end gap-3">

            <button
              type="button"
              disabled={deleting}
              onClick={() => setOpen(false)}
              className="
                rounded-xl
                border
                border-slate-300
                px-5
                py-2.5
                font-medium
                text-slate-700
                hover:bg-slate-50
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <form action={handleDelete}>

              <input
                type="hidden"
                name="id"
                value={id}
              />

              <button
                type="submit"
                disabled={deleting}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-5
                  py-2.5
                  font-medium
                  text-white
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Member
                  </>
                )}
              </button>

            </form>

          </div>
        </div>
      </div>
    </>
  )
}