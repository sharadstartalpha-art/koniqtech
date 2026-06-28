"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { getSession, signOut } from "next-auth/react"

import {
  MoreHorizontal,
  LogOut,
  Settings,
  User
} from "lucide-react"

type SessionUser = {
  name?: string
  email?: string
  image?: string
  role?: string
}

export default function SidebarFooter() {

  const [open, setOpen] = useState(false)

  const [user, setUser] = useState<SessionUser>({})

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {

    async function loadUser() {

      const session = await getSession()

      if (session?.user) {

        setUser({
          name: (session.user as any).name,
          email: session.user.email ?? "",
          image: (session.user as any).image,
          role: (session.user as any).role
        })

      }

    }

    loadUser()

  }, [])

  useEffect(() => {

    function outside(event: MouseEvent) {

      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
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

  }, [])

  return (

    <div
      ref={ref}
      className="
      border-t
      bg-white
      relative
      "
    >

      <button
        onClick={() => setOpen(!open)}
        className="
        w-full
        h-16
        px-4
        flex
        items-center
        justify-between
        hover:bg-slate-50
        transition
        "
      >

        <div className="flex items-center gap-3">

          {

            user.image ?

              <img
                src={user.image}
                alt="Avatar"
                className="
                w-10
                h-10
                rounded-full
                object-cover
                "
              />

            :

              <div
                className="
                w-10
                h-10
                rounded-full
                bg-orange-600
                text-white
                flex
                items-center
                justify-center
                font-semibold
                "
              >

                {user.name?.charAt(0).toUpperCase() || "A"}

              </div>

          }

          <div className="text-left">

            <p className="text-sm font-semibold">

              {user.name || "Admin"}

            </p>

            <p
              className="
              text-xs
              text-slate-500
              truncate
              max-w-[150px]
              "
            >

              {user.email}

            </p>

          </div>

        </div>

        <MoreHorizontal size={18} />

      </button>

      {

        open && (

          <div
            className="
            absolute
            left-3
            bottom-20
            w-64
            bg-white
            border
            rounded-2xl
            shadow-xl
            overflow-hidden
            z-50
            "
          >

            <div className="p-5 border-b">

              <div className="font-semibold">

                {user.name}

              </div>

              <div
                className="
                text-sm
                text-slate-500
                mt-1
                "
              >

                {user.email}

              </div>

              <div
                className="
                text-xs
                mt-2
                inline-flex
                px-2
                py-1
                rounded-full
                bg-orange-100
                text-orange-700
                "
              >

                {user.role ?? "super_admin"}

              </div>

            </div>

            <Link
              href="/admin/profile"
              className="
              flex
              items-center
              gap-3
              px-5
              py-4
              hover:bg-slate-50
              "
            >

              <User size={18} />

              My Profile

            </Link>

            <Link
              href="/admin/settings"
              className="
              flex
              items-center
              gap-3
              px-5
              py-4
              hover:bg-slate-50
              "
            >

              <Settings size={18} />

              Settings

            </Link>

            <button
              onClick={async () => {

                await signOut({
                  redirect: false
                })

                window.location.href = "/login"

              }}
              className="
              w-full
              flex
              items-center
              gap-3
              px-5
              py-4
              text-red-600
              hover:bg-red-50
              "
            >

              <LogOut size={18} />

              Logout

            </button>

          </div>

        )

      }

    </div>

  )

}