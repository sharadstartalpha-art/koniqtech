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
  Search,
  ChevronRight,
  ChevronDown,
  Building2,
  Command,
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
  role?: string | null
  employeeRole?: string | null
  employeeId?: string | null
}

/* ==========================================================
   NORMALIZE EMPLOYEE ROLE
========================================================== */

function normalizeEmployeeRole(
  value?: string | null
): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
}

/* ==========================================================
   RESOLVE MENU ROLE
========================================================== */

function resolveMenuRole(
  userRole?: string | null,
  employeeRole?: string | null
): AdminRole {

  const normalizedUserRole =
    String(userRole ?? "")
      .trim()
      .toLowerCase()

  /*
   * SUPER ADMIN
   *
   * Only a real super_admin gets the
   * complete platform administration menu.
   */
  if (
    normalizedUserRole ===
    "super_admin"
  ) {
    return ROLE.SUPER_ADMIN
  }

  /*
   * INTERNAL EMPLOYEE
   *
   * Internal employees now use:
   *
   * User.role = user
   *
   * Employee.role = Data Entry / Sales / etc.
   *
   * Therefore we resolve the sidebar from
   * EmployeeRole.
   */

  const normalizedEmployeeRole =
    normalizeEmployeeRole(
      employeeRole
    )

  switch (
    normalizedEmployeeRole
  ) {

    case "data_entry":
      return ROLE.DATA_ENTRY

    case "sales":
    case "platform_sales":
      return ROLE.PLATFORM_SALES

    case "marketing":
      return ROLE.MARKETING

    case "support":
      return ROLE.SUPPORT

    case "accountant":
    case "finance":
      return ROLE.FINANCE

    case "platform_manager":
    case "manager":
      return ROLE.PLATFORM_MANAGER

    default:
      /*
       * IMPORTANT:
       *
       * Never fall back to Super Admin.
       *
       * Unknown / restricted users get the
       * safest internal menu instead.
       */
      return ROLE.DATA_ENTRY
  }
}

/* ==========================================================
   COMPONENT
========================================================== */

