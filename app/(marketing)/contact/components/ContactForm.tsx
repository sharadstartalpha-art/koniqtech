"use client"

import { FormEvent, useState } from "react"

import {
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react"

type FormState = "idle" | "submitting" | "success" | "error"

export default function ContactForm() {
  const [status, setStatus] = useState<FormState>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setStatus("submitting")
    setErrorMessage("")

    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      industry: String(formData.get("industry") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),

      // Honeypot
      website: String(formData.get("website") ?? "").trim(),
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to send your message."
        )
      }

      setStatus("success")
      form.reset()
    } catch (error) {
      console.error("[CONTACT_FORM]", error)

      setStatus("error")

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      )
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-7 w-7 text-green-600" />
        </div>

        <h3 className="mt-5 text-2xl font-bold text-slate-900">
          Message Sent!
        </h3>

        <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
          Thanks for contacting KoniqTech. Our team will review your message
          and get back to you as soon as possible.
        </p>

        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Honeypot */}
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website">
          Website
        </label>

        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Full Name"
          name="name"
          placeholder="John Smith"
          required
        />

        <Field
          label="Email Address"
          name="email"
          type="email"
          placeholder="john@company.com"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Company"
          name="company"
          placeholder="Your Company"
        />

        <Field
          label="Phone"
          name="phone"
          type="tel"
          placeholder="+1 555 123 4567"
        />
      </div>

      <div>
        <label
          htmlFor="industry"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Industry
        </label>

        <select
          id="industry"
          name="industry"
          defaultValue=""
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            Select your industry
          </option>

          <option value="Roofing">
            Roofing
          </option>

          <option value="HVAC">
            HVAC
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

          <option value="Other">
            Other
          </option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          How Can We Help?
        </label>

        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us what you'd like to know about KoniqTech..."
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending Message...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Send Message
          </>
        )}
      </button>

      <p className="text-center text-xs leading-5 text-slate-500">
        Your information is only used to respond to your enquiry.
      </p>
    </form>
  )
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string
  name: string
  placeholder: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
        {required && (
          <span className="ml-1 text-orange-500">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  )
}