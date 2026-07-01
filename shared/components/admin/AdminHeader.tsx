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
  Bell,
} from "lucide-react"

import NotificationDropdown from "./NotificationDropdown"
import UserDropdown from "@/shared/common/UserDropdown"

type HeaderUser = {
  name?: string
  email?: string
  image?: string
  role?: string
}

export default function AdminHeader() {
  const pathname = usePathname()

  const [user, setUser] = useState<HeaderUser>({})
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

 

  const breadcrumbs = useMemo(() => {
    return pathname.split("/").filter(Boolean)
  }, [pathname])

  

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

       

        <div className="flex items-center gap-2">

         <div className="relative">

    <button

        onClick={() =>
            setNotificationOpen(!notificationOpen)
        }

        className="
        h-11
        w-11
        rounded-xl
        border
        flex
        items-center
        justify-center
        hover:bg-slate-100
        "

    >

        <Bell size={18} />

    </button>

    <NotificationDropdown
        open={notificationOpen}
        setOpen={setNotificationOpen}
    />

</div>

        <div className="relative">

    <button
        onClick={() => setUserOpen(!userOpen)}
        className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        px-3
        py-2
        hover:bg-slate-50
        "
    >

        <div
            className="
            h-10
            w-10
            rounded-full
            bg-orange-600
            text-white
            flex
            items-center
            justify-center
            font-semibold
            "
        >
            {user.name?.charAt(0).toUpperCase() ?? "A"}
        </div>

        <div className="text-left">

            <div className="font-semibold">
                {user.name}
            </div>

            <div className="text-xs text-slate-500">
                {user.email}
            </div>

        </div>

    </button>

    <UserDropdown
        open={userOpen}
        setOpen={setUserOpen}
        user={user}
    />

</div>



        </div>

      </div>

    </header>
  )
}