"use client"

import Link from "next/link"
import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

interface Props {
  homeHref?: string
  homeLabel?: string
}

export default function AdminBreadcrumb({
  homeHref = "/admin/dashboard",
  homeLabel = "Dashboard"
}: Props) {

  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {

    const segments =
      pathname
        .split("/")
        .filter(Boolean)

    const adminIndex =
      segments.indexOf("admin")

    const items =
      segments.slice(adminIndex + 1)

    return items.map((segment, index) => {

      const href =
        "/" +
        segments
          .slice(0, adminIndex + 2 + index)
          .join("/")

      return {
        href,
        label:
          segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, c =>
              c.toUpperCase()
            )
      }

    })

  }, [pathname])

  return (

    <nav
      aria-label="Breadcrumb"
      className="
      flex
      items-center
      gap-2
      text-sm
      text-slate-500
      "
    >

      <Link
        href={homeHref}
        className="
        flex
        items-center
        gap-2
        hover:text-orange-600
        transition
        "
      >

        <Home size={16} />

        {homeLabel}

      </Link>

      {

        breadcrumbs.map((item, index) => {

          const active =
            index === breadcrumbs.length - 1

          return (

            <div
              key={item.href}
              className="
              flex
              items-center
              gap-2
              "
            >

              <ChevronRight
                size={15}
                className="text-slate-400"
              />

              {

                active

                ?

                <span
                  className="
                  font-semibold
                  text-slate-900
                  "
                >

                  {item.label}

                </span>

                :

                <Link
                  href={item.href}
                  className="
                  hover:text-orange-600
                  transition
                  "
                >

                  {item.label}

                </Link>

              }

            </div>

          )

        })

      }

    </nav>

  )

}