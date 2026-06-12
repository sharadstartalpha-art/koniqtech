"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"

import {
  Building2,
  Shield,
  ArrowRight,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2
} from "lucide-react"

export default function LoginPage() {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)

  async function submit(
    e: React.FormEvent
  ){

    e.preventDefault()

    setLoading(true)

    const res = await signIn(
      "credentials",
      {
        email,
        password,
        redirect:false
      }
    )

    setLoading(false)

    if(!res?.ok){

      alert("Invalid credentials")

      return
    }

    const sessionRes =
      await fetch(
        "/api/auth/session",
        {
          cache:"no-store"
        }
      )

    const session =
      await sessionRes.json()

    const role =
      session?.user?.role

    if(role==="super_admin"){

      window.location.href=
      "/admin/dashboard"

      return
    }

    window.location.href=
    "/dashboard"
  }

  return(

    <div className="
    min-h-screen
    grid
    lg:grid-cols-2
    ">

      {/* LEFT */}

      <div className="
      hidden
      lg:flex

      relative

      overflow-hidden

      bg-gradient-to-br

      from-slate-950
      via-slate-900
      to-black
      ">

        <div className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_top_right,#f97316,transparent_30%)]
        opacity-30
        " />

        <div className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_bottom_left,#fb923c,transparent_25%)]
        opacity-20
        " />

        <div className="
        relative
        z-10

        flex
        flex-col
        justify-between

        p-20

        text-white
        ">

          <div className="
          flex
          items-center
          gap-4
          ">

            <img
              src="/logo.png"
              className="w-14 h-14"
            />

            <div>

              <h1 className="
              text-3xl
              font-bold
              ">
                Koniqtech
              </h1>

              <p className="
              text-slate-400
              ">
                Field Service CRM
              </p>

            </div>

          </div>

          <div>

            <div className="
            inline-flex

            items-center
            gap-2

            px-4
            py-2

            rounded-full

            bg-orange-500/20

            text-orange-300
            ">

              <Sparkles size={16}/>

              AI Powered Platform

            </div>

            <h1 className="
            text-7xl

            font-bold

            leading-tight

            mt-8
            ">

              Run Your Entire

              <span className="
              block
              text-orange-400
              ">
                Service Business
              </span>

            </h1>

            <p className="
            text-xl

            text-slate-300

            mt-8

            max-w-xl
            ">

              Manage leads, customers,
              jobs, dispatch, crew,
              estimates, invoices and AI
              automation from one platform.

            </p>

            <div className="
            grid
            grid-cols-3
            gap-4

            mt-12
            ">

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

            <div className="
            mt-10
            space-y-4
            ">

              <Feature text="Lead Management" />
              <Feature text="Job Scheduling" />
              <Feature text="Crew Dispatch" />
              <Feature text="AI Automation" />

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div className="
      bg-slate-50

      flex
      items-center
      justify-center

      p-10
      ">

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

          <div className="
          lg:hidden

          flex
          items-center
          gap-3

          mb-8
          ">

            <img
              src="/logo.png"
              className="w-10 h-10"
            />

            <div>

              <h2 className="font-bold">
                Koniqtech
              </h2>

              <p className="
              text-xs
              text-slate-500
              ">
                Field Service CRM
              </p>

            </div>

          </div>

          <p className="
          text-sm
          text-slate-500
          ">
            Welcome Back
          </p>

          <h1 className="
          text-5xl

          font-bold

          mt-2
          ">
            Sign In
          </h1>

          <p className="
          text-slate-500

          mt-3
          ">
            Access your CRM workspace
          </p>

          <div className="
          space-y-5

          mt-10
          ">

            <div className="relative">

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

                value={email}

                onChange={e=>
                  setEmail(
                    e.target.value
                  )
                }

                placeholder="Email"

                className="
                w-full

                h-14

                pl-12
                pr-4

                rounded-2xl

                border

                bg-slate-50
                "
              />

            </div>

            <div className="relative">

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

                onChange={e=>
                  setPassword(
                    e.target.value
                  )
                }

                placeholder="Password"

                className="
                w-full

                h-14

                pl-12
                pr-4

                rounded-2xl

                border

                bg-slate-50
                "
              />

            </div>

            <div className="
            flex
            justify-between

            text-sm
            ">

              <Link
                href="/register"
                className="
                text-slate-500
                hover:text-black
                "
              >
                Create account
              </Link>

              <Link
                href="/forgot-password"
                className="
                text-slate-500
                hover:text-black
                "
              >
                Forgot password?
              </Link>

            </div>

            <button

              disabled={loading}

              className="
              w-full

              h-14

              rounded-2xl

              bg-gradient-to-r

              from-orange-500
              to-orange-600

              hover:opacity-95

              text-white

              font-semibold

              shadow-lg

              flex
              items-center
              justify-center
              gap-2
              "
            >

              {
                loading

                ?

                "Signing in..."

                :

                <>

                  Continue

                  <ArrowRight size={16}/>

                </>
              }

            </button>

            <div className="
            flex
            justify-center
            gap-6

            pt-2

            text-xs

            text-slate-500
            ">

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

function Metric({
  value,
  label
}:any){

  return(

    <div className="
    bg-white/10

    rounded-3xl

    p-5
    ">

      <div className="
      text-3xl

      font-bold
      ">
        {value}
      </div>

      <div className="
      text-slate-400

      text-sm

      mt-1
      ">
        {label}
      </div>

    </div>
  )
}

function Feature({
  text
}:any){

  return(

    <div className="
    flex
    items-center
    gap-3
    ">

      <CheckCircle2
        size={18}
        className="text-orange-400"
      />

      <span className="
      text-slate-300
      ">
        {text}
      </span>

    </div>
  )
}