"use client"

import {
  signIn,
} from "next-auth/react"

import {
  useState,
} from "react"

import Link from "next/link"

import {
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
} from "lucide-react"

import {
  getDashboardForRole,
  getDashboardForEmployeeRole,
} from "@/shared/config/role-dashboard"

export default function LoginPage() {

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  /* =========================================================
     SUBMIT
  ========================================================= */

  async function submit(
    e: React.FormEvent
  ) {

    e.preventDefault()

    if (loading) {
      return
    }

    setLoading(true)

    try {

      /* =====================================================
         SIGN IN
      ===================================================== */

      const res =
        await signIn(
          "credentials",
          {
            email:
              email
                .trim()
                .toLowerCase(),

            password,

            redirect: false,
          }
        )

      if (!res?.ok) {

        alert(
          "Invalid credentials"
        )

        setLoading(false)

        return
      }

      /* =====================================================
         FRESH SESSION
      ===================================================== */

      const sessionRes =
        await fetch(
          "/api/auth/session",
          {
            cache: "no-store",
          }
        )

      if (!sessionRes.ok) {

        alert(
          "Unable to load your session. Please try again."
        )

        setLoading(false)

        return
      }

      const session =
        await sessionRes.json()

      /* =====================================================
         SESSION VALUES
      ===================================================== */

      const role =
        String(
          session?.user?.role ?? ""
        )
          .trim()
          .toLowerCase()

      const isInternalEmployee =
        Boolean(
          session?.user
            ?.isInternalEmployee
        )

      const employeeRole =
        String(
          session?.user
            ?.employeeRole ?? ""
        )
          .trim()
          .toLowerCase()

      /* =====================================================
         SUPER ADMIN
      ===================================================== */

      if (
        role === "super_admin"
      ) {

        window.location.replace(
          getDashboardForRole(
            role
          )
        )

        return
      }

      /* =====================================================
         INTERNAL PLATFORM EMPLOYEE
      ===================================================== */

      if (
        role === "user" &&
        isInternalEmployee
      ) {

        window.location.replace(
          getDashboardForEmployeeRole(
            employeeRole
          )
        )

        return
      }

      /* =====================================================
         CUSTOMER CRM USER
         
         IMPORTANT:
         Do NOT blindly redirect every customer user
         to /dashboard.

         The server endpoint checks the user's actual
         organization-role permissions.
      ===================================================== */

      const redirectRes =
        await fetch(
          "/api/auth/post-login",
          {
            method: "GET",
            cache: "no-store",
          }
        )

      if (!redirectRes.ok) {

        alert(
          "Unable to determine your access permissions. Please try again."
        )

        setLoading(false)

        return
      }

      const redirectData =
        await redirectRes.json()

      const destination =
        typeof redirectData?.redirectTo ===
        "string"
          ? redirectData.redirectTo
          : "/dashboard"

      window.location.replace(
        destination
      )

    } catch (error) {

      console.error(
        "Login error:",
        error
      )

      alert(
        "Something went wrong while signing in. Please try again."
      )

      setLoading(false)
    }
  }

  return (
    <div
      className="
        min-h-screen
        grid
        lg:grid-cols-2
      "
    >

      {/* ===================================================
          LEFT
      =================================================== */}

      <div
        className="
          hidden
          lg:flex
          relative
          overflow-hidden
          bg-gradient-to-br
          from-slate-950
          via-slate-900
          to-black
        "
      >

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top_right,#f97316,transparent_30%)]
            opacity-30
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_bottom_left,#fb923c,transparent_25%)]
            opacity-20
          "
        />

        <div
          className="
            relative
            z-10
            flex
            flex-col
            justify-between
            p-20
            text-white
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <img
              src="/logo.png"
              className="
                w-14
                h-14
              "
              alt="Koniqtech"
            />

            <div>

              <h1
                className="
                  text-3xl
                  font-bold
                "
              >
                Koniqtech
              </h1>

              <p
                className="
                  text-slate-400
                "
              >
                Field Service CRM
              </p>

            </div>

          </div>

          <div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-orange-500/20
                text-orange-300
              "
            >

              <Sparkles
                size={16}
              />

              AI Powered Platform

            </div>

            <h1
              className="
                text-7xl
                font-bold
                leading-tight
                mt-8
              "
            >

              Run Your Entire

              <span
                className="
                  block
                  text-orange-400
                "
              >
                Service Business
              </span>

            </h1>

            <p
              className="
                text-xl
                text-slate-300
                mt-8
                max-w-xl
              "
            >
              Manage leads, customers,
              jobs, dispatch, crew,
              estimates, invoices and AI
              automation from one platform.
            </p>

            <div
              className="
                grid
                grid-cols-3
                gap-4
                mt-12
              "
            >

              <Metric
                value="42%"
                label="Revenue Growth"
              />

              <Metric
                value="10k+"
                label="Jobs Managed"
              />

              <Metric
                value="AI"
                label="Dispatch Engine"
              />

            </div>

            <div
              className="
                mt-10
                space-y-4
              "
            >

              <Feature
                text="Lead Management"
              />

              <Feature
                text="Job Scheduling"
              />

              <Feature
                text="Crew Dispatch"
              />

              <Feature
                text="AI Automation"
              />

            </div>

          </div>

        </div>

      </div>

      {/* ===================================================
          RIGHT
      =================================================== */}

      <div
        className="
          bg-slate-50
          flex
          items-start
          justify-center
          pt-24
          px-10
        "
      >

        <form
          onSubmit={submit}
          className="
            w-full
            max-w-[520px]
            bg-white
            border
            rounded-[36px]
            p-12
            shadow-[0_20px_80px_rgba(0,0,0,0.08)]
          "
        >

          <div
            className="
              lg:hidden
              flex
              items-center
              gap-3
              mb-8
            "
          >

            <img
              src="/logo.png"
              className="
                w-10
                h-10
              "
              alt="Koniqtech"
            />

            <div>

              <h2
                className="
                  font-bold
                "
              >
                Koniqtech
              </h2>

              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                Field Service CRM
              </p>

            </div>

          </div>

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Welcome Back
          </p>

          <h1
            className="
              text-5xl
              font-bold
              mt-2
            "
          >
            Sign In
          </h1>

          <p
            className="
              text-slate-500
              mt-3
            "
          >
            Access your CRM workspace
          </p>

          <div
            className="
              space-y-5
              mt-10
            "
          >

            {/* EMAIL */}

            <div
              className="
                relative
              "
            >

              <Mail
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Email"
                autoComplete="email"
                required
                className="
                  w-full
                  h-14
                  pl-12
                  pr-4
                  rounded-2xl
                  border
                  bg-slate-50
                  outline-none
                  focus:border-orange-500
                  focus:ring-2
                  focus:ring-orange-100
                "
              />

            </div>

            {/* PASSWORD */}

            <div
              className="
                relative
              "
            >

              <Lock
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Password"
                autoComplete="current-password"
                required
                className="
                  w-full
                  h-14
                  pl-12
                  pr-4
                  rounded-2xl
                  border
                  bg-slate-50
                  outline-none
                  focus:border-orange-500
                  focus:ring-2
                  focus:ring-orange-100
                "
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-orange-500
                to-orange-600
                text-white
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
                hover:from-orange-600
                hover:to-orange-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading
                ? "Signing in..."
                : "Continue"}

            </button>

            {/* LINKS */}

            <div
              className="
                mt-5
                flex
                justify-between
                text-sm
                text-slate-500
              "
            >

              <Link
                href="/register"
                className="
                  hover:text-orange-600
                  transition
                "
              >
                Create account
              </Link>

              <Link
                href="/forgot-password"
                className="
                  hover:text-orange-600
                  transition
                "
              >
                Forgot password?
              </Link>

            </div>

            {/* TRUST */}

            <div
              className="
                flex
                justify-center
                gap-6
                pt-2
                text-xs
                text-slate-500
              "
            >

              <span>
                256-bit SSL
              </span>

              <span>
                GDPR Ready
              </span>

              <span>
                99.9% Uptime
              </span>

            </div>

          </div>

        </form>

      </div>

    </div>
  )
}

/* =========================================================
   METRIC
========================================================= */

function Metric({
  value,
  label,
}: {
  value: string
  label: string
}) {

  return (
    <div
      className="
        bg-white/10
        rounded-3xl
        p-5
      "
    >

      <div
        className="
          text-3xl
          font-bold
        "
      >
        {value}
      </div>

      <div
        className="
          text-slate-400
          text-sm
          mt-1
        "
      >
        {label}
      </div>

    </div>
  )
}

/* =========================================================
   FEATURE
========================================================= */

function Feature({
  text,
}: {
  text: string
}) {

  return (
    <div
      className="
        flex
        items-center
        gap-3
      "
    >

      <CheckCircle2
        size={18}
        className="
          text-orange-400
        "
      />

      <span
        className="
          text-slate-300
        "
      >
        {text}
      </span>

    </div>
  )
}