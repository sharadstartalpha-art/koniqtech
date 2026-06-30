"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { getSession } from "next-auth/react"
import { usePathname } from "next/navigation"

import {
  Search,
  ChevronRight,
  Building2,
  Users,
  CreditCard,
  Sparkles,
  Moon,
  Sun,
  Command,
} from "lucide-react"

import NotificationDropdown from "./NotificationDropdown"
import UserDropdown from "./UserDropdown"

type HeaderUser = {
  name?: string
  email?: string
  image?: string
  role?: string
}

export default function AdminHeader() {
  const pathname = usePathname()

  const [user, setUser] = useState<HeaderUser>({})
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [search, setSearch] = useState("")
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const session = await getSession()

      if (!session?.user) return

      setUser({
        name: (session.user as any).name,
        email: session.user.email ?? "",
        image: (session.user as any).image,
        role: (session.user as any).role,
      })
    }

    loadUser()
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem("theme")

    if (saved === "dark") {
      document.documentElement.classList.add("dark")
      setTheme("dark")
    }
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()

        const input = document.getElementById(
          "admin-search"
        ) as HTMLInputElement | null

        input?.focus()
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    setNotificationOpen(false)
    setUserOpen(false)
  }, [pathname])

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")

    function change() {
      if (!document.documentElement.classList.contains("dark")) {
        setTheme(media.matches ? "dark" : "light")
      }
    }

    media.addEventListener("change", change)

    return () => media.removeEventListener("change", change)
  }, [])

  const breadcrumbs = useMemo(() => {
    return pathname.split("/").filter(Boolean)
  }, [pathname])

  function toggleTheme() {
    const html = document.documentElement

    if (html.classList.contains("dark")) {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setTheme("light")
    } else {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setTheme("dark")
    }
  }

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {breadcrumbs.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-2"
            >
              {index > 0 && <ChevronRight size={15} />}

              <span className="capitalize">
                {item.replaceAll("-", " ")}
              </span>
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold">
          Administration
        </h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">

        <div className="relative w-full max-w-xl">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-slate-400"
          />

          <input
            id="admin-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="
              h-11
              w-full
              rounded-xl
              border
              bg-slate-50
              pl-11
              pr-28
              outline-none
              focus:ring-2
              focus:ring-orange-500
              dark:border-slate-700
              dark:bg-slate-900
            "
          />

          <div
            className="
              absolute
              right-3
              top-2.5
              flex
              items-center
              gap-1
              rounded-lg
              border
              bg-white
              px-2
              py-1
              text-xs
              text-slate-500
              dark:border-slate-700
              dark:bg-slate-800
            "
          >
            <Command size={13} />
            K
          </div>

        </div>

        <div className="flex items-center gap-2">

         

                    <button
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              hover:bg-orange-50
              dark:border-slate-700
              dark:hover:bg-slate-800
            "
          >
            <Sparkles size={18} />
          </button>

          
          <NotificationDropdown
            open={notificationOpen}
            setOpen={setNotificationOpen}
          />

          <UserDropdown
            open={userOpen}
            setOpen={setUserOpen}
            user={user}
          />

        </div>

      </div>

    </header>
  )
}