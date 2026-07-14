import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  FileText,
  CalendarDays,
  ShieldCheck,
  UserCheck,
  Lock,
  CheckCircle2,
  Users,
  ClipboardCheck,
  Scale
} from "lucide-react"

export const metadata: Metadata = {
  title: "Terms & Conditions | KoniqTech",
  description:
    "Read the Terms & Conditions governing the use of KoniqTech's AI-powered Field Service CRM platform, website and related services."
}

const agreementItems = [
  {
    icon: FileText,
    title: "Service Agreement",
    description:
      "These Terms govern your access to and use of the KoniqTech website, CRM platform, AI services, customer portal and related products."
  },
  {
    icon: ShieldCheck,
    title: "Business Platform",
    description:
      "KoniqTech is designed for commercial and professional use by field service businesses and organizations."
  },
  {
    icon: Users,
    title: "Customer Responsibilities",
    description:
      "Customers are responsible for maintaining accurate account information and using the platform in accordance with applicable laws."
  },
  {
    icon: Scale,
    title: "Legal Compliance",
    description:
      "By using KoniqTech, you agree to comply with these Terms and all applicable local, national and international laws."
  }
]

const eligibilityRequirements = [
  "You are at least 18 years old.",
  "You have authority to act on behalf of your business or organization.",
  "Information provided during registration is accurate and complete.",
  "You will keep your account credentials secure.",
  "You will use KoniqTech only for lawful business purposes.",
  "You agree to these Terms & Conditions."
]

const registrationItems = [
  {
    title: "Business Account",
    description:
      "Each organization creates its own secure tenant account within KoniqTech."
  },
  {
    title: "Secure Authentication",
    description:
      "Account access is protected through secure authentication and encrypted credentials."
  },
  {
    title: "Role-Based Access",
    description:
      "Administrators can assign permissions and user roles across their organization."
  },
  {
    title: "Account Accuracy",
    description:
      "Customers must maintain current business information, contact details and billing information."
  }
]


const acceptableUse = [
  {
    icon: ShieldCheck,
    title: "Lawful Use",
    description:
      "Use KoniqTech only for lawful business purposes and in compliance with applicable laws and regulations."
  },
  {
    icon: Users,
    title: "Respect Other Users",
    description:
      "Do not interfere with, disrupt or attempt to gain unauthorized access to other customer accounts or the platform."
  },
  {
    icon: Lock,
    title: "Account Security",
    description:
      "Keep login credentials confidential and immediately notify us if you suspect unauthorized account access."
  },
  {
    icon: FileText,
    title: "Prohibited Activities",
    description:
      "Do not upload malicious software, spam, harmful content or use KoniqTech for illegal, fraudulent or abusive activities."
  }
]

const customerResponsibilities = [
  "Maintain accurate account information.",
  "Protect usernames, passwords and API credentials.",
  "Ensure employees use the platform responsibly.",
  "Comply with applicable privacy and data protection laws.",
  "Back up important business records when appropriate.",
  "Promptly report security concerns or unauthorized access."
]

const subscriptionInformation = [
  {
    title: "Subscription Plans",
    description:
      "KoniqTech offers subscription-based access to its CRM platform. Features depend on the selected plan."
  },
  {
    title: "Automatic Renewal",
    description:
      "Paid subscriptions renew automatically unless cancelled before the next billing cycle."
  },
  {
    title: "Billing Cycle",
    description:
      "Subscription fees are billed according to the selected monthly or annual billing period."
  },
  {
    title: "Plan Changes",
    description:
      "Customers may upgrade or downgrade plans in accordance with the options available within the platform."
  }
]


const intellectualProperty = [
  {
    icon: FileText,
    title: "Platform Ownership",
    description:
      "KoniqTech, including its software, branding, website, user interface, documentation and proprietary technology, remains the exclusive property of KoniqTech."
  },
  {
    icon: ShieldCheck,
    title: "License To Use",
    description:
      "Customers receive a limited, non-exclusive, non-transferable license to use the platform during an active subscription."
  },
  {
    icon: Lock,
    title: "Restrictions",
    description:
      "You may not copy, reverse engineer, modify, distribute, sublicense or create derivative works from the KoniqTech platform without written permission."
  },
  {
    icon: ClipboardCheck,
    title: "Customer Data",
    description:
      "Customers retain ownership of the business information and customer records they upload to KoniqTech."
  }
]