export default function AdminSidebar() {

  const pathname =
    usePathname()

  const [user, setUser] =
    useState<SidebarUser>({})

  const [search, setSearch] =
    useState("")

  const [loading, setLoading] =
    useState(true)

  const [expanded, setExpanded] =
    useState<string[]>([
      "Platform",
      "People",
    ])

  const [collapsed, setCollapsed] =
    useState(false)

  /* ========================================================
     SAVE EXPANDED STATE
  ======================================================== */

  useEffect(() => {

    localStorage.setItem(
      "admin-sidebar-expanded",
      JSON.stringify(expanded)
    )

  }, [expanded])

  /* ========================================================
     LOAD LOCAL STORAGE
  ======================================================== */

  useEffect(() => {

    const savedExpanded =
      localStorage.getItem(
        "admin-sidebar-expanded"
      )

    if (savedExpanded) {

      try {

        setExpanded(
          JSON.parse(
            savedExpanded
          )
        )

      } catch {
        // Ignore invalid local storage
      }

    }

    const savedSearch =
      localStorage.getItem(
        "admin-sidebar-search"
      )

    if (savedSearch) {

      setSearch(
        savedSearch
      )

    }

    const savedCollapsed =
      localStorage.getItem(
        "admin-sidebar-collapsed"
      )

    if (savedCollapsed) {

      setCollapsed(
        savedCollapsed === "true"
      )

    }

  }, [])

  /* ========================================================
     SAVE COLLAPSED STATE
  ======================================================== */

  useEffect(() => {

    localStorage.setItem(
      "admin-sidebar-collapsed",
      String(collapsed)
    )

  }, [collapsed])

  /* ========================================================
     SAVE SEARCH
  ======================================================== */

  useEffect(() => {

    localStorage.setItem(
      "admin-sidebar-search",
      search
    )

  }, [search])

  /* ========================================================
     LOAD SESSION
  ======================================================== */

  useEffect(() => {

    let mounted = true

    async function loadSession() {

      try {

        const session =
          await getSession()

        if (
          mounted &&
          session?.user
        ) {

          const sessionUser =
            session.user as any

    setUser({
  id: (session.user as any).id,

  name: (session.user as any).name,

  email: session.user.email ?? "",

  image: (session.user as any).image,

  role:
    (session.user as any).role ?? null,

  employeeRole:
    (session.user as any).employeeRole ?? null,

  employeeId:
    (session.user as any).employeeId ?? null,
})

        }

      } catch (error) {

        console.error(
          "Failed to load admin session:",
          error
        )

      } finally {

        if (mounted) {
          setLoading(false)
        }

      }

    }

    loadSession()

    return () => {
      mounted = false
    }

  }, [])

  /* ========================================================
     RESOLVE MENU ROLE
  ======================================================== */

  /* ==========================================================
   RESOLVE ADMIN MENU ROLE
========================================================== */


/* ==========================================================
   CURRENT MENU ROLE
========================================================== */

const menuRole =
  (() => {
    const userRole =
      String(user.role ?? "")
        .trim()
        .toLowerCase()

    // SUPER ADMIN
    if (userRole === "super_admin") {
      return ROLE.SUPER_ADMIN
    }

    // INTERNAL EMPLOYEE
    if (user.employeeId) {
      const employeeRole =
        normalizeEmployeeRole(user.employeeRole)

      switch (employeeRole) {
        case "data_entry":
          return ROLE.DATA_ENTRY

        case "marketing":
          return ROLE.MARKETING

        case "sales":
        case "sales_executive":
        case "sales_manager":
        case "platform_sales":
          return ROLE.PLATFORM_SALES

        case "support":
          return ROLE.SUPPORT

        case "finance":
        case "accounting":
        case "accountant":
          return ROLE.FINANCE

        case "developer":
          return ROLE.DEVELOPER

        case "qa":
          return ROLE.QA

        case "customer_success":
          return ROLE.CUSTOMER_SUCCESS

        case "platform_manager":
        case "manager":
          return ROLE.PLATFORM_MANAGER

        default:
          return null
      }
    }

    // CUSTOMER CRM USER
    return null
  })()
/* ==========================================================
   ROLE MENU
========================================================== */

const sections: AdminMenuSection[] =
  menuRole
    ? (
        MENU_BY_ROLE[
          menuRole
        ] ?? []
      )
    : []
  /* ========================================================
     SEARCH FILTER
  ======================================================== */

  const filteredSections =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase()

      if (!query) {
        return sections
      }

      return sections
        .map(
          (
            section
          ) => {

            const items =
              section.items.filter(
                (item) => {

                  const label =
                    item.label
                      .toLowerCase()

                  const href =
                    item.href
                      ?.toLowerCase() ??
                    ""

                  return (
                    label.includes(
                      query
                    ) ||
                    href.includes(
                      query
                    )
                  )

                }
              )

            return {
              ...section,
              items,
            }

          }
        )
        .filter(
          (
            section
          ) =>
            section.items.length >
            0
        )

    }, [
      sections,
      search,
    ])

  /* ========================================================
     TOGGLE SECTION
  ======================================================== */

  function toggleSection(
    title: string
  ) {

    setExpanded(
      (current) => {

        if (
          current.includes(
            title
          )
        ) {

          return current.filter(
            (item) =>
              item !== title
          )

        }

        return [
          ...current,
          title,
        ]

      }
    )

  }

  /* ========================================================
     ACTIVE ROUTE
  ======================================================== */

  function isActive(
    href?: string
  ) {

    if (!href) {
      return false
    }

    if (
      href ===
      "/admin/dashboard"
    ) {

      return (
        pathname ===
        href
      )

    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`
      )
    )

  }

  /* ========================================================
     MENU ITEM
  ======================================================== */

  function renderMenuItem(
    item: AdminMenuItem
  ) {

    const active =
      isActive(
        item.href
      )

    if (
      item.children &&
      item.children.length >
        0
    ) {

      return (
        <div
          key={
            item.label
          }
          className="space-y-1"
        >

          <div
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
              "text-slate-700"
            )}
          >

            <item.icon
              size={18}
              className="shrink-0"
            />

            {!collapsed && (
              <span>
                {item.label}
              </span>
            )}

          </div>

          {!collapsed && (
            <div className="ml-5 space-y-1">

              {item.children.map(
                (
                  child
                ) =>
                  renderMenuItem(
                    child
                  )
              )}

            </div>
          )}

        </div>
      )

    }

    return (
      <Link
        key={
          item.label
        }
        href={
          item.href ??
          "#"
        }
        className={clsx(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
          active
            ? "bg-orange-50 text-orange-600"
            : "text-slate-700 hover:bg-slate-50 hover:text-orange-600"
        )}
      >

        <item.icon
          size={18}
          className={clsx(
            "shrink-0",
            active
              ? "text-orange-500"
              : "text-slate-500 group-hover:text-orange-500"
          )}
        />

        {!collapsed && (
          <span className="truncate">
            {item.label}
          </span>
        )}

        {!collapsed &&
          item.badge && (
            <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
              {item.badge}
            </span>
          )}

      </Link>
    )

  }

  /* ========================================================
     LOADING STATE
  ======================================================== */

  if (loading) {

    return (
      <aside
        className={clsx(
          "flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white",
          collapsed
            ? "w-[76px]"
            : "w-[300px]"
        )}
      >

        <div className="flex h-[88px] items-center border-b border-slate-200 px-5">

          <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />

          {!collapsed && (
            <div className="ml-3 space-y-2">

              <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />

              <div className="h-3 w-36 animate-pulse rounded bg-slate-100" />

            </div>
          )}

        </div>

        <div className="space-y-3 p-4">

          {Array.from({
            length: 8,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded-xl bg-slate-50"
              />
            )
          )}

        </div>

      </aside>
    )

  }

  /* ========================================================
     SIDEBAR
  ======================================================== */

  return (
    <aside
      className={clsx(
        "flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white",
        collapsed
          ? "w-[76px]"
          : "w-[300px]"
      )}
    >

      {/* ==================================================
          BRAND
      ================================================== */}

      <div className="flex h-[88px] shrink-0 items-center border-b border-slate-200 px-5">

        <Link
          href={
            menuRole ===
            ROLE.SUPER_ADMIN
              ? "/admin/dashboard"
              : "/admin/data-entry/dashboard"
          }
          className="flex min-w-0 items-center gap-3"
        >

          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white">

            <Image
              src="/logo.png"
              alt="KoniqTech"
              fill
              sizes="44px"
              className="object-contain"
            />

          </div>

          {!collapsed && (
            <div className="min-w-0">

              <div className="truncate text-lg font-bold text-slate-950">
                KoniqTech
              </div>

              <div className="truncate text-xs text-slate-500">
                Platform Administration
              </div>

            </div>
          )}

        </Link>

      </div>

      {/* ==================================================
          SEARCH
      ================================================== */}

      {!collapsed && (
        <div className="shrink-0 border-b border-slate-100 p-4">

          <div className="relative">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search menu..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white"
            />

          </div>

        </div>
      )}

      {/* ==================================================
          MENU
      ================================================== */}

      <nav className="min-h-0 flex-1 overflow-y-auto p-3">

        <div className="space-y-5">

          {filteredSections.map(
            (
              section
            ) => {

              const open =
                expanded.includes(
                  section.title
                )

              return (
                <div
                  key={
                    section.title
                  }
                >

                  {/* SECTION HEADER */}

                  {!collapsed && (
                    <button
                      type="button"
                      onClick={() =>
                        toggleSection(
                          section.title
                        )
                      }
                      className="mb-1 flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                    >

                      <span>
                        {
                          section.title
                        }
                      </span>

                      {open ? (
                        <ChevronDown
                          size={14}
                        />
                      ) : (
                        <ChevronRight
                          size={14}
                        />
                      )}

                    </button>
                  )}

                  {/* ITEMS */}

                  {(collapsed ||
                    open) && (
                    <div className="space-y-1">

                      {section.items.map(
                        (
                          item
                        ) =>
                          renderMenuItem(
                            item
                          )
                      )}

                    </div>
                  )}

                </div>
              )

            }
          )}

        </div>

        {/* =================================================
            NO RESULTS
        ================================================= */}

        {filteredSections.length ===
          0 && (
          <div className="px-3 py-8 text-center text-sm text-slate-400">
            No menu items found.
          </div>
        )}

      </nav>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="shrink-0 border-t border-slate-200">
<SidebarFooter />

      </div>

      {/* ==================================================
          COLLAPSE CONTROL
      ================================================== */}

      <button
        type="button"
        onClick={() =>
          setCollapsed(
            (value) =>
              !value
          )
        }
        className="absolute bottom-24 left-[calc(100%-14px)] z-20 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-orange-600"
        aria-label={
          collapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
      >

        {collapsed ? (
          <ChevronRight
            size={15}
          />
        ) : (
          <ChevronRight
            size={15}
            className="rotate-180"
          />
        )}

      </button>

    </aside>
  )
}