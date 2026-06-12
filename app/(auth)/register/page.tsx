"use client"

import { useState } from "react"
import Link from "next/link"

import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Mail,
  Lock,
  Building2,
  User
} from "lucide-react"

export default function RegisterPage() {

  const [name,setName] = useState("")
  const [company,setCompany] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [crmType,setCrmType] = useState("roofing")
  const [otp,setOtp] = useState("")
  const [step,setStep] = useState(1)

  const [sendingOtp,setSendingOtp] =
    useState(false)

  const [registering,setRegistering] =
    useState(false)

  async function sendOtp(){

    if(!email.trim()){

      alert("Please enter your email")

      return
    }

    try{

      setSendingOtp(true)

      const res =
        await fetch(
          "/api/auth/send-otp",
          {
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              email
            })
          }
        )

      const data =
        await res.json()

      if(!res.ok){

        alert(
          data.error ||
          "Failed to send OTP"
        )

        return
      }

      setStep(2)

      alert("OTP sent")

    }catch(error){

      console.error(error)

      alert("Something went wrong")

    }finally{

      setSendingOtp(false)

    }

  }

  async function register(){

    if(!otp.trim()){

      alert("Please enter OTP")

      return
    }

    try{

      setRegistering(true)

      const res =
        await fetch(
          "/api/auth/register",
          {
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              name,
              company,
              email,
              password,
              otp,
              crmType
            })
          }
        )

      const data =
        await res.json()

      if(!res.ok){

        alert(
          data.error ||
          "Registration failed"
        )

        return
      }

      const redirectUrl =
        `/subscriptions/paypal?crm=${crmType}&company=${encodeURIComponent(company)}&email=${encodeURIComponent(email)}`

      window.location.href =
        redirectUrl

    }catch(error){

      console.error(error)

      alert("Something went wrong")

    }finally{

      setRegistering(false)

    }

  }

  return(

    <div className="
    min-h-screen
    grid
    lg:grid-cols-2
    ">

      {/* LEFT SIDE */}

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

          <div>

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

              CRM Platform

            </div>

            <h1 className="
            text-7xl

            font-bold

            leading-tight

            mt-8
            ">

              Create Your

              <span className="
              block
              text-orange-400
              ">
                Service Business
              </span>

              Workspace

            </h1>

            <p className="
            text-xl

            text-slate-300

            mt-8

            max-w-xl
            ">

              Launch your CRM with
              subscriptions, dispatch,
              automation, invoicing and AI.

            </p>

            <div className="
            grid
            grid-cols-3
            gap-4

            mt-12
            ">

              <Metric
                value="10k+"
                label="Jobs Managed"
              />

              <Metric
                value="AI"
                label="Automation"
              />

              <Metric
                value="99.9%"
                label="Uptime"
              />

            </div>

            <div className="
            mt-10
            space-y-4
            ">

              <Feature text="Lead Management" />

              <Feature text="Job Scheduling" />

              <Feature text="Crew Dispatch" />

              <Feature text="Online Payments" />

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="
      bg-slate-50

      flex
      items-start
      justify-center

      pt-16
      px-10
      ">

        <div className="
        w-full

        max-w-[500px]

        bg-white

        border

        rounded-[36px]

        p-10

        shadow-[0_20px_80px_rgba(0,0,0,0.08)]
        ">

          <p className="
          text-sm
          text-slate-500
          ">
            Start Your Journey
          </p>

          <h1 className="
          text-5xl

          font-bold

          mt-2
          ">
            Create Account
          </h1>

          <p className="
          text-slate-500

          mt-3
          ">
            Build your CRM workspace
          </p>

          <div className="
          inline-flex

          mt-4

          px-3
          py-1

          rounded-full

          bg-orange-50

          text-orange-600

          text-xs
          font-medium
          ">

            Field Service CRM

          </div>

          <div className="
          space-y-4

          mt-8
          ">

            <InputIcon
              icon={<User size={18}/>}
              placeholder="Full Name"
              value={name}
              onChange={setName}
            />

            <InputIcon
              icon={<Building2 size={18}/>}
              placeholder="Company Name"
              value={company}
              onChange={setCompany}
            />

            <select
              value={crmType}
              onChange={e=>
                setCrmType(
                  e.target.value
                )
              }
              className="
              w-full
              h-14

              px-4

              rounded-2xl

              border

              bg-slate-50
              "
            >

              <option value="roofing">
                Roofing CRM ($199)
              </option>

              <option value="hvac">
                HVAC CRM ($199)
              </option>

              <option value="plumbing">
                Plumbing CRM ($199)
              </option>

              <option value="landscaping">
                Landscaping CRM ($199)
              </option>

            </select>

            <InputIcon
              icon={<Mail size={18}/>}
              placeholder="Email"
              value={email}
              onChange={setEmail}
            />

            <PasswordInput
              value={password}
              onChange={setPassword}
            />

            {step === 1 ? (

              <button
                onClick={sendOtp}
                disabled={sendingOtp}
                className="
                w-full
                h-14

                rounded-2xl

                bg-gradient-to-r

                from-orange-500
                to-orange-600

                text-white

                font-semibold
                "
              >

                {sendingOtp
                  ? "Sending OTP..."
                  : "Send OTP"}

              </button>

            ) : (

              <>

                <input
                  value={otp}
                  onChange={e=>
                    setOtp(
                      e.target.value
                    )
                  }
                  placeholder="Enter OTP"
                  className="
                  w-full
                  h-14

                  px-4

                  rounded-2xl

                  border

                  bg-slate-50
                  "
                />

                <button
                  onClick={register}
                  disabled={registering}
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
                  "
                >

                  {registering
                    ? "Creating Account..."
                    :
                    <>
                      Continue
                      <ArrowRight size={16}/>
                    </>
                  }

                </button>

              </>

            )}

            <div className="
            text-center

            pt-2

            text-sm
            text-slate-500
            ">

              Already have an account?

              <Link
                href="/login"
                className="
                ml-2

                font-medium

                text-orange-600

                hover:text-orange-700
                "
              >
                Sign In
              </Link>

            </div>

          </div>

        </div>

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
      text-sm
      text-slate-400
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

function InputIcon({
  icon,
  placeholder,
  value,
  onChange
}:any){

  return(

    <div className="relative">

      <div className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2

      text-slate-400
      ">
        {icon}
      </div>

      <input
        value={value}
        onChange={e=>
          onChange(
            e.target.value
          )
        }
        placeholder={placeholder}
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

  )
}

function PasswordInput({
  value,
  onChange
}:any){

  return(

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
        value={value}
        onChange={e=>
          onChange(
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

  )
}