const aiDisclaimer = [
  "AI-generated content should always be reviewed before use.",
  "Customers remain responsible for business decisions made using AI outputs.",
  "AI responses may occasionally contain inaccuracies or incomplete information.",
  "KoniqTech continuously improves AI features but cannot guarantee perfect results."
]

const liabilityItems = [
  "Indirect or consequential damages",
  "Loss of profits or revenue",
  "Business interruption",
  "Loss of customer relationships",
  "Third-party software failures",
  "Events beyond reasonable control"
]

const termsFaqs = [
  {
    question: "Who do these Terms apply to?",
    answer:
      "These Terms apply to all users of the KoniqTech website, AI platform, CRM, customer portal and related services."
  },
  {
    question: "Can KoniqTech change these Terms?",
    answer:
      "Yes. We may update these Terms from time to time. Material changes will be published on this page with an updated effective date."
  },
  {
    question: "Who owns the data stored in my account?",
    answer:
      "Customers retain ownership of the business data they upload to KoniqTech. We process that information only to provide our services and as described in our Privacy Policy."
  },
  {
    question: "Can my account be suspended?",
    answer:
      "Yes. Accounts may be suspended or terminated for violations of these Terms, illegal activities or actions that threaten the security or reliability of the platform."
  },
  {
    question: "What happens if I cancel my subscription?",
    answer:
      "Your subscription will remain active until the end of the current billing period unless otherwise specified. Future renewals will stop after cancellation."
  },
  {
    question: "Where can I ask legal or contractual questions?",
    answer:
      "Please contact us at info@koniqtech.com and our team will respond as soon as possible."
  }
]



