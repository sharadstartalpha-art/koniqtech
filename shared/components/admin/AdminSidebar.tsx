"use client"

import Image from "next/image"
import Link from "next/link"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import { usePathname } from "next/navigation"

import { getSession } from "next-auth/react"

import clsx from "clsx"

import {
  ChevronRight,
  ChevronDown,
  Building2,
  } from "lucide-react"

import SidebarFooter from "./SidebarFooter"

import {
  MENU_BY_ROLE,
  ROLE,
  type AdminMenuItem,
  type AdminMenuSection,
  type AdminRole,
} from "@/shared/config/admin-menu"

/* ==========================================================
   TYPES
========================================================== */

type SidebarUser = {
  id?: string
  name?: string
  email?: string
  image?: string
  role?: AdminRole
}

/* ==========================================================
   COMPONENT
========================================================== */

export default function AdminSidebar() {

  const pathname = usePathname()

  const [user, setUser] =
    useState<SidebarUser>({})

    const [loading, setLoading] =
    useState(true)

  const [expanded, setExpanded] =
    useState<string[]>([
      "Platform",
      "People",
    ])
useEffect(() => {
  localStorage.setItem(
    "admin-sidebar-expanded",
    JSON.stringify(expanded)
  )
}, [expanded])
/* ==========================================================
   COLLAPSE SIDEBAR (DESKTOP)
========================================================== */

const [collapsed, setCollapsed] =
  useState(false)

  useEffect(() => {

  const savedExpanded =
    localStorage.getItem(
      "admin-sidebar-expanded"
    )

  if (savedExpanded) {

    try {

      setExpanded(
        JSON.parse(savedExpanded)
      )

    } catch {}

  }

  

}, [])

useEffect(() => {

  const saved =
    localStorage.getItem(
      "admin-sidebar-collapsed"
    )

  if (saved) {

    setCollapsed(
      saved === "true"
    )

  }

}, [])

useEffect(() => {

  localStorage.setItem(

    "admin-sidebar-collapsed",

    String(collapsed)

  )

}, [collapsed])

  /* ========================================================
     LOAD SESSION
  ======================================================== */

  useEffect(() => {

    async function loadSession() {

      const session =
        await getSession()

      if (session?.user) {

        setUser({

          id:
            (session.user as any).id,

          name:
            (session.user as any).name,

          email:
            session.user.email ?? "",

          image:
            (session.user as any).image,

          role:
            ((session.user as any).role ??
              ROLE.SUPER_ADMIN) as AdminRole,

        })

      }

      setLoading(false)

    }

    loadSession()

  }, [])

  /* ========================================================
     CURRENT ROLE
  ======================================================== */

  const role: AdminRole =
    user.role ??
    ROLE.SUPER_ADMIN

  /* ========================================================
     ROLE MENU
  ======================================================== */

  const sections =
    MENU_BY_ROLE[role] ??
    MENU_BY_ROLE[ROLE.SUPER_ADMIN]

 
  /* ==========================================================
     EXPAND / COLLAPSE
  ========================================================== */

  function toggleSection(
    title: string
  ) {

    setExpanded((prev) =>

      prev.includes(title)

        ? prev.filter(
            (x) => x !== title
          )

        : [...prev, title]

    )

  }

 

  /* ==========================================================
     OPEN GROUP OF ACTIVE PAGE
  ========================================================== */

  useEffect(() => {

    const openGroups: string[] = []

    sections.forEach((section) => {

      section.items.forEach((item) => {

        if (!item.children) return

        const active =
          item.children.some((child) => {

            if (!child.href)
              return false

            return pathname.startsWith(
              child.href
            )

          })

        if (active) {

          if (
            !openGroups.includes(
              section.title
            )
          ) {

            openGroups.push(
              section.title
            )

          }

        }

      })

    })

    if (openGroups.length) {

      setExpanded((prev) => [

        ...new Set([
          ...prev,
          ...openGroups,
        ]),

      ])

    }

  }, [
    pathname,
    sections,
  ])

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {

    return (
      <aside
        className="
          flex
          h-screen
          w-[300px]
          items-center
          justify-center
          border-r
          bg-white
        "
      >

        <div
          className="
            text-sm
            text-slate-500
          "
        >
          Loading...
        </div>

      </aside>
    )

  }

  /* ==========================================================
     PART 3 CONTINUES HERE
  ========================================================== */
    /* ==========================================================
     START RENDER
  ========================================================== */

  return (

    <aside
      className="
        flex
        h-screen
        w-[300px]
        shrink-0
        flex-col
        overflow-hidden
        border-r
        bg-white
        dark:border-slate-800
        dark:bg-slate-950
      "
    >

      {/* ===============================================
          LOGO
      =============================================== */}

      <div
        className="
          flex
          h-20
          items-center
          gap-4
          border-b
          px-6
          dark:border-slate-800
        "
      >

        <Image
          src="/logo.png"
          alt="KoniqTech"
          width={42}
          height={42}
          priority
        />

        <div>

          <h1
            className="
              text-xl
              font-bold
              tracking-tight
            "
          >
            KoniqTech
          </h1>

          <p
            className="
              text-xs
              text-slate-500
            "
          >
            Platform Administration
          </p>

        </div>

      </div>

      


      {/* ===============================================
          NAVIGATION
      =============================================== */}

      <div
    className="
    flex-1
    overflow-y-auto
    px-3
    pb-6
    scrollbar-thin
    "
>


             {sections.map(
  (
    section: AdminMenuSection,
    sectionIndex: number
  ) => {

    const isFlatSection =
      !section.title?.trim()

    const sectionOpen =
      isFlatSection ||
      expanded.includes(
        section.title
      )


    return (

      <div
        key={
          section.title ||
          `flat-section-${sectionIndex}`
        }
        className="mb-2"
      >

        {/* =====================================
            SECTION HEADER

            Empty title:
            Do not render dropdown header.

            Normal title:
            Keep existing dropdown behavior.
        ===================================== */}

        {!isFlatSection && (

          <button
            type="button"
            onClick={() =>
              toggleSection(
                section.title
              )
            }
            className="
              mb-1
              flex
              h-10
              w-full
              items-center
              justify-between
              rounded-xl
              px-3
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-slate-500
              transition
              hover:bg-slate-100
              dark:hover:bg-slate-800
            "
          >

            <span>
              {section.title}
            </span>


            {sectionOpen ? (

              <ChevronDown
                size={15}
              />

            ) : (

              <ChevronRight
                size={15}
              />

            )}

          </button>

        )}


        {/* =====================================
            SECTION ITEMS

            Flat section:
            Always visible.

            Normal section:
            Visible only when expanded.
        ===================================== */}

        {sectionOpen && (

          <div className="space-y-1">

            {section.items.map(
              (
                item: AdminMenuItem
              ) => {

                const Icon =
                  item.icon


                const hasChildren =
                  !!item.children?.length


                const active =
                  item.href
                    ? (
                        pathname ===
                          item.href ||

                        (
                          item.href !==
                            "/admin/data-entry" &&

                          pathname.startsWith(
                            `${item.href}/`
                          )
                        )
                      )
                    : (
                        item.children?.some(
                          (child) =>
                            child.href &&
                            (
                              pathname ===
                                child.href ||

                              pathname.startsWith(
                                `${child.href}/`
                              )
                            )
                        ) ?? false
                      )


                return (

                  <div
                    key={
                      item.href ||
                      item.label
                    }
                    className="space-y-1"
                  >

                    {/* ==========================
                        SINGLE ITEM
                    ========================== */}

                    {!hasChildren && (

                      <Link
                        href={
                          item.href!
                        }
                        className={clsx(

                          `
                            flex
                            h-11
                            items-center
                            gap-3
                            rounded-xl
                            px-4
                            transition
                          `,

                          active
                            ? `
                                bg-orange-50
                                font-medium
                                text-orange-600
                                dark:bg-orange-950/30
                              `
                            : `
                                text-slate-700
                                hover:bg-slate-100
                                dark:text-slate-300
                                dark:hover:bg-slate-800
                              `

                        )}
                      >

                        <Icon
                          size={18}
                        />


                        <span className="flex-1">

                          {item.label}

                        </span>


                        {item.badge && (

                          <span
                            className="
                              rounded-full
                              bg-red-500
                              px-2
                              py-0.5
                              text-[10px]
                              font-semibold
                              text-white
                            "
                          >

                            {item.badge}

                          </span>

                        )}

                      </Link>

                    )}


                    {/* ==========================
                        GROUP
                    ========================== */}

                    {hasChildren && (

                      <>

                        <button
                          type="button"
                          onClick={() =>
                            toggleSection(
                              item.label
                            )
                          }
                          className={clsx(

                            `
                              flex
                              h-11
                              w-full
                              items-center
                              justify-between
                              rounded-xl
                              px-4
                              transition
                            `,

                            active
                              ? `
                                  bg-orange-50
                                  text-orange-600
                                  dark:bg-orange-950/30
                                `
                              : `
                                  hover:bg-slate-100
                                  dark:hover:bg-slate-800
                                `

                          )}
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <Icon
                              size={18}
                            />


                            <span>

                              {item.label}

                            </span>

                          </div>


                          {expanded.includes(
                            item.label
                          ) ? (

                            <ChevronDown
                              size={16}
                            />

                          ) : (

                            <ChevronRight
                              size={16}
                            />

                          )}

                        </button>


                        {/* ======================
                            CHILDREN
                        ====================== */}

                        {expanded.includes(
                          item.label
                        ) && (

                          <div
                            className="
                              ml-6
                              border-l
                              border-slate-200
                              pl-4
                              dark:border-slate-700
                            "
                          >

                            {item.children!.map(
                              (child) => {

                                const childActive =
                                  pathname ===
                                    child.href ||

                                  (
                                    child.href
                                      ? pathname.startsWith(
                                          `${child.href}/`
                                        )
                                      : false
                                  )


                                return (

                                  <Link
                                    key={
                                      child.href
                                    }
                                    href={
                                      child.href!
                                    }
                                    className={clsx(

                                      `
                                        flex
                                        h-10
                                        items-center
                                        rounded-lg
                                        px-3
                                        text-sm
                                        transition
                                      `,

                                      childActive
                                        ? `
                                            bg-orange-100
                                            font-medium
                                            text-orange-700
                                            dark:bg-orange-950/40
                                            dark:text-orange-300
                                          `
                                        : `
                                            text-slate-600
                                            hover:bg-slate-100
                                            dark:text-slate-400
                                            dark:hover:bg-slate-800
                                          `

                                    )}
                                  >

                                    <span className="flex-1">

                                      {child.label}

                                    </span>


                                    {child.badge && (

                                      <span
                                        className="
                                          rounded-full
                                          bg-orange-600
                                          px-2
                                          py-0.5
                                          text-[10px]
                                          font-semibold
                                          text-white
                                        "
                                      >

                                        {child.badge}

                                      </span>

                                    )}

                                  </Link>

                                )

                              }
                            )}

                          </div>

                        )}

                      </>

                    )}

                  </div>

                )

              }
            )}

          </div>

        )}

      </div>

    )

  }
)}

           </div>   

      {/* ==========================================================
          FOOTER
      ========================================================== */}

      <div
        className="
          shrink-0
          border-t
          bg-white
          dark:bg-slate-950
          dark:border-slate-800
        "
      >

       <SidebarFooter />

      </div>

    </aside>

  )

}

