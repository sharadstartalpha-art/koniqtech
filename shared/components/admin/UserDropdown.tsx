"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { getSession, signOut } from "next-auth/react"

import {
  User,
  Settings,
  Shield,
  Activity,
  Moon,
  Sun,
  LogOut,
  Loader2,
} from "lucide-react"

interface UserData {
  name?: string
  email?: string
  image?: string
  role?: string
}

interface UserDropdownProps {
  open: boolean
  setOpen: (value: boolean) => void
  user?: UserData
}

export default function UserDropdown({
  open,
  setOpen,
  user: initialUser,
}: UserDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState(false)

  const [theme, setTheme] = useState<"light" | "dark">("light")

  const [user, setUser] = useState<UserData>(
    initialUser ?? {}
  )

  useEffect(() => {
    async function loadUser() {
      if (initialUser) {
        setUser(initialUser)
        return
      }

      setLoading(true)

      const session = await getSession()

      if (session?.user) {
        setUser({
          name: (session.user as any).name,
          email: session.user.email ?? "",
          image: (session.user as any).image,
          role: (session.user as any).role,
        })
      }

      setLoading(false)
    }

    loadUser()
  }, [initialUser])

  useEffect(() => {
    if (
      document.documentElement.classList.contains("dark")
    ) {
      setTheme("dark")
    }
  }, [])

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener(
      "mousedown",
      outside
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        outside
      )
    }
  }, [setOpen])

  async function logout() {
    await signOut({
      redirect: false,
    })

    window.location.href = "/login"
  }

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

  if (!open) return null

  return (
    <div
      ref={ref}
      className="
        absolute
        right-0
        top-14
        z-50
        w-[320px]
        overflow-hidden
        rounded-3xl
        border
        bg-white
        shadow-2xl
        dark:border-slate-700
        dark:bg-slate-900
      "
    >
      <div className="border-b p-6">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2
              size={24}
              className="animate-spin"
            />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name ?? "User"}
                className="
                  h-14
                  w-14
                  rounded-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-orange-600
                  text-lg
                  font-bold
                  text-white
                "
              >
                {user.name?.charAt(0).toUpperCase() ??
                  "A"}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-lg">
                {user.name}
              </h3>

              <p className="truncate text-sm text-slate-500">
                {user.email}
              </p>

              <span
                className="
                  mt-2
                  inline-flex
                  rounded-full
                  bg-orange-100
                  px-2
                  py-1
                  text-xs
                  font-medium
                  text-orange-700
                "
              >
                {user.role}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="py-2">

              <Link
        href="/admin/profile"
        onClick={() => setOpen(false)}
        className="
          flex
          items-center
          gap-3
          px-6
          py-3
          transition
          hover:bg-slate-50
          dark:hover:bg-slate-800
        "
      >
        <User size={18} />
        <span>My Profile</span>
      </Link>

      <Link
        href="/admin/account"
        onClick={() => setOpen(false)}
        className="
          flex
          items-center
          gap-3
          px-6
          py-3
          transition
          hover:bg-slate-50
          dark:hover:bg-slate-800
        "
      >
        <Settings size={18} />
        <span>My Account</span>
      </Link>

      <Link
        href="/admin/security"
        onClick={() => setOpen(false)}
        className="
          flex
          items-center
          gap-3
          px-6
          py-3
          transition
          hover:bg-slate-50
          dark:hover:bg-slate-800
        "
      >
        <Shield size={18} />
        <span>Security</span>
      </Link>

      <Link
        href="/admin/activity"
        onClick={() => setOpen(false)}
        className="
          flex
          items-center
          gap-3
          px-6
          py-3
          transition
          hover:bg-slate-50
          dark:hover:bg-slate-800
        "
      >
        <Activity size={18} />
        <span>Activity Logs</span>
      </Link>

      <Link
        href="/admin/settings"
        onClick={() => setOpen(false)}
        className="
          flex
          items-center
          gap-3
          px-6
          py-3
          transition
          hover:bg-slate-50
          dark:hover:bg-slate-800
        "
      >
        <Settings size={18} />
        <span>Settings</span>
      </Link>
      </div>

      <div className="border-t">
        <button
          onClick={toggleTheme}
          className="
            flex
            w-full
            items-center
            justify-between
            px-6
            py-3
            transition
            hover:bg-slate-50
            dark:hover:bg-slate-800
          "
        >
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}

            <span>
              {theme === "dark"
                ? "Light Mode"
                : "Dark Mode"}
            </span>
          </div>
        </button>
      </div>

      <div className="border-t">
        <button
          onClick={logout}
          className="
            flex
            w-full
            items-center
            gap-3
            px-6
            py-4
            text-red-600
            transition
            hover:bg-red-50
            dark:hover:bg-red-950/30
          "
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}