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