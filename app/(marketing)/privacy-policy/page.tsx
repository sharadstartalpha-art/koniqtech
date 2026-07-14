import type { Metadata } from "next"
import Link from "next/link"

import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Database,
  Globe,
  Mail,
  UserCheck,
  FileText,
  CalendarDays,
  CheckCircle2
} from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | KoniqTech",
  description:
    "Read KoniqTech's Privacy Policy to understand how we collect, use, protect and process personal information for our AI-powered Field Service CRM platform."
}

const collectedInformation = [
  {
    icon: UserCheck,
    title: "Account Information",
    description:
      "Name, email address, company details, password, user role and account preferences provided during registration."
  },
  {
    icon: Mail,
    title: "Communication Data",
    description:
      "Information submitted through contact forms, demo requests, support tickets and email conversations."
  },
  {
    icon: Database,
    title: "CRM Business Data",
    description:
      "Customer records, leads, jobs, invoices, scheduling information and other business data stored within your KoniqTech account."
  },
  {
    icon: Globe,
    title: "Technical Information",
    description:
      "Browser type, operating system, IP address, device information, usage analytics and security logs."
  }
]


const informationUsage = [
  {
    icon: UserCheck,
    title: "Provide Our Services",
    description:
      "Create and manage your KoniqTech account, authenticate users and deliver CRM functionality."
  },
  {
    icon: Database,
    title: "Improve The Platform",
    description:
      "Analyze product usage to improve performance, reliability, user experience and future features."
  },
  {
    icon: Mail,
    title: "Customer Support",
    description:
      "Respond to enquiries, demo requests, technical issues and customer service communications."
  },
  {
    icon: ShieldCheck,
    title: "Security & Fraud Prevention",
    description:
      "Protect accounts, detect suspicious activity and maintain platform security."
  }
]

const thirdPartyServices = [
  {
    service: "PayPal Business",
    purpose: "Secure subscription and payment processing."
  },
  {
    service: "Resend",
    purpose: "Transactional emails including verification, notifications and contact responses."
  },
  {
    service: "Neon PostgreSQL",
    purpose: "Secure cloud database hosting for application data."
  },
  {
    service: "Cloudflare R2",
    purpose: "Secure document and file storage."
  },
  {
    service: "Vercel",
    purpose: "Application hosting and deployment."
  }
]

const cookieTypes = [
  "Authentication cookies",
  "Session management",
  "Security cookies",
  "Performance cookies",
  "Preference cookies",
  "Analytics cookies"
]


const securityMeasures = [
  {
    icon: ShieldCheck,
    title: "Encrypted Communication",
    description:
      "All communication between your browser and KoniqTech is encrypted using HTTPS/TLS."
  },
  {
    icon: Lock,
    title: "Secure Authentication",
    description:
      "Accounts are protected using secure authentication, encrypted passwords and role-based access controls."
  },
  {
    icon: Database,
    title: "Tenant Data Isolation",
    description:
      "Every customer operates within an isolated organization, preventing access to another customer's data."
  },
  {
    icon: Globe,
    title: "Continuous Monitoring",
    description:
      "Our infrastructure is monitored to detect unauthorized access, abuse and suspicious activities."
  }
]

const privacyRights = [
  "Access your personal information",
  "Correct inaccurate information",
  "Request deletion of your account",
  "Export your business data",
  "Withdraw marketing consent",
  "Object to certain data processing",
  "Request processing restrictions",
  "Contact us regarding privacy concerns"
]


const privacyFaqs = [
  {
    question: "How can I request access to my personal data?",
    answer:
      "You can contact us at info@koniqtech.com to request access to your personal information or business data associated with your KoniqTech account."
  },
  {
    question: "How do I request deletion of my account?",
    answer:
      "You may contact our support team to request account deletion. Certain information may be retained where required by law or for legitimate business purposes."
  },
  {
    question: "Does KoniqTech sell personal information?",
    answer:
      "No. KoniqTech does not sell customer personal information or business data to third parties."
  },
  {
    question: "Where can I report a privacy concern?",
    answer:
      "Please email info@koniqtech.com with the details of your concern. Our team will investigate and respond as quickly as possible."
  },
  {
    question: "How are security incidents handled?",
    answer:
      "We investigate suspected security incidents promptly and take appropriate measures to protect affected systems and customer data."
  },
  {
    question: "Does this Privacy Policy apply to all KoniqTech services?",
    answer:
      "Yes. This policy applies to the KoniqTech website, AI platform, CRM, customer portal, mobile applications and related services unless otherwise stated."
  }
]

