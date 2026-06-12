import Link from "next/link"

import {
  Mail,
  ArrowLeft,
  Shield,
  CheckCircle2,
  Sparkles
} from "lucide-react"

export default function Page() {

  return (

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

              Account Recovery

            </div>

            <h1 className="
            text-7xl

            font-bold

            leading-tight

            mt-8
            ">

              Secure

              <span className="
              block
              text-orange-400
              ">
                Password
              </span>

              Recovery

            </h1>

            <p className="
            text-xl

            text-slate-300

            mt-8

            max-w-xl
            ">

              Reset your password securely
              and regain access to your CRM
              workspace in minutes.

            </p>

            <div className="
            mt-12
            space-y-4
            ">

              <Feature text="Secure Email Verification" />

              <Feature text="Encrypted Password Reset" />

              <Feature text="Account Protection" />

              <Feature text="Fast Recovery Process" />

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div className="
      bg-slate-50

      flex
      items-start
      justify-center

      pt-20
      px-10
      ">

        <div className="
        w-full

        max-w-[480px]

        bg-white

        border

        rounded-[36px]

        p-10

        shadow-[0_20px_80px_rgba(0,0,0,0.08)]
        ">

          <div className="
          inline-flex

          px-3
          py-1

          rounded-full

          bg-orange-50

          text-orange-600

          text-xs
          font-medium
          ">

            Account Recovery

          </div>

          <h1 className="
          text-5xl

          font-bold

          mt-4
          ">
            Forgot Password
          </h1>

          <p className="
          text-slate-500

          mt-3
          ">
            Enter your email address and
            we'll send you a password reset link.
          </p>

          <div className="
          mt-8
          space-y-5
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

                placeholder="Email Address"

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

            <button

              className="
              w-full

              h-14

              rounded-2xl

              bg-gradient-to-r

              from-orange-500
              to-orange-600

              text-white

              font-semibold

              shadow-lg
              "
            >

              Send Reset Link

            </button>

            <Link

              href="/login"

              className="
              w-full

              h-14

              rounded-2xl

              border

              flex
              items-center
              justify-center
              gap-2

              text-slate-700

              hover:bg-slate-50

              transition
              "
            >

              <ArrowLeft size={16}/>

              Back to Login

            </Link>

          </div>

          <div className="
          mt-8

          pt-6

          border-t

          space-y-3
          ">

            <div className="
            flex
            items-center
            gap-3

            text-sm

            text-slate-500
            ">

              <Shield
                size={16}
                className="text-orange-500"
              />

              Secure password recovery

            </div>

            <div className="
            flex
            items-center
            gap-3

            text-sm

            text-slate-500
            ">

              <CheckCircle2
                size={16}
                className="text-orange-500"
              />

              Reset link expires automatically

            </div>

          </div>

        </div>

      </div>

    </div>

  )
}

function Feature({
  text
}:{
  text:string
}){

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