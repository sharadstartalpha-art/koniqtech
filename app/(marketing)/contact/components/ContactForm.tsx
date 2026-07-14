"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"

import {
  Building2,
  CheckCircle2,
  Globe,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
  Users
} from "lucide-react"

import {
  sendContactForm,
  type ContactFormState
} from "../actions"

const initialState: ContactFormState = {
  success: false,
  message: ""
}

const industries = [
  "Roofing",
  "HVAC",
  "Plumbing",
  "Landscaping",
  "Electrical",
  "Cleaning",
  "General Contractor",
  "Pest Control",
  "Other"
]

const companySizes = [
  "1-5 Employees",
  "6-20 Employees",
  "21-50 Employees",
  "51-100 Employees",
  "100+ Employees"
]

const subjects = [
  "General Question",
  "Book Demo",
  "Sales",
  "Pricing",
  "Technical Support",
  "Billing",
  "Partnership",
  "Other"
]

export default function ContactForm() {

  const [state, formAction] =
    useActionState(sendContactForm, initialState)

  useEffect(() => {

    if (state.success) {

      const form =
        document.getElementById(
          "contact-form"
        ) as HTMLFormElement | null

      form?.reset()

    }

  }, [state])

  return (

    <form
      id="contact-form"
      action={formAction}
      className="
      rounded-[40px]
      border
      bg-white
      p-10
      shadow-xl
      "
    >

      <div className="grid gap-6 md:grid-cols-2">

        <Input
          icon={<User className="h-5 w-5" />}
          label="First Name *"
          name="firstName"
          required
        />

        <Input
          icon={<User className="h-5 w-5" />}
          label="Last Name"
          name="lastName"
        />

      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">

        <Input
          icon={<Building2 className="h-5 w-5" />}
          label="Business Name"
          name="business"
        />

        <Select
          icon={<Users className="h-5 w-5" />}
          label="Company Size"
          name="companySize"
          options={companySizes}
        />

      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">

        <Select
          icon={<Building2 className="h-5 w-5" />}
          label="Industry *"
          name="industry"
          required
          options={industries}
        />

        <Input
          icon={<Globe className="h-5 w-5" />}
          label="Country"
          name="country"
        />

      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">

        <Input
          icon={<Mail className="h-5 w-5" />}
          label="Email *"
          type="email"
          name="email"
          required
        />

        <Input
          icon={<Phone className="h-5 w-5" />}
          label="Phone"
          name="phone"
        />

      </div>

      <div className="mt-6">

        <Select
          icon={<MessageSquare className="h-5 w-5" />}
          label="Subject *"
          name="subject"
          required
          options={subjects}
        />

      </div>

      <div className="mt-6">

        <label className="block">

          <span className="mb-2 block font-semibold text-slate-700">

            Message *

          </span>

          <textarea
            required
            name="message"
            rows={6}
            className="
            w-full
            rounded-2xl
            border
            border-slate-300
            px-5
            py-4
            outline-none
            transition
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
            "
            placeholder="How can we help you?"
          />

        </label>

      </div>

      <div className="mt-8 space-y-4">

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="demo"
            className="h-5 w-5 rounded"
          />

          <span>

            I would like to schedule a live demo.

          </span>

        </label>

        <label className="flex items-center gap-3">

          <input
            required
            type="checkbox"
            name="privacy"
            className="h-5 w-5 rounded"
          />

          <span>

            I agree to the Privacy Policy.

          </span>

        </label>

      </div>

      {state.message && (

        <div
          className={`
          mt-8
          rounded-2xl
          p-5

          ${
            state.success
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }
          `}
        >

          <div className="flex items-center gap-3">

            <CheckCircle2 className="h-6 w-6" />

            <span className="font-medium">

              {state.message}

            </span>

          </div>

        </div>

      )}

      <div className="mt-10">

        <SubmitButton />

      </div>

    </form>

  )

}

function SubmitButton() {

  const { pending } = useFormStatus()

  return (

    <button
      disabled={pending}
      className="
      inline-flex
      items-center
      gap-2

      rounded-2xl

      bg-orange-500

      px-8
      py-4

      font-semibold
      text-white

      transition

      hover:bg-orange-600

      disabled:cursor-not-allowed
      disabled:opacity-70
      "
    >

      <Send className="h-5 w-5" />

      {pending
        ? "Sending..."
        : "Send Message"}

    </button>

  )

}

function Input({
  label,
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon: React.ReactNode
}) {

  return (

    <label className="block">

      <span className="mb-2 block font-semibold text-slate-700">

        {label}

      </span>

      <div
        className="
        flex
        items-center

        rounded-2xl
        border
        border-slate-300

        px-4
        "
      >

        <div className="text-slate-400">

          {icon}

        </div>

        <input
          {...props}
          className="
          w-full

          bg-transparent

          px-3
          py-4

          outline-none
          "
        />

      </div>

    </label>

  )

}

function Select({
  label,
  icon,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  icon: React.ReactNode
  options: string[]
}) {

  return (

    <label className="block">

      <span className="mb-2 block font-semibold text-slate-700">

        {label}

      </span>

      <div
        className="
        flex
        items-center

        rounded-2xl
        border
        border-slate-300

        px-4
        "
      >

        <div className="text-slate-400">

          {icon}

        </div>

        <select
          {...props}
          className="
          w-full

          bg-transparent

          px-3
          py-4

          outline-none
          "
        >

          <option value="">

            Select

          </option>

          {options.map(option => (

            <option
              key={option}
              value={option}
            >

              {option}

            </option>

          ))}

        </select>

      </div>

    </label>

  )

}