export default function PrivacyPolicyPage() {

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

                <ShieldCheck className="h-4 w-4" />

                Privacy Policy

              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">

                Your Privacy

                <span className="block text-green-600">

                  Matters To Us

                </span>

              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">

                KoniqTech is committed to protecting your personal
                information and your business data. This Privacy Policy
                explains how we collect, use, store and safeguard
                information when you use our AI-powered Field Service CRM.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
                >

                  Contact Us

                  <ArrowRight className="h-5 w-5" />

                </Link>

                <Link
                  href="/terms-and-conditions"
                  className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                >

                  Terms & Conditions

                </Link>

              </div>

            </div>

            <div className="rounded-[40px] border bg-white p-8 shadow-2xl">

              <div className="rounded-3xl bg-slate-900 p-8 text-white">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    Privacy Summary

                  </h3>

                  <Lock className="h-8 w-8 text-green-400" />

                </div>

                <div className="mt-10 space-y-5">

                  <PolicyMetric
                    title="Data Encryption"
                    value="Enabled"
                  />

                  <PolicyMetric
                    title="Tenant Isolation"
                    value="100%"
                  />

                  <PolicyMetric
                    title="Cloud Security"
                    value="Enterprise"

                  />

                  <PolicyMetric
                    title="Privacy Focus"
                    value="GDPR Ready"
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

                  Effective from <strong>July 2026</strong>. This policy
                  applies to all users of KoniqTech's website, CRM platform,
                  customer portal and related services.

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* COMPANY INFORMATION */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-[40px] border bg-white p-12 shadow-sm">

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-green-100 p-5">

                <FileText className="h-10 w-10 text-green-600" />

              </div>

              <div>

                <h2 className="text-4xl font-black text-slate-900">

                  Company Information

                </h2>

                <p className="mt-3 text-lg text-slate-600">

                  Information about the organization responsible for
                  processing your data.

                </p>

              </div>

            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2">

              <InfoCard
                title="Company"

                value="KoniqTech"
              />

              <InfoCard
                title="Website"

                value="https://koniqtech.com"
              />

              <InfoCard
                title="Primary Email"

                value="info@koniqtech.com"
              />

              <InfoCard
                title="Platform"

                value="AI-Powered Field Service CRM"
              />

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* INFORMATION WE COLLECT */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Information We Collect

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Transparency In
              Data Collection

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              We only collect information necessary to provide,
              improve and secure the KoniqTech platform while delivering
              reliable customer support and business services.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {collectedInformation.map((item) => {

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
      {/* HOW WE USE INFORMATION */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-blue-600">

              How We Use Information

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Why We Process
              Your Information

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Information is processed only for legitimate business
              purposes necessary to operate KoniqTech,
              provide customer support,
              improve our platform
              and protect customer accounts.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {informationUsage.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] border bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="w-fit rounded-2xl bg-blue-100 p-4">

                    <Icon className="h-8 w-8 text-blue-600" />

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
      {/* COOKIES */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="grid gap-16 lg:grid-cols-2">

            <div>

              <p className="font-semibold uppercase tracking-widest text-orange-600">

                Cookies & Tracking

              </p>

              <h2 className="mt-4 text-5xl font-black text-slate-900">

                How Cookies
                Help Our Platform

              </h2>

              <p className="mt-8 text-xl leading-9 text-slate-600">

                Cookies improve authentication,
                security,
                preferences,
                performance
                and overall user experience while using KoniqTech.

              </p>

            </div>

            <div className="space-y-5">

              {cookieTypes.map((cookie) => (

                <div
                  key={cookie}
                  className="flex items-center gap-4 rounded-[28px] bg-white p-6 shadow-sm"
                >

                  <CheckCircle2 className="h-6 w-6 text-green-600" />

                  <span className="text-lg font-medium text-slate-700">

                    {cookie}

                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* THIRD-PARTY SERVICES */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Third-Party Services

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Trusted Infrastructure
              Partners

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              KoniqTech works with carefully selected providers to
              securely deliver hosting,
              authentication,
              email,
              storage
              and payment services.

            </p>

          </div>

          <div className="mt-20 overflow-hidden rounded-[36px] border">

            <table className="w-full">

              <thead className="bg-blue-600 text-white">

                <tr>

                  <th className="px-8 py-5 text-left">

                    Service

                  </th>

                  <th className="px-8 py-5 text-left">

                    Purpose

                  </th>

                </tr>

              </thead>

              <tbody>

                {thirdPartyServices.map((item) => (

                  <tr
                    key={item.service}
                    className="border-t"
                  >

                    <td className="px-8 py-6 font-semibold">

                      {item.service}

                    </td>

                    <td className="px-8 py-6 text-slate-600">

                      {item.purpose}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <div className="mt-12 rounded-[36px] bg-green-50 p-10">

            <h3 className="text-3xl font-black text-slate-900">

              Payment Processing

            </h3>

            <p className="mt-6 text-lg leading-8 text-slate-600">

              Subscription payments are securely processed through
              <strong> PayPal Business</strong>.
              KoniqTech does not store full payment card information
              on its own servers.
              Payment information is handled according to PayPal's
              security and compliance standards.

            </p>

          </div>

        </div>

      </section>



            {/* ====================================================== */}
      {/* EMAIL COMMUNICATION */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-white">

            <Mail className="h-14 w-14 text-orange-300" />

            <h2 className="mt-8 text-5xl font-black">

              Email Communications

            </h2>

            <p className="mt-8 text-xl leading-9 text-blue-100">

              We may send account verification emails,
              password reset requests,
              billing notifications,
              security alerts,
              product updates,
              support responses
              and service-related announcements.

            </p>

            <p className="mt-8 text-lg leading-8 text-blue-100">

              Marketing communications are optional and can be
              unsubscribed from at any time.
              Important service and security notifications may still
              be sent when required for your account.

            </p>

          </div>

        </div>

      </section>

             {/* ====================================================== */}
      {/* DATA SECURITY */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Data Security

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Protecting Your
              Information

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              Protecting customer information is one of our highest
              priorities. We implement administrative, technical and
              organizational safeguards to secure personal information
              and business data.

            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">

            {securityMeasures.map((item) => {

              const Icon = item.icon

              return (

                <div
                  key={item.title}
                  className="rounded-[36px] border bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
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
      {/* DATA RETENTION */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-white p-12 shadow-sm">

            <h2 className="text-5xl font-black text-slate-900">

              Data Retention

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">

              We retain information only for as long as necessary to:

            </p>

            <div className="mt-10 space-y-5">

              <div className="flex items-center gap-4">

                <CheckCircle2 className="h-6 w-6 text-green-600" />

                <span className="text-lg text-slate-700">

                  Provide our CRM platform and customer services

                </span>

              </div>

              <div className="flex items-center gap-4">

                <CheckCircle2 className="h-6 w-6 text-green-600" />

                <span className="text-lg text-slate-700">

                  Meet legal and regulatory obligations

                </span>

              </div>

              <div className="flex items-center gap-4">

                <CheckCircle2 className="h-6 w-6 text-green-600" />

                <span className="text-lg text-slate-700">

                  Resolve disputes and enforce agreements

                </span>

              </div>

              <div className="flex items-center gap-4">

                <CheckCircle2 className="h-6 w-6 text-green-600" />

                <span className="text-lg text-slate-700">

                  Maintain secure backups and disaster recovery systems

                </span>

              </div>

            </div>

            <p className="mt-10 text-lg leading-8 text-slate-600">

              When information is no longer required, it is securely
              deleted or anonymized in accordance with our internal
              data retention procedures.

            </p>

          </div>

        </div>

      </section>


             {/* ====================================================== */}
      {/* USER RIGHTS */}
      {/* ====================================================== */}

      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-16 lg:grid-cols-2">

            <div>

              <p className="font-semibold uppercase tracking-widest text-blue-600">

                Your Rights

              </p>

              <h2 className="mt-4 text-5xl font-black text-slate-900">

                You Control
                Your Information

              </h2>

              <p className="mt-8 text-xl leading-9 text-slate-600">

                Depending on your location, including users protected by
                GDPR and similar privacy laws, you may have the following
                rights regarding your personal information.

              </p>

            </div>

            <div className="space-y-5">

              {privacyRights.map((right) => (

                <div
                  key={right}
                  className="flex items-center gap-4 rounded-[28px] border bg-white p-6 shadow-sm"
                >

                  <CheckCircle2 className="h-6 w-6 text-blue-600" />

                  <span className="text-lg font-medium text-slate-700">

                    {right}

                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


              {/* ====================================================== */}
      {/* CHILDREN & INTERNATIONAL */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 lg:grid-cols-2">

            <div className="rounded-[36px] bg-white p-10 shadow-sm">

              <h2 className="text-4xl font-black text-slate-900">

                Children's Privacy

              </h2>

              <p className="mt-8 text-lg leading-8 text-slate-600">

                KoniqTech is intended for businesses and professional users.
                Our services are not directed toward children under the age
                of 13, and we do not knowingly collect personal information
                from children.

              </p>

            </div>

            <div className="rounded-[36px] bg-white p-10 shadow-sm">

              <h2 className="text-4xl font-black text-slate-900">

                International Users

              </h2>

              <p className="mt-8 text-lg leading-8 text-slate-600">

                Customers located outside our hosting regions understand
                that information may be processed using trusted cloud
                infrastructure in accordance with applicable privacy laws
                and appropriate security safeguards.

              </p>

            </div>

          </div>

        </div>

      </section>


             {/* ====================================================== */}
      {/* POLICY UPDATES */}
      {/* ====================================================== */}

      <section className="pb-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="rounded-[40px] bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-white">

            <h2 className="text-5xl font-black">

              Updates To This Policy

            </h2>

            <p className="mt-8 text-xl leading-9 text-blue-100">

              We may update this Privacy Policy periodically to reflect
              changes in our services, legal requirements or security
              practices.

            </p>

            <p className="mt-8 text-lg leading-8 text-blue-100">

              When significant changes are made, we will update the
              effective date on this page and, where appropriate,
              notify customers through the platform or by email.

            </p>

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

                Privacy Questions?

              </h2>

              <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

                If you have questions about this Privacy Policy,
                your personal information,
                or how your data is processed,
                our team is here to help.

              </p>

            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2">

              <InfoCard
                title="Email"
                value="info@koniqtech.com"
              />

              <InfoCard
                title="Website"
                value="https://koniqtech.com"
              />

              <InfoCard
                title="Support"
                value="Monday – Friday"
              />

              <InfoCard
                title="Response Time"
                value="Typically within 1 business day"
              />

            </div>

          </div>

        </div>

      </section>


            {/* ====================================================== */}
      {/* PRIVACY FAQ */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-28">

        <div className="mx-auto max-w-5xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-green-600">

              Privacy FAQ

            </p>

            <h2 className="mt-4 text-5xl font-black text-slate-900">

              Frequently Asked
              Questions

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

              Answers to common questions about privacy,
              security,
              personal information
              and data protection.

            </p>

          </div>

          <div className="mt-20 space-y-8">

            {privacyFaqs.map((faq) => (

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

              This Privacy Policy describes how KoniqTech collects,
              uses,
              stores
              and protects personal information when customers use
              our website,
              AI platform,
              CRM,
              customer portal
              and related services.

            </p>

            <p className="mt-8 text-lg leading-8 text-slate-600">

              This Privacy Policy should be read together with our
              Terms & Conditions,
              Cookie Policy
              and any additional legal notices that may apply to
              specific KoniqTech services.

            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <Link
                href="/terms-and-conditions"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                Terms & Conditions

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

              Your Trust Is
              Important To Us

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

              KoniqTech is committed to protecting your personal
              information and business data with secure infrastructure,
              responsible data practices and continuous platform
              improvements.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/contact"
                className="rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
              >

                Contact Our Team

              </Link>

              <Link
                href="/register"
                className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >

                Start Free Trial

              </Link>

            </div>

          </div>

        </div>

      </section>



       
    </main>

  )

}

function PolicyMetric({
  title,
  value
}:{
  title:string
  value:string
}){

  return(

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

    <div className="rounded-[28px] bg-slate-50 p-8">

      <h3 className="text-lg font-bold text-slate-900">

        {title}

      </h3>

      <p className="mt-3 text-lg text-slate-600">

        {value}

      </p>

    </div>

  )

}