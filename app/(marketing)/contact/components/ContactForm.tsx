"use client"

import { useActionState } from "react"
import {
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react"

import {
  sendContactForm,
  type ContactFormState,
} from "../actions"

const initialState: ContactFormState = {
  success: false,
  message: "",
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactForm,
    initialState
  )

  return (
    <form
      action={formAction}
      className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl sm:p-8 lg:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">

        {/* NAME */}

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Full Name *
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            placeholder="Your name"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* EMAIL */}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Email Address *
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* COMPANY */}

        <div>
          <label
            htmlFor="company"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Company
          </label>

          <input
            id="company"
            name="company"
            type="text"
            maxLength={150}
            placeholder="Company name"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* PHONE */}

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Phone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 555 123 4567"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* INDUSTRY */}

        <div className="sm:col-span-2">
          <label
            htmlFor="industry"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Industry *
          </label>

          <select
            id="industry"
            name="industry"
            required
            defaultValue=""
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="" disabled>
              Select your industry
            </option>

            <option value="HVAC">
              HVAC
            </option>

            <option value="Roofing">
              Roofing
            </option>

            <option value="Plumbing">
              Plumbing
            </option>

            <option value="Landscaping">
              Landscaping
            </option>

            <option value="Other Field Service">
              Other Field Service
            </option>
          </select>
        </div>

        {/* MESSAGE */}

        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            How Can We Help? *
          </label>

          <textarea
            id="message"
            name="message"
            required
            maxLength={5000}
            rows={6}
            placeholder="Tell us about your business or what you'd like to know about KoniqTech..."
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

      </div>

      {/* OPTIONS */}

      <div className="mt-6 space-y-4">

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="demo"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
          />

          <span className="text-sm leading-6 text-slate-600">
            I'd like to request a product demo.
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="privacy"
            required
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
          />

          <span className="text-sm leading-6 text-slate-600">
            I agree to the KoniqTech Privacy Policy and
            consent to being contacted regarding my enquiry.
          </span>
        </label>

      </div>

      {/* RESULT */}

      {state.message && (
        <div
          className={`mt-6 rounded-xl border px-4 py-4 text-sm ${
            state.success
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.success && (
            <CheckCircle2 className="mr-2 inline-block h-5 w-5" />
          )}

          {state.message}
        </div>
      )}

      {/* BUTTON */}

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Send Message
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs text-slate-500">
        We normally respond within one business day.
      </p>
    </form>
  )
}