export default function TermsAndConditionsPage() {
  return (
    <main className="bg-white">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50" />

        <div className="relative mx-auto max-w-7xl px-6 py-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-blue-700">

                <FileText className="h-4 w-4" />

                Terms & Conditions

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                Terms That
                <span className="block text-green-600">
                  Protect Everyone
                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                These Terms & Conditions explain the rules,
                responsibilities,
                rights
                and obligations that apply when using the
                KoniqTech AI-powered Field Service CRM platform,
                website and related services.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
                >

                  Start Free Trial

                  <ArrowRight className="h-5 w-5" />

                </Link>

                <Link
                  href="/privacy-policy"
                  className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                >

                  Privacy Policy

                </Link>

              </div>

            </div>

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    Agreement Summary

                  </h3>

                  <ClipboardCheck className="h-8 w-8 text-green-400" />

                </div>

                <div className="mt-10 space-y-5">

                  <SummaryMetric
                    title="Commercial Use"
                    value="Supported"
                  />

                  <SummaryMetric
                    title="Multi-Tenant"
                    value="Secure"

                  />

                  <SummaryMetric
                    title="User Roles"
                    value="RBAC"

                  />

                  <SummaryMetric
                    title="Compliance"
                    value="Required"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* EFFECTIVE DATE */}
      {/* ====================================================== */}

      <section className="pb-20">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[36px] border bg-blue-50 p-8">

            <div className="flex flex-col gap-6 md:flex-row md:items-center">

              <div className="rounded-2xl bg-blue-100 p-4">

                <CalendarDays className="h-8 w-8 text-blue-600" />

              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-900">

                  Effective Date

                </h2>

                <p className="mt-2 text-lg text-slate-600">

                  These Terms & Conditions are effective from
                  <strong> July 2026</strong> and apply to all users of
                  the KoniqTech website, CRM platform, AI services,
                  customer portal and associated products.

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* AGREEMENT OVERVIEW */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Agreement Overview

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Understanding
              Your Agreement

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              By accessing or using KoniqTech,
              you agree to these Terms & Conditions.
              If you do not agree,
              you should discontinue use of our services.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {agreementItems.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="w-fit rounded-2xl bg-green-100 p-4">

                    <Icon className="h-8 w-8 text-green-600" />

                  </div>

                  <h3 className="mt-8 text-3xl font-bold text-slate-900">

                    {item.title}

                  </h3>

                  <p className="mt-5 leading-8 text-slate-600">

                    {item.description}

                  </p>

                </div>

              )

            })}

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* ELIGIBILITY */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-16 lg:grid-cols-2">

            <div>

              <p className="font-semibold uppercase tracking-widest text-blue-600">

                Eligibility

              </p>

              <h2 className="mt-4 text-5xl font-black text-slate-900">

                Who Can Use
                KoniqTech?

              </h2>

              <p className="mt-8 text-xl leading-9 text-slate-600">

                KoniqTech is intended for business users,
                contractors,
                organizations
                and professionals operating within supported industries.

              </p>

            </div>

            <div className="space-y-5">

              {eligibilityRequirements.map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4 rounded-[28px] bg-white p-6 shadow-sm"
                >

                  <CheckCircle2 className="h-6 w-6 text-green-600" />

                  <span className="text-lg font-medium text-slate-700">

                    {item}

                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* ACCOUNT REGISTRATION */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-600">

              Account Registration

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Creating Your
              KoniqTech Account

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Organizations register a secure account and manage
              users through role-based permissions within their
              own isolated workspace.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {registrationItems.map((item) => (

              <div
                key={item.title}
                className="rounded-[36px] border bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="w-fit rounded-2xl bg-orange-100 p-4">

                  <Lock className="h-8 w-8 text-orange-600" />

                </div>

                <h3 className="mt-8 text-3xl font-bold text-slate-900">

                  {item.title}

                </h3>

                <p className="mt-5 leading-8 text-slate-600">

                  {item.description}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* ACCEPTABLE USE */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Acceptable Use

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Responsible Use
              Of KoniqTech

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              To maintain a secure and reliable platform,
              customers agree to use KoniqTech responsibly
              and in accordance with these Terms.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {acceptableUse.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="w-fit rounded-2xl bg-green-100 p-4">

                    <Icon className="h-8 w-8 text-green-600" />

                  </div>

                  <h3 className="mt-8 text-3xl font-bold text-slate-900">

                    {item.title}

                  </h3>

                  <p className="mt-5 leading-8 text-slate-600">

                    {item.description}

                  </p>

                </div>

              )

            })}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* CUSTOMER RESPONSIBILITIES */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="grid gap-16 lg:grid-cols-2">

            <div>

              <p className="font-semibold uppercase tracking-widest text-blue-600">

                Customer Responsibilities

              </p>

              <h2 className="mt-4 text-5xl font-black text-slate-900">

                Working Together
                Securely

              </h2>

              <p className="mt-8 text-xl leading-9 text-slate-600">

                Customers play an important role in protecting
                their accounts,
                business information
                and team members.

              </p>

            </div>

            <div className="space-y-5">

              {customerResponsibilities.map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4 rounded-[28px] border bg-white p-6 shadow-sm"
                >

                  <CheckCircle2 className="h-6 w-6 text-blue-600" />

                  <span className="text-lg font-medium text-slate-700">

                    {item}

                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

     
            {/* ====================================================== */}
      {/* SUBSCRIPTIONS */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-600">

              Subscription & Billing

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Subscription
              Information

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              KoniqTech provides subscription-based access to
              its AI-powered CRM platform.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {subscriptionInformation.map((item) => (

              <div
                key={item.title}
                className="rounded-[36px] border bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="rounded-2xl bg-orange-100 p-4 w-fit">

                  <FileText className="h-8 w-8 text-orange-600" />

                </div>

                <h3 className="mt-8 text-3xl font-bold text-slate-900">

                  {item.title}

                </h3>

                <p className="mt-5 leading-8 text-slate-600">

                  {item.description}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

            {/* ====================================================== */}
      {/* BILLING */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-12 text-white">

            <h2 className="text-5xl font-black">

              Billing & Payments

            </h2>

            <div className="mt-10 space-y-8 text-lg leading-8 text-blue-100">

              <div>

                <h3 className="text-2xl font-bold text-white">

                  PayPal Business

                </h3>

                <p className="mt-3">

                  Subscription payments are securely processed through
                  <strong> PayPal Business</strong>. KoniqTech does not
                  store complete payment card information.

                </p>

              </div>

              <div>

                <h3 className="text-2xl font-bold text-white">

                  Free Trial

                </h3>

                <p className="mt-3">

                  Eligible customers may receive a free trial.
                  At the end of the trial, continued access may require
                  an active paid subscription.

                </p>

              </div>

              <div>

                <h3 className="text-2xl font-bold text-white">

                  Cancellation

                </h3>

                <p className="mt-3">

                  Customers may cancel their subscription at any time.
                  Cancellation prevents future renewals but does not
                  automatically refund charges already processed,
                  except where required by law or specifically stated
                  in our refund policy.

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

               {/* ====================================================== */}
      {/* INTELLECTUAL PROPERTY */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Intellectual Property

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Ownership &
              Platform Rights

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              KoniqTech protects its software,
              technology,
              branding
              and intellectual property while respecting
              customer ownership of business data.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {intellectualProperty.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="w-fit rounded-2xl bg-green-100 p-4">

                    <Icon className="h-8 w-8 text-green-600" />

                  </div>

                  <h3 className="mt-8 text-3xl font-bold text-slate-900">

                    {item.title}

                  </h3>

                  <p className="mt-5 leading-8 text-slate-600">

                    {item.description}

                  </p>

                </div>

              )

            })}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* AI DISCLAIMER */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-12 text-white">

            <h2 className="text-5xl font-black">

              AI Services Disclaimer

            </h2>

            <p className="mt-8 text-xl leading-9 text-blue-100">

              KoniqTech provides AI-powered features to assist with
              productivity, automation and decision support.
              AI functionality is intended to complement human judgment,
              not replace it.

            </p>

            <div className="mt-12 space-y-5">

              {aiDisclaimer.map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur"
                >

                  <CheckCircle2 className="h-6 w-6 text-green-300" />

                  <span className="text-lg">

                    {item}

                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* LIABILITY */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-16 lg:grid-cols-2">

            <div>

              <p className="font-semibold uppercase tracking-widest text-orange-600">

                Limitation Of Liability

              </p>

              <h2 className="mt-4 text-5xl font-black text-slate-900">

                Understanding
                Responsibility

              </h2>

              <p className="mt-8 text-xl leading-9 text-slate-600">

                To the maximum extent permitted by applicable law,
                KoniqTech's liability is limited as described in
                these Terms & Conditions.

              </p>

            </div>

            <div className="space-y-5">

              {liabilityItems.map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4 rounded-[28px] bg-white p-6 shadow-sm"
                >

                  <CheckCircle2 className="h-6 w-6 text-orange-600" />

                  <span className="text-lg font-medium text-slate-700">

                    {item}

                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* SERVICE AVAILABILITY */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 lg:grid-cols-2">

            <div className="rounded-[36px] border bg-white p-10 shadow-sm">

              <h2 className="text-4xl font-black text-slate-900">

                Service Availability

              </h2>

              <p className="mt-8 text-lg leading-8 text-slate-600">

                We strive to provide reliable,
                secure
                and continuously available services.
                However,
                maintenance,
                upgrades,
                security improvements
                or unforeseen technical issues may occasionally
                affect availability.

              </p>

              <p className="mt-6 text-lg leading-8 text-slate-600">

                KoniqTech may temporarily suspend services to
                protect customers,
                maintain platform security
                or perform scheduled maintenance.

              </p>

            </div>

            <div className="rounded-[36px] border bg-white p-10 shadow-sm">

              <h2 className="text-4xl font-black text-slate-900">

                Governing Law

              </h2>

              <p className="mt-8 text-lg leading-8 text-slate-600">

                These Terms & Conditions are governed by the
                applicable laws specified in your customer agreement
                and any mandatory consumer protection laws that apply
                to your jurisdiction.

              </p>

              <p className="mt-6 text-lg leading-8 text-slate-600">

                Where legally permitted,
                disputes should first be addressed through
                good-faith discussions before pursuing formal
                legal remedies.

              </p>

            </div>

          </div>

        </div>

      </section>

              {/* ====================================================== */}
      {/* CONTACT INFORMATION */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-[40px] border bg-white p-12 shadow-sm">

            <div className="text-center">

              <p className="font-semibold uppercase tracking-widest text-blue-600">

                Contact Information

              </p>

              <h2 className="mt-4 text-5xl font-black text-slate-900">

                Questions About
                These Terms?

              </h2>

              <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

                If you have questions regarding these Terms &
                Conditions, subscriptions or legal matters,
                our team is happy to help.

              </p>

            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2">

              <InfoCard
                title="General Email"
                value="info@koniqtech.com"
              />

              <InfoCard
                title="Website"
                value="https://koniqtech.com"
              />

              <InfoCard
                title="Business Hours"
                value="Monday – Friday"
              />

              <InfoCard
                title="Typical Response"
                value="Within 1 Business Day"
              />

            </div>

          </div>

        </div>

      </section>

            {/* ====================================================== */}
      {/* FAQ */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-5xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Frequently Asked Questions

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Terms &
              Conditions FAQ

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Find answers to common questions about subscriptions,
              customer responsibilities and platform usage.

            </p>

          </div>

          <div className="mt-20 space-y-8">

            {termsFaqs.map((faq) => (

              <div
                key={faq.question}
                className="rounded-[32px] border bg-white p-10 shadow-sm"
              >

                <h3 className="text-2xl font-bold text-slate-900">

                  {faq.question}

                </h3>

                <p className="mt-5 leading-8 text-slate-600">

                  {faq.answer}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* LEGAL NOTICE */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-blue-50 p-12">

            <h2 className="text-5xl font-black text-slate-900">

              Legal Notice

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              These Terms & Conditions form a legally binding agreement
              between you and KoniqTech regarding the use of our website,
              AI-powered CRM platform, customer portal and related
              services.

            </p>

            <p className="mt-8 text-lg leading-8 text-slate-600">

              These Terms should be read together with our Privacy Policy
              and Cookie Policy. If any provision becomes unenforceable,
              the remaining provisions will continue to apply to the
              fullest extent permitted by law.

            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <Link
                href="/privacy-policy"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                Privacy Policy

              </Link>

              <Link
                href="/cookie-policy"
                className="rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
              >

                Cookie Policy

              </Link>

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-green-600 via-blue-600 to-indigo-700 px-10 py-24 text-center text-white shadow-xl">

            <ShieldCheck className="mx-auto h-16 w-16 text-green-200" />

            <h2 className="mt-8 text-5xl font-black">

              Ready To
              Grow Your Business?

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

              Join roofing, HVAC, plumbing and landscaping companies
              using KoniqTech to streamline operations, automate
              workflows and deliver outstanding customer experiences.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/register"
                className="rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
              >

                Start Free Trial

              </Link>

              <Link
                href="/demo"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                Book Live Demo

              </Link>

            </div>

          </div>

        </div>

      </section>



    </main>
  )
}

function SummaryMetric({
  title,
  value
}: {
  title: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-800 px-6 py-5">

      <span className="text-slate-300">

        {title}

      </span>

      <span className="font-bold text-green-400">

        {value}

      </span>

    </div>
  )
}

function InfoCard({
  title,
  value
}:{
  title:string
  value:string
}){

  return(

    <div className="rounded-[28px] border bg-slate-50 p-8">

      <h3 className="text-lg font-bold text-slate-900">

        {title}

      </h3>

      <p className="mt-3 text-slate-600 break-all">

        {value}

      </p>

    </div>

  )

}