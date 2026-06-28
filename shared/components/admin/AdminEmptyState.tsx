"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { Inbox } from "lucide-react"
import clsx from "clsx"

interface AdminEmptyStateProps {

  title?: string

  description?: string

  icon?: ReactNode

  buttonLabel?: string

  buttonHref?: string

  buttonIcon?: ReactNode

  secondaryButtonLabel?: string

  secondaryButtonHref?: string

  className?: string

}

export default function AdminEmptyState({

  title = "Nothing here yet",

  description = "There are no records to display.",

  icon,

  buttonLabel,

  buttonHref,

  buttonIcon,

  secondaryButtonLabel,

  secondaryButtonHref,

  className

}: AdminEmptyStateProps) {

  return (

    <div

      className={clsx(

        "bg-white",

        "border",

        "rounded-3xl",

        "py-20",

        "px-10",

        "flex",

        "flex-col",

        "items-center",

        "justify-center",

        "text-center",

        className

      )}

    >

      <div

        className="
        w-20
        h-20
        rounded-full
        bg-orange-100
        flex
        items-center
        justify-center
        text-orange-600
        "

      >

        {

          icon ??

          <Inbox size={36} />

        }

      </div>

      <h2

        className="
        mt-8
        text-2xl
        font-bold
        text-slate-900
        "

      >

        {title}

      </h2>

      <p

        className="
        mt-3
        max-w-xl
        text-slate-500
        "

      >

        {description}

      </p>

      {

        (buttonLabel || secondaryButtonLabel) && (

          <div

            className="
            mt-8
            flex
            items-center
            gap-3
            flex-wrap
            justify-center
            "

          >

            {

              buttonLabel &&

              buttonHref && (

                <Link

                  href={buttonHref}

                  className="
                  h-11
                  px-6
                  rounded-xl
                  bg-orange-600
                  text-white
                  flex
                  items-center
                  gap-2
                  hover:bg-orange-700
                  transition
                  "

                >

                  {buttonIcon}

                  {buttonLabel}

                </Link>

              )

            }

            {

              secondaryButtonLabel &&

              secondaryButtonHref && (

                <Link

                  href={secondaryButtonHref}

                  className="
                  h-11
                  px-6
                  rounded-xl
                  border
                  bg-white
                  flex
                  items-center
                  hover:bg-slate-50
                  transition
                  "

                >

                  {secondaryButtonLabel}

                </Link>

              )

            }

          </div>

        )

      }

    </div>

  )

}