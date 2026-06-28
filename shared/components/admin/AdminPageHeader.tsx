"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { ChevronRight } from "lucide-react"

type Action = {
  label: string
  href?: string
  onClick?: () => void
  icon?: ReactNode
  variant?: "primary" | "secondary" | "danger"
}

interface AdminPageHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  badge?: string
  actions?: Action[]
  breadcrumbs?: {
    label: string
    href?: string
  }[]
}

export default function AdminPageHeader({

  title,

  description,

  icon,

  badge,

  actions = [],

  breadcrumbs = []

}: AdminPageHeaderProps) {

  return (

    <div
      className="
      bg-white
      border
      rounded-3xl
      p-8
      mb-8
      "
    >

      {

        breadcrumbs.length > 0 && (

          <div
            className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-500
            mb-5
            flex-wrap
            "
          >

            {

              breadcrumbs.map((item, index) => (

                <div
                  key={index}
                  className="
                  flex
                  items-center
                  gap-2
                  "
                >

                  {

                    item.href ?

                    (

                      <Link
                        href={item.href}
                        className="
                        hover:text-orange-600
                        transition
                        "
                      >

                        {item.label}

                      </Link>

                    )

                    :

                    (

                      <span
                        className="
                        font-medium
                        text-slate-900
                        "
                      >

                        {item.label}

                      </span>

                    )

                  }

                  {

                    index <
                    breadcrumbs.length - 1 && (

                      <ChevronRight
                        size={15}
                      />

                    )

                  }

                </div>

              ))

            }

          </div>

        )

      }

      <div
        className="
        flex
        items-start
        justify-between
        gap-6
        flex-wrap
        "
      >

        <div
          className="
          flex
          items-start
          gap-5
          "
        >

          {

            icon && (

              <div
                className="
                w-14
                h-14
                rounded-2xl
                bg-orange-100
                text-orange-600
                flex
                items-center
                justify-center
                "
              >

                {icon}

              </div>

            )

          }

          <div>

            <div
              className="
              flex
              items-center
              gap-3
              flex-wrap
              "
            >

              <h1
                className="
                text-3xl
                font-bold
                text-slate-900
                "
              >

                {title}

              </h1>

              {

                badge && (

                  <span
                    className="
                    px-3
                    py-1
                    rounded-full
                    bg-orange-100
                    text-orange-700
                    text-xs
                    font-semibold
                    "
                  >

                    {badge}

                  </span>

                )

              }

            </div>

            {

              description && (

                <p
                  className="
                  mt-2
                  text-slate-500
                  max-w-3xl
                  "
                >

                  {description}

                </p>

              )

            }

          </div>

        </div>

        {

          actions.length > 0 && (

            <div
              className="
              flex
              gap-3
              flex-wrap
              "
            >

              {

                actions.map((action, index) => {

                  const classes =

                    action.variant === "danger"

                    ?

                    "bg-red-600 text-white hover:bg-red-700"

                    :

                    action.variant === "secondary"

                    ?

                    "border bg-white hover:bg-slate-100"

                    :

                    "bg-orange-600 text-white hover:bg-orange-700"

                  const content = (

                    <>

                      {

                        action.icon && (

                          <span>

                            {action.icon}

                          </span>

                        )

                      }

                      {action.label}

                    </>

                  )

                  if (action.href) {

                    return (

                      <Link

                        key={index}

                        href={action.href}

                        className={`
                        h-11
                        px-5
                        rounded-xl
                        flex
                        items-center
                        gap-2
                        transition
                        ${classes}
                        `}
                      >

                        {content}

                      </Link>

                    )

                  }

                  return (

                    <button

                      key={index}

                      onClick={action.onClick}

                      className={`
                      h-11
                      px-5
                      rounded-xl
                      flex
                      items-center
                      gap-2
                      transition
                      ${classes}
                      `}
                    >

                      {content}

                    </button>

                  )

                })

              }

            </div>

          )

        }

      </div>

    </div>

  )

}