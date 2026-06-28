"use client"

import { ReactNode } from "react"
import {
  AlertTriangle,
  Loader2,
  X
} from "lucide-react"
import clsx from "clsx"

interface AdminConfirmDialogProps {

  open: boolean

  title?: string

  description?: string

  confirmText?: string

  cancelText?: string

  icon?: ReactNode

  loading?: boolean

  danger?: boolean

  onConfirm: () => void

  onCancel: () => void

}

export default function AdminConfirmDialog({

  open,

  title = "Confirm Action",

  description = "Are you sure you want to continue?",

  confirmText = "Confirm",

  cancelText = "Cancel",

  icon,

  loading = false,

  danger = true,

  onConfirm,

  onCancel

}: AdminConfirmDialogProps) {

  if (!open) {

    return null

  }

  return (

    <div
      className="
      fixed
      inset-0
      z-[9999]
      bg-black/40
      backdrop-blur-sm
      flex
      items-center
      justify-center
      p-6
      "
    >

      <div
        className="
        w-full
        max-w-lg
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-hidden
        animate-in
        fade-in
        zoom-in-95
        duration-200
        "
      >

        <div
          className="
          flex
          items-center
          justify-between
          p-6
          border-b
          "
        >

          <div
            className="
            flex
            items-center
            gap-4
            "
          >

            <div
              className={clsx(

                "w-14",
                "h-14",
                "rounded-2xl",
                "flex",
                "items-center",
                "justify-center",

                danger

                  ?

                  "bg-red-100 text-red-600"

                  :

                  "bg-orange-100 text-orange-600"

              )}
            >

              {

                icon ??

                <AlertTriangle size={28} />

              }

            </div>

            <div>

              <h2
                className="
                text-xl
                font-bold
                "
              >

                {title}

              </h2>

              <p
                className="
                mt-1
                text-sm
                text-slate-500
                "
              >

                {description}

              </p>

            </div>

          </div>

          <button

            onClick={onCancel}

            disabled={loading}

            className="
            w-10
            h-10
            rounded-xl
            hover:bg-slate-100
            flex
            items-center
            justify-center
            "

          >

            <X size={18} />

          </button>

        </div>

        <div
          className="
          p-6
          flex
          justify-end
          gap-3
          "
        >

          <button

            onClick={onCancel}

            disabled={loading}

            className="
            h-11
            px-6
            rounded-xl
            border
            hover:bg-slate-50
            disabled:opacity-50
            "

          >

            {cancelText}

          </button>

          <button

            onClick={onConfirm}

            disabled={loading}

            className={clsx(

              "h-11",
              "px-6",
              "rounded-xl",
              "text-white",
              "flex",
              "items-center",
              "gap-2",
              "disabled:opacity-60",

              danger

                ?

                "bg-red-600 hover:bg-red-700"

                :

                "bg-orange-600 hover:bg-orange-700"

            )}

          >

            {

              loading && (

                <Loader2

                  size={18}

                  className="animate-spin"

                />

              )

            }

            {confirmText}

          </button>

        </div>

      </div>

    </div>

  